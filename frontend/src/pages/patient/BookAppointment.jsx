import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { get, post } from '../../services/api';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';

const BookAppointment = () => {
  const { doctorId } = useParams(); 
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    const fetchDoctor = async () => {
      const data = await get('/patient/doctors', token);
      const found = data.find(d => d._id === doctorId);
      setDoctor(found);
      setLoading(false);
    };
    fetchDoctor();
  }, [doctorId, token]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');

    const data = await post('/patient/book', {
      doctor: doctorId,
      date,
      time
    }, token);

    if (data.appointment) {
      setMessage('Appointment booked successfully! Redirecting...');
      setTimeout(() => navigate('/patient/appointments'), 2000);
    } else {
      setMessage(data.message || 'Booking failed');
      setSubmitting(false);
    }
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

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
        
        <main className="flex-1 p-6">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 text-[#1E3A8A] hover:underline flex items-center gap-1"
          >
            ← Back to Doctors
          </button>

          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Book Appointment
          </h1>

          <div className="max-w-2xl mx-auto bg-white rounded-lg border border-gray-200 p-6">
            {doctor && (
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <h2 className="font-semibold text-gray-900">Dr. {doctor.name}</h2>
                <p className="text-gray-600 text-sm mt-1">{doctor.specialization}</p>
                <p className="text-gray-500 text-sm mt-1">Experience: {doctor.experience} years</p>
              </div>
            )}

            {message && (
              <div className={`p-3 rounded mb-4 ${
                message.includes('success') 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">
                  Appointment Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={minDate}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Select a future date (cannot book for today)
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 mb-2">
                  Appointment Time
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Choose a convenient time (9 AM - 5 PM recommended)
                </p>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#1E3A8A] text-white py-2 rounded hover:bg-[#1E3A8A]/90 disabled:opacity-50"
              >
                {submitting ? 'Booking...' : 'Confirm Booking'}
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default BookAppointment;