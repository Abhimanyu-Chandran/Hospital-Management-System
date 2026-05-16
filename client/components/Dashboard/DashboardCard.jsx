import { Calendar, Activity, Users, FileText } from 'lucide-react';
import React from 'react'

const DashboardCard = () => {
    return (
        <section>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>

                {/* Total Patients Card */}
                <div className='bg-white rounded-lg p-5 shadow-md flex justify-between items-center'>
                    <div>
                        <div className='text-gray-600 text-sm'>Total Patients</div>
                        <div className='text-2xl text-gray-900 mt-1'>1,284</div>
                        <div className='text-gray-500 text-xs mt-2'>+12% from last month</div>
                    </div>
                    <div>
                        <div className='bg-blue-100 p-3 rounded-lg'>
                            <Users className='w-7 h-7 text-blue-500' />
                        </div>
                    </div>
                </div>

                {/* Appointments Today Card */}
                <div className='bg-white rounded-lg p-5 shadow-md flex justify-between items-center'>
                    <div>
                        <div className='text-gray-600 text-sm'>Appointments Today</div>
                        <div className='text-2xl text-gray-900 mt-1'>48</div>
                        <div className='text-gray-500 text-xs mt-2'>12 pending</div>
                    </div>
                    <div>
                        <div className='bg-green-100 p-3 rounded-lg'>
                            <Calendar className='w-7 h-7 text-green-500' />
                        </div>
                    </div>
                </div>

                {/* Active Doctors Card */}
                <div className='bg-white rounded-lg p-5 shadow-md flex justify-between items-center'>
                    <div>
                        <div className='text-gray-600 text-sm'>Active Doctors</div>
                        <div className='text-2xl text-gray-900 mt-1'>32</div>
                        <div className='text-gray-500 text-xs mt-2'>2 on leave</div>
                    </div>
                    <div>
                        <div className='bg-purple-100 p-3 rounded-lg'>
                            <Activity className='w-7 h-7 text-purple-500' />
                        </div>
                    </div>
                </div>

                {/* Medical Records Card */}
                <div className='bg-white rounded-lg p-5 shadow-md flex justify-between items-center'>
                    <div>
                        <div className='text-gray-600 text-sm'>Medical Records</div>
                        <div className='text-2xl text-gray-900 mt-1'>3,847</div>
                        <div className='text-gray-500 text-xs mt-2'>+284 this week</div>
                    </div>
                    <div>
                        <div className='bg-orange-100 p-3 rounded-lg'>
                            <FileText className='w-7 h-7 text-orange-500' />
                        </div>
                    </div>
                </div>

            </div>
        </section >
    )
}

export default DashboardCard