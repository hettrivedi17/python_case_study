import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Megaphone, Send, AlertCircle } from 'lucide-react';

const CreateNotice = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    targetRole: 'all'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.post('/notices', formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post announcement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="card shadow-3xl border-0 p-12 rounded-[3rem] bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-50 rounded-full -mr-32 -mt-32 opacity-50"></div>
        
        <div className="relative z-10">
          <h1 className="text-4xl font-black mb-8 text-gray-800 flex items-center tracking-tight">
            <Megaphone className="mr-5 text-red-600 w-10 h-10" /> Post Announcement
          </h1>
          
          {error && (
            <div className="bg-red-50 text-red-600 p-6 rounded-2xl mb-10 text-sm font-bold border border-red-100 flex items-center">
              <AlertCircle className="w-5 h-5 mr-3" /> {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-10">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Announcement Title</label>
              <input 
                type="text" 
                className="input-field py-5 text-lg" 
                placeholder="e.g. Upcoming Placement Drive 2026"
                value={formData.title} 
                onChange={(e) => setFormData({...formData, title: e.target.value})} 
                required 
              />
            </div>

            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Audience Segment</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {['all', 'student', 'company'].map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setFormData({...formData, targetRole: role})}
                    className={`py-4 px-6 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border-2 ${
                      formData.targetRole === role 
                        ? 'bg-red-600 border-red-600 text-white shadow-xl shadow-red-100' 
                        : 'bg-white border-gray-100 text-gray-400 hover:border-red-200 hover:text-red-500'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Detailed Content</label>
              <textarea 
                className="input-field h-64 py-6 text-base leading-relaxed" 
                placeholder="What would you like to share with the community?"
                value={formData.content} 
                onChange={(e) => setFormData({...formData, content: e.target.value})} 
                required 
              ></textarea>
            </div>

            <div className="pt-6">
              <button 
                type="submit" 
                disabled={loading}
                className="btn btn-primary w-full py-6 font-black text-xl shadow-2xl shadow-blue-200 hover:scale-[1.02] transition-all flex items-center justify-center disabled:opacity-50"
              >
                {loading ? 'Publishing...' : (
                  <>
                    Broadcast Announcement <Send className="ml-3 w-6 h-6" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateNotice;
