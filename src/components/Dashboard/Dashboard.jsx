import DashboardCard from './DashboardCard';
import PatientsGrowth from './PatientsGrowth';
import RecentAppointments from './RecentAppointments';
import WeeklyAppointments from './WeeklyAppointments';

const Dashboard = () => {
    return (
        <section className='h-screen pt-5 mr-2'>
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