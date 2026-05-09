import { Edit, Mail, Phone, Plus, Search, Trash2 } from 'lucide-react'
import React, { useState, useMemo } from 'react'

const Patients = () => {

  const [searchQuery, setSearchQuery] = useState('');

  const allPatients = [
    {
      id: 'P001',
      name: 'Sarah Johnson',
      age: 32,
      gender: 'Female',
      phone: '555-0123',
      email: 'sarah.j@gmail.com',
      bloodType: 'O+',
      lastVisit: '2024-04-15'
    },
    {
      id: 'P002',
      name: 'Michael Chen',
      age: 28,
      gender: 'Male',
      phone: '555-0124',
      email: 'michael.c@email.com',
      bloodType: 'A+',
      lastVisit: '2024-04-20'
    },
    {
      id: 'P003',
      name: 'Emily Davis',
      age: 45,
      gender: 'Female',
      phone: '555-0125',
      email: 'emily.d@email.com',
      bloodType: 'B+',
      lastVisit: '2024-04-10'
    },
    {
      id: 'P004',
      name: 'James Wilson',
      age: 38,
      gender: 'Male',
      phone: '555-0126',
      email: 'james.w@email.com',
      bloodType: 'AB+',
      lastVisit: '2024-04-18'
    },
    {
      id: 'P005',
      name: 'Maria Garcia',
      age: 29,
      gender: 'Female',
      phone: '555-0127',
      email: 'maria.g@email.com',
      bloodType: 'O-',
      lastVisit: '2024-04-22'
    }
  ];

  const filteredPatients = useMemo(() => {
    if (!searchQuery.trim()) {
      return allPatients;
    }
    const query = searchQuery.toLowerCase();
    return allPatients.filter(patient =>
      patient.name.toLowerCase().includes(query) ||
      patient.email.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const getBloodTypeColor = (bloodType) => {
    switch (bloodType) {
      case 'O+': return 'text-blue-500';
      case 'A+': return 'text-green-500';
      case 'B+': return 'text-yellow-500';
      case 'AB+': return 'text-purple-500';
      case 'O-': return 'text-red-500';
      case 'A-': return 'text-orange-500';
      case 'B-': return 'text-pink-500';
      case 'AB-': return 'text-indigo-500';
      default: return 'text-gray-500';
    }
  }

  return (
    <section className='pt-5'>
      <div className='flex items-center justify-between shadow-md rounded-md p-3'>
        <div>
          <p className='text-2xl'>Patients</p>
          <p>Manage patient records and information</p>
        </div>
        <div className='flex'>
          <button className='shadow-md rounded-md border-2 rounded-md px-4 py-2 m-2 flex text-blue-500 hover:bg-blue-500 cursor-pointer hover:text-white active:bg-white active:text-blue-500'>
            <Plus className='w-4 h-6' />
            &nbsp;
            Add Patient
          </button>
        </div>
      </div>

      <div className='bg-white p-4 rounded-lg shadow p-5 my-5'>
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
          <input
            type='text'
            placeholder='Search patients by name or email...'
            className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className='shadow-md rounded-md overflow-auto'>
        <table className='w-full'>
          <thead className='bg-gray-50 border-b border-gray-200'>
            <tr>
              <th className='px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-500 font-semibold'>Patient</th>
              <th className='px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-500 font-semibold'>Age/Gender</th>
              <th className='px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-500 font-semibold'>Contact</th>
              <th className='px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-500 font-semibold'>Blood Type</th>
              <th className='px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-500 font-semibold'>Last Visit</th>
              <th className='px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-500 font-semibold'>Actions</th>
            </tr>
          </thead>

          <tbody className='bg-white divide-y divide-gray-200'>
            {filteredPatients.length > 0 ? (
              filteredPatients.map(patient => (
                <tr key={patient.id} className='hover:bg-gray-50 transition-colors'>
                  <td className='px-6 py-4'>
                    <div>
                      <div className='text-gray-900'>{patient.name}</div>
                      <div className='text-sm text-gray-500'>{patient.id}</div>
                    </div>
                  </td>
                  <td className='px-6 py-4'>
                    <div className='text-sm text-gray-900'>{patient.age}</div>
                    <div className='text-sm text-gray-500'>{patient.gender}</div>
                  </td>
                  <td className='px-6 py-4'>
                    <div className='flex items-center space-x-2'>
                      <div className='flex items-center text-sm text-gray-900'>
                        <Phone className='w-4 h-4 mr-1' />
                        {patient.phone}
                      </div>
                    </div>
                    <div className='flex items-center text-sm text-gray-500 mt-1'>
                      <Mail className='w-4 h-4 mr-1' />
                      {patient.email}
                    </div>
                  </td>
                  <td className='px-6 py-4'>
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-md ${getBloodTypeColor(patient.bloodType)}`}>
                      {patient.bloodType}
                    </span>
                  </td>
                  <td className='px-6 py-4 text-sm text-gray-900'>
                    {patient.lastVisit}
                  </td>
                  <td className='px-6 py-4'>
                    <div className='flex space-x-2'>
                      <button className='text-blue-600 hover:text-blue-900 transition-colors'>
                        <Edit className='w-4 h-4' />
                      </button>
                      <button className='text-red-600 hover:text-red-900 transition-colors'>
                        <Trash2 className='w-4 h-4' />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan='6' className='px-6 py-8 text-center text-gray-500'>
                  No patients found matching "{searchQuery}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default Patients