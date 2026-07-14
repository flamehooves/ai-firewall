import { useState } from 'react'
import { Search, Users, TrendingUp, CheckCircle, XCircle, MinusCircle, Eye } from 'lucide-react'
import { cn } from '../lib'
import { aiApps } from '../data/mockData'

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  approved: { label: 'Approved', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  restricted: { label: 'Restricted', color: 'bg-amber-100 text-amber-700', icon: MinusCircle },
  blocked: { label: 'Blocked', color: 'bg-red-100 text-red-700', icon: XCircle },
  shadow: { label: 'Shadow IT', color: 'bg-purple-100 text-purple-700', icon: Eye },
}

const riskColors: Record<string, string> = {
  critical: 'text-red-600 bg-red-50',
  high: 'text-orange-600 bg-orange-50',
  medium: 'text-amber-600 bg-amber-50',
  low: 'text-green-600 bg-green-50',
  none: 'text-gray-500 bg-gray-50',
}

export default function Applications() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')

  const categories = ['all', ...Array.from(new Set(aiApps.map(a => a.category)))]

  const filtered = aiApps.filter(a => {
    if (search && !a.name.toLowerCase().includes(search.toLowerCase())) return false
    if (statusFilter !== 'all' && a.status !== statusFilter) return false
    if (categoryFilter !== 'all' && a.category !== categoryFilter) return false
    return true
  })

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">AI Applications</h1>
          <p className="text-sm text-gray-500">{aiApps.length} detected apps · {aiApps.filter(a => a.status === 'approved').length} approved</p>
        </div>
      </div>

      {/* Summary counts */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {Object.entries(statusConfig).map(([key, cfg]) => (
          <button key={key} onClick={() => setStatusFilter(statusFilter === key ? 'all' : key)} className={cn('bg-white rounded-xl border border-gray-200 p-4 text-left hover:border-blue-300 transition-colors', statusFilter === key && 'border-blue-500 ring-1 ring-blue-500')}>
            <div className={cn('text-2xl font-bold', key === 'approved' ? 'text-green-600' : key === 'restricted' ? 'text-amber-600' : key === 'blocked' ? 'text-red-600' : 'text-purple-600')}>
              {aiApps.filter(a => a.status === key).length}
            </div>
            <div className="text-xs text-gray-500 mt-0.5">{cfg.label}</div>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search apps..." className="pl-9 pr-4 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-48" />
        </div>
        <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
          {categories.map(c => <option key={c} value={c}>{c === 'all' ? 'All Categories' : c}</option>)}
        </select>
      </div>

      {/* App cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(app => {
          const StatusIcon = statusConfig[app.status].icon
          return (
            <div key={app.id} className={cn('bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow', app.status === 'shadow' && 'border-purple-200 bg-purple-50/30')}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {app.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">{app.name}</h3>
                    <span className="text-xs text-gray-500">{app.category}</span>
                  </div>
                </div>
                <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1', statusConfig[app.status].color)}>
                  <StatusIcon className="w-3 h-3" />
                  {statusConfig[app.status].label}
                </span>
              </div>

              <p className="text-xs text-gray-500 mb-4">{app.description}</p>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-gray-50 rounded-lg p-2.5">
                  <div className="flex items-center gap-1 text-gray-500 mb-1">
                    <Users className="w-3 h-3" />
                    <span className="text-xs">Users</span>
                  </div>
                  <div className="text-sm font-semibold text-gray-800">{app.users.toLocaleString()}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-2.5">
                  <div className="flex items-center gap-1 text-gray-500 mb-1">
                    <TrendingUp className="w-3 h-3" />
                    <span className="text-xs">Req/day</span>
                  </div>
                  <div className="text-sm font-semibold text-gray-800">{app.requestsPerDay.toLocaleString()}</div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {app.dataTypes.map(dt => (
                    <span key={dt} className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{dt}</span>
                  ))}
                </div>
                <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', riskColors[app.riskLevel])}>
                  {app.riskLevel}
                </span>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-100 flex gap-2">
                {app.status !== 'approved' && (
                  <button className="flex-1 text-xs py-1.5 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors">Approve</button>
                )}
                {app.status !== 'blocked' && (
                  <button className="flex-1 text-xs py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors">Block</button>
                )}
                <button className="text-xs py-1.5 px-3 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">Details</button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
