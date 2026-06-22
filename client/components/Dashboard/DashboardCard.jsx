import { Calendar, Activity, Users, FileText } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { patientAPI } from '../../services/patientsAPI.js';
import { appointmentsAPI } from '../../services/appointmentsAPI.js';
import { doctorAPI } from '../../services/doctorsAPI.js';
import { medicalRecordAPI } from '../../services/medicalRecordsAPI.js';

const toISODate = (value) => {
    if (!value) return '';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '';
    return d.toISOString().split('T')[0];
};

const DashboardCard = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [patientsCount, setPatientsCount] = useState(0);
    const [appointmentsTodayCount, setAppointmentsTodayCount] = useState(0);
    const [activeDoctorsCount, setActiveDoctorsCount] = useState(0);
    const [medicalRecordsCount, setMedicalRecordsCount] = useState(0);

    const todayISO = useMemo(() => new Date().toISOString().split('T')[0], []);

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                setLoading(true);
                setError(null);

                const [patientsData, appointmentsData, doctorsData, recordsData] =
                    await Promise.all([
                        patientAPI.getAllPatients(),
                        appointmentsAPI.getAllAppointments(),
                        doctorAPI.getAllDoctors(),
                        medicalRecordAPI.getAllMedicalRecords(),
                    ]);

                const patientsArr = Array.isArray(patientsData) ? patientsData : [];
                const appointmentsArr = Array.isArray(appointmentsData) ? appointmentsData : [];
                const doctorsArr = Array.isArray(doctorsData) ? doctorsData : [];
                const recordsArr = Array.isArray(recordsData) ? recordsData : [];

                setPatientsCount(patientsArr.length);
                setMedicalRecordsCount(recordsArr.length);

                const todays = appointmentsArr.filter((a) => toISODate(a.date) === todayISO);
                setAppointmentsTodayCount(todays.length);

                const active = doctorsArr.filter((d) => {
                    const availability = Array.isArray(d.availability) ? d.availability : [];
                    return availability.some((slot) => slot?.status === 'Available');
                });
                setActiveDoctorsCount(active.length);
            } catch (err) {
                console.error(err);
                setError('Failed to load dashboard metrics');
            } finally {
                setLoading(false);
            }
        };

        fetchCounts();
    }, [todayISO]);

    const showValue = (value) => (loading ? '—' : value?.toLocaleString?.() ?? String(value));

    return (
        <section>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                {/* Total Patients Card */}
                <div className='bg-white rounded-lg p-5 shadow-md flex justify-between items-center shadow-sm hover:shadow-md transition-shadow'>
                    <div>
                        <div className='text-gray-600 text-sm'>Total Patients</div>
                        <div className='text-2xl text-gray-900 mt-1'>{showValue(patientsCount)}</div>
                        <div className='text-gray-500 text-xs mt-2'>Live from database</div>
                    </div>
                    <div>
                        <div className='bg-blue-100 p-3 rounded-lg'>
                            <Users className='w-7 h-7 text-blue-500' />
                        </div>
                    </div>
                </div>

                {/* Appointments Today Card */}
                <div className='bg-white rounded-lg p-5 shadow-md flex justify-between items-center shadow-sm hover:shadow-md transition-shadow'>
                    <div>
                        <div className='text-gray-600 text-sm'>Appointments Today</div>
                        <div className='text-2xl text-gray-900 mt-1'>{showValue(appointmentsTodayCount)}</div>
                        <div className='text-gray-500 text-xs mt-2'>For {todayISO}</div>
                    </div>
                    <div>
                        <div className='bg-green-100 p-3 rounded-lg'>
                            <Calendar className='w-7 h-7 text-green-500' />
                        </div>
                    </div>
                </div>

                {/* Active Doctors Card */}
                <div className='bg-white rounded-lg p-5 shadow-md flex justify-between items-center shadow-sm hover:shadow-md transition-shadow'>
                    <div>
                        <div className='text-gray-600 text-sm'>Active Doctors</div>
                        <div className='text-2xl text-gray-900 mt-1'>{showValue(activeDoctorsCount)}</div>
                        <div className='text-gray-500 text-xs mt-2'>Availability: Available</div>
                    </div>
                    <div>
                        <div className='bg-purple-100 p-3 rounded-lg'>
                            <Activity className='w-7 h-7 text-purple-500' />
                        </div>
                    </div>
                </div>

                {/* Medical Records Card */}
                <div className='bg-white rounded-lg p-5 shadow-md flex justify-between items-center shadow-sm hover:shadow-md transition-shadow'>
                    <div>
                        <div className='text-gray-600 text-sm'>Medical Records</div>
                        <div className='text-2xl text-gray-900 mt-1'>{showValue(medicalRecordsCount)}</div>
                        <div className='text-gray-500 text-xs mt-2'>Total in database</div>
                    </div>
                    <div>
                        <div className='bg-orange-100 p-3 rounded-lg'>
                            <FileText className='w-7 h-7 text-orange-500' />
                        </div>
                    </div>
                </div>
            </div>

            {error && (
                <div className='mt-3 bg-red-50 text-red-700 border border-red-200 rounded-md px-4 py-3 text-sm'>
                    {error}
                </div>
            )}
        </section>
    );
};

export default DashboardCard;

