import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { Briefcase, FileText, CheckCircle, Clock, Megaphone, Users, PlusCircle, TrendingUp, ArrowRight, Zap, Shield, UserCheck } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [notices, setNotices] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch stats
        const statsRes = await api.get('/jobs/stats');
        setStats(statsRes.data);

        // Fetch notices
        const noticeRes = await api.get('/notices');
        setNotices(noticeRes.data);

        // Fetch companies - now using a more appropriate check
        try {
          // If admin, use the admin endpoint, otherwise we'll handle gracefully
          const companyRes = await api.get('/admin/companies');
          setCompanies(companyRes.data);
        } catch (e) {
          console.warn('Could not fetch companies directory - might be restricted role');
        }

        // Fetch applications if student
        if (user?.role === 'student') {
          const appRes = await api.get('/applications');
          setStats(prev => ({ ...prev, studentApplications: appRes.data }));
        }

        // Fetch system activity if admin
        if (user?.role === 'admin') {
          const activityRes = await api.get('/admin/activity');
          setActivities(activityRes.data);
        }

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.role]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="space-y-10 pb-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 rounded-[2.5rem] p-12 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-widest mb-6">
            <Zap className="w-3 h-3 mr-2 text-yellow-300" /> HIREPRO Ecosystem Active
          </div>
          <h1 className="text-5xl font-black mb-4 tracking-tight">Welcome back, {user?.name}! 👋</h1>
          <p className="text-blue-100 opacity-90 text-xl max-w-2xl leading-relaxed">
            {user?.role === 'student' 
              ? `Your career journey starts here. Explore ${stats?.totalInternships || 0} active internships and connect with ${stats?.totalCompanies || 0} top-tier recruiters.` 
              : user?.role === 'company' 
                ? `Accelerate your hiring. Your pipeline currently has ${stats?.totalApplications || 0} active applications waiting for review.`
                : "Platform intelligence dashboard. Monitoring system-wide growth and recruitment activities."}
          </p>
          <div className="mt-8 flex space-x-4">
             {user?.role === 'student' && (
               <button onClick={() => navigate('/jobs')} className="bg-white text-blue-700 px-8 py-4 rounded-2xl font-black shadow-xl hover:scale-105 transition-transform flex items-center">
                 Explore Opportunities <ArrowRight className="ml-2 w-5 h-5" />
               </button>
             )}
             {(user?.role === 'company' || user?.role === 'admin') && (
               <button onClick={() => navigate('/create-job')} className="bg-white text-blue-700 px-8 py-4 rounded-2xl font-black shadow-xl hover:scale-105 transition-transform flex items-center">
                 Post New Opening <PlusCircle className="ml-2 w-5 h-5" />
               </button>
             )}
          </div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {(user?.role === 'admin' || user?.role === 'company') ? (
          // Admin & Company Specific Stats
          [
            { label: 'Full-time Jobs', val: stats?.totalJobs - (stats?.totalInternships || 0), icon: Briefcase, color: 'blue', link: '/jobs' },
            { label: 'Internships', val: stats?.totalInternships, icon: Zap, color: 'purple', link: '/jobs' },
            { label: 'Job Applicants', val: stats?.totalApplications - (stats?.totalInternshipApplications || 0), icon: FileText, color: 'green', link: '/applications' },
            { label: 'Intern Applicants', val: stats?.totalInternshipApplications || 0, icon: UserCheck, color: 'indigo', link: '/applications' },
          ].map((item, idx) => (
            <div onClick={() => navigate(item.link)} key={idx} className={`cursor-pointer card border-0 bg-white shadow-lg hover:shadow-2xl transition-all border-b-4 border-b-${item.color}-500 p-8 group rounded-3xl`}>
              <div className="flex items-center space-x-5">
                <div className={`p-5 bg-${item.color}-50 text-${item.color}-600 rounded-[1.5rem] group-hover:bg-${item.color}-600 group-hover:text-white transition-all duration-300 shadow-sm`}>
                  <item.icon className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">{item.label}</p>
                  <p className="text-4xl font-black text-gray-800">{item.val || 0}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          // Student Specific Stats
          [
            { label: 'Available Jobs', val: stats?.totalJobs - (stats?.totalInternships || 0), icon: Briefcase, color: 'blue', link: '/jobs' },
            { label: 'Internships', val: stats?.totalInternships, icon: Zap, color: 'purple', link: '/jobs' },
            { label: 'My Enrollments', val: stats?.studentApplications?.length, icon: FileText, color: 'green', link: '/applications' },
            { label: 'Companies', val: stats?.totalCompanies, icon: Users, color: 'indigo', link: '/dashboard' },
          ].map((item, idx) => (
            <div onClick={() => navigate(item.link)} key={idx} className={`cursor-pointer card border-0 bg-white shadow-lg hover:shadow-2xl transition-all border-b-4 border-b-${item.color}-500 p-8 group rounded-3xl`}>
              <div className="flex items-center space-x-5">
                <div className={`p-5 bg-${item.color}-50 text-${item.color}-600 rounded-[1.5rem] group-hover:bg-${item.color}-600 group-hover:text-white transition-all duration-300 shadow-sm`}>
                  <item.icon className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">{item.label}</p>
                  <p className="text-4xl font-black text-gray-800">{item.val || 0}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-10">
          {/* Recent Activity/Applications Section */}
          <div className="card bg-white shadow-xl border-0 rounded-[2rem] p-10">
            <h2 className="text-2xl font-black mb-8 flex justify-between items-center text-gray-800">
              <span className="flex items-center"><Clock className="mr-4 text-indigo-600 w-8 h-8" /> {
                user?.role === 'student' ? 'My Joined Internships' : 
                user?.role === 'admin' ? 'Recent System Activity' : 'Recent Talent Feed'
              }</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">Live Feed</span>
              </div>
            </h2>
            
            <div className="space-y-6">
              {user?.role === 'student' ? (
                stats?.studentApplications?.length > 0 ? (
                  stats.studentApplications.slice(0, 5).map(app => (
                    <div key={app._id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-8 bg-gray-50 rounded-[2rem] hover:bg-white hover:shadow-2xl border border-transparent hover:border-indigo-100 transition-all group cursor-pointer" onClick={() => navigate(`/jobs/${app.jobId?._id}`)}>
                      <div className="flex items-center mb-4 sm:mb-0">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center font-black text-indigo-600 shadow-md mr-6 group-hover:rotate-6 transition-transform text-2xl">
                          {app.jobId?.title?.[0] || '?'}
                        </div>
                        <div>
                          <p className="font-black text-gray-900 text-xl leading-tight mb-1">{app.jobId?.title}</p>
                          <p className="text-[10px] text-indigo-600 font-black uppercase tracking-widest flex items-center">
                             <CheckCircle className="w-3 h-3 mr-1" /> Joined Successfully
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-8 w-full sm:w-auto">
                        <span className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg text-center w-full sm:w-44 ${
                          app.status === 'Accepted' ? 'bg-green-500 text-white' : 
                          app.status === 'Rejected' ? 'bg-red-500 text-white' : 
                          app.status === 'Shortlisted' ? 'bg-blue-500 text-white' :
                          'bg-yellow-400 text-gray-900 shadow-yellow-100'
                        }`}>
                          {app.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-24">
                    <Zap className="w-20 h-20 mx-auto text-indigo-100 mb-6" />
                    <h3 className="text-2xl font-black text-gray-800 mb-2">Start Your Journey</h3>
                    <p className="text-gray-400 text-sm max-w-sm mx-auto mb-10">You haven't joined any opportunities yet. Quick-join your favorite internships today!</p>
                    <button onClick={() => navigate('/jobs')} className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-black shadow-2xl shadow-blue-200 hover:scale-105 transition-transform inline-block">
                      Explore All Internships
                    </button>
                  </div>
                )
              ) : user?.role === 'admin' ? (
                 <div className="space-y-6">
                    {activities.length > 0 ? (
                      activities.map(act => (
                        <div key={act._id} className="flex items-center p-8 bg-white rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all border border-gray-50 group">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl mr-6 shadow-sm ${
                            act.action === 'Applied' ? 'bg-blue-100 text-blue-600' :
                            act.action === 'Posted Job' ? 'bg-green-100 text-green-600' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {act.user?.name?.[0] || 'U'}
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-800 font-bold">
                              <span className="font-black text-blue-600">{act.user?.name}</span>
                              <span className="mx-2 text-gray-400 font-medium">({act.user?.role})</span>
                            </p>
                            <p className="text-lg font-black text-gray-900 mt-1">{act.action}</p>
                            <p className="text-sm text-gray-500">{act.details}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-24 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-100">
                        <Clock className="w-16 h-16 mx-auto text-gray-200 mb-4" />
                        <p className="text-gray-400 font-black uppercase tracking-widest text-xs">No System Logs Yet</p>
                      </div>
                    )}
                 </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div onClick={() => navigate('/jobs')} className="cursor-pointer p-10 bg-blue-50/50 rounded-[2.5rem] border border-blue-100 flex items-center justify-between group hover:bg-white hover:shadow-xl transition-all">
                     <div>
                       <p className="text-5xl font-black text-blue-700 mb-2">{stats?.totalJobs || 0}</p>
                       <p className="text-xs font-black text-blue-600 uppercase tracking-widest">Active Postings</p>
                     </div>
                     <Briefcase className="w-16 h-16 text-blue-100 group-hover:scale-110 transition-transform" />
                   </div>
                   <div onClick={() => navigate('/applications')} className="cursor-pointer p-10 bg-indigo-50/50 rounded-[2.5rem] border border-indigo-100 flex items-center justify-between group hover:bg-white hover:shadow-xl transition-all">
                     <div>
                       <p className="text-5xl font-black text-indigo-700 mb-2">{stats?.totalApplications || 0}</p>
                       <p className="text-xs font-black text-indigo-600 uppercase tracking-widest">Candidates Managed</p>
                     </div>
                     <FileText className="w-16 h-16 text-indigo-100 group-hover:scale-110 transition-transform" />
                   </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-10">
          {/* Quick Actions */}
          <div className="card bg-white shadow-xl border-0 rounded-[2rem] p-10">
            <h2 className="text-xl font-black mb-8 flex items-center text-gray-800">
              <Zap className="mr-4 w-6 h-6 text-yellow-500" /> Fast Track
            </h2>
            <div className="space-y-4">
              {user?.role === 'student' ? (
                <>
                  <button onClick={() => navigate('/jobs')} className="w-full flex items-center p-6 bg-blue-50/50 text-blue-700 rounded-[1.5rem] hover:bg-blue-600 hover:text-white transition-all font-black group">
                    <Briefcase className="w-6 h-6 mr-4" /> Discover Jobs
                  </button>
                  <button onClick={() => navigate('/applications')} className="w-full flex items-center p-6 bg-indigo-50/50 text-indigo-700 rounded-[1.5rem] hover:bg-indigo-600 hover:text-white transition-all font-black group">
                    <FileText className="w-6 h-6 mr-4" /> My Applications
                  </button>
                </>
              ) : user?.role === 'company' ? (
                <>
                  <button onClick={() => navigate('/create-job')} className="w-full flex items-center p-6 bg-blue-50/50 text-blue-700 rounded-[1.5rem] hover:bg-blue-600 hover:text-white transition-all font-black group">
                    <PlusCircle className="w-6 h-6 mr-4" /> Create Listing
                  </button>
                  <button onClick={() => navigate('/applications')} className="w-full flex items-center p-6 bg-indigo-50/50 text-indigo-700 rounded-[1.5rem] hover:bg-indigo-600 hover:text-white transition-all font-black group">
                    <Users className="w-6 h-6 mr-4" /> View Applicants
                  </button>
                  <button onClick={() => navigate('/create-notice')} className="w-full flex items-center p-6 bg-red-50/50 text-red-700 rounded-[1.5rem] hover:bg-red-600 hover:text-white transition-all font-black group">
                    <Megaphone className="w-6 h-6 mr-4" /> Post Notice
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => navigate('/admin/users')} className="w-full flex items-center p-6 bg-purple-50/50 text-purple-700 rounded-[1.5rem] hover:bg-purple-600 hover:text-white transition-all font-black group">
                    <Shield className="w-6 h-6 mr-4" /> Manage Users
                  </button>
                  <button onClick={() => navigate('/admin/notices')} className="w-full flex items-center p-6 bg-red-50/50 text-red-700 rounded-[1.5rem] hover:bg-red-600 hover:text-white transition-all font-black group">
                    <Megaphone className="w-6 h-6 mr-4" /> System Notices
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Announcements */}
          <div className="card bg-white shadow-xl border-0 rounded-[2rem] p-10 border-t-8 border-t-red-500">
            <h2 className="text-xl font-black mb-8 flex items-center text-gray-800 uppercase tracking-tighter">
              <Megaphone className="mr-4 w-7 h-7 text-red-500" /> Board News
            </h2>
            <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {notices.length > 0 ? (
                notices.map(notice => (
                  <div key={notice._id} className="p-6 bg-gray-50 rounded-[2rem] border border-transparent hover:bg-white hover:shadow-lg transition-all group">
                    <div className="flex justify-between items-start mb-4">
                      <span className={`px-4 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                        notice.userRole === 'admin' ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'
                      }`}>
                        {notice.userRole}
                      </span>
                      <span className="text-[10px] text-gray-300 font-bold">{new Date(notice.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h3 className="font-black text-gray-900 text-base leading-tight group-hover:text-red-600 transition-colors">{notice.title}</h3>
                    <p className="text-xs text-gray-500 mt-4 leading-relaxed font-medium line-clamp-3">{notice.content}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-16">
                  <Megaphone className="w-16 h-16 mx-auto text-gray-100 mb-4" />
                  <p className="text-xs text-gray-400 font-black uppercase tracking-widest">No News Today</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
