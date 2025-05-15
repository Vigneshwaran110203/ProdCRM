import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { post } from '../services/api';

const ResetPassword = () => {
  const { token } = useParams(); // Make sure route includes :token param
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords don't match");
      return;
    }

    try {
      await post(`/auth/reset-password/${token}`, { new_password: password });
      setMessage('Password reset successful. Redirecting to login...');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setMessage('Reset failed. Token may be invalid or expired.', err);
    }
  };

  return (
    <div className='min-h-screen flex justify-center items-center'>
        <div className="max-w-md mx-auto mt-10 p-6 border rounded">
          <h2 className="text-xl font-bold mb-4">Reset Password</h2>
          <form onSubmit={handleSubmit}>
              <input
              type="password"
              placeholder="New password"
              className="w-full p-2 border mb-4"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              />
              <input
              type="password"
              placeholder="Confirm password"
              className="w-full p-2 border mb-4"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              />
              <button className="bg-green-600 text-white px-4 py-2 w-full" type="submit">
              Reset Password
              </button>
          </form>
          {message && <p className="mt-4 text-sm">{message}</p>}
        </div>
    </div>
  );
};

export default ResetPassword;
