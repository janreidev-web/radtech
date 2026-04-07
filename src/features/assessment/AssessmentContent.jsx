import React, { useState, useEffect } from 'react';
import { submitScore, getLeaderboard } from '../../services/scoreService';
import './AssessmentContent.css';

// ── Section 1: Multiple Choice ──────────────────────────────────────────────
const mcQuestions = [
  { id:1,  question:'In the AP Open-Mouth (Albers-Schönberg & George Method) projection, the central ray direction is:', options:['15–20° cephalad','15–20° caudad','Perpendicular (90°)','Horizontal'], answer:2 },
  { id:2,  question:'The AP Open-Mouth projection is primarily used to demonstrate:', options:['C3–T2 vertebral bodies','Atlas (C1) and Axis (C2)','Cervicothoracic junction (C7–T1)','Intervertebral foramina of C4–C7'], answer:1 },
  { id:3,  question:'For the Lateral projection of Atlas & Axis (supine/dorsal decubitus), the reference point is:', options:['C4','Midpoint of the open mouth','1 inch distal to mastoid tip','C7 spinous process'], answer:2 },
  { id:4,  question:'The AP Axial Cervical Projection uses a central ray angle of:', options:['Perpendicular','15–20° caudad','15–20° cephalad','25° caudad'], answer:2 },
  { id:5,  question:'The AP Axial Cervical Projection best demonstrates which vertebral levels?', options:['C1–C2 only','C3–T2','T1–T12','L1–L5'], answer:1 },
  { id:6,  question:'The Grandy Method (Lateral Cervical Projection) uses a central ray directed:', options:['15° cephalad','25° caudad','Horizontal','Perpendicular'], answer:2 },
  { id:7,  question:'In the AP Axial Oblique Projection (Barsony & Koppenstein), the body is rotated:', options:['15°','30°','45°','60°'], answer:2 },
  { id:8,  question:'The AP Axial Oblique Projection demonstrates the intervertebral foramina and pedicles of:', options:['The side closest to the IR','The side farthest from the IR','Both sides simultaneously','The posterior elements only'], answer:1 },
  { id:9,  question:'For the PA Axial Oblique Projection (RAO/LAO), the central ray is directed:', options:['15–20° cephalad','15–20° caudad','Perpendicular','Horizontal'], answer:1 },
  { id:10, question:'In the Ottonello (Chewing/Wagging Jaw) Method, the mandible is:', options:['Held completely still','In a chewing motion during exposure','Pressed firmly against the IR','Elevated with a sponge'], answer:1 },
  { id:11, question:'For the Vertebral Arch AP Axial Projection (supine, neck hyperextended), the CR is directed:', options:['25° caudad to C7','40° cephalad to C7','15–20° cephalad to C4','Horizontal to C4'], answer:0 },
  { id:12, question:'For the Vertebral Arch PA Axial Projection (prone), the CR is directed:', options:['25° caudad to C7','35° cephalad to C7','40° cephalad to C7','Horizontal to C4'], answer:2 },
  { id:13, question:"In the Twinning Method (Swimmer's View), the arm closest to the IR is:", options:['Pulled down along the side','Extended overhead; elbow flexed; forearm rested on head','Held at a 90° angle from the body','Crossed over the chest'], answer:1 },
  { id:14, question:"The Swimmer's Technique (Twinning & Pawlow) is performed when:", options:['The patient cannot open the mouth','Shoulder superimposition obscures C7 on a lateral cervical radiograph','The AP projection fails to show C3–T2','Scoliosis prevents standard positioning'], answer:1 },
  { id:15, question:'Pancoast, Pendergrass & Schaeffer recommended slight head rotation in the Lateral Atlas & Axis projection to:', options:['Open the intervertebral foramina','Extend the cervical spine further','Prevent superimposition of the laminae of the atlas','Blur the mandibular shadow'], answer:2 },
];

// ── Section 2: True or False ────────────────────────────────────────────────
const fillQuestions = [
  { id:1,  statement:'In the AP Open-Mouth projection, the patient opens the mouth as wide as possible.',                                                           answer:true  },
  { id:2,  statement:'The Lateral projection of Atlas & Axis is performed with the IR vertical and the MSP parallel to the IR.',                                    answer:true  },
  { id:3,  statement:'The AP Axial Cervical Projection uses a 15–20° caudad central ray.',                                                                          answer:false },
  { id:4,  statement:'The Grandy Method (Lateral Cervical Projection) demonstrates C1–C7 including articular pillars and zygapophyseal joints (C3–C7).',            answer:true  },
  { id:5,  statement:'In Hyperflexion, the spinous processes are elevated and widely separated.',                                                                   answer:true  },
  { id:6,  statement:'In Hyperextension, the spinous processes are elevated.',                                                                                      answer:false },
  { id:7,  statement:'The Ottonello Method uses a breathing technique (similar to ribs) to blur the mandible.',                                                     answer:false },
  { id:8,  statement:'The AP Axial Oblique Projection (RPO/LPO) demonstrates the intervertebral foramina on the side farthest from the IR.',                        answer:true  },
  { id:9,  statement:'The PA Axial Oblique Projection (RAO/LAO) uses a 15–20° caudad central ray.',                                                                 answer:true  },
  { id:10, statement:'For the Vertebral Arch AP Axial Projection (supine), the CR is directed 25° caudad to C7.',                                                   answer:true  },
  { id:11, statement:'The Vertebral Arch AP Axial Oblique Projection uses head rotations of 45–50° for C2–C7 articular processes.',                                 answer:true  },
  { id:12, statement:"The Twinning Method is performed with the patient in a recumbent (lying) lateral position.",                                                   answer:false },
  { id:13, statement:"The Pawlow Method is performed with the patient in a lateral recumbent position with the head elevated on the patient's arm.",                 answer:true  },
  { id:14, statement:"In the Swimmer's Technique, the CR is perpendicular, or 3–5° caudad if the shoulder cannot be depressed sufficiently.",                       answer:true  },
  { id:15, statement:'The Vertebral Arch AP Axial Projection is useful for demonstrating cervicothoracic spinous processes in patients with whiplash injury.',       answer:true  },
];

// ── Section 3A: Matching – Projections & Central Ray ────────────────────────
const matchingA = {
  terms: ['AP Open-Mouth Projection','AP Axial Cervical Projection','Grandy Method (Lateral)','AP Axial Oblique Projection','Vertebral Arch AP Axial (Supine)'],
  descriptions: [
    'CR perpendicular; RP: midpoint of open mouth; MSP perpendicular to IR; demonstrates Atlas and Axis.',
    'CR 15–20° cephalad; RP: C4; chin extended; demonstrates C3–T2, interpediculate spaces, and IVD spaces.',
    'CR horizontal; RP: C4; patient seated/upright in true lateral position; demonstrates C1–C7, articular pillars, and zygapophyseal joints.',
    'Body rotated 45°; CR 15–20° cephalad; RP: C4; RPO/LPO; demonstrates IVF and pedicles farthest from IR.',
    'CR 25° caudad (range 20–30°); RP: C7; patient supine with neck hyperextended; demonstrates vertebral arch structures and laminae.',
  ],
  answers: [0,1,2,3,4],
};

// ── Section 3B: Matching – Positioning Methods ──────────────────────────────
const matchingB = {
  terms: ["Twinning Method (Swimmer's)","Pawlow Method (Swimmer's)",'Ottonello / Chewing Jaw Method','Hyperflexion Lateral','Hyperextension Lateral'],
  descriptions: [
    'Patient upright lateral; arm closest to IR extended overhead with elbow flexed and forearm rested on head; CR perpendicular or 3–5° caudad; demonstrates C7–T1.',
    'Patient in lateral recumbent position on the table; head elevated on arm; breathing technique used; demonstrates cervicothoracic region (C7–T1).',
    'Patient supine; MSP perpendicular; mandible in chewing motion during exposure; CR perpendicular to C4; blurs mandibular shadow to show entire cervical column.',
    'Patient seated/upright lateral; head dropped forward with chin drawn as close to chest as possible; demonstrates C1–C7 with elevated and widely separated spinous processes.',
    'Patient seated/upright lateral; chin elevated as much as possible; demonstrates C1–C7 with depressed spinous processes; used for functional motility studies.',
  ],
  answers: [0,1,2,3,4],
};

// ── Section 4: Drag & Label (callout connectors) ──────────────────────────
// dotX/dotY → red anchor on anatomy (% of image)
// boxX/boxY → label drop box centre (% of image)
// boxHW = half-width of box in same % units (≈150px/425px×100 ≈ 17.5)
const BOX_HW  = 17;  // half-width of label box in SVG % units
const TICK_LEN = 2;   // bracket tick length toward spine
// Per-zone accent colours [border, dark-bg]
const ZONE_COLORS = [
  { stroke:'#a78bfa', bg:'rgba(46,16,101,0.93)'  },  // id:0 violet
  { stroke:'#38bdf8', bg:'rgba(8,47,73,0.93)'    },  // id:1 sky-blue
  { stroke:'#2dd4bf', bg:'rgba(19,78,74,0.93)'   },  // id:2 teal
  { stroke:'#fb923c', bg:'rgba(67,20,7,0.93)'    },  // id:3 orange
  { stroke:'#f472b6', bg:'rgba(80,7,36,0.93)'    },  // id:4 rose
  { stroke:'#84cc16', bg:'rgba(26,46,5,0.93)'    },  // id:5 lime
  { stroke:'#f59e0b', bg:'rgba(69,26,3,0.93)'    },  // id:6 amber
  { stroke:'#6366f1', bg:'rgba(30,27,75,0.93)'   },  // id:7 indigo
  { stroke:'#06b6d4', bg:'rgba(8,51,68,0.93)'    },  // id:8 cyan
  { stroke:'#10b981', bg:'rgba(6,46,45,0.93)'    },  // id:9 emerald
  { stroke:'#f97316', bg:'rgba(67,20,7,0.93)'    },  // id:10 red-orange
];
const dragZones = [
  // type:'point'   → dotX/dotY = red anchor on anatomy
  // type:'bracket' → bracketX = vertical bar x, topY/botY = span
  { id:0,  type:'point',   dotX:49,   dotY:13.6,                                                                                                      boxX:20, boxY: 7,  side:'left',  answer:'Atlas (C1)' },
  { id:1,  type:'point',   dotX:50,   dotY:14.8,                                                                                                      boxX:80, boxY:12,  side:'right', answer:'Axis (C2)' },
  { id:2,  type:'bracket', bracketX:48, topY:12.5, botY:24,                                                                                           boxX:20, boxY:22,  side:'left',  answer:'Cervical Spine (C1\u2013C7)' },
  { id:3,  type:'bracket', bracketX:50, topY:23.8, botY:57,                                                                                           boxX:80, boxY:30,  side:'right', answer:'Thoracic Spine (T1\u2013T12)' },
  { id:4,  type:'bracket', bracketX:48, topY:21.2, botY:24.4,                                                                                         boxX:20, boxY:37,  side:'left',  answer:'Cervicothoracic Junction (C7\u2013T1)' },
  { id:5,  type:'bracket', bracketX:52, topY:57.3, botY:72.5,                                                                                         boxX:80, boxY:50,  side:'right', answer:'Lumbar Spine (L1\u2013L5)' },
  { id:6,  type:'bracket', bracketX:47, topY:73.8, botY:81.7,                                                                                         boxX:20, boxY:52,  side:'left',  answer:'Sacrum' },
  { id:7,  type:'bracket', bracketX:52, topY:83.4, botY:87.1,                                                                                         boxX:80, boxY:67,  side:'right', answer:'Coccyx' },
  { id:8,  type:'point',   dots:[{x:48.7,y:26.1},{x:49,y:30.4},{x:49.4,y:34.9},{x:49.2,y:39.1},{x:49.4,y:43},{x:49.4,y:48.4},{x:49.2,y:53.3}],      boxX:20, boxY:65,  side:'left',  answer:'Spinous Process' },
  { id:9,  type:'point',   dots:[{x:53,y:29.4},{x:53.5,y:31.7},{x:53.7,y:34.5},{x:53.2,y:37.7}],                                                     boxX:80, boxY:83,  side:'right', answer:'Transverse Process' },
  { id:10, type:'point',   dots:[{x:49,y:28.9},{x:49,y:33.8},{x:49,y:31.3},{x:49,y:37.1}],                                                   boxX:20, boxY:78,  side:'left',  answer:'Intervertebral Disk' },
];

const dragLabels = [
  'Axis (C2)',
  'Cervicothoracic Junction (C7–T1)',
  'Atlas (C1)',
  'Thoracic Spine (T1–T12)',
  'Cervical Spine (C1–C7)',
  'Lumbar Spine (L1–L5)',
  'Sacrum',
  'Coccyx',
  'Spinous Process',
  'Transverse Process',
  'Intervertebral Disk',
];

const LABELS = ['A','B','C','D'];

const AssessmentContent = ({ playerName, onScoreSubmitted, onExit }) => {
  const [activeSection, setActiveSection] = useState('mc');
  // Multiple Choice
  const [mcAnswers, setMcAnswers] = useState({});
  const [mcSubmitted, setMcSubmitted] = useState(false);
  // Fill in Blanks
  const [fillAnswers, setFillAnswers] = useState({});
  const [fillSubmitted, setFillSubmitted] = useState(false);
  // Matching A
  const [matchAAnswers, setMatchAAnswers] = useState({});
  const [matchASubmitted, setMatchASubmitted] = useState(false);
  // Matching B
  const [matchBAnswers, setMatchBAnswers] = useState({});
  const [matchBSubmitted, setMatchBSubmitted] = useState(false);
  // Drag & Label
  const [dragging,      setDragging]      = useState(null);
  const [dragAnswers,   setDragAnswers]   = useState({});
  const [dragSubmitted, setDragSubmitted] = useState(false);
  // Timers – 10 min per section
  const SECTION_TIME   = 600;
  const MAX_TIME_BONUS = 40;
  const MC_MULT   = 1;
  const FILL_MULT = 1.5;
  const MATC_MULT = 1.5;
  const DRAG_MULT = 2;
  const [sectionStartTimes, setSectionStartTimes] = useState(() => {
    try { const s = sessionStorage.getItem('sectionStartTimes'); return s ? JSON.parse(s) : {}; } catch { return {}; }
  });
  const [sectionTimeUsed,   setSectionTimeUsed]   = useState(() => {
    try { const s = sessionStorage.getItem('sectionTimeUsed');   return s ? JSON.parse(s) : {}; } catch { return {}; }
  });
  const [ticker,            setTicker]            = useState(0);
  // Score submission
  const [scoreSubmitted,  setScoreSubmitted]  = useState(false);
  const [scoreSubmitting, setScoreSubmitting] = useState(false);
  const [scoreResult,     setScoreResult]     = useState(null);
  const [leaderboard,     setLeaderboard]     = useState([]);

  const getMCScore  = () => mcQuestions.filter((_,i) => mcAnswers[i] === mcQuestions[i].answer).length;
  const getFillScore = () => fillQuestions.filter((_,i) => fillAnswers[i] === fillQuestions[i].answer).length;
  const getMatchAScore = () => matchingA.descriptions.filter((_,i) => Number(matchAAnswers[i]) === matchingA.answers[i]).length;
  const getMatchBScore = () => matchingB.descriptions.filter((_,i) => Number(matchBAnswers[i]) === matchingB.answers[i]).length;
  const getDragScore = () => dragZones.filter(z => dragAnswers[z.id] === z.answer).length;

  const rawScore      =
    (mcSubmitted     ? getMCScore()     * MC_MULT   : 0) +
    (fillSubmitted   ? getFillScore()   * FILL_MULT : 0) +
    (matchASubmitted ? getMatchAScore() * MATC_MULT : 0) +
    (matchBSubmitted ? getMatchBScore() * MATC_MULT : 0) +
    (dragSubmitted   ? getDragScore()   * DRAG_MULT : 0);
  const totalPossible =
    mcQuestions.length            * MC_MULT   +
    fillQuestions.length          * FILL_MULT +
    matchingA.descriptions.length * MATC_MULT +
    matchingB.descriptions.length * MATC_MULT +
    dragZones.length              * DRAG_MULT +
    MAX_TIME_BONUS;

  const recordTime = (sectionId) => {
    setSectionTimeUsed(prev => {
      if (prev[sectionId] != null) return prev;
      const start = sectionStartTimes[sectionId];
      const used  = start ? Math.min(SECTION_TIME, (Date.now() - start) / 1000) : SECTION_TIME;
      return { ...prev, [sectionId]: used };
    });
  };
  const getTimeBonus = () =>
    ['mc', 'fill', 'matching', 'image'].reduce((sum, id) => {
      const used = sectionTimeUsed[id];
      if (used == null) return sum;
      return sum + Math.floor(Math.max(0, SECTION_TIME - used) / 60);
    }, 0);
  const timeBonus  = getTimeBonus();
  const totalScore = rawScore + timeBonus;

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };
  const getRemainingSeconds = (sectionId) => {
    const start = sectionStartTimes[sectionId];
    if (!start) return SECTION_TIME;
    return Math.max(0, SECTION_TIME - (Date.now() - start) / 1000);
  };
  const timerBadge = (sid, submitted) => {
    if (submitted) return null;
    const sec     = getRemainingSeconds(sid);
    const isAlarm = sec < 60;
    return (
      <span style={{
        padding: '3px 10px', borderRadius: '99px', fontSize: '12px', fontWeight: '700',
        background: isAlarm ? '#7f1d1d' : '#1f2937',
        color: isAlarm ? '#fca5a5' : '#9ca3af',
        border: `1px solid ${isAlarm ? '#ef4444' : '#374151'}`,
      }}>
        ⏱ {sec > 0 ? formatTime(sec) : "Time's Up!"}
      </span>
    );
  };

  const getRating = (score, total) => {
    const pct = score / total;
    if (pct >= 0.9) return { label: 'Excellent', color: '#16a34a' };
    if (pct >= 0.75) return { label: 'Good', color: '#2563eb' };
    if (pct >= 0.5) return { label: 'Satisfactory', color: '#d97706' };
    return { label: 'Needs Review', color: '#dc2626' };
  };

  const tabs = [
    { id: 'mc',       label: 'Multiple Choice',    count: mcQuestions.length },
    { id: 'fill',     label: 'True or False',       count: fillQuestions.length },
    { id: 'matching', label: 'Matching',            count: matchingA.descriptions.length + matchingB.descriptions.length },
    { id: 'image',    label: 'Drag & Label',        count: dragZones.length },
    { id: 'results',  label: 'Results',             count: null },
  ];

  // ── drag helpers ─────────────────────────────────────────────────────────
  // Shuffle zone order once on mount so each session starts from a random zone
  const [zoneOrder] = useState(() => {
    const ids = dragZones.map(z => z.id);
    for (let i = ids.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [ids[i], ids[j]] = [ids[j], ids[i]];
    }
    return ids;
  });

  // Sequential reveal: zone at position p is visible only if all zones before p are answered
  const firstUnansweredPos = zoneOrder.findIndex(id => dragAnswers[id] === undefined);
  const visibleUpToPos     = firstUnansweredPos === -1 ? zoneOrder.length - 1 : firstUnansweredPos;
  const isZoneVisible      = (id) => zoneOrder.indexOf(id) <= visibleUpToPos;

  const placedLabels = new Set(Object.values(dragAnswers));
  const poolLabels   = dragLabels.filter(l => !placedLabels.has(l));

  const handleDragStart = (label, from) => setDragging({ label, from });

  const handleDropOnZone = (zoneId) => {
    if (!dragging || dragSubmitted) return;
    const prev = dragAnswers[zoneId];
    const next = { ...dragAnswers, [zoneId]: dragging.label };
    if (typeof dragging.from === 'number' && dragging.from !== zoneId) {
      if (prev) { next[dragging.from] = prev; } else { delete next[dragging.from]; }
    }
    setDragAnswers(next);
    setDragging(null);
  };

  const handleDropOnPool = (e) => {
    e.preventDefault();
    if (!dragging || dragging.from === 'pool' || dragSubmitted) return;
    const fromPos = zoneOrder.indexOf(dragging.from);
    const next = { ...dragAnswers };
    // Cascade: clear this zone and all subsequent ones in shuffled order
    zoneOrder.slice(fromPos).forEach(id => { delete next[id]; });
    setDragAnswers(next);
    setDragging(null);
  };

  // ── helpers ──────────────────────────────────────────────────────────────
  const optionStyle = (selected, correct, submitted, idx, answer) => {
    if (!submitted) return selected === idx ? { background: '#1e3a5f', borderColor: '#3b82f6', color: '#bfdbfe' } : {};
    if (idx === answer) return { background: '#064e3b', borderColor: '#10b981', color: '#a7f3d0' };
    if (selected === idx) return { background: '#7f1d1d', borderColor: '#ef4444', color: '#fecaca' };
    return {};
  };

  useEffect(() => {
    const id = setInterval(() => setTicker(t => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (activeSection === 'results') return;
    setSectionStartTimes(prev =>
      prev[activeSection] ? prev : { ...prev, [activeSection]: Date.now() }
    );
  }, [activeSection]);

  useEffect(() => {
    sessionStorage.setItem('sectionStartTimes', JSON.stringify(sectionStartTimes));
  }, [sectionStartTimes]);

  useEffect(() => {
    sessionStorage.setItem('sectionTimeUsed', JSON.stringify(sectionTimeUsed));
  }, [sectionTimeUsed]);

  const handleSubmitScore = async () => {
    if (scoreSubmitting || scoreSubmitted) return;
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
      onScoreSubmitted?.();
    } catch (err) {
      console.error('Score submission error:', err);
    }
    setScoreSubmitting(false);
  };

  useEffect(() => {
    if (activeSection !== 'results') return;
    handleSubmitScore();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSection]);

  useEffect(() => {
    if (activeSection !== 'results') return;
    getLeaderboard().then(data => setLeaderboard(data || []));
  }, [activeSection, scoreSubmitted]);

  return (
    <div className="assessment-container">
      <div className="assessment-header">
        <h1>Spine Radiography Assessment</h1>
        <p>Challenges of Radiologic Technologists in Performing Spine Radiography</p>
      </div>

      {/* Tab Navigation */}
      <div className="section-tabs" style={{ flexWrap: 'wrap', gap: '6px' }}>
        {tabs.map(t => (
          <button key={t.id} className={`tab-button ${activeSection === t.id ? 'active' : ''}`} onClick={() => setActiveSection(t.id)}>
            {t.label}{t.count !== null ? ` (${t.count})` : ''}
          </button>
        ))}
      </div>

      <div className="content-area">

        {/* ── SECTION 1: Multiple Choice ────────────────────────────────────── */}
        {activeSection === 'mc' && (
          <div className="practice-section">
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'12px' }}>
              <h2 style={{ margin:0 }}>Multiple Choice</h2>
              <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                {timerBadge('mc', mcSubmitted)}
                {mcSubmitted && <span style={{ color: getMCScore() >= 7 ? '#10b981' : '#f87171', fontWeight:'bold' }}>{getMCScore()} / {mcQuestions.length}</span>}
              </div>
            </div>
            {mcQuestions.map((q, qi) => (
              <div key={qi} className="question-card" style={{ marginBottom:'16px' }}>
                <p style={{ fontWeight:'600', marginBottom:'10px' }}>{qi + 1}. {q.question}</p>
                <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
                  {q.options.map((opt, oi) => (
                    <label key={oi} style={{
                      display:'flex', alignItems:'center', gap:'10px', padding:'10px 14px',
                      border: '2px solid #e2e8f0', borderRadius:'8px', cursor: mcSubmitted ? 'default' : 'pointer',
                      ...optionStyle(mcAnswers[qi], true, mcSubmitted, oi, q.answer)
                    }}>
                      <input type="radio" name={`mc-${qi}`} disabled={mcSubmitted}
                        checked={mcAnswers[qi] === oi}
                        onChange={() => setMcAnswers(prev => ({ ...prev, [qi]: oi }))}
                        style={{ accentColor: '#3b82f6' }} />
                      <span><strong>{LABELS[oi]}.</strong> {opt}</span>
                      {mcSubmitted && oi === q.answer && <span style={{ marginLeft:'auto', color:'#16a34a', fontWeight:'bold' }}>✓</span>}
                      {mcSubmitted && mcAnswers[qi] === oi && oi !== q.answer && <span style={{ marginLeft:'auto', color:'#dc2626', fontWeight:'bold' }}>✗</span>}
                    </label>
                  ))}
                </div>
              </div>
            ))}
            {!mcSubmitted ? (
              <button className="submit-btn" onClick={() => { recordTime('mc'); setMcSubmitted(true); }}>Submit Answers</button>
            ) : (
              <div style={{ background:'#064e3b', border:'1px solid #10b981', borderRadius:'10px', padding:'14px', textAlign:'center', color:'#a7f3d0' }}>
                Score: <strong>{getMCScore()} / {mcQuestions.length}</strong> — {getRating(getMCScore(), mcQuestions.length).label}
              </div>
            )}
          </div>
        )}

        {/* ── SECTION 2: True or False ─────────────────────────────────────── */}
        {activeSection === 'fill' && (
          <div className="practice-section">
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'12px' }}>
              <h2 style={{ margin:0 }}>True or False</h2>
              <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                {timerBadge('fill', fillSubmitted)}
                {fillSubmitted && <span style={{ color: getFillScore() >= 10 ? '#10b981' : '#f87171', fontWeight:'bold' }}>{getFillScore()} / {fillQuestions.length}</span>}
              </div>
            </div>
            <p style={{ color:'#64748b', fontSize:'13px', marginBottom:'16px' }}>Read each statement and select True or False.</p>
            {fillQuestions.map((q, qi) => {
              const chosen    = fillAnswers[qi];
              const isCorrect = fillSubmitted && chosen === q.answer;
              const isWrong   = fillSubmitted && chosen !== undefined && chosen !== q.answer;
              return (
                <div key={qi} className="question-card" style={{
                  marginBottom:'12px',
                  border: fillSubmitted ? `1.5px solid ${isCorrect ? '#10b981' : isWrong ? '#ef4444' : '#374151'}` : '1.5px solid #374151',
                  background: fillSubmitted ? (isCorrect ? 'rgba(6,78,59,0.35)' : isWrong ? 'rgba(127,29,29,0.35)' : undefined) : undefined,
                }}>
                  <p style={{ fontWeight:'500', marginBottom:'10px' }}>{qi + 1}. {q.statement}</p>
                  <div style={{ display:'flex', gap:'10px' }}>
                    {[true, false].map(val => {
                      const isSelected = chosen === val;
                      const btnCorrect = fillSubmitted && val === q.answer;
                      const btnWrong   = fillSubmitted && isSelected && val !== q.answer;
                      return (
                        <button key={String(val)}
                          disabled={fillSubmitted}
                          onClick={() => setFillAnswers(prev => ({ ...prev, [qi]: val }))}
                          style={{
                            padding:'7px 22px', borderRadius:'7px', fontWeight:'700', fontSize:'13px',
                            cursor: fillSubmitted ? 'default' : 'pointer',
                            border: `2px solid ${
                              btnCorrect ? '#10b981' : btnWrong ? '#ef4444' : isSelected ? '#3b82f6' : '#374151'
                            }`,
                            background: btnCorrect ? '#064e3b' : btnWrong ? '#7f1d1d' : isSelected ? '#1e3a5f' : '#1f2937',
                            color: btnCorrect ? '#a7f3d0' : btnWrong ? '#fecaca' : isSelected ? '#bfdbfe' : '#9ca3af',
                          }}>
                          {val ? 'True' : 'False'}
                        </button>
                      );
                    })}
                    {isWrong && (
                      <span style={{ alignSelf:'center', fontSize:'12px', color:'#10b981', fontWeight:'600' }}>
                        ✓ {q.answer ? 'True' : 'False'}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
            {!fillSubmitted ? (
              <button className="submit-btn" onClick={() => { recordTime('fill'); setFillSubmitted(true); }}>Submit Answers</button>
            ) : (
              <div style={{ background:'#064e3b', border:'1px solid #10b981', borderRadius:'10px', padding:'14px', textAlign:'center', color:'#a7f3d0' }}>
                Score: <strong>{getFillScore()} / {fillQuestions.length}</strong> — {getRating(getFillScore(), fillQuestions.length).label}
              </div>
            )}
          </div>
        )}

        {/* ── SECTION 3: Matching ──────────────────────────────────────────── */}
        {activeSection === 'matching' && (
          <div className="practice-section">
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'12px' }}>
              <h2 style={{ margin:0 }}>Matching Type</h2>
              <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                {timerBadge('matching', matchASubmitted && matchBSubmitted)}
                {matchASubmitted && matchBSubmitted && (
                  <span style={{ fontWeight:'bold', color: (getMatchAScore()+getMatchBScore()) >= 7 ? '#16a34a' : '#dc2626' }}>
                    {getMatchAScore()+getMatchBScore()} / {matchingA.descriptions.length+matchingB.descriptions.length}
                  </span>
                )}
              </div>
            </div>

            {/* Set A */}
            <div className="theory-card" style={{ marginBottom:'24px' }}>
              <h3 style={{ marginBottom:'4px' }}>Set A — Cervical Spine Anatomy</h3>
              <p style={{ color:'#64748b', fontSize:'13px', marginBottom:'14px' }}>Match each description to the correct anatomical term.</p>
              {matchingA.descriptions.map((desc, di) => {
                const correct = matchingA.answers[di];
                const selected = Number(matchAAnswers[di]);
                const isCorrect = selected === correct;
                return (
                  <div key={di} style={{ display:'flex', gap:'12px', alignItems:'flex-start', marginBottom:'12px', padding:'10px', borderRadius:'8px',
                    background: matchASubmitted ? (isCorrect ? '#064e3b' : '#7f1d1d') : '#1e293b',
                    border: matchASubmitted ? `1px solid ${isCorrect ? '#10b981' : '#ef4444'}` : '1px solid #374151'
                  }}>
                    <span style={{ minWidth:'20px', color:'#64748b', fontWeight:'bold' }}>{di+1}.</span>
                    <p style={{ flex:1, margin:0, fontSize:'14px' }}>{desc}</p>
                    <select disabled={matchASubmitted} value={matchAAnswers[di] ?? ''}
                      onChange={e => setMatchAAnswers(prev => ({ ...prev, [di]: e.target.value }))}
                      style={{ minWidth:'200px', padding:'6px 8px', borderRadius:'6px', border:'1px solid #4b5563', fontSize:'13px',
                        background: matchASubmitted ? (isCorrect ? '#065f46' : '#991b1b') : '#111827', color:'#f1f5f9' }}>
                      <option value="">— Select —</option>
                      {matchingA.terms.map((t, ti) => <option key={ti} value={ti}>{t}</option>)}
                    </select>
                    {matchASubmitted && !isCorrect && (
                      <span style={{ fontSize:'12px', color:'#16a34a', minWidth:'120px' }}>✓ {matchingA.terms[correct]}</span>
                    )}
                  </div>
                );
              })}
              {!matchASubmitted && <button className="submit-btn" onClick={() => setMatchASubmitted(true)}>Submit Set A</button>}
              {matchASubmitted && <div style={{ color:'#16a34a', fontWeight:'600' }}>Set A: {getMatchAScore()} / {matchingA.descriptions.length}</div>}
            </div>

            {/* Set B */}
            <div className="theory-card">
              <h3 style={{ marginBottom:'4px' }}>Set B — Positioning Methods</h3>
              <p style={{ color:'#64748b', fontSize:'13px', marginBottom:'14px' }}>Match each description to the correct positioning method.</p>
              {matchingB.descriptions.map((desc, di) => {
                const correct = matchingB.answers[di];
                const selected = Number(matchBAnswers[di]);
                const isCorrect = selected === correct;
                return (
                  <div key={di} style={{ display:'flex', gap:'12px', alignItems:'flex-start', marginBottom:'12px', padding:'10px', borderRadius:'8px',
                    background: matchBSubmitted ? (isCorrect ? '#064e3b' : '#7f1d1d') : '#1e293b',
                    border: matchBSubmitted ? `1px solid ${isCorrect ? '#10b981' : '#ef4444'}` : '1px solid #374151'
                  }}>
                    <span style={{ minWidth:'20px', color:'#64748b', fontWeight:'bold' }}>{di+1}.</span>
                    <p style={{ flex:1, margin:0, fontSize:'14px' }}>{desc}</p>
                    <select disabled={matchBSubmitted} value={matchBAnswers[di] ?? ''}
                      onChange={e => setMatchBAnswers(prev => ({ ...prev, [di]: e.target.value }))}
                      style={{ minWidth:'200px', padding:'6px 8px', borderRadius:'6px', border:'1px solid #4b5563', fontSize:'13px',
                        background: matchBSubmitted ? (isCorrect ? '#065f46' : '#991b1b') : '#111827', color:'#f1f5f9' }}>
                      <option value="">— Select —</option>
                      {matchingB.terms.map((t, ti) => <option key={ti} value={ti}>{t}</option>)}
                    </select>
                    {matchBSubmitted && !isCorrect && (
                      <span style={{ fontSize:'12px', color:'#16a34a', minWidth:'120px' }}>✓ {matchingB.terms[correct]}</span>
                    )}
                  </div>
                );
              })}
              {!matchBSubmitted && <button className="submit-btn" onClick={() => { recordTime('matching'); setMatchBSubmitted(true); }}>Submit Set B</button>}
              {matchBSubmitted && <div style={{ color:'#16a34a', fontWeight:'600' }}>Set B: {getMatchBScore()} / {matchingB.descriptions.length}</div>}
            </div>
          </div>
        )}

        {/* ── SECTION 4: Drag & Label (callout style) ───────────────────────── */}
        {activeSection === 'image' && (
          <div className="practice-section">
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'4px' }}>
              <h2 style={{ margin:0 }}>Drag &amp; Label</h2>
              <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                {timerBadge('image', dragSubmitted)}
                {dragSubmitted && <span style={{ color: getDragScore() >= 4 ? '#10b981' : '#f87171', fontWeight:'bold' }}>{getDragScore()} / {dragZones.length}</span>}
              </div>
            </div>
            <p style={{ color:'#9ca3af', fontSize:'13px', marginBottom:'14px' }}>
              Drag each label from the pool and drop it onto the correct callout box on the skeleton.
            </p>

            {/* Skeleton image with SVG callout connectors + HTML drop boxes */}
            <div style={{ display:'flex', justifyContent:'center', marginBottom:'16px' }}>
              <div
                style={{ position:'relative', display:'inline-block', lineHeight:0 }}
              >

                <img
                  src="/Images/assessment.png"
                  alt="Posterior skeleton diagram"
                  style={{ height:'520px', width:'auto', display:'block', borderRadius:'10px' }}
                />

                {/* SVG layer: dots/lines (point) and bracket spine+ticks (bracket) */}
                <svg
                  style={{ position:'absolute', top:0, left:0, width:'100%', height:'100%', overflow:'visible', pointerEvents:'none' }}
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  {dragZones.filter(zone => dragSubmitted || isZoneVisible(zone.id)).map(zone => {
                    const lineEndX = zone.side === 'left'
                      ? zone.boxX + BOX_HW
                      : zone.boxX - BOX_HW;

                    if (zone.type === 'bracket') {
                      const midY    = (zone.topY + zone.botY) / 2;
                      const tickDir = zone.side === 'left' ? TICK_LEN : -TICK_LEN;
                      const bLines = [
                        [zone.bracketX, zone.topY,  zone.bracketX,           zone.botY],
                        [zone.bracketX, zone.topY,  zone.bracketX + tickDir, zone.topY],
                        [zone.bracketX, zone.botY,  zone.bracketX + tickDir, zone.botY],
                        [zone.bracketX, midY,        lineEndX,                zone.boxY],
                      ];
                      return (
                        <g key={zone.id} fill="none">
                          {/* white halo pass */}
                          {bLines.map(([x1,y1,x2,y2], i) => (
                            <line key={`h${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="white" strokeWidth="1.8" strokeOpacity="0.55" />
                          ))}
                          {/* coloured bracket pass */}
                          {bLines.map(([x1,y1,x2,y2], i) => (
                            <line key={`b${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={ZONE_COLORS[zone.id].stroke} strokeWidth="0.9" />
                          ))}
                          <circle cx={zone.bracketX} cy={midY} r="0.85" fill={ZONE_COLORS[zone.id].stroke} stroke="white" strokeWidth="0.4" />
                        </g>
                      );
                    }

                    // type === 'point'
                    const dots = zone.dots || [{ x: zone.dotX, y: zone.dotY }];
                    const anchor = dots.reduce((best, d) =>
                      Math.abs(d.y - zone.boxY) < Math.abs(best.y - zone.boxY) ? d : best, dots[0]);
                    return (
                      <g key={zone.id} fill="none">
                        {/* white halo on connecting line */}
                        <line x1={anchor.x} y1={anchor.y} x2={lineEndX} y2={zone.boxY} stroke="white" strokeWidth="1.8" strokeOpacity="0.55" />
                        {/* coloured connecting line */}
                        <line x1={anchor.x} y1={anchor.y} x2={lineEndX} y2={zone.boxY} stroke={ZONE_COLORS[zone.id].stroke} strokeWidth="0.9" />
                        {/* all anchor dots */}
                        {dots.map((d, di) => (
                          <circle key={di} cx={d.x} cy={d.y} r="1.1" fill={ZONE_COLORS[zone.id].stroke} stroke="white" strokeWidth="0.4" />
                        ))}
                      </g>
                    );
                  })}
                </svg>

                {/* HTML drop boxes */}
                {dragZones.filter(zone => dragSubmitted || isZoneVisible(zone.id)).map(zone => {
                  const dropped   = dragAnswers[zone.id];
                  const isCorrect = dragSubmitted && dropped === zone.answer;
                  const isWrong   = dragSubmitted && dropped && dropped !== zone.answer;
                  return (
                    <div
                      key={zone.id}
                      onDragOver={e => e.preventDefault()}
                      onDrop={() => handleDropOnZone(zone.id)}
                      style={{
                        position:'absolute',
                        top:  `${zone.boxY}%`,
                        left: `${zone.boxX}%`,
                        transform:'translate(-50%,-50%)',
                        width:'155px', minHeight:'56px',
                        padding:'8px 10px',
                        borderRadius:'10px',
                        border:`2px ${dragSubmitted ? 'solid' : 'dashed'} ${
                          isCorrect ? '#10b981'
                          : isWrong  ? '#ef4444'
                          : ZONE_COLORS[zone.id].stroke
                        }`,
                        background: isCorrect ? 'rgba(6,78,59,0.95)'
                          : isWrong  ? 'rgba(127,29,29,0.95)'
                          : ZONE_COLORS[zone.id].bg,
                        backdropFilter:'blur(4px)',
                        boxShadow:'0 2px 10px rgba(0,0,0,0.45)',
                        zIndex:10,
                        display:'flex', alignItems:'center', justifyContent:'center',
                      }}
                    >
                      {/* number badge — hidden */}

                      {dropped ? (
                        <div style={{ position:'relative', width:'100%', paddingLeft:'6px' }}>
                          <span
                            draggable={!dragSubmitted}
                            onDragStart={() => handleDragStart(dropped, zone.id)}
                            style={{
                              fontSize:'14px', fontWeight:'700', color:'white',
                              cursor: dragSubmitted ? 'default' : 'grab',
                              userSelect:'none', textAlign:'center',
                              display:'block', lineHeight:'1.4',
                            }}
                          >
                            {isCorrect && '✓ '}{isWrong && '✗ '}{dropped}
                          </span>
                          {isWrong && (
                            <div style={{
                              position:'absolute', top:'calc(100% - 1px)', left:'50%',
                              transform:'translateX(-50%)',
                              background:'#064e3b', color:'#a7f3d0',
                              fontSize:'8px', fontWeight:'600', padding:'2px 1px', borderRadius:'6px',
                              maxWidth:'300px', textAlign:'center', lineHeight:'1.2',
                              border:'1px solid #10b981', zIndex:20,
                            }}>
                              ✓ {zone.answer}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span style={{ fontSize:'13px', color:'#4b5563', textAlign:'center', userSelect:'none' }}>
                          Drop label here
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Label Pool */}
            <div onDragOver={e => e.preventDefault()} onDrop={handleDropOnPool}
              style={{ display:'flex', flexWrap:'wrap', gap:'8px', padding:'12px 16px',
                marginBottom:'16px', background:'#111827', borderRadius:'10px',
                border:'2px dashed #374151', minHeight:'52px', alignItems:'center' }}>
              <span style={{ color:'#4b5563', fontSize:'11px', fontWeight:'700',
                letterSpacing:'0.05em', marginRight:'4px' }}>LABEL POOL</span>
              {poolLabels.map(label => (
                <div key={label} draggable={!dragSubmitted}
                  onDragStart={() => handleDragStart(label, 'pool')}
                  style={{ padding:'11px 20px', background:'#3b82f6', color:'white',
                    borderRadius:'20px', cursor: dragSubmitted ? 'default' : 'grab',
                    fontSize:'14px', fontWeight:'600', userSelect:'none',
                    opacity: dragging?.label === label && dragging?.from === 'pool' ? 0.4 : 1 }}>
                  {label}
                </div>
              ))}
              {poolLabels.length === 0 && !dragSubmitted && (
                <span style={{ color:'#4b5563', fontSize:'12px' }}>
                  All labels placed — submit or drag a box back here to adjust
                </span>
              )}
            </div>

            {!dragSubmitted ? (
              <button className="submit-btn" onClick={() => { recordTime('image'); setDragSubmitted(true); }}>Submit Answers</button>
            ) : (
              <div style={{ background:'#064e3b', border:'1px solid #10b981', borderRadius:'10px',
                padding:'14px', textAlign:'center', color:'#a7f3d0' }}>
                Score: <strong>{getDragScore()} / {dragZones.length}</strong> — {getRating(getDragScore(), dragZones.length).label}
              </div>
            )}
          </div>
        )}

        {/* ── SECTION 5: Results ───────────────────────────────────────────── */}
        {activeSection === 'results' && (() => {
          const rating = getRating(totalScore, totalPossible);
          const sections = [
            { label: 'Multiple Choice (×1)',   mult: MC_MULT,   raw: mcSubmitted     ? getMCScore()     : null, total: mcQuestions.length },
            { label: 'True or False (×1.5)',   mult: FILL_MULT, raw: fillSubmitted   ? getFillScore()   : null, total: fillQuestions.length },
            { label: 'Matching Set A (×1.5)',  mult: MATC_MULT, raw: matchASubmitted ? getMatchAScore() : null, total: matchingA.descriptions.length },
            { label: 'Matching Set B (×1.5)',  mult: MATC_MULT, raw: matchBSubmitted ? getMatchBScore() : null, total: matchingB.descriptions.length },
            { label: 'Drag & Label (×2)',      mult: DRAG_MULT, raw: dragSubmitted   ? getDragScore()   : null, total: dragZones.length },
          ];
          return (
            <div className="recap-section">
              <h2>Your Results</h2>
              <div style={{ textAlign:'center', padding:'28px', background:'#111827', borderRadius:'16px', marginBottom:'24px', border:'2px solid #374151' }}>
                <div style={{ fontSize:'56px', fontWeight:'800', color: rating.color }}>{totalScore}</div>
                <div style={{ fontSize:'18px', color:'#9ca3af' }}>out of {totalPossible} points</div>
                <div style={{ marginTop:'6px', fontSize:'13px', color:'#4b5563' }}>
                  Raw&nbsp;<strong style={{ color:'#94a3b8' }}>{rawScore}/{totalPossible - MAX_TIME_BONUS}</strong>
                  &nbsp;+&nbsp;Time Bonus&nbsp;<strong style={{ color:'#fbbf24' }}>+{timeBonus}</strong>
                </div>
                <div style={{ marginTop:'10px', fontSize:'20px', fontWeight:'700', color: rating.color }}>{rating.label}</div>
                <div style={{ marginTop:'6px', fontSize:'13px', color:'#6b7280' }}>
                  {Math.round((totalScore / totalPossible) * 100)}% overall score
                </div>
              </div>
              <h3 style={{ marginBottom:'12px' }}>Section Breakdown</h3>
              {sections.map((s, i) => {
                const pct = s.raw !== null ? s.raw / s.total : null;
                const pts = s.raw !== null ? +(s.raw * s.mult).toFixed(1) : null;
                const max = +(s.total * s.mult).toFixed(1);
                return (
                <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 16px', marginBottom:'8px', borderRadius:'10px', background:'#1f2937', border:'1px solid #374151' }}>
                  <span style={{ fontWeight:'500' }}>{s.label}</span>
                  {pct !== null ? (
                    <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                      <div style={{ width:'120px', height:'8px', background:'#e2e8f0', borderRadius:'99px', overflow:'hidden' }}>
                        <div style={{ width:`${pct * 100}%`, height:'100%', background: pct >= 0.75 ? '#16a34a' : pct >= 0.5 ? '#d97706' : '#dc2626', transition:'width 0.4s' }} />
                      </div>
                      <span style={{ fontWeight:'700', minWidth:'56px', textAlign:'right', color: pct >= 0.75 ? '#10b981' : '#f87171' }}>{pts} / {max}</span>
                    </div>
                  ) : (
                    <span style={{ color:'#6b7280', fontSize:'13px' }}>Not submitted yet</span>
                  )}
                </div>
              ); })}
              {/* Time Bonus row */}
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 16px', marginBottom:'16px', borderRadius:'10px', background:'#1c1917', border:'1px solid #44403c' }}>
                <span style={{ fontWeight:'500', color:'#fbbf24' }}>⏱ Time Bonus</span>
                <span style={{ fontWeight:'700', color: timeBonus > 0 ? '#fbbf24' : '#6b7280' }}>+{timeBonus} / {MAX_TIME_BONUS}</span>
              </div>
              {/* Auto-submit status */}
              {scoreSubmitting && (
                <div style={{ padding:'12px', background:'#1f2937', border:'1px solid #374151', borderRadius:'9px', textAlign:'center', color:'#9ca3af', fontWeight:'600', marginBottom:'12px' }}>
                  ⏳ Saving your score…
                </div>
              )}
              {scoreSubmitted && (
                <div style={{ padding:'12px 16px', background:'#064e3b', border:'1px solid #10b981', borderRadius:'9px', textAlign:'center', color:'#a7f3d0', fontWeight:'600', marginBottom:'12px' }}>
                  ✓ Saved as <strong>{playerName}</strong>
                  {scoreResult?.pct > 0 && <span> — you beat <strong style={{ color:'#34d399' }}>{scoreResult.pct}%</strong> of players!</span>}
                </div>
              )}

              {/* Leaderboard */}
              <h3 style={{ marginBottom:'10px', marginTop:'20px' }}>🏆 Leaderboard</h3>
              {leaderboard.length === 0 ? (
                <div style={{ color:'#6b7280', fontSize:'13px', textAlign:'center', padding:'20px', background:'#1f2937', borderRadius:'10px', marginBottom:'16px' }}>
                  {scoreSubmitting ? 'Loading…' : 'No entries yet.'}
                </div>
              ) : (
                <div style={{ borderRadius:'10px', overflow:'hidden', border:'1px solid #374151', marginBottom:'16px' }}>
                  <div style={{ display:'grid', gridTemplateColumns:'44px 1fr 60px 60px', background:'#111827', padding:'9px 14px', borderBottom:'1px solid #374151' }}>
                    <span style={{ color:'#6b7280', fontSize:'11px', fontWeight:'700', textTransform:'uppercase' }}>#</span>
                    <span style={{ color:'#6b7280', fontSize:'11px', fontWeight:'700', textTransform:'uppercase' }}>Player</span>
                    <span style={{ color:'#6b7280', fontSize:'11px', fontWeight:'700', textTransform:'uppercase', textAlign:'right' }}>Raw</span>
                    <span style={{ color:'#6b7280', fontSize:'11px', fontWeight:'700', textTransform:'uppercase', textAlign:'right' }}>Final</span>
                  </div>
                  {leaderboard.map((entry, i) => {
                    const isMe = !!(scoreResult?.doc?._id && String(entry._id) === String(scoreResult.doc._id));
                    const medals = ['🥇','🥈','🥉'];
                    return (
                      <div key={String(entry._id) || i} style={{
                        display:'grid', gridTemplateColumns:'44px 1fr 60px 60px',
                        padding:'10px 14px', alignItems:'center',
                        background: isMe ? 'rgba(16,185,129,0.1)' : i % 2 === 0 ? '#1f2937' : '#1a2332',
                        borderBottom: i < leaderboard.length - 1 ? '1px solid #2d3748' : 'none',
                        borderLeft: `3px solid ${isMe ? '#10b981' : 'transparent'}`,
                      }}>
                        <span style={{ fontWeight:'700', color: i < 3 ? '#fbbf24' : '#6b7280', fontSize: i === 0 ? '17px' : '13px' }}>
                          {medals[i] ?? i + 1}
                        </span>
                        <span style={{ fontWeight: isMe ? '700' : '500', color: isMe ? '#34d399' : '#e2e8f0', fontSize:'13px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                          {entry.name}{isMe && <span style={{ color:'#6b7280', fontSize:'11px', marginLeft:'5px' }}>(you)</span>}
                        </span>
                        <span style={{ color:'#9ca3af', fontSize:'12px', textAlign:'right' }}>{entry.rawScore}</span>
                        <span style={{ fontWeight:'700', color:'#fbbf24', fontSize:'13px', textAlign:'right' }}>{entry.finalScore}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Exit button */}
              <button onClick={onExit} style={{
                width:'100%', padding:'12px',
                background:'transparent', border:'2px solid #374151',
                borderRadius:'9px', color:'#9ca3af',
                fontSize:'14px', fontWeight:'600', cursor:'pointer',
              }}>
                ← Exit &amp; Play Again
              </button>
            </div>
          );
        })()}

      </div>
    </div>
  );
};

export default AssessmentContent;
