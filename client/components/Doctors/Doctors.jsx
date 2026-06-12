import React, { useEffect, useMemo, useState } from 'react'
import { Plus, Search, Phone, Mail, Activity, Edit, Trash2, X } from 'lucide-react'
import { doctorAPI } from '../../services/doctorsAPI.js'

const statusColors = {
  Available: 'bg-green-100 text-green-800 border-green-400',
  Busy: 'bg-yellow-100 text-yellow-800 border-yellow-400',
  'On Leave': 'bg-red-100 text-red-800 border-red-400'
}

const Doctors = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [toast, setToast] = useState(null)

  const [showModal, setShowModal] = useState(false)
  const [editingDoctor, setEditingDoctor] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialization: '',
    experience: '',
    qualification: '',
    // DB stores: [{ status: 'Available' | 'Busy' | 'On Leave' }]
    availability: [{ status: 'Available' }]
  })

  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const showToast = (message, type = 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }

  const renderAvailabilityButton = (status, active) => {
    const base =
      'px-3 py-2 rounded-md border text-sm font-semibold transition-colors disabled:opacity-50'

    if (active) return `${base} ${statusColors[status] || 'bg-gray-100 text-gray-800 border-gray-300'}`

    return `${base} bg-white border-gray-300 text-gray-600 hover:bg-gray-50`
  }

  useEffect(() => {
    fetchDoctors()
  }, [])

  const fetchDoctors = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await doctorAPI.getAllDoctors()

      if (!Array.isArray(data)) throw new Error('Invalid response format from server')

      const transformed = data
        .map(doctor => {
          try {
            return {
              id: doctor._id,
              name: `${doctor.firstName} ${doctor.lastName}`,
              email: doctor.email,
              phone: doctor.phone,
              specialization: doctor.specialization,
              experience: doctor.experience,
              qualification: doctor.qualification,
              availability: (doctor.availability || []).map(a => ({
                status: a.status || 'Available'
              }))
            }
          } catch (e) {
            console.error('Error transforming doctor:', e, doctor)
            return null
          }
        })
        .filter(Boolean)

      setDoctors(transformed)
    } catch (err) {
      console.error('Failed to fetch doctors:', err)
      setError('Failed to fetch doctors: ' + (err.message || 'Unknown error'))
    } finally {
      setLoading(false)
    }
  }

  const filteredDoctors = useMemo(() => {
    if (!searchQuery.trim()) return doctors
    const query = searchQuery.toLowerCase()
    return doctors.filter(d => {
      return (
        d.name.toLowerCase().includes(query) ||
        d.specialization.toLowerCase().includes(query) ||
        d.email.toLowerCase().includes(query)
      )
    })
  }, [searchQuery, doctors])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) newErrors.name = 'Name is required'

    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid'

    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'

    if (!formData.specialization.trim()) newErrors.specialization = 'Specialization is required'
    if (!formData.qualification.trim()) newErrors.qualification = 'Qualification is required'

    const expNum = Number(formData.experience)
    if (formData.experience === '' || Number.isNaN(expNum)) newErrors.experience = 'Experience is required'
    else if (expNum < 0 || expNum > 80) newErrors.experience = 'Please enter a valid number of years'

    if (!Array.isArray(formData.availability) || formData.availability.length === 0) {
      newErrors.availability = 'At least one availability slot is required'
    } else {
      const invalid = formData.availability.some(s => !s || !s.status)
      if (invalid) newErrors.availability = 'Each availability slot requires a status'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAddDoctor = () => {
    setEditingDoctor(null)
    setFormData({
      name: '',
      email: '',
      phone: '',
      specialization: '',
      experience: '',
      qualification: '',
      availability: [{ status: 'Available' }]
    })
    setErrors({})
    setShowModal(true)
  }

  const handleEditDoctor = doctor => {
    setEditingDoctor(doctor)
    setFormData({
      name: doctor.name,
      email: doctor.email,
      phone: doctor.phone,
      specialization: doctor.specialization,
      experience: doctor.experience ?? '',
      qualification: doctor.qualification,
      availability:
        doctor.availability && doctor.availability.length > 0
          ? doctor.availability.map(a => ({ status: a.status || 'Available' }))
          : [{ status: 'Available' }]
    })
    setErrors({})
    setShowModal(true)
  }

  const handleDeleteDoctor = async doctorId => {
    if (!window.confirm('Are you sure you want to remove this doctor profile?')) return
    try {
      await doctorAPI.deleteDoctor(doctorId)
      setDoctors(prev => prev.filter(d => d.id !== doctorId))
      showToast('Doctor profile removed successfully!', 'success')
    } catch (err) {
      console.error(err)
      setError('Failed to delete doctor profile')
    }
  }

  const handleInputChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const setAvailabilityStatus = (index, status) => {
    setFormData(prev => {
      const updated = [...prev.availability]
      updated[index] = { status }
      return { ...prev, availability: updated }
    })
  }

  const addAvailabilityRow = () => {
    setFormData(prev => ({ ...prev, availability: [...prev.availability, { status: 'Available' }] }))
  }

  const removeAvailabilityRow = index => {
    if (formData.availability.length === 1) {
      showToast('At least one availability slot is required.')
      return
    }
    setFormData(prev => ({ ...prev, availability: prev.availability.filter((_, i) => i !== index) }))
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingDoctor(null)
    setErrors({})
  }

  const handleSubmit = async e => {
    e.preventDefault()

    if (!validateForm()) {
      showToast('Please fix the form errors')
      return
    }

    try {
      setSubmitting(true)

      const nameParts = formData.name.trim().split(' ')
      const firstName = nameParts[0]
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : ''

      const doctorData = {
        firstName,
        lastName,
        email: formData.email,
        phone: formData.phone,
        specialization: formData.specialization,
        experience: Number(formData.experience),
        qualification: formData.qualification,
        availability: formData.availability.map(a => ({ status: a.status }))
      }

      if (editingDoctor) {
        await doctorAPI.updateDoctor(editingDoctor.id, doctorData)
        setDoctors(prev =>
          prev.map(d =>
            d.id === editingDoctor.id
              ? {
                  ...d,
                  name: formData.name,
                  email: doctorData.email,
                  phone: doctorData.phone,
                  specialization: doctorData.specialization,
                  experience: doctorData.experience,
                  qualification: doctorData.qualification,
                  availability: formData.availability
                }
              : d
          )
        )
        showToast('Doctor dashboard updated successfully!', 'success')
      } else {
        const newDoctor = await doctorAPI.createDoctor(doctorData)
        setDoctors(prev => [
          ...prev,
          {
            id: newDoctor._id,
            name: formData.name,
            email: doctorData.email,
            phone: doctorData.phone,
            specialization: doctorData.specialization,
            experience: doctorData.experience,
            qualification: doctorData.qualification,
            availability: formData.availability
          }
        ])
        showToast('New doctor added successfully!', 'success')
      }

      handleCloseModal()
    } catch (err) {
      console.error(err)
      showToast(err.message || 'An operational error occurred')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className='pt-5'>
      <div className='flex items-center justify-between shadow-md rounded-md p-3 bg-white'>
        <div>
          <p className='text-2xl font-medium text-gray-800'>Doctors Registry</p>
          <p className='text-gray-500'>Manage system specialists, profiles, and live schedule options</p>
        </div>
        <button
          onClick={handleAddDoctor}
          disabled={loading}
          className='shadow-md rounded-md border-2 border-blue-500 px-4 py-2 m-2 flex text-blue-500 hover:bg-blue-500 hover:text-white transition-all disabled:opacity-50 font-medium cursor-pointer'
        >
          <Plus className='w-4 h-6 mr-1' />
          Add Doctor
        </button>
      </div>

      {error && (
        <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4'>
          {error}
        </div>
      )}

      {toast && (
        <div
          className={`border px-4 py-3 rounded relative my-4 ${
            toast.type === 'success'
              ? 'bg-green-100 border-green-400 text-green-700'
              : 'bg-red-100 border-red-400 text-red-700'
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className='bg-white p-4 rounded-lg shadow my-5'>
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
          <input
            type='text'
            placeholder='Search specialists by name, specialization, or email...'
            className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className='shadow-md rounded-md overflow-auto bg-white'>
        {loading ? (
          <div className='p-8 text-center text-gray-500'>Loading system accounts...</div>
        ) : (
          <table className='w-full text-left border-collapse'>
            <thead className='bg-gray-50 border-b border-gray-200'>
              <tr>
                <th className='px-6 py-3 text-xs uppercase tracking-wider text-gray-500 font-semibold'>Doctor</th>
                <th className='px-6 py-3 text-xs uppercase tracking-wider text-gray-500 font-semibold'>Specialization</th>
                <th className='px-6 py-3 text-xs uppercase tracking-wider text-gray-500 font-semibold'>Contact Specs</th>
                <th className='px-6 py-3 text-xs uppercase tracking-wider text-gray-500 font-semibold'>Availability</th>
                <th className='px-6 py-3 text-xs uppercase tracking-wider text-gray-500 font-semibold'>Actions</th>
              </tr>
            </thead>

            <tbody className='divide-y divide-gray-200'>
              {filteredDoctors.length > 0 ? (
                filteredDoctors.map(doctor => (
                  <tr key={doctor.id} className='hover:bg-gray-50 transition-colors text-sm'>
                    <td className='px-6 py-4'>
                      <div>
                        <div className='text-gray-900 font-medium'>{doctor.name}</div>
                        <div className='text-xs text-gray-400'>{doctor.qualification}</div>
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      <div>
                        <span className='px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-100'>
                          {doctor.specialization}
                        </span>
                        <div className='text-xs text-gray-500 mt-1.5'>{doctor.experience} Yrs Experience</div>
                      </div>
                    </td>
                    <td className='px-6 py-4 space-y-1'>
                      <div className='flex items-center text-gray-700'>
                        <Phone className='w-3.5 h-3.5 mr-1.5 text-gray-400' />
                        {doctor.phone}
                      </div>
                      <div className='flex items-center text-gray-500 text-xs'>
                        <Mail className='w-3.5 h-3.5 mr-1.5 text-gray-400' />
                        {doctor.email}
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      <div className='flex flex-wrap gap-2'>
                        {doctor.availability?.length ? (
                          doctor.availability.map((a, idx) => (
                            <span
                              key={idx}
                              className={`px-2 py-1 text-xs font-semibold rounded-md border ${
                                statusColors[a.status] || 'bg-gray-50 border-gray-200 text-gray-700'
                              }`}
                            >
                              {a.status}
                            </span>
                          ))
                        ) : (
                          <span className='text-xs text-gray-400'>No slots</span>
                        )}
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      <div className='flex space-x-3'>
                        <button onClick={() => handleEditDoctor(doctor)} className='text-blue-600 hover:text-blue-900'>
                          <Edit className='w-4 h-4' />
                        </button>
                        <button onClick={() => handleDeleteDoctor(doctor.id)} className='text-red-600 hover:text-red-900'>
                          <Trash2 className='w-4 h-4' />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan='5' className='px-6 py-8 text-center text-gray-500'>No registered specialists found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-lg p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-xl'>
            <div className='flex justify-between items-center mb-4 sticky top-0 bg-white pb-2 border-b border-gray-100'>
              <h2 className='text-xl font-semibold text-gray-800'>
                {editingDoctor ? 'Modify Specialist Profile' : 'Register New Medical Expert'}
              </h2>
              <button
                onClick={handleCloseModal}
                disabled={submitting}
                className='text-gray-400 hover:text-gray-600'
                type='button'
              >
                <X className='w-5 h-5' />
              </button>
            </div>

            <form onSubmit={handleSubmit} className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Full Name *</label>
                <input
                  type='text'
                  name='name'
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={submitting}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder='Dr. Jane Smith'
                />
                {errors.name && <p className='text-red-500 text-xs mt-1'>{errors.name}</p>}
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Email *</label>
                  <input
                    type='email'
                    name='email'
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={submitting}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder='doctor@example.com'
                  />
                  {errors.email && <p className='text-red-500 text-xs mt-1'>{errors.email}</p>}
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Phone *</label>
                  <input
                    type='tel'
                    name='phone'
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={submitting}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder='+1 555 123 4567'
                  />
                  {errors.phone && <p className='text-red-500 text-xs mt-1'>{errors.phone}</p>}
                </div>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Specialization *</label>
                  <input
                    type='text'
                    name='specialization'
                    value={formData.specialization}
                    onChange={handleInputChange}
                    disabled={submitting}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.specialization ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder='Cardiology'
                  />
                  {errors.specialization && <p className='text-red-500 text-xs mt-1'>{errors.specialization}</p>}
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Years Experience *</label>
                  <input
                    type='number'
                    name='experience'
                    value={formData.experience}
                    onChange={handleInputChange}
                    disabled={submitting}
                    min='0'
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.experience ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder='e.g. 5'
                  />
                  {errors.experience && <p className='text-red-500 text-xs mt-1'>{errors.experience}</p>}
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Qualifications *</label>
                <input
                  type='text'
                  name='qualification'
                  value={formData.qualification}
                  onChange={handleInputChange}
                  disabled={submitting}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.qualification ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder='MD, DM, FACC'
                />
                {errors.qualification && <p className='text-red-500 text-xs mt-1'>{errors.qualification}</p>}
              </div>

              <div className='border-t border-gray-200 pt-3'>
                <div className='flex justify-between items-center mb-3'>
                  <label className='block text-sm font-medium text-gray-700'>Availability *</label>
                  <button
                    type='button'
                    onClick={addAvailabilityRow}
                    disabled={submitting}
                    className='text-xs flex items-center text-blue-600 hover:text-blue-800 font-semibold'
                  >
                    <Plus className='w-3 h-3 mr-0.5' /> Add Slot
                  </button>
                </div>

                {errors.availability && <p className='text-red-500 text-xs mb-2'>{errors.availability}</p>}

                <div className='space-y-3 max-h-60 overflow-y-auto pr-1'>
                  {formData.availability.map((slot, index) => (
                    <div
                      key={index}
                      className='bg-gray-50 p-3 rounded-md border border-gray-200 flex flex-col gap-3 shadow-sm'
                    >
                      <div className='flex items-center justify-between'>
                        <div className='text-xs font-medium text-gray-600'>Availability *</div>

                        {formData.availability.length > 1 && (
                          <button
                            type='button'
                            onClick={() => removeAvailabilityRow(index)}
                            disabled={submitting}
                            className='text-gray-400 hover:text-red-500'
                          >
                            <X className='w-4 h-4' />
                          </button>
                        )}
                      </div>

                      <div className='grid grid-cols-3 gap-2'>
                        {['Available', 'Busy', 'On Leave'].map(status => (
                          <button
                            key={status}
                            type='button'
                            disabled={submitting}
                            onClick={() => setAvailabilityStatus(index, status)}
                            className={renderAvailabilityButton(status, slot.status === status)}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className='flex justify-end space-x-3 mt-6 border-t border-gray-100 pt-4'>
                <button
                  type='button'
                  onClick={() => setShowModal(false)}
                  disabled={submitting}
                  className='px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  disabled={submitting}
                  className='px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50'
                >
                  {submitting ? 'Saving Records...' : editingDoctor ? 'Commit Updates' : 'Publish Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}

export default Doctors

