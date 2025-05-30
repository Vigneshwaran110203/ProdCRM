import React, { useContext } from 'react'
import Sidebar from '../components/Sidebar'
import { Outlet } from 'react-router-dom'
import { FaRegUserCircle } from "react-icons/fa";
import { AuthContext } from '../context/AuthContent';

const DashboardPage = () => {

  const { auth } = useContext(AuthContext)

  return (
    <div className="bg-[#ffffff] h-screen flex">
        <Sidebar />
        <div className='flex-1 overflow-y-scroll'>
          <div className="border-b-[1px] border-gray-200 p-6 flex justify-end items-center">
            <div className="flex items-center gap-4">
              <FaRegUserCircle className='text-2xl'/>
              <span className='text-lg'>Hi, {auth.username}</span>
            </div>
          </div>
          <Outlet />
        </div>
    </div>
  )
}

export default DashboardPage