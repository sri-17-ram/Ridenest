import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/shared/ProtectedRoute';

// Public
import LandingPage from './pages/public/LandingPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import RideNestWorkflow from './pages/public/RideNestWorkflow';

// Parent
import ParentDashboard from './pages/parent/ParentDashboard';
import ChildrenManagement from './pages/parent/ChildrenManagement';
import LiveTracking from './pages/parent/LiveTracking';
import TripHistory from './pages/parent/TripHistory';
import NotificationsPage from './pages/parent/NotificationsPage';
import EmergencyContactsPage from './pages/parent/EmergencyContactsPage';
import TrustedPersonsPage from './pages/parent/TrustedPersonsPage';
import ComplaintsPage from './pages/parent/ComplaintsPage';
import PickupDropLocations from './pages/parent/PickupDropLocations';
import DriverDetails from './pages/parent/DriverDetails';
import ParentBilling from './pages/parent/ParentBilling';

// Driver
import DriverDashboard from './pages/driver/DriverDashboard';
import QrScanner from './pages/driver/QrScanner';
import DocumentsUpload from './pages/driver/DocumentsUpload';
import TripSchedule from './pages/driver/TripSchedule';
import VehicleManagement from './pages/driver/VehicleManagement';
import DriverAvailability from './pages/driver/DriverAvailability';
import DriverWallet from './pages/driver/DriverWallet';

// Institution
import InstitutionDashboard from './pages/institution/InstitutionDashboard';
import StudentTransport from './pages/institution/StudentTransport';
import ActiveTransport from './pages/institution/ActiveTransport';
import AlertsPage from './pages/institution/AlertsPage';
import InstitutionReports from './pages/institution/InstitutionReports';

// Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import DriverVerification from './pages/admin/DriverVerification';
import AdminInstitutions from './pages/admin/AdminInstitutions';
import AdminVehicles from './pages/admin/AdminVehicles';
import AdminUsers from './pages/admin/AdminUsers';
import TripsMonitor from './pages/admin/TripsMonitor';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminComplaints from './pages/admin/AdminComplaints';
import EmergencyMonitor from './pages/admin/EmergencyMonitor';

function RoleRedirect() {
  const { user } = useAuth();
  const roleHome = { PARENT: '/parent/dashboard', DRIVER: '/driver/dashboard', INSTITUTION: '/institution/dashboard', ADMIN: '/admin/dashboard' };
  if (user) return <Navigate to={roleHome[user.role] || '/'} replace />;
  return <Navigate to="/login" replace />;
}

import { AlertProvider } from './context/AlertContext';
import TestHarness from './TestHarness';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AlertProvider>
          <Router>
            <Toaster
              position="top-right"
              toastOptions={{
                className: 'dark:bg-dark-surface dark:text-white',
                duration: 4000,
                style: { borderRadius: '12px', fontFamily: 'Inter, sans-serif' },
              }}
            />
            <Routes>
              {/* Public */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/workflow" element={<RideNestWorkflow />} />
              <Route path="/audit-results" element={<TestHarness />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/unauthorized" element={<div className="min-h-screen flex items-center justify-center"><div className="text-center"><p className="text-4xl mb-4">🔒</p><h1 className="text-2xl font-bold">Access Denied</h1><p className="text-gray-500 mt-2">You don't have permission to view this page.</p></div></div>} />
              <Route path="/dashboard" element={<RoleRedirect />} />

            {/* Parent */}
            <Route path="/parent/*" element={
              <ProtectedRoute allowedRoles={['PARENT']}>
                <Routes>
                  <Route path="dashboard" element={<ParentDashboard />} />
                  <Route path="children" element={<ChildrenManagement />} />
                  <Route path="tracking" element={<LiveTracking />} />
                  <Route path="trips" element={<TripHistory />} />
                  <Route path="locations" element={<PickupDropLocations />} />
                  <Route path="driver-details" element={<DriverDetails />} />
                  <Route path="notifications" element={<NotificationsPage />} />
                  <Route path="emergency-contacts" element={<EmergencyContactsPage />} />
                  <Route path="trusted-persons" element={<TrustedPersonsPage />} />
                  <Route path="complaints" element={<ComplaintsPage />} />
                  <Route path="billing" element={<ParentBilling />} />
                </Routes>
              </ProtectedRoute>
            } />

            {/* Driver */}
            <Route path="/driver/*" element={
              <ProtectedRoute allowedRoles={['DRIVER']}>
                <Routes>
                  <Route path="dashboard" element={<DriverDashboard />} />
                  <Route path="scanner" element={<QrScanner />} />
                  <Route path="documents" element={<DocumentsUpload />} />
                  <Route path="schedule" element={<TripSchedule />} />
                  <Route path="vehicles" element={<VehicleManagement />} />
                  <Route path="trips" element={<DriverDashboard />} />
                  <Route path="availability" element={<DriverAvailability />} />
                  <Route path="wallet" element={<DriverWallet />} />
                </Routes>
              </ProtectedRoute>
            } />

            {/* Institution */}
            <Route path="/institution/*" element={
              <ProtectedRoute allowedRoles={['INSTITUTION']}>
                <Routes>
                  <Route path="dashboard" element={<InstitutionDashboard />} />
                  <Route path="students" element={<StudentTransport />} />
                  <Route path="transport" element={<ActiveTransport />} />
                  <Route path="alerts" element={<AlertsPage />} />
                  <Route path="reports" element={<InstitutionReports />} />
                </Routes>
              </ProtectedRoute>
            } />

            {/* Admin */}
            <Route path="/admin/*" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <Routes>
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="drivers" element={<DriverVerification />} />
                  <Route path="institutions" element={<AdminInstitutions />} />
                  <Route path="vehicles" element={<AdminVehicles />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="trips" element={<TripsMonitor />} />
                  <Route path="analytics" element={<AdminAnalytics />} />
                  <Route path="complaints" element={<AdminComplaints />} />
                  <Route path="emergency" element={<EmergencyMonitor />} />
                </Routes>
              </ProtectedRoute>
            } />

            </Routes>
          </Router>
        </AlertProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
