import React from 'react'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const appointmentData = [
    { name: 'Mon', appointments: 45 },
    { name: 'Tue', appointments: 52 },
    { name: 'Wed', appointments: 48 },
    { name: 'Thu', appointments: 61 },
    { name: 'Fri', appointments: 55 },
    { name: 'Sat', appointments: 32 },
    { name: 'Sun', appointments: 28 }
];

const WeeklyAppointments = () => {
    return (
        <section>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl mb-4">Weekly Appointments</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={appointmentData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 80]} ticks={[0, 20, 40, 60, 80]} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="appointments" fill="#3b82f6" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </section>
    )
}

export default WeeklyAppointments