# RadTech3D — Code Summary: Vital Features

> Concise code snippets for each core feature with an explanation of how it operates within the live website.

---

## 1. Session Persistence — Page, Name & Timers

### How it works operationally
When a user navigates to any page or refreshes the browser, the app reads `sessionStorage` on mount to restore the last active page, the player's name (so they don't have to re-enter it), and timer start times (so countdowns continue from where they left off). Everything is scoped to the browser tab — closing the tab wipes all state automatically without any explicit cleanup.

### `src/utils/navigationManager.js`
```js
export const NavigationManager = {
  STORAGE_KEY: 'currentPage',
  VALID_PAGES: ['home', 'model', 'assessment', 'about'],

  initialize() {
    const saved = sessionStorage.getItem(this.STORAGE_KEY);
    const page  = this.VALID_PAGES.includes(saved) ? saved : 'home';
    this.savePage(page);
    return page;                          // returned to useState in App.jsx
  },

  savePage(page) {
    if (this.VALID_PAGES.includes(page))
      sessionStorage.setItem(this.STORAGE_KEY, page);
  },

  // No beforeunload listener needed — sessionStorage clears itself on tab close
  setupCleanup() { return () => {}; }
};
```

### `src/App.jsx` — page + name init from sessionStorage
```js
// Page: restored from sessionStorage on every mount/refresh
const [currentPage, setCurrentPage] = useState(() => NavigationManager.initialize());

// Name: persisted so the player doesn't see the NameGate again on refresh
const [assessmentName, setAssessmentName] = useState(
  () => sessionStorage.getItem('assessmentName') || null
);
```

### `src/App.jsx` — save page + scroll to top on every navigation
```js
useEffect(() => {
  NavigationManager.savePage(currentPage);
  window.scrollTo(0, 0);          // always start at top when changing pages
}, [currentPage]);
```

### `src/features/assessment/AssessmentContent.jsx` — timers persisted on every change
```js
// Timer start timestamps written to sessionStorage whenever they update
useEffect(() => {
  sessionStorage.setItem('sectionStartTimes', JSON.stringify(sectionStartTimes));
}, [sectionStartTimes]);

useEffect(() => {
  sessionStorage.setItem('sectionTimeUsed', JSON.stringify(sectionTimeUsed));
}, [sectionTimeUsed]);

// Timers are initialised from sessionStorage so they survive refresh
const [sectionStartTimes, setSectionStartTimes] = useState(() => {
  try { const s = sessionStorage.getItem('sectionStartTimes'); return s ? JSON.parse(s) : {}; }
  catch { return {}; }
});
```

---

## 2. Name Gate Modal

### How it works operationally
When a user clicks the **Assessment** tab for the first time (or after "Exit & Play Again"), `App.jsx` checks whether `assessmentName` is set. If not, it renders `<NameGate>` instead of `<AssessmentContent>`. The modal blocks all assessment content with a fixed overlay. Once the student submits a valid name, the name is saved to `sessionStorage` and `App.jsx` swaps in the full assessment. A close button (✕) lets the user dismiss the modal and return to Home without entering a name.

### `src/App.jsx` — gate switch
```js
case 'assessment':
  return assessmentName
    ? <AssessmentContent
        playerName={assessmentName}
        onScoreSubmitted={refreshChampion}
        onExit={() => {
          ['assessmentName', 'sectionStartTimes', 'sectionTimeUsed']
            .forEach(k => sessionStorage.removeItem(k));
          setAssessmentName(null);
          setCurrentPage('home');
        }}
      />
    : <NameGate
        onConfirm={name => {
          sessionStorage.setItem('assessmentName', name);
          setAssessmentName(name);
        }}
        onClose={() => setCurrentPage('home')}
      />;
```

### `src/features/assessment/NameGate.jsx`
```jsx
export default function NameGate({ onConfirm, onClose }) {
  const [name, setName]   = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) { setError('Please enter your name to continue.'); return; }
    onConfirm(trimmed);               // bubbles up to App.jsx → saves to sessionStorage
  };

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.72)', zIndex:1000 }}>
      <div style={{ position:'relative', /* modal card styles */ }}>

        {/* Close button — only rendered when onClose prop is provided */}
        {onClose && (
          <button onClick={onClose} style={{ position:'absolute', top:'14px', right:'16px' }}
            aria-label="Close">✕</button>
        )}

        <form onSubmit={handleSubmit}>
          <input value={name} onChange={e => setName(e.target.value)}
            placeholder="Your name" maxLength={40} />
          {error && <p style={{ color:'#f87171' }}>{error}</p>}
          <button type="submit">Start Assessment →</button>
        </form>
      </div>
    </div>
  );
}
```

---

## 3. Score Multipliers & Scoring Algorithm

### How it works operationally
Each assessment section is worth a different number of points per correct answer. When any section is submitted, the raw correct count is multiplied before being added to the running `rawScore`. `totalPossible` is also computed with the same multipliers so the percentage shown in the Results tab is accurate. A separate time bonus (up to 40 pts total) is added based on how much time remained in each section when it was submitted.

### `src/features/assessment/AssessmentContent.jsx`
```js
// ── multiplier constants ──────────────────────────────────────────────────
const SECTION_TIME   = 600;   // 10 minutes per section
const MAX_TIME_BONUS = 40;    // max total time bonus points
const MC_MULT   = 1;          // Multiple Choice  → ×1
const FILL_MULT = 1.5;        // True or False    → ×1.5
const MATC_MULT = 1.5;        // Matching A & B   → ×1.5
const DRAG_MULT = 2;          // Drag & Label     → ×2

// ── per-section correct-answer getters ───────────────────────────────────
const getMCScore    = () => mcQuestions.filter((_,i)  => mcAnswers[i]  === mcQuestions[i].answer).length;
const getFillScore  = () => fillQuestions.filter((_,i) => fillAnswers[i] === fillQuestions[i].answer).length;
const getMatchAScore = () => matchingA.descriptions.filter((_,i) => Number(matchAAnswers[i]) === matchingA.answers[i]).length;
const getMatchBScore = () => matchingB.descriptions.filter((_,i) => Number(matchBAnswers[i]) === matchingB.answers[i]).length;
const getDragScore  = () => dragZones.filter(z => dragAnswers[z.id] === z.answer).length;

// ── weighted raw score (only counts submitted sections) ───────────────────
const rawScore =
  (mcSubmitted     ? getMCScore()     * MC_MULT   : 0) +
  (fillSubmitted   ? getFillScore()   * FILL_MULT : 0) +
  (matchASubmitted ? getMatchAScore() * MATC_MULT : 0) +
  (matchBSubmitted ? getMatchBScore() * MATC_MULT : 0) +
  (dragSubmitted   ? getDragScore()   * DRAG_MULT : 0);

// ── maximum possible score (questions × multipliers + time bonus) ─────────
const totalPossible =
  mcQuestions.length            * MC_MULT   +
  fillQuestions.length          * FILL_MULT +
  matchingA.descriptions.length * MATC_MULT +
  matchingB.descriptions.length * MATC_MULT +
  dragZones.length              * DRAG_MULT +
  MAX_TIME_BONUS;

// ── time bonus: 1 pt per minute remaining per section ────────────────────
const getTimeBonus = () =>
  ['mc', 'fill', 'matching', 'image'].reduce((sum, id) => {
    const used = sectionTimeUsed[id];
    if (used == null) return sum;
    return sum + Math.floor(Math.max(0, SECTION_TIME - used) / 60);
  }, 0);

const timeBonus  = getTimeBonus();
const totalScore = rawScore + timeBonus;
```

---

## 4. Per-Section Countdown Timer

### How it works operationally
Each section tab has its own independent 10-minute timer. The timer starts the **first time** a student visits that tab (not when the assessment loads), by recording `Date.now()` into `sectionStartTimes`. A global `ticker` increments every second, causing re-renders that recompute the remaining time. When a section is submitted, elapsed time is frozen into `sectionTimeUsed` — this is what the time-bonus formula reads. The red "alarm" colour activates when less than 60 seconds remain.

### `src/features/assessment/AssessmentContent.jsx`
```js
// Global 1-second tick to re-render all active timers
useEffect(() => {
  const id = setInterval(() => setTicker(t => t + 1), 1000);
  return () => clearInterval(id);
}, []);

// Record the start timestamp the first time a section is entered
useEffect(() => {
  if (activeSection === 'results') return;
  setSectionStartTimes(prev =>
    prev[activeSection] ? prev : { ...prev, [activeSection]: Date.now() }
  );
}, [activeSection]);

// Compute remaining seconds on every tick
const getRemainingSeconds = (sectionId) => {
  const start = sectionStartTimes[sectionId];
  if (!start) return SECTION_TIME;
  return Math.max(0, SECTION_TIME - (Date.now() - start) / 1000);
};

// Freeze elapsed time on submit (used later for time-bonus calculation)
const recordTime = (sectionId) => {
  setSectionTimeUsed(prev => {
    if (prev[sectionId] != null) return prev;            // already recorded
    const start = sectionStartTimes[sectionId];
    const used  = start
      ? Math.min(SECTION_TIME, (Date.now() - start) / 1000)
      : SECTION_TIME;
    return { ...prev, [sectionId]: used };
  });
};

// Timer badge rendered in each section tab header
const timerBadge = (sid, submitted) => {
  if (submitted) return null;
  const sec     = getRemainingSeconds(sid);
  const isAlarm = sec < 60;                              // red when < 1 minute
  return (
    <span style={{
      background: isAlarm ? '#7f1d1d' : '#1f2937',
      color:      isAlarm ? '#fca5a5' : '#9ca3af',
      border:    `1px solid ${isAlarm ? '#ef4444' : '#374151'}`,
    }}>
      ⏱ {sec > 0 ? formatTime(sec) : "Time's Up!"}
    </span>
  );
};
```

---

## 5. Auto-Submit Score on Results Tab

### How it works operationally
When the student switches to the **Results** tab, a `useEffect` fires exactly once (guarded by `scoreSubmitted`) and calls `handleSubmitScore()`. This function POSTs the full score payload — player name, raw score, time bonus, final score, total possible, and per-section breakdowns — to `/api/scores`. After a successful save, it calls `onScoreSubmitted()` which triggers `refreshChampion()` in `App.jsx` so the high-score banner updates immediately if the player beat the previous champion. The leaderboard is also fetched in the same function.

### `src/features/assessment/AssessmentContent.jsx`
```js
// Triggered automatically the moment the Results tab is opened
useEffect(() => {
  if (activeSection !== 'results') return;
  handleSubmitScore();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [activeSection]);

const handleSubmitScore = async () => {
  if (scoreSubmitting || scoreSubmitted) return;   // run once
  setScoreSubmitting(true);
  try {
    const result = await submitScore({
      name:          playerName,
      rawScore,
      timeBonus,
      finalScore:    totalScore,
      totalPossible,
      sections: {
        mc:       { score: getMCScore(),                        timeUsed: sectionTimeUsed.mc       ?? null },
        tf:       { score: getFillScore(),                      timeUsed: sectionTimeUsed.fill     ?? null },
        matching: { score: getMatchAScore() + getMatchBScore(), timeUsed: sectionTimeUsed.matching ?? null },
        drag:     { score: getDragScore(),                      timeUsed: sectionTimeUsed.image    ?? null },
      },
    });
    setScoreResult(result);
    setScoreSubmitted(true);
    onScoreSubmitted?.();      // notifies App.jsx → refreshChampion()
  } catch (err) {
    console.error('Score submission error:', err);
  }
  setScoreSubmitting(false);
};
```

---

## 6. Score API — Serverless Function

### How it works operationally
`api/scores.js` is a Vercel serverless function. On **POST**, it inserts a new score document then immediately computes the percentage of players the submitter beat — this is returned to the client and shown in the high-score banner. On **GET** with `?action=champion` it returns only the top scorer (used for banner polling). A plain **GET** returns the top 10 for the leaderboard table. `dbConnect()` checks if Mongoose is already connected before attempting a new connection — critical for serverless environments where function instances are reused.

### `api/scores.js`
```js
// Reuse existing connection across warm serverless invocations
async function dbConnect() {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(process.env.MONGODB_URI, {
    bufferCommands: false,
    serverSelectionTimeoutMS: 5000,
  });
}

export default async function handler(req, res) {
  await dbConnect();

  // POST — save score, return % beaten
  if (req.method === 'POST') {
    const doc    = await Score.create(req.body);
    const total  = await Score.countDocuments();
    const beaten = await Score.countDocuments({ finalScore: { $lt: doc.finalScore } });
    const pct    = total > 1 ? Math.round((beaten / (total - 1)) * 100) : 100;
    return res.status(201).json({ doc, pct, totalCount: total });
  }

  // GET ?action=champion — top scorer for banner
  if (req.method === 'GET' && req.query.action === 'champion') {
    const top    = await Score.findOne().sort({ finalScore: -1 }).lean();
    const beaten = await Score.countDocuments({ finalScore: { $lt: top.finalScore } });
    const pct    = Math.round((beaten / (total - 1)) * 100);
    return res.json({ ...top, pct });
  }

  // GET — top-10 leaderboard
  const scores = await Score.find().sort({ finalScore: -1 }).limit(10).lean();
  return res.json(scores);
}
```

---

## 7. Score Service — Frontend API Client

### How it works operationally
`scoreService.js` is the single place all API calls are made from. Every function uses the `/api/scores` path — in production this resolves to the Vercel serverless function; in development, Vite's proxy forwards it to `http://localhost:5000` (Express). All functions are safe to call when the server is offline: `getChampion` and `getLeaderboard` return `null` / `[]` on any error, preventing the UI from crashing.

### `src/services/scoreService.js`
```js
const BASE = '/api/scores';

// Called by AssessmentContent when Results tab opens
export async function submitScore(data) {
  const res = await fetch(BASE, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// Called by App.jsx on mount and every 30 s for banner
export async function getChampion() {
  try {
    const res = await fetch(`${BASE}?action=champion`);
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }          // silently fails when server is offline
}

// Called by AssessmentContent to populate leaderboard table
export async function getLeaderboard() {
  try {
    const res = await fetch(BASE);
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}
```

---

## 8. High-Score Banner & Champion Polling

### How it works operationally
On every app load, `App.jsx` calls `refreshChampion()` once. If a record comes back, `hasRecords` is set to `true` which starts a 30-second polling interval. Each poll checks if the top score has changed — only if it has does the banner become visible. The banner auto-dismisses after 5 seconds via a `useRef`-based timer reset on each champion update. This design means the banner never interrupts users with repeated pops if the score hasn't changed, and the interval is only created after there's actually data to show.

### `src/App.jsx` — polling logic
```js
const refreshChampion = useCallback(async () => {
  const data = await getChampion();
  if (!data) return;
  setHasRecords(true);                                  // starts interval below
  setChampion(prev => {
    const isNew = !prev
      || data.finalScore > prev.finalScore
      || data.name !== prev.name;
    if (isNew) setBannerVisible(true);                  // only show on change
    return isNew ? data : prev;
  });
}, []);

useEffect(() => { refreshChampion(); }, [refreshChampion]);  // on mount

useEffect(() => {
  if (!hasRecords) return;                              // wait for first record
  const id = setInterval(refreshChampion, 30000);      // poll every 30 s
  return () => clearInterval(id);
}, [hasRecords, refreshChampion]);

// Rendered above <main> when visible
{bannerVisible && (
  <HighScoreBanner champion={champion} onDismiss={() => setBannerVisible(false)} />
)}
```

### `src/shared/components/HighScoreBanner.jsx` — auto-dismiss
```jsx
export default function HighScoreBanner({ champion, onDismiss }) {
  const timerRef = useRef(null);

  // Reset 5-second dismiss timer whenever champion changes
  useEffect(() => {
    if (!champion) return;
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => onDismiss(), 5000);
    return () => clearTimeout(timerRef.current);
  }, [champion, onDismiss]);

  if (!champion) return null;

  return (
    <div style={{ position:'fixed', top:'76px', left:'50%', transform:'translateX(-50%)',
      animation:'hsSlideIn 0.35s ease', zIndex:9999 }}>
      🏆 <strong>{champion.name}</strong> scored{' '}
      <strong>{champion.finalScore}/{champion.totalPossible}</strong>
      {champion.pct > 0 && <>, beating <strong>{champion.pct}%</strong> of all players</>}!
      <button onClick={onDismiss}>×</button>
    </div>
  );
}
```

---

## 9. Exit & Play Again — Full Session Reset

### How it works operationally
When the student clicks "Exit & Play Again" in the Results tab, `onExit()` is called in `App.jsx`. It removes all three assessment-related `sessionStorage` keys in one pass, clears `assessmentName` state (which causes `App.jsx` to render `<NameGate>` on the next assessment visit), and navigates back to Home. This ensures the next person on the same device starts completely fresh with no leftover timers or name.

### `src/App.jsx` — onExit handler passed to AssessmentContent
```js
onExit={() => {
  // Wipe all assessment session keys in one pass
  ['assessmentName', 'sectionStartTimes', 'sectionTimeUsed']
    .forEach(k => sessionStorage.removeItem(k));

  setAssessmentName(null);    // re-shows NameGate on next assessment visit
  setCurrentPage('home');     // navigate back to Home
}}
```

---

*RadTech3D — Code Summary generated April 2026*
