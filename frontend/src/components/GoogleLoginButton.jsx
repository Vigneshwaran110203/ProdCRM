import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { post } from '../services/api';
// import { useNavigate } from 'react-router-dom';

const GoogleLoginButton = () => {

  // const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    const id_token = credentialResponse.credential;
    try {
      const response = await post(
        'http://localhost:8080/api/auth/google-login',
        { id_token },
        { withCredentials: true } // important to save cookie
      );
      console.log('Login success:', response.data);
      window.location.href = "/dashboard"
      // optionally redirect or store user data
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);
    }
  };

  const handleError = () => {
    console.error('Google Login Failed');
  };

  return (
    <div className="mt-4">
      <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
    </div>
  );
};

export default GoogleLoginButton;
