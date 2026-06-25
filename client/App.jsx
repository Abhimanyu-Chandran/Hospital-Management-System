import { useState, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SideBar from './navigation/SideBar.jsx';
import HomePage from './components/HomePage.jsx';
import Register from './auth/Register.jsx';
import Login from './auth/Login.jsx';
import Dashboard from './components/Dashboard/Dashboard.jsx';
import Patients from './components/Patients/Patients.jsx';
import Appointments from './components/Appointments/Appointments.jsx';
import Doctors from './components/Doctors/Doctors.jsx';
import MedicalRecords from './components/MedicalRecords/MedicalRecords.jsx';
import { AuthProvider } from './auth/AuthContext.jsx';
import AuthContext from './auth/AuthContext.jsx';

const ProtectedRoute = ({ children }) => {
  const { token, loading } = useContext(AuthContext);

  if (loading) return null;
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

function AppInner() {
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
            <Route path='/' element={
              <ProtectedRoute><HomePage /></ProtectedRoute>
            } />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/patients" element={<ProtectedRoute><Patients /></ProtectedRoute>} />
            <Route path="/appointments" element={<ProtectedRoute><Appointments /></ProtectedRoute>} />
            <Route path="/doctors" element={<ProtectedRoute><Doctors /></ProtectedRoute>} />
            <Route path="/medical-records" element={<ProtectedRoute><MedicalRecords /></ProtectedRoute>} />
          </Routes>
        </div>
      </section>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}

export default App;
