import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@clerk/react';
import SideBar from './navigation/SideBar.jsx';
import HomePage from './components/HomePage.jsx';
import Dashboard from './components/Dashboard/Dashboard.jsx';
import Patients from './components/Patients/Patients.jsx';
import Appointments from './components/Appointments/Appointments.jsx';
import Doctors from './components/Doctors/Doctors.jsx';
import MedicalRecords from './components/MedicalRecords/MedicalRecords.jsx';
import Login from './auth/Login.jsx';
import Signup from './auth/Signup.jsx';

function ProtectedRoute({ children }) {
	const { isSignedIn, isLoaded } = useAuth();
	if (!isLoaded) {
		return (
			<div className="flex-1 flex items-center justify-center min-h-screen bg-sky-50/50">
				<div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sky-500"></div>
			</div>
		);
	}
	return isSignedIn ? children : <Navigate to="/login" replace />;
}

function AuthRoute({ children }) {
	const { isSignedIn, isLoaded } = useAuth();
	if (!isLoaded) {
		return (
			<div className="flex-1 flex items-center justify-center min-h-screen bg-sky-50/50">
				<div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sky-500"></div>
			</div>
		);
	}
	return !isSignedIn ? children : <Navigate to="/dashboard" replace />;
}

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
						<Route path='/signup' element={<AuthRoute><Signup /></AuthRoute>} />
						<Route path='/login' element={<AuthRoute><Login /></AuthRoute>} />
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

export default App;
