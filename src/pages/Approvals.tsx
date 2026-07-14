import { useState } from 'react'
import { CheckCircle, XCircle, Clock } from 'lucide-react'
import { cn } from '../lib'
import { approvals } from '../data/mockData'
import type { Approval } from '../data/mockData'

const riskColors: Record<string, string> = {
  critical: 'bg-red-100 text-red-700',
  high: 'bg-orange-100 text-orange-700',
  medium: 'bg-amber-100 text-amber-700',
  low: 'bg-green-100 text-green-700',
}

export default function Approvals() {
  const [items, setItems] = useState<Approval[]>(approvals)

  const decide = (id: string, decision: 'approved' | 'denied') => {
    setItems(prev => prev.map(a => a.id === id ? { ...a, status: decision } : a))
  }

  const pending = items.filter(a => a.status === 'pending')
  const resolved = items.filter(a => a.status !== 'pending')

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Approval Queue</h1>
        <p className="text-sm text-gray-500">{pending.length} pending approvals</p>
      </div>

      {pending.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-500" />
            Pending Review
          </h2>
          <div className="space-y-4">
            {pending.map(item => (
              <div key={item.id} className="bg-white rounded-xl border border-amber-200 p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-bold flex-shrink-0">
                      {item.requester.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">{item.requester}</div>
                      <div className="text-xs text-gray-500">{item.department} · {item.aiTool}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{new Date(item.requestedAt).toLocaleString()}</div>
                    </div>
                  </div>
                  <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', riskColors[item.riskAssessment])}>
                    {item.riskAssessment} risk
                  </span>
                </div>

                <div className="mb-3">
                  <div className="text-xs text-gray-500 mb-1">Business Justification</div>
                  <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">{item.reason}</p>
                </div>

                <div className="mb-4">
                  <div className="text-xs text-gray-500 mb-1">Prompt Preview</div>
                  <p className="text-xs text-gray-600 font-mono bg-gray-900 text-gray-300 rounded-lg p-3 truncate">{item.promptPreview}</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => decide(item.id, 'approved')}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve
                  </button>
                  <button
                    onClick={() => decide(item.id, 'denied')}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                    Deny
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {resolved.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Resolved</h2>
          <div className="space-y-2">
            {resolved.map(item => (
              <div key={item.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 text-xs font-bold">
                    {item.requester.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-800">{item.requester}</div>
                    <div className="text-xs text-gray-500">{item.aiTool} · {item.department}</div>
                  </div>
                </div>
                <span className={cn('text-xs px-2.5 py-1 rounded-full font-medium', item.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700')}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {pending.length === 0 && resolved.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No pending approvals</p>
        </div>
      )}
    </div>
  )
}
