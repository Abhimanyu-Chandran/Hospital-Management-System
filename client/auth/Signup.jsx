import { SignUp } from '@clerk/react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

const Signup = () => {
    return (
        <div className="flex-1 flex flex-col justify-center items-center relative min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-tr from-sky-100 via-blue-50 to-indigo-100">
            {/* Back to Home Link */}
            <div className="absolute top-6 left-6">
                <Link to="/" className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-sky-600 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                </Link>
            </div>
            
            <div className="w-full max-w-md flex flex-col items-center">
                {/* Brand Header */}
                <div className="flex items-center gap-3 mb-6">
                    <img src="/assets/logo.png" alt="HMS logo" className="w-10 h-10 border border-gray-200 rounded-lg shadow-sm animate-pulse" />
                    <span className="text-xl font-bold bg-linear-to-t from-sky-500 to-indigo-500 bg-clip-text text-transparent">HMS Admin Portal</span>
                </div>
                
                {/* Clerk Card Container */}
                <div className="shadow-2xl rounded-2xl overflow-hidden hover:shadow-sky-200/50 transition-shadow duration-300">
                    <SignUp 
                        signInUrl="/login" 
                        forceRedirectUrl="/dashboard" 
                    />
                </div>
            </div>
        </div>
    )
}

export default Signup