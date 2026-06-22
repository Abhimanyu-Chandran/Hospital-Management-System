import { useEffect, useState } from 'react';
import { appointmentsAPI } from '../../services/appointmentsAPI.js';

const statusColors = {
	Scheduled: 'bg-blue-100 text-blue-800',
	'In Progress': 'bg-yellow-100 text-yellow-800',
	Completed: 'bg-green-100 text-green-800',
	Cancelled: 'bg-red-100 text-red-800'
};

const RecentAppointments = () => {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [appointments, setAppointments] = useState([]);

	useEffect(() => {
		const fetchAppointments = async () => {
			try {
				setLoading(true);
				setError(null);

				const data = await appointmentsAPI.getAllAppointments();
				if (!Array.isArray(data)) throw new Error('Invalid response format from server');

				const transformed = data
					.map((a) => ({
						id: a._id,
						patientName: a.patientName || '',
						doctor: a.doctor || '',
						time: a.time || '',
						status: a.status || 'Scheduled'
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

		fetchAppointments();
	}, []);

	return (
		<section>
			<div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow my-4">
				<div className="p-6 border-b">
					<h3 className="text-xl">Recent Appointments</h3>
				</div>

				{error && (
					<div className="px-6 py-4 text-sm text-red-700">{error}</div>
				)}

				<table className="w-full border-collapse rounded-lg">
					<thead className="bg-gray-50">
						<tr>
							<th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-500">Patient</th>
							<th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-500">Doctor</th>
							<th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-500">Time</th>
							<th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-500">Status</th>
						</tr>
					</thead>
					<tbody>
						{loading ? (
							<tr>
								<td colSpan="4" className="px-6 py-6 text-center text-sm text-gray-500">
									Loading appointments...
								</td>
							</tr>
						) : appointments.length > 0 ? (
							appointments.map((a) => (
								<tr key={a.id} className="text-sm">
									<td className="px-6 py-4">
										<div className="font-medium">{a.patientName}</div>
									</td>
									<td className="px-6 py-4">
										<div>{a.doctor}</div>
									</td>
									<td className="px-6 py-4">
										<div>{a.time}</div>
									</td>
									<td className="px-6 py-4">
										<span
											className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${statusColors[a.status] || 'bg-gray-100 text-gray-700'}`}
										>
											{a.status}
										</span>
									</td>
								</tr>
							))
						) : (
							<tr>
								<td colSpan="4" className="px-6 py-8 text-center text-sm text-gray-500">
									No recent appointments found.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</section>
	);
};

export default RecentAppointments;
