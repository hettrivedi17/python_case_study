import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: ''
  });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="card shadow-2xl border-0 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-8 text-center text-white">
            <h2 className="text-3xl font-black tracking-tight">Join the Network</h2>
            <p className="text-indigo-100 mt-2 text-sm">Create your profile to start your journey</p>
          </div>
          <div className="p-8">
            {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-medium border border-red-100">
              {error}
            </div>}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Full Name</label>
                <input 
                  type="text" 
                  className="input-field bg-gray-50 border-gray-200 focus:bg-white py-3" 
                  placeholder="enter name"
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  required 
                />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Email Address</label>
                <input 
                  type="email" 
                  className="input-field bg-gray-50 border-gray-200 focus:bg-white py-3" 
                  placeholder="enter your email"
                  value={formData.email} 
                  onChange={(e) => setFormData({...formData, email: e.target.value})} 
                  required 
                />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Password</label>
                <input 
                  type="password" 
                  className="input-field bg-gray-50 border-gray-200 focus:bg-white py-3" 
                  placeholder="enter password"
                  value={formData.password} 
                  onChange={(e) => setFormData({...formData, password: e.target.value})} 
                  required 
                />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Identify As</label>
                <select 
                  className="input-field bg-gray-50 border-gray-200 focus:bg-white py-3 font-bold text-gray-700" 
                  value={formData.role} 
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  required
                >
                  <option value="" disabled>enter your credential</option>
                  <option value="student">🎓 Student</option>
                  <option value="company">🏢 Company / Recruiter</option>
                  <option value="admin">🛡️ Administrator</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary w-full py-4 font-bold shadow-lg shadow-indigo-200 mt-2 bg-indigo-600 hover:bg-indigo-700">
                Create Account
              </button>
            </form>
            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-500 font-medium">
                Already have an account? <Link to="/login" className="text-indigo-600 font-bold hover:underline">Log in here</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
