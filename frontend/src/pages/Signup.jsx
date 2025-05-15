import { useState } from "react";
import Logo from "../components/Logo"
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { post } from "../services/api";
import GoogleLoginButton from "../components/GoogleLoginButton";

const Signup = () => {
    
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try{
        await post("/auth/register", {username, email, password});
        navigate("/login")
    }catch (err){
        console.error(err)
    }
  }
    
  return (
    <div className='bg-[#e3f2fd] min-h-screen flex justify-center items-center'>
        <div className='bg-white rounded-xl p-10 flex justify-center items-start gap-10 max-[500px]:w-11/12 max-[500px]:p-6'>
            <div className="space-y-6">
                <div className="space-y-4">
                    <Logo />
                    <hr />
                </div>
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold">Log in to your account</h1>
                    <p>Please enter your information to access your account.</p>
                </div>
                <form onSubmit={handleRegister} className="space-y-4">
                    <div className="flex flex-col justify-start gap-2">
                        <label htmlFor="" className="font-medium">Username</label>
                        <input type="text" className="outline-none border-[1px] border-gray-200 px-3 py-2 rounded-3xl text-gray-600" value={username} onChange={(e) => setUsername(e.target.value)} required/>
                    </div>
                    <div className="flex flex-col justify-start gap-2">
                        <label htmlFor="" className="font-medium">Email</label>
                        <input type="email" className="outline-none border-[1px] border-gray-200 px-3 py-2 rounded-3xl text-gray-600" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                    </div>
                    <div className="flex flex-col justify-start gap-2">
                        <label htmlFor="" className="font-medium">Password</label>
                        <input type="email" className="outline-none border-[1px] border-gray-200 px-3 py-2 rounded-3xl text-gray-600" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                    </div>
                    <button type="submit" className="w-full bg-[#2979FF] text-white p-3 rounded-xl">Signup</button>
                </form>
                <div className="relative flex items-center">
                    <span className="w-full h-[0.5px] bg-gray-200"></span>
                    <p className="px-2 py-1 border-[1px] border-gray-200 rounded-3xl">or</p>
                    <span className="w-full h-[0.5px] bg-gray-200"></span>
                </div>
                {/* <button className="w-full bg-white border-[1px] p-3 rounded-xl flex justify-center items-center gap-4 "><span>Log in with Google</span> <FcGoogle  className="size-6"/></button> */}
                <GoogleLoginButton />
                <p className="text-center text-base">Already have an account? <Link to='/login'><span className="text-[#2979ff] font-bold">Login</span></Link></p>
            </div>
        </div>
    </div>
  )
}

export default Signup