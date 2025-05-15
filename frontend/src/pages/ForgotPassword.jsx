/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { post } from '../services/api';

const ForgotPassword = () => {

  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('')

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await post('/auth/forgot-password', { email });
      setMessage(res.data.message || 'Reset link sent. Check your email.');
    } catch (err) {
      setMessage('Failed to send reset link.');
    }
  };

  return (
    <div className='min-h-screen flex justify-center items-center'>
        <div className='max-w-md mx-auto mt-10 p-6 border rounded space-y-8'>
            <h2 className='text-2xl font-semibold'>Forgot Password</h2>
            <form onSubmit={handleSubmit}>
                <input
                type="email"
                placeholder="Enter your email"
                className="w-full p-2 border mb-4"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                />
                <button className="bg-blue-600 text-white px-4 py-2 w-full rounded-md" type="submit">
                    Send Reset Link
                </button>
            </form>
            {message && <p className="mt-4 text-sm">{message}</p>}
        </div>
    </div>
  )
}

export default ForgotPassword