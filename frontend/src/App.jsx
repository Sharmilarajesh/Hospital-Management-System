import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Import pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageDoctors from './pages/admin/ManageDoctors';

// Doctor pages
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import DoctorAppointments from './pages/doctor/DoctorAppointments';
import AppointmentDetail from './pages/doctor/AppointmentDetail';

// Patient pages
import PatientDashboard from './pages/patient/PatientDashboard';
import FindDoctors from './pages/patient/FindDoctors';
import BookAppointment from './pages/patient/BookAppointment';
import MyAppointments from './pages/patient/MyAppointments';
import MedicalHistory from './pages/patient/MedicalHistory';

function App() {
  const { user, loading } = useAuth();

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  // Protected route component
  const ProtectedRoute = ({ children, allowedRole }) => {
    if (!user) {
      return <Navigate to="/login" />;
    }
    if (allowedRole && user.role !== allowedRole) {
      return <Navigate to="/" />;
    }
    return children;
  };

  return (
    <Routes>
      {/* Public routes - anyone can access */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Admin routes - only admin can access */}
      <Route path="/admin" element={
        <ProtectedRoute allowedRole="admin">
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin/doctors" element={
        <ProtectedRoute allowedRole="admin">
          <ManageDoctors />
        </ProtectedRoute>
      } />

      {/* Doctor routes - only doctor can access */}
      <Route path="/doctor" element={
        <ProtectedRoute allowedRole="doctor">
          <DoctorDashboard />
        </ProtectedRoute>
      } />
      <Route path="/doctor/appointments" element={
        <ProtectedRoute allowedRole="doctor">
          <DoctorAppointments />
        </ProtectedRoute>
      } />
      <Route path="/doctor/appointment/:id" element={
        <ProtectedRoute allowedRole="doctor">
          <AppointmentDetail />
        </ProtectedRoute>
      } />

      {/* Patient routes - only patient can access */}
      <Route path="/patient" element={
        <ProtectedRoute allowedRole="patient">
          <PatientDashboard />
        </ProtectedRoute>
      } />
      <Route path="/patient/doctors" element={
        <ProtectedRoute allowedRole="patient">
          <FindDoctors />
        </ProtectedRoute>
      } />
      <Route path="/patient/book/:doctorId" element={
        <ProtectedRoute allowedRole="patient">
          <BookAppointment />
        </ProtectedRoute>
      } />
      <Route path="/patient/appointments" element={
        <ProtectedRoute allowedRole="patient">
          <MyAppointments />
        </ProtectedRoute>
      } />
      <Route path="/patient/medical-history" element={
        <ProtectedRoute allowedRole="patient">
          <MedicalHistory />
        </ProtectedRoute>
      } />

      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;pageYOffset