import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthProvider';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { login, googleLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    login(email, password)
      .then(() => navigate('/'))
      .catch(err => console.error(err));
  };

  const handleGoogle = () => {
    googleLogin()
      .then(() => navigate('/'))
      .catch(err => console.error(err));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6">Login</h2>
        <input name="email" type="email" placeholder="Email" className="border p-2 w-full mb-4" required />
        <input name="password" type="password" placeholder="Password" className="border p-2 w-full mb-4" required />
        <button type="submit" className="bg-purple-600 text-white p-2 w-full">Login</button>
        <button type="button" onClick={handleGoogle} className="bg-blue-600 text-white p-2 w-full mt-4">Login with Google</button>
      </form>
    </div>
  );
};

export default Login;