import { useState } from 'react'
import { CheckCircle, Plus, Plug, Settings } from 'lucide-react'
import { integrations } from '../data/mockData'

export default function Integrations() {
  const [items, setItems] = useState(integrations)

  const connected = items.filter(i => i.connected)
  const available = items.filter(i => !i.connected)

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Integrations</h1>
          <p className="text-sm text-gray-500">{connected.length} connected · {available.length} available</p>
        </div>
      </div>

      {/* Connected */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-500" />
          Connected Integrations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {connected.map(int => (
            <div key={int.id} className="bg-white rounded-xl border border-green-200 p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {int.logo}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">{int.name}</h3>
                    <span className="text-xs text-gray-500">{int.category}</span>
                  </div>
                </div>
                <span className="text-xs flex items-center gap-1 text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  Connected
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-3">{int.description}</p>
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>Since {int.connectedAt}</span>
                <button className="text-gray-500 hover:text-gray-700 flex items-center gap-1">
                  <Settings className="w-3.5 h-3.5" />
                  Configure
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Available */}
      <div>
        <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <Plug className="w-4 h-4 text-gray-400" />
          Available Integrations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {available.map(int => (
            <div key={int.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:border-blue-300 hover:shadow-sm transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 text-xs font-bold flex-shrink-0">
                    {int.logo}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">{int.name}</h3>
                    <span className="text-xs text-gray-500">{int.category}</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mb-3">{int.description}</p>
              <button
                onClick={() => setItems(prev => prev.map(i => i.id === int.id ? { ...i, connected: true, connectedAt: '2026-07-13' } : i))}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Connect
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
