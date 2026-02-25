import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { get } from '../../services/api';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import AppointmentCard from '../../components/AppointmentCard';

const PatientDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, token } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      const data = await get('/patient/dashboard', token);
      setDashboardData(data);
      setLoading(false);
    };
    fetchData();
  }, [token]);



  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <div className="text-center text-gray-600">Loading...</div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-6 ml-64 mt-16">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome, {user?.name}
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your appointments and medical history
            </p>
          </div>

          <div className="mb-8">
            <Link
              to="/patient/doctors"
              className="inline-block bg-[#1E3A8A] text-white px-6 py-3 rounded hover:bg-[#1E3A8A]/90"
            >
              + Book New Appointment
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Upcoming Appointments
              </h2>
              
              {dashboardData?.upcomingAppointments?.length > 0 ? (
                dashboardData.upcomingAppointments.map((appointment) => (
                  <AppointmentCard 
                    key={appointment._id} 
                    appointment={appointment} 
                  />
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-4xl mb-2">📅</p>
                  <p>No upcoming appointments</p>
                  <Link 
                    to="/patient/doctors" 
                    className="text-[#1E3A8A] hover:underline text-sm mt-2 inline-block"
                  >
                    Book an appointment now
                  </Link>
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Completed Appointments
              </h2>
              
              {dashboardData?.completedAppointments?.length > 0 ? (
                dashboardData.completedAppointments.map((appointment) => (
                  <AppointmentCard 
                    key={appointment._id} 
                    appointment={appointment} 
                  />
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-4xl mb-2">✅</p>
                  <p>No completed appointments yet</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PatientDashboard;