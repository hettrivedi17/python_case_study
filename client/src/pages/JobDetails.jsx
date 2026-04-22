import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { MapPin, DollarSign, Calendar, Upload, CheckCircle, ArrowRight } from 'lucide-react';

const JobDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [applied, setApplied] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/jobs/${id}`);
        setJob(res.data);
        
        // Check if student already applied
        if (user?.role === 'student') {
          const appsRes = await api.get('/applications');
          const hasApplied = appsRes.data.some(app => app.jobId?._id === id);
          setApplied(hasApplied);
        }
      } catch (err) {
        console.error('Error fetching job:', err);
      }
    };
    fetchJob();
  }, [id, user?.role]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please upload your resume (PDF)');
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('jobId', id);

    setUploading(true);
    setError('');
    
    try {
      await api.post('/applications/apply', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setApplied(true);
      setShowSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Application failed');
    } finally {
      setUploading(false);
    }
  };

  if (!job) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate('/jobs')} 
          className="flex items-center text-gray-400 hover:text-blue-600 font-black text-xs uppercase tracking-widest transition-colors"
        >
          <span className="mr-2">←</span> Back to Opportunities
        </button>
        <div className="px-6 py-2 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">
           Ref: {job._id.slice(-6)}
        </div>
      </div>

      {/* Success Modal/Message */}
      {showSuccess && (
        <div className="bg-green-500 text-white p-8 rounded-[2rem] shadow-2xl shadow-green-100 flex flex-col md:flex-row items-center justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-black leading-none mb-2">Application Transmitted!</h3>
              <p className="text-green-100 font-medium">Recruiters at {job.companyId?.name} will review your profile shortly.</p>
            </div>
          </div>
          <button 
            onClick={() => navigate('/applications')} 
            className="bg-white text-green-600 px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 transition-transform"
          >
            Track Application
          </button>
        </div>
      )}

      <div className="card bg-white p-10 rounded-[2.5rem] shadow-xl border-0 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-[5rem] -mr-10 -mt-10 opacity-50"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-10 relative z-10">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center text-3xl font-black text-blue-600 border border-gray-100 shadow-sm">
              {job.companyId?.name?.[0]}
            </div>
            <div>
              <h1 className="text-4xl font-black text-gray-800 tracking-tight mb-2">{job.title}</h1>
              <p className="text-lg text-blue-600 font-black uppercase tracking-widest">{job.companyId?.name}</p>
            </div>
          </div>
          
          {(user?.role === 'company' && user?.id === job.companyId?._id) || user?.role === 'admin' ? (
             <button 
               onClick={() => navigate('/applications')} 
               className="bg-gray-800 text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-gray-900 transition-colors"
             >
               Manage Applicants
             </button>
          ) : null}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { label: 'Location', val: job.location, icon: MapPin, color: 'blue' },
            { label: 'Package', val: job.salary, icon: DollarSign, color: 'green' },
            { label: 'Deadline', val: new Date(job.deadline).toLocaleDateString(), icon: Calendar, color: 'purple' },
          ].map((item, idx) => (
            <div key={idx} className={`p-6 bg-gray-50 rounded-2xl border border-gray-100 group hover:border-${item.color}-200 transition-colors`}>
              <div className="flex items-center gap-4">
                <item.icon className={`w-5 h-5 text-${item.color}-500`} />
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{item.label}</p>
                  <p className="font-bold text-gray-700">{item.val}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-black text-gray-800 flex items-center">
            Role Overview <div className="ml-4 h-px flex-grow bg-gray-100"></div>
          </h3>
          <p className="text-gray-500 font-medium leading-relaxed whitespace-pre-wrap text-lg">
            {job.description}
          </p>
        </div>
      </div>

      {/* Application Widget */}
      {user?.role === 'student' && !showSuccess && (
        <div className="card bg-white p-10 rounded-[2.5rem] shadow-2xl border-0">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
               <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-2xl font-black text-gray-800">Ready to Enroll?</h3>
          </div>

          {applied ? (
            <div className="bg-blue-50 border border-blue-100 p-8 rounded-[1.5rem] flex items-center gap-6">
              <CheckCircle className="w-10 h-10 text-blue-600" />
              <div>
                <p className="text-xl font-black text-blue-800 leading-none mb-2">You have joined this opportunity!</p>
                <p className="text-blue-600 font-medium">Your profile is now being reviewed by {job.companyId?.name}.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {error && <div className="bg-red-50 text-red-600 p-5 rounded-xl text-xs font-black border border-red-100">{error}</div>}
              
              {user?.resume ? (
                <div className="p-10 bg-indigo-50 rounded-[2rem] border border-indigo-100 text-center">
                   <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                      <UserCheck className="w-10 h-10 text-indigo-600" />
                   </div>
                   <h4 className="text-xl font-black text-gray-800 mb-2">One-Click Join Active</h4>
                   <p className="text-gray-500 font-medium mb-8">We'll use your stored resume to join this opportunity instantly.</p>
                   <button 
                     onClick={() => handleApply({ preventDefault: () => {} })} 
                     className="btn btn-primary w-full py-6 rounded-[1.5rem] font-black shadow-2xl shadow-indigo-200 flex items-center justify-center gap-3 text-lg"
                     disabled={uploading}
                   >
                     {uploading ? 'Processing Enrollment...' : 'Join Opportunity Now'} <ArrowRight className="w-6 h-6" />
                   </button>
                </div>
              ) : (
                <form onSubmit={handleApply} className="space-y-6">
                  <div className="border-2 border-dashed border-gray-200 rounded-[2rem] p-12 text-center hover:border-indigo-400 hover:bg-indigo-50/30 transition-all group cursor-pointer relative">
                    <input 
                      type="file" 
                      id="resume" 
                      className="hidden" 
                      accept=".pdf"
                      onChange={(e) => setFile(e.target.files[0])} 
                    />
                    <label htmlFor="resume" className="cursor-pointer">
                      <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:bg-white shadow-sm transition-all">
                         <Upload className="w-10 h-10 text-gray-300 group-hover:text-indigo-600" />
                      </div>
                      <p className="text-xl font-black text-gray-800 mb-2">{file ? file.name : 'Upload Resume & Join'}</p>
                      <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Your resume will be saved for future quick joins</p>
                    </label>
                  </div>
                  <button 
                    type="submit" 
                    className="btn btn-primary w-full py-6 rounded-[1.5rem] font-black shadow-2xl shadow-blue-100 disabled:opacity-50 flex items-center justify-center gap-3 text-lg"
                    disabled={uploading}
                  >
                    {uploading ? 'Uploading & Joining...' : 'Enroll in Opportunity'} <ArrowRight className="w-6 h-6" />
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      )}

      {/* Role Protection Message */}
      {(user?.role === 'company' || user?.role === 'admin') && (
        <div className="bg-gray-100 p-8 rounded-[2rem] border border-gray-200 text-center">
           <p className="text-gray-400 font-black uppercase tracking-widest text-xs">Applications are restricted to Student profiles only</p>
        </div>
      )}
    </div>
  );
};

export default JobDetails;
