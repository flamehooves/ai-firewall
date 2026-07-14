import type {
  Employee, Incident, AIApp, Policy, ActivityEntry, Department,
  AuditLog, Integration, Endpoint, Approval, ClassificationRule, Report,
  RiskLevel, ActionType, IncidentStatus, AppStatus, EndpointStatus,
  ApprovalStatus, ChartPoint,
} from '../types'

export type {
  Employee, Incident, AIApp, Policy, ActivityEntry, Department,
  AuditLog, Integration, Endpoint, Approval, ClassificationRule, Report,
  RiskLevel, ActionType, IncidentStatus, AppStatus, EndpointStatus,
  ApprovalStatus, ChartPoint,
} from '../types'

const initials = (name: string) =>
  name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase()

const DEPT_NAMES = [
  'Engineering', 'Finance', 'HR', 'Legal', 'Marketing',
  'Sales', 'Product', 'Design', 'Operations', 'Security',
]

const AI_TOOLS = [
  'ChatGPT', 'Claude', 'Gemini', 'GitHub Copilot', 'Microsoft Copilot',
  'Midjourney', 'Perplexity', 'Grok', 'Jasper', 'Notion AI',
]

const ROLES = [
  'Software Engineer', 'Senior Engineer', 'Manager', 'Analyst', 'Director',
  'Associate', 'Team Lead', 'Specialist', 'Coordinator', 'VP',
]

const NAMES = [
  'Priya Sharma', 'Rahul Verma', 'Arun Kumar', 'Anita Desai', 'Vikram Singh',
  'Deepa Nair', 'Suresh Patel', 'Kavitha Reddy', 'Arjun Mehta', 'Neha Gupta',
  'Rohan Joshi', 'Sunita Iyer', 'Amit Kapoor', 'Pooja Mishra', 'Rajesh Kumar',
  'James Wilson', 'Sarah Chen', 'Michael Rodriguez', 'Emily Davis', 'David Kim',
  'Sanjay Bhat', 'Meera Rao', 'Karthik Menon', 'Divya Pillai', 'Nikhil Chopra',
  'Ananya Bose', 'Vivek Malhotra', 'Ritu Agarwal', 'Manish Tiwari', 'Shreya Ghosh',
  'Aditya Rao', 'Lakshmi Krishnan', 'Gaurav Saxena', 'Isha Bhatt', 'Varun Nanda',
  'Tara Sen', 'Kunal Bajaj', 'Nandini Rao', 'Harish Kulkarni', 'Swati Deshpande',
  'Olivia Brown', 'Daniel Lee', 'Sophia Martinez', 'Ethan Taylor', 'Grace Wang',
  'Ravi Shankar', 'Preeti Chawla', 'Sameer Khan', 'Ayesha Sheikh', 'Nitin Rana',
]

function riskLevelFor(score: number): RiskLevel {
  if (score >= 80) return 'critical'
  if (score >= 60) return 'high'
  if (score >= 35) return 'medium'
  if (score >= 10) return 'low'
  return 'none'
}

function pickTools(seed: number): string[] {
  const count = (seed % 3) + 1
  const out: string[] = []
  for (let i = 0; i < count; i++) out.push(AI_TOOLS[(seed + i * 3) % AI_TOOLS.length])
  return Array.from(new Set(out))
}

const lastActiveOptions = ['2 mins ago', '15 mins ago', '1 hour ago', '3 hours ago', '30 mins ago', '5 mins ago', 'Yesterday', '2 days ago']

export const employees: Employee[] = NAMES.map((name, i) => {
  const dept = DEPT_NAMES[i % DEPT_NAMES.length]
  const score = (i * 37 + 13) % 101
  const [first, last] = name.split(' ')
  return {
    id: `u${i + 1}`,
    name,
    email: `${first.toLowerCase()}.${last.toLowerCase()}@zylker.com`,
    department: dept,
    role: ROLES[i % ROLES.length],
    riskScore: score,
    riskLevel: riskLevelFor(score),
    aiTools: pickTools(i + 1),
    totalRequests: 120 + ((i * 271) % 6100),
    violations: (i * 7) % 25,
    lastActive: lastActiveOptions[i % lastActiveOptions.length],
    avatar: initials(name),
  }
})

const INCIDENT_TEMPLATES: Array<{ title: (n: string, t: string) => string; cat: string; sev: RiskLevel; desc: string }> = [
  { title: (n, t) => `${n} pasted AWS access keys into ${t}`, cat: 'Credentials', sev: 'critical', desc: 'Live AWS IAM access key and secret detected in an outbound prompt. Keys were auto-redacted and rotated via AWS Security Hub integration.' },
  { title: (n, t) => `${n} shared customer PII with ${t}`, cat: 'PII', sev: 'high', desc: 'A batch of customer records containing names, emails and phone numbers was intercepted before transmission.' },
  { title: (n, t) => `${n} uploaded proprietary source code to ${t}`, cat: 'Source Code', sev: 'high', desc: 'Repository files matching internal fingerprint hashes were blocked from upload.' },
  { title: (n, t) => `${n} exposed patient health records to ${t}`, cat: 'PHI', sev: 'critical', desc: 'HIPAA-protected medical record numbers and diagnosis codes detected and blocked.' },
  { title: (n, t) => `${n} submitted credit card numbers to ${t}`, cat: 'PCI', sev: 'critical', desc: 'PAN and CVV patterns matched PCI-DSS classifiers; request blocked and logged.' },
  { title: (n, t) => `${n} used unapproved ${t} for confidential docs`, cat: 'Shadow IT', sev: 'medium', desc: 'Shadow IT usage of an unsanctioned AI tool flagged for review.' },
  { title: (n, t) => `${n} shared unreleased financials with ${t}`, cat: 'Confidential', sev: 'high', desc: 'Pre-earnings financial figures matched the confidential watermark ruleset.' },
  { title: (n, t) => `${n} pasted internal API tokens into ${t}`, cat: 'Credentials', sev: 'high', desc: 'Internal service bearer tokens intercepted and revoked automatically.' },
  { title: (n, t) => `${n} leaked employee salary data via ${t}`, cat: 'Confidential', sev: 'medium', desc: 'HR compensation table detected in prompt and redacted.' },
  { title: (n, t) => `${n} triggered prompt injection attempt on ${t}`, cat: 'Prompt Injection', sev: 'medium', desc: 'Known jailbreak signature detected in prompt payload.' },
]

const INC_STATUS: IncidentStatus[] = ['open', 'investigating', 'resolved', 'dismissed']

export const incidents: Incident[] = Array.from({ length: 30 }, (_, i) => {
  const emp = employees[i % employees.length]
  const tool = AI_TOOLS[i % AI_TOOLS.length]
  const tmpl = INCIDENT_TEMPLATES[i % INCIDENT_TEMPLATES.length]
  return {
    id: `INC-${String(1001 + i)}`,
    title: tmpl.title(emp.name, tool),
    description: tmpl.desc,
    severity: tmpl.sev,
    status: INC_STATUS[i % INC_STATUS.length],
    user: emp.name,
    department: emp.department,
    aiTool: tool,
    assignee: employees[9 - (i % 5)].name,
    createdAt: `2026-07-${String((i % 13) + 1).padStart(2, '0')} ${String((i % 12) + 9).padStart(2, '0')}:${String((i * 11) % 60).padStart(2, '0')}`,
    updatedAt: `2026-07-${String((i % 13) + 1).padStart(2, '0')} ${String((i % 12) + 10).padStart(2, '0')}:${String((i * 7) % 60).padStart(2, '0')}`,
    category: tmpl.cat,
  }
})

const APP_DEFS: Array<[string, RiskLevel, AppStatus, string, string, string[]]> = [
  ['ChatGPT', 'high', 'approved', 'General AI', 'OpenAI conversational assistant used across the org', ['PII', 'Source Code', 'Confidential']],
  ['Claude', 'medium', 'approved', 'General AI', 'Anthropic assistant for writing, analysis and coding', ['Source Code', 'Confidential']],
  ['Gemini', 'medium', 'approved', 'General AI', 'Google multimodal assistant integrated with Workspace', ['PII', 'Confidential']],
  ['GitHub Copilot', 'medium', 'approved', 'Code Assistant', 'AI pair programmer embedded in the IDE', ['Source Code']],
  ['Microsoft Copilot', 'low', 'approved', 'Productivity', 'AI across Office 365 apps', ['Confidential']],
  ['Midjourney', 'high', 'restricted', 'Image Generation', 'Generative image tool used by Design and Marketing', ['Confidential']],
  ['Perplexity', 'medium', 'restricted', 'Search', 'AI answer engine for research', ['PII']],
  ['Grok', 'critical', 'blocked', 'General AI', 'xAI assistant blocked pending security review', ['PII', 'Credentials']],
  ['Jasper', 'high', 'shadow', 'Marketing', 'Unsanctioned marketing copy generator (Shadow IT)', ['Confidential', 'PII']],
  ['Notion AI', 'low', 'approved', 'Productivity', 'AI writing assistant inside Notion workspaces', ['Confidential']],
]

export const aiApps: AIApp[] = APP_DEFS.map(([name, riskLevel, status, category, description, dataTypes], i) => ({
  id: `app-${i + 1}`,
  name,
  category,
  users: 340 + ((i * 811) % 8200),
  requestsPerDay: 1200 + ((i * 3701) % 42000),
  riskLevel,
  status,
  description,
  dataTypes,
  lastSeen: lastActiveOptions[i % lastActiveOptions.length],
}))
export const applications = aiApps

const POLICY_DEFS: Array<[string, string, number, ActionType, string, string[]]> = [
  ['Block Credential Sharing', 'Prevents API keys, passwords and access tokens from reaching AI tools', 3, 'blocked', 'Credentials', ['All Users']],
  ['Redact PII Automatically', 'Detects and redacts personally identifiable information in prompts', 3, 'redacted', 'PII', ['All Users']],
  ['Warn on Source Code Upload', 'Warns users before sharing proprietary source code', 2, 'warned', 'Source Code', ['Engineering']],
  ['Block PHI Transmission', 'Blocks protected health information per HIPAA', 2, 'blocked', 'PHI', ['HR', 'Legal']],
  ['PCI Data Protection', 'Blocks credit card and payment data', 2, 'blocked', 'PCI', ['Finance']],
  ['Shadow IT Detection', 'Flags usage of unapproved AI applications', 2, 'warned', 'Shadow IT', ['All Users']],
  ['Confidential Doc Guard', 'Redacts documents marked confidential', 2, 'redacted', 'Confidential', ['All Users']],
  ['Financial Data Control', 'Blocks unreleased financial statements', 2, 'blocked', 'Confidential', ['Finance']],
  ['Legal Privilege Protection', 'Warns on attorney-client privileged content', 2, 'warned', 'Confidential', ['Legal']],
  ['Prompt Injection Defense', 'Detects and blocks prompt injection attempts', 2, 'blocked', 'Security', ['All Users']],
  ['Approved Tools Only', 'Allows only sanctioned AI tools', 1, 'allowed', 'Governance', ['All Users']],
  ['Data Residency Enforcement', 'Blocks cross-border data transfer', 2, 'blocked', 'Compliance', ['All Users']],
  ['Large Payload Warning', 'Warns on large data uploads', 1, 'warned', 'DLP', ['All Users']],
  ['Executive Communications', 'Extra protection for C-suite content', 2, 'redacted', 'Confidential', ['Executives']],
  ['HR Sensitive Data', 'Blocks employee sensitive records', 2, 'blocked', 'PII', ['HR']],
  ['Customer Contract Guard', 'Redacts customer contract terms', 2, 'redacted', 'Confidential', ['Sales', 'Legal']],
  ['IP Protection', 'Blocks intellectual property leakage', 2, 'blocked', 'Source Code', ['Engineering', 'Product']],
  ['Session Recording', 'Logs all AI interactions for audit', 1, 'allowed', 'Governance', ['All Users']],
  ['Rate Limiting', 'Warns on excessive AI usage', 1, 'warned', 'Governance', ['All Users']],
  ['Malware Link Scanner', 'Blocks malicious links in AI responses', 2, 'blocked', 'Security', ['All Users']],
]

export const policies: Policy[] = POLICY_DEFS.map(([name, description, conditions, action, category, appliesTo], i) => ({
  id: `pol-${i + 1}`,
  name,
  description,
  conditions,
  action,
  enabled: i % 5 !== 4,
  lastModified: `2026-0${(i % 6) + 1}-${String((i % 27) + 1).padStart(2, '0')}`,
  appliesTo,
  category,
}))

const PROMPTS = [
  'Summarize the Q3 earnings report and highlight risks for the board deck.',
  'Write a Python script to parse our customer CSV and dedupe emails.',
  'Draft a response to the vendor about the AWS migration timeline.',
  'Refactor this authentication module to use JWT tokens.',
  'Generate a marketing email for the new product launch campaign.',
  'Explain the difference between GDPR and CCPA for our compliance doc.',
  'Help me debug this SQL query that returns duplicate rows.',
  'Create a project plan for the mobile app redesign initiative.',
  'Review this contract clause for potential liability issues.',
  'Translate this technical spec into plain language for stakeholders.',
]
const RESPONSES = [
  'Here is a summary of the Q3 earnings with the top three risk factors identified for board review...',
  'Below is a Python script using pandas that reads the CSV, normalizes email casing, and removes duplicates...',
  'I have drafted a professional response outlining the migration timeline and key dependencies...',
  'The refactored authentication module now issues and validates JWT tokens with refresh support...',
  'Here is a compelling marketing email with subject line variations for A/B testing...',
]
const CATEGORIES = ['PII', 'Source Code', 'Credentials', 'Confidential', 'General', 'PHI', 'PCI', 'Financial']
const ACTIONS: ActionType[] = ['allowed', 'blocked', 'warned', 'redacted']

export const activityLog: ActivityEntry[] = Array.from({ length: 100 }, (_, i) => {
  const emp = employees[i % employees.length]
  const prompt = PROMPTS[i % PROMPTS.length]
  const action = ACTIONS[i % ACTIONS.length]
  return {
    id: `act-${String(i + 1).padStart(4, '0')}`,
    timestamp: `2026-07-${String((i % 13) + 1).padStart(2, '0')} ${String((i % 12) + 8).padStart(2, '0')}:${String((i * 13) % 60).padStart(2, '0')}:${String((i * 7) % 60).padStart(2, '0')}`,
    user: emp.name,
    department: emp.department,
    aiTool: AI_TOOLS[i % AI_TOOLS.length],
    promptPreview: prompt.slice(0, 60) + (prompt.length > 60 ? '...' : ''),
    fullPrompt: prompt,
    response: RESPONSES[i % RESPONSES.length],
    tokens: 180 + ((i * 271) % 3800),
    action,
    riskScore: (i * 41 + 7) % 101,
    category: CATEGORIES[i % CATEGORIES.length],
    policies: action === 'allowed' ? [] : [POLICY_DEFS[i % POLICY_DEFS.length][0]],
  }
})
export const activityLogs = activityLog

export const departments: Department[] = DEPT_NAMES.map((name, i) => {
  const emps = employees.filter((e) => e.department === name)
  const score = (i * 29 + 21) % 101
  return {
    id: `dept-${i + 1}`,
    name,
    headCount: 800 + ((i * 517) % 3200),
    activeUsers: 400 + ((i * 311) % 1800),
    aiInteractions: 18000 + ((i * 9973) % 210000),
    riskScore: score,
    violations: 40 + ((i * 137) % 900),
    topRisks: ['PII', 'Source Code', 'Credentials', 'Confidential', 'PCI', 'PHI'].slice(i % 3, (i % 3) + 3),
    blockedCount: 200 + ((i * 233) % 2400),
    topTools: emps.length ? Array.from(new Set(emps.flatMap((e) => e.aiTools))).slice(0, 3) : pickTools(i + 2),
  }
})

const AUDIT_ACTIONS = [
  'Policy Updated', 'User Login', 'Incident Resolved', 'Integration Connected',
  'Report Generated', 'Approval Granted', 'Policy Created', 'Settings Changed',
  'API Key Created', 'User Role Changed', 'Data Exported', 'Endpoint Enrolled',
]
const AUDIT_STATUS = ['success', 'success', 'success', 'failed', 'warning']

export const auditLogs: AuditLog[] = Array.from({ length: 50 }, (_, i) => {
  const emp = employees[i % 10]
  return {
    id: `aud-${String(i + 1).padStart(4, '0')}`,
    timestamp: `2026-07-${String((i % 13) + 1).padStart(2, '0')} ${String(i % 24).padStart(2, '0')}:${String((i * 17) % 60).padStart(2, '0')}:${String((i * 3) % 60).padStart(2, '0')}`,
    actor: emp.name,
    actorEmail: emp.email,
    action: AUDIT_ACTIONS[i % AUDIT_ACTIONS.length],
    resource: ['pol-3', 'u12', 'INC-1004', 'Okta', 'Q3 Report', 'app-6', 'Settings', 'API', 'ep-8'][i % 9],
    details: 'Change committed and cryptographically chained to the previous entry.',
    ipAddress: `10.${(i % 250) + 1}.${((i * 3) % 250) + 1}.${((i * 7) % 250) + 1}`,
    hash: `0x${Math.abs((i * 2654435761) % 0xffffffff).toString(16).padStart(8, '0')}${Math.abs(((i + 7) * 40503) % 0xffffffff).toString(16).padStart(8, '0')}`,
    status: AUDIT_STATUS[i % AUDIT_STATUS.length],
  }
})

const INTEGRATION_DEFS: Array<[string, string, string, boolean, string]> = [
  ['Okta', 'Identity', 'Single sign-on and user provisioning via SCIM', true, 'OK'],
  ['Microsoft Entra ID', 'Identity', 'Azure AD authentication and conditional access', true, 'ME'],
  ['Splunk', 'SIEM', 'Stream security events and logs for correlation', true, 'SP'],
  ['ServiceNow', 'ITSM', 'Auto-create tickets for incidents and approvals', true, 'SN'],
  ['CrowdStrike', 'EDR', 'Endpoint telemetry and threat intelligence sync', true, 'CS'],
  ['Google Workspace', 'Identity', 'SSO and directory sync for Google users', true, 'GW'],
  ['Microsoft 365', 'Productivity', 'Monitor Copilot usage across Office apps', true, 'M3'],
  ['Slack', 'Collaboration', 'Real-time incident alerts and approval workflows', false, 'SL'],
  ['Jira', 'ITSM', 'Track remediation tasks and security backlog', false, 'JR'],
  ['PagerDuty', 'Alerting', 'On-call escalation for critical incidents', false, 'PD'],
  ['Datadog', 'Observability', 'Metrics, traces and dashboards for the platform', false, 'DD'],
  ['AWS Security Hub', 'Cloud', 'Aggregate findings and posture management', false, 'AW'],
]

export const integrations: Integration[] = INTEGRATION_DEFS.map(([name, category, description, connected, logo], i) => ({
  id: `int-${i + 1}`,
  name,
  category,
  description,
  connected,
  logo,
  connectedAt: connected ? `2026-0${(i % 6) + 1}-1${i % 9}` : undefined,
}))

const OS_LIST = ['macOS 14.5', 'Windows 11 Pro', 'Ubuntu 22.04', 'macOS 13.6', 'Windows 10']
const EP_STATUS: EndpointStatus[] = ['protected', 'at-risk', 'unmanaged']

export const endpoints: Endpoint[] = Array.from({ length: 30 }, (_, i) => {
  const emp = employees[i % employees.length]
  const score = (i * 43 + 11) % 101
  return {
    id: `ep-${i + 1}`,
    hostname: `ZYL-${emp.department.slice(0, 3).toUpperCase()}-${1000 + i}`,
    os: OS_LIST[i % OS_LIST.length],
    user: emp.name,
    agentVersion: `3.${(i % 4) + 2}.${i % 9}`,
    status: EP_STATUS[i % EP_STATUS.length],
    lastSeen: `2026-07-13 ${String((i % 12) + 8).padStart(2, '0')}:${String((i * 11) % 60).padStart(2, '0')}`,
    department: emp.department,
    ipAddress: `10.20.${(i % 250) + 1}.${((i * 5) % 250) + 1}`,
    riskScore: score,
  }
})

const AP_STATUS: ApprovalStatus[] = ['pending', 'approved', 'denied']
const REASONS = [
  'Need for automating weekly financial reports and reducing manual effort.',
  'Required for generating marketing copy and campaign variations at scale.',
  'Essential for code review assistance and improving developer productivity.',
  'Used to summarize customer support tickets and draft responses.',
  'Necessary for competitive research and market analysis tasks.',
]
const RISK_LEVELS: RiskLevel[] = ['low', 'medium', 'high', 'critical']

export const approvals: Approval[] = Array.from({ length: 20 }, (_, i) => {
  const emp = employees[i % employees.length]
  const status = AP_STATUS[i % AP_STATUS.length]
  return {
    id: `req-${i + 1}`,
    requester: emp.name,
    department: emp.department,
    aiTool: AI_TOOLS[i % AI_TOOLS.length],
    reason: REASONS[i % REASONS.length],
    riskAssessment: RISK_LEVELS[i % RISK_LEVELS.length],
    requestedAt: `2026-07-${String((i % 13) + 1).padStart(2, '0')}`,
    promptPreview: PROMPTS[i % PROMPTS.length],
    status,
    approver: status === 'pending' ? '—' : 'Arun Kumar',
    decisionDate: status === 'pending' ? '—' : `2026-07-${String((i % 13) + 2).padStart(2, '0')}`,
  }
})
export const approvalRequests = approvals

const CLASS_DEFS: Array<[string, string, number, number, RiskLevel]> = [
  ['PII', 'Personally identifiable information: names, SSNs, addresses, phone numbers', 42, 18420, 'high'],
  ['PHI', 'Protected health information under HIPAA regulations', 28, 3210, 'critical'],
  ['PCI', 'Payment card industry data: card numbers, CVV, expiry', 19, 5640, 'critical'],
  ['Source Code', 'Proprietary source code, repository paths and secrets in code', 35, 12890, 'high'],
  ['Credentials', 'API keys, passwords, access tokens, private keys', 51, 9370, 'critical'],
  ['Confidential', 'Documents marked confidential or internal-only', 24, 21560, 'medium'],
]

export const classificationRules: ClassificationRule[] = CLASS_DEFS.map(([name, description, patternCount, detectionCount, severity], i) => ({
  id: `cls-${i + 1}`,
  name,
  description,
  patternCount,
  detectionCount,
  severity,
  enabled: true,
}))

export const reports: Report[] = [
  { id: 'rep-1', name: 'Executive Security Summary', description: 'High-level overview of AI risk posture for leadership', category: 'Executive', lastGenerated: '2026-07-10', format: 'PDF' },
  { id: 'rep-2', name: 'DLP Incident Report', description: 'Detailed breakdown of data loss prevention incidents', category: 'Security', lastGenerated: '2026-07-12', format: 'PDF' },
  { id: 'rep-3', name: 'Compliance Audit (SOC 2)', description: 'Evidence collection for SOC 2 Type II audit', category: 'Compliance', lastGenerated: '2026-07-01', format: 'PDF' },
  { id: 'rep-4', name: 'GDPR Data Processing', description: 'Cross-border transfer and PII handling report', category: 'Compliance', lastGenerated: '2026-06-28', format: 'CSV' },
  { id: 'rep-5', name: 'AI Usage by Department', description: 'Breakdown of AI tool adoption across departments', category: 'Analytics', lastGenerated: '2026-07-11', format: 'XLSX' },
  { id: 'rep-6', name: 'Shadow IT Discovery', description: 'Unapproved AI applications detected in the environment', category: 'Security', lastGenerated: '2026-07-09', format: 'PDF' },
  { id: 'rep-7', name: 'User Risk Scorecard', description: 'Per-user risk scores and behavioral trends', category: 'Analytics', lastGenerated: '2026-07-08', format: 'XLSX' },
  { id: 'rep-8', name: 'Policy Effectiveness', description: 'Enforcement outcomes and policy hit rates', category: 'Analytics', lastGenerated: '2026-07-07', format: 'PDF' },
  { id: 'rep-9', name: 'Endpoint Coverage', description: 'Agent deployment and coverage gaps', category: 'Operations', lastGenerated: '2026-07-06', format: 'CSV' },
  { id: 'rep-10', name: 'Quarterly Board Report', description: 'Comprehensive quarterly security review for the board', category: 'Executive', lastGenerated: '2026-07-01', format: 'PDF' },
]

export const kpiMetrics = {
  totalInteractions: 1840000,
  activeUsers: 12486,
  blocked: 18420,
  warned: 31280,
  redacted: 46930,
  filesBlocked: 2481,
  criticalIncidents: 184,
  violations: 58310,
  protectedEndpoints: 19842,
  unmanagedApps: 14,
}

export const usageTrendData = [
  { date: 'Jul 7', allowed: 241000, blocked: 2610, warned: 4210, redacted: 6320 },
  { date: 'Jul 8', allowed: 258000, blocked: 2810, warned: 4620, redacted: 6810 },
  { date: 'Jul 9', allowed: 249000, blocked: 3120, warned: 4410, redacted: 7010 },
  { date: 'Jul 10', allowed: 272000, blocked: 2940, warned: 4980, redacted: 7420 },
  { date: 'Jul 11', allowed: 281000, blocked: 3310, warned: 5210, redacted: 7810 },
  { date: 'Jul 12', allowed: 263000, blocked: 2760, warned: 4720, redacted: 6910 },
  { date: 'Jul 13', allowed: 276000, blocked: 3010, warned: 5130, redacted: 7650 },
]
export const usageTrend = usageTrendData

export const enforcementData: ChartPoint[] = [
  { name: 'Allowed', value: 1743370, color: '#22c55e' },
  { name: 'Warned', value: 31280, color: '#f59e0b' },
  { name: 'Redacted', value: 46930, color: '#3b82f6' },
  { name: 'Blocked', value: 18420, color: '#ef4444' },
]
export const enforcementOutcomes = enforcementData

export const riskByCategoryData = [
  { category: 'Confidential', count: 21560 },
  { category: 'PII', count: 18420 },
  { category: 'Source Code', count: 12890 },
  { category: 'Credentials', count: 9370 },
  { category: 'PCI', count: 5640 },
  { category: 'PHI', count: 3210 },
]
export const riskByCategory = riskByCategoryData

export const notifications = [
  { id: 1, title: 'Critical: AWS keys leaked to Grok', time: '2m ago', severity: 'critical' as RiskLevel },
  { id: 2, title: 'New approval request from Neha Gupta', time: '18m ago', severity: 'medium' as RiskLevel },
  { id: 3, title: 'Shadow IT detected: Jasper', time: '1h ago', severity: 'high' as RiskLevel },
  { id: 4, title: 'Policy "PCI Data Protection" updated', time: '3h ago', severity: 'low' as RiskLevel },
]
