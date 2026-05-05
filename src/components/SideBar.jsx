import { Calendar, CircleUser, FileText, Hospital, LayoutDashboard, User, X } from "lucide-react"

const SideBar = ({ isOpen, onClose }) => {
  return (
    <section className={`h-screen transition-all duration-200 ease-out transform ${isOpen ? 'w-[300px] opacity-100' : 'w-0 opacity-0 overflow-hidden'}`}>
      <div className='flex items-center justify-between pl-7 pr-2 border-gray-300'>
        <Hospital className="text-blue-500" />
        <div className='py-8 pr-25 text-blue-500 text-2xl'>HMS</div>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-gray-100"
        >
          <X className="cursor-pointer" />
        </button>
      </div>
      <div>
        <div className='border-2 rounded-md px-4 py-2 m-2 flex text-gray-500 hover:bg-gray-500 cursor-pointer hover:text-white active:bg-white active:text-gray-500'>
          <LayoutDashboard />
          <button className="pl-3 mr-10">Dashboard</button>
        </div>
        <div className='border-2 rounded-md px-4 py-2 m-2 flex text-blue-500 hover:bg-blue-500 cursor-pointer hover:text-white active:bg-white active:text-blue-500'>
          <User />
          <button className="pl-3 mr-10">Patients</button>
        </div>
        <div className='border-2 rounded-md px-4 py-2 m-2 flex text-green-500 hover:bg-green-500 cursor-pointer hover:text-white active:bg-white active:text-green-500'>
          <Calendar />
          <button className="pl-3 mr-10">Appointments</button>
        </div>
        <div className='border-2 rounded-md px-4 py-2 m-2 flex text-purple-500 hover:bg-purple-500 cursor-pointer hover:text-white active:bg-white active:text-purple-500'>
          <CircleUser />
          <button className="pl-3 mr-10">Doctors</button>
        </div>
        <div className='border-2 rounded-md px-4 py-2 m-2 flex text-orange-500 hover:bg-orange-500 cursor-pointer hover:text-white active:bg-white active:text-orange-500'>
          <FileText />
          <button className="pl-3 mr-10">Medical Records</button>
        </div>
      </div>
    </section>
  )
}

export default SideBar