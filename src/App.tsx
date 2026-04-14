import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SelectOption        from './pages/SelectOption'
import PrototypeA          from './pages/PrototypeA'
import SolarEquipmentsList from './pages/SolarEquipmentsList'
import AddInstallation     from './pages/AddInstallation'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Onboarding – choose a prototype */}
        <Route path="/"                              element={<SelectOption />} />

        {/* Prototype A – new flow (to be built) */}
        <Route path="/prototype-a"                   element={<PrototypeA />} />
        <Route path="/prototype-a/*"                 element={<PrototypeA />} />

        {/* Prototype B – existing multi-step wizard */}
        <Route path="/prototype-b"                   element={<SolarEquipmentsList />} />
        <Route path="/prototype-b/add-installation"  element={<AddInstallation />} />
      </Routes>
    </BrowserRouter>
  )
}
