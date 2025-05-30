import { useState } from "react";
import { post } from "../services/api";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContent";

const Verify2FAForm = () => {
  const [code, setCode] = useState("");
  const { setAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const admin_id = Number(sessionStorage.getItem("pending_2fa_admin"));
      await post("/auth/verify-2fa", { code, admin_id });
      sessionStorage.removeItem("pending_2fa_admin");
      setAuth({ isAuthenticated: true, loading: false });
      navigate("/dashboard");
    } catch (err) {
      console.log(code)
      console.log("Invalid 2FA code", err);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#f4f6f8]">
      <form onSubmit={handleVerify} className="bg-white p-10 rounded-xl shadow-md space-y-6">
        <h2 className="text-2xl font-bold">Verify 2FA Code</h2>
        <input
          type="text"
          placeholder="Enter 6-digit code"
          className="w-full border px-4 py-2 rounded-lg"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg"
        >
          Verify & Login
        </button>
      </form>
    </div>
  );
};

export default Verify2FAForm;