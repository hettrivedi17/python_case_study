import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { MapPin, DollarSign, Calendar, Search, Filter, Briefcase, Zap, ArrowRight } from 'lucide-react';

import { useAuth } from '../context/AuthContext';

const JobList = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joiningId, setJoiningId] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [type, setType] = useState(searchParams.get('type') || '');

  const handleQuickJoin = async (jobId) => {
    try {
      setJoiningId(jobId);
      await api.post('/applications', { jobId });
      alert('You have successfully joined this opportunity!');
    } catch (err) {
      alert(err.response?.data?.message || 'Joining failed');
    } finally {
      setJoiningId(null);
    }
  };

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/jobs?search=${search}&type=${type}`);
      setJobs(res.data);
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [type]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="space-y-12 pb-20">
      {/* Header & Filter Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100">
        <div>
          <h1 className="text-4xl font-black text-gray-800 tracking-tight">Explore Opportunities</h1>
          <div className="flex gap-6 mt-3">
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] flex items-center bg-blue-50 px-4 py-2 rounded-xl border border-blue-100">
               <Briefcase className="w-3 h-3 mr-2 text-blue-500" /> {jobs.filter(j => j.jobType === 'Full-time').length} Jobs Available
            </p>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] flex items-center bg-purple-50 px-4 py-2 rounded-xl border border-purple-100">
               <Zap className="w-3 h-3 mr-2 text-purple-500 fill-purple-500" /> {jobs.filter(j => j.jobType === 'Internship').length} Internships Available
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
          <form onSubmit={handleSearch} className="relative w-full sm:w-80">
            <input 
              type="text" 
              placeholder="Search by title or location..." 
              className="input-field pl-12 pr-4 py-4 rounded-2xl shadow-sm border-gray-100 focus:border-blue-500 focus:bg-white transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search className="absolute left-4 top-4.5 text-gray-400 w-5 h-5" />
          </form>
          
          <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-2xl border border-gray-100 w-full sm:w-auto">
             <Filter className="w-4 h-4 text-gray-400 ml-2" />
             <select 
               className="bg-transparent border-0 font-black text-xs text-gray-600 focus:ring-0 cursor-pointer uppercase tracking-widest px-4 py-2"
               value={type}
               onChange={(e) => {
                 setType(e.target.value);
                 setSearchParams({ type: e.target.value });
               }}
             >
               <option value="">All Types</option>
               <option value="Full-time">Full-time</option>
               <option value="Internship">Internship</option>
             </select>
          </div>
        </div>
      </div>
      
      {/* Job Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {jobs.length > 0 ? (
          jobs.map(job => (
            <div key={job._id} className="card bg-white rounded-[2.5rem] p-10 hover:shadow-3xl transition-all duration-500 border-0 group relative overflow-hidden flex flex-col h-full">
              {/* Job Type Tag */}
              <div className="absolute top-0 right-0 mt-8 mr-8">
                 <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                   job.jobType === 'Internship' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
                 }`}>
                   {job.jobType}
                 </span>
              </div>

              <div className="mb-8">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 text-2xl font-black text-blue-600 border border-gray-100 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                   {job.companyId?.name?.[0]}
                </div>
                <h2 className="text-2xl font-black text-gray-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors">{job.title}</h2>
                <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">{job.companyId?.name}</p>
              </div>
              
              <div className="space-y-4 mb-10 flex-grow">
                <div className="flex items-center text-gray-500 font-bold text-sm">
                   <MapPin className="w-5 h-5 mr-3 text-gray-300" /> {job.location}
                </div>
                <div className="flex items-center text-gray-500 font-bold text-sm">
                   <DollarSign className="w-5 h-5 mr-3 text-gray-300" /> {job.salary}
                </div>
                <div className="flex items-center text-gray-500 font-bold text-sm">
                   <Calendar className="w-5 h-5 mr-3 text-gray-300" /> Closes {new Date(job.deadline).toLocaleDateString()}
                </div>
              </div>
              
              <div className="flex flex-col gap-3">
                <Link to={`/jobs/${job._id}`} className="flex items-center justify-center gap-3 w-full bg-gray-50 text-gray-800 py-5 rounded-[1.5rem] font-black text-sm hover:bg-gray-100 transition-all duration-300 border border-gray-100">
                  View Opportunity <ArrowRight className="w-5 h-5" />
                </Link>

                {user?.role === 'student' && user?.resume && (
                  <button 
                    onClick={() => handleQuickJoin(job._id)}
                    disabled={joiningId === job._id}
                    className="flex items-center justify-center gap-3 w-full bg-blue-600 text-white py-5 rounded-[1.5rem] font-black text-sm hover:bg-blue-700 transition-all duration-300 shadow-xl shadow-blue-100 disabled:opacity-50"
                  >
                    <Zap className="w-4 h-4 fill-white" /> {joiningId === job._id ? 'Joining...' : 'Quick Join'}
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-32 bg-white rounded-[3rem] shadow-xl border border-gray-100 text-center">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8">
               <Search className="w-12 h-12 text-gray-200" />
            </div>
            <h3 className="text-3xl font-black text-gray-800 mb-4">No Matches Found</h3>
            <p className="text-gray-400 font-medium max-w-xs mx-auto">Try adjusting your filters or search terms to find what you're looking for.</p>
            <button 
              onClick={() => { setSearch(''); setType(''); fetchJobs(); }}
              className="mt-10 text-blue-600 font-black uppercase tracking-widest text-xs hover:underline"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobList;
