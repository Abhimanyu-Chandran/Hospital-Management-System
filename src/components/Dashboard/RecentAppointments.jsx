import React from 'react'

const RecentAppointments = () => {
    return (
        <section>
            <div className="bg-white rounded-lg shadow my-4">
                <div className="p-6 border-b">
                    <h3 className="text-xl">Recent Appointments</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-500">Patient</th>
                                <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-500">Doctor</th>
                                <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-500">Time</th>
                                <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-500">Status</th>
                            </tr>
                        </thead>
                        <tbody className='bg-white divide-y divide-gray-200'>
                            <AppointmentRow
                                patient="Sarah Johnson"
                                doctor="Dr. Smith"
                                time="09:00 AM"
                                status="Completed"
                                statusColor="bg-green-100 text-green-800"
                            />
                            <AppointmentRow
                                patient="Michael Chen"
                                doctor="Dr. Williams"
                                time="10:30 AM"
                                status="In Progress"
                                statusColor="bg-blue-100 text-blue-800"
                            />
                            <AppointmentRow
                                patient="Emily Davis"
                                doctor="Dr. Brown"
                                time="11:00 AM"
                                status="Scheduled"
                                statusColor="bg-yellow-100 text-yellow-800"
                            />
                            <AppointmentRow
                                patient="James Wilson"
                                doctor="Dr. Garcia"
                                time="02:00 PM"
                                status="Scheduled"
                                statusColor="bg-yellow-100 text-yellow-800"
                            />
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}

function AppointmentRow({ patient, doctor, time, status, statusColor }) {
    return (
        <tr>
            <td className='px-6 py-4 whitespace-nowrap'>{patient}</td>
            <td className='px-6 py-4 whitespace-nowrap'>{doctor}</td>
            <td className='px-6 py-4 whitespace-nowrap'>{time}</td>
            <td className='px-6 py-4 whitespace-nowrap'>
                <span className={`px-2 py-1 inline-flex text-xs leading-5 rounded ${statusColor}`}>{status}</span>
            </td>
        </tr>
    );
}

export default RecentAppointments