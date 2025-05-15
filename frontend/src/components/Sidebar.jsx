import Logo from "../components/Logo.jsx"
import { BiLogOut } from "react-icons/bi";
import { RxDashboard } from "react-icons/rx";
import { FiUsers } from "react-icons/fi";
import { RiCustomerService2Line } from "react-icons/ri";
import { LuBox } from "react-icons/lu";
import { MdMiscellaneousServices } from "react-icons/md";
import { FiShoppingCart } from "react-icons/fi";
import { NavLink } from "react-router-dom";
import { post } from "../services/api.js";
import { GiHamburgerMenu } from "react-icons/gi";
import { useState } from "react";

const Sidebar = () => {

  const linkClass = ({ isActive }) => `flex items-center gap-4 p-3 text-lg rounded-md ${ isActive ? "bg-[#2979ff] text-white" : "text-gray-800"}`
  const handleLogout = async () => {
    try {
      await post('/auth/logout');
      window.location.href = '/login';
    } catch (err) {
      console.error('Logout failed', err);
    }
  };
  
  const [sidebar, setSidebar] = useState(false)

  return (
    <div className={`bg-[#f0f8ff] fixed top-0 left-0 z-50 ${sidebar ? "-translate-x-full": "translate-x-0"} shadow-sm w-72 sm:w-80 lg:w-1/4 xl:w-96 h-screen rounded-md p-7 flex flex-col justify-between items-start`}>
        <Logo />
        <div className="space-y-8 w-full">
          <span className="text-xl font-semibold text-[#2979FF]">MENU</span>
          <div className="space-y-4">
            <NavLink to="/dashboard" end className={linkClass}><RxDashboard /> Dashboard</NavLink>
            <NavLink to="/dashboard/customers" className={linkClass}><FiUsers /> Customers</NavLink>
            <NavLink to="/dashboard/employees" className={linkClass}><RiCustomerService2Line /> Employees</NavLink>
            <NavLink to="/dashboard/products" className={linkClass}><LuBox /> Products</NavLink>
            <NavLink to="/dashboard/services" className={linkClass}><MdMiscellaneousServices /> Services</NavLink>
            <NavLink to="/dashboard/orders" className={linkClass}><FiShoppingCart /> Orders</NavLink>
          </div>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-4 bg-[#2979ff] p-2 w-full text-white text-lg justify-center rounded-md"><span>Logout</span> <BiLogOut /></button>
        <GiHamburgerMenu className="bg-white cursor-pointer p-2 text-4xl absolute top-8 left-[100%] ml-6" onClick={()=>setSidebar(!sidebar)}/>
    </div>
  )
}

export default Sidebar