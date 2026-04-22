export type Role = {
  id: string;
  company: string;
  title: string;
  location: string;
  start: string;
  end: string;
  accent: 'phos' | 'magenta' | 'amber';
  summary: string;
  bullets: string[];
  stack: string[];
};

export const roles: Role[] = [
  {
    id: 'shineteck',
    company: 'Shineteck Inc.',
    title: 'Security Analyst — SOC / Incident Response',
    location: 'College Park, MD',
    start: 'Jan 2024',
    end: 'Present',
    accent: 'phos',
    summary:
      'End-to-end SOC + detection engineering: Splunk ES and Sentinel KQL, CrowdStrike + Defender, Python SOAR, purple team.',
    bullets: [
      'Led IR for 200+ events (phishing, credential theft, lateral movement, cloud misconfig) — cut MTTR 40% by streamlining triage across Splunk ES + Sentinel.',
      'Designed, implemented, and tuned 80+ high-fidelity detections in SPL and KQL mapped to MITRE ATT&CK (T1078, T1059.001, T1566) — cut false positives on the top-10 noisiest rules by 60%.',
      'Built Python SOAR enrichment (VirusTotal, AbuseIPDB, internal CMDB) that eliminated ~3 hours/day of L1 manual lookup.',
      'Ran hypothesis-driven hunts across Falcon + Sentinel; converted 15+ undetected TTPs into permanent rules.',
      'Served as IR lead on two ransomware-adjacent investigations — containment, forensic preservation, blameless post-mortem.',
      'Authored quarterly tabletop exercises (supply chain, insider threat) consumed by a 3-person SOC team.',
      'Partnered with offensive security on purple-team engagements — closed persistence and defense-evasion gaps via new Sigma rules.',
      'Integrated MISP + commercial IOC feeds into Sentinel via Logic Apps + custom Python — automated 30-day IOC sunset to prevent stale alerts.',
    ],
    stack: ['Splunk ES', 'Sentinel KQL', 'CrowdStrike Falcon', 'Defender', 'Python', 'SOAR', 'Sigma', 'AWS', 'MITRE ATT&CK'],
  },
  {
    id: 'intellect',
    company: 'Intellect Design Arena Ltd.',
    title: 'Cybersecurity Analyst — Application Security',
    location: 'Hyderabad, India',
    start: 'Jun 2021',
    end: 'Dec 2023',
    accent: 'magenta',
    summary:
      '24x7 SOC + product security: DAST, SAST, OWASP Top 10, QRadar detection rules, CI/CD security gates.',
    bullets: [
      'Operated DAST + SAST against 40+ web apps; triaged 500+ findings, cut open critical/high vulns by 65% across the portfolio.',
      'Authored SIEM detection logic correlating app-layer attacks (SQLi, XSS, IDOR) with network + endpoint events — product security signals piped into SOC dashboards.',
      'Managed 24x7 SOC with QRadar + CrowdStrike EDR — triage, alert tuning, incident response across client environments.',
      'Created + refined detection rules on MITRE ATT&CK TTPs — reduced false positives 30% in QRadar.',
      'Integrated STIX threat-intel feeds into SIEM via Python — improved emerging-threat coverage.',
      'Reduced mean-time-to-patch from 21 → 7 days via pre-merge SAST gates + dependency scanning.',
      'Conducted internal pen tests of corporate-facing web properties; mapped every finding to ATT&CK for Enterprise.',
      'Delivered OWASP Top 10 + secure coding training to 30 developers; internal checklist adopted across 4 product teams.',
    ],
    stack: ['QRadar', 'Burp Suite', 'SAST/DAST', 'Python', 'OWASP Top 10', 'ServiceNow', 'ATT&CK'],
  },
  {
    id: 'jsecpy',
    company: 'JSecPy / Self-directed Research',
    title: 'Security Research & Tooling',
    location: 'Remote',
    start: '2020',
    end: 'Present',
    accent: 'amber',
    summary:
      'Open-source Python static-analysis toolkit + Sigma rule research. Detection-as-code lab for SPL / KQL / Sigma validation.',
    bullets: [
      'Built JSecPy — Python static-analysis toolkit that scans open-source web projects for OWASP Top 10 injection + misconfig patterns.',
      'Contributed Sigma-format detection research; experimented with integrating rules into Splunk + Elastic for validation.',
      'Maintain a personal detection-engineering lab (AWS + Sentinel trial + Splunk Free) for purple-team self-study.',
    ],
    stack: ['Python', 'Sigma', 'Splunk', 'Elastic', 'OWASP Top 10', 'AWS'],
  },
];
