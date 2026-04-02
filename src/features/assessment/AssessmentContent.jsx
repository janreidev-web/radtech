import React, { useState } from 'react';
import './AssessmentContent.css';

// ── Section 1: Multiple Choice ──────────────────────────────────────────────
const mcQuestions = [
  { id:1,  question:'How many vertebrae make up the cervical spine?', options:['5','7','9','12'], answer:1 },
  { id:2,  question:'The Atlas (C1) is distinguished from other vertebrae because it:', options:['Has the largest vertebral body','Has no vertebral body or spinous process','Bears the odontoid process (dens)','Has bifid transverse processes'], answer:1 },
  { id:3,  question:'How many vertebrae make up the lumbar spine?', options:['3','4','5','6'], answer:2 },
  { id:4,  question:'The sacrum is formed by the fusion of how many vertebrae?', options:['3','4','5','7'], answer:2 },
  { id:5,  question:'The coccyx (tailbone) is typically composed of how many fused segments?', options:['2','3–5','6','8'], answer:1 },
  { id:6,  question:'Spinous processes extend _____ from the vertebral arch and can be palpated along the midline of the back.', options:['Anteriorly','Laterally','Posteriorly','Superiorly'], answer:2 },
  { id:7,  question:'Transverse processes of vertebrae primarily serve as attachment sites for:', options:['Intervertebral disks','Muscles and ligaments','Spinal nerve roots','The spinal cord'], answer:1 },
  { id:8,  question:'The outer fibrous ring of an intervertebral disk is called the:', options:['Nucleus pulposus','Annulus fibrosus','Vertebral endplate','Ligamentum flavum'], answer:1 },
  { id:9,  question:'The inner gel-like core of an intervertebral disk that absorbs shock between vertebrae is the:', options:['Annulus fibrosus','Articular cartilage','Nucleus pulposus','Posterior longitudinal ligament'], answer:2 },
  { id:10, question:"The Swimmer's View is the primary radiographic method used to demonstrate which region?", options:['Upper cervical spine (C1–C2)','Cervicothoracic junction (C7–T1)','Thoracic spine (T1–T12)','Lumbar spine (L1–L5)'], answer:1 },
  { id:11, question:'Why is the cervicothoracic junction (C7–T1) difficult to visualize on a standard lateral cervical radiograph?', options:['The vertebrae are too small to resolve','Overlapping shoulder anatomy obscures C7–T1','The region falls outside the collimated field','High tissue density prevents x-ray penetration'], answer:1 },
  { id:12, question:'Which structure, unique to cervical vertebrae, transmits the vertebral arteries on each side?', options:['Spinous process','Transverse foramen','Vertebral foramen','Pedicle'], answer:1 },
];

// ── Section 2: Fill in the Blanks ───────────────────────────────────────────
const fillQuestions = [
  { id:1, before:'The', after:'(C1) is a ring-shaped vertebra with no vertebral body or spinous process.', answers:['atlas'] },
  { id:2, before:'The cervicothoracic junction refers to the transition between', after:'and T1.', answers:['c7','c-7'] },
  { id:3, before:"The Swimmer's View (Twinning Method) is performed with the patient in an", after:'position.', answers:['upright lateral','upright','erect lateral'] },
  { id:4, before:"The Swimmer's View (Pawlow Method) is performed with the patient in a", after:'position.', answers:['recumbent lateral','recumbent','lateral recumbent'] },
  { id:5, before:'The standard SID for the lateral cervical spine and Swimmer\'s View is', after:'inches.', answers:['72'] },
  { id:6, before:'In the AP cervical spine projection, the central ray is angled', after:'degrees cephalad to the level of C4.', answers:['15-20','15 to 20','15–20','20','15'] },
  { id:7, before:'The Open-Mouth (Odontoid) view demonstrates the odontoid process of', after:'.', answers:['c2','axis','c2 (axis)','the axis'] },
  { id:8, before:'The radiographic principle of using the minimum radiation dose necessary is called the', after:'principle.', answers:['alara'] },
];

// ── Section 3A: Matching – Anatomy ──────────────────────────────────────────
const matchingA = {
  terms: ['Atlas (C1)','Axis (C2)','C7 (Vertebra Prominens)','Odontoid Process (Dens)','Cervicothoracic Junction (C7–T1)'],
  descriptions: [
    'Ring-shaped vertebra that supports the skull; has no vertebral body or spinous process.',
    'Contains the peg-like odontoid process; permits approximately 50% of head rotation.',
    'Has the most prominent spinous process in the cervical region; easily palpated at the base of the neck.',
    'Bony projection rising from C2 that acts as a pivot point for rotation of C1 and the skull.',
    'Critical transition zone between the last cervical and first thoracic vertebra; commonly obscured by shoulders in lateral radiographs.',
  ],
  answers: [0,1,2,3,4],
};

// ── Section 3B: Matching – Positioning ──────────────────────────────────────
const matchingB = {
  terms: ['Twinning Method','Pawlow Method','Open-Mouth (Odontoid) View','AP Cervical Projection','Lateral Cervical Projection'],
  descriptions: [
    'Patient stands or sits upright in a lateral position; arm on the IR side is raised above the head.',
    'Patient lies in recumbent lateral position on the table; arm closest to the table is raised above the head.',
    'Patient opens mouth wide to allow visualization of C1–C2 and the odontoid process (dens).',
    'Central ray directed 15–20° cephalad to C4; best demonstrates C3–C7 vertebral bodies.',
    'Performed at 72-inch SID with a horizontal central ray; must demonstrate all 7 cervical vertebrae.',
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

const AssessmentContent = () => {
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

  const getMCScore  = () => mcQuestions.filter((_,i) => mcAnswers[i] === mcQuestions[i].answer).length;
  const getFillScore = () => fillQuestions.filter((_,i) => fillQuestions[i].answers.includes((fillAnswers[i]||'').trim().toLowerCase())).length;
  const getMatchAScore = () => matchingA.descriptions.filter((_,i) => Number(matchAAnswers[i]) === matchingA.answers[i]).length;
  const getMatchBScore = () => matchingB.descriptions.filter((_,i) => Number(matchBAnswers[i]) === matchingB.answers[i]).length;
  const getDragScore = () => dragZones.filter(z => dragAnswers[z.id] === z.answer).length;

  const totalPossible = mcQuestions.length + fillQuestions.length + matchingA.descriptions.length + matchingB.descriptions.length + dragZones.length;
  const totalScore = (mcSubmitted ? getMCScore() : 0) + (fillSubmitted ? getFillScore() : 0) + (matchASubmitted ? getMatchAScore() : 0) + (matchBSubmitted ? getMatchBScore() : 0) + (dragSubmitted ? getDragScore() : 0);

  const getRating = (score, total) => {
    const pct = score / total;
    if (pct >= 0.9) return { label: 'Excellent', color: '#16a34a' };
    if (pct >= 0.75) return { label: 'Good', color: '#2563eb' };
    if (pct >= 0.5) return { label: 'Satisfactory', color: '#d97706' };
    return { label: 'Needs Review', color: '#dc2626' };
  };

  const tabs = [
    { id: 'mc',       label: 'Multiple Choice',    count: mcQuestions.length },
    { id: 'fill',     label: 'Fill in the Blanks', count: fillQuestions.length },
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
              {mcSubmitted && <span style={{ color: getMCScore() >= 7 ? '#10b981' : '#f87171', fontWeight:'bold' }}>{getMCScore()} / {mcQuestions.length}</span>}
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
              <button className="submit-btn" onClick={() => setMcSubmitted(true)}>Submit Answers</button>
            ) : (
              <div style={{ background:'#064e3b', border:'1px solid #10b981', borderRadius:'10px', padding:'14px', textAlign:'center', color:'#a7f3d0' }}>
                Score: <strong>{getMCScore()} / {mcQuestions.length}</strong> — {getRating(getMCScore(), mcQuestions.length).label}
              </div>
            )}
          </div>
        )}

        {/* ── SECTION 2: Fill in the Blanks ───────────────────────────────── */}
        {activeSection === 'fill' && (
          <div className="practice-section">
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'12px' }}>
              <h2 style={{ margin:0 }}>Fill in the Blanks</h2>
              {fillSubmitted && <span style={{ color: getFillScore() >= 5 ? '#10b981' : '#f87171', fontWeight:'bold' }}>{getFillScore()} / {fillQuestions.length}</span>}
            </div>
            <p style={{ color:'#64748b', fontSize:'13px', marginBottom:'16px' }}>Type the missing word or phrase in each blank. Answers are not case-sensitive.</p>
            {fillQuestions.map((q, qi) => {
              const val = fillAnswers[qi] || '';
              const isCorrect = q.answers.includes(val.trim().toLowerCase());
              return (
                <div key={qi} className="question-card" style={{ marginBottom:'14px' }}>
                  <p style={{ lineHeight:'2.2', fontWeight:'500' }}>
                    {qi + 1}. {q.before}{' '}
                    <input
                      type="text" disabled={fillSubmitted} value={val}
                      onChange={e => setFillAnswers(prev => ({ ...prev, [qi]: e.target.value }))}
                      placeholder="____________"
                      style={{
                        border:'none', borderBottom: fillSubmitted ? `2px solid ${isCorrect ? '#10b981' : '#ef4444'}` : '2px solid #64748b',
                        outline:'none', padding:'2px 8px', width:'160px', textAlign:'center',
                        background: fillSubmitted ? (isCorrect ? '#064e3b' : '#7f1d1d') : '#1e293b',
                        color: fillSubmitted ? (isCorrect ? '#a7f3d0' : '#fecaca') : '#f1f5f9',
                        borderRadius:'4px', fontWeight:'600', fontSize:'14px'
                      }}
                    />{' '}
                    {q.after}
                    {fillSubmitted && !isCorrect && (
                      <span style={{ marginLeft:'10px', color:'#16a34a', fontSize:'13px' }}>
                        ✓ {q.answers[0].charAt(0).toUpperCase() + q.answers[0].slice(1)}
                      </span>
                    )}
                  </p>
                </div>
              );
            })}
            {!fillSubmitted ? (
              <button className="submit-btn" onClick={() => setFillSubmitted(true)}>Submit Answers</button>
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
              {matchASubmitted && matchBSubmitted && (
                <span style={{ fontWeight:'bold', color: (getMatchAScore()+getMatchBScore()) >= 7 ? '#16a34a' : '#dc2626' }}>
                  {getMatchAScore()+getMatchBScore()} / {matchingA.descriptions.length+matchingB.descriptions.length}
                </span>
              )}
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
              {!matchBSubmitted && <button className="submit-btn" onClick={() => setMatchBSubmitted(true)}>Submit Set B</button>}
              {matchBSubmitted && <div style={{ color:'#16a34a', fontWeight:'600' }}>Set B: {getMatchBScore()} / {matchingB.descriptions.length}</div>}
            </div>
          </div>
        )}

        {/* ── SECTION 4: Drag & Label (callout style) ───────────────────────── */}
        {activeSection === 'image' && (
          <div className="practice-section">
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'4px' }}>
              <h2 style={{ margin:0 }}>Drag &amp; Label</h2>
              {dragSubmitted && <span style={{ color: getDragScore() >= 4 ? '#10b981' : '#f87171', fontWeight:'bold' }}>{getDragScore()} / {dragZones.length}</span>}
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
              <button className="submit-btn" onClick={() => setDragSubmitted(true)}>Submit Answers</button>
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
            { label: 'Multiple Choice',    score: mcSubmitted   ? getMCScore()     : null, total: mcQuestions.length },
            { label: 'Fill in the Blanks', score: fillSubmitted ? getFillScore()   : null, total: fillQuestions.length },
            { label: 'Matching Set A',     score: matchASubmitted ? getMatchAScore() : null, total: matchingA.descriptions.length },
            { label: 'Matching Set B',     score: matchBSubmitted ? getMatchBScore() : null, total: matchingB.descriptions.length },
            { label: 'Drag & Label',       score: dragSubmitted ? getDragScore()   : null, total: dragZones.length },
          ];
          return (
            <div className="recap-section">
              <h2>Your Results</h2>
              <div style={{ textAlign:'center', padding:'28px', background:'#111827', borderRadius:'16px', marginBottom:'24px', border:'2px solid #374151' }}>
                <div style={{ fontSize:'56px', fontWeight:'800', color: rating.color }}>{totalScore}</div>
                <div style={{ fontSize:'18px', color:'#9ca3af' }}>out of {totalPossible} points</div>
                <div style={{ marginTop:'10px', fontSize:'20px', fontWeight:'700', color: rating.color }}>{rating.label}</div>
                <div style={{ marginTop:'8px', fontSize:'13px', color:'#6b7280' }}>
                  {Math.round((totalScore / totalPossible) * 100)}% overall score
                </div>
              </div>
              <h3 style={{ marginBottom:'12px' }}>Section Breakdown</h3>
              {sections.map((s, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 16px', marginBottom:'8px', borderRadius:'10px', background:'#1f2937', border:'1px solid #374151' }}>
                  <span style={{ fontWeight:'500' }}>{s.label}</span>
                  {s.score !== null ? (
                    <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                      <div style={{ width:'120px', height:'8px', background:'#e2e8f0', borderRadius:'99px', overflow:'hidden' }}>
                        <div style={{ width:`${(s.score / s.total) * 100}%`, height:'100%', background: s.score / s.total >= 0.75 ? '#16a34a' : s.score / s.total >= 0.5 ? '#d97706' : '#dc2626', transition:'width 0.4s' }} />
                      </div>
                      <span style={{ fontWeight:'700', minWidth:'48px', textAlign:'right', color: s.score / s.total >= 0.75 ? '#10b981' : '#f87171' }}>{s.score} / {s.total}</span>
                    </div>
                  ) : (
                    <span style={{ color:'#6b7280', fontSize:'13px' }}>Not submitted yet</span>
                  )}
                </div>
              ))}
            </div>
          );
        })()}

      </div>
    </div>
  );
};

export default AssessmentContent;
