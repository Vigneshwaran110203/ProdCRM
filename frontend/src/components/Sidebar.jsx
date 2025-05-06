import Logo from "../components/Logo.jsx"
import { BiLogOut } from "react-icons/bi";
import { RxDashboard } from "react-icons/rx";
import { FiUsers } from "react-icons/fi";
import { RiCustomerService2Line } from "react-icons/ri";
import { LuBox } from "react-icons/lu";
import { MdMiscellaneousServices } from "react-icons/md";
import { FiShoppingCart } from "react-icons/fi";
import { NavLink } from "react-router-dom";

const Sidebar = () => {

  const linkClass = ({ isActive }) => `flex items-center gap-4 p-3 text-lg rounded-md ${ isActive ? "bg-[#2979ff] text-white" : "text-gray-800"}`

  return (
    <div className="bg-[#F0F8FF] shadow-sm w-1/6 h-screen rounded-md p-7 flex flex-col justify-between items-start">
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
        <button className="flex items-center gap-4 bg-[#2979ff] p-2 w-full text-white text-lg justify-center rounded-md"><span>Logout</span> <BiLogOut /></button>
    </div>
  )
}

export default Sidebar