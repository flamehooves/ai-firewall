import { useState } from 'react'
import { Save, Key, Bell, Shield, Globe, Users, Database } from 'lucide-react'

const tabs = [
  { id: 'general', label: 'General', icon: Globe },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'sso', label: 'SSO / SAML', icon: Key },
  { id: 'roles', label: 'Roles', icon: Users },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'retention', label: 'Retention', icon: Database },
]

export default function Settings() {
  const [activeTab, setActiveTab] = useState('general')

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500">Organization configuration and preferences</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar tabs */}
        <div className="w-48 flex-shrink-0">
          <nav className="space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors text-left ${activeTab === tab.id ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {activeTab === 'general' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
              <h2 className="font-semibold text-gray-900">Organization Settings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Organization Name</label>
                  <input defaultValue="Zylker Global Enterprises" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Primary Domain</label>
                  <input defaultValue="zylker.com" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Admin Email</label>
                  <input defaultValue="arun.kumar@zylker.com" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Timezone</label>
                  <select defaultValue="IST" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Asia/Kolkata (IST)</option>
                    <option>America/New_York (EST)</option>
                    <option>Europe/London (GMT)</option>
                    <option>America/Los_Angeles (PST)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Employee Count</label>
                <input defaultValue="20,000" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="flex justify-end">
                <button className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
              <h2 className="font-semibold text-gray-900">Security Configuration</h2>
              {[
                { label: 'Require MFA for Admin Access', desc: 'Enforce multi-factor authentication for all admin users', defaultChecked: true },
                { label: 'Block all Shadow IT AI Tools', desc: 'Automatically block AI tools not in the approved application list', defaultChecked: true },
                { label: 'Real-time DLP Scanning', desc: 'Scan all AI prompts in real-time for sensitive data patterns', defaultChecked: true },
                { label: 'Auto-create Incidents', desc: 'Automatically create incidents for critical severity violations', defaultChecked: true },
                { label: 'Immutable Audit Logging', desc: 'Enable tamper-evident audit trail for all system events', defaultChecked: true },
                { label: 'User Risk Scoring', desc: 'Continuously compute and update user risk scores', defaultChecked: true },
              ].map(setting => (
                <div key={setting.label} className="flex items-start justify-between gap-4 py-3 border-b border-gray-100 last:border-0">
                  <div>
                    <div className="text-sm font-medium text-gray-800">{setting.label}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{setting.desc}</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                    <input type="checkbox" defaultChecked={setting.defaultChecked} className="sr-only peer" />
                    <div className="w-10 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-4 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
                  </label>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'sso' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
              <h2 className="font-semibold text-gray-900">SSO / SAML Configuration</h2>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Identity Provider</label>
                  <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Okta</option>
                    <option>Microsoft Entra ID (Azure AD)</option>
                    <option>Google Workspace</option>
                    <option>Custom SAML 2.0</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">SSO Entry Point URL</label>
                  <input defaultValue="https://zylker.okta.com/app/saml2/sso" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Certificate (X.509)</label>
                  <textarea rows={4} defaultValue="-----BEGIN CERTIFICATE-----\nMIIDpDCCAowCCQD..." className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                </div>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
                  <Save className="w-4 h-4" />
                  Save SSO Config
                </button>
                <button className="px-5 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                  Test Connection
                </button>
              </div>
            </div>
          )}

          {activeTab === 'roles' && (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">Roles & Permissions</h2>
                <button className="text-sm text-blue-600 hover:underline">Add Role</button>
              </div>
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-2.5 text-xs text-gray-500 font-medium">Role</th>
                    <th className="text-left px-4 py-2.5 text-xs text-gray-500 font-medium">Description</th>
                    <th className="text-right px-4 py-2.5 text-xs text-gray-500 font-medium">Users</th>
                    <th className="px-4 py-2.5" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {[
                    { role: 'Super Admin', desc: 'Full platform access and configuration', users: 2 },
                    { role: 'Security Admin', desc: 'Manage policies, incidents, and classifications', users: 8 },
                    { role: 'Compliance Officer', desc: 'View reports and audit logs, read-only policy access', users: 3 },
                    { role: 'IT Manager', desc: 'Manage users, endpoints, and applications', users: 12 },
                    { role: 'Analyst', desc: 'View activity logs and incidents, no configuration access', users: 24 },
                    { role: 'Read Only', desc: 'Dashboard and reporting access only', users: 15 },
                  ].map(row => (
                    <tr key={row.role} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-xs font-medium text-gray-800">{row.role}</td>
                      <td className="px-4 py-3 text-xs text-gray-500">{row.desc}</td>
                      <td className="px-4 py-3 text-xs text-gray-600 text-right">{row.users}</td>
                      <td className="px-4 py-3 text-right"><button className="text-xs text-blue-600 hover:underline">Edit</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
              <h2 className="font-semibold text-gray-900">Notification Preferences</h2>
              <div className="space-y-4">
                {[
                  { label: 'Critical Incident Alerts', channels: ['Email', 'Slack', 'PagerDuty'], defaultOn: true },
                  { label: 'High Severity Violations', channels: ['Email', 'Slack'], defaultOn: true },
                  { label: 'New Shadow IT Detected', channels: ['Email', 'Slack'], defaultOn: true },
                  { label: 'Weekly Security Summary', channels: ['Email'], defaultOn: true },
                  { label: 'Policy Changes', channels: ['Email'], defaultOn: false },
                  { label: 'User Risk Score Changes', channels: ['Slack'], defaultOn: false },
                ].map(notif => (
                  <div key={notif.label} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                    <div>
                      <div className="text-sm font-medium text-gray-800">{notif.label}</div>
                      <div className="text-xs text-gray-400 mt-0.5">via {notif.channels.join(', ')}</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked={notif.defaultOn} className="sr-only peer" />
                      <div className="w-10 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-4 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'retention' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
              <h2 className="font-semibold text-gray-900">Data Retention</h2>
              <div className="space-y-4">
                {[
                  { label: 'Activity Logs', description: 'Full AI interaction logs', value: '90 days' },
                  { label: 'Audit Logs', description: 'System and admin action logs', value: '365 days' },
                  { label: 'Incident Records', description: 'Security incident history', value: '2 years' },
                  { label: 'Prompt Content', description: 'Full prompt text (redacted data excluded)', value: '30 days' },
                  { label: 'Reports', description: 'Generated report archives', value: '1 year' },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                    <div>
                      <div className="text-sm font-medium text-gray-800">{item.label}</div>
                      <div className="text-xs text-gray-400">{item.description}</div>
                    </div>
                    <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>{item.value}</option>
                      <option>30 days</option>
                      <option>90 days</option>
                      <option>365 days</option>
                      <option>2 years</option>
                      <option>7 years</option>
                      <option>Indefinite</option>
                    </select>
                  </div>
                ))}
              </div>
              <div className="flex justify-end">
                <button className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
                  <Save className="w-4 h-4" />
                  Save Retention Policy
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
