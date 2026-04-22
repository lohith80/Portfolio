export type Choice = {
  id: string;
  label: string;
  outcome: 'correct' | 'plausible' | 'wrong';
  feedback: string;
};

export type Step = {
  id: number;
  tactic: string;
  attack: string[];
  title: string;
  alertCard: {
    source: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    summary: string;
    entities: { label: string; value: string }[];
    raw?: string;
  };
  narration: string;
  spl?: string;
  kql?: string;
  choices: Choice[];
  debrief: string;
};

export const triageScenario: { title: string; synopsis: string; steps: Step[]; report: string } = {
  title: 'ALERT-2026-0412 — Phishing → Credential Theft → Lateral Movement',
  synopsis:
    'An HR user clicked a link in an "MFA re-enrollment" email. One hour later, an anomalous sign-in from a new ASN was observed. Thirty minutes later, a service account initiated SMB traffic to a finance file share it had never touched. Walk through how I triaged.',
  steps: [
    {
      id: 1,
      tactic: 'Initial Access',
      attack: ['T1566 Phishing', 'T1204.001 Malicious Link'],
      title: 'Step 1 — Verify the phish',
      alertCard: {
        source: 'Microsoft Defender for O365',
        severity: 'high',
        summary: 'URL click on URL flagged as phishing — user kira.hr@contoso.com',
        entities: [
          { label: 'Recipient', value: 'kira.hr@contoso.com' },
          { label: 'Sender', value: 'it-noreply@contos0-security.com' },
          { label: 'URL', value: 'hxxps://login.contos0-security.com/mfa-enroll?u=kira' },
          { label: 'ClickTime', value: '2026-04-12T13:42:11Z' },
        ],
      },
      narration:
        'Before I escalate, I confirm (1) was the URL actually malicious and (2) did the user submit credentials? I pivot on EmailUrlInfo + UrlClickEvents, then cross-check any SigninLogs for the recipient in the 30-minute window after the click.',
      kql: `let window = 30m;
let user = "kira.hr@contoso.com";
EmailUrlInfo
| where Url has "contos0-security.com"
| join kind=inner UrlClickEvents on Url
| where RecipientEmailAddress == user
| project ClickTime=TimeGenerated, Url, NetworkMessageId, IPAddress, UserAgent
| join kind=leftouter (
    SigninLogs
    | where UserPrincipalName == user
    | project SignInTime=TimeGenerated, IPAddress, ResultType, AppDisplayName, AutonomousSystemNumber
) on IPAddress
| where SignInTime between (ClickTime .. ClickTime + window)`,
      choices: [
        {
          id: 'a',
          label: 'Escalate to IR — click + auth event from same IP within the window',
          outcome: 'correct',
          feedback:
            'Right call. A click alone is medium; click + successful auth from the click IP is the moment it becomes a confirmed credential-theft pivot. I preserve the message, block the sender domain at the MX edge, and pull the user into IR comms.',
        },
        {
          id: 'b',
          label: 'Close as false positive — Defender already detonated the link',
          outcome: 'wrong',
          feedback:
            'Detonation tells you the URL is malicious — not whether the user submitted creds. Closing here is how breaches get missed.',
        },
        {
          id: 'c',
          label: 'Wait for more signal',
          outcome: 'plausible',
          feedback:
            'Passive monitoring burns dwell time. If auth-from-click-IP is already in the data, the right move is containment now; follow-up analysis while containment runs in parallel.',
        },
      ],
      debrief:
        'Outcome: user creds confirmed captured — the click IP (185.xxx) is a residential proxy in a jurisdiction the user does not travel to.',
    },
    {
      id: 2,
      tactic: 'Credential Access',
      attack: ['T1078 Valid Accounts', 'T1110.003 Password Spray'],
      title: 'Step 2 — Scope the blast radius',
      alertCard: {
        source: 'Sentinel Analytic Rule (custom)',
        severity: 'high',
        summary: 'Anomalous sign-in — new ASN + legacy auth protocol',
        entities: [
          { label: 'User', value: 'kira.hr@contoso.com' },
          { label: 'IP', value: '185.107.56.12' },
          { label: 'ASN', value: 'AS202425 — residential proxy' },
          { label: 'Protocol', value: 'IMAP4 (legacy)' },
          { label: 'App', value: 'Office 365 Exchange Online' },
        ],
      },
      narration:
        "Now I ask: is this the only account the attacker has? I hunt across SigninLogs for the same IP / ASN / UserAgent touching other users in the last 24h.",
      kql: `let badIp = "185.107.56.12";
let badAsn = 202425;
SigninLogs
| where TimeGenerated > ago(24h)
| where IPAddress == badIp or AutonomousSystemNumber == badAsn
| summarize attempts=count(), users=make_set(UserPrincipalName), successes=countif(ResultType==0) by IPAddress, AutonomousSystemNumber
| order by attempts desc`,
      choices: [
        {
          id: 'a',
          label: 'Revoke sessions for Kira only + reset password + force MFA re-enroll',
          outcome: 'plausible',
          feedback:
            'Right starting point but incomplete. The attacker has legacy-auth IMAP tokens — password reset alone does not kill an IMAP session.',
        },
        {
          id: 'b',
          label: 'Revoke sessions + reset + disable legacy auth + check other users from same ASN',
          outcome: 'correct',
          feedback:
            'Correct. Legacy auth (IMAP/POP/SMTP basic) bypasses conditional-access MFA. Kill it, force modern auth, and scope across users from the same ASN in the window.',
        },
        {
          id: 'c',
          label: 'Lock Kira out and email her manager',
          outcome: 'wrong',
          feedback:
            'Lockout without revoking tokens leaves active sessions alive. And a manager email is not a containment action.',
        },
      ],
      debrief:
        'Scoped: 1 additional user (j.finance@contoso.com) authenticated from same ASN 14 minutes later. Both quarantined; legacy auth policy tightened across the tenant.',
    },
    {
      id: 3,
      tactic: 'Lateral Movement',
      attack: ['T1021.002 SMB / Admin Shares'],
      title: 'Step 3 — Catch the lateral move',
      alertCard: {
        source: 'Splunk ES — custom correlation',
        severity: 'critical',
        summary: 'Service account accessed a file share it has never touched',
        entities: [
          { label: 'SrcHost', value: 'WS-KIRA-07' },
          { label: 'DstHost', value: 'FS-FINANCE-01' },
          { label: 'Account', value: 'svc_jira_sync' },
          { label: 'Share', value: '\\\\FS-FINANCE-01\\Audits$' },
        ],
      },
      narration:
        'Service accounts should behave predictably. svc_jira_sync has a narrow baseline — Jira API, Jira DB host. Touching Finance SMB is out of profile. I pull the full lateral flow in Splunk.',
      spl: `index=windows sourcetype=WinEventLog:Security EventCode=4624 LogonType=3
    Account_Name="svc_jira_sync"
| eval dest_host=IP_Address, logon_time=_time
| join type=outer [
    search index=windows sourcetype=WinEventLog:Security EventCode=5140
      Account_Name="svc_jira_sync"
  ]
| stats earliest(logon_time) as first_seen by dest_host, Share_Name
| lookup svc_account_baseline.csv account AS Account_Name OUTPUT expected_hosts
| where NOT match(dest_host, expected_hosts)`,
      choices: [
        {
          id: 'a',
          label: 'Isolate WS-KIRA-07 via Defender + disable svc_jira_sync + preserve memory',
          outcome: 'correct',
          feedback:
            'Correct. Network-isolate the source, kill the abused identity, and capture volatile state before rebooting. The preservation step is what lets forensics rebuild the story.',
        },
        {
          id: 'b',
          label: 'Reboot WS-KIRA-07 to kick the attacker',
          outcome: 'wrong',
          feedback:
            'Reboot destroys memory artifacts and live sessions. You lose forensic value and the attacker may persist via scheduled task / Run key.',
        },
        {
          id: 'c',
          label: 'Block the SMB port at host firewall',
          outcome: 'plausible',
          feedback:
            'Partial. Port block hides the symptom, does not remove the compromised identity. Isolate the host AND revoke the account.',
        },
      ],
      debrief:
        'Confirmed lateral move staged via overly-permissioned service account. Jira service account later rotated and re-scoped per least-privilege review.',
    },
    {
      id: 4,
      tactic: 'Collection / Exfiltration',
      attack: ['T1114 Email Collection', 'T1048 Exfiltration Over Alt Protocol'],
      title: 'Step 4 — Was data taken?',
      alertCard: {
        source: 'Sentinel KQL — inbox-forwarding rule',
        severity: 'high',
        summary: 'New inbox rule created forwarding all mail to external address',
        entities: [
          { label: 'User', value: 'kira.hr@contoso.com' },
          { label: 'Rule', value: 'ForwardTo: archive-hr-2026@tutanota.com' },
          { label: 'CreatedAt', value: '2026-04-12T14:31:40Z' },
        ],
      },
      narration:
        'Attackers routinely create inbox-forwarding rules after mailbox takeover. This is cheap persistence + cheap exfil. I search all tenants for the pattern in the window.',
      kql: `OfficeActivity
| where TimeGenerated between (datetime(2026-04-12) .. datetime(2026-04-13))
| where Operation in ("New-InboxRule","Set-InboxRule")
| where Parameters has "ForwardTo"
| extend ext = extract("ForwardTo.*?([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+)", 1, Parameters)
| where ext !endswith "@contoso.com"
| project TimeGenerated, UserId, ext, Parameters`,
      choices: [
        {
          id: 'a',
          label: 'Delete the rule + preserve a copy in IR evidence store',
          outcome: 'correct',
          feedback:
            "Correct. Remove persistence immediately, but keep the forensic copy — it's evidence for the post-incident report and for any legal hold.",
        },
        {
          id: 'b',
          label: 'Leave it in place to monitor the attacker',
          outcome: 'wrong',
          feedback:
            'Watching the attacker exfil your HR inbox in real time is not a strategy — it is a breach report.',
        },
        {
          id: 'c',
          label: 'Ask the user if they created the rule',
          outcome: 'plausible',
          feedback:
            'Useful later for user-awareness conversation, but not a containment step. Delete first, debrief the user after.',
        },
      ],
      debrief:
        '27 emails forwarded externally. Scoped as HR onboarding templates — low confidentiality, no PII exposure beyond employee names already in public LinkedIn data.',
    },
    {
      id: 5,
      tactic: 'Reporting & Hardening',
      attack: ['Post-incident / Lessons Learned'],
      title: 'Step 5 — What gets written down',
      alertCard: {
        source: 'IR Process',
        severity: 'medium',
        summary: 'Blameless post-incident report drafted within 48 hours',
        entities: [
          { label: 'MTTD', value: '42 minutes' },
          { label: 'MTTR', value: '2h 18m' },
          { label: 'Scope', value: '2 users, 1 host, 1 service account' },
          { label: 'Data loss', value: 'None confirmed' },
        ],
      },
      narration:
        'The only thing worse than an incident is an incident you did not learn from. I write a blameless post-mortem that names the gap (legacy-auth still enabled, over-permissive service account), lists every detection that fired + every one that should have, and ships the new Sigma rules into detection-as-code.',
      choices: [
        {
          id: 'a',
          label: 'Ship 3 new detections (click + auth same-IP, legacy-auth signin, service-account out-of-baseline SMB)',
          outcome: 'correct',
          feedback:
            'Correct. Every IR is a feedback loop into detection engineering. We closed this with new Sigma rules, a tightened Conditional Access policy, and a service-account baseline job that refreshes weekly.',
        },
        {
          id: 'b',
          label: 'File the report and move on',
          outcome: 'wrong',
          feedback: 'Reports without rule-ships are theater. The gap stays open for the next attacker.',
        },
      ],
      debrief:
        'Outcome shipped: 3 new analytic rules, 1 CA policy, 1 IAM review. This scenario is now a tabletop exercise run quarterly for the SOC team.',
    },
  ],
  report: `# Incident Report — ALERT-2026-0412
**Classification:** Confirmed intrusion — contained, no confirmed data loss
**IR Lead:** Indu Lohith Narisetty
**MTTD:** 42m   **MTTR:** 2h 18m

## Timeline (UTC)
- 13:12  Phishing email delivered to kira.hr@contoso.com
- 13:42  URL click + credential submission via residential proxy (AS202425)
- 13:48  Successful legacy-auth IMAP sign-in from same IP
- 14:31  Inbox-forwarding rule created to external (tutanota.com)
- 14:45  Service account svc_jira_sync SMB to FS-FINANCE-01
- 14:54  IR engaged → host isolation, token revocation, legacy-auth kill switch
- 17:00  Root cause confirmed → post-mortem drafted

## Detections Shipped
1. **Click + auth from click IP within 30m** (Sentinel KQL)
2. **New legacy-auth sign-in in a tenant with modern-auth baseline** (Sentinel KQL)
3. **Service account out-of-baseline SMB** (Splunk ES correlation)

## Controls Tightened
- Conditional Access: block legacy authentication tenant-wide
- IAM: service-account baseline + weekly out-of-profile report
- Email: sender-domain block on contos0-security.com typosquat family
`,
};
