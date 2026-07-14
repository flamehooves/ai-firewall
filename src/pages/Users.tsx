import { useState } from 'react'
import { Search, ChevronUp, ChevronDown } from 'lucide-react'
import { cn } from '../lib'
import { employees } from '../data/mockData'
import type { Employee } from '../data/mockData'

const riskColors: Record<string, string> = {
  critical: 'bg-red-100 text-red-700',
  high: 'bg-orange-100 text-orange-700',
  medium: 'bg-amber-100 text-amber-700',
  low: 'bg-green-100 text-green-700',
  none: 'bg-gray-100 text-gray-600',
}

type SortKey = keyof Employee
export default function Users() {
  const [search, setSearch] = useState('')
  const [deptFilter, setDeptFilter] = useState('all')
  const [riskFilter, setRiskFilter] = useState('all')
  const [sort, setSort] = useState<{ key: SortKey; dir: 'asc' | 'desc' }>({ key: 'riskScore', dir: 'desc' })

  const depts = ['all', ...Array.from(new Set(employees.map(e => e.department)))]

  const toggleSort = (key: SortKey) => {
    setSort(prev => ({ key, dir: prev.key === key && prev.dir === 'desc' ? 'asc' : 'desc' }))
  }

  const filtered = employees
    .filter(e => {
      if (search && !e.name.toLowerCase().includes(search.toLowerCase()) && !e.email.toLowerCase().includes(search.toLowerCase())) return false
      if (deptFilter !== 'all' && e.department !== deptFilter) return false
      if (riskFilter !== 'all' && e.riskLevel !== riskFilter) return false
      return true
    })
    .sort((a, b) => {
      const av = a[sort.key] as string | number
      const bv = b[sort.key] as string | number
      return sort.dir === 'asc' ? (av < bv ? -1 : 1) : (av > bv ? -1 : 1)
    })

  const SortIcon = ({ k }: { k: SortKey }) => (
    <span className="inline-flex flex-col ml-1">
      <ChevronUp className={cn('w-2.5 h-2.5', sort.key === k && sort.dir === 'asc' ? 'text-blue-600' : 'text-gray-300')} />
      <ChevronDown className={cn('w-2.5 h-2.5 -mt-0.5', sort.key === k && sort.dir === 'desc' ? 'text-blue-600' : 'text-gray-300')} />
    </span>
  )

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Users</h1>
          <p className="text-sm text-gray-500">{filtered.length} of {employees.length} users</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..." className="pl-9 pr-4 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-52" />
        </div>
        <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)} className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
          {depts.map(d => <option key={d} value={d}>{d === 'all' ? 'All Departments' : d}</option>)}
        </select>
        <select value={riskFilter} onChange={e => setRiskFilter(e.target.value)} className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="all">All Risk Levels</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-2.5 text-xs text-gray-500 font-medium">User</th>
                <th className="text-left px-4 py-2.5 text-xs text-gray-500 font-medium cursor-pointer hover:text-gray-900" onClick={() => toggleSort('department')}>
                  Department <SortIcon k="department" />
                </th>
                <th className="text-left px-4 py-2.5 text-xs text-gray-500 font-medium hidden md:table-cell">AI Tools</th>
                <th className="text-right px-4 py-2.5 text-xs text-gray-500 font-medium cursor-pointer hover:text-gray-900 hidden lg:table-cell" onClick={() => toggleSort('totalRequests')}>
                  Requests <SortIcon k="totalRequests" />
                </th>
                <th className="text-right px-4 py-2.5 text-xs text-gray-500 font-medium cursor-pointer hover:text-gray-900 hidden lg:table-cell" onClick={() => toggleSort('violations')}>
                  Violations <SortIcon k="violations" />
                </th>
                <th className="text-right px-4 py-2.5 text-xs text-gray-500 font-medium cursor-pointer hover:text-gray-900" onClick={() => toggleSort('riskScore')}>
                  Risk Score <SortIcon k="riskScore" />
                </th>
                <th className="text-left px-4 py-2.5 text-xs text-gray-500 font-medium hidden xl:table-cell">Last Active</th>
                <th className="px-4 py-2.5 text-xs text-gray-500 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(emp => (
                <tr key={emp.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-bold flex-shrink-0">{emp.avatar}</div>
                      <div>
                        <div className="text-xs font-medium text-gray-800">{emp.name}</div>
                        <div className="text-xs text-gray-400">{emp.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600">{emp.department}</td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {emp.aiTools.slice(0, 2).map(t => <span key={t} className="text-xs bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">{t}</span>)}
                      {emp.aiTools.length > 2 && <span className="text-xs text-gray-400">+{emp.aiTools.length - 2}</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right text-xs text-gray-700 font-medium hidden lg:table-cell">{emp.totalRequests.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right hidden lg:table-cell">
                    <span className={cn('text-xs font-medium', emp.violations > 10 ? 'text-red-600' : emp.violations > 4 ? 'text-amber-600' : 'text-gray-600')}>{emp.violations}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 h-1.5 rounded-full bg-gray-100 overflow-hidden hidden xl:block">
                        <div className={cn('h-full rounded-full', emp.riskScore >= 80 ? 'bg-red-500' : emp.riskScore >= 60 ? 'bg-amber-500' : 'bg-green-500')} style={{ width: `${emp.riskScore}%` }} />
                      </div>
                      <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', riskColors[emp.riskLevel])}>{emp.riskScore}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400 hidden xl:table-cell">{emp.lastActive}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 justify-center">
                      <button className="text-xs px-2 py-1 rounded border border-gray-200 text-gray-600 hover:bg-gray-50">View</button>
                      <button className="text-xs px-2 py-1 rounded border border-red-200 text-red-600 hover:bg-red-50">Restrict</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
