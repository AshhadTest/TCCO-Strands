import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate }                        from 'react-router-dom';
import { GRID, ANSWERS, TOTAL, THEME_TOTAL, SPANGRAM_ID,
         decodeName, sha256, fmt, effSc, isAdj }    from '../data.js';
import { saveScore }                                from '../firebase.js';

// ─── Colours ─────────────────────────────────────────────────────────────────
const C = {
  bg:      '#0b1120',
  surface: '#101d3a',
  raised:  '#152244',
  border:  '#1e3a6e',
  text:    '#e2e8f0',
  muted:   '#94a3b8',
  faint:   '#475569',
  accent:  '#38bdf8',
  span:    '#b45309',
  spanBg:  '#451a03',
  found:   '#1d4ed8',
  foundBg: '#1e3a8a',
  foundFg: '#93c5fd',
  hintBg:  '#3b0764',
  hintFg:  '#e9d5ff',
  green:   '#22c55e',
  cellBg:  '#152244',
  cellBd:  '#1e3a6e',
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
const S = {
  card:  { background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: '1.25rem' },
  label: { fontSize: 11, color: C.faint, letterSpacing: '1.2px', textTransform: 'uppercase', display: 'block', marginBottom: 6 },
};

function Chip({ found, spangram, children }) {
  const bg    = found ? (spangram ? C.spanBg  : C.foundBg) : C.raised;
  const color = found ? (spangram ? C.span    : C.foundFg) : C.faint;
  const bd    = found ? (spangram ? C.span    : C.found)   : C.border;
  return (
    <span style={{ fontSize: 12, padding: '4px 10px', borderRadius: 20,
                   background: bg, color, border: `1px solid ${bd}`,
                   fontWeight: found ? 600 : 400 }}>
      {children}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HOME SCREEN
// ─────────────────────────────────────────────────────────────────────────────
function HomeScreen({ onStart }) {
  const [name, setName] = useState('');
  return (
    <div style={{ minHeight: '100vh', background: C.bg, padding: '1.5rem 1rem' }}>
      <div style={{ maxWidth: 440, margin: '0 auto', paddingTop: '2.5rem' }}>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: 3, color: C.accent }}>
            TCCO STRANDS
          </div>
          <div style={{ fontSize: 13, color: C.muted, marginTop: 6, letterSpacing: 1 }}>
            Technology Risk Edition
          </div>
        </div>

        <div style={{ ...S.card, marginBottom: 10 }}>
          <label style={S.label}>Your name</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && name.trim() && onStart(name.trim())}
            placeholder="Enter your name…"
            maxLength={24}
            autoFocus
          />
          <button
            className="primary"
            onClick={() => name.trim() && onStart(name.trim())}
            disabled={!name.trim()}
            style={{ width: '100%', marginTop: 12 }}
          >
            Start
          </button>
        </div>

        <Link to="/leaderboard">
          <button style={{ width: '100%', marginBottom: '1.5rem' }}>Leaderboard</button>
        </Link>

        <div style={{ ...S.card }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 10 }}>How to play</div>
          <ul style={{ fontSize: 13, color: C.muted, paddingLeft: 16, lineHeight: 2.2 }}>
            <li>Drag through adjacent letters to spell cybersecurity words</li>
            <li>Theme words go <strong style={{ color: C.text }}>horizontally</strong> or <strong style={{ color: C.text }}>vertically</strong></li>
            <li>The <span style={{ color: C.span, fontWeight: 600 }}>spangram</span> runs <strong style={{ color: C.text }}>diagonally</strong> corner to corner — find it last</li>
            <li>Hints reveal a word for 3 s and add 30 s to your score</li>
          </ul>
        </div>

      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// WON SCREEN
// ─────────────────────────────────────────────────────────────────────────────
function WonScreen({ username, time, hints, onPlayAgain }) {
  const navigate = useNavigate();
  const pen = hints * 30;
  return (
    <div style={{ minHeight: '100vh', background: C.bg, padding: '1.5rem 1rem' }}>
      <div style={{ maxWidth: 440, margin: '0 auto', paddingTop: '2rem', textAlign: 'center' }}>

        <div style={{ fontSize: 28, fontWeight: 800, color: C.green, marginBottom: 4 }}>
          All threats found
        </div>
        <div style={{ color: C.muted, marginBottom: '1.5rem' }}>{username}</div>

        <div style={{ display: 'flex', gap: 10, marginBottom: hints > 0 ? 8 : '1.25rem' }}>
          {[
            { label: 'TIME',  val: fmt(time),  color: C.green },
            { label: 'HINTS', val: hints, color: hints > 0 ? C.span : C.green },
          ].map(({ label, val, color }) => (
            <div key={label} style={{ ...S.card, flex: 1, textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 700, color, fontFamily: "'Courier New', monospace" }}>{val}</div>
              <div style={{ fontSize: 11, color: C.faint, letterSpacing: '1px', marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>
        {hints > 0 && (
          <div style={{ fontSize: 12, color: C.span, marginBottom: '1.25rem' }}>
            +{pen}s hint penalty · effective score {fmt(time + pen)}
          </div>
        )}

        <div style={{ ...S.card, textAlign: 'left', marginBottom: '1.25rem' }}>
          <div style={{ ...S.label, marginBottom: 14 }}>Words found</div>
          {ANSWERS.map(a => (
            <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                            background: a.isSpangram ? C.span : C.found }} />
              <span style={{ fontSize: 14, fontWeight: a.isSpangram ? 700 : 400 }}>{decodeName(a.id)}</span>
              {a.isSpangram && (
                <span style={{ fontSize: 11, background: C.spanBg, color: C.span,
                               padding: '2px 8px', borderRadius: 12, border: `1px solid ${C.span}` }}>
                  spangram
                </span>
              )}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button className="primary" onClick={() => navigate('/leaderboard')} style={{ flex: 1 }}>
            Leaderboard
          </button>
          <button onClick={onPlayAgain} style={{ flex: 1 }}>Play again</button>
        </div>

      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GAME BOARD
// ─────────────────────────────────────────────────────────────────────────────
function GameBoard({ username, onWin }) {
  const [sel,       setSel]       = useState([]);
  const [colored,   setColored]   = useState({});
  const [foundIds,  setFoundIds]  = useState(new Set());
  const [hints,     setHints]     = useState(0);
  const [hintCells, setHintCells] = useState(new Set());
  const [hintText,  setHintText]  = useState('');
  const [time,      setTime]      = useState(0);
  const [shaking,   setShaking]   = useState(false);

  const isDown     = useRef(false);
  const selRef     = useRef([]);
  const foundRef   = useRef(new Set());
  const coloredRef = useRef({});
  const timeRef    = useRef(0);
  const hintsRef   = useRef(0);
  const timerRef   = useRef(null);

  useEffect(() => { selRef.current     = sel;      }, [sel]);
  useEffect(() => { foundRef.current   = foundIds; }, [foundIds]);
  useEffect(() => { coloredRef.current = colored;  }, [colored]);
  useEffect(() => { timeRef.current    = time;     }, [time]);
  useEffect(() => { hintsRef.current   = hints;    }, [hints]);

  useEffect(() => {
    timerRef.current = setInterval(() => setTime(t => t + 1), 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  // ── Validate via SHA-256 ──
  const checkSel = useCallback(async (s) => {
    if (s.length < 3) { setSel([]); return; }
    const letters = s.map(([r, c]) => GRID[r][c]).join('');
    const hash    = await sha256(letters);
    const match   = ANSWERS.find(a => a.hashes.includes(hash) && !foundRef.current.has(a.id));

    if (match) {
      const newFound = new Set([...foundRef.current, match.id]);
      setFoundIds(newFound);
      setColored(prev => {
        const next = { ...prev };
        for (const [r, c] of match.path) next[`${r},${c}`] = match.isSpangram ? 'span' : 'theme';
        return next;
      });
      setSel([]);
      if (newFound.size === TOTAL) {
        clearInterval(timerRef.current);
        setTimeout(async () => {
          onWin(timeRef.current, hintsRef.current);
          saveScore(username, timeRef.current, hintsRef.current).catch(() => {});
        }, 600);
      }
    } else {
      setShaking(true);
      setTimeout(() => { setShaking(false); setSel([]); }, 500);
    }
  }, [username, onWin]);

  // ── Pointer ──
  const onDown = useCallback((r, c) => {
    if (coloredRef.current[`${r},${c}`]) return;
    isDown.current = true;
    setSel([[r, c]]);
  }, []);

  const onEnter = useCallback((r, c) => {
    if (!isDown.current || coloredRef.current[`${r},${c}`]) return;
    setSel(prev => {
      if (!prev.length) return prev;
      if (prev.length >= 2 && prev[prev.length-2][0]===r && prev[prev.length-2][1]===c)
        return prev.slice(0, -1);
      if (prev.some(([pr,pc]) => pr===r && pc===c)) return prev;
      if (!isAdj(prev[prev.length-1], [r, c])) return prev;
      return [...prev, [r, c]];
    });
  }, []);

  const onUp = useCallback(() => {
    if (!isDown.current) return;
    isDown.current = false;
    checkSel(selRef.current);
  }, [checkSel]);

  useEffect(() => {
    document.addEventListener('mouseup', onUp);
    return () => document.removeEventListener('mouseup', onUp);
  }, [onUp]);

  // ── Touch ──
  const getCell = t => {
    const el = document.elementFromPoint(t.clientX, t.clientY);
    if (!el) return null;
    const r = el.getAttribute('data-r'), c = el.getAttribute('data-c');
    return r != null ? [+r, +c] : null;
  };

  // ── Hint ──
  const doHint = () => {
    const a = ANSWERS.find(ans => !foundRef.current.has(ans.id));
    if (!a) return;
    setHints(h => h + 1);
    setHintText(a.hint);
    setHintCells(new Set(a.path.map(([r,c]) => `${r},${c}`)));
    setTimeout(() => { setHintCells(new Set()); setHintText(''); }, 3000);
  };

  // ── Cell style ── larger cells, bigger font
  const cellStyle = (r, c) => {
    const key  = `${r},${c}`;
    const base = {
      // Use a CSS variable trick: cells fill their grid area squarely
      aspectRatio: '1',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      borderRadius: 9,
      fontWeight: 700,
      // Responsive font: scales with viewport width, capped at 22px
      fontSize: 'clamp(15px, 4.2vw, 22px)',
      fontFamily: "'Courier New', Courier, monospace",
      cursor: 'pointer',
      userSelect: 'none',
      WebkitUserSelect: 'none',
      transition: 'background 0.1s, transform 0.08s',
      // Ensure touch area is large enough
      minWidth: 0,
      letterSpacing: 0,
    };
    const st = colored[key];
    if (st === 'span')  return { ...base, background: C.spanBg,  color: C.span,    border: `2px solid ${C.span}`,  cursor: 'default', transform: 'scale(1)' };
    if (st === 'theme') return { ...base, background: C.foundBg, color: C.foundFg, border: `2px solid ${C.found}`, cursor: 'default' };
    if (hintCells.has(key)) return { ...base, background: C.hintBg, color: C.hintFg, border: `2px solid #7c3aed` };
    if (sel.some(([sr,sc]) => sr===r && sc===c)) {
      const isLast = sel.length && sel[sel.length-1][0]===r && sel[sel.length-1][1]===c;
      return { ...base, background: isLast ? '#bfdbfe' : '#2563eb', color: isLast ? '#1e3a8a' : '#fff', border: `2px solid ${C.accent}`, transform: isLast ? 'scale(1.08)' : 'scale(1)' };
    }
    return { ...base, background: C.cellBg, color: C.text, border: `2px solid ${C.cellBd}` };
  };

  const themeFound   = ANSWERS.filter(a => !a.isSpangram && foundIds.has(a.id)).length;
  const spangramDone = foundIds.has(SPANGRAM_ID);
  const selStr       = sel.map(([r,c]) => GRID[r][c]).join('');

  return (
    <div style={{ minHeight: '100vh', background: C.bg, padding: '0.6rem 0.5rem' }}>
      <style>{`
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20%,60%  { transform: translateX(-7px); }
          40%,80%  { transform: translateX(7px); }
        }
      `}</style>

      {/* ── Header ── */}
      <div style={{ maxWidth: 620, margin: '0 auto 8px', display: 'flex',
                    alignItems: 'center', justifyContent: 'space-between', padding: '0 4px' }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: 2, color: C.accent }}>
            TCCO STRANDS
          </div>
          <div style={{ fontSize: 12, color: C.muted }}>{username}</div>
        </div>
        <div style={{ display: 'flex', gap: 28 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "'Courier New', monospace", color: C.text }}>
              {fmt(time)}
            </div>
            <div style={{ fontSize: 10, color: C.faint, letterSpacing: '1px' }}>TIME</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: hints > 0 ? C.span : C.text }}>
              {hints}
            </div>
            <div style={{ fontSize: 10, color: C.faint, letterSpacing: '1px' }}>HINTS</div>
          </div>
        </div>
      </div>

      {/* ── Theme badge ── */}
      <div style={{ maxWidth: 620, margin: '0 auto 6px', textAlign: 'center' }}>
        <span style={{ fontSize: 12, color: C.muted, background: C.surface,
                       padding: '4px 14px', borderRadius: 20, border: `1px solid ${C.border}` }}>
          Technology Risk&nbsp;&nbsp;·&nbsp;&nbsp;
          {themeFound}/{THEME_TOTAL} words{spangramDone ? ' + spangram' : ''}
        </span>
      </div>

      {/* ── Hint tooltip ── */}
      <div style={{ maxWidth: 620, margin: '0 auto', minHeight: 30, textAlign: 'center', marginBottom: 4 }}>
        {hintText && (
          <span style={{ fontSize: 12, color: C.hintFg, background: C.hintBg,
                         padding: '4px 14px', borderRadius: 20, border: `1px solid #7c3aed` }}>
            Hint: {hintText}
          </span>
        )}
      </div>

      {/* ── Grid — wider container, larger gap, bigger cells ── */}
      <div style={{ maxWidth: 620, margin: '0 auto' }}>
        <div
          style={{
            display: 'grid',
            // 10 equal columns — cells will be whatever the container allows
            gridTemplateColumns: 'repeat(10, 1fr)',
            // More gap between cells = easier to target the right one
            gap: 'clamp(3px, 1vw, 7px)',
            padding: 'clamp(6px, 1.5vw, 12px)',
            background: C.surface,
            borderRadius: 14,
            border: `1px solid ${C.border}`,
            animation: shaking ? 'shake 0.45s ease' : 'none',
            // Prevent browser scroll-on-drag
            touchAction: 'none',
          }}
          onTouchStart={e => { e.preventDefault(); const cell = getCell(e.touches[0]); if (cell) onDown(cell[0], cell[1]); }}
          onTouchMove={e => { e.preventDefault(); const cell = getCell(e.touches[0]); if (cell) onEnter(cell[0], cell[1]); }}
          onTouchEnd={e => { e.preventDefault(); onUp(); }}
        >
          {GRID.map((row, r) => row.map((letter, c) => (
            <div
              key={`${r}-${c}`}
              data-r={r} data-c={c}
              onMouseDown={e => { e.preventDefault(); onDown(r, c); }}
              onMouseEnter={() => onEnter(r, c)}
              style={cellStyle(r, c)}
            >
              {letter}
            </div>
          )))}
        </div>
      </div>

      {/* ── Selection preview ── */}
      <div style={{ maxWidth: 620, margin: '6px auto', height: 36,
                    display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {selStr && (
          <span style={{ fontFamily: "'Courier New', monospace", fontSize: 22,
                         fontWeight: 700, letterSpacing: 6, color: C.text }}>
            {selStr}
          </span>
        )}
      </div>

      {/* ── Found chips ── */}
      <div style={{ maxWidth: 620, margin: '0 auto 10px', display: 'flex',
                    flexWrap: 'wrap', gap: 5, padding: '0 4px' }}>
        {ANSWERS.filter(a => !a.isSpangram).map(a => (
          <Chip key={a.id} found={foundIds.has(a.id)}>
            {foundIds.has(a.id) ? decodeName(a.id) : '?'.repeat(Math.min(decodeName(a.id).length, 7))}
          </Chip>
        ))}
        {(() => {
          const sp = ANSWERS.find(a => a.isSpangram);
          const done = foundIds.has(sp.id);
          return (
            <Chip found={done} spangram>
              {done ? `${decodeName(sp.id)} (spangram)` : '? spangram'}
            </Chip>
          );
        })()}
      </div>

      {/* ── Hint button ── */}
      <div style={{ maxWidth: 620, margin: '0 auto', padding: '0 4px' }}>
        <button onClick={doHint} style={{ fontSize: 13 }}>
          Use hint (+30 s penalty)
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE CONTROLLER
// ─────────────────────────────────────────────────────────────────────────────
export default function GamePage() {
  const [screen,   setScreen]   = useState('home');
  const [username, setUsername] = useState('');
  const [result,   setResult]   = useState(null);

  const handleStart = name => { setUsername(name); setScreen('game'); };
  const handleWin   = (time, hints) => { setResult({ time, hints }); setScreen('won'); };
  const handleAgain = () => { setResult(null); setScreen('home'); };

  if (screen === 'home') return <HomeScreen onStart={handleStart} />;
  if (screen === 'won')  return <WonScreen username={username} time={result.time} hints={result.hints} onPlayAgain={handleAgain} />;
  return <GameBoard key={username} username={username} onWin={handleWin} />;
}
