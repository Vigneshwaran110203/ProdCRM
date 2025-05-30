import React, { useEffect, useState } from 'react'
import { get } from '../services/api'
import { FiUsers } from "react-icons/fi";
import { RiCustomerService2Line } from "react-icons/ri";
import { LuBox } from "react-icons/lu";
import { MdMiscellaneousServices } from "react-icons/md";
import { FiShoppingCart } from "react-icons/fi";
import { MdCurrencyRupee } from "react-icons/md";
import { CustomerGrowthChart, OrderStatusChart, RevenueChart, TopProductsChart } from '../components/DashboardGraph';

const DashboardHome = () => {

  const [stats, setStats] = useState(null)

  useEffect(()=>{
    get("/dashboard").then((res)=> setStats(res.data)).catch((err) => console.error("Dashboard Error: ", err))
  }, [])

  if (!stats) return <p>Loading...</p>

  return (
    <div className='p-8'>
        <h1 className='text-3xl font-semibold uppercase'>Dashboard</h1>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 pt-12 gap-x-12 lg:gap-x-8 xl:gap-x-12 gap-y-8'>
            <div className='p-4 border-[1px] rounded-md flex flex-col justify-start items-start gap-8'>
                <span className='text-xl font-medium'>Total Customers</span>
                <div className='flex items-center justify-center gap-4'>
                    <div className='bg-orange-200 p-4 rounded-full text-orange-700'>
                        <FiUsers className="text-xl" />
                    </div>
                    <p className="text-lg text-gray-800 font-semibold">{stats.totals.customers}</p>
                </div>
            </div>
            <div className='p-4 border-[1px] rounded-md flex flex-col justify-start items-start gap-8'>
                <span className='text-xl font-medium'>Total Employees</span>
                <div className='flex items-center justify-center gap-4'>
                    <div className='bg-purple-200 p-4 rounded-full text-purple-700'>
                        <RiCustomerService2Line className="text-xl" />
                    </div>
                    <p className="text-lg text-gray-800 font-semibold">{stats.totals.employees}</p>
                </div>
            </div>
            <div className='p-4 border-[1px] rounded-md flex flex-col justify-start items-start gap-8'>
                <span className='text-xl font-medium'>Product Sales</span>
                <div className='flex items-center justify-center gap-4'>
                    <div className='bg-blue-200 p-4 rounded-full text-blue-700'>
                        <LuBox className="text-xl" />
                    </div>
                    <p className="text-lg text-gray-800 font-semibold">{stats.totals.products}</p>
                </div>
            </div>
            <div className='p-4 border-[1px] rounded-md flex flex-col justify-start items-start gap-8'>
                <span className='text-xl font-medium'>Service Used</span>
                <div className='flex items-center justify-center gap-4'>
                    <div className='bg-red-200 p-4 rounded-full text-red-700'>
                        <MdMiscellaneousServices className="text-xl" />
                    </div>
                    <p className="text-lg text-gray-800 font-semibold">{stats.totals.services}</p>
                </div>
            </div>
            <div className='p-4 border-[1px] rounded-md flex flex-col justify-start items-start gap-8'>
                <span className='text-xl font-medium'>Total Orders</span>
                <div className='flex items-center justify-center gap-4'>
                    <div className='bg-pink-200 p-4 rounded-full text-pink-700'>
                        <FiShoppingCart className="text-xl" />
                    </div>
                    <p className="text-lg text-gray-800 font-semibold">{stats.totals.orders}</p>
                </div>
            </div>
            <div className='p-4 border-[1px] rounded-md flex flex-col justify-start items-start gap-8'>
                <span className='text-xl font-medium'>Total Revenue</span>
                <div className='flex items-center justify-center gap-4'>
                    <div className='bg-yellow-200 p-4 rounded-full text-yellow-700'>
                        <MdCurrencyRupee className="text-xl" />
                    </div>
                    <p className="text-lg text-gray-800 font-semibold">{stats.totals.total_revenue}</p>
                </div>
            </div>
        </div>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-12 lg:gap-x-8 xl:gap-x-12 gap-y-8 lg:gap-y-14 pt-12 mb-8'>
            <RevenueChart data={stats.monthly_revenue} />
            <CustomerGrowthChart data={stats.customer_growth} />
            <OrderStatusChart data={stats.orders_by_status} />
            <TopProductsChart data={stats.top_selling_products} />
        </div>
    </div>
  )
}

export default DashboardHome