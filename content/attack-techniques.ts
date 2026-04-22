export type Tactic =
  | 'initial-access'
  | 'execution'
  | 'persistence'
  | 'privilege-escalation'
  | 'defense-evasion'
  | 'credential-access'
  | 'discovery'
  | 'lateral-movement'
  | 'collection'
  | 'command-control'
  | 'exfiltration'
  | 'impact';

export type Coverage = 'hunt' | 'detect' | 'investigate' | 'aware';

export type Technique = {
  id: string;
  name: string;
  tactic: Tactic;
  coverage: Coverage;
  tooling: string[];
  note: string;
  query?: { lang: 'SPL' | 'KQL' | 'Sigma'; snippet: string };
};

export const TACTIC_LABEL: Record<Tactic, string> = {
  'initial-access': 'Initial Access',
  execution: 'Execution',
  persistence: 'Persistence',
  'privilege-escalation': 'Privilege Escalation',
  'defense-evasion': 'Defense Evasion',
  'credential-access': 'Credential Access',
  discovery: 'Discovery',
  'lateral-movement': 'Lateral Movement',
  collection: 'Collection',
  'command-control': 'Command & Control',
  exfiltration: 'Exfiltration',
  impact: 'Impact',
};

export const COVERAGE_META: Record<
  Coverage,
  { label: string; weight: number; colorClass: string; bar: string }
> = {
  detect:     { label: 'Deployed Detection',  weight: 4, colorClass: 'bg-phos/70 text-ink-950 border-phos',             bar: 'bg-phos' },
  hunt:       { label: 'Active Hunt',          weight: 3, colorClass: 'bg-magenta/60 text-ink-950 border-magenta',       bar: 'bg-magenta' },
  investigate:{ label: 'Investigated IR',      weight: 2, colorClass: 'bg-amber-400/50 text-ink-950 border-amber-400',   bar: 'bg-amber-400' },
  aware:      { label: 'Familiar',             weight: 1, colorClass: 'bg-ink-600 text-slate-300 border-ink-600',         bar: 'bg-ink-600' },
};

export const techniques: Technique[] = [
  // INITIAL ACCESS
  {
    id: 'T1566',
    name: 'Phishing',
    tactic: 'initial-access',
    coverage: 'detect',
    tooling: ['Sentinel KQL', 'Defender for O365', 'Proofpoint'],
    note: 'Live rule correlating malicious URL click + auth token use from new ASN.',
    query: {
      lang: 'KQL',
      snippet:
        '// T1566 — phishing click + token use from new ASN\nlet bad = EmailUrlInfo | where ThreatTypes has_any ("Phish","Malware") | project Url, NetworkMessageId, RecipientEmailAddress;\nUrlClickEvents | join kind=inner bad on Url | join kind=inner (\n  SigninLogs | where TimeGenerated > ago(1h) | project UserPrincipalName, IPAddress, AutonomousSystemNumber\n) on $left.RecipientEmailAddress == $right.UserPrincipalName\n| summarize clicks=count() by RecipientEmailAddress, IPAddress, AutonomousSystemNumber;',
    },
  },
  {
    id: 'T1190',
    name: 'Exploit Public-Facing Application',
    tactic: 'initial-access',
    coverage: 'hunt',
    tooling: ['Splunk ES', 'Imperva', 'AWS WAF'],
    note: 'Hunts on WAF block spikes + 5xx bursts + outbound reverse shell patterns.',
    query: {
      lang: 'SPL',
      snippet:
        '| tstats count from datamodel=Web where Web.status>=500 by Web.src,Web.dest,_time span=5m\n| eventstats avg(count) as avg stdev(count) as sd by Web.dest\n| where count > avg + 3*sd',
    },
  },
  {
    id: 'T1078',
    name: 'Valid Accounts',
    tactic: 'initial-access',
    coverage: 'detect',
    tooling: ['Sentinel KQL', 'Defender for Identity', 'AWS CloudTrail'],
    note: 'Impossible-travel + unusual IP ASN + legacy-auth protocol fan-out.',
    query: {
      lang: 'KQL',
      snippet:
        'SigninLogs\n| where ResultType == 0\n| summarize countries=dcount(Location), asns=make_set(AutonomousSystemNumber) by UserPrincipalName, bin(TimeGenerated, 30m)\n| where countries > 1 or array_length(asns) > 2',
    },
  },

  // EXECUTION
  {
    id: 'T1059.001',
    name: 'PowerShell',
    tactic: 'execution',
    coverage: 'detect',
    tooling: ['Sentinel KQL', 'Defender for Endpoint', 'Splunk'],
    note: 'Encoded / obfuscated invocations, IEX Net.WebClient, AMSI bypass strings.',
    query: {
      lang: 'KQL',
      snippet:
        'DeviceProcessEvents\n| where FileName =~ "powershell.exe"\n| where ProcessCommandLine has_any ("FromBase64String","-enc ","IEX (New-Object Net.WebClient","AmsiUtils")',
    },
  },
  {
    id: 'T1059.003',
    name: 'Windows Command Shell',
    tactic: 'execution',
    coverage: 'detect',
    tooling: ['Falcon', 'Sentinel'],
    note: 'LOLBins chained from Office parent processes.',
  },
  {
    id: 'T1204.002',
    name: 'Malicious File',
    tactic: 'execution',
    coverage: 'detect',
    tooling: ['Defender', 'Cuckoo sandbox'],
    note: 'Office-spawned wscript/mshta from email vector.',
  },

  // PERSISTENCE
  {
    id: 'T1547.001',
    name: 'Registry Run Keys',
    tactic: 'persistence',
    coverage: 'detect',
    tooling: ['Sentinel', 'Defender for Endpoint', 'Sigma'],
    note: 'Sigma rule shipped — new Run/RunOnce values from non-installer process.',
    query: {
      lang: 'Sigma',
      snippet:
        'title: Suspicious Run Key Modification\nlogsource: { category: registry_event, product: windows }\ndetection:\n  selection:\n    TargetObject|contains: "\\\\CurrentVersion\\\\Run"\n    Image|endswith:\n      - "\\\\powershell.exe"\n      - "\\\\wscript.exe"\n      - "\\\\mshta.exe"\n  condition: selection\nlevel: high',
    },
  },
  {
    id: 'T1098',
    name: 'Account Manipulation',
    tactic: 'persistence',
    coverage: 'hunt',
    tooling: ['AWS CloudTrail', 'Sentinel'],
    note: 'IAM role trust policy changes outside of change windows.',
  },
  {
    id: 'T1136',
    name: 'Create Account',
    tactic: 'persistence',
    coverage: 'detect',
    tooling: ['Sentinel', 'AD audit'],
    note: 'New local/cloud account + immediate privileged group add.',
  },

  // PRIV ESC
  {
    id: 'T1068',
    name: 'Exploitation for Priv Esc',
    tactic: 'privilege-escalation',
    coverage: 'investigate',
    tooling: ['Defender', 'Falcon'],
    note: 'Patch-gap monitoring via Nessus + Defender TVM overlay.',
  },
  {
    id: 'T1134',
    name: 'Access Token Manipulation',
    tactic: 'privilege-escalation',
    coverage: 'hunt',
    tooling: ['Sysmon', 'Sentinel'],
    note: 'Hunt on SeImpersonate usage by non-service accounts.',
  },

  // DEFENSE EVASION
  {
    id: 'T1027',
    name: 'Obfuscated Files / Information',
    tactic: 'defense-evasion',
    coverage: 'detect',
    tooling: ['Splunk', 'Sentinel'],
    note: 'Entropy + base64 length heuristics on command line.',
  },
  {
    id: 'T1562.001',
    name: 'Disable Security Tools',
    tactic: 'defense-evasion',
    coverage: 'detect',
    tooling: ['Defender for Endpoint', 'Falcon'],
    note: 'AV/EDR service stop or tamper-protection disable.',
  },
  {
    id: 'T1070.004',
    name: 'File Deletion',
    tactic: 'defense-evasion',
    coverage: 'hunt',
    tooling: ['Sysmon', 'Sentinel'],
    note: 'Bulk deletion of Windows event logs or shadow copies.',
  },

  // CREDENTIAL ACCESS
  {
    id: 'T1003',
    name: 'OS Credential Dumping',
    tactic: 'credential-access',
    coverage: 'detect',
    tooling: ['Defender for Endpoint', 'Falcon', 'Sentinel'],
    note: 'LSASS access by non-benign process + MiniDump signatures.',
    query: {
      lang: 'KQL',
      snippet:
        'DeviceEvents\n| where ActionType == "ProcessAccessOperation"\n| where InitiatingProcessFileName !in~ ("MsMpEng.exe","csrss.exe","lsass.exe")\n| where AdditionalFields has "lsass.exe" and AdditionalFields has "0x1010"',
    },
  },
  {
    id: 'T1110',
    name: 'Brute Force',
    tactic: 'credential-access',
    coverage: 'detect',
    tooling: ['Sentinel KQL', 'AWS CloudTrail'],
    note: 'Password spray — 1 password x many users, or rapid 4625 bursts.',
  },
  {
    id: 'T1552',
    name: 'Unsecured Credentials',
    tactic: 'credential-access',
    coverage: 'hunt',
    tooling: ['CloudTrail', 'GuardDuty'],
    note: 'Access-key leak detection via GuardDuty + secret scanning pipeline.',
  },

  // DISCOVERY
  {
    id: 'T1087',
    name: 'Account Discovery',
    tactic: 'discovery',
    coverage: 'hunt',
    tooling: ['Sentinel', 'AD audit'],
    note: 'Bulk LDAP recon from a single host within 5m window.',
  },
  {
    id: 'T1018',
    name: 'Remote System Discovery',
    tactic: 'discovery',
    coverage: 'hunt',
    tooling: ['Sysmon', 'Zeek/Snort'],
    note: 'Port-sweep signal using internal East-West flow data.',
  },

  // LATERAL MOVEMENT
  {
    id: 'T1021.001',
    name: 'Remote Services: RDP',
    tactic: 'lateral-movement',
    coverage: 'detect',
    tooling: ['Sentinel', 'AD'],
    note: '4624 Type 10 from workstation → workstation, cross-segment.',
  },
  {
    id: 'T1021.002',
    name: 'SMB / Admin Shares',
    tactic: 'lateral-movement',
    coverage: 'detect',
    tooling: ['Sentinel', 'Defender for Identity'],
    note: 'ADMIN$ / C$ access from non-admin hosts.',
  },
  {
    id: 'T1021.006',
    name: 'WinRM',
    tactic: 'lateral-movement',
    coverage: 'hunt',
    tooling: ['Sysmon', 'Splunk'],
    note: 'wsmprovhost.exe child processes as hunt signal.',
  },

  // COLLECTION
  {
    id: 'T1005',
    name: 'Data from Local System',
    tactic: 'collection',
    coverage: 'investigate',
    tooling: ['DLP', 'Defender'],
    note: 'Bulk archive creation before network write.',
  },
  {
    id: 'T1114',
    name: 'Email Collection',
    tactic: 'collection',
    coverage: 'detect',
    tooling: ['Sentinel', 'Defender for O365'],
    note: 'New inbox forwarding rule to external domain.',
    query: {
      lang: 'KQL',
      snippet:
        'OfficeActivity\n| where Operation in ("New-InboxRule","Set-InboxRule")\n| where Parameters has "ForwardTo" and Parameters has "@" and not (Parameters has "@contoso.com")\n| project TimeGenerated, UserId, Parameters',
    },
  },

  // C2
  {
    id: 'T1071.001',
    name: 'Web Protocols (C2)',
    tactic: 'command-control',
    coverage: 'detect',
    tooling: ['Zeek', 'Splunk ES', 'Falcon'],
    note: 'Beaconing detection on JA3 + interval entropy.',
  },
  {
    id: 'T1573',
    name: 'Encrypted Channel',
    tactic: 'command-control',
    coverage: 'hunt',
    tooling: ['Zeek'],
    note: 'Self-signed cert + unusual SNI + low-reputation ASN.',
  },
  {
    id: 'T1090',
    name: 'Proxy',
    tactic: 'command-control',
    coverage: 'hunt',
    tooling: ['FW logs', 'Splunk'],
    note: 'TOR / fast-flux / residential-proxy egress detection.',
  },

  // EXFIL
  {
    id: 'T1048',
    name: 'Exfiltration Over Alt Protocol',
    tactic: 'exfiltration',
    coverage: 'detect',
    tooling: ['DLP', 'Sentinel'],
    note: 'DNS/ICMP size anomaly; outbound volume spike tied to DLP match.',
  },
  {
    id: 'T1537',
    name: 'Transfer to Cloud Account',
    tactic: 'exfiltration',
    coverage: 'detect',
    tooling: ['AWS CloudTrail', 'GuardDuty'],
    note: 'S3 PutObject bursts to external bucket / cross-account share.',
    query: {
      lang: 'SPL',
      snippet:
        'index=aws sourcetype=aws:cloudtrail eventName=PutObject\n| eval external=if(match(requestParameters.bucketName,"^(?!my-org-).+$"),1,0)\n| stats sum(external) as ext by userIdentity.arn, bin(_time, 5m)\n| where ext > 50',
    },
  },

  // IMPACT
  {
    id: 'T1486',
    name: 'Data Encrypted for Impact',
    tactic: 'impact',
    coverage: 'investigate',
    tooling: ['Defender', 'Falcon', 'Sentinel'],
    note: 'Ransomware-adjacent IR led x2; canary file + shadow-copy deletion signal.',
  },
  {
    id: 'T1485',
    name: 'Data Destruction',
    tactic: 'impact',
    coverage: 'hunt',
    tooling: ['Falcon', 'Sentinel'],
    note: 'cipher.exe /w, sdelete, vssadmin delete shadows chained events.',
  },
];
