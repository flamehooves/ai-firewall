import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Overview from './pages/Overview'
import Activity from './pages/Activity'
import Incidents from './pages/Incidents'
import Policies from './pages/Policies'
import Applications from './pages/Applications'
import Users from './pages/Users'
import Departments from './pages/Departments'
import Classifications from './pages/Classifications'
import Approvals from './pages/Approvals'
import Reports from './pages/Reports'
import AuditLogs from './pages/AuditLogs'
import Integrations from './pages/Integrations'
import Endpoints from './pages/Endpoints'
import Settings from './pages/Settings'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/overview" replace />} />
        <Route path="overview" element={<Overview />} />
        <Route path="activity" element={<Activity />} />
        <Route path="incidents" element={<Incidents />} />
        <Route path="policies" element={<Policies />} />
        <Route path="applications" element={<Applications />} />
        <Route path="users" element={<Users />} />
        <Route path="departments" element={<Departments />} />
        <Route path="classifications" element={<Classifications />} />
        <Route path="approvals" element={<Approvals />} />
        <Route path="reports" element={<Reports />} />
        <Route path="audit-logs" element={<AuditLogs />} />
        <Route path="integrations" element={<Integrations />} />
        <Route path="endpoints" element={<Endpoints />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}
