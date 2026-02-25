import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { get } from '../../services/api';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import StatCard from '../../components/StatCard';
import AppointmentCard from '../../components/AppointmentCard';

const DoctorDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, token } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      const data = await get('/doctor/dashboard', token);
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
          <main className="flex-1 p-6 ml-64 mt-16">
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
              Welcome, Dr. {user?.name}
            </h1>
            {user?.specialization && (
              <p className="text-gray-600 mt-1">
                {user.specialization} • {user.experience} years experience
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard 
              title="Today's Appointments" 
              value={dashboardData?.todayAppointments || 0} 
              color="blue"
            />
            <StatCard 
              title="Completed" 
              value={dashboardData?.completedAppointments || 0} 
              color="green"
            />
            <StatCard 
              title="Total Patients" 
              value={dashboardData?.totalPatients || 0} 
              color="purple"
            />
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Upcoming Appointments
            </h2>
            {dashboardData?.upcomingAppointments?.length > 0 ? (
              dashboardData.upcomingAppointments.map((appointment) => (
                <AppointmentCard key={appointment._id} appointment={appointment} />
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No upcoming appointments</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DoctorDashboard;