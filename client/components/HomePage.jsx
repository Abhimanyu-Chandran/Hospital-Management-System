import { LogIn, UserPlus, LayoutDashboard, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth, UserButton } from '@clerk/react';

const HomePage = () => {
    const { isSignedIn, isLoaded } = useAuth();

    return (
        <section className="flex flex-col min-h-screen">
            {/* Page header */}
            <header className="bg-white/90 backdrop-blur-md border border-gray-200 px-5 mx-5 mt-5 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                <div className="max-w-7xl mx-auto py-6">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
                        <div>
                            <p className="text-xs font-semibold tracking-wider text-sky-600 uppercase pl-0 sm:pl-19">Care • Coordination • Confidence</p>
                            <div className='flex flex-col sm:flex-row items-center mt-2'>
                                <img src="/assets/logo.png" alt="HMS logo" className="w-15 h-15 border border-gray-200 rounded-lg mr-0 sm:mr-4 mb-2 sm:mb-0" />
                                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 text-center sm:text-left">
                                    Hospital Management System
                                </h1>
                            </div>
                            <p className="text-gray-600 mt-2 text-sm text-center sm:text-left sm:pl-19">
                                Manage appointments, patients, doctors, and medical records—built for real-world workflows.
                            </p>
                        </div>

                        {/* Auth actions inside header */}
                        <div className="flex items-center gap-3 self-center sm:self-start sm:mt-8">
                            {isLoaded && (
                                isSignedIn ? (
                                    <>
                                        <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-linear-to-t from-sky-500 to-indigo-500 rounded-lg shadow-md hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all">
                                            <LayoutDashboard className="w-4 h-4" />
                                            Go to Dashboard
                                        </Link>
                                        <div className="border-l border-gray-200 pl-3 h-8 flex items-center">
                                            <UserButton afterSignOutUrl="/" />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <Link to="/login" className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 hover:text-sky-600 transition-all">
                                            <LogIn className="w-4 h-4" />
                                            Login
                                        </Link>
                                        <Link to="/signup" className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-linear-to-t from-sky-500 to-indigo-500 rounded-lg shadow-md hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all">
                                            <UserPlus className="w-4 h-4" />
                                            Signup
                                        </Link>
                                    </>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero */}
            <main className="flex-1">
                <div className="w-full px-4 py-8">
                    <div className="grid md:grid-cols-2 gap-6 items-center">
                        <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 sm:p-14">
                            <h2 className="text-2xl font-semibold text-gray-900">
                                Designed to keep your hospital running smoothly
                            </h2>
                            <p className="text-gray-600 mt-3">
                                From weekly appointment trends to patient growth—everything is organized and accessible in one place.
                            </p>

                            <div className="mt-6 grid sm:grid-cols-2 gap-4">
                                <div className="bg-white rounded-lg border border-gray-200 p-4">
                                    <p className="text-sm text-gray-500">Fast scheduling</p>
                                    <p className="font-semibold text-gray-900">Appointments</p>
                                </div>
                                <div className="bg-white rounded-lg border border-gray-200 p-4">
                                    <p className="text-sm text-gray-500">Patient records</p>
                                    <p className="font-semibold text-gray-900">Medical history</p>
                                </div>
                                <div className="bg-white rounded-lg border border-gray-200 p-4">
                                    <p className="text-sm text-gray-500">Doctor availability</p>
                                    <p className="font-semibold text-gray-900">Coverage planning</p>
                                </div>
                                <div className="bg-white rounded-lg border border-gray-200 p-4">
                                    <p className="text-sm text-gray-500">Operational metrics</p>
                                    <p className="font-semibold text-gray-900">At-a-glance stats</p>
                                </div>
                            </div>

                            {/* Hero Actions */}
                            <div className="mt-8 flex flex-col sm:flex-row gap-4 border-t border-gray-100 pt-6">
                                {isLoaded && (
                                    !isSignedIn && (
                                        <>
                                            <Link to="/signup" className="flex items-center justify-center gap-2 px-6 py-3 font-semibold text-white bg-linear-to-t from-sky-500 to-indigo-500 rounded-lg shadow-lg hover:opacity-95 hover:scale-[1.02] transition-all">
                                                Get Started
                                                <ArrowRight className="w-5 h-5" />
                                            </Link>
                                            <Link to="/login" className="flex items-center justify-center gap-2 px-6 py-3 font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-all">
                                                Sign In
                                            </Link>
                                        </>
                                    )
                                )}
                            </div>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 sm:p-11">
                            <div className="rounded-xl p-5">
                                <p className="text-sm opacity-90">Smart system overview</p>
                                <h3 className="text-xl font-semibold mt-2">Your command center</h3>
                                <ul className="mt-4 space-y-3">
                                    <li className="flex items-start gap-3">
                                        <span className="mt-2 w-2 h-2 rounded-full bg-black/90" />
                                        <span className="text-sm">Weekly appointment insights based on database records.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="mt-2 w-2 h-2 rounded-full bg-black/90" />
                                        <span className="text-sm">Patient growth analytics powered by createdAt timestamps.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="mt-2 w-2 h-2 rounded-full bg-black/90" />
                                        <span className="text-sm">Recent appointments table for quick follow-ups.</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="flex flex-col mt-5 gap-3">
                                <div className="flex items-center justify-between border border-gray-200 rounded-lg px-4 py-3 bg-white">
                                    <div>
                                        <p className="text-sm text-gray-500">Seamless access</p>
                                        <p className="font-semibold text-gray-900">Dashboard & records</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between border border-gray-200 rounded-lg px-4 py-3 bg-white">
                                    <div>
                                        <p className="text-sm text-gray-500">Data-driven</p>
                                        <p className="font-semibold text-gray-900">From MongoDB</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Page footer */}
            <footer className="border border-gray-200 bg-white mb-5 mx-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                        <p className="font-semibold text-gray-900">HMS</p>
                        <p className="text-sm text-gray-600">Hospital Management System</p>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="text-sm text-gray-600">
                            Built By Abhimanyu Chandran
                        </div>
                        <div className='px-2'>
                            •
                        </div>
                        <a href="https://github.com/Abhimanyu-Chandran/Hospital-Management-System" target='_blank'>
                            <img src="public\assets\github.webp" className="w-9 h-9"></img>
                        </a>
                        <div className='pl-2'>
                            •
                        </div>
                        <a href="https://www.linkedin.com/in/abhimanyuchandran/" target='_blank'>
                            <img src="public\assets\linkedin.jpg" className="w-13 h-13"></img>
                        </a>
                    </div>
                </div>
            </footer>
        </section>
    );
};

export default HomePage;
