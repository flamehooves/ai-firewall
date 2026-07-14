import { useState } from 'react'
import { Tag, Plus, Edit2 } from 'lucide-react'

const classificationRules = [
  { id: 'c1', name: 'PII — Personal Identifiable Information', patterns: 24, detections: 18240, action: 'Redact', color: 'bg-blue-500', examples: ['SSN', 'Email addresses', 'Phone numbers', 'Date of birth', 'Home address'] },
  { id: 'c2', name: 'PHI — Protected Health Information', patterns: 18, detections: 4210, action: 'Block', color: 'bg-purple-500', examples: ['Patient ID', 'Medical records', 'Diagnoses', 'Lab results', 'Insurance ID'] },
  { id: 'c3', name: 'PCI — Payment Card Industry', patterns: 12, detections: 2840, action: 'Block', color: 'bg-red-500', examples: ['Credit card numbers', 'CVV codes', 'Expiry dates', 'Bank accounts'] },
  { id: 'c4', name: 'Source Code & IP', patterns: 8, detections: 12180, action: 'Block', color: 'bg-amber-500', examples: ['File uploads (.py, .ts, .java)', '>500 line pastes', 'Proprietary algorithms', 'Internal API specs'] },
  { id: 'c5', name: 'Credentials & Secrets', patterns: 15, detections: 8420, action: 'Block', color: 'bg-orange-600', examples: ['AWS/GCP/Azure keys', 'SSH private keys', 'Database passwords', 'API tokens', 'OAuth secrets'] },
  { id: 'c6', name: 'Confidential Business Data', patterns: 10, detections: 7840, action: 'Warn', color: 'bg-slate-500', examples: ['Revenue figures', 'M&A targets', 'Board discussions', 'Unreleased products'] },
]

const dictionaries = [
  { name: 'Zylker Codenames', terms: 42, description: 'Internal project codenames (Helios, Aurora, Nexus...)' },
  { name: 'Competitor Names', terms: 28, description: 'Competitor company and product names' },
  { name: 'Executive Names', terms: 14, description: 'C-suite and board member names' },
  { name: 'Regulatory Terms', terms: 63, description: 'GDPR, HIPAA, SOX compliance keywords' },
]

export default function Classifications() {
  const [activeTab, setActiveTab] = useState<'rules' | 'dictionaries'>('rules')

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Data Classifications</h1>
          <p className="text-sm text-gray-500">Detection rules and custom dictionaries</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
          <Plus className="w-4 h-4" />
          New Rule
        </button>
      </div>

      <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-xl w-fit">
        <button onClick={() => setActiveTab('rules')} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'rules' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}>
          Classification Rules
        </button>
        <button onClick={() => setActiveTab('dictionaries')} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'dictionaries' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}>
          Custom Dictionaries
        </button>
      </div>

      {activeTab === 'rules' && (
        <div className="space-y-3">
          {classificationRules.map(rule => (
            <div key={rule.id} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${rule.color} flex-shrink-0 mt-0.5`} />
                  <h3 className="font-semibold text-gray-900 text-sm">{rule.name}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${rule.action === 'Block' ? 'bg-red-100 text-red-700' : rule.action === 'Warn' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                    {rule.action}
                  </span>
                  <button className="text-gray-400 hover:text-blue-600 p-1 rounded"><Edit2 className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="flex items-center gap-6 text-sm mb-3">
                <div>
                  <span className="text-gray-500 text-xs">Patterns: </span>
                  <span className="font-medium text-gray-800">{rule.patterns}</span>
                </div>
                <div>
                  <span className="text-gray-500 text-xs">Detections (30d): </span>
                  <span className="font-medium text-red-600">{rule.detections.toLocaleString()}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {rule.examples.map(ex => (
                  <span key={ex} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{ex}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'dictionaries' && (
        <div className="space-y-3">
          {dictionaries.map(dict => (
            <div key={dict.name} className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Tag className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">{dict.name}</h3>
                  <p className="text-xs text-gray-500">{dict.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="text-center">
                  <div className="font-bold text-gray-800">{dict.terms}</div>
                  <div className="text-xs text-gray-500">terms</div>
                </div>
                <button className="text-xs px-3 py-1.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">Edit</button>
              </div>
            </div>
          ))}
          <button className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-400 hover:border-blue-300 hover:text-blue-600 transition-colors flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" />
            Add Custom Dictionary
          </button>
        </div>
      )}
    </div>
  )
}
