import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Megaphone, Trash2, PlusCircle, Send, AlertCircle, Calendar, User } from 'lucide-react';

const ManageNotices = () => {
  const { user } = useAuth();
  const [notices, setNotices] = useState([]);
  const [formData, setFormData] = useState({ title: '', content: '', targetRole: 'all' });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const res = await api.get('/notices');
      setNotices(res.data);
    } catch (err) {
      console.error('Error fetching notices:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');
    try {
      const res = await api.post('/notices', formData);
      setFormData({ title: '', content: '', targetRole: 'all' });
      setSuccess('Announcement broadcasted successfully!');
      // Instant update by adding to state instead of full fetch
      setNotices([res.data, ...notices]);

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post announcement');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to retract this announcement?')) {
      try {
        await api.delete(`/notices/${id}`);
        // Instant update by filtering state
        setNotices(notices.filter(n => n._id !== id));
      } catch (err) {
        console.error('Error deleting notice:', err);
        alert('Failed to delete announcement');
      }
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100">
        <div>
          <h1 className="text-4xl font-black text-gray-800 tracking-tight flex items-center">
            <Megaphone className="mr-5 text-red-600 w-10 h-10" /> Communication Center
          </h1>
          <p className="text-gray-400 font-bold mt-2 uppercase tracking-widest text-xs">Broadcast updates to the HIREPRO community</p>
        </div>
        <div className="bg-red-50 px-6 py-3 rounded-2xl flex items-center">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-3"></div>
          <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">Active Channels: {notices.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5">
          <div className="card shadow-2xl border-0 p-10 rounded-[2.5rem] bg-white sticky top-28">
            <h2 className="text-2xl font-black mb-8 flex items-center text-gray-800">
              <PlusCircle className="mr-3 w-6 h-6 text-blue-600" /> New Broadcast
            </h2>

            {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-xs font-bold border border-red-100">{error}</div>}
            {success && <div className="bg-green-50 text-green-600 p-4 rounded-xl mb-6 text-xs font-bold border border-green-100">{success}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Announcement Title</label>
                <input
                  type="text"
                  className="w-full bg-gray-50 border-0 rounded-2xl px-6 py-4 font-bold text-gray-700 focus:ring-2 focus:ring-blue-600 transition-all"
                  placeholder="e.g. Placement Drive 2024"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Target Audience</label>
                <select
                  className="w-full bg-gray-50 border-0 rounded-2xl px-6 py-4 font-bold text-gray-700 focus:ring-2 focus:ring-blue-600 transition-all cursor-pointer"
                  value={formData.targetRole}
                  onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                >
                  <option value="all">Public (Everyone)</option>
                  <option value="student">Students Only</option>
                  <option value="company">Companies Only</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Message Content</label>
                <textarea
                  className="w-full bg-gray-50 border-0 rounded-2xl px-6 py-4 font-bold text-gray-700 focus:ring-2 focus:ring-blue-600 transition-all h-40 resize-none"
                  placeholder="Type your announcement detail here..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="btn btn-primary w-full py-5 font-black flex items-center justify-center gap-3 shadow-xl shadow-blue-100 disabled:opacity-50"
                disabled={submitting}
              >
                {submitting ? 'Transmitting...' : 'Send Broadcast'} <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-8">
          <h2 className="text-xl font-black text-gray-800 uppercase tracking-[0.2em] flex items-center">
            Broadcast History <div className="ml-6 h-px flex-grow bg-gray-100"></div>
          </h2>
          {notices.length > 0 ? (
            notices.map(notice => (
              <div key={notice._id} className="card bg-white p-8 rounded-[2.5rem] shadow-lg hover:shadow-2xl transition-all border-0 group relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-1.5 h-full ${notice.userRole === 'admin' ? 'bg-red-500' : 'bg-blue-500'}`}></div>

                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-sm font-black text-gray-500 mr-5 border border-gray-100">
                      {notice.postedBy?.name?.[0] || 'A'}
                    </div>
                    <div>
                      <p className="font-black text-gray-800 text-base leading-none mb-1">{notice.postedBy?.name}</p>
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-black uppercase tracking-widest ${notice.userRole === 'admin' ? 'text-red-500' : 'text-blue-500'}`}>{notice.userRole}</span>
                        <span className="text-[9px] text-gray-300 font-black">•</span>
                        <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest">{notice.targetRole} audience</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] text-gray-300 font-bold flex items-center bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                      <Calendar className="w-3 h-3 mr-2" /> {new Date(notice.createdAt).toLocaleDateString()}
                    </span>
                    {(user.role === 'admin' || notice.postedBy?._id === user.id) && (
                      <button
                        onClick={() => handleDelete(notice._id)}
                        className="p-3 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all group"
                        title="Delete Announcement"
                      >
                        <Trash2 className="w-5 h-5 transition-transform group-hover:scale-110" />
                      </button>
                    )}
                  </div>
                </div>

                <h3 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">{notice.title}</h3>
                <p className="text-gray-500 font-medium text-base leading-relaxed whitespace-pre-wrap">{notice.content}</p>

                <div className="mt-8 flex items-center justify-end">
                  <div className="w-1 h-1 bg-gray-200 rounded-full mx-1"></div>
                  <div className="w-1 h-1 bg-gray-200 rounded-full mx-1"></div>
                  <div className="w-1 h-1 bg-gray-200 rounded-full mx-1"></div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
              <Megaphone className="w-20 h-20 mx-auto text-gray-100 mb-6 opacity-20" />
              <p className="text-gray-400 font-black uppercase tracking-widest text-sm">No Active Broadcasts</p>
              <p className="text-xs text-gray-300 mt-2">New announcements will appear here once posted.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageNotices;
