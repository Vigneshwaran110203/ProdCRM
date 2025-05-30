/* eslint-disable no-unused-vars */
import { useState } from "react";
import { post } from "../services/api";
import { useNavigate } from "react-router-dom";

const Reset2FA = () => {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await post("/auth/reset-2fa", { password });
      alert("2FA has been disabled");
      navigate("/dashboard");
    } catch (err) {
      console.log("Invalid password or session", err);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form onSubmit={handleReset} className="bg-white p-10 rounded shadow space-y-6">
        <h2 className="text-xl font-bold">Disable Two-Factor Authentication</h2>
        <p className="text-sm text-gray-600">Enter your password to confirm:</p>
        <input
          type="password"
          placeholder="Your current password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border px-4 py-2 rounded"
          required
        />
        <button type="submit" className="w-full bg-red-600 text-white py-2 rounded">
          Disable 2FA
        </button>
      </form>
    </div>
  );
};

export default Reset2FA;
