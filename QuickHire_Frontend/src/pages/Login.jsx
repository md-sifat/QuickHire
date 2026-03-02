import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthProvider';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';


const Login = () => {
  const { login, googleLogin, adminLogin, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', username: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isAdminMode) {
        await adminLogin(formData.username, formData.password);
        toast.success('Admin login successful!');
        navigate('/admin/dashboard');
      } else {
        await login(formData.email, formData.password);
        toast.success('Login successful!');
        navigate('/');
      }
    } catch (err) {
      toast.error(err.message || 'Login failed');
    }
  };

  const handleGoogle = async () => {
    try {
      await googleLogin();
      toast.success('Google login successful!');
      navigate('/');
    } catch (err) {
      toast.error('Google login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="w-full max-w-md p-8 bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/30">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          {isAdminMode ? 'Admin Login' : 'Welcome Back'}
        </h2>

        <div className="flex justify-center mb-6">
          <button
            onClick={() => setIsAdminMode(false)}
            className={`px-6 py-2 rounded-l-full font-medium transition-all ${
              !isAdminMode ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            User Login
          </button>
          <button
            onClick={() => setIsAdminMode(true)}
            className={`px-6 py-2 rounded-r-full font-medium transition-all ${
              isAdminMode ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Admin Login
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {isAdminMode ? (
            <>
              <input
                name="username"
                type="text"
                placeholder="Admin Username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <input
                name="password"
                type="password"
                placeholder="Admin Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </>
          ) : (
            <>
              <input
                name="email"
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition shadow-md"
          >
            {isAdminMode ? 'Login as Admin' : 'Login'}
          </button>
        </form>

        {!isAdminMode && (
          <>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <button
              onClick={handleGoogle}
              className="w-full py-3 bg-white border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition flex items-center justify-center gap-3 shadow-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.51h5.84c-.25 1.31-.98 2.42-2.07 3.16v2.63h3.35c1.96-1.81 3.09-4.46 3.09-7.25z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-1.01 7.28-2.73l-3.35-2.63c-1.01.68-2.29 1.08-3.93 1.08-3.02 0-5.58-2.04-6.49-4.79H.96v2.67C2.77 20.39 6.62 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.51 14.21c-.23-.68-.36-1.41-.36-2.21s.13-1.53.36-2.21V7.34H.96C.35 8.85 0 10.39 0 12s.35 3.15.96 4.66l4.55-2.45z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.98c1.64 0 3.11.56 4.27 1.66l3.19-3.19C17.46 1.01 14.97 0 12 0 6.62 0 2.77 2.61.96 6.34l4.55 2.45C6.42 6.02 8.98 4.98 12 4.98z"
                />
              </svg>
              Login with Google
            </button>
          </>
        )}

        {!isAdminMode && (
          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-indigo-600 font-medium hover:underline">
              Sign Up
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;