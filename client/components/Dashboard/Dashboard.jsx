import { Plus } from 'lucide-react';

import DashboardCard from './DashboardCard';
import PatientsGrowth from './PatientsGrowth';
import RecentAppointments from './RecentAppointments';
import WeeklyAppointments from './WeeklyAppointments';

const Dashboard = () => {
    return (
        <section className='pt-5 mr-2'>
            <div className='flex items-center justify-between shadow-md rounded-md p-3 mb-3'>
                <div>
                    <p className='text-2xl'>Dashboard</p>
                    <p>Review patient growth and appointments</p>
                </div>
            </div>
            <DashboardCard />
            <div className='grid grid-cols-2 gap-4 mt-4'>
                <WeeklyAppointments />
                <PatientsGrowth />
            </div>
            <RecentAppointments />
        </section>
    )
}

export default Dashboard