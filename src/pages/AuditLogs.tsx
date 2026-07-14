import { useState } from 'react'
import { Search, Lock } from 'lucide-react'
import { cn } from '../lib'
import { auditLogs } from '../data/mockData'

const actionColors: Record<string, string> = {
  BLOCK: 'bg-red-100 text-red-700',
  POLICY_UPDATE: 'bg-blue-100 text-blue-700',
  INCIDENT_CREATED: 'bg-orange-100 text-orange-700',
  APP_BLOCKED: 'bg-red-100 text-red-700',
  USER_SUSPENDED: 'bg-purple-100 text-purple-700',
  REPORT_GENERATED: 'bg-gray-100 text-gray-600',
  INTEGRATION_CONNECTED: 'bg-green-100 text-green-700',
  POLICY_CREATED: 'bg-blue-100 text-blue-700',
}

export default function AuditLogs() {
  const [search, setSearch] = useState('')
  const [actionFilter, setActionFilter] = useState('all')

  const actions = ['all', ...Array.from(new Set(auditLogs.map(a => a.action)))]

  const filtered = auditLogs.filter(log => {
    if (search && !log.actor.toLowerCase().includes(search.toLowerCase()) && !log.details.toLowerCase().includes(search.toLowerCase())) return false
    if (actionFilter !== 'all' && log.action !== actionFilter) return false
    return true
  })

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Audit Logs</h1>
          <p className="text-sm text-gray-500 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-green-600" />
            Tamper-evident, cryptographically hashed audit trail
          </p>
        </div>
        <div className="text-xs text-green-600 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full flex items-center gap-1.5">
          <Lock className="w-3 h-3" />
          Integrity: Verified
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search logs..." className="pl-9 pr-4 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-52" />
        </div>
        <select value={actionFilter} onChange={e => setActionFilter(e.target.value)} className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
          {actions.map(a => <option key={a} value={a}>{a === 'all' ? 'All Actions' : a}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-2.5 text-xs text-gray-500 font-medium">Timestamp</th>
                <th className="text-left px-4 py-2.5 text-xs text-gray-500 font-medium">Actor</th>
                <th className="text-left px-4 py-2.5 text-xs text-gray-500 font-medium">Action</th>
                <th className="text-left px-4 py-2.5 text-xs text-gray-500 font-medium hidden md:table-cell">Resource</th>
                <th className="text-left px-4 py-2.5 text-xs text-gray-500 font-medium hidden xl:table-cell">Details</th>
                <th className="text-left px-4 py-2.5 text-xs text-gray-500 font-medium hidden lg:table-cell">IP</th>
                <th className="text-left px-4 py-2.5 text-xs text-gray-500 font-medium hidden xl:table-cell">Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(log => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <div className="text-xs font-medium text-gray-800">{log.actor}</div>
                    <div className="text-xs text-gray-400">{log.actorEmail}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn('text-xs px-2 py-0.5 rounded font-mono font-medium', actionColors[log.action] ?? 'bg-gray-100 text-gray-600')}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600 max-w-[180px] truncate hidden md:table-cell">{log.resource}</td>
                  <td className="px-4 py-3 text-xs text-gray-500 max-w-xs truncate hidden xl:table-cell">{log.details}</td>
                  <td className="px-4 py-3 text-xs font-mono text-gray-400 hidden lg:table-cell">{log.ipAddress}</td>
                  <td className="px-4 py-3 text-xs font-mono text-gray-300 hidden xl:table-cell">{log.hash}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
