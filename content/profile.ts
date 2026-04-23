export const profile = {
  name: 'Indu Lohith Narisetty',
  handle: 'indunarisetty',
  host: 'secops',
  pwd: '~',

  // Technical-first. Facts, not marketing.
  oneLine:
    'Detection engineer. SPL / KQL / Sigma / Falcon / AWS. Writes rules, chases alerts, automates triage.',

  // Raw whoami table — shown in boot + terminal
  whoami: [
    ['name',        'Indu Lohith Narisetty'],
    ['role',        'Detection Engineer · SOC · IR'],
    ['experience',  '4y'],
    ['stack',       'Splunk SPL · Sentinel KQL · Sigma · Falcon · Defender · AWS'],
    ['focus',       'detection-as-code · SOAR · purple-team · cloud IR'],
    ['frameworks',  'MITRE ATT&CK · D3FEND · NIST 800-61 · Cyber Kill Chain'],
    ['location',    'US East'],
    ['shell',       '/bin/zsh'],
    ['editor',      'vim'],
  ] as const satisfies readonly (readonly [string, string])[],

  // Keep raw facts — these drive the site, not marketing copy.
  location: 'United States',
  email: 'indulohithnarisetty@gmail.com',
  phone: '+1 551 339 8748',
  linkedin: 'https://www.linkedin.com/in/indu-lohith-narisetty/',
  github: 'https://github.com/indulohithnarisetty',
  resumeUrl: '/resume.pdf',
  yearsExperience: 4,

  // ASCII figlet banner — shown on boot + landing
  // figlet -f "ANSI Shadow" -w 300 "INDU LOHITH NARISETTY"
  asciiBanner: `
██╗███╗   ██╗██████╗ ██╗   ██╗    ██╗      ██████╗ ██╗  ██╗██╗████████╗██╗  ██╗    ███╗   ██╗ █████╗ ██████╗ ██╗███████╗███████╗████████╗████████╗██╗   ██╗
██║████╗  ██║██╔══██╗██║   ██║    ██║     ██╔═══██╗██║  ██║██║╚══██╔══╝██║  ██║    ████╗  ██║██╔══██╗██╔══██╗██║██╔════╝██╔════╝╚══██╔══╝╚══██╔══╝╚██╗ ██╔╝
██║██╔██╗ ██║██║  ██║██║   ██║    ██║     ██║   ██║███████║██║   ██║   ███████║    ██╔██╗ ██║███████║██████╔╝██║███████╗█████╗     ██║      ██║    ╚████╔╝
██║██║╚██╗██║██║  ██║██║   ██║    ██║     ██║   ██║██╔══██║██║   ██║   ██╔══██║    ██║╚██╗██║██╔══██║██╔══██╗██║╚════██║██╔══╝     ██║      ██║     ╚██╔╝
██║██║ ╚████║██████╔╝╚██████╔╝    ███████╗╚██████╔╝██║  ██║██║   ██║   ██║  ██║    ██║ ╚████║██║  ██║██║  ██║██║███████║███████╗   ██║      ██║      ██║
╚═╝╚═╝  ╚═══╝╚═════╝  ╚═════╝     ╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚═╝   ╚═╝   ╚═╝  ╚═╝    ╚═╝  ╚═══╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝╚══════╝╚══════╝   ╚═╝      ╚═╝      ╚═╝`,

  asciiBannerSmall: `
▄▄▄▄▄▄▄▄  ▄▄▄▄▄  ▄▄▄▄▄  ▄▄▄▄▄  ▄▄     ▄▄  ▄▄▄▄▄ ▄▄▄▄▄▄ ▄▄▄▄▄ ▄▄▄▄▄▄
DETECTION · TRIAGE · INVESTIGATION · AUTOMATION · PURPLE TEAM · CLOUD IR`,

  // Kept for compatibility with older components
  pitch: 'Detection engineer. SPL / KQL / Sigma / Falcon / AWS.',
  shortPitch: 'Detections. Investigations. Automation.',
  roleTargets: [
    'Detection Engineering',
    'Senior SOC / IR',
    'Security Operations Engineer',
    'Purple Team',
    'Cloud Security (AWS / Azure)',
  ],
  availability: 'open — US East, remote',
  tagline: 'detection-as-code · live IR · zero marketing copy',
} as const;

export type Profile = typeof profile;
