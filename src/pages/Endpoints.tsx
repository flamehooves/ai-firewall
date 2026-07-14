import { useState } from 'react'
import { Search, Monitor } from 'lucide-react'
import { cn } from '../lib'
import { endpoints } from '../data/mockData'

const statusConfig = {
  protected: { color: 'bg-green-100 text-green-700', dot: 'bg-green-500', label: 'Protected' },
  'at-risk': { color: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500', label: 'At Risk' },
  unmanaged: { color: 'bg-red-100 text-red-700', dot: 'bg-red-500', label: 'Unmanaged' },
}

export default function Endpoints() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = endpoints.filter(e => {
    if (search && !e.hostname.toLowerCase().includes(search.toLowerCase()) && !e.user.toLowerCase().includes(search.toLowerCase())) return false
    if (statusFilter !== 'all' && e.status !== statusFilter) return false
    return true
  })

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Endpoints</h1>
        <p className="text-sm text-gray-500">Endpoint protection status and AI agent deployment</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {(['protected', 'at-risk', 'unmanaged'] as const).map(status => {
          const count = endpoints.filter(e => e.status === status).length
          const cfg = statusConfig[status]
          return (
            <button key={status} onClick={() => setStatusFilter(statusFilter === status ? 'all' : status)} className={cn('bg-white rounded-xl border border-gray-200 p-4 text-left hover:border-blue-300 transition-colors', statusFilter === status && 'border-blue-500 ring-1 ring-blue-500')}>
              <div className="flex items-center gap-2 mb-1">
                <div className={cn('w-2.5 h-2.5 rounded-full', cfg.dot)} />
                <span className="text-xs text-gray-500">{cfg.label}</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{count}</div>
            </button>
          )
        })}
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search endpoints..." className="pl-9 pr-4 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-52" />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-2.5 text-xs text-gray-500 font-medium">Hostname</th>
                <th className="text-left px-4 py-2.5 text-xs text-gray-500 font-medium hidden md:table-cell">OS</th>
                <th className="text-left px-4 py-2.5 text-xs text-gray-500 font-medium">User</th>
                <th className="text-left px-4 py-2.5 text-xs text-gray-500 font-medium hidden lg:table-cell">Department</th>
                <th className="text-left px-4 py-2.5 text-xs text-gray-500 font-medium hidden xl:table-cell">Agent Version</th>
                <th className="text-left px-4 py-2.5 text-xs text-gray-500 font-medium">Status</th>
                <th className="text-left px-4 py-2.5 text-xs text-gray-500 font-medium hidden lg:table-cell">Last Seen</th>
                <th className="text-left px-4 py-2.5 text-xs text-gray-500 font-medium hidden xl:table-cell">IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(ep => {
                const cfg = statusConfig[ep.status]
                return (
                  <tr key={ep.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Monitor className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="text-xs font-mono font-medium text-gray-800">{ep.hostname}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 hidden md:table-cell">{ep.os}</td>
                    <td className="px-4 py-3 text-xs text-gray-700">{ep.user}</td>
                    <td className="px-4 py-3 text-xs text-gray-500 hidden lg:table-cell">{ep.department}</td>
                    <td className="px-4 py-3 text-xs font-mono text-gray-400 hidden xl:table-cell">{ep.agentVersion}</td>
                    <td className="px-4 py-3">
                      <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 w-fit', cfg.color)}>
                        <div className={cn('w-1.5 h-1.5 rounded-full', cfg.dot)} />
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400 hidden lg:table-cell">{ep.lastSeen}</td>
                    <td className="px-4 py-3 text-xs font-mono text-gray-400 hidden xl:table-cell">{ep.ipAddress}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
