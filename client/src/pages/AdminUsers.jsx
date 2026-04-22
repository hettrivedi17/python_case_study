import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Users, Trash2, Mail, Shield, Calendar, UserCheck, Briefcase } from 'lucide-react';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/admin/users');
      // Support both { success: true, data: [] } and direct array response
      const userData = Array.isArray(res.data) ? res.data : res.data.data || [];
      setUsers(userData);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('System could not retrieve the user directory. Please verify your admin credentials.');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const stats = {
    total: users.length,
    students: users.filter(u => u.role === 'student').length,
    companies: users.filter(u => u.role === 'company').length,
    admins: users.filter(u => u.role === 'admin').length,
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user? Revoking access is permanent.')) {
      try {
        await api.delete(`/admin/users/${id}`);
        fetchUsers();
      } catch (err) {
        console.error('Error deleting user:', err);
      }
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  if (error) return (
    <div className="max-w-7xl mx-auto mt-10 p-10 bg-red-50 rounded-[3rem] text-center">
      <Shield className="w-16 h-16 text-red-600 mx-auto mb-6" />
      <h2 className="text-2xl font-black text-red-900 mb-4">Access Restricted or Error</h2>
      <p className="text-red-600 font-medium mb-8">{error}</p>
      <button onClick={fetchUsers} className="btn btn-primary px-10 py-4 bg-red-600 shadow-red-200">Retry Authentication</button>
    </div>
  );

  return (
    <div className="space-y-10 pb-20 max-w-7xl mx-auto">
      {/* Premium Header & Stats */}
      <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-gray-100">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
          <div>
            <h1 className="text-5xl font-black text-gray-800 tracking-tight flex items-center">
              <Shield className="mr-5 text-blue-600 w-12 h-12" /> Admin Console
            </h1>
            <p className="text-gray-400 font-bold mt-3 uppercase tracking-[0.2em] text-xs">Total ecosystem governance & user directory</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full lg:w-auto">
            {[
              { label: 'Total', val: stats.total, color: 'blue', icon: Users },
              { label: 'Students', val: stats.students, color: 'green', icon: UserCheck },
              { label: 'Companies', val: stats.companies, color: 'indigo', icon: Briefcase },
              { label: 'Admins', val: stats.admins, color: 'purple', icon: Shield },
            ].map((s, i) => (
              <div key={i} className={`bg-${s.color}-50 p-6 rounded-[2rem] border border-${s.color}-100 text-center hover:scale-105 transition-transform cursor-default`}>
                <p className={`text-3xl font-black text-${s.color}-600 leading-none`}>{s.val}</p>
                <p className={`text-[10px] font-black text-${s.color}-400 uppercase tracking-widest mt-2 flex items-center justify-center`}>
                  <s.icon className="w-3 h-3 mr-1" /> {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="mt-12 flex flex-col md:flex-row gap-4 p-4 bg-gray-50 rounded-[2rem] border border-gray-100">
          <div className="flex-1 relative">
            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search by name or email address..." 
              className="w-full pl-14 pr-6 py-4 rounded-2xl border-0 bg-white shadow-sm focus:ring-2 focus:ring-blue-600 font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="px-8 py-4 rounded-2xl border-0 bg-white shadow-sm focus:ring-2 focus:ring-blue-600 font-bold text-gray-700"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="student">Students</option>
            <option value="company">Companies</option>
            <option value="admin">Admins</option>
          </select>
        </div>
      </div>
      
      {/* Users Table */}
      <div className="card shadow-3xl border-0 overflow-hidden rounded-[3rem] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="py-8 px-10 font-black text-gray-400 text-[10px] uppercase tracking-widest">Identified User</th>
                <th className="py-8 px-10 font-black text-gray-400 text-[10px] uppercase tracking-widest">Email Contact</th>
                <th className="py-8 px-10 font-black text-gray-400 text-[10px] uppercase tracking-widest">Access Level</th>
                <th className="py-8 px-10 font-black text-gray-400 text-[10px] uppercase tracking-widest text-center">Membership</th>
                <th className="py-8 px-10 font-black text-gray-400 text-[10px] uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
                  <tr key={user._id} className="hover:bg-blue-50/20 transition-all duration-300 group">
                    <td className="py-8 px-10">
                      <div className="flex items-center">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl mr-6 shadow-sm transition-transform group-hover:rotate-6 ${
                          user.role === 'admin' ? 'bg-purple-100 text-purple-600' : 
                          user.role === 'company' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                        }`}>
                          {user.name[0]}
                        </div>
                        <div>
                          <p className="font-black text-gray-900 text-xl tracking-tight leading-none">{user.name}</p>
                          <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-widest">Active Member</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-8 px-10">
                      <div className="flex items-center text-gray-600 font-bold">
                        <Mail className="w-4 h-4 mr-3 text-blue-300" /> {user.email}
                      </div>
                    </td>
                    <td className="py-8 px-10">
                      <span className={`px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest inline-flex items-center shadow-sm ${
                        user.role === 'admin' ? 'bg-purple-600 text-white' : 
                        user.role === 'company' ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'
                      }`}>
                        <Shield className="w-3 h-3 mr-2" /> {user.role}
                      </span>
                    </td>
                    <td className="py-8 px-10 text-center">
                      <div className="inline-flex flex-col items-center">
                        <Calendar className="w-4 h-4 text-gray-300 mb-1" />
                        <span className="text-[10px] text-gray-400 font-black uppercase">{new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                      </div>
                    </td>
                    <td className="py-8 px-10">
                      <div className="flex justify-end">
                        <button 
                          onClick={() => handleDelete(user._id)}
                          className="p-4 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-[1.5rem] transition-all group"
                        >
                          <Trash2 className="w-6 h-6 transition-transform group-hover:scale-110" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-40 text-center">
                    <div className="max-w-xs mx-auto text-gray-400">
                      <Users className="w-20 h-20 mx-auto mb-8 opacity-10" />
                      <p className="font-black uppercase tracking-[0.2em] text-sm">No Results Found</p>
                      <p className="text-xs mt-3 font-medium">Try adjusting your search terms or filters.</p>
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

export default AdminUsers;
