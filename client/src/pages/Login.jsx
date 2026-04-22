import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="card shadow-2xl border-0 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-center text-white">
            <h2 className="text-3xl font-black tracking-tight">Welcome Back</h2>
            <p className="text-blue-100 mt-2 text-sm">Login to access your placement dashboard</p>
          </div>
          <div className="p-8">
            {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-medium border border-red-100 flex items-center">
              <span className="mr-2">⚠️</span> {error}
            </div>}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Email Address</label>
                <input 
                  type="email" 
                  className="input-field bg-gray-50 border-gray-200 focus:bg-white py-3" 
                  placeholder="enter your email"
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Password</label>
                <input 
                  type="password" 
                  className="input-field bg-gray-50 border-gray-200 focus:bg-white py-3" 
                  placeholder="enter password"
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                />
              </div>
              <button type="submit" className="btn btn-primary w-full py-4 font-bold shadow-lg shadow-blue-200 mt-2">
                Sign In
              </button>
            </form>
            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-500 font-medium">
                New to the platform? <Link to="/register" className="text-blue-600 font-bold hover:underline">Create an account</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
