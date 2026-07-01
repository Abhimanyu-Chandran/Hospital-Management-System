import { useEffect, useMemo, useState } from 'react';
import { Edit, Plus, Search, Trash2, X } from 'lucide-react';
import { appointmentsAPI } from '../../services/appointmentsAPI.js';

const statusColors = {
	Scheduled: 'bg-blue-100 text-blue-800',
	'In Progress': 'bg-yellow-100 text-yellow-800',
	Completed: 'bg-green-100 text-green-800',
	Cancelled: 'bg-red-100 text-red-800'
};

const Appointments = () => {
	const [searchQuery, setSearchQuery] = useState('');
	const [filterStatus, setFilterStatus] = useState('All');

	const [appointments, setAppointments] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [toast, setToast] = useState(null);

	const [showModal, setShowModal] = useState(false);
	const [editingAppointment, setEditingAppointment] = useState(null);

	const [formData, setFormData] = useState({
		patientName: '',
		type: '',
		department: '',
		doctor: '',
		date: new Date().toISOString().split('T')[0],
		time: '09:00 AM',
		status: 'Scheduled',
		reason: '',
		notes: ''
	});

	const [errors, setErrors] = useState({});
	const [submitting, setSubmitting] = useState(false);

	const showToast = (message, type = 'error') => {
		setToast({ message, type });
		setTimeout(() => setToast(null), 4000);
	};

	const fetchAppointments = async () => {
		try {
			setLoading(true);
			setError(null);
			const data = await appointmentsAPI.getAllAppointments();
			if (!Array.isArray(data)) throw new Error('Invalid response format from server');

			const transformed = data
				.map(a => ({
					id: a._id,
					patientName: a.patientName || '',
					type: a.type || '',
					department: a.department || '',
					doctor: a.doctor || '',
					date: a.date ? new Date(a.date).toISOString().split('T')[0] : '',
					time: a.time || '',
					status: a.status || 'Scheduled',
					reason: a.reason || '',
					notes: a.notes || ''
				}))
				.filter(Boolean);

			setAppointments(transformed);
		} catch (err) {
			setError('Failed to fetch appointments: ' + (err.message || 'Unknown error'));
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		const timer = setTimeout(() => {
			fetchAppointments();
		}, 0);
		return () => clearTimeout(timer);
	}, []);

	const filteredAppointments = useMemo(() => {
		let filtered = appointments;

		if (filterStatus !== 'All') {
			filtered = filtered.filter(a => a.status === filterStatus);
		}

		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter(a =>
				a.patientName.toLowerCase().includes(query) ||
				a.doctor.toLowerCase().includes(query) ||
				a.department.toLowerCase().includes(query)
			);
		}

		return filtered;
	}, [appointments, filterStatus, searchQuery]);

	const validateForm = () => {
		const newErrors = {};

		if (!formData.patientName.trim()) newErrors.patientName = 'Patient name is required';
		if (!formData.doctor.trim()) newErrors.doctor = 'Doctor is required';
		if (!formData.department.trim()) newErrors.department = 'Department is required';
		if (!formData.type.trim()) newErrors.type = 'Appointment type is required';
		if (!formData.date) newErrors.date = 'Date is required';
		if (!formData.time.trim()) newErrors.time = 'Time is required';

		if (!formData.status) newErrors.status = 'Status is required';

		// reason is optional in schema now

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleAddAppointment = () => {
		setEditingAppointment(null);
		setFormData({
			patientName: '',
			type: 'General Consultation',
			department: '',
			doctor: '',
			date: new Date().toISOString().split('T')[0],
			time: '09:00 AM',
			status: 'Scheduled',
			reason: '',
			notes: ''
		});
		setErrors({});
		setShowModal(true);
	};

	const handleEditAppointment = (a) => {
		setEditingAppointment(a);
		setFormData({
			patientName: a.patientName,
			type: a.type,
			department: a.department,
			doctor: a.doctor,
			date: a.date,
			time: a.time,
			status: a.status,
			reason: a.reason || '',
			notes: a.notes || ''
		});
		setErrors({});
		setShowModal(true);
	};

	const handleDeleteAppointment = async (id) => {
		if (!window.confirm('Are you sure you want to delete this appointment?')) return;
		try {
			await appointmentsAPI.deleteAppointment(id);
			setAppointments(prev => prev.filter(a => a.id !== id));
			showToast('Appointment deleted successfully', 'success');
		} catch (err) {
			console.error(err);
			setError('Failed to delete appointment: ' + (err.message || 'Unknown error'));
		}
	};

	const handleCloseModal = () => {
		setShowModal(false);
		setEditingAppointment(null);
		setErrors({});
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
		if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!validateForm()) {
			showToast('Please fix the form errors');
			return;
		}

		try {
			setSubmitting(true);

			const payload = {
				patientName: formData.patientName.trim(),
				doctor: formData.doctor.trim(),
				department: formData.department.trim(),
				type: formData.type.trim(),
				date: new Date(formData.date).toISOString(),
				time: formData.time.trim(),
				status: formData.status,
				reason: formData.reason.trim() || undefined,
				notes: formData.notes.trim() || undefined,
				patientId: editingAppointment?.patientId || undefined,
				doctorId: editingAppointment?.doctorId || undefined
			};

			if (!payload.patientId) delete payload.patientId;
			if (!payload.doctorId) delete payload.doctorId;

			if (editingAppointment) {
				await appointmentsAPI.updateAppointment(editingAppointment.id, payload);
				setAppointments(prev =>
					prev.map(a =>
						a.id === editingAppointment.id
							? { ...a, ...payload, date: formData.date }
							: a
					)
				);
				showToast('Appointment updated successfully', 'success');
			} else {
				const created = await appointmentsAPI.createAppointment(payload);
				setAppointments(prev => [
					...prev,
					{
						id: created._id,
						patientName: created.patientName,
						type: created.type,
						department: created.department,
						doctor: created.doctor,
						date: formData.date,
						time: created.time,
						status: created.status,
						reason: created.reason || '',
						notes: created.notes || ''
					}
				]);
				showToast('Appointment created successfully', 'success');
			}

			handleCloseModal();
		} catch (err) {
			console.error(err);
			setError('Failed to save appointment: ' + (err.message || 'Unknown error'));
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<section className='pt-5 p-5'>
			<div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm hover:shadow-md transition-all duration-300 rounded-xl p-6 bg-white mb-6'>
				<div>
					<h1 className='text-3xl font-extrabold text-gray-900'>Appointments</h1>
					<p className='text-gray-500 mt-1 text-sm'>Schedule and manage appointments</p>
				</div>
				<button
					onClick={handleAddAppointment}
					disabled={loading}
					className='flex items-center justify-center gap-2 px-5 py-3 font-semibold text-white bg-linear-to-t from-sky-500 to-indigo-500 rounded-lg shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50'
				>
					<Plus className='w-5 h-5' />
					Add Appointment
				</button>
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
				<div className='relative'>
					<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
					<input
						type='text'
						placeholder='          Search appointments by patient, doctor, or department...'
						className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>

				<div className='mt-5'>
					<label className='text-sm font-medium text-gray-700 mb-2 block'>Filter by status</label>
					<div className='flex flex-wrap gap-2 '>
						{['All', 'Scheduled', 'In Progress', 'Completed', 'Cancelled'].map((status) => (
							<button
								key={status}
								onClick={() => setFilterStatus(status)}
								className={`px-4 py-2 rounded-md font-medium bg-linear-to-t from-sky-500 to-indigo-500 text-white cursor-pointer transition-colors ${filterStatus === status}`}
							>
								{status}
							</button>
						))}
					</div>
				</div>
			</div>

			<div className='shadow-md rounded-md overflow-auto bg-white'>
				{loading ? (
					<div className='p-8 text-center text-gray-500'>Loading appointments...</div>
				) : (
					<table className='w-full text-left border-collapse'>
						<thead className='bg-gray-50 border-b border-gray-200'>
							<tr>
								<th className='px-6 py-3 text-xs uppercase tracking-wider text-gray-500 font-semibold'>Patient</th>
								<th className='px-6 py-3 text-xs uppercase tracking-wider text-gray-500 font-semibold'>Type</th>
								<th className='px-6 py-3 text-xs uppercase tracking-wider text-gray-500 font-semibold'>Schedule</th>
								<th className='px-6 py-3 text-xs uppercase tracking-wider text-gray-500 font-semibold'>Doctor / Department</th>
								<th className='px-6 py-3 text-xs uppercase tracking-wider text-gray-500 font-semibold'>Status</th>
								<th className='px-6 py-3 text-xs uppercase tracking-wider text-gray-500 font-semibold'>Actions</th>
							</tr>
						</thead>

						<tbody className='divide-y divide-gray-200'>
							{filteredAppointments.length > 0 ? (
								filteredAppointments.map((a) => (
									<tr key={a.id} className='hover:bg-gray-50 transition-colors text-sm'>
										<td className='px-6 py-4'>
											<div className='font-medium text-gray-900'>{a.patientName}</div>
											<div className='text-xs text-gray-400'>{a.id}</div>
										</td>
										<td className='px-6 py-4'>
											<div className='text-gray-700'>{a.type}</div>
										</td>
										<td className='px-6 py-4'>
											<div className='text-gray-700'>{a.date}</div>
											<div className='text-gray-500 text-xs'>{a.time}</div>
										</td>
										<td className='px-6 py-4'>
											<div className='text-gray-700'>{a.doctor}</div>
											<div className='text-gray-500 text-xs'>{a.department}</div>
										</td>
										<td className='px-6 py-4'>
											<span
												className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${statusColors[a.status] || 'bg-gray-100 text-gray-700'
													}`}
											>
												{a.status}
											</span>
										</td>
										<td className='px-6 py-4'>
											<div className='flex space-x-3'>
												<button
													onClick={() => handleEditAppointment(a)}
													className='text-blue-600 hover:text-blue-900'
													type='button'
												>
													<Edit className='w-4 h-4' />
												</button>
												<button
													onClick={() => handleDeleteAppointment(a.id)}
													className='text-red-600 hover:text-red-900'
													type='button'
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
										{searchQuery
											? `No appointments found matching "${searchQuery}"`
											: 'No appointments found'}
									</td>
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
								{editingAppointment ? 'Edit Appointment' : 'Add Appointment'}
							</h2>
							<button
								onClick={handleCloseModal}
								disabled={submitting}
								className='text-gray-400 hover:text-gray-600 cursor-pointer'
								type='button'
							>
								<X className='w-5 h-5' />
							</button>
						</div>

						<form onSubmit={handleSubmit} className='space-y-4'>
							<div className='grid grid-cols-2 gap-4'>
								<div>
									<label className='block text-sm font-medium text-gray-700 mb-1'>Patient Name *</label>
									<input
										type='text'
										name='patientName'
										value={formData.patientName}
										onChange={handleInputChange}
										disabled={submitting}
										className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.patientName ? 'border-red-500' : 'border-gray-300'
											}`}
										placeholder='Sarah Johnson'
									/>
									{errors.patientName && <p className='text-red-500 text-xs mt-1'>{errors.patientName}</p>}
								</div>

								<div>
									<label className='block text-sm font-medium text-gray-700 mb-1'>Type *</label>
									<input
										type='text'
										name='type'
										value={formData.type}
										onChange={handleInputChange}
										disabled={submitting}
										className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.type ? 'border-red-500' : 'border-gray-300'
											}`}
										placeholder='General Consultation'
									/>
									{errors.type && <p className='text-red-500 text-xs mt-1'>{errors.type}</p>}
								</div>
							</div>

							<div className='grid grid-cols-2 gap-4'>
								<div>
									<label className='block text-sm font-medium text-gray-700 mb-1'>Doctor *</label>
									<input
										type='text'
										name='doctor'
										value={formData.doctor}
										onChange={handleInputChange}
										disabled={submitting}
										className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.doctor ? 'border-red-500' : 'border-gray-300'
											}`}
										placeholder='Dr. Smith'
									/>
									{errors.doctor && <p className='text-red-500 text-xs mt-1'>{errors.doctor}</p>}
								</div>

								<div>
									<label className='block text-sm font-medium text-gray-700 mb-1'>Department *</label>
									<input
										type='text'
										name='department'
										value={formData.department}
										onChange={handleInputChange}
										disabled={submitting}
										className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.department ? 'border-red-500' : 'border-gray-300'
											}`}
										placeholder='Cardiology'
									/>
									{errors.department && <p className='text-red-500 text-xs mt-1'>{errors.department}</p>}
								</div>
							</div>

							<div className='grid grid-cols-2 gap-4'>
								<div>
									<label className='block text-sm font-medium text-gray-700 mb-1'>Date *</label>
									<input
										type='date'
										name='date'
										value={formData.date}
										onChange={handleInputChange}
										disabled={submitting}
										className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.date ? 'border-red-500' : 'border-gray-300'
											}`}
									/>
									{errors.date && <p className='text-red-500 text-xs mt-1'>{errors.date}</p>}
								</div>

								<div>
									<label className='block text-sm font-medium text-gray-700 mb-1'>Time *</label>
									<input
										type='text'
										name='time'
										value={formData.time}
										onChange={handleInputChange}
										disabled={submitting}
										className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.time ? 'border-red-500' : 'border-gray-300'
											}`}
										placeholder='09:00 AM'
									/>
									{errors.time && <p className='text-red-500 text-xs mt-1'>{errors.time}</p>}
								</div>
							</div>

							<div>
								<label className='block text-sm font-medium text-gray-700 mb-1'>Status *</label>
								<select
									name='status'
									value={formData.status}
									onChange={handleInputChange}
									disabled={submitting}
									className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.status ? 'border-red-500' : 'border-gray-300'
										}`}
								>
									{['Scheduled', 'In Progress', 'Completed', 'Cancelled'].map(s => (
										<option key={s} value={s}>{s}</option>
									))}
								</select>
								{errors.status && <p className='text-red-500 text-xs mt-1'>{errors.status}</p>}
							</div>

							<div>
								<label className='block text-sm font-medium text-gray-700 mb-1'>Reason (optional)</label>
								<input
									type='text'
									name='reason'
									value={formData.reason}
									onChange={handleInputChange}
									disabled={submitting}
									className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
									placeholder='e.g., Initial consultation'
								/>
							</div>

							<div>
								<label className='block text-sm font-medium text-gray-700 mb-1'>Notes (optional)</label>
								<textarea
									name='notes'
									value={formData.notes}
									onChange={handleInputChange}
									disabled={submitting}
									className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
									rows={3}
									placeholder='Additional details...'
								/>
							</div>

							<div className='flex justify-end space-x-3 mt-6 border-t border-gray-100 pt-4'>
								<button
									type='button'
									onClick={handleCloseModal}
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
									{submitting ? 'Saving...' : editingAppointment ? 'Update Appointment' : 'Create Appointment'}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</section>
	);
};

export default Appointments;

