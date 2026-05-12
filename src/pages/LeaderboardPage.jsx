import { useState, useEffect }        from 'react';
import { Link }                        from 'react-router-dom';
import { subscribeLeaderboard }        from '../firebase.js';
import { fmt, effSc }                  from '../data.js';

const C = {
  bg:      '#0b1120',
  surface: '#101d3a',
  raised:  '#152244',
  border:  '#1e3a6e',
  text:    '#e2e8f0',
  muted:   '#94a3b8',
  faint:   '#475569',
  accent:  '#38bdf8',
  span:    '#f59e0b',
  green:   '#22c55e',
  gold:    '#fbbf24',
  silver:  '#94a3b8',
  bronze:  '#c2855a',
};

const MEDAL = ['1st', '2nd', '3rd'];

export default function LeaderboardPage() {
  const [rows,    setRows]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

useEffect(() => {
  let unsub;

  const timeout = setTimeout(() => {
    setLoading(false);
    setError('Could not load scores — check Firebase rules.');
  }, 8000);

  try {
    unsub = subscribeLeaderboard(data => {
      clearTimeout(timeout);
      setRows(data);
      setLoading(false);
    });
  } catch (e) {
    clearTimeout(timeout);
    setLoading(false);
    setError('Firebase error: ' + e.message);
  }

  return () => { clearTimeout(timeout); if (unsub) unsub(); };
}, []);

  const rankColor = i =>
    i === 0 ? C.gold : i === 1 ? C.silver : i === 2 ? C.bronze : C.faint;

  return (
    <div style={{ minHeight: '100vh', background: C.bg, padding: '1.5rem 1rem' }}>
      <div style={{ maxWidth: 560, margin: '0 auto' }}>

        {/* ── Header ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: '1.5rem' }}>
          <Link to="/">
            <button style={{ padding: '7px 14px', fontSize: 13 }}>Back</button>
          </Link>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: C.accent, letterSpacing: 1 }}>
              LEADERBOARD
            </div>
            <div style={{ fontSize: 12, color: C.muted }}>
              Threat Strands · Technology Risk Edition
            </div>
          </div>
        </div>

        {/* ── Legend ── */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10,
                      padding: '10px 16px', marginBottom: '1rem', fontSize: 12, color: C.muted }}>
          Ranked by completion time. Each hint used adds 30 s to your score.
          Live updates every time a player finishes.
        </div>

        {/* ── Table ── */}
        {loading && (
          <div style={{ textAlign: 'center', color: C.muted, padding: '3rem' }}>Loading…</div>
        )}

        {error && (
          <div style={{ background: '#3b0000', border: '1px solid #7f1d1d', borderRadius: 10,
                        padding: '1rem', color: '#fca5a5', fontSize: 13 }}>
            {error}
          </div>
        )}

        {!loading && !error && rows.length === 0 && (
          <div style={{ textAlign: 'center', color: C.muted, padding: '3rem' }}>
            No completions yet. Be the first to finish!
          </div>
        )}

        {!loading && !error && rows.length > 0 && (
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden' }}>

            {/* table header */}
            <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr 90px 60px 70px',
                          padding: '10px 16px', borderBottom: `1px solid ${C.border}`,
                          fontSize: 11, color: C.faint, letterSpacing: '1px' }}>
              <span>#</span>
              <span>NAME</span>
              <span style={{ textAlign: 'right' }}>TIME</span>
              <span style={{ textAlign: 'right' }}>HINTS</span>
              <span style={{ textAlign: 'right' }}>SCORE</span>
            </div>

            {rows.map((r, i) => (
              <div
                key={r.username + i}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '40px 1fr 90px 60px 70px',
                  padding: '13px 16px',
                  borderBottom: i < rows.length - 1 ? `1px solid ${C.border}` : 'none',
                  background: i === 0 ? '#1a1400' : i < 3 ? C.raised : 'transparent',
                  alignItems: 'center',
                }}
              >
                {/* rank */}
                <div style={{ fontSize: i < 3 ? 15 : 14, fontWeight: 700, color: rankColor(i) }}>
                  {MEDAL[i] || `${i + 1}`}
                </div>

                {/* name + date */}
                <div>
                  <div style={{ fontSize: 15, fontWeight: i < 3 ? 700 : 400, color: C.text }}>
                    {r.username}
                  </div>
                  <div style={{ fontSize: 11, color: C.faint }}>{r.completedAt}</div>
                </div>

                {/* time */}
                <div style={{ textAlign: 'right', fontSize: 15, fontWeight: 600,
                              fontFamily: "'Courier New', monospace", color: C.green }}>
                  {fmt(r.time)}
                </div>

                {/* hints */}
                <div style={{ textAlign: 'right', fontSize: 14, color: r.hints > 0 ? C.span : C.faint }}>
                  {r.hints}
                </div>

                {/* effective score */}
                <div style={{ textAlign: 'right', fontSize: 13, color: C.muted,
                              fontFamily: "'Courier New', monospace" }}>
                  {fmt(effSc(r.time, r.hints))}
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: 12, color: C.faint }}>
          Best score per player · personal best only
        </div>
      </div>
    </div>
  );
}
