import { useState } from 'react'
import { Search, X, Clock, AlertTriangle } from 'lucide-react'
import { cn } from '../lib'
import { activityLog } from '../data/mockData'
import type { ActivityEntry } from '../data/mockData'

const actionColors: Record<string, string> = {
  allowed: 'bg-green-100 text-green-700',
  blocked: 'bg-red-100 text-red-700',
  warned: 'bg-amber-100 text-amber-700',
  redacted: 'bg-blue-100 text-blue-700',
}

export default function Activity() {
  const [search, setSearch] = useState('')
  const [actionFilter, setActionFilter] = useState('all')
  const [toolFilter, setToolFilter] = useState('all')
  const [selected, setSelected] = useState<ActivityEntry | null>(null)

  const tools = ['all', ...Array.from(new Set(activityLog.map(a => a.aiTool)))]
  const actions = ['all', 'allowed', 'blocked', 'warned', 'redacted']

  const filtered = activityLog.filter(a => {
    if (search && !a.user.toLowerCase().includes(search.toLowerCase()) && !a.promptPreview.toLowerCase().includes(search.toLowerCase())) return false
    if (actionFilter !== 'all' && a.action !== actionFilter) return false
    if (toolFilter !== 'all' && a.aiTool !== toolFilter) return false
    return true
  })

  return (
    <div className="flex h-full">
      <div className={cn('flex-1 min-w-0 flex flex-col', selected && 'hidden lg:flex')}>
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-xl font-bold text-gray-900">AI Activity Log</h1>
              <p className="text-sm text-gray-500">{filtered.length.toLocaleString()} interactions shown</p>
            </div>
          </div>
          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search user or prompt..."
                className="pl-9 pr-4 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-56"
              />
            </div>
            <select value={actionFilter} onChange={e => setActionFilter(e.target.value)} className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              {actions.map(a => <option key={a} value={a}>{a === 'all' ? 'All Actions' : a.charAt(0).toUpperCase() + a.slice(1)}</option>)}
            </select>
            <select value={toolFilter} onChange={e => setToolFilter(e.target.value)} className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              {tools.map(t => <option key={t} value={t}>{t === 'all' ? 'All Tools' : t}</option>)}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-gray-50 border-b border-gray-200 z-10">
              <tr>
                <th className="text-left px-4 py-2.5 text-xs text-gray-500 font-medium">Timestamp</th>
                <th className="text-left px-4 py-2.5 text-xs text-gray-500 font-medium">User</th>
                <th className="text-left px-4 py-2.5 text-xs text-gray-500 font-medium hidden md:table-cell">Department</th>
                <th className="text-left px-4 py-2.5 text-xs text-gray-500 font-medium">Tool</th>
                <th className="text-left px-4 py-2.5 text-xs text-gray-500 font-medium hidden lg:table-cell">Prompt Preview</th>
                <th className="text-right px-4 py-2.5 text-xs text-gray-500 font-medium hidden lg:table-cell">Risk</th>
                <th className="text-left px-4 py-2.5 text-xs text-gray-500 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-50">
              {filtered.map(entry => (
                <tr
                  key={entry.id}
                  onClick={() => setSelected(entry)}
                  className={cn('hover:bg-gray-50 cursor-pointer', selected?.id === entry.id && 'bg-blue-50')}
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      {new Date(entry.timestamp).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-xs font-medium text-gray-800">{entry.user}</div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <div className="text-xs text-gray-500">{entry.department}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">{entry.aiTool}</span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell max-w-xs">
                    <div className="text-xs text-gray-600 truncate">{entry.promptPreview}</div>
                  </td>
                  <td className="px-4 py-3 text-right hidden lg:table-cell">
                    <div className={cn('text-xs font-bold', entry.riskScore >= 80 ? 'text-red-600' : entry.riskScore >= 50 ? 'text-amber-600' : 'text-green-600')}>
                      {entry.riskScore}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', actionColors[entry.action])}>
                      {entry.action}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="text-center py-12 text-sm text-gray-400">No activity matches the current filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspector panel */}
      {selected && (
        <div className="w-full lg:w-[420px] xl:w-[480px] flex-shrink-0 border-l border-gray-200 bg-white flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900 text-sm">Activity Detail</h2>
            <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className={cn('text-sm px-2.5 py-1 rounded-full font-medium', actionColors[selected.action])}>
                {selected.action.toUpperCase()}
              </span>
              <div className={cn('text-lg font-bold', selected.riskScore >= 80 ? 'text-red-600' : selected.riskScore >= 50 ? 'text-amber-600' : 'text-green-600')}>
                Risk: {selected.riskScore}/100
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-1">User</div>
                <div className="font-medium text-gray-800">{selected.user}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-1">AI Tool</div>
                <div className="font-medium text-gray-800">{selected.aiTool}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-1">Department</div>
                <div className="font-medium text-gray-800">{selected.department}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-1">Category</div>
                <div className="font-medium text-gray-800">{selected.category}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-1">Tokens</div>
                <div className="font-medium text-gray-800">{selected.tokens}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-1">Timestamp</div>
                <div className="font-medium text-gray-800 text-xs">{new Date(selected.timestamp).toLocaleString()}</div>
              </div>
            </div>

            {selected.policies.length > 0 && (
              <div>
                <div className="text-xs text-gray-500 mb-2 font-medium flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  Policies Triggered
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selected.policies.map(p => (
                    <span key={p} className="text-xs bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded-full">{p}</span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <div className="text-xs text-gray-500 mb-2 font-medium">Full Prompt</div>
              <div className="bg-gray-900 text-gray-100 rounded-lg p-3 text-xs font-mono whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                {selected.fullPrompt}
              </div>
            </div>

            <div>
              <div className="text-xs text-gray-500 mb-2 font-medium">Response / Enforcement</div>
              <div className={cn('rounded-lg p-3 text-xs font-mono whitespace-pre-wrap leading-relaxed max-h-32 overflow-y-auto',
                selected.action === 'blocked' ? 'bg-red-50 text-red-800' :
                selected.action === 'redacted' ? 'bg-blue-50 text-blue-800' :
                selected.action === 'warned' ? 'bg-amber-50 text-amber-800' :
                'bg-green-50 text-green-800'
              )}>
                {selected.response}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
