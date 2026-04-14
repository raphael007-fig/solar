import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SelectOption          from './pages/SelectOption'
import PrototypeAWizard      from './pages/PrototypeA'
import AddInstallation       from './pages/AddInstallation'
import PrototypeBDashboard   from './pages/PrototypeB/Dashboard'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Onboarding – choose a prototype */}
        <Route path="/"                         element={<SelectOption />} />

        {/* Prototype A – accordion wizard */}
        <Route path="/prototype-a"              element={<PrototypeAWizard />} />
        <Route path="/prototype-a/dashboard"    element={<PrototypeBDashboard />} />

        {/* Prototype B – wizard then dashboard */}
        <Route path="/prototype-b"              element={<AddInstallation />} />
        <Route path="/prototype-b/dashboard"    element={<PrototypeBDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}
