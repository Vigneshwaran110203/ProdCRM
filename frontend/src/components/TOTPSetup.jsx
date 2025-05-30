import { useEffect, useState } from "react";
import { get, post } from "../services/api";
import QRCode from "react-qr-code";
import { useNavigate } from "react-router-dom";

const TOTPSetup = () => {
  const [otpUrl, setOtpUrl] = useState("");
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOtpUrl = async () => {
      try {
        const res = await get("/auth/setup-2fa");
        console.log(res)
        setOtpUrl(res.data.otp_auth_url);
      } catch (err) {
        console.error("Failed to fetch QR URL", err);
      }
    };

    fetchOtpUrl();
  }, []);

  const handleEnable = async (e) => {
    e.preventDefault();
    try {
      await post("/auth/enable-2fa", { code });
      alert("2FA enabled successfully");
      navigate("/dashboard");
    } catch (err) {
      alert("Invalid code", err);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#f4f6f8]">
      <div className="bg-white p-10 rounded-xl shadow-md space-y-6">
        <h2 className="text-2xl font-bold">Set up Two-Factor Authentication</h2>
        <p>Scan the QR code below using Google Authenticator or Authy.</p>
        {otpUrl && (
            <div style={{ background: 'white', padding: '16px' }}>
                <QRCode value={otpUrl} className="mx-auto"/>
            </div>
        )}
        <form onSubmit={handleEnable} className="space-y-4">
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
            Enable 2FA
          </button>
        </form>
      </div>
    </div>
  );
};

export default TOTPSetup;
