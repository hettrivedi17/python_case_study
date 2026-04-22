import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const CreateJob = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    salary: '',
    jobType: 'Full-time',
    category: 'Engineering',
    deadline: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/jobs', formData);
      navigate('/jobs');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post job');
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <div className="card shadow-2xl border-0 p-10 rounded-[2.5rem]">
        <h1 className="text-3xl font-black mb-8 text-gray-800 flex items-center">
          <PlusCircle className="mr-4 text-blue-600 w-8 h-8" /> Post a New Opportunity
        </h1>
        {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-8 text-sm font-bold border border-red-100">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Position Title</label>
              <input 
                type="text" 
                className="input-field py-4" 
                placeholder="e.g. Software Engineer Intern"
                value={formData.title} 
                onChange={(e) => setFormData({...formData, title: e.target.value})} 
                required 
              />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Work Location</label>
              <input 
                type="text" 
                className="input-field py-4" 
                placeholder="e.g. Remote, Mumbai, etc."
                value={formData.location} 
                onChange={(e) => setFormData({...formData, location: e.target.value})} 
                required 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Salary / Stipend</label>
              <input 
                type="text" 
                className="input-field py-4" 
                placeholder="e.g. ₹20,000/month"
                value={formData.salary} 
                onChange={(e) => setFormData({...formData, salary: e.target.value})} 
                required 
              />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Opportunity Type</label>
              <select 
                className="input-field py-4 font-bold" 
                value={formData.jobType} 
                onChange={(e) => setFormData({...formData, jobType: e.target.value})}
              >
                <option value="Full-time">Full-time Job</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Category</label>
              <select 
                className="input-field py-4 font-bold" 
                value={formData.category} 
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option value="Engineering">Engineering</option>
                <option value="Marketing">Marketing</option>
                <option value="Design">Design</option>
                <option value="Management">Management</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Application Deadline</label>
            <input 
              type="date" 
              className="input-field py-4" 
              value={formData.deadline} 
              onChange={(e) => setFormData({...formData, deadline: e.target.value})} 
              required 
            />
          </div>

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Detailed Description</label>
            <textarea 
              className="input-field h-48 py-4" 
              placeholder="Describe roles, responsibilities, and requirements..."
              value={formData.description} 
              onChange={(e) => setFormData({...formData, description: e.target.value})} 
              required 
            ></textarea>
          </div>

          <button type="submit" className="btn btn-primary w-full py-5 font-black text-lg shadow-2xl shadow-blue-200 hover:scale-[1.02] transition-transform">
            Publish Opportunity
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateJob;
