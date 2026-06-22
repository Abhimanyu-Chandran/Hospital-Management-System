import React, { useEffect, useMemo, useState } from 'react'
import {
	Plus,
	Search,
	FileText,
	Edit,
	Trash2,
	X,
	Eye,
	Download,
} from 'lucide-react'
import { medicalRecordAPI } from '../../services/medicalRecordsAPI.js'
import { patientAPI } from '../../services/patientsAPI.js'
import { doctorAPI } from '../../services/doctorsAPI.js'

const toISODateInput = (value) => {
	if (!value) return ''
	const d = new Date(value)
	if (Number.isNaN(d.getTime())) return ''
	return d.toISOString().split('T')[0]
}

const formatDate = (value) => {
	if (!value) return ''
	const d = new Date(value)
	if (Number.isNaN(d.getTime())) return ''
	return d.toLocaleDateString()
}

const emptyPrescriptionRow = { medicine: '', dosage: '', duration: '' }

const MedicalRecords = () => {
	const [searchQuery, setSearchQuery] = useState('')
	const [filterType, setFilterType] = useState('All')

	const [records, setRecords] = useState([])
	const [patients, setPatients] = useState([])
	const [doctors, setDoctors] = useState([])

	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	const [toast, setToast] = useState(null)

	const [showModal, setShowModal] = useState(false)
	const [editingRecord, setEditingRecord] = useState(null)
	const [viewRecord, setViewRecord] = useState(null)

	const [formData, setFormData] = useState({
		patientId: '',
		doctorId: '',
		date: new Date().toISOString().split('T')[0],
		recordType: 'Consultation',
		diagnosis: '',
		treatment: '',
		prescription: [{ ...emptyPrescriptionRow }],
		notes: '',
		followUpDate: '',
	})

	const [errors, setErrors] = useState({})
	const [submitting, setSubmitting] = useState(false)

	const showToast = (message, type = 'error') => {
		setToast({ message, type })
		setTimeout(() => setToast(null), 4000)
	}

	const recordTypeOptions = ['Consultation', 'Lab Results', 'Imaging', 'Surgery Report', 'Prescription']

	const deriveRecordType = (diagnosis, treatment, prescription) => {
		const d = (diagnosis || '').toLowerCase()
		const t = (treatment || '').toLowerCase()

		if (
			d.includes('x-ray') ||
			d.includes('imaging') ||
			d.includes('ct') ||
			d.includes('mri') ||
			t.includes('imaging')
		) {
			return 'Imaging'
		}
		if (d.includes('surgery') || t.includes('surgery')) return 'Surgery Report'
		if (t.includes('prescription') || (prescription || []).length) return 'Prescription'
		if (d.includes('lab') || d.includes('blood') || d.includes('lab')) return 'Lab Results'
		return 'Consultation'
	}


	const getRecordTypeColor = (type) => {
		switch (type) {
			case 'Surgery Report':
				return 'bg-purple-100 text-purple-800'
			case 'Prescription':
				return 'bg-orange-100 text-orange-800'
			case 'Imaging':
				return 'bg-pink-100 text-pink-800'
			case 'Consultation':
				return 'bg-blue-100 text-blue-800'
			case 'Lab Results':
				return 'bg-green-100 text-green-800'
			default:
				return 'bg-gray-100 text-gray-800'
		}
	}

	const fetchAll = async () => {
		try {
			setLoading(true)
			setError(null)

			const [recordsData, patientsData, doctorsData] = await Promise.all([
				medicalRecordAPI.getAllMedicalRecords(),
				patientAPI.getAllPatients(),
				doctorAPI.getAllDoctors(),
			])

			const transformedRecords = Array.isArray(recordsData)
				? recordsData
					.map((r) => ({
						id: r._id,
						patientId: r.patientId?._id ?? r.patientId,
						doctorId: r.doctorId?._id ?? r.doctorId,
						patientName: r.patientId
							? `${r.patientId.firstName} ${r.patientId.lastName}`.trim()
							: '',
						doctorName: r.doctorId
							? `${r.doctorId.firstName} ${r.doctorId.lastName}`.trim()
							: '',
						doctorSpecialization: r.doctorId?.specialization || '',
						date: r.date,
						diagnosis: r.diagnosis,
						treatment: r.treatment,
						prescription: Array.isArray(r.prescription) ? r.prescription : [],
						notes: r.notes || '',
						followUpDate: r.followUpDate || null,
						recordType: r.recordType || deriveRecordType(r.diagnosis, r.treatment, r.prescription),
						createdAt: r.createdAt,
						updatedAt: r.updatedAt,
					}))
					.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
				: []

			const transformedPatients = Array.isArray(patientsData)
				? patientsData.map((p) => ({ id: p._id, name: `${p.firstName} ${p.lastName}`.trim() }))
				: []

			const transformedDoctors = Array.isArray(doctorsData)
				? doctorsData.map((d) => ({
					id: d._id,
					name: `${d.firstName} ${d.lastName}`.trim(),
					specialization: d.specialization || '',
				}))
				: []

			setRecords(transformedRecords)
			setPatients(transformedPatients)
			setDoctors(transformedDoctors)
		} catch (e) {
			console.error(e)
			setError('Failed to load medical records')
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchAll()
	}, [])

	const filteredRecords = useMemo(() => {
		let list = records

		if (filterType !== 'All') {
			list = list.filter((r) => r.recordType === filterType)
		}

		if (searchQuery.trim()) {
			const q = searchQuery.toLowerCase()
			list = list.filter((r) =>
				[
					r.patientName,
					r.doctorName,
					r.doctorSpecialization,
					r.diagnosis,
					r.treatment,
				]
					.filter(Boolean)
					.some((v) => String(v).toLowerCase().includes(q)),
			)
		}

		return list
	}, [records, searchQuery, filterType])

	const resetForm = () => {
		setFormData({
			patientId: '',
			doctorId: '',
			date: new Date().toISOString().split('T')[0],
			recordType: 'Consultation',
			diagnosis: '',
			treatment: '',
			prescription: [{ ...emptyPrescriptionRow }],
			notes: '',
			followUpDate: '',
		})
		setErrors({})
	}

	const handleAdd = () => {
		setEditingRecord(null)
		setViewRecord(null)
		resetForm()
		setShowModal(true)
	}

	const handleEdit = (record) => {
		setEditingRecord(record)
		setViewRecord(null)
		setFormData({
			patientId: record.patientId || '',
			doctorId: record.doctorId || '',
			date: toISODateInput(record.date),
			recordType: record.recordType || formData.recordType || 'Consultation',
			diagnosis: record.diagnosis || '',
			treatment: record.treatment || '',
			prescription:
				record.prescription && record.prescription.length
					? record.prescription.map((p) => ({
						medicine: p.medicine || '',
						dosage: p.dosage || '',
						duration: p.duration || '',
					}))
					: [{ ...emptyPrescriptionRow }],
			notes: record.notes || '',
			followUpDate: toISODateInput(record.followUpDate),
		})
		setErrors({})
		setShowModal(true)
	}

	const handleView = (record) => {
		setViewRecord(record)
		setEditingRecord(null)
		setShowModal(true)
	}

	const handleDelete = async (id) => {
		if (!window.confirm('Are you sure you want to delete this medical record?')) return
		try {
			await medicalRecordAPI.deleteMedicalRecord(id)
			setRecords((prev) => prev.filter((r) => r.id !== id))
			showToast('Medical record deleted successfully', 'success')
		} catch (e) {
			console.error(e)
			showToast('Failed to delete medical record')
		}
	}

	const validateForm = () => {
		const newErrors = {}

		if (!formData.patientId) newErrors.patientId = 'Patient is required'
		if (!formData.doctorId) newErrors.doctorId = 'Doctor is required'
		if (!formData.date) newErrors.date = 'Date is required'
		if (!formData.diagnosis.trim()) newErrors.diagnosis = 'Diagnosis is required'
		if (!formData.treatment.trim()) newErrors.treatment = 'Treatment is required'

		const presc = formData.prescription || []
		if (!Array.isArray(presc) || presc.length === 0) {
			newErrors.prescription = 'At least one prescription entry is required'
		} else {
			const invalidRow = presc.some((p) => !p.medicine.trim() || !p.dosage.trim() || !p.duration.trim())
			if (invalidRow) newErrors.prescription = 'Each prescription row needs medicine, dosage, and duration'
		}

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handlePrescriptionChange = (index, field, value) => {
		setFormData((prev) => {
			const updated = [...(prev.prescription || [])]
			updated[index] = { ...updated[index], [field]: value }
			return { ...prev, prescription: updated }
		})
	}

	const addPrescriptionRow = () => {
		setFormData((prev) => ({
			...prev,
			prescription: [...(prev.prescription || []), { ...emptyPrescriptionRow }],
		}))
	}

	const removePrescriptionRow = (index) => {
		setFormData((prev) => {
			const next = (prev.prescription || []).filter((_, i) => i !== index)
			if (next.length === 0) return { ...prev, prescription: [{ ...emptyPrescriptionRow }] }
			return { ...prev, prescription: next }
		})
	}

	const handleCloseModal = () => {
		setShowModal(false)
		setEditingRecord(null)
		setViewRecord(null)
		setErrors({})
		setSubmitting(false)
	}

	const handleSubmit = async (e) => {
		e.preventDefault()

		if (!validateForm()) {
			showToast('Please fix the form errors')
			return
		}

		try {
			setSubmitting(true)

			const payload = {
				patientId: formData.patientId,
				doctorId: formData.doctorId,
				date: new Date(formData.date).toISOString(),
				recordType: formData.recordType,
				diagnosis: formData.diagnosis,
				treatment: formData.treatment,
				prescription: (formData.prescription || []).map((p) => ({
					medicine: p.medicine,
					dosage: p.dosage,
					duration: p.duration,
				})),
				notes: formData.notes || '',
				followUpDate: formData.followUpDate
					? new Date(formData.followUpDate).toISOString()
					: undefined,
			}

			if (editingRecord) {
				await medicalRecordAPI.updateMedicalRecord(editingRecord.id, payload)
				showToast('Medical record updated successfully', 'success')
			} else {
				await medicalRecordAPI.createMedicalRecord(payload)
				showToast('Medical record created successfully', 'success')
			}

			await fetchAll()
			handleCloseModal()
		} catch (e2) {
			console.error(e2)
			showToast(e2?.message || 'Failed to submit medical record')
		} finally {
			setSubmitting(false)
		}
	}

	return (
		<section className='pt-5 p-2'>
			<div className='flex items-center justify-between shadow-md rounded-md p-3'>
				<div>
					<p className='text-2xl font-medium text-gray-800'>Medical Records</p>
					<p>Manage patient medical records and documents</p>
				</div>
				<div className='flex'>
					<button
						onClick={handleAdd}
						className='shadow-md rounded-md border-2 rounded-md px-4 py-2 m-2 flex bg-linear-to-t from-sky-500 to-indigo-500 text-white cursor-pointer disabled:opacity-50'
						disabled={loading}
					>
						<Plus className='w-4 h-6' />
						&nbsp;New Record
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
					className={`border px-4 py-3 rounded relative my-4 ${toast.type === 'success'
						? 'bg-green-100 border-green-400 text-green-700'
						: 'bg-red-100 border-red-400 text-red-700'
						}`}
				>
					{toast.message}
				</div>
			)}

			<div className='bg-white p-4 rounded-lg shadow p-5 my-5'>
				<div className='relative mb-6'>
					<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
					<input
						type='text'
						placeholder='Search by patient name, diagnosis, or doctor...'
						className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>

				<div className='mb-6'>
					<label className='text-sm font-medium text-gray-700 mb-2 block'>Filter by type:</label>
					<div className='flex space-x-2'>
						{['All', 'Consultation', 'Lab Results', 'Surgery Report', 'Prescription', 'Imaging'].map((type) => (
							<button
								key={type}
								onClick={() => setFilterType(type)}
								className={`px-4 py-2 rounded-md font-medium bg-linear-to-t from-sky-500 to-indigo-500 text-white cursor-pointer transition-colors ${filterType === type}`}
							>
								{type}
							</button>
						))}
					</div>
				</div>

				{loading ? (
					<div className='py-10 text-center text-gray-500'>Loading medical records...</div>
				) : (
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
						{filteredRecords.length > 0 ? (
							filteredRecords.map((record) => (
								<div
									key={record.id}
									className='bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow'
								>
									<div className='flex justify-between items-start mb-4'>
										<div className='flex items-center'>
											<FileText className='w-5 h-5 text-gray-500 mr-3' />
											<div>
												<h3 className='font-semibold text-gray-900'>{record.patientName}</h3>
												<p className='text-sm text-gray-500'>Patient ID: {record.patientId}</p>
											</div>
										</div>
										<div className='text-right'>
											<span
												className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRecordTypeColor(
													record.recordType,
												)}`}
											>
												{record.recordType}
											</span>
											<p className='text-sm text-gray-500 mt-1'>{formatDate(record.date)}</p>
										</div>
									</div>

									<div className='space-y-3 mb-4'>
										<div className='flex items-center text-sm text-gray-600'>
											<span className='font-medium'>Doctor:</span>
											<span className='ml-2'>{record.doctorName}</span>
										</div>
										<div className='flex items-center text-sm text-gray-600'>
											<span className='font-medium'>Diagnosis:</span>
											<span className='ml-2'>{record.diagnosis}</span>
										</div>
										<div className='text-sm text-gray-600'>
											<span className='font-medium'>Notes:</span>
											<p className='mt-1 text-gray-700'>{record.notes}</p>
										</div>
									</div>

									<div className='flex space-x-3'>
										<button
											onClick={() => handleEdit(record)}
											className='flex-1 px-4 py-2 cursor-pointer border border-blue-500 rounded-md bg-linear-to-t from-sky-500 to-indigo-500 text-white transition-colors flex items-center justify-center'
										>
											<Edit className='w-4 h-4 mr-2' />
											Edit
										</button>
										<button
											onClick={() => handleView(record)}
											className='flex-1 px-4 py-2 cursor-pointer bg-linear-to-t from-sky-500 to-indigo-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center'
										>
											<Eye className='w-4 h-4 mr-2' />
											View
										</button>
									</div>

									<div className='flex space-x-3 mt-3'>
										<button
											onClick={() => handleDelete(record.id)}
											className='flex-1 px-4 py-2 cursor-pointer bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors flex items-center justify-center'
										>
											<Trash2 className='w-4 h-4 mr-2' />
											Delete
										</button>
										<button
											type='button'
											onClick={() => showToast('PDF export not implemented in this UI', 'success')}
											className='flex-1 px-4 py-2 cursor-pointer bg-green-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center justify-center'
										>
											<Download className='w-4 h-4 mr-2' />
											Download
										</button>
									</div>
								</div>
							))
						) : (
							<div className='col-span-full text-center py-8 text-gray-500'>
								No medical records found matching your criteria
							</div>
						)}
					</div>
				)}
			</div>

			{showModal && (
				<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
					<div className='bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl'>
						<div className='flex justify-between items-center mb-4 sticky top-0 bg-white pb-2'>
							<h2 className='text-xl font-semibold text-gray-800'>
								{viewRecord
									? 'Medical Record Details'
									: editingRecord
										? 'Edit Medical Record'
										: 'Add Medical Record'}
							</h2>
							<button
								onClick={handleCloseModal}
								disabled={submitting}
								className='text-gray-500 hover:text-gray-700 disabled:opacity-50 cursor-pointer'
								type='button'
							>
								<X className='w-5 h-5' />
							</button>
						</div>

						{viewRecord ? (
							<div className='space-y-4'>
								<div className='bg-gray-50 border border-gray-200 rounded-md p-4'>
									<div className='flex justify-between items-start'>
										<div>
											<div className='text-sm text-gray-500'>Patient</div>
											<div className='font-semibold text-gray-900'>{viewRecord.patientName}</div>
											<div className='text-xs text-gray-500 mt-1'>ID: {viewRecord.patientId}</div>
										</div>
										<div className='text-right'>
											<div className='text-sm text-gray-500'>Date</div>
											<div className='font-semibold text-gray-900'>{formatDate(viewRecord.date)}</div>
											<div className='text-xs text-gray-500 mt-1'>Type: {viewRecord.recordType}</div>
										</div>
									</div>
								</div>

								<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
									<div className='bg-white border border-gray-200 rounded-md p-4'>
										<div className='text-sm text-gray-500'>Doctor</div>
										<div className='font-semibold text-gray-900'>{viewRecord.doctorName}</div>
										{viewRecord.doctorSpecialization ? (
											<div className='text-sm text-gray-600 mt-1'>{viewRecord.doctorSpecialization}</div>
										) : null}
									</div>
									<div className='bg-white border border-gray-200 rounded-md p-4'>
										<div className='text-sm text-gray-500'>Diagnosis</div>
										<div className='font-semibold text-gray-900'>{viewRecord.diagnosis}</div>
									</div>
								</div>

								<div className='bg-white border border-gray-200 rounded-md p-4'>
									<div className='text-sm text-gray-500'>Treatment</div>
									<div className='mt-1 text-gray-900 whitespace-pre-wrap'>{viewRecord.treatment}</div>
								</div>

								<div className='bg-white border border-gray-200 rounded-md p-4'>
									<div className='text-sm text-gray-500'>Prescription</div>
									<div className='mt-3 space-y-2'>
										{Array.isArray(viewRecord.prescription) && viewRecord.prescription.length ? (
											viewRecord.prescription.map((p, i) => (
												<div key={`${p.medicine}-${i}`} className='text-sm flex gap-2 flex-wrap'>
													<span className='font-semibold text-gray-900'>{p.medicine}</span>
													<span className='text-gray-700'>({p.dosage}, {p.duration})</span>
												</div>
											))
										) : (
											<div className='text-sm text-gray-500'>No prescription entries</div>
										)}
									</div>
								</div>

								{viewRecord.notes ? (
									<div className='bg-white border border-gray-200 rounded-md p-4'>
										<div className='text-sm text-gray-500'>Notes</div>
										<div className='mt-1 text-gray-900 whitespace-pre-wrap'>{viewRecord.notes}</div>
									</div>
								) : null}

								{viewRecord.followUpDate ? (
									<div className='bg-white border border-gray-200 rounded-md p-4'>
										<div className='text-sm text-gray-500'>Follow Up Date</div>
										<div className='mt-1 font-semibold text-gray-900'>{formatDate(viewRecord.followUpDate)}</div>
									</div>
								) : null}
							</div>
						) : (
							<form onSubmit={handleSubmit} className='space-y-4'>
								<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
									<div>
										<label className='block text-sm font-medium text-gray-700 mb-1'>Patient *</label>
										<select
											name='patientId'
											value={formData.patientId}
											onChange={(e) => setFormData((p) => ({ ...p, patientId: e.target.value }))}
											disabled={submitting}
											className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.patientId ? 'border-red-500' : 'border-gray-300'
												}`}
										>
											<option value=''>Select patient</option>
											{patients.map((p) => (
												<option key={p.id} value={p.id}>
													{p.name}
												</option>
											))}
										</select>
										{errors.patientId ? <p className='text-red-500 text-xs mt-1'>{errors.patientId}</p> : null}
									</div>

									<div>
										<label className='block text-sm font-medium text-gray-700 mb-1'>Doctor *</label>
										<select
											name='doctorId'
											value={formData.doctorId}
											onChange={(e) => setFormData((p) => ({ ...p, doctorId: e.target.value }))}
											disabled={submitting}
											className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.doctorId ? 'border-red-500' : 'border-gray-300'
												}`}
										>
											<option value=''>Select doctor</option>
											{doctors.map((d) => (
												<option key={d.id} value={d.id}>
													{d.name}
													{d.specialization ? ` (${d.specialization})` : ''}
												</option>
											))}
										</select>
										{errors.doctorId ? <p className='text-red-500 text-xs mt-1'>{errors.doctorId}</p> : null}
									</div>

									<div>
										<label className='block text-sm font-medium text-gray-700 mb-1'>Date *</label>
										<input
											type='date'
											name='date'
											value={formData.date}
											onChange={(e) => setFormData((p) => ({ ...p, date: e.target.value }))}
											disabled={submitting}
											className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.date ? 'border-red-500' : 'border-gray-300'
												}`}
										/>
										{errors.date ? <p className='text-red-500 text-xs mt-1'>{errors.date}</p> : null}
									</div>

									<div>
										<label className='block text-sm font-medium text-gray-700 mb-1'>Follow Up Date</label>
										<input
											type='date'
											name='followUpDate'
											value={formData.followUpDate}
											onChange={(e) => setFormData((p) => ({ ...p, followUpDate: e.target.value }))}
											disabled={submitting}
											className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
										/>
									</div>
								</div>

								<div>
									<label className='block text-sm font-medium text-gray-700 mb-1'>Record Type *</label>
									<select
										name='recordType'
										value={formData.recordType}
										onChange={(e) => setFormData((p) => ({ ...p, recordType: e.target.value }))}
										disabled={submitting}
										className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
									>
										{recordTypeOptions.map((type) => (
											<option key={type} value={type}>
												{type}
											</option>
										))}
									</select>
								</div>

								<div>
									<label className='block text-sm font-medium text-gray-700 mb-1'>Diagnosis * </label>
									<input
										type='text'
										value={formData.diagnosis}
										onChange={(e) => setFormData((p) => ({ ...p, diagnosis: e.target.value }))}
										disabled={submitting}
										className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.diagnosis ? 'border-red-500' : 'border-gray-300'
											}`}
										placeholder='e.g. ACL Reconstruction'
									/>
									{errors.diagnosis ? <p className='text-red-500 text-xs mt-1'>{errors.diagnosis}</p> : null}
								</div>

								<div>
									<label className='block text-sm font-medium text-gray-700 mb-1'>Treatment *</label>
									<textarea
										value={formData.treatment}
										onChange={(e) => setFormData((p) => ({ ...p, treatment: e.target.value }))}
										disabled={submitting}
										rows={3}
										className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.treatment ? 'border-red-500' : 'border-gray-300'
											}`}
										placeholder='Treatment details'
									/>
									{errors.treatment ? <p className='text-red-500 text-xs mt-1'>{errors.treatment}</p> : null}
								</div>

								<div>
									<div className='flex justify-between items-center mb-2'>
										<label className='block text-sm font-medium text-gray-700'>Prescription *</label>
										<button
											type='button'
											onClick={addPrescriptionRow}
											disabled={submitting}
											className='text-xs flex items-center text-blue-600 hover:text-blue-800 font-semibold'
										>
											<Plus className='w-3 h-3 mr-1' /> Add Row
										</button>
									</div>

									{errors.prescription ? <p className='text-red-500 text-xs mb-2'>{errors.prescription}</p> : null}

									<div className='space-y-3 max-h-56 overflow-y-auto pr-1'>
										{(formData.prescription || []).map((row, index) => (
											<div key={index} className='bg-gray-50 p-3 rounded-md border border-gray-200 shadow-sm'>
												<div className='grid grid-cols-1 md:grid-cols-3 gap-2'>
													<div>
														<label className='block text-xs font-medium text-gray-600 mb-1'>Medicine *</label>
														<input
															type='text'
															value={row.medicine}
															onChange={(e) =>
																handlePrescriptionChange(index, 'medicine', e.target.value)
															}
															disabled={submitting}
															className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
														/>
													</div>
													<div>
														<label className='block text-xs font-medium text-gray-600 mb-1'>Dosage *</label>
														<input
															type='text'
															value={row.dosage}
															onChange={(e) =>
																handlePrescriptionChange(index, 'dosage', e.target.value)
															}
															disabled={submitting}
															className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
														/>
													</div>
													<div>
														<label className='block text-xs font-medium text-gray-600 mb-1'>Duration *</label>
														<input
															type='text'
															value={row.duration}
															onChange={(e) =>
																handlePrescriptionChange(index, 'duration', e.target.value)
															}
															disabled={submitting}
															className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
														/>
													</div>
												</div>

												<div className='flex justify-end mt-2'>
													{index > 0 ? (
														<button
															type='button'
															onClick={() => removePrescriptionRow(index)}
															disabled={submitting}
															className='text-xs text-gray-500 hover:text-red-600'
														>
															Remove
														</button>
													) : null}
												</div>
											</div>
										))}
									</div>
								</div>

								<div>
									<label className='block text-sm font-medium text-gray-700 mb-1'>Notes</label>
									<textarea
										value={formData.notes}
										onChange={(e) => setFormData((p) => ({ ...p, notes: e.target.value }))}
										disabled={submitting}
										rows={2}
										className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
										placeholder='Optional notes'
									/>
								</div>

								<div className='flex justify-end space-x-3 pt-4 border-t border-gray-100'>
									<button
										type='button'
										onClick={handleCloseModal}
										disabled={submitting}
										className='px-4 py-2 text-sm cursor-pointer text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50'
									>
										Cancel
									</button>
									<button
										type='submit'
										disabled={submitting}
										className='px-4 py-2 text-sm bg-linear-to-t from-sky-500 to-indigo-500 cursor-pointer text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50'
									>
										{submitting ? 'Saving...' : editingRecord ? 'Update Record' : 'Create Record'}
									</button>
								</div>
							</form>
						)}
					</div>
				</div>
			)}
		</section>
	)
}

export default MedicalRecords

