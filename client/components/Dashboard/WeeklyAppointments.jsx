import { useEffect, useMemo, useState } from 'react'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { appointmentsAPI } from '../../services/appointmentsAPI.js'

const toISODate = (value) => {
    if (!value) return ''
    const d = new Date(value)
    if (Number.isNaN(d.getTime())) return ''
    return d.toISOString().split('T')[0]
}

const WeeklyAppointments = () => {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [appointments, setAppointments] = useState([])

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                setLoading(true)
                setError(null)

                const data = await appointmentsAPI.getAllAppointments()
                setAppointments(Array.isArray(data) ? data : [])
            } catch (err) {
                setError('Failed to fetch appointments for chart.')
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        fetchAppointments()
    }, [])

    const chartData = useMemo(() => {
        // last 7 days, labeled by weekday
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const days = Array.from({ length: 7 }, (_, i) => {
            const d = new Date(today)
            d.setDate(today.getDate() - (6 - i))
            return {
                iso: d.toISOString().split('T')[0],
                label: d.toLocaleDateString(undefined, { weekday: 'short' }),
            }
        })

        const countsByISO = new Map()
        for (const day of days) countsByISO.set(day.iso, 0)

        for (const a of appointments) {
            const iso = toISODate(a.date)
            if (!iso) continue
            if (countsByISO.has(iso)) {
                countsByISO.set(iso, (countsByISO.get(iso) ?? 0) + 1)
            }
        }

        return days.map((d) => ({ name: d.label, appointments: countsByISO.get(d.iso) ?? 0 }))
    }, [appointments])

    return (
        <section>
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl mb-4">Weekly Appointments</h3>

                {error && <div className="text-sm text-red-700 mb-3">{error}</div>}
                {loading ? (
                    <div className="text-sm text-gray-500">Loading appointments...</div>
                ) : (
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="appointments" fill="#3b82f6" />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>
        </section>
    )
}

export default WeeklyAppointments
