import React from 'react';
import { User } from 'lucide-react';

const HomePage = () => {
    return (
        <section className="flex flex-col min-h-screen">
            {/* Page header */}
            <header className="bg-white backdrop-blur border-b border-gray-200 px-5 mx-5 mt-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="max-w-6xl mx-auto px-4 py-8">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-sm text-gray-500 pl-19">Care • Coordination • Confidence</p>
                            <div className='flex items-center'>
                                <img src="./client/components/hms-logo.png" alt="HMS logo" className="w-15 h-15 border border-gray-200 rounded-lg mt-2 mr-4" />
                                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-1">
                                    Hospital Management System
                                </h1>
                            </div>
                            <p className="text-gray-600 mt-2 pl-19">
                                Manage appointments, patients, doctors, and medical records—built for real-world workflows.
                            </p>
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
                        </div>

                        <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 sm:p-8">
                            <div className="rounded-xl p-5 border border-gray-200">
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
                <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                        <p className="font-semibold text-gray-900">HMS</p>
                        <p className="text-sm text-gray-600">Hospital Management System</p>
                    </div>
                    <div className="text-sm text-gray-600">
                        Built By Abhimanyu Chandran •
                    </div>
                </div>
            </footer>
        </section >
    );
};

export default HomePage;
