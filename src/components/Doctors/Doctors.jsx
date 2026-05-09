import React, { useState, useMemo } from 'react'
import { Plus, Search, Phone, Mail, Star } from 'lucide-react'

const Doctors = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Doctor data matching the image
  const allDoctors = [
    {
      id: 1,
      name: 'Dr. Robert Smith',
      specialization: 'Cardiologist',
      status: 'Available',
      department: 'Cardiology',
      experience: '15 years',
      patients: 248,
      rating: 4.8,
      phone: '+1 (555) 111-2222',
      email: 'dr.smith@hospital.com'
    },
    {
      id: 2,
      name: 'Dr. Lisa Williams',
      specialization: 'Neurologist',
      status: 'Busy',
      department: 'Neurology',
      experience: '12 years',
      patients: 312,
      rating: 4.9,
      phone: '+1 (555) 222-3333',
      email: 'dr.williams@hospital.com'
    },
    {
      id: 3,
      name: 'Dr. John Brown',
      specialization: 'Orthopedic Surgeon',
      status: 'Available',
      department: 'Orthopedics',
      experience: '18 years',
      patients: 195,
      rating: 4.7,
      phone: '+1 (555) 333-4444',
      email: 'dr.brown@hospital.com'
    },
    {
      id: 4,
      name: 'Dr. Maria Garcia',
      specialization: 'General Physician',
      status: 'Available',
      department: 'General Medicine',
      experience: '10 years',
      patients: 421,
      rating: 4.6,
      phone: '+1 (555) 444-5555',
      email: 'dr.garcia@hospital.com'
    },
    {
      id: 5,
      name: 'Dr. David Lee',
      specialization: 'Pediatrician',
      status: 'Busy',
      department: 'Pediatrics',
      experience: '14 years',
      patients: 356,
      rating: 4.9,
      phone: '+1 (555) 555-6666',
      email: 'dr.lee@hospital.com'
    },
    {
      id: 6,
      name: 'Dr. Sarah Ahmed',
      specialization: 'Dermatologist',
      status: 'On Leave',
      department: 'Dermatology',
      experience: '8 years',
      patients: 189,
      rating: 4.5,
      phone: '+1 (555) 666-7777',
      email: 'dr.ahmed@hospital.com'
    }
  ];

  // Filter doctors based on search query
  const filteredDoctors = useMemo(() => {
    if (!searchQuery.trim()) return allDoctors;

    const query = searchQuery.toLowerCase();
    return allDoctors.filter(doctor =>
      doctor.name.toLowerCase().includes(query) ||
      doctor.specialization.toLowerCase().includes(query) ||
      doctor.department.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Available': return 'bg-green-100 text-green-800';
      case 'Busy': return 'bg-yellow-100 text-yellow-800';
      case 'On Leave': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get avatar color
  const getAvatarColor = (name) => {
    const colors = ['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-orange-500', 'bg-pink-500', 'bg-indigo-500'];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <section className='pt-5 p-2'>
      <div className='flex items-center justify-between shadow-md rounded-md p-3'>
        <div>
          <p className='text-2xl'>Doctors</p>
          <p>Manage medical staff and specialists</p>
        </div>
        <div className='flex'>
          <button className='shadow-md rounded-md border-2 rounded-md px-4 py-2 m-2 flex text-blue-500 hover:bg-blue-500 cursor-pointer hover:text-white active:bg-white active:text-blue-500'>
            <Plus className='w-4 h-6' />
            &nbsp;
            Add Doctor
          </button>
        </div>
      </div>

      <div className='bg-white p-4 rounded-lg shadow p-5 my-5'>
        {/* Search Bar */}
        <div className='relative mb-6'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
          <input
            type='text'
            placeholder='Search doctors by name, specialization or department...'
            className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Doctor Cards */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map(doctor => (
              <div key={doctor.id} className='bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow'>
                {/* Header Section */}
                <div className='flex justify-between items-start mb-4'>
                  <div className='flex items-center'>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${getAvatarColor(doctor.name)}`}>
                      {doctor.name.charAt(0)}
                    </div>
                    <div className='ml-3'>
                      <h3 className='font-semibold text-gray-900'>{doctor.name}</h3>
                      <p className='text-sm text-gray-500'>{doctor.specialization}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(doctor.status)}`}>
                    {doctor.status}
                  </span>
                </div>

                {/* Details Section */}
                <div className='space-y-3 mb-4'>
                  <div className='flex items-center text-sm text-gray-600'>
                    <span className='font-medium'>Department:</span>
                    <span className='ml-2'>{doctor.department}</span>
                  </div>
                  <div className='flex items-center text-sm text-gray-600'>
                    <span className='font-medium'>Experience:</span>
                    <span className='ml-2'>{doctor.experience}</span>
                  </div>
                  <div className='flex items-center text-sm text-gray-600'>
                    <span className='font-medium'>Patients:</span>
                    <span className='ml-2'>{doctor.patients}</span>
                  </div>
                  <div className='flex items-center text-sm text-gray-600'>
                    <span className='font-medium'>Rating:</span>
                    <div className='ml-2 flex items-center'>
                      <Star className='w-4 h-4 text-yellow-400 fill-current' />
                      <span className='ml-1'>{doctor.rating}</span>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className='space-y-2 mb-4'>
                  <div className='flex items-center text-sm text-gray-600'>
                    <Phone className='w-4 h-4 mr-2' />
                    <span>{doctor.phone}</span>
                  </div>
                  <div className='flex items-center text-sm text-gray-600'>
                    <Mail className='w-4 h-4 mr-2' />
                    <span>{doctor.email}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className='flex space-x-3'>
                  <button className='flex-1 px-4 py-2 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-500 hover:text-white transition-colors'>
                    View Profile
                  </button>
                  <button className='flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors'>
                    Schedule
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className='col-span-full text-center py-8 text-gray-500'>
              No doctors found matching your criteria
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default Doctors