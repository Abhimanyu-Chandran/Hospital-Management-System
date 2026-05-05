import { useState } from 'react'
import SideBar from './components/SideBar.jsx';
import Dashboard from './components/Dashboard/Dashboard.jsx';
import { Menu } from 'lucide-react';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <section className='flex min-h-screen'>
        <SideBar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          className='w-[300px]'
        />
        <div className='flex flex-1 flex-col'>
          <header>
            <div className='ml-4 mt-5 flex items-center'>
              {!isSidebarOpen && (
                <button
                  onClick={toggleSidebar}
                  className='p-2 rounded-lg hover:bg-gray-100 mr-4'
                >
                  <Menu className='w-6 h-6' />
                </button>
              )}
              <div>
                <p className='text-5xl text-gray-500'>Welcome to the<br /><span className='bg-linear-to-t from-sky-500 to-indigo-500 bg-clip-text text-transparent'>Hospital Management System</span></p>
              </div>
            </div>
          </header>
          <Dashboard className='flex-1' />
        </div>
      </section>
    </>
  )
}

export default App
