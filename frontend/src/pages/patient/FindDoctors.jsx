import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { get } from '../../services/api';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import DoctorCard from '../../components/DoctorCard';

const FindDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [specialization, setSpecialization] = useState('');
  const { token } = useAuth();

  const specializations = [
    'Cardiologist',
    'Dermatologist', 
    'Neurologist',
    'Pediatrician',
    'Psychiatrist',
    'Surgeon',
    'General Physician',
    'Orthopedic',
    'Gynecologist',
    'ENT Specialist'
  ];

  useEffect(() => {
    const fetchDoctors = async () => {
      const url = specialization 
        ? `/patient/doctors?specialization=${specialization}`
        : '/patient/doctors';
      
      const data = await get(url, token);
      setDoctors(data);
      setLoading(false);
    };
    fetchDoctors();
  }, [specialization, token]);

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
              Find Doctors
            </h1>
            <p className="text-gray-600 mt-1">
              Search and book appointments with our expert doctors
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Specialization
            </label>
            <select
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              className="w-full md:w-64 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
            >
              <option value="">All Specializations</option>
              {specializations.map((spec) => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
          </div>

          <div className="space-y-4">
            {doctors.length > 0 ? (
              doctors.map((doctor) => (
                <DoctorCard 
                  key={doctor._id} 
                  doctor={doctor} 
                  showBookButton={true} 
                />
              ))
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <p className="text-4xl mb-3">👨‍⚕️</p>
                <p className="text-gray-500 text-lg">No doctors found</p>
                <p className="text-gray-400 text-sm mt-1">
                  Try changing your filter or check back later
                </p>
              </div>
            )}
          </div>

          {doctors.length > 0 && (
            <p className="text-sm text-gray-500 mt-4">
              Showing {doctors.length} doctor{doctors.length > 1 ? 's' : ''}
            </p>
          )}
        </main>
      </div>
    </div>
  );
};

export default FindDoctors;