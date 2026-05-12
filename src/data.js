//New Comment
//New Cooment
export const GRID = [
  ['C','P','H','I','S','H','I','N','G','V'],
  ['K','O','M','F','A','B','Z','Q','J','M'],
  ['Y','B','M','T','H','R','E','A','T','A'],
  ['D','R','G','P','X','Z','K','Q','J','L'],
  ['U','E','W','D','L','S','S','O','V','W'],
  ['B','A','Z','G','K','I','J','Q','X','A'],
  ['N','C','V','P','N','Z','A','K','Y','R'],
  ['F','H','Q','X','W','Z','G','N','V','E'],
  ['E','X','P','L','O','I','T','D','C','J'],
  ['S','F','I','R','E','W','A','L','L','E'],
];

export const ANSWERS = [
  {
    id: 'Q09NUExJQU5DRQ==',
    hashes: [
      '6399394ad051703c43886ad5e16952a2f8d1a6f0654ed49c99aa821c5f385bb0',
      '558d09cf36af25fd9eef9f734c1f7205b124caf9f54bec880d22b320a7b713c8',
    ],
    isSpangram: true,
    path: [[0,0],[1,1],[2,2],[3,3],[4,4],[5,5],[6,6],[7,7],[8,8],[9,9]],
    hint: 'Adherence to rules, laws and regulations',
  },
  {
    id: 'UEhJU0hJTkc=',
    hashes: [
      '7795096b5328d0505b1600ab33d32e10f5aa046c4f1a50456479b1ac717b6157',
      '25f8b1695541766f8bbde8613f6b82a1c58223c5b6f695d20dc4e137e481a4f8',
    ],
    isSpangram: false,
    path: [[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7],[0,8]],
    hint: 'Deceptive email-based social engineering',
  },
  {
    id: 'TUZB',
    hashes: [
      'd39ce05308e4ec6d55d3599061c99041fece213b56e0938125661670df668ff8',
      '57d6d052856ea0644ed83e4846fe536d8503476589b32837afe105b02d29079d',
    ],
    isSpangram: false,
    path: [[1,2],[1,3],[1,4]],
    hint: 'Multi-factor authentication — requires a second verification step',
  },
  {
    id: 'TUFMV0FSRQ==',
    hashes: [
      'd789d09c824e58b32812a9bd684eb065e4422de629261c3fd1e39ce0e1d28112',
      'cae1dda2cda87275fe16c92ee609ba2f58d4b6bec744da9da619dc6f5770fbae',
    ],
    isSpangram: false,
    path: [[1,9],[2,9],[3,9],[4,9],[5,9],[6,9],[7,9]],
    hint: 'Malicious software designed to harm systems',
  },
  {
    id: 'VEhSRUFU',
    hashes: [
      'c9aed7878c6f81c063e9ad075f21880e0c56a07b0f8d354315bc7d612476d877',
      '311032e95be4d11847786d31c8b76d48ef990c850221c1e5438a8f759a8f2e24',
    ],
    isSpangram: false,
    path: [[2,3],[2,4],[2,5],[2,6],[2,7],[2,8]],
    hint: 'Potential danger or risk to security',
  },
  {
    id: 'QlJFQUNI',
    hashes: [
      'f49adad303e810f9a9a5ce58e2fddf4bb24b9d998ca942c9bc0275356c4a6322',
      'cf6187ed1ccfb17bc47c5e8bc7cc43bbb0ed4d274b6572fcd6db033e964ee472',
    ],
    isSpangram: false,
    path: [[2,1],[3,1],[4,1],[5,1],[6,1],[7,1]],
    hint: 'Unauthorised exposure of sensitive data',
  },
  {
    id: 'U1NP',
    hashes: [
      '5ba3ac9fc8e84781d64a1e45575d7f963e8b1fb3c703ccf9424570e87a0aaa2e',
      'f65eee41252d3974fd7f5f5616459af2096be55dcb07e79ef5c562a2774fea08',
    ],
    isSpangram: false,
    path: [[4,5],[4,6],[4,7]],
    hint: 'One login credential to access multiple systems',
  },
  {
    id: 'VlBO',
    hashes: [
      '2762a0671924e3e56ca5e1730e4990d920e6129e80b13540a21914ee0cd19eac',
      'efe18c1e6221506b075ca70e9745bb784fe06627645b895b83283c15705b5a0d',
    ],
    isSpangram: false,
    path: [[6,2],[6,3],[6,4]],
    hint: 'Encrypted tunnel for secure remote access',
  },
  {
    id: 'RVhQTE9JVA==',
    hashes: [
      '359b8fa404b77daa8f4ee96eddbfa8996cd015dc9ade1da8b0af77c8c5727ef2',
      'c46d2ef05edeb182fb25a19767abc9293a54589e1e6249292f1a725ec9e7ffe1',
    ],
    isSpangram: false,
    path: [[8,0],[8,1],[8,2],[8,3],[8,4],[8,5],[8,6]],
    hint: 'Code that takes advantage of a vulnerability',
  },
  {
    id: 'RklSRVdBTEw=',
    hashes: [
      '5eb606913ddd8a32f7c63654582551ac72df6bcf7a90d62e9387209639dfab5a',
      '9184a2be58b2369c5c549b912a86e231562e7ece6549c09ca7bb2c50d88671d5',
    ],
    isSpangram: false,
    path: [[9,1],[9,2],[9,3],[9,4],[9,5],[9,6],[9,7],[9,8]],
    hint: 'Network security barrier that filters traffic',
  },
];

export const TOTAL       = ANSWERS.length;
export const THEME_TOTAL = ANSWERS.filter(a => !a.isSpangram).length;
export const SPANGRAM_ID = ANSWERS.find(a => a.isSpangram).id;

export const decodeName = (b64) => atob(b64);

export const sha256 = async (str) => {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

export const fmt   = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
export const effSc = (t, h) => t + h * 30;
export const isAdj = (a, b) =>
  Math.abs(a[0] - b[0]) <= 1 && Math.abs(a[1] - b[1]) <= 1 &&
  !(a[0] === b[0] && a[1] === b[1]);
