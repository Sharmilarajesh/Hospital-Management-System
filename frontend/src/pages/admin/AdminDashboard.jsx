import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { get } from "../../services/api";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import StatCard from "../../components/StatCard"; // Import StatCard

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, token } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsData = await get("/admin/dashboard", token);
        setStats(statsData);

        const appointmentsData = await get("/admin/appointments", token);
        if (appointmentsData && appointmentsData.length > 0) {
          const sorted = appointmentsData
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5);
          setAppointments(sorted);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome, {user?.name}
            </h1>
            <p className="text-gray-600">Hospital Overview</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <StatCard
              title="Total Doctors"
              value={stats?.totalDoctors || 0}
              color="blue"
            />
            <StatCard
              title="Total Patients"
              value={stats?.totalPatients || 0}
              color="green"
            />
            <StatCard
              title="Total Appointments"
              value={stats?.totalAppointments || 0}
              color="purple"
            />
            <StatCard
              title="Pending"
              value={stats?.pendingAppointments || 0}
              color="yellow"
            />
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Recent Appointments
            </h2>

            {appointments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                        Patient
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                        Doctor
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                        Date
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((apt) => (
                      <tr
                        key={apt._id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-3 px-4 text-gray-900">
                          {apt.patient?.name || "Unknown"}
                        </td>
                        <td className="py-3 px-4 text-gray-900">
                          Dr. {apt.doctor?.name || "Unknown"}
                        </td>
                        <td className="py-3 px-4 text-gray-600">{apt.date}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(apt.status)}`}
                          >
                            {apt.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p className="text-5xl mb-3">📅</p>
                <p className="text-lg">No appointments found</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
