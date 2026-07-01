import { Calendar, CircleUser, FileText, LayoutDashboard, User, X, Menu, Home } from "lucide-react"
import { useNavigate } from 'react-router-dom'
import { useAuth, UserButton, useUser } from '@clerk/react'

const SideBar = ({ isOpen, onToggle }) => {
	const navigate = useNavigate();
	const { isSignedIn } = useAuth();
	const { user } = useUser();

	const handleNavigation = (path) => {
		navigate(path);
	};

	return (
		<section className={`h-screen transition-all duration-200 text-white flex flex-col ease-out transform ${isOpen ? 'w-[300px]' : 'w-[80px]'}`}>
			<div className='py-5 flex items-center justify-between pl-5 pr-2 border-gray-300'>
				{isOpen && (
					<>
						<div>
							<img src="/assets/logo.png" alt="HMS logo" className="w-15 h-15 border border-gray-300 rounded-lg" />
						</div>
						<div className="bg-linear-to-t from-sky-500 to-indigo-500 bg-clip-text text-transparent text-3xl font-semibold">
							HMS
						</div>
					</>
				)}
				<button
					onClick={onToggle}
					className="my-8 ml-1 mr-2 bg-linear-to-t from-sky-500 to-indigo-500 rounded hover:bg-gray-100 focus-visible:outline-none"
				>
					{isOpen ? <X className="cursor-pointer w-5 h-5" /> : <Menu className="cursor-pointer w-5 h-5" />}
				</button>
			</div>

			<div>
				<div
					onClick={() => handleNavigation('/')}
					className='bg-linear-to-t from-sky-500 to-indigo-500 border-blue-500 rounded-md px-5 py-2 m-2 flex cursor-pointer'
				>
					<Home className="w-5 h-5" />
					{isOpen && <button className="pl-3 mr-10 focus-visible:outline-none cursor-pointer">Home</button>}
				</div>

				{isSignedIn && (
					<>
						<div
							onClick={() => handleNavigation('/dashboard')}
							className='bg-linear-to-t from-sky-500 to-indigo-500 border-blue-500 rounded-md px-5 py-2 m-2 flex cursor-pointer'
						>
							<LayoutDashboard className="w-5 h-5" />
							{isOpen && <button className="pl-3 mr-10 focus-visible:outline-none cursor-pointer">Dashboard</button>}
						</div>

						<div
							onClick={() => handleNavigation('/patients')}
							className='bg-linear-to-t from-sky-500 to-indigo-500 border-blue-500 rounded-md px-5 py-2 m-2 flex cursor-pointer'
						>
							<User className="w-5 h-5" />
							{isOpen && <button className="pl-3 mr-10 focus-visible:outline-none cursor-pointer">Patients</button>}
						</div>

						<div
							onClick={() => handleNavigation('/appointments')}
							className='bg-linear-to-t from-sky-500 to-indigo-500 border-blue-500 rounded-md px-5 py-2 m-2 flex cursor-pointer'
						>
							<Calendar className="w-5 h-5" />
							{isOpen && <button className="pl-3 mr-10 focus-visible:outline-none cursor-pointer">Appointments</button>}
						</div>

						<div
							onClick={() => handleNavigation('/doctors')}
							className='bg-linear-to-t from-sky-500 to-indigo-500 border-blue-500 rounded-md px-5 py-2 m-2 flex cursor-pointer'
						>
							<CircleUser className="w-5 h-5" />
							{isOpen && <button className="pl-3 mr-10 focus-visible:outline-none cursor-pointer">Doctors</button>}
						</div>

						<div
							onClick={() => handleNavigation('/medical-records')}
							className='bg-linear-to-t from-sky-500 to-indigo-500 border-blue-500 rounded-md px-5 py-2 m-2 flex cursor-pointer'
						>
							<FileText className="w-5 h-5" />
							{isOpen && <button className="pl-3 mr-10 focus-visible:outline-none cursor-pointer">Medical Records</button>}
						</div>
					</>
				)}
			</div>

			{/* Bottom Profile Section */}
			<div className="mt-auto h-full p-2 border-t border-white/10 flex flex-col gap-2">
				{isSignedIn ? (
					<div className={`flex items-center gap-3 p-2 rounded-md bg-linear-to-t from-sky-500 to-indigo-500 ${isOpen ? 'justify-start px-4' : 'justify-center px-2'}`}>
						<UserButton afterSignOutUrl="/" />
						{isOpen && (
							<div className="flex flex-col min-w-0 text-white">
								<p className="text-xs font-semibold truncate leading-none mb-1">
									{user?.fullName || user?.primaryEmailAddress?.emailAddress}
								</p>
								<p className="text-[10px] text-white/70 font-medium leading-none">Logged In</p>
							</div>
						)}
					</div>
				) : (
					<div
						onClick={() => handleNavigation('/login')}
						className={`flex items-center gap-3 cursor-pointer p-2 rounded-md bg-linear-to-t from-sky-500 to-indigo-500 text-white hover:opacity-90 transition-all ${isOpen ? 'justify-start px-4' : 'justify-center px-2'}`}
					>
						<CircleUser className="w-5 h-5 text-white" />
						{isOpen && <span className="text-sm font-medium">Sign In</span>}
					</div>
				)}
			</div>

		</section >
	)
}

export default SideBar