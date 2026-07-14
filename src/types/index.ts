export type RiskLevel = 'critical' | 'high' | 'medium' | 'low' | 'none'
export type ActionType = 'allowed' | 'blocked' | 'warned' | 'redacted'
export type IncidentStatus = 'open' | 'investigating' | 'resolved' | 'dismissed'
export type AppStatus = 'approved' | 'restricted' | 'blocked' | 'shadow'
export type EndpointStatus = 'protected' | 'at-risk' | 'unmanaged'
export type ApprovalStatus = 'pending' | 'approved' | 'denied'

export interface Employee {
  id: string
  name: string
  email: string
  department: string
  role: string
  riskScore: number
  riskLevel: RiskLevel
  aiTools: string[]
  totalRequests: number
  violations: number
  lastActive: string
  avatar: string
}

export interface Incident {
  id: string
  title: string
  description: string
  severity: RiskLevel
  status: IncidentStatus
  user: string
  department: string
  aiTool: string
  assignee: string
  createdAt: string
  updatedAt: string
  category: string
}

export interface AIApp {
  id: string
  name: string
  category: string
  users: number
  requestsPerDay: number
  riskLevel: RiskLevel
  status: AppStatus
  description: string
  dataTypes: string[]
  lastSeen: string
}

export interface Policy {
  id: string
  name: string
  description: string
  conditions: number
  action: ActionType
  enabled: boolean
  lastModified: string
  appliesTo: string[]
  category: string
}

export interface ActivityEntry {
  id: string
  timestamp: string
  user: string
  department: string
  aiTool: string
  promptPreview: string
  fullPrompt: string
  response: string
  tokens: number
  action: ActionType
  riskScore: number
  category: string
  policies: string[]
}

export interface Department {
  id: string
  name: string
  headCount: number
  activeUsers: number
  aiInteractions: number
  riskScore: number
  violations: number
  topRisks: string[]
  blockedCount: number
  topTools: string[]
}

export interface AuditLog {
  id: string
  timestamp: string
  actor: string
  actorEmail: string
  action: string
  resource: string
  details: string
  ipAddress: string
  hash: string
  status: string
}

export interface Integration {
  id: string
  name: string
  category: string
  description: string
  connected: boolean
  logo: string
  connectedAt?: string
}

export interface Endpoint {
  id: string
  hostname: string
  os: string
  user: string
  agentVersion: string
  status: EndpointStatus
  lastSeen: string
  department: string
  ipAddress: string
  riskScore: number
}

export interface Approval {
  id: string
  requester: string
  department: string
  aiTool: string
  reason: string
  riskAssessment: RiskLevel
  requestedAt: string
  promptPreview: string
  status: ApprovalStatus
  approver: string
  decisionDate: string
}

export interface ClassificationRule {
  id: string
  name: string
  description: string
  patternCount: number
  detectionCount: number
  severity: RiskLevel
  enabled: boolean
}

export interface Report {
  id: string
  name: string
  description: string
  category: string
  lastGenerated: string
  format: string
}

export interface ChartPoint {
  name: string
  value: number
  color: string
}
