import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import JobList from './pages/JobList';
import JobDetails from './pages/JobDetails';
import CreateJob from './pages/CreateJob';
import Applications from './pages/Applications';
import AdminUsers from './pages/AdminUsers';
import ManageNotices from './pages/ManageNotices';
import ScrollToTop from './components/ScrollToTop';
import ErrorBoundary from './components/ErrorBoundary';

const PrivateRoute = ({ children, roles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen bg-gray-50">
          <ErrorBoundary>
            <Navbar />
            <div className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/jobs" element={<PrivateRoute><JobList /></PrivateRoute>} />
                <Route path="/jobs/:id" element={<PrivateRoute><JobDetails /></PrivateRoute>} />
                
                {/* Company & Admin only routes */}
                <Route path="/create-job" element={<PrivateRoute roles={['company', 'admin']}><CreateJob /></PrivateRoute>} />
                <Route path="/applications" element={<PrivateRoute roles={['company', 'admin']}><Applications /></PrivateRoute>} />
                <Route path="/admin/users" element={<PrivateRoute roles={['admin']}><AdminUsers /></PrivateRoute>} />
                <Route path="/admin/notices" element={<PrivateRoute roles={['admin', 'company']}><ManageNotices /></PrivateRoute>} />
                <Route path="/create-notice" element={<PrivateRoute roles={['admin', 'company']}><ManageNotices /></PrivateRoute>} />
                
                <Route path="/" element={<Navigate to="/dashboard" />} />
              </Routes>
            </div>
          </ErrorBoundary>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
