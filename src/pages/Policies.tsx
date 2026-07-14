import { useState } from 'react'
import { Plus, ToggleLeft, ToggleRight, Edit2, Trash2, Shield, Search } from 'lucide-react'
import { cn } from '../lib'
import { policies } from '../data/mockData'
import type { Policy } from '../data/mockData'

const actionColors: Record<string, string> = {
  blocked: 'bg-red-100 text-red-700',
  warned: 'bg-amber-100 text-amber-700',
  redacted: 'bg-blue-100 text-blue-700',
  allowed: 'bg-green-100 text-green-700',
}

export default function Policies() {
  const [policyList, setPolicyList] = useState<Policy[]>(policies)
  const [search, setSearch] = useState('')
  const [showBuilder, setShowBuilder] = useState(false)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({ name: '', description: '', action: 'blocked', category: 'Security' })

  const filtered = policyList.filter(p =>
    !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase())
  )

  const toggle = (id: string) => {
    setPolicyList(prev => prev.map(p => p.id === id ? { ...p, enabled: !p.enabled } : p))
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Policies</h1>
          <p className="text-sm text-gray-500">{policyList.filter(p => p.enabled).length} active policies · {policyList.length} total</p>
        </div>
        <button onClick={() => { setShowBuilder(true); setStep(1) }} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" />
          Create Policy
        </button>
      </div>

      {/* Policy Builder Modal */}
      {showBuilder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-gray-900">Create Policy</h2>
                <div className="flex items-center gap-1 mt-1">
                  {[1,2,3].map(s => (
                    <div key={s} className={cn('h-1.5 rounded-full transition-all', s <= step ? 'w-8 bg-blue-600' : 'w-8 bg-gray-200')} />
                  ))}
                  <span className="text-xs text-gray-400 ml-2">Step {step} of 3</span>
                </div>
              </div>
              <button onClick={() => setShowBuilder(false)} className="text-gray-400 hover:text-gray-700 text-xl">&times;</button>
            </div>
            <div className="p-6">
              {step === 1 && (
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Basic Information</h3>
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">Policy Name</label>
                    <input value={formData.name} onChange={e => setFormData(p => ({...p, name: e.target.value}))} placeholder="e.g. Block PCI Data Submission" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">Description</label>
                    <textarea value={formData.description} onChange={e => setFormData(p => ({...p, description: e.target.value}))} rows={3} placeholder="Describe what this policy enforces..." className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-600 mb-1 block">Category</label>
                      <select value={formData.category} onChange={e => setFormData(p => ({...p, category: e.target.value}))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>Security</option><option>Privacy</option><option>Compliance</option><option>IP Protection</option><option>App Control</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 mb-1 block">Enforcement Action</label>
                      <select value={formData.action} onChange={e => setFormData(p => ({...p, action: e.target.value}))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="blocked">Block</option>
                        <option value="warned">Warn</option>
                        <option value="redacted">Redact</option>
                        <option value="allowed">Allow (Log only)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
              {step === 2 && (
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Detection Conditions</h3>
                  <p className="text-sm text-gray-500">Define what patterns or data types trigger this policy.</p>
                  <div className="border border-gray-200 rounded-lg divide-y divide-gray-100">
                    {['Contains credit card numbers (PCI)', 'Contains SSN or government ID', 'Contains API keys or secrets', 'File upload detected', 'Prompt length > 2000 tokens'].map((cond, i) => (
                      <label key={i} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer">
                        <input type="checkbox" defaultChecked={i < 2} className="rounded text-blue-600" />
                        <span className="text-sm text-gray-700">{cond}</span>
                      </label>
                    ))}
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">Custom Regex Pattern (optional)</label>
                    <input placeholder='e.g. (?i)(api[_-]?key|secret[_-]?key)' className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
              )}
              {step === 3 && (
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Scope & Notifications</h3>
                  <div>
                    <label className="text-sm text-gray-600 mb-2 block">Apply to</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['All Users', 'Engineering', 'Finance', 'HR', 'Legal', 'R&D', 'Sales', 'Marketing'].map(dept => (
                        <label key={dept} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                          <input type="checkbox" defaultChecked={dept === 'All Users'} className="rounded text-blue-600" />
                          {dept}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 mb-2 block">Notify on violation</label>
                    <div className="space-y-2">
                      {['Security team (Slack #security-alerts)', 'Arun Kumar (arun.kumar@zylker.com)', 'User\'s manager'].map(n => (
                        <label key={n} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                          <input type="checkbox" defaultChecked className="rounded text-blue-600" />
                          {n}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="text-sm font-medium text-blue-800 mb-1">Policy Summary</div>
                    <p className="text-xs text-blue-700">{formData.name || 'Unnamed Policy'} — Action: <strong>{formData.action}</strong> — Category: {formData.category}</p>
                  </div>
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-between">
              <button onClick={() => step > 1 ? setStep(s => s-1) : setShowBuilder(false)} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">
                {step === 1 ? 'Cancel' : 'Back'}
              </button>
              <button onClick={() => { if (step < 3) setStep(s => s+1); else { setShowBuilder(false); setStep(1) } }} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                {step === 3 ? 'Create Policy' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative mb-4 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search policies..." className="pl-9 pr-4 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full" />
      </div>

      {/* Policy list */}
      <div className="space-y-3">
        {filtered.map(policy => (
          <div key={policy.id} className={cn('bg-white rounded-xl border p-4 flex items-start gap-4 transition-opacity', !policy.enabled && 'opacity-60', 'border-gray-200')}>
            <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0', policy.enabled ? 'bg-blue-100' : 'bg-gray-100')}>
              <Shield className={cn('w-5 h-5', policy.enabled ? 'text-blue-600' : 'text-gray-400')} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-2 flex-wrap">
                <h3 className="font-semibold text-gray-900 text-sm">{policy.name}</h3>
                <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', actionColors[policy.action])}>{policy.action}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{policy.category}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">{policy.description}</p>
              <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                <span>{policy.conditions} conditions</span>
                <span>·</span>
                <span>Applies to: {policy.appliesTo.join(', ')}</span>
                <span>·</span>
                <span>Modified {policy.lastModified}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button className="text-gray-400 hover:text-blue-600 p-1.5 rounded-lg hover:bg-blue-50"><Edit2 className="w-4 h-4" /></button>
              <button className="text-gray-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
              <button onClick={() => toggle(policy.id)} className={cn('p-1.5 rounded-lg', policy.enabled ? 'text-blue-600' : 'text-gray-300')}>
                {policy.enabled ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
