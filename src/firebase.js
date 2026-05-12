import { initializeApp }                         from 'firebase/app';
import { getDatabase, ref, set, get, onValue }   from 'firebase/database';
import { effSc }                                  from './data.js';

// ─── TODO: Replace with your Firebase project config ─────────────────────────
// Get this from: Firebase console → Project settings → Your apps → Web app
const firebaseConfig = {
  apiKey:            'AIzaSyAvM5bN6efzUt74-AePLbe00ZJwuyUNy0Y',
  authDomain:        'tcco-strands.firebaseapp.com',
  databaseURL:       'https://tcco-strands-default-rtdb.asia-southeast1.firebasedatabase.app/',
  projectId:         'tcco-strands',
  storageBucket:     'tcco-strands.firebasestorage.app',
  messagingSenderId: '711693042283',
  appId:             '1:711693042283:web:cbbf17e10bcd85a15d672e',
};
// ─────────────────────────────────────────────────────────────────────────────

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);

// Sanitise username for use as a Firebase key
const safeKey = (name) => name.trim().replace(/[.#$\[\]/]/g, '_').slice(0, 40);

export const saveScore = async (username, time, hints) => {
  const key = safeKey(username);
  // Only update if this is a new personal best
  try {
    const snap = await get(ref(db, `scores/${key}`));
    if (snap.exists()) {
      const prev = snap.val();
      if (effSc(prev.time, prev.hints) <= effSc(time, hints)) return;
    }
  } catch { /* first save — proceed */ }

  await set(ref(db, `scores/${key}`), {
    username: username.trim(),
    time,
    hints,
    completedAt: new Date().toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
    }),
    timestamp: Date.now(),
  });
};

// Subscribe to live leaderboard updates; returns unsubscribe fn
export const subscribeLeaderboard = (callback) => {
  const unsubscribe = onValue(ref(db, 'scores'), (snap) => {
    if (!snap.exists()) { callback([]); return; }
    const rows = Object.values(snap.val());
    rows.sort((a, b) => effSc(a.time, a.hints) - effSc(b.time, b.hints));
    callback(rows);
  });
  return unsubscribe;
};
