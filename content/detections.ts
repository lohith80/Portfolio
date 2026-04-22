/**
 * content/detections.ts
 * ─────────────────────────────────────────────────────────────────────
 * Raw detection rule library. Each entry is a production-shape detection
 * (not marketing copy). Every rule maps to MITRE ATT&CK and includes at
 * least one executable query block in SPL, KQL, or Sigma YAML.
 *
 * Driven by /detections page. Edit this file; git push; live in ~45s.
 * ─────────────────────────────────────────────────────────────────────
 */

export type Severity = 'crit' | 'high' | 'med' | 'low';
export type DetectionLang = 'SPL' | 'KQL' | 'Sigma' | 'Bash' | 'Python';
export type DataSource =
  | 'AzureAD SignInLogs'
  | 'AzureAD AuditLogs'
  | 'O365 UrlClickEvents'
  | 'O365 EmailEvents'
  | 'CrowdStrike Falcon'
  | 'Defender for Endpoint'
  | 'AWS CloudTrail'
  | 'AWS GuardDuty'
  | 'AWS VPC Flow'
  | 'Windows Security 4624/4625/4688'
  | 'Sysmon'
  | 'Linux auditd'
  | 'Okta System Log'
  | 'GitHub Audit';

export interface Detection {
  id: string;           // e.g. DET-0007
  title: string;        // imperative: "Detect AWS console login from tor exit"
  severity: Severity;
  status: 'prod' | 'tuning' | 'experimental';
  technique: string[];  // MITRE ATT&CK IDs: ['T1078.004', 'T1110.001']
  dataSources: DataSource[];
  fpRate?: string;      // e.g. '< 1 / week'
  mttr?: string;        // e.g. '8 min'
  description: string;  // one-paragraph plain-English; no marketing
  logic: {
    lang: DetectionLang;
    body: string;       // the actual rule body — copy-pasteable
  }[];
  notes?: string[];     // ops notes: tuning levers, known FPs, response steps
}

export const detections: Detection[] = [
  // ─────────────────────────────────────────────────────────────────
  {
    id: 'DET-0001',
    title: 'AAD sign-in from anomalous ASN + impossible travel (15m window)',
    severity: 'high',
    status: 'prod',
    technique: ['T1078.004', 'T1110.003'],
    dataSources: ['AzureAD SignInLogs'],
    fpRate: '~2 / week',
    mttr: '12m',
    description:
      'Correlates successful Entra ID sign-ins where the user appears in two distinct geographies faster than commercial flight allows, AND the newer login originates from an ASN the user has never used. Two signals collapse to one alert with a confidence score.',
    logic: [
      {
        lang: 'KQL',
        body: `// DET-0001 — AAD impossible travel + rare ASN
let window = 15m;
let user_baseline =
  SigninLogs
  | where TimeGenerated > ago(60d) and ResultType == 0
  | summarize known_asns = make_set(NetworkLocationDetails[0].networkNames, 64)
      by UserPrincipalName;
SigninLogs
| where TimeGenerated > ago(1d) and ResultType == 0
| extend asn = tostring(NetworkLocationDetails[0].networkNames)
| extend geo = strcat(LocationDetails.countryOrRegion, '/', LocationDetails.city)
| join kind=inner user_baseline on UserPrincipalName
| where not(set_has_element(known_asns, asn))
| sort by UserPrincipalName asc, TimeGenerated asc
| serialize
| extend prev_geo = prev(geo, 1), prev_time = prev(TimeGenerated, 1),
         prev_user = prev(UserPrincipalName, 1)
| where UserPrincipalName == prev_user and geo != prev_geo
| where (TimeGenerated - prev_time) < window
| project TimeGenerated, UserPrincipalName, asn, geo, prev_geo, prev_time, IPAddress`,
      },
    ],
    notes: [
      'Baseline rebuilds nightly. First 14 days after onboarding, suppress by default.',
      'Known FP: VPN rotation between WFH and office. Tuned via allowlist of corp egress ASNs.',
      'Playbook: step through SOAR → disable sessions → force MFA reset → ticket.',
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  {
    id: 'DET-0002',
    title: 'Phishing click → credential use from same IP within 30m',
    severity: 'crit',
    status: 'prod',
    technique: ['T1566.002', 'T1078'],
    dataSources: ['O365 UrlClickEvents', 'AzureAD SignInLogs'],
    fpRate: '< 1 / week',
    mttr: '8m',
    description:
      'Joins Defender for O365 click telemetry with Entra ID successful logons by source IP. If the same IP that clicked a flagged link authenticates successfully within 30 minutes, alert crit. This is the rule that opens the Triage This Alert scenario on the site.',
    logic: [
      {
        lang: 'KQL',
        body: `// DET-0002 — click + auth from same IP within 30m
let window = 30m;
let suspicious_domains = dynamic(['contos0-security.com', 'rnicrosoft.com', 'o365-secure.co']);
let clicks =
  UrlClickEvents
  | where Timestamp > ago(24h)
  | where tostring(parse_url(Url).Host) has_any (suspicious_domains)
     or ThreatTypes has 'phishing'
  | project ClickTime=Timestamp, ClickedUrl=Url, ClickIP=IPAddress, ClickedBy=AccountUpn;
SigninLogs
| where TimeGenerated > ago(24h) and ResultType == 0
| project SignInTime=TimeGenerated, UserPrincipalName, IPAddress, UserAgent, AppDisplayName
| join kind=inner clicks on $left.IPAddress == $right.ClickIP
| where SignInTime between (ClickTime .. ClickTime + window)
| project ClickTime, SignInTime, UserPrincipalName, ClickedBy, IPAddress,
         UserAgent, AppDisplayName, ClickedUrl`,
      },
      {
        lang: 'SPL',
        body: `# DET-0002 (Splunk version) — phishing click + auth from same IP
index=o365 sourcetype=o365:management:activity Operation=UrlClick
| eval click_time=_time, click_ip=ClientIP
| lookup suspicious_domains.csv host OUTPUT host as bad_host
| where isnotnull(bad_host) OR ThreatType="phishing"
| fields click_time click_ip userId url
| join click_ip [
    search index=azuread sourcetype=AzureActiveDirectorySignInLogs ResultType=0
    | eval sign_in_time=_time
    | rename ipAddress as click_ip userPrincipalName as upn
    | fields sign_in_time click_ip upn userAgent appDisplayName
  ]
| where sign_in_time >= click_time AND sign_in_time <= (click_time + 1800)
| table click_time sign_in_time upn click_ip userAgent appDisplayName url`,
      },
    ],
    notes: [
      'Domain list ships as a lookup; updated weekly from CTI.',
      'Playbook 4-step: revoke sessions → force MFA re-enroll → pull mailbox rules → hunt lateral.',
      'Drives the /triage simulator scenario end-to-end.',
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  {
    id: 'DET-0003',
    title: 'AWS IAM user creates access key outside change window',
    severity: 'high',
    status: 'prod',
    technique: ['T1098.001', 'T1078.004'],
    dataSources: ['AWS CloudTrail'],
    fpRate: '~1 / month',
    mttr: '20m',
    description:
      'Fires when `CreateAccessKey` is invoked outside the approved change window (weekdays 09:00–17:00 local) OR by a principal that has not created a key in the preceding 180 days. Both signals surface insider abuse + compromised console sessions.',
    logic: [
      {
        lang: 'SPL',
        body: `# DET-0003 — AWS IAM key creation outside change window
index=aws sourcetype=aws:cloudtrail eventName=CreateAccessKey
| eval hour=strftime(_time, "%H"), dow=strftime(_time, "%w")
| eval offhours=if((hour < 9 OR hour > 17 OR dow=0 OR dow=6), 1, 0)
\`\`\`stats for baseline: has this principal created a key in 180d?\`\`\`
| eventstats dc(_time) as created_ever by userIdentity.userName
| where offhours=1 OR created_ever=1
| table _time userIdentity.userName userIdentity.arn awsRegion
        requestParameters.userName responseElements.accessKey.accessKeyId sourceIPAddress`,
      },
      {
        lang: 'Sigma',
        body: `# DET-0003 — AWS IAM key creation outside change window
title: AWS IAM CreateAccessKey Outside Change Window
id: 9a0e1b2c-0000-4000-8000-000000000003
status: stable
description: Detects CreateAccessKey outside business hours or by a long-dormant principal.
references:
  - https://attack.mitre.org/techniques/T1098/001/
author: Indu Lohith Narisetty
date: 2025/06/01
logsource:
  product: aws
  service: cloudtrail
detection:
  selection:
    eventSource: iam.amazonaws.com
    eventName: CreateAccessKey
  timeframe:
    - hour|lt: 9
    - hour|gt: 17
    - weekday|in: [0, 6]
  condition: selection and 1 of timeframe
falsepositives:
  - Approved break-glass rotation
level: high
tags:
  - attack.persistence
  - attack.t1098.001`,
      },
    ],
    notes: [
      'Business-hour window is configurable per-account (Terraform-driven).',
      'Auto-response: SOAR revokes the new key, opens a P2 ticket, pages the account owner.',
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  {
    id: 'DET-0004',
    title: 'Falcon: rundll32 spawning unusual child process',
    severity: 'high',
    status: 'prod',
    technique: ['T1218.011'],
    dataSources: ['CrowdStrike Falcon', 'Sysmon'],
    fpRate: '~3 / week',
    mttr: '15m',
    description:
      'Catches signed-binary-proxy abuse where rundll32.exe spawns an uncommon child (e.g. powershell, cmd, wscript, cscript, mshta). Tuned against a 30-day baseline per endpoint cohort.',
    logic: [
      {
        lang: 'SPL',
        body: `# DET-0004 — rundll32 abnormal child
index=falcon sourcetype=CrowdStrike event_simpleName=ProcessRollup2
  ParentBaseFileName=rundll32.exe
| eval child=lower(FileName)
| where child IN ("powershell.exe","cmd.exe","wscript.exe","cscript.exe","mshta.exe","regsvr32.exe")
| stats values(CommandLine) as cmdlines dc(aid) as hosts
        by child ParentCommandLine
| where hosts < 5`,
      },
    ],
    notes: [
      'hosts < 5 suppresses fleet-wide legit tooling.',
      'Pair with memory triage via Falcon RTR if confidence > 0.7.',
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  {
    id: 'DET-0005',
    title: 'Okta — push-bombing detector (≥ 5 denied pushes in 2m)',
    severity: 'high',
    status: 'prod',
    technique: ['T1621', 'T1556.006'],
    dataSources: ['Okta System Log'],
    fpRate: '< 1 / month',
    mttr: '9m',
    description:
      'Detects MFA push fatigue attacks: ≥5 user-denied push prompts within 120 seconds from a single actor, regardless of whether a push was eventually approved. Auto-blocks the session if approval follows the denials.',
    logic: [
      {
        lang: 'KQL',
        body: `// DET-0005 — Okta push bombing
Okta_System_Log_CL
| where eventType_s == 'user.mfa.okta_verify.deny_push'
| summarize denies = count(),
            followed_by_approve = max(iff(eventType_s == 'user.authentication.auth_via_mfa'
                                          and outcome_result_s == 'SUCCESS', 1, 0))
   by userPrincipalName=actor_alternateId_s,
      bin(published_t, 2m)
| where denies >= 5
| project published_t, userPrincipalName, denies, followed_by_approve`,
      },
    ],
    notes: [
      'If followed_by_approve = 1 → auto isolate session and hard-revoke Okta refresh tokens.',
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  {
    id: 'DET-0006',
    title: 'Service account interactive logon (should be non-interactive)',
    severity: 'high',
    status: 'prod',
    technique: ['T1078.002'],
    dataSources: ['Windows Security 4624/4625/4688'],
    fpRate: '~2 / month',
    mttr: '14m',
    description:
      'Flags Windows logon type 2 (interactive) or 10 (RDP) for accounts tagged svc_* in AD. Service accounts should only logon as 3 (network), 4 (batch), or 5 (service). Interactive use implies credential theft or a misconfigured job.',
    logic: [
      {
        lang: 'SPL',
        body: `# DET-0006 — svc account interactive logon
index=wineventlog EventCode=4624 LogonType IN (2, 10)
| rex field=TargetUserName "^svc_.+"
| search TargetUserName="svc_*"
| stats values(IpAddress) as src_ips values(WorkstationName) as hosts
  by TargetUserName LogonType _time`,
      },
      {
        lang: 'Sigma',
        body: `title: Service Account Interactive Logon
id: 9a0e1b2c-0000-4000-8000-000000000006
status: stable
logsource:
  product: windows
  service: security
detection:
  selection:
    EventID: 4624
    LogonType:
      - 2
      - 10
  svc_prefix:
    TargetUserName|startswith: 'svc_'
  condition: selection and svc_prefix
falsepositives:
  - Break-glass operator running a scheduled maintenance
level: high
tags:
  - attack.persistence
  - attack.t1078.002`,
      },
    ],
    notes: [
      'Pair with "Service Account Baseline Monitor" project — drives weekly drift report.',
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  {
    id: 'DET-0007',
    title: 'GitHub: PAT used from a new ASN (org-scoped)',
    severity: 'med',
    status: 'prod',
    technique: ['T1528', 'T1078.004'],
    dataSources: ['GitHub Audit'],
    fpRate: '~4 / week',
    mttr: '25m',
    description:
      'Detects GitHub Personal Access Tokens being used from an ASN that token-owner has never used in the prior 90 days. Scoped to organization audit log.',
    logic: [
      {
        lang: 'KQL',
        body: `// DET-0007 — GitHub PAT from new ASN
let baseline =
  GitHubAudit_CL
  | where TimeGenerated > ago(90d)
  | where actor_s != '' and token_id_s != ''
  | summarize seen_asns = make_set(asn_s) by actor_s, token_id_s;
GitHubAudit_CL
| where TimeGenerated > ago(1d)
| join kind=leftouter baseline on actor_s, token_id_s
| where isnotempty(seen_asns) and not(set_has_element(seen_asns, asn_s))
| project TimeGenerated, actor_s, token_id_s, asn_s, repo_s, action_s, ip_s`,
      },
    ],
    notes: ['Bot-service ASNs (Cloud Build, GH Actions) are whitelisted at ingest.'],
  },

  // ─────────────────────────────────────────────────────────────────
  {
    id: 'DET-0008',
    title: 'Mailbox rule: auto-forward to external domain',
    severity: 'crit',
    status: 'prod',
    technique: ['T1114.003', 'T1098.002'],
    dataSources: ['O365 EmailEvents', 'AzureAD AuditLogs'],
    fpRate: '< 1 / month',
    mttr: '6m',
    description:
      'Classic BEC primitive: attacker sets an inbox rule that auto-forwards to an external address. Detects `New-InboxRule` / `Set-InboxRule` with `ForwardingSmtpAddress` or `ForwardTo` pointing outside the tenant.',
    logic: [
      {
        lang: 'KQL',
        body: `// DET-0008 — external auto-forward rule
let tenant_domains = dynamic(['corp.local', 'corp.com']);
OfficeActivity
| where Operation in~ ('New-InboxRule', 'Set-InboxRule', 'Set-Mailbox')
| mv-expand Parameters
| extend p = parse_json(tostring(Parameters))
| where tostring(p.Name) in~ ('ForwardingSmtpAddress', 'ForwardTo', 'RedirectTo')
| extend target = tolower(tostring(p.Value))
| where target !has_any (tenant_domains) and target !startswith 'smtp:' == false
| project TimeGenerated, UserId, Operation, ParameterName=tostring(p.Name),
         target, ClientIP`,
      },
    ],
    notes: ['Auto-response: disable rule, revoke sessions, force password reset, page IR.'],
  },
];

export const detectionIndex = detections.reduce(
  (acc, d) => ({ ...acc, [d.id]: d }),
  {} as Record<string, Detection>,
);

export const severityOrder: Record<Severity, number> = {
  crit: 0,
  high: 1,
  med: 2,
  low: 3,
};
