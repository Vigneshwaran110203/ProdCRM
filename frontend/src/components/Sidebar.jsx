import Logo from "../components/Logo.jsx"
import { BiLogOut } from "react-icons/bi";
import { RxDashboard } from "react-icons/rx";
import { FiUsers } from "react-icons/fi";
import { RiCustomerService2Line } from "react-icons/ri";
import { LuBox } from "react-icons/lu";
import { MdMiscellaneousServices } from "react-icons/md";
import { FiShoppingCart } from "react-icons/fi";
import { NavLink, useNavigate } from "react-router-dom";
import { get, post } from "../services/api.js";
import { GiHamburgerMenu } from "react-icons/gi";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContent.jsx";

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
  const navigate = useNavigate()
  const { auth, setAuth } = useContext(AuthContext)

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await get("/auth/check-session");
        setAuth({
          isAuthenticated: true,
          loading: false,
          id: res.data.id,
          username: res.data.name,
          email: res.data.email,
          two_fa_enabled: res.data.two_fa_enabled,
        });
      } catch {
        setAuth({ isAuthenticated: false, loading: false });
      }
    };
  
    fetchSession();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);  

  return (
    <div className={`bg-[#f0f8ff] fixed 2xl:relative top-0 left-0 z-50 ${sidebar ? "-translate-x-full 2xl:translate-x-0": "translate-x-0"} shadow-sm w-72 sm:w-80 lg:w-1/4 xl:w-96 h-screen rounded-md p-7 flex flex-col justify-between items-start`}>
        <Logo />
        <div className="space-y-8 lg:space-y-4 xl:space-y-8 w-full">
          <span className="text-xl font-semibold text-[#2979FF]">MENU</span>
          <div className="2xl:space-y-4">
            <NavLink to="/dashboard" end className={linkClass}><RxDashboard /> Dashboard</NavLink>
            <NavLink to="/dashboard/customers" className={linkClass}><FiUsers /> Customers</NavLink>
            <NavLink to="/dashboard/employees" className={linkClass}><RiCustomerService2Line /> Employees</NavLink>
            <NavLink to="/dashboard/products" className={linkClass}><LuBox /> Products</NavLink>
            <NavLink to="/dashboard/services" className={linkClass}><MdMiscellaneousServices /> Services</NavLink>
            <NavLink to="/dashboard/orders" className={linkClass}><FiShoppingCart /> Orders</NavLink>
            <div className="flex flex-col gap-2">
              {auth.two_fa_enabled ? (
                <p className="text-green-600">2FA is already enabled</p>
              ) : (
                <button
                  onClick={() => navigate("/setup-2fa")}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                  Enable 2FA
                </button>
              )}
              <button
                  onClick={() => navigate("/reset-2fa")}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                  Reset 2FA
              </button>
            </div>
          </div>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-4 bg-[#2979ff] p-2 w-full text-white text-lg justify-center rounded-md"><span>Logout</span> <BiLogOut /></button>
        <GiHamburgerMenu className="bg-white 2xl:hidden cursor-pointer p-2 text-4xl absolute top-6 md:top-8 left-[100%] ml-6" onClick={()=>setSidebar(!sidebar)}/>
    </div>
  )
}

export default Sidebar