import { Edit, Mail, Phone, Plus, Search, Trash2, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { patientAPI } from '../../services/patientsAPI.js'

const Patients = () => {
	const [searchQuery, setSearchQuery] = useState('')
	const [patients, setPatients] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const [toast, setToast] = useState(null)

	const [showModal, setShowModal] = useState(false)
	const [editingPatient, setEditingPatient] = useState(null)
	const [formData, setFormData] = useState({
		name: '',
		age: '',
		gender: 'Male',
		phone: '',
		email: '',
		bloodType: 'O+',
		address: '',
		emergencyContact: '',
		lastVisit: new Date().toISOString().split('T')[0]
	})
	const [errors, setErrors] = useState({})
	const [submitting, setSubmitting] = useState(false)

	const showToast = (message, type = 'error') => {
		setToast({ message, type })
		setTimeout(() => setToast(null), 4000)
	}

	const fetchPatients = async () => {
		try {
			setLoading(true)
			setError(null)
			const data = await patientAPI.getAllPatients()

			if (!Array.isArray(data)) {
				throw new Error('Invalid response format from server')
			}

			const transformedPatients = data
				.map(patient => {
					try {
						let lastVisitFormatted = ''
						if (patient.lastVisit) {
							const lastVisitDate = new Date(patient.lastVisit)
							if (!isNaN(lastVisitDate.getTime())) {
								lastVisitFormatted = lastVisitDate.toISOString().split('T')[0]
							} else {
								lastVisitFormatted = new Date().toISOString().split('T')[0]
							}
						} else {
							lastVisitFormatted = new Date().toISOString().split('T')[0]
						}

						return {
							id: patient._id,
							name: `${patient.firstName} ${patient.lastName}`,
							age: patient.age,
							gender: patient.gender,
							phone: patient.phone,
							email: patient.email,
							bloodType: patient.bloodGroup,
							address: patient.address,
							emergencyContact: patient.emergencyContact,
							lastVisit: lastVisitFormatted
						}
					} catch (err) {
						console.error('Error transforming patient:', err, patient)
						return null
					}
				})
				.filter(p => p !== null);

			setPatients(transformedPatients)
		} catch (err) {
			console.error('Failed to fetch patients:', err)
			setError('Failed to fetch patients: ' + (err.message || 'Unknown error'))
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		const timer = setTimeout(() => {
			fetchPatients()
		}, 0)
		return () => clearTimeout(timer)
	}, [])

	const filteredPatients = useMemo(() => {
		if (!searchQuery.trim()) return patients
		const query = searchQuery.toLowerCase()
		return patients.filter(
			patient =>
				patient.name.toLowerCase().includes(query) ||
				patient.email.toLowerCase().includes(query)
		)
	}, [searchQuery, patients])

	const getBloodTypeColor = bloodType => {
		switch (bloodType) {
			case 'O+':
				return 'text-blue-500'
			case 'A+':
				return 'text-green-500'
			case 'B+':
				return 'text-yellow-500'
			case 'AB+':
				return 'text-purple-500'
			case 'O-':
				return 'text-red-500'
			case 'A-':
				return 'text-orange-500'
			case 'B-':
				return 'text-pink-500'
			case 'AB-':
				return 'text-indigo-500'
			default:
				return 'text-gray-500'
		}
	}

	const validateForm = () => {
		const newErrors = {}

		if (!formData.name.trim()) newErrors.name = 'Name is required'

		const ageNum = Number(formData.age)
		if (formData.age === '' || Number.isNaN(ageNum)) {
			newErrors.age = 'Age is required'
		} else if (ageNum < 0 || ageNum > 150) {
			newErrors.age = 'Please enter a valid age'
		}

		if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'

		if (!formData.email.trim()) newErrors.email = 'Email is required'
		else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid'

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleAddPatient = () => {
		setEditingPatient(null)
		setFormData({
			name: '',
			age: '',
			gender: 'Male',
			phone: '',
			email: '',
			bloodType: 'O+',
			address: '',
			emergencyContact: '',
			lastVisit: new Date().toISOString().split('T')[0]
		})
		setErrors({})
		setShowModal(true)
	}

	const handleEditPatient = patient => {
		setEditingPatient(patient)
		setFormData({
			name: patient.name,
			age: patient.age ?? '',
			gender: patient.gender || 'Male',
			phone: patient.phone,
			email: patient.email,
			bloodType: patient.bloodType,
			address: patient.address || '',
			emergencyContact: patient.emergencyContact || '',
			lastVisit: patient.lastVisit
		})
		setErrors({})
		setShowModal(true)
	}

	const handleDeletePatient = async patientId => {
		if (!window.confirm('Are you sure you want to delete this patient?')) return
		try {
			await patientAPI.deletePatient(patientId)
			setPatients(patients.filter(p => p.id !== patientId))
		} catch (err) {
			setError('Failed to delete patient')
			console.error(err)
		}
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

			const ageNum = Number(formData.age)
			const lastVisitDate = new Date(formData.lastVisit)

			const patientData = {
				firstName,
				lastName,
				email: formData.email,
				phone: formData.phone,
				age: ageNum,
				gender: formData.gender,
				bloodGroup: formData.bloodType,
				address: formData.address,
				emergencyContact: formData.emergencyContact,
				lastVisit: lastVisitDate.toISOString()
			}

			if (editingPatient) {
				await patientAPI.updatePatient(editingPatient.id, patientData)
				setPatients(
					patients.map(p =>
						p.id === editingPatient.id
							? {
								...p,
								name: formData.name,
								age: ageNum,
								gender: formData.gender,
								phone: formData.phone,
								email: formData.email,
								bloodType: formData.bloodType,
								address: formData.address,
								emergencyContact: formData.emergencyContact,
								lastVisit: formData.lastVisit
							}
							: p
					)
				)
				showToast('Patient updated successfully!', 'success')
			} else {
				const newPatient = await patientAPI.createPatient(patientData)
				setPatients([
					...patients,
					{
						id: newPatient._id,
						name: formData.name,
						age: ageNum,
						gender: formData.gender,
						phone: formData.phone,
						email: formData.email,
						bloodType: formData.bloodType,
						address: formData.address,
						emergencyContact: formData.emergencyContact,
						lastVisit: formData.lastVisit
					}
				])
				showToast('Patient added successfully!', 'success')
			}

			setShowModal(false)
			setEditingPatient(null)
			setErrors({})
		} catch (err) {
			const errorMessage = err.message || 'Unknown error occurred'
			showToast(errorMessage)
			console.error(err)
		} finally {
			setSubmitting(false)
		}
	}

	const handleInputChange = e => {
		const { name, value } = e.target
		setFormData(prev => ({ ...prev, [name]: value }))
		if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
	}

	const handleCloseModal = () => {
		setShowModal(false)
		setEditingPatient(null)
		setErrors({})
	}

	return (
		<section className='pt-5 p-5'>
			<div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm hover:shadow-md transition-all duration-300 rounded-xl p-6 bg-white mb-6'>
				<div>
					<p className='text-3xl font-extrabold text-gray-900'>Patients</p>
					<p className='text-gray-500 mt-1 text-sm'>Manage patient records and information</p>
				</div>
				<div className='flex'>
					<button
						onClick={handleAddPatient}
						disabled={loading}
						className='shadow-md rounded-md border-2 rounded-md px-4 py-2 m-2 flex bg-linear-to-t from-sky-500 to-indigo-500 border-blue-500 cursor-pointer disabled:opacity-50 text-white'
					>
						<Plus className='w-4 h-6' />
						&nbsp;
						Add Patient
					</button>
				</div>
			</div>

			{error && (
				<div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4'>
					{error}
				</div>
			)}

			{toast && (
				<div
					className={`bg-${toast.type === 'success' ? 'green' : 'red'}-100 border border-${toast.type === 'success' ? 'green' : 'red'}-400 text-${toast.type === 'success' ? 'green' : 'red'}-700 px-4 py-3 rounded relative my-4`}
				>
					{toast.message}
				</div>
			)}

			<div className='bg-white rounded-lg shadow p-5 my-5'>
				<div className='relative'>
					<Search
						className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5'
					/>
					<input
						type='text'
						placeholder='          Search patients by name or email...'
						className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
						value={searchQuery}
						onChange={e => setSearchQuery(e.target.value)}
					/>
				</div>
			</div>

			<div className='shadow-md rounded-md overflow-auto'>
				{loading ? (
					<div className='p-8 text-center text-gray-500'>Loading patients...</div>
				) : (
					<table className='w-full'>
						<thead className='bg-gray-50 border-b border-gray-200'>
							<tr>
								<th className='px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-500 font-semibold'>
									Patient
								</th>
								<th className='px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-500 font-semibold'>
									Age/Gender
								</th>
								<th className='px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-500 font-semibold'>
									Contact
								</th>
								<th className='px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-500 font-semibold'>
									Blood Type
								</th>
								<th className='px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-500 font-semibold'>
									Last Visit
								</th>
								<th className='px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-500 font-semibold'>
									Actions
								</th>
							</tr>
						</thead>

						<tbody className='bg-white divide-y divide-gray-200'>
							{filteredPatients.length > 0 ? (
								filteredPatients.map(patient => (
									<tr key={patient.id} className='hover:bg-gray-50 transition-colors'>
										<td className='px-6 py-4'>
											<div>
												<div className='text-gray-900 font-semibold text-sm'>{patient.name}</div>
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
											<span
												className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-md ${getBloodTypeColor(
													patient.bloodType
												)}`}
											>
												{patient.bloodType}
											</span>
										</td>
										<td className='px-6 py-4 text-sm text-gray-900'>{patient.lastVisit}</td>
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
										{searchQuery ? `No patients found matching "${searchQuery}"` : 'No patients found'}
									</td>
								</tr>
							)}
						</tbody>
					</table>
				)}
			</div>

			{showModal && (
				<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
					<div className='bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto'>
						<div className='flex justify-between items-center mb-4 sticky top-0 bg-white'>
							<h2 className='text-xl font-semibold'>
								{editingPatient ? 'Edit Patient' : 'Add New Patient'}
							</h2>
							<button
								onClick={handleCloseModal}
								disabled={submitting}
								className='text-gray-500 hover:text-gray-700 disabled:opacity-50 cursor-pointer'
							>
								<X className='w-5 h-5' />
							</button>
						</div>

						<form onSubmit={handleSubmit}>
							<div className='space-y-4'>
								<div>
									<label className='block text-sm font-medium text-gray-700 mb-1'>Name *</label>
									<input
										type='text'
										name='name'
										value={formData.name}
										onChange={handleInputChange}
										disabled={submitting}
										className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${errors.name ? 'border-red-500' : 'border-gray-300'
											}`}
									/>
									{errors.name && <p className='text-red-500 text-xs mt-1'>{errors.name}</p>}
								</div>

								<div className='grid grid-cols-2 gap-4'>
									<div>
										<label className='block text-sm font-medium text-gray-700 mb-1'>Age *</label>
										<input
											type='number'
											name='age'
											value={formData.age}
											onChange={handleInputChange}
											disabled={submitting}
											className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${errors.age ? 'border-red-500' : 'border-gray-300'
												}`}
											min='0'
											max='150'
										/>
										{errors.age && <p className='text-red-500 text-xs mt-1'>{errors.age}</p>}
									</div>

									<div>
										<label className='block text-sm font-medium text-gray-700 mb-1'>Gender</label>
										<select
											name='gender'
											value={formData.gender}
											onChange={handleInputChange}
											disabled={submitting}
											className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50'
										>
											<option value='Male'>Male</option>
											<option value='Female'>Female</option>
											<option value='Other'>Other</option>
										</select>
									</div>
								</div>

								<div>
									<label className='block text-sm font-medium text-gray-700 mb-1'>Phone *</label>
									<input
										type='tel'
										name='phone'
										value={formData.phone}
										onChange={handleInputChange}
										disabled={submitting}
										className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${errors.phone ? 'border-red-500' : 'border-gray-300'
											}`}
									/>
									{errors.phone && <p className='text-red-500 text-xs mt-1'>{errors.phone}</p>}
								</div>

								<div>
									<label className='block text-sm font-medium text-gray-700 mb-1'>Email *</label>
									<input
										type='email'
										name='email'
										value={formData.email}
										onChange={handleInputChange}
										disabled={submitting}
										className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${errors.email ? 'border-red-500' : 'border-gray-300'
											}`}
									/>
									{errors.email && <p className='text-red-500 text-xs mt-1'>{errors.email}</p>}
								</div>

								<div className='grid grid-cols-2 gap-4'>
									<div>
										<label className='block text-sm font-medium text-gray-700 mb-1'>Blood Type</label>
										<select
											name='bloodType'
											value={formData.bloodType}
											onChange={handleInputChange}
											disabled={submitting}
											className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50'
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
										<label className='block text-sm font-medium text-gray-700 mb-1'>Last Visit</label>
										<input
											type='date'
											name='lastVisit'
											value={formData.lastVisit}
											onChange={handleInputChange}
											disabled={submitting}
											className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50'
										/>
									</div>
								</div>

								<div>
									<label className='block text-sm font-medium text-gray-700 mb-1'>Address</label>
									<input
										type='text'
										name='address'
										value={formData.address}
										onChange={handleInputChange}
										disabled={submitting}
										className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50'
									/>
								</div>

								<div>
									<label className='block text-sm font-medium text-gray-700 mb-1'>Emergency Contact</label>
									<input
										type='tel'
										name='emergencyContact'
										value={formData.emergencyContact}
										onChange={handleInputChange}
										disabled={submitting}
										className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50'
									/>
								</div>
							</div>

							<div className='flex justify-end space-x-3 mt-6 sticky bottom-0 bg-white pt-4'>
								<button
									type='button'
									onClick={handleCloseModal}
									disabled={submitting}
									className='px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50 cursor-pointer'
								>
									Cancel
								</button>
								<button
									type='submit'
									disabled={submitting}
									className='px-4 py-2 bg-blue-500 text-white rounded-lg bg-linear-to-t from-sky-500 to-indigo-500 border-blue-500 cursor-pointer transition-colors disabled:opacity-50'
								>
									{submitting ? 'Saving...' : editingPatient ? 'Update Patient' : 'Add Patient'}
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