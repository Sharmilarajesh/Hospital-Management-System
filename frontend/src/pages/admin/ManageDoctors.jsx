import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { get, post, put, del } from '../../services/api';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';

const ManageDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [message, setMessage] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    specialization: '',
    experience: '',
    phone: ''
  });

  const { token } = useAuth();

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    const data = await get('/admin/doctors', token);
    setDoctors(data);
    setLoading(false);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddClick = () => {
    setEditingDoctor(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      specialization: '',
      experience: '',
      phone: ''
    });
    setMessage('');
    setShowModal(true);
  };

  const handleEditClick = (doctor) => {
    setEditingDoctor(doctor);
    setFormData({
      name: doctor.name,
      email: doctor.email,
      password: '',
      specialization: doctor.specialization,
      experience: doctor.experience,
      phone: doctor.phone || ''
    });
    setMessage('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    let data;
    if (editingDoctor) {
      data = await put(`/admin/doctor/${editingDoctor._id}`, formData, token);
    } else {
      data = await post('/admin/doctor', formData, token);
    }

    if (data.message) {
      setMessage(data.message);
      if (!data.error) {
        setTimeout(() => {
          setShowModal(false);
          fetchDoctors();
        }, 1500);
      }
    }
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      const data = await del(`/admin/doctor/${id}`, token);
      if (data.message) {
        fetchDoctors();
      }
    }
  };

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
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Manage Doctors
            </h1>
            <button
              onClick={handleAddClick}
              className="bg-[#1E3A8A] text-white px-4 py-2 rounded hover:bg-[#1E3A8A]/90"
            >
              + Add New Doctor
            </button>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Specialization</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Experience</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {doctors.map((doctor) => (
                  <tr key={doctor._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-900">Dr. {doctor.name}</td>
                    <td className="px-6 py-4 text-gray-600">{doctor.email}</td>
                    <td className="px-6 py-4 text-gray-600">{doctor.specialization}</td>
                    <td className="px-6 py-4 text-gray-600">{doctor.experience} years</td>
                    <td className="px-6 py-4 text-gray-600">{doctor.phone || '-'}</td>
                    <td className="px-6 py-4">
                      <button onClick={() => handleEditClick(doctor)} className="text-[#1E3A8A] hover:underline mr-3">Edit</button>
                      <button onClick={() => handleDeleteClick(doctor._id)} className="text-red-600 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {doctors.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No doctors found. Click "Add New Doctor" to create one.
              </div>
            )}
          </div>

          {showModal && (
            <div className="fixed inset-0 bg-gray-50 bg-opacity-50 flex items-start justify-center z-50 overflow-y-auto">
              <div className="min-h-screen py-4 md:py-8 px-4 flex items-start justify-center w-full">
                <div className="bg-white rounded-lg border border-gray-200 p-6 md:p-8 w-full max-w-2xl my-4 md:my-8">
                  <h2 className="text-2xl font-bold text-center mb-6 md:mb-8 text-gray-900">
                    {editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}
                  </h2>
                  
                  {message && (
                    <div className={`p-3 rounded mb-4 ${
                      message.includes('success') || message.includes('added') || message.includes('updated')
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {message}
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      <div className="mb-2 md:mb-0">
                        <label className="block text-gray-700 mb-2">Full Name</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                          placeholder="Enter doctor's full name"
                          required
                        />
                      </div>

                      <div className="mb-2 md:mb-0">
                        <label className="block text-gray-700 mb-2">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                          placeholder="Enter email address"
                          required
                        />
                      </div>

                      {!editingDoctor && (
                        <div className="mb-2 md:mb-0">
                          <label className="block text-gray-700 mb-2">Password</label>
                          <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                            placeholder="Enter password"
                            required
                          />
                        </div>
                      )}

                      <div className="mb-2 md:mb-0">
                        <label className="block text-gray-700 mb-2">Specialization</label>
                        <input
                          type="text"
                          name="specialization"
                          value={formData.specialization}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                          placeholder="e.g., Cardiologist"
                          required
                        />
                      </div>

                      <div className="mb-2 md:mb-0">
                        <label className="block text-gray-700 mb-2">Experience (years)</label>
                        <input
                          type="number"
                          name="experience"
                          value={formData.experience}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                          placeholder="Years"
                          required
                        />
                      </div>

                      <div className="mb-2 md:mb-0">
                        <label className="block text-gray-700 mb-2">Phone Number</label>
                        <input
                          type="text"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                          placeholder="Enter phone number"
                        />
                      </div>
                    </div>

                    <div className="mt-6">
                      <button
                        type="submit"
                        className="w-full bg-[#1E3A8A] text-white py-2 rounded hover:bg-[#1E3A8A]/90"
                      >
                        {editingDoctor ? 'Update Doctor' : 'Add Doctor'}
                      </button>
                    </div>
                  </form>

                  <p className="mt-4 text-center text-gray-600">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="text-[#1E3A8A] hover:underline"
                    >
                      Cancel
                    </button>
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ManageDoctors;