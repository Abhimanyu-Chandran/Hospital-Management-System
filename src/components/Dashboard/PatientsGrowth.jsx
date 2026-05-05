import React from 'react'
import { Line, LineChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const patientData = [
    { month: 'Jan', patients: 240 },
    { month: 'Feb', patients: 280 },
    { month: 'Mar', patients: 310 },
    { month: 'Apr', patients: 350 },
    { month: 'May', patients: 380 },
    { month: 'Jun', patients: 420 },
];

const PatientsGrowth = () => {
    return (
        <div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl mb-4">Patient Growth</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={patientData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="patients" stroke="#10b981" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}

export default PatientsGrowth