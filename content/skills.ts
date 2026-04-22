export type SkillLevel = 'expert' | 'strong' | 'working' | 'familiar';

export type Skill = {
  name: string;
  level: SkillLevel;
  note?: string;
};

export type SkillGroup = {
  id: string;
  label: string;
  accent: 'phos' | 'magenta' | 'amber';
  skills: Skill[];
};

export const skillGroups: SkillGroup[] = [
  {
    id: 'siem-detection',
    label: 'SIEM & Detection Engineering',
    accent: 'phos',
    skills: [
      { name: 'Splunk Enterprise Security', level: 'expert', note: 'SPL, dashboards, correlation searches' },
      { name: 'Splunk SPL', level: 'expert' },
      { name: 'Microsoft Sentinel', level: 'expert', note: 'KQL, analytic rules, Logic Apps' },
      { name: 'KQL', level: 'expert' },
      { name: 'Sigma Rules', level: 'strong', note: 'detection-as-code authoring' },
      { name: 'IBM QRadar', level: 'strong', note: '24x7 SOC ops at Intellect' },
      { name: 'Detection-as-Code', level: 'strong' },
      { name: 'Alert Tuning', level: 'expert', note: '60% FP reduction on top-10 noisiest rules' },
      { name: 'Log Pipeline Optimization', level: 'strong' },
    ],
  },
  {
    id: 'ir-hunting',
    label: 'Incident Response & Threat Hunting',
    accent: 'magenta',
    skills: [
      { name: 'NIST IR Lifecycle', level: 'expert' },
      { name: 'MITRE ATT&CK TTP Mapping', level: 'expert' },
      { name: 'Purple Team', level: 'strong' },
      { name: 'Tabletop Exercises', level: 'strong', note: 'supply chain & insider threat scenarios' },
      { name: 'Threat Intel (MISP, VT, AbuseIPDB)', level: 'expert' },
      { name: 'IOC Enrichment & Pivoting', level: 'expert' },
      { name: 'Forensic Analysis', level: 'strong', note: 'Cuckoo, Autopsy, memory analysis' },
      { name: 'Ransomware IR', level: 'strong', note: 'led 2 ransomware-adjacent investigations' },
      { name: 'Post-incident Reporting', level: 'strong' },
    ],
  },
  {
    id: 'edr-endpoint',
    label: 'EDR & Endpoint',
    accent: 'phos',
    skills: [
      { name: 'CrowdStrike Falcon', level: 'strong' },
      { name: 'Microsoft Defender for Endpoint', level: 'expert' },
      { name: 'SentinelOne', level: 'working' },
      { name: 'YARA Rule Writing', level: 'strong' },
      { name: 'Endpoint Telemetry Analysis', level: 'expert' },
      { name: 'Malware Triage', level: 'strong' },
    ],
  },
  {
    id: 'cloud',
    label: 'Cloud Security',
    accent: 'amber',
    skills: [
      { name: 'AWS GuardDuty', level: 'strong' },
      { name: 'AWS Security Hub', level: 'strong' },
      { name: 'AWS CloudTrail', level: 'expert' },
      { name: 'AWS Config', level: 'strong' },
      { name: 'AWS IAM', level: 'strong' },
      { name: 'Azure Security Center / Defender', level: 'strong' },
      { name: 'AWS WAF & Imperva', level: 'working' },
      { name: 'CSPM Concepts', level: 'working' },
      { name: 'Zero Trust Networking', level: 'familiar' },
    ],
  },
  {
    id: 'appsec',
    label: 'Application & Product Security',
    accent: 'magenta',
    skills: [
      { name: 'OWASP Top 10', level: 'expert' },
      { name: 'DAST — Burp Suite', level: 'strong' },
      { name: 'SAST', level: 'strong' },
      { name: 'Secure SDLC', level: 'strong' },
      { name: 'Vulnerability Mgmt — Nessus / Qualys', level: 'strong' },
      { name: 'CVSS Scoring', level: 'strong' },
      { name: 'Internal Pen Testing', level: 'working' },
      { name: 'Metasploit / Nmap / SQLmap / Nikto / ZAP', level: 'working' },
    ],
  },
  {
    id: 'iam',
    label: 'Identity & Access',
    accent: 'phos',
    skills: [
      { name: 'SAML 2.0', level: 'strong' },
      { name: 'OAuth 2.0 / OIDC', level: 'strong' },
      { name: 'SCIM Provisioning', level: 'working' },
      { name: 'RBAC & Least Privilege', level: 'strong' },
      { name: 'MFA / SSO / PAM', level: 'strong' },
      { name: 'Active Directory', level: 'strong' },
    ],
  },
  {
    id: 'automation',
    label: 'Scripting & Automation',
    accent: 'phos',
    skills: [
      { name: 'Python (requests, pandas, boto3)', level: 'expert' },
      { name: 'SOAR Playbooks', level: 'expert', note: 'Sentinel Logic Apps + custom connectors' },
      { name: 'Bash', level: 'strong' },
      { name: 'PowerShell', level: 'working' },
      { name: 'REST API Integration', level: 'expert' },
      { name: 'Detection CI/CD', level: 'strong' },
    ],
  },
  {
    id: 'network',
    label: 'Network Security',
    accent: 'amber',
    skills: [
      { name: 'Firewalls / IDS / IPS', level: 'strong' },
      { name: 'VPN / NAC', level: 'strong' },
      { name: 'TCP/IP, DNS, HTTP/S', level: 'expert' },
      { name: 'Wireshark', level: 'strong' },
      { name: 'Snort', level: 'working' },
      { name: 'DLP', level: 'strong' },
    ],
  },
  {
    id: 'frameworks',
    label: 'Frameworks & Compliance',
    accent: 'magenta',
    skills: [
      { name: 'NIST CSF', level: 'strong' },
      { name: 'NIST 800-53', level: 'strong' },
      { name: 'ISO 27001', level: 'working' },
      { name: 'SOC 2 Control Mapping', level: 'working' },
      { name: 'PCI DSS', level: 'familiar' },
      { name: 'HIPAA / GDPR', level: 'familiar' },
      { name: 'MITRE ATT&CK (Enterprise + Cloud)', level: 'expert' },
      { name: 'ServiceNow SIR', level: 'strong' },
    ],
  },
];

export const LEVEL_WEIGHT: Record<SkillLevel, number> = {
  expert: 4,
  strong: 3,
  working: 2,
  familiar: 1,
};

export const LEVEL_LABEL: Record<SkillLevel, string> = {
  expert: 'EXPERT',
  strong: 'STRONG',
  working: 'WORKING',
  familiar: 'FAMILIAR',
};
