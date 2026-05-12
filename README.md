# Threat Strands — Technology Risk Edition

An NYT Strands-style word puzzle game for office events.

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure Firebase
1. Create a new Firebase project at https://console.firebase.google.com
2. Enable **Realtime Database** (start in test mode)
3. Copy your web app config into `src/firebase.js` — replace all `YOUR_*` placeholders

### 3. Update the base URL
In `vite.config.js`, change the `base` field to match your GitHub repo name:
```js
base: '/your-repo-name/',
```

### 4. Local development
```bash
npm run dev
```

### 5. Deploy to GitHub Pages
```bash
npm run build
```
Push the `dist/` folder to the `gh-pages` branch, or use the `gh-pages` npm package:
```bash
npm install -g gh-pages
gh-pages -d dist
```

---

## Game structure

| File | Purpose |
|------|---------|
| `src/data.js` | Grid, SHA-256 hashes, hints — no plain-text answers |
| `src/firebase.js` | Firebase init, saveScore, subscribeLeaderboard |
| `src/pages/GamePage.jsx` | Home → Game → Won screens |
| `src/pages/LeaderboardPage.jsx` | Separate leaderboard page (`/#/leaderboard`) |

## Answer security

Word names are stored as base64 strings (`id` field in `data.js`).  
Validation uses SHA-256 hashes of the selected letter string — two hashes per word (forward and reverse).  
The `hint` field is plain text and visible in source; it describes the concept without naming the word.
