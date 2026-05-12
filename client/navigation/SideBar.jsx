import { Calendar, CircleUser, FileText, Hospital, LayoutDashboard, User, X, Menu } from "lucide-react"
import { useNavigate } from 'react-router-dom'

const SideBar = ({ isOpen, onToggle }) => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <section className={`h-screen transition-all duration-200 flex flex-col ease-out transform ${isOpen ? 'w-[300px]' : 'w-[80px]'}`}>
      <div className='py-8 flex items-center justify-between pl-5 pr-2 border-gray-300'>
        {isOpen && (
          <>
            <div className="flex items-center">
              <Hospital className="text-blue-500" />
            </div>
            <div className='text-blue-500 text-2xl'>HMS</div>
          </>
        )}
        <button
          onClick={onToggle}
          className="p-1 rounded hover:bg-gray-100"
        >
          {isOpen ? <X className="cursor-pointer w-5 h-5" /> : <Menu className="cursor-pointer w-5 h-5" />}
        </button>
      </div>
      <div>

        <div
          onClick={() => handleNavigation('/dashboard')}
          className='border-2 rounded-md px-4 py-2 m-2 flex text-gray-500 hover:bg-gray-500 cursor-pointer hover:text-white active:bg-white active:text-gray-500'
        >
          <LayoutDashboard className="w-5 h-5" />
          {isOpen && <button className="pl-3 mr-10">Dashboard</button>}
        </div>

        <div
          onClick={() => handleNavigation('/patients')}
          className='border-2 rounded-md px-4 py-2 m-2 flex text-blue-500 hover:bg-blue-500 cursor-pointer hover:text-white active:bg-white active:text-blue-500'
        >
          <User className="w-5 h-5" />
          {isOpen && <button className="pl-3 mr-10">Patients</button>}
        </div>

        <div
          onClick={() => handleNavigation('/appointments')}
          className='border-2 rounded-md px-4 py-2 m-2 flex text-green-500 hover:bg-green-500 cursor-pointer hover:text-white active:bg-white active:text-green-500'
        >
          <Calendar className="w-5 h-5" />
          {isOpen && <button className="pl-3 mr-10">Appointments</button>}
        </div>

        <div
          onClick={() => handleNavigation('/doctors')}
          className='border-2 rounded-md px-4 py-2 m-2 flex text-purple-500 hover:bg-purple-500 cursor-pointer hover:text-white active:bg-white active:text-purple-500'
        >
          <CircleUser className="w-5 h-5" />
          {isOpen && <button className="pl-3 mr-10">Doctors</button>}
        </div>

        <div
          onClick={() => handleNavigation('/medical-records')}
          className='border-2 rounded-md px-4 py-2 m-2 flex text-orange-500 hover:bg-orange-500 cursor-pointer hover:text-white active:bg-white active:text-orange-500'
        >
          <FileText className="w-5 h-5" />
          {isOpen && <button className="pl-3 mr-10">Medical Records</button>}
        </div>

      </div>
    </section>
  )
}

export default SideBar