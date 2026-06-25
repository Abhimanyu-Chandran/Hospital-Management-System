import React, { useEffect, useMemo, useState } from 'react'
import { Line, LineChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { patientAPI } from '../../services/patientsAPI.js'

const PatientsGrowth = () => {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [patients, setPatients] = useState([])

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                setLoading(true)
                setError(null)

                const data = await patientAPI.getAllPatients()
                setPatients(Array.isArray(data) ? data : [])
            } catch (err) {
                setError('Failed to fetch patients for growth chart.')
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        fetchPatients()
    }, [])

    const chartData = useMemo(() => {
        // last 6 months, labeled as MMM
        const now = new Date()
        now.setHours(0, 0, 0, 0)

        const months = Array.from({ length: 6 }, (_, i) => {
            const d = new Date(now)
            d.setMonth(now.getMonth() - (5 - i))
            d.setDate(1)

            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
            const label = d.toLocaleDateString(undefined, { month: 'short' })
            return { key, label }
        })

        const counts = new Map()
        for (const m of months) counts.set(m.key, 0)

        for (const p of patients) {
            const raw = p.createdAt || p.lastVisit
            if (!raw) continue
            const d = new Date(raw)
            if (Number.isNaN(d.getTime())) continue
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
            if (counts.has(key)) counts.set(key, (counts.get(key) ?? 0) + 1)
        }

        return months.map((m) => ({ month: m.label, patients: counts.get(m.key) ?? 0 }))
    }, [patients])

    return (
        <div>
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl mb-4">Patient Growth</h3>

                {error && <div className="text-sm text-red-700 mb-3">{error}</div>}
                {loading ? (
                    <div className="text-sm text-gray-500">Loading patients...</div>
                ) : (
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="patients" stroke="#10b981" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    )
}

export default PatientsGrowth
