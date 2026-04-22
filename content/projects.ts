export type Project = {
  slug: string;
  title: string;
  tagline: string;
  role: 'solo' | 'lead' | 'contributor';
  status: 'shipped' | 'active' | 'research';
  accent: 'phos' | 'magenta' | 'amber';
  domain: ('detection' | 'appsec' | 'cloud' | 'automation' | 'research')[];
  metrics: { label: string; value: string }[];
  stack: string[];
  summary: string;
  attack?: string[];
  repo?: string;
  demo?: string;
};

export const projects: Project[] = [
  {
    slug: 'jsecpy',
    title: 'JSecPy',
    tagline: 'Python static-analysis toolkit for OWASP Top 10 detection',
    role: 'solo',
    status: 'active',
    accent: 'magenta',
    domain: ['appsec', 'research'],
    metrics: [
      { label: 'Rules', value: '40+' },
      { label: 'OWASP Top 10', value: 'A01–A10' },
      { label: 'Output', value: 'Sigma + SARIF' },
    ],
    stack: ['Python', 'AST', 'Sigma', 'SARIF', 'OWASP Top 10'],
    summary:
      'Static-analysis toolkit scanning Python/JS web projects for OWASP Top 10 patterns. Produces Sigma + SARIF output for pipeline integration.',
    attack: ['T1190', 'T1059'],
  },
  {
    slug: 'soar-enrichment-pipeline',
    title: 'SOAR Enrichment Pipeline',
    tagline: 'Python microservice that triples L1 triage throughput',
    role: 'solo',
    status: 'shipped',
    accent: 'phos',
    domain: ['automation', 'detection'],
    metrics: [
      { label: 'L1 time saved', value: '~3 hrs/day' },
      { label: 'Triage speedup', value: '30% faster' },
      { label: 'Sources', value: 'VT · AbuseIPDB · CMDB' },
    ],
    stack: ['Python', 'Sentinel Logic Apps', 'REST APIs', 'Slack'],
    summary:
      'Webhook-driven enrichment service that ingests Sentinel alerts, pulls VirusTotal + AbuseIPDB reputation + internal CMDB asset owner/criticality, and posts formatted context into the SOC Slack channel before an analyst opens the alert.',
  },
  {
    slug: 'mitre-coverage-map',
    title: 'MITRE ATT&CK Detection Coverage Map',
    tagline: 'Live heatmap of deployed SPL/KQL detections vs. ATT&CK Enterprise',
    role: 'lead',
    status: 'shipped',
    accent: 'magenta',
    domain: ['detection'],
    metrics: [
      { label: 'Techniques covered', value: '80+' },
      { label: 'Detection sources', value: '4' },
      { label: 'Backlog prioritized', value: 'Yes' },
    ],
    stack: ['Splunk', 'Sentinel', 'Python', 'ATT&CK Navigator JSON'],
    summary:
      'Visual coverage matrix comparing deployed detections (Splunk + Sentinel) against ATT&CK Enterprise. Used by the SOC to prioritize detection engineering backlog and surface uncovered tactics.',
    demo: '/attack-matrix',
  },
  {
    slug: 'aws-cloud-detection-baseline',
    title: 'AWS Cloud Detection Baseline',
    tagline: 'Multi-account GuardDuty + CloudTrail + Config detection baseline',
    role: 'lead',
    status: 'shipped',
    accent: 'amber',
    domain: ['cloud', 'detection'],
    metrics: [
      { label: 'Sentinel KQL analytics', value: '20+' },
      { label: 'AWS accounts', value: 'Multi-org' },
      { label: 'Coverage', value: 'IAM · S3 · EC2' },
    ],
    stack: ['AWS GuardDuty', 'CloudTrail', 'Config', 'Sentinel KQL', 'IAM'],
    summary:
      'Deployed GuardDuty + CloudTrail + Config across a multi-account AWS organization. Authored 20+ Sentinel KQL analytics for anomalous IAM, S3, and EC2 activity mapped to Cloud ATT&CK.',
    attack: ['T1078.004', 'T1098', 'T1537'],
  },
  {
    slug: 'sigma-detection-library',
    title: 'Sigma Detection Library',
    tagline: 'Personal detection-as-code repo — Splunk + Elastic validated',
    role: 'solo',
    status: 'active',
    accent: 'phos',
    domain: ['detection', 'research'],
    metrics: [
      { label: 'Rules', value: 'growing' },
      { label: 'Backends', value: 'Splunk · Elastic · Sentinel' },
      { label: 'CI', value: 'pysigma-lint' },
    ],
    stack: ['Sigma', 'pysigma', 'GitHub Actions', 'Splunk', 'Elastic'],
    summary:
      'Open, growing library of Sigma rules mapped to ATT&CK, lint-gated via pysigma, and validated against Splunk Free + Elastic trial labs. Serves as the research arm of my detection engineering.',
  },
  {
    slug: 'phishing-triage-playbook',
    title: 'Phishing Triage Playbook',
    tagline: 'The IR flow behind the Triage-This-Alert simulator on this site',
    role: 'solo',
    status: 'shipped',
    accent: 'magenta',
    domain: ['detection', 'automation'],
    metrics: [
      { label: 'Avg triage', value: '< 15m' },
      { label: 'Containment', value: 'scripted' },
      { label: 'User click rate', value: '-27% after training' },
    ],
    stack: ['Sentinel', 'Defender for O365', 'Proofpoint', 'Python'],
    summary:
      'End-to-end phishing IR playbook: click verification → mailbox scope → session revocation + legacy-auth kill → inbox-rule sweep → blameless post-mortem. Drives the Triage This Alert demo on this site.',
    demo: '/triage',
    attack: ['T1566', 'T1078', 'T1114'],
  },
  {
    slug: 'purple-team-coverage-exercise',
    title: 'Purple-Team Coverage Exercise',
    tagline: 'Offense replays → measurable Persistence + Defense-Evasion coverage uplift',
    role: 'contributor',
    status: 'shipped',
    accent: 'magenta',
    domain: ['detection', 'research'],
    metrics: [
      { label: 'Tactics covered', value: '+2' },
      { label: 'Rules authored', value: '12' },
      { label: 'False positive budget', value: '< 5%' },
    ],
    stack: ['Atomic Red Team', 'Sigma', 'Sentinel', 'Splunk', 'ATT&CK'],
    summary:
      'Ran Atomic Red Team TTPs across the environment; mapped detection gaps against ATT&CK; shipped 12 Sigma rules closing Persistence + Defense-Evasion holes.',
    attack: ['T1547.001', 'T1027', 'T1562.001'],
  },
  {
    slug: 'service-account-baseline',
    title: 'Service-Account Baseline Monitor',
    tagline: 'Out-of-profile detection for non-human identities',
    role: 'solo',
    status: 'shipped',
    accent: 'amber',
    domain: ['detection', 'cloud'],
    metrics: [
      { label: 'Accounts monitored', value: 'all' },
      { label: 'Refresh', value: 'weekly' },
      { label: 'Detections fired', value: 'in production' },
    ],
    stack: ['Splunk', 'Python', 'Active Directory', 'IAM'],
    summary:
      "Weekly job that rebuilds per-service-account baselines (hosts, shares, cloud APIs) and alerts on out-of-profile behaviour. Catches the classic 'service account used for lateral movement' pattern.",
    attack: ['T1078.002', 'T1021.002'],
  },
];
