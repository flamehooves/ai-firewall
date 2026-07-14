import { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  Shield, LayoutDashboard, Activity, AlertTriangle, FileText,
  AppWindow, Users, Building2, Tag, CheckSquare, BarChart3,
  ScrollText, Puzzle, Monitor, Settings, Bell, Search, ChevronDown,
  Menu, X, ChevronRight
} from 'lucide-react'
import { cn } from '../lib'
import { motion, AnimatePresence } from 'framer-motion'

const navItems = [
  { label: 'Overview', path: '/overview', icon: LayoutDashboard },
  { label: 'AI Activity', path: '/activity', icon: Activity },
  { label: 'Incidents', path: '/incidents', icon: AlertTriangle, badge: 12 },
  { label: 'Policies', path: '/policies', icon: FileText },
  { label: 'Applications', path: '/applications', icon: AppWindow },
  { label: 'Users', path: '/users', icon: Users },
  { label: 'Departments', path: '/departments', icon: Building2 },
  { label: 'Classifications', path: '/classifications', icon: Tag },
  { label: 'Approvals', path: '/approvals', icon: CheckSquare, badge: 4 },
  { label: 'Reports', path: '/reports', icon: BarChart3 },
  { label: 'Audit Logs', path: '/audit-logs', icon: ScrollText },
  { label: 'Integrations', path: '/integrations', icon: Puzzle },
  { label: 'Endpoints', path: '/endpoints', icon: Monitor },
  { label: 'Settings', path: '/settings', icon: Settings },
]

function PageTitle() {
  const loc = useLocation()
  const item = navItems.find(n => n.path === loc.pathname)
  return <span>{item?.label ?? 'AI Firewall'}</span>
}

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Mobile overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setMobileSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <AnimatePresence initial={false}>
        <motion.aside
          key="sidebar"
          initial={false}
          animate={{ width: sidebarOpen ? 240 : 64 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className={cn(
            'hidden lg:flex flex-col bg-slate-900 text-white flex-shrink-0 overflow-hidden',
            'border-r border-slate-800'
          )}
        >
          {/* Logo */}
          <div className={cn('flex items-center gap-3 px-4 py-4 border-b border-slate-800 flex-shrink-0', !sidebarOpen && 'justify-center px-2')}>
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            {sidebarOpen && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-w-0">
                <div className="font-bold text-white text-sm leading-tight">AI Firewall</div>
                <div className="text-xs text-slate-400">Zylker Global</div>
              </motion.div>
            )}
          </div>

          {/* Nav */}
          <nav className="flex-1 py-3 overflow-y-auto overflow-x-hidden">
            {navItems.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => cn(
                  'flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg text-sm transition-colors relative group',
                  !sidebarOpen && 'justify-center px-2',
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                )}
              >
                {({ isActive }) => (
                  <>
                    <item.icon className="w-4 h-4 flex-shrink-0" />
                    {sidebarOpen && (
                      <span className="flex-1 whitespace-nowrap">{item.label}</span>
                    )}
                    {sidebarOpen && item.badge && (
                      <span className={cn('text-xs px-1.5 py-0.5 rounded-full font-medium', isActive ? 'bg-blue-500 text-white' : 'bg-red-500 text-white')}>
                        {item.badge}
                      </span>
                    )}
                    {!sidebarOpen && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                        {item.label}
                      </div>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Collapse toggle */}
          <div className="border-t border-slate-800 p-2">
            <button
              onClick={() => setSidebarOpen(p => !p)}
              className="w-full flex items-center justify-center gap-2 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-xs transition-colors"
            >
              <ChevronRight className={cn('w-4 h-4 transition-transform', sidebarOpen && 'rotate-180')} />
              {sidebarOpen && <span>Collapse</span>}
            </button>
          </div>
        </motion.aside>
      </AnimatePresence>

      {/* Mobile sidebar */}
      <aside className={cn(
        'fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col transform transition-transform lg:hidden',
        mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex items-center justify-between px-4 py-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm">AI Firewall</div>
              <div className="text-xs text-slate-400">Zylker Global</div>
            </div>
          </div>
          <button onClick={() => setMobileSidebarOpen(false)} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 py-3 overflow-y-auto">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMobileSidebarOpen(false)}
              className={({ isActive }) => cn(
                'flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg text-sm transition-colors',
                isActive ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              )}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1">{item.label}</span>
              {item.badge && <span className="text-xs px-1.5 py-0.5 rounded-full bg-red-500 text-white">{item.badge}</span>}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="flex-shrink-0 bg-white border-b border-gray-200 h-14 flex items-center px-4 gap-4 z-30">
          <button className="lg:hidden text-gray-500 hover:text-gray-900" onClick={() => setMobileSidebarOpen(true)}>
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden sm:flex items-center gap-1 text-sm text-gray-500">
            <Shield className="w-4 h-4 text-blue-600" />
            <span className="text-gray-400">/</span>
            <PageTitle />
          </div>

          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search incidents, users, policies..."
                className="w-full pl-9 pr-4 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <div className="hidden sm:flex items-center gap-2 text-xs bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Production
            </div>

            <button className="hidden sm:flex items-center gap-1.5 text-xs text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50">
              <span>Jul 1 – Jul 13, 2026</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => { setNotifOpen(p => !p); setUserOpen(false) }}
                className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-600"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              {notifOpen && (
                <div className="absolute right-0 top-full mt-1 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                    <span className="font-semibold text-sm">Notifications</span>
                    <span className="text-xs text-blue-600 cursor-pointer hover:underline">Mark all read</span>
                  </div>
                  {[
                    { icon: '🔴', text: 'Critical: AWS keys exposed by Rahul Verma', time: '2m ago' },
                    { icon: '🟠', text: 'Incident INC-003 auto-created: HR PII in Gemini', time: '32m ago' },
                    { icon: '🟡', text: 'DeepSeek usage detected on 3 endpoints', time: '1h ago' },
                    { icon: '🔵', text: 'Weekly security report ready to download', time: '3h ago' },
                  ].map((n, i) => (
                    <div key={i} className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0">
                      <div className="flex gap-3 items-start">
                        <span className="text-lg mt-0.5">{n.icon}</span>
                        <div>
                          <p className="text-sm text-gray-800 leading-snug">{n.text}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* User */}
            <div className="relative">
              <button
                onClick={() => { setUserOpen(p => !p); setNotifOpen(false) }}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-100"
              >
                <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">AK</div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-semibold text-gray-900 leading-none">Arun Kumar</div>
                  <div className="text-xs text-gray-500">Head of IT</div>
                </div>
                <ChevronDown className="w-3 h-3 text-gray-400 hidden sm:block" />
              </button>
              {userOpen && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="text-sm font-medium">Arun Kumar</div>
                    <div className="text-xs text-gray-500">arun.kumar@zylker.com</div>
                  </div>
                  {['Profile', 'Settings', 'API Keys', 'Sign Out'].map(item => (
                    <button key={item} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-50 last:border-0">
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <motion.div
            key={window.location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  )
}
