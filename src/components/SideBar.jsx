const SideBar = () => {
  return (
    <section className='bg-blue-100 w-70 flex flex-col h-screen'>
      <div>Hospital Management System</div>
      <div id='sidebar-buttons' className='text-blue-300'>
        <div id='Dashboard-button' className='border-2 rounded-md px-4 py-2 m-2'>
          <button>Dashboard</button>
        </div>
        <div id='Patients-button' className='border-2 rounded-md px-4 py-2 m-2'>
          <button>Patients</button>
        </div>
        <div id='Appointments-button' className='border-2 rounded-md px-4 py-2 m-2'>
          <button>Appointments</button>
        </div>
        <div id='Doctors-button' className='border-2 rounded-md px-4 py-2 m-2'>
          <button>Doctors</button>
        </div>
        <div id='Medical-Records-button' className='border-2 rounded-md px-4 py-2 m-2'>
          <button>Medical Records</button>
        </div>
      </div>
    </section>
  )
}

export default SideBar