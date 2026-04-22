import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, Briefcase, FileText, PlusCircle, Users, Megaphone, UserCircle, Bell } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinkClass = "flex items-center px-4 py-2 rounded-xl text-sm font-black uppercase tracking-widest transition-all duration-300";
  const activeLinkClass = "bg-blue-600 text-white shadow-lg shadow-blue-100";
  const inactiveLinkClass = "text-gray-400 hover:text-blue-600 hover:bg-blue-50";

  if (!user) return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
             <Briefcase className="w-6 h-6" />
          </div>
          <span className="text-2xl font-black text-gray-800 tracking-tighter italic">HIRE<span className="text-blue-600">PRO</span></span>
        </Link>
        <div className="flex items-center space-x-4">
          <Link to="/login" className="text-gray-500 font-black text-xs uppercase tracking-widest hover:text-blue-600 transition-colors">Sign In</Link>
          <Link to="/register" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-100 hover:scale-105 transition-all">Join Platform</Link>
        </div>
      </div>
    </nav>
  );

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
      <div className="container mx-auto px-6 h-24 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center space-x-3 group">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl group-hover:rotate-12 transition-transform">
             <Briefcase className="w-7 h-7" />
          </div>
          <span className="text-2xl font-black text-gray-800 tracking-tighter italic">HIRE<span className="text-blue-600">PRO</span></span>
        </Link>
        
        <div className="hidden lg:flex items-center bg-gray-50/50 p-1.5 rounded-[1.2rem] border border-gray-100">
          <Link to="/dashboard" className={`${navLinkClass} ${inactiveLinkClass}`}>
            <LayoutDashboard className="w-4 h-4 mr-2" /> Dash
          </Link>
          <Link to="/jobs" className={`${navLinkClass} ${inactiveLinkClass}`}>
            <Briefcase className="w-4 h-4 mr-2" /> Explore
          </Link>
          {(user.role === 'company' || user.role === 'admin') && (
            <>
              <Link to="/create-job" className={`${navLinkClass} ${inactiveLinkClass}`}>
                <PlusCircle className="w-4 h-4 mr-2" /> Post
              </Link>
              <Link to="/applications" className={`${navLinkClass} ${inactiveLinkClass}`}>
                <FileText className="w-4 h-4 mr-2" /> Pipeline
              </Link>
              {(user.role === 'admin' || user.role === 'company') && (
                <Link to="/admin/notices" className={`${navLinkClass} ${inactiveLinkClass}`}>
                  <Megaphone className="w-4 h-4 mr-2" /> News
                </Link>
              )}
              {user.role === 'admin' && (
                <Link to="/admin/users" className={`${navLinkClass} ${inactiveLinkClass}`}>
                  <Users className="w-4 h-4 mr-2" /> Directory
                </Link>
              )}
            </>
          )}
        </div>

        <div className="flex items-center space-x-6">
          <div className="flex items-center bg-white px-5 py-2.5 rounded-2xl shadow-sm border border-gray-100">
             <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-black text-xs mr-4">
                {user?.name?.[0] || 'U'}
             </div>
             <div className="hidden sm:block">
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest leading-none">{user?.role}</p>
                <p className="text-xs font-black text-gray-800 mt-1">{user?.name || 'Guest User'}</p>
             </div>
          </div>
          <button 
            onClick={handleLogout} 
            className="p-3 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all group"
            title="Terminate Session"
          >
            <LogOut className="w-6 h-6 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
