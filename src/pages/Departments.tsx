import { departments } from '../data/mockData'
import { cn } from '../lib'
import { Building2, Users, Activity, AlertTriangle } from 'lucide-react'

const riskColor = (score: number) =>
  score >= 75 ? 'text-red-600 bg-red-50' : score >= 50 ? 'text-amber-600 bg-amber-50' : 'text-green-600 bg-green-50'

export default function Departments() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Departments</h1>
        <p className="text-sm text-gray-500">AI usage and risk overview by department</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {[...departments].sort((a, b) => b.riskScore - a.riskScore).map(dept => (
          <div key={dept.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{dept.name}</h3>
                  <p className="text-xs text-gray-500">{dept.headCount.toLocaleString()} employees</p>
                </div>
              </div>
              <span className={cn('text-sm font-bold px-3 py-1 rounded-full', riskColor(dept.riskScore))}>
                Risk: {dept.riskScore}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
                  <Users className="w-3.5 h-3.5" />
                  <span className="text-xs">Active Users</span>
                </div>
                <div className="text-lg font-bold text-gray-800">{dept.activeUsers.toLocaleString()}</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
                  <Activity className="w-3.5 h-3.5" />
                  <span className="text-xs">AI Requests</span>
                </div>
                <div className="text-lg font-bold text-gray-800">{(dept.aiInteractions/1000).toFixed(0)}k</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-gray-500 mb-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span className="text-xs">Violations</span>
                </div>
                <div className="text-lg font-bold text-red-600">{dept.violations.toLocaleString()}</div>
              </div>
            </div>

            <div className="mb-3">
              <div className="text-xs text-gray-500 mb-1">Risk progress</div>
              <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className={cn('h-full rounded-full transition-all', dept.riskScore >= 75 ? 'bg-red-500' : dept.riskScore >= 50 ? 'bg-amber-500' : 'bg-green-500')}
                  style={{ width: `${dept.riskScore}%` }}
                />
              </div>
            </div>

            <div>
              <div className="text-xs text-gray-500 mb-1.5">Top Risks</div>
              <div className="flex flex-wrap gap-1.5">
                {dept.topRisks.map(r => (
                  <span key={r} className="text-xs bg-red-50 text-red-700 border border-red-100 px-2 py-0.5 rounded-full">{r}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
