import React, { useState, useMemo } from 'react'
import { Plus, Search } from 'lucide-react'

const Appointments = () => {

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const allAppointments = [
    {
      id: 1,
      patientName: 'Sarah Johnson',
      type: 'General Consultation',
      date: '2024-05-10',
      time: '09:00 AM',
      doctor: 'Dr. Smith',
      department: 'General Medicine',
      status: 'Scheduled'
    },
    {
      id: 2,
      patientName: 'Michael Chen',
      type: 'Follow-up',
      date: '2024-05-10',
      time: '10:30 AM',
      doctor: 'Dr. Williams',
      department: 'Cardiology',
      status: 'In Progress'
    },
    {
      id: 3,
      patientName: 'Emily Davis',
      type: 'Specialist Consultation',
      date: '2024-05-09',
      time: '02:00 PM',
      doctor: 'Dr. Brown',
      department: 'Neurology',
      status: 'Completed'
    },
    {
      id: 4,
      patientName: 'James Wilson',
      type: 'Emergency',
      date: '2024-05-08',
      time: '11:00 AM',
      doctor: 'Dr. Garcia',
      department: 'Emergency',
      status: 'Cancelled'
    },
    {
      id: 5,
      patientName: 'Maria Garcia',
      type: 'General Consultation',
      date: '2024-05-11',
      time: '03:30 PM',
      doctor: 'Dr. Johnson',
      department: 'Pediatrics',
      status: 'Scheduled'
    },
  ];

  // Filter appointments based on search query and status
  const filteredAppointments = useMemo(() => {
    let filtered = allAppointments;

    // Filter by status
    if (filterStatus !== 'All') {
      filtered = filtered.filter(appointment =>
        appointment.status === filterStatus
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(appointment =>
        appointment.patientName.toLowerCase().includes(query) ||
        appointment.doctor.toLowerCase().includes(query) ||
        appointment.department.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [searchQuery, filterStatus]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Scheduled': return 'bg-blue-100 text-blue-800';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <section className='pt-5'>
      <div className='flex items-center justify-between shadow-md rounded-md p-3'>
        <div>
          <p className='text-2xl'>Appointments</p>
          <p>Schedule and manage appointments</p>
        </div>
        <div className='flex'>
          <button className='shadow-md rounded-md border-2 rounded-md px-4 py-2 m-2 flex text-blue-500 hover:bg-blue-500 cursor-pointer hover:text-white active:bg-white active:text-blue-500'>
            <Plus className='w-4 h-6' />
            &nbsp;
            New Appointement
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className='bg-white p-4 rounded-lg shadow p-5 my-5'>
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
          <input
            type='text'
            placeholder='Search appointments by patient, doctor, or department...'
            className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Filter Buttons */}
      <div className='bg-white p-4 rounded-lg shadow'>
        <div className='mb-6'>
          <label className='text-sm font-medium text-gray-700 mb-2 block'>Filter by status</label>
          <div className='flex space-x-2'>
            {['All', 'Scheduled', 'In Progress', 'Completed', 'Cancelled'].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${filterStatus === status
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              > {status}
              </button>
            ))}
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map(appoinment => (
              <div key={appoinment.id} className='bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow'>
                <div className='flex justify-between items-start mb-3'>
                  <div>
                    <h3 className='font-semibold text-gray-900'>{appoinment.patientName}</h3>
                    <p className='text-sm text-gray-500'>{appoinment.type}</p>
                  </div>
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(appoinment.status)}`}>
                    {appoinment.status}
                  </span>
                </div>

                <div className='space-y-2'>
                  <div className='flex items-center text-sm text-gray-600'>
                    <span className='font-medium'>Date:</span>
                    <span className='ml-2'>{appoinment.date}</span>
                  </div>
                  <div className='flex items-center text-sm text-gray-600'>
                    <span className='font-medium'>Time:</span>
                    <span className='ml-2'>{appoinment.time}</span>
                  </div>
                  <div className='flex items-center text-sm text-gray-600'>
                    <span className='font-medium'>Doctor:</span>
                    <span className='ml-2'>{appoinment.doctor}</span>
                  </div>
                  <div className='flex items-center text-sm text-gray-600'>
                    <span className='font-medium'>Department:</span>
                    <span className='ml-2'>{appoinment.department}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className='col-span-full text-center py-8 text-gray-500'>
              No appointments found matching your criteria
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default Appointments