import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { get } from '../../services/api';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import AppointmentCard from '../../components/AppointmentCard';

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchAppointments = async () => {
      const data = await get('/patient/appointments', token);
      setAppointments(data);
      setLoading(false);
    };
    fetchAppointments();
  }, [token]);

  const pendingAppointments = appointments.filter(a => a.status === 'pending' || a.status === 'approved');
  const completedAppointments = appointments.filter(a => a.status === 'completed');
  const cancelledAppointments = appointments.filter(a => a.status === 'cancelled');

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
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              My Appointments
            </h1>
            <p className="text-gray-600 mt-1">
              View all your appointments
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-bold text-yellow-600">{pendingAppointments.length}</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-blue-600">{completedAppointments.length}</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <p className="text-sm text-gray-600">Cancelled</p>
              <p className="text-2xl font-bold text-red-600">{cancelledAppointments.length}</p>
            </div>
          </div>

          {pendingAppointments.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Active Appointments
              </h2>
              {pendingAppointments.map((appointment) => (
                <AppointmentCard 
                  key={appointment._id} 
                  appointment={appointment} 
                />
              ))}
            </div>
          )}

          {completedAppointments.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Completed Appointments
              </h2>
              <div className="space-y-3">
                {completedAppointments.map((appointment) => (
                  <AppointmentCard 
                    key={appointment._id} 
                    appointment={appointment} 
                  />
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-2 text-center">
                Click on any completed appointment to view your medical history
              </p>
            </div>
          )}

          {cancelledAppointments.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Cancelled Appointments
              </h2>
              {cancelledAppointments.map((appointment) => (
                <AppointmentCard 
                  key={appointment._id} 
                  appointment={appointment} 
                />
              ))}
            </div>
          )}

          {appointments.length === 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <p className="text-4xl mb-3">📅</p>
              <p className="text-gray-500 text-lg">No appointments found</p>
              <p className="text-gray-400 text-sm mt-1">
                <a href="/patient/doctors" className="text-[#1E3A8A] hover:underline">
                  Book your first appointment
                </a>
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default MyAppointments;