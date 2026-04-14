import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SelectOption    from './pages/SelectOption'
import PrototypeA      from './pages/PrototypeA'
import AddInstallation from './pages/AddInstallation'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Onboarding – choose a prototype */}
        <Route path="/"           element={<SelectOption />} />

        {/* Prototype A – new flow (to be built) */}
        <Route path="/prototype-a"    element={<PrototypeA />} />
        <Route path="/prototype-a/*"  element={<PrototypeA />} />

        {/* Prototype B – wizard opens directly, no dashboard */}
        <Route path="/prototype-b"    element={<AddInstallation />} />
      </Routes>
    </BrowserRouter>
  )
}
