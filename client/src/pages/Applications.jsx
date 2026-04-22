import { useState, useEffect } from 'react';
import api, { API_BASE_URL } from '../utils/api';
import { FileText, ExternalLink, CheckCircle, XCircle, Clock, Calendar, UserCheck } from 'lucide-react';

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [feedback, setFeedback] = useState({ message: '', type: '' });

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await api.get('/applications');
      setApplications(res.data);
    } catch (err) {
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      setUpdating(true);
      await api.put(`/applications/${id}`, { status });
      
      // Instant UI update
      setApplications(prev => prev.map(app => 
        app._id === id ? { ...app, status } : app
      ));
      
      setFeedback({ message: `Candidate status updated to ${status}`, type: 'success' });
      setTimeout(() => setFeedback({ message: '', type: '' }), 3000);
    } catch (err) {
      console.error('Error updating status:', err);
      setFeedback({ message: 'Failed to update status', type: 'error' });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-blue-50 rounded-bl-[5rem] -mr-10 -mt-10 opacity-30"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-black text-gray-800 tracking-tight">Talent Pipeline</h1>
          <p className="text-gray-400 font-bold mt-2 uppercase tracking-widest text-[10px] flex items-center">
             <UserCheck className="w-4 h-4 mr-2 text-green-500" /> Managing global student applications
          </p>
        </div>
        <div className="flex flex-wrap gap-4 relative z-10">
          <div className="bg-blue-600 px-8 py-5 rounded-2xl shadow-2xl shadow-blue-100 flex items-center">
            <span className="text-[10px] font-black text-blue-100 uppercase tracking-widest mr-6">Job Candidates</span>
            <span className="text-4xl font-black text-white">{applications.filter(a => a.jobId?.jobType === 'Full-time').length}</span>
          </div>
          <div className="bg-purple-600 px-8 py-5 rounded-2xl shadow-2xl shadow-purple-100 flex items-center">
            <span className="text-[10px] font-black text-purple-100 uppercase tracking-widest mr-6">Intern Candidates</span>
            <span className="text-4xl font-black text-white">{applications.filter(a => a.jobId?.jobType === 'Internship').length}</span>
          </div>
        </div>
      </div>

      {feedback.message && (
        <div className={`p-5 rounded-2xl border flex items-center gap-4 animate-in fade-in slide-in-from-right-4 ${
          feedback.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'
        }`}>
          <CheckCircle className="w-5 h-5" />
          <p className="font-black text-xs uppercase tracking-widest">{feedback.message}</p>
        </div>
      )}
      
      <div className="card shadow-3xl border-0 overflow-hidden rounded-[3rem] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="py-8 px-10 font-black text-gray-400 text-[10px] uppercase tracking-widest">Candidate Profile</th>
                <th className="py-8 px-10 font-black text-gray-400 text-[10px] uppercase tracking-widest">Applied Role</th>
                <th className="py-8 px-10 font-black text-gray-400 text-[10px] uppercase tracking-widest">Type</th>
                <th className="py-8 px-10 font-black text-gray-400 text-[10px] uppercase tracking-widest text-center">Documentation</th>
                <th className="py-8 px-10 font-black text-gray-400 text-[10px] uppercase tracking-widest">Current Status</th>
                <th className="py-8 px-10 font-black text-gray-400 text-[10px] uppercase tracking-widest text-right">Workflow</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {applications.length > 0 ? (
                applications.map(app => (
                  <tr key={app._id} className="hover:bg-blue-50/20 transition-all duration-300 group">
                    <td className="py-8 px-10">
                      <div className="flex items-center">
                        <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-black text-2xl mr-6 shadow-sm group-hover:rotate-6 transition-transform border border-indigo-100">
                          {app.studentId?.name?.[0]}
                        </div>
                        <div>
                          <p className="font-black text-gray-900 text-xl leading-tight mb-1">{app.studentId?.name}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{app.studentId?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-8 px-10">
                      <p className="font-black text-gray-700 text-lg leading-none">{app.jobId?.title}</p>
                      <div className="flex items-center mt-2">
                         <Clock className="w-3 h-3 text-gray-300 mr-2" />
                         <span className="text-[10px] text-gray-400 font-bold">{new Date(app.createdAt).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="py-8 px-10">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        app.jobId?.jobType === 'Internship' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                        {app.jobId?.jobType}
                      </span>
                    </td>
                    <td className="py-8 px-10 text-center">
                      <a 
                        href={`${API_BASE_URL}/${app.resume.replace(/\\/g, '/')}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-6 py-3 bg-white border border-gray-100 rounded-xl text-blue-600 font-black text-[10px] uppercase tracking-widest hover:border-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm group-hover:scale-105"
                      >
                        <FileText className="w-4 h-4 mr-2" /> View Resume <ExternalLink className="w-3 h-3 ml-2" />
                      </a>
                    </td>
                    <td className="py-8 px-10">
                      <span className={`inline-block px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm ${
                        app.status === 'Accepted' ? 'bg-green-500 text-white' : 
                        app.status === 'Rejected' ? 'bg-red-500 text-white' : 
                        app.status === 'Shortlisted' ? 'bg-blue-500 text-white' :
                        'bg-yellow-400 text-gray-900'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="py-8 px-10">
                      <div className="flex justify-end">
                        <select 
                          className="bg-gray-50 border border-gray-100 text-[10px] font-black uppercase tracking-widest rounded-xl px-6 py-3 focus:ring-2 focus:ring-blue-600 focus:bg-white cursor-pointer transition-all outline-none disabled:opacity-50"
                          value={app.status}
                          onChange={(e) => handleStatusUpdate(app._id, e.target.value)}
                          disabled={updating}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Shortlisted">Shortlist</option>
                          <option value="Interview Scheduled">Schedule Interview</option>
                          <option value="Accepted">Accept Candidate</option>
                          <option value="Rejected">Reject Candidate</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-48 text-center">
                    <div className="max-w-xs mx-auto text-gray-400">
                      <FileText className="w-20 h-20 mx-auto mb-8 opacity-10" />
                      <p className="font-black uppercase tracking-[0.2em] text-sm">Pipeline is Empty</p>
                      <p className="text-xs mt-3 font-medium">New internship applications will appear here for review.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Applications;
