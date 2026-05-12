import { Edit, Mail, Phone, Plus, Search, Trash2, X } from 'lucide-react'
import React, { useState, useMemo } from 'react'

const Patients = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [patients, setPatients] = useState([
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
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    phone: '',
    email: '',
    bloodType: 'O+',
    lastVisit: new Date().toISOString().split('T')[0]
  });
  const [errors, setErrors] = useState({});

  const filteredPatients = useMemo(() => {
    if (!searchQuery.trim()) {
      return patients;
    }
    const query = searchQuery.toLowerCase();
    return patients.filter(patient =>
      patient.name.toLowerCase().includes(query) ||
      patient.email.toLowerCase().includes(query)
    );
  }, [searchQuery, patients]);

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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.age || formData.age < 0 || formData.age > 150) {
      newErrors.age = 'Valid age is required (0-150)';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddPatient = () => {
    setEditingPatient(null);
    setFormData({
      name: '',
      age: '',
      gender: 'Male',
      phone: '',
      email: '',
      bloodType: 'O+',
      lastVisit: new Date().toISOString().split('T')[0]
    });
    setErrors({});
    setShowModal(true);
  };

  const handleEditPatient = (patient) => {
    setEditingPatient(patient);
    setFormData({
      name: patient.name,
      age: patient.age,
      gender: patient.gender,
      phone: patient.phone,
      email: patient.email,
      bloodType: patient.bloodType,
      lastVisit: patient.lastVisit
    });
    setErrors({});
    setShowModal(true);
  };

  const handleDeletePatient = (patientId) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      setPatients(patients.filter(p => p.id !== patientId));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (editingPatient) {
      // Update existing patient
      setPatients(patients.map(p =>
        p.id === editingPatient.id
          ? { ...p, ...formData, age: parseInt(formData.age) }
          : p
      ));
    } else {
      // Add new patient
      const newPatient = {
        id: `P${String(patients.length + 1).padStart(3, '0')}`,
        ...formData,
        age: parseInt(formData.age)
      };
      setPatients([...patients, newPatient]);
    }

    setShowModal(false);
    setEditingPatient(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPatient(null);
    setErrors({});
  };

  return (
    <section className='pt-5'>
      <div className='flex items-center justify-between shadow-md rounded-md p-3'>
        <div>
          <p className='text-2xl'>Patients</p>
          <p>Manage patient records and information</p>
        </div>
        <div className='flex'>
          <button
            onClick={handleAddPatient}
            className='shadow-md rounded-md border-2 rounded-md px-4 py-2 m-2 flex text-blue-500 hover:bg-blue-500 cursor-pointer hover:text-white active:bg-white active:text-blue-500'
          >
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
                      <button
                        onClick={() => handleEditPatient(patient)}
                        className='text-blue-600 hover:text-blue-900 transition-colors'
                      >
                        <Edit className='w-4 h-4' />
                      </button>
                      <button
                        onClick={() => handleDeletePatient(patient.id)}
                        className='text-red-600 hover:text-red-900 transition-colors'
                      >
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

      {/* Modal for Add/Edit Patient */}
      {showModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-6 w-full max-w-md mx-4'>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-xl font-semibold'>
                {editingPatient ? 'Edit Patient' : 'Add New Patient'}
              </h2>
              <button
                onClick={handleCloseModal}
                className='text-gray-500 hover:text-gray-700'
              >
                <X className='w-5 h-5' />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Name *
                  </label>
                  <input
                    type='text'
                    name='name'
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                  />
                  {errors.name && (
                    <p className='text-red-500 text-xs mt-1'>{errors.name}</p>
                  )}
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Age *
                    </label>
                    <input
                      type='number'
                      name='age'
                      value={formData.age}
                      onChange={handleInputChange}
                      min='0'
                      max='150'
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.age ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors.age && (
                      <p className='text-red-500 text-xs mt-1'>{errors.age}</p>
                    )}
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Gender
                    </label>
                    <select
                      name='gender'
                      value={formData.gender}
                      onChange={handleInputChange}
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    >
                      <option value='Male'>Male</option>
                      <option value='Female'>Female</option>
                      <option value='Other'>Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Phone *
                  </label>
                  <input
                    type='tel'
                    name='phone'
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                  />
                  {errors.phone && (
                    <p className='text-red-500 text-xs mt-1'>{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Email *
                  </label>
                  <input
                    type='email'
                    name='email'
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                  />
                  {errors.email && (
                    <p className='text-red-500 text-xs mt-1'>{errors.email}</p>
                  )}
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Blood Type
                    </label>
                    <select
                      name='bloodType'
                      value={formData.bloodType}
                      onChange={handleInputChange}
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    >
                      <option value='O+'>O+</option>
                      <option value='O-'>O-</option>
                      <option value='A+'>A+</option>
                      <option value='A-'>A-</option>
                      <option value='B+'>B+</option>
                      <option value='B-'>B-</option>
                      <option value='AB+'>AB+</option>
                      <option value='AB-'>AB-</option>
                    </select>
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Last Visit
                    </label>
                    <input
                      type='date'
                      name='lastVisit'
                      value={formData.lastVisit}
                      onChange={handleInputChange}
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                  </div>
                </div>
              </div>

              <div className='flex justify-end space-x-3 mt-6'>
                <button
                  type='button'
                  onClick={handleCloseModal}
                  className='px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors'
                >
                  {editingPatient ? 'Update Patient' : 'Add Patient'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}

export default Patients