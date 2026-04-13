import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SolarEquipmentsList from './pages/SolarEquipmentsList'
import AddInstallation from './pages/AddInstallation'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SolarEquipmentsList />} />
        <Route path="/add-installation" element={<AddInstallation />} />
      </Routes>
    </BrowserRouter>
  )
}
