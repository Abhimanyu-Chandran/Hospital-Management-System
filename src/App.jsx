import { useState } from 'react'
import SideBar from './components/SideBar.jsx';
import Header from './components/Header.jsx';

function App() {
  return (
    <>
      <section className='flex flex-row-reverse'>
        <Header />
        <SideBar />
      </section>
    </>
  )
}

export default App
