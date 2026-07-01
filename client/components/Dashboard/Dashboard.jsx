
import DashboardCard from './DashboardCard';
import PatientsGrowth from './PatientsGrowth';
import RecentAppointments from './RecentAppointments';
import WeeklyAppointments from './WeeklyAppointments';

const Dashboard = () => {
    return (
        <section className='pt-5 p-5'>
            <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm hover:shadow-md transition-all duration-300 rounded-xl bg-white p-6 mb-6'>
                <div>
                    <h1 className='text-3xl font-extrabold text-gray-900'>Dashboard</h1>
                    <p className='text-gray-500 mt-1 text-sm'>Review patient growth and appointments</p>
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