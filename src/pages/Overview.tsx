import { useState } from 'react'
import {
  Activity, AlertTriangle, Users, Shield, FileX, Eye, TrendingUp
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import { cn } from '../lib'
import {
  kpiMetrics, usageTrendData, riskByCategoryData, enforcementData,
  employees, aiApps, incidents
} from '../data/mockData'
import { motion } from 'framer-motion'

function KPICard({ label, value, icon: Icon, color, sub }: {
  label: string, value: string | number, icon: React.ElementType, color: string, sub?: string
}) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white rounded-xl border border-gray-200 p-4 flex items-start gap-3"
    >
      <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0', color)}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <div className="text-2xl font-bold text-gray-900">{typeof value === 'number' ? value.toLocaleString() : value}</div>
        <div className="text-xs text-gray-500 mt-0.5">{label}</div>
        {sub && <div className="text-xs text-gray-400 mt-0.5">{sub}</div>}
      </div>
    </motion.div>
  )
}

const riskColors: Record<string, string> = {
  critical: 'bg-red-100 text-red-700',
  high: 'bg-orange-100 text-orange-700',
  medium: 'bg-amber-100 text-amber-700',
  low: 'bg-green-100 text-green-700',
  none: 'bg-gray-100 text-gray-600',
}

const severityColors: Record<string, string> = {
  critical: 'bg-red-100 text-red-700',
  high: 'bg-orange-100 text-orange-700',
  medium: 'bg-amber-100 text-amber-700',
  low: 'bg-green-100 text-green-700',
}

export default function Overview() {
  const [trendPeriod, setTrendPeriod] = useState('7d')

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Security Overview</h1>
          <p className="text-sm text-gray-500">Zylker Global Enterprises — Real-time AI governance dashboard</p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-gray-600">Live monitoring active</span>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-4 gap-4">
        <KPICard label="Total AI Interactions" value="1.84M" icon={Activity} color="bg-blue-600" sub="Last 30 days" />
        <KPICard label="Active Users" value={kpiMetrics.activeUsers} icon={Users} color="bg-slate-600" sub="Using AI tools" />
        <KPICard label="Requests Blocked" value={kpiMetrics.blocked} icon={Shield} color="bg-red-600" sub="Policy violations" />
        <KPICard label="Requests Warned" value={kpiMetrics.warned} icon={AlertTriangle} color="bg-amber-500" sub="Risk flagged" />
        <KPICard label="Prompts Redacted" value={kpiMetrics.redacted} icon={Eye} color="bg-blue-500" sub="PII removed" />
        <KPICard label="Files Blocked" value={kpiMetrics.filesBlocked} icon={FileX} color="bg-orange-600" sub="Sensitive uploads" />
        <KPICard label="Critical Incidents" value={kpiMetrics.criticalIncidents} icon={AlertTriangle} color="bg-red-700" sub="Need attention" />
        <KPICard label="Total Violations" value={kpiMetrics.violations} icon={TrendingUp} color="bg-purple-600" sub="All time" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Usage trend */}
        <div className="xl:col-span-2 bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-gray-900">AI Usage Trend</h2>
              <p className="text-xs text-gray-500">Requests by enforcement outcome</p>
            </div>
            <div className="flex gap-1">
              {['24h', '7d', '30d', '90d'].map(p => (
                <button
                  key={p}
                  onClick={() => setTrendPeriod(p)}
                  className={cn('text-xs px-2.5 py-1 rounded-lg transition-colors', trendPeriod === p ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-100')}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={usageTrendData}>
              <defs>
                <linearGradient id="colorAllowed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorBlocked" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: any) => Number(v).toLocaleString()} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="allowed" name="Allowed" stroke="#22c55e" fill="url(#colorAllowed)" strokeWidth={2} />
              <Area type="monotone" dataKey="warned" name="Warned" stroke="#f59e0b" fill="none" strokeWidth={2} strokeDasharray="4 2" />
              <Area type="monotone" dataKey="redacted" name="Redacted" stroke="#3b82f6" fill="none" strokeWidth={2} strokeDasharray="4 2" />
              <Area type="monotone" dataKey="blocked" name="Blocked" stroke="#ef4444" fill="url(#colorBlocked)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Enforcement outcomes donut */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-1">Enforcement Outcomes</h2>
          <p className="text-xs text-gray-500 mb-4">Distribution of policy actions</p>
          <ResponsiveContainer width="100%" height={170}>
            <PieChart>
              <Pie data={enforcementData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                {enforcementData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v: any) => Number(v).toLocaleString()} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {enforcementData.map(e => (
              <div key={e.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: e.color }} />
                  <span className="text-gray-600">{e.name}</span>
                </div>
                <span className="font-medium text-gray-800">{e.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Risk by category */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="font-semibold text-gray-900 mb-1">Risk by Category</h2>
        <p className="text-xs text-gray-500 mb-4">Total violations detected by data type</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={riskByCategoryData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
            <YAxis type="category" dataKey="category" tick={{ fontSize: 11, fill: '#64748b' }} width={160} axisLine={false} tickLine={false} />
            <Tooltip formatter={(v: any) => Number(v).toLocaleString()} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
            <Bar dataKey="count" name="Violations" fill="#3b82f6" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom tables */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Top users */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Top Prolific Users</h2>
            <p className="text-xs text-gray-500">Highest AI request volume</p>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-4 py-2 text-xs text-gray-500 font-medium">User</th>
                <th className="text-right px-4 py-2 text-xs text-gray-500 font-medium">Requests</th>
                <th className="text-right px-4 py-2 text-xs text-gray-500 font-medium">Risk</th>
              </tr>
            </thead>
            <tbody>
              {[...employees].sort((a, b) => b.totalRequests - a.totalRequests).slice(0, 8).map(emp => (
                <tr key={emp.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-bold flex-shrink-0">{emp.avatar}</div>
                      <div>
                        <div className="text-xs font-medium text-gray-800 truncate max-w-[110px]">{emp.name}</div>
                        <div className="text-xs text-gray-400">{emp.department}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-right text-xs text-gray-700 font-medium">{emp.totalRequests.toLocaleString()}</td>
                  <td className="px-4 py-2.5 text-right">
                    <span className={cn('text-xs px-1.5 py-0.5 rounded-full font-medium', riskColors[emp.riskLevel])}>{emp.riskLevel}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Top AI tools */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Top AI Tools</h2>
            <p className="text-xs text-gray-500">By daily request volume</p>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-4 py-2 text-xs text-gray-500 font-medium">Tool</th>
                <th className="text-right px-4 py-2 text-xs text-gray-500 font-medium">Users</th>
                <th className="text-right px-4 py-2 text-xs text-gray-500 font-medium">Req/day</th>
              </tr>
            </thead>
            <tbody>
              {[...aiApps].sort((a, b) => b.requestsPerDay - a.requestsPerDay).map(app => (
                <tr key={app.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 flex-shrink-0">
                        {app.name.slice(0, 2)}
                      </div>
                      <div className="text-xs font-medium text-gray-800 truncate max-w-[90px]">{app.name}</div>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-right text-xs text-gray-700">{app.users.toLocaleString()}</td>
                  <td className="px-4 py-2.5 text-right text-xs font-medium text-gray-700">{app.requestsPerDay.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent critical incidents */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Recent Incidents</h2>
            <p className="text-xs text-gray-500">Critical & high severity</p>
          </div>
          <div className="divide-y divide-gray-50">
            {incidents.filter(i => i.severity === 'critical' || i.severity === 'high').slice(0, 6).map(inc => (
              <div key={inc.id} className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-xs font-medium text-gray-800 leading-tight truncate">{inc.title}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{inc.user} · {inc.aiTool}</div>
                  </div>
                  <span className={cn('text-xs px-1.5 py-0.5 rounded-full font-medium whitespace-nowrap flex-shrink-0', severityColors[inc.severity])}>
                    {inc.severity}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-1.5">
                  <span className={cn('text-xs px-1.5 py-0.5 rounded-full',
                    inc.status === 'open' ? 'bg-red-50 text-red-600' :
                    inc.status === 'investigating' ? 'bg-amber-50 text-amber-600' :
                    'bg-green-50 text-green-600'
                  )}>{inc.status}</span>
                  <span className="text-xs text-gray-400">{inc.id}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
