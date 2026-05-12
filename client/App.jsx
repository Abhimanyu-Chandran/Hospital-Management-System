import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import SideBar from '/client/navigation/SideBar.jsx';
import Dashboard from './components/Dashboard/Dashboard.jsx';
import Patients from './components/Patients/Patients.jsx';
import Appointments from './components/Appointments/Appointments.jsx';
import Doctors from './components/Doctors/Doctors.jsx';
import MedicalRecords from './components/MedicalRecords/MedicalRecords.jsx';
import HomePage from './components/HomePage.jsx';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Router>
      <section className='flex min-h-screen'>
        <SideBar
          isOpen={isSidebarOpen}
          onToggle={toggleSidebar}
        />
        <div className='flex flex-1 flex-col'>
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/medical-records" element={<MedicalRecords />} />
          </Routes>
        </div>
      </section>
    </Router>
  )
}

export default App