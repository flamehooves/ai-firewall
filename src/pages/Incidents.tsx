import { useState } from 'react'
import { AlertTriangle, Search, X, Clock, User, Cpu } from 'lucide-react'
import { cn } from '../lib'
import { incidents } from '../data/mockData'
import type { Incident } from '../data/mockData'

const sevColors: Record<string, string> = {
  critical: 'bg-red-100 text-red-700 border-red-200',
  high: 'bg-orange-100 text-orange-700 border-orange-200',
  medium: 'bg-amber-100 text-amber-700 border-amber-200',
  low: 'bg-green-100 text-green-700 border-green-200',
}
const statusColors: Record<string, string> = {
  open: 'bg-red-50 text-red-600',
  investigating: 'bg-amber-50 text-amber-700',
  resolved: 'bg-green-50 text-green-700',
  dismissed: 'bg-gray-100 text-gray-500',
}

export default function Incidents() {
  const [search, setSearch] = useState('')
  const [sevFilter, setSevFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selected, setSelected] = useState<Incident | null>(null)

  const filtered = incidents.filter(i => {
    if (search && !i.title.toLowerCase().includes(search.toLowerCase()) && !i.user.toLowerCase().includes(search.toLowerCase())) return false
    if (sevFilter !== 'all' && i.severity !== sevFilter) return false
    if (statusFilter !== 'all' && i.status !== statusFilter) return false
    return true
  })

  const counts = {
    critical: incidents.filter(i => i.severity === 'critical').length,
    high: incidents.filter(i => i.severity === 'high').length,
    medium: incidents.filter(i => i.severity === 'medium').length,
    open: incidents.filter(i => i.status === 'open').length,
  }

  return (
    <div className="flex h-full">
      <div className={cn('flex-1 min-w-0 flex flex-col', selected && 'hidden lg:flex')}>
        <div className="px-6 py-4 border-b border-gray-200 bg-white">
          <h1 className="text-xl font-bold text-gray-900 mb-3">Incidents</h1>

          {/* Stats bar */}
          <div className="grid grid-cols-4 gap-3 mb-4">
            {[
              { label: 'Total', value: incidents.length, color: 'text-gray-900' },
              { label: 'Critical', value: counts.critical, color: 'text-red-600' },
              { label: 'High', value: counts.high, color: 'text-orange-600' },
              { label: 'Open', value: counts.open, color: 'text-amber-600' },
            ].map(s => (
              <div key={s.label} className="bg-gray-50 rounded-lg p-3">
                <div className={cn('text-xl font-bold', s.color)}>{s.value}</div>
                <div className="text-xs text-gray-500">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search incidents..." className="pl-9 pr-4 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-52" />
            </div>
            <select value={sevFilter} onChange={e => setSevFilter(e.target.value)} className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">All Statuses</option>
              <option value="open">Open</option>
              <option value="investigating">Investigating</option>
              <option value="resolved">Resolved</option>
              <option value="dismissed">Dismissed</option>
            </select>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-gray-50 border-b border-gray-200 z-10">
              <tr>
                <th className="text-left px-4 py-2.5 text-xs text-gray-500 font-medium">ID</th>
                <th className="text-left px-4 py-2.5 text-xs text-gray-500 font-medium">Title</th>
                <th className="text-left px-4 py-2.5 text-xs text-gray-500 font-medium">Severity</th>
                <th className="text-left px-4 py-2.5 text-xs text-gray-500 font-medium hidden md:table-cell">User</th>
                <th className="text-left px-4 py-2.5 text-xs text-gray-500 font-medium hidden lg:table-cell">Tool</th>
                <th className="text-left px-4 py-2.5 text-xs text-gray-500 font-medium">Status</th>
                <th className="text-left px-4 py-2.5 text-xs text-gray-500 font-medium hidden xl:table-cell">Assignee</th>
                <th className="text-left px-4 py-2.5 text-xs text-gray-500 font-medium hidden xl:table-cell">Created</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-50">
              {filtered.map(inc => (
                <tr key={inc.id} onClick={() => setSelected(inc)} className={cn('hover:bg-gray-50 cursor-pointer', selected?.id === inc.id && 'bg-blue-50')}>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{inc.id}</td>
                  <td className="px-4 py-3 max-w-xs">
                    <div className="text-xs font-medium text-gray-800 truncate">{inc.title}</div>
                    <div className="text-xs text-gray-400">{inc.category}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium border', sevColors[inc.severity])}>{inc.severity}</span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-xs text-gray-600">{inc.user}</td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{inc.aiTool}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn('text-xs px-2 py-0.5 rounded-full', statusColors[inc.status])}>{inc.status}</span>
                  </td>
                  <td className="px-4 py-3 hidden xl:table-cell text-xs text-gray-500">{inc.assignee}</td>
                  <td className="px-4 py-3 hidden xl:table-cell text-xs text-gray-400">{new Date(inc.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Panel */}
      {selected && (
        <div className="w-full lg:w-[420px] flex-shrink-0 border-l border-gray-200 bg-white flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
            <span className="font-semibold text-sm text-gray-900">{selected.id}</span>
            <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-700"><X className="w-5 h-5" /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div>
              <h2 className="font-semibold text-gray-900 text-sm mb-2">{selected.title}</h2>
              <div className="flex gap-2 flex-wrap">
                <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium border', sevColors[selected.severity])}>{selected.severity}</span>
                <span className={cn('text-xs px-2 py-0.5 rounded-full', statusColors[selected.status])}>{selected.status}</span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 space-y-3 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <User className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-500">User:</span>
                <span className="text-xs font-medium">{selected.user} ({selected.department})</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Cpu className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-500">AI Tool:</span>
                <span className="text-xs font-medium">{selected.aiTool}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <AlertTriangle className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-500">Category:</span>
                <span className="text-xs font-medium">{selected.category}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-500">Created:</span>
                <span className="text-xs font-medium">{new Date(selected.createdAt).toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <User className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-500">Assignee:</span>
                <span className="text-xs font-medium">{selected.assignee}</span>
              </div>
            </div>

            <div>
              <div className="text-xs text-gray-500 font-medium mb-2">Description</div>
              <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 rounded-lg p-3">{selected.description}</p>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors">
                Assign to Me
              </button>
              <button className="flex-1 py-2 rounded-lg border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors">
                Resolve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
