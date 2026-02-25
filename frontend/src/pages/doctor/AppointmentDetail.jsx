import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { get, post, put } from '../../services/api';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';

const AppointmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    diagnosis: '',
    prescription: '',
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    fetchDetails();
  }, [id, token]);

  const fetchDetails = async () => {
    const data = await get(`/doctor/appointment/${id}`, token);
    setData(data);
    setLoading(false);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleStatusUpdate = async (newStatus) => {
    setUpdating(true);
    setMessage('');

    const response = await put(`/doctor/appointment/${id}/status`, {
      status: newStatus
    }, token);

    if (response.appointment) {
      setMessage(`Appointment marked as ${newStatus}!`);
      fetchDetails();
    } else {
      setMessage(response.message || 'Failed to update status');
    }
    setUpdating(false);
  };

  const handleSubmitMedicalRecord = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');

    const response = await post('/doctor/medical-record', {
      patientId: data?.appointment?.patient?._id,
      diagnosis: formData.diagnosis,
      prescription: formData.prescription,
      notes: formData.notes
    }, token);

    if (response.medicalRecord) {
      setMessage('Medical record added successfully!');
      setFormData({ diagnosis: '', prescription: '', notes: '' });
      setShowAddForm(false);
      fetchDetails();
    } else {
      setMessage(response.message || 'Failed to add medical record');
    }
    setSubmitting(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const canChangeStatus = () => {
    if (data?.appointment?.status === 'completed' || data?.appointment?.status === 'cancelled') {
      return false;
    }
    return true;
  };

  const canAddMedicalRecord = () => {
    return data?.appointment?.status === 'completed' && !data?.medicalRecord;
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
          <button
            onClick={() => navigate(-1)}
            className="mb-4 text-[#1E3A8A] hover:underline flex items-center gap-1"
          >
            ← Back to Appointments
          </button>

          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Appointment Details
          </h1>

          {message && (
            <div className={`p-3 rounded mb-4 ${
              message.includes('success') || message.includes('marked')
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}>
              {message}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Appointment Information
              </h2>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Patient Name</p>
                  <p className="font-medium text-gray-900">
                    {data?.appointment?.patient?.name}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-gray-700">
                    {data?.appointment?.patient?.email}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="text-gray-700">
                    {data?.appointment?.patient?.phone || 'Not provided'}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="text-gray-700">{data?.appointment?.date}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Time</p>
                  <p className="text-gray-700">{data?.appointment?.time}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Current Status</p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(data?.appointment?.status)}`}>
                    {data?.appointment?.status}
                  </span>
                </div>

                {canChangeStatus() && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium text-gray-700">Update Status:</p>
                    <div className="flex flex-wrap gap-2">
                      {data?.appointment?.status !== 'approved' && (
                        <button
                          onClick={() => handleStatusUpdate('approved')}
                          disabled={updating}
                          className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50"
                        >
                          Approve
                        </button>
                      )}
                      
                      {data?.appointment?.status !== 'completed' && (
                        <button
                          onClick={() => handleStatusUpdate('completed')}
                          disabled={updating}
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50"
                        >
                          Mark Completed
                        </button>
                      )}
                      
                      {data?.appointment?.status !== 'cancelled' && (
                        <button
                          onClick={() => handleStatusUpdate('cancelled')}
                          disabled={updating}
                          className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {canAddMedicalRecord() && (
                  <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="mt-4 w-full bg-[#1E3A8A] text-white py-2 rounded hover:bg-[#1E3A8A]/90"
                  >
                    + Add Medical Record
                  </button>
                )}

                {data?.appointment?.status === 'completed' && data?.medicalRecord && (
                  <div className="mt-4 p-3 bg-green-50 text-green-700 rounded border border-green-200">
                     Appointment completed and medical record added
                  </div>
                )}

                {data?.appointment?.status === 'cancelled' && (
                  <div className="mt-4 p-3 bg-red-50 text-red-700 rounded border border-red-200">
                     This appointment has been cancelled
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              {data?.medicalRecord && (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Medical Record
                  </h2>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Diagnosis</p>
                      <p className="font-medium text-gray-900">
                        {data.medicalRecord.diagnosis}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Prescription</p>
                      <p className="text-gray-700 whitespace-pre-line">{data.medicalRecord.prescription}</p>
                    </div>
                    {data.medicalRecord.notes && (
                      <div>
                        <p className="text-sm text-gray-500">Notes</p>
                        <p className="text-gray-700">{data.medicalRecord.notes}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-500">Date Added</p>
                      <p className="text-gray-700">
                        {new Date(data.medicalRecord.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {showAddForm && (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Add Medical Record
                  </h2>
                  
                  <form onSubmit={handleSubmitMedicalRecord}>
                    <div className="mb-4">
                      <label className="block text-gray-700 mb-2">Diagnosis</label>
                      <input
                        type="text"
                        name="diagnosis"
                        value={formData.diagnosis}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                        placeholder="Enter diagnosis"
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-700 mb-2">Prescription</label>
                      <textarea
                        name="prescription"
                        value={formData.prescription}
                        onChange={handleInputChange}
                        rows="4"
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                        placeholder="Enter prescription details"
                        required
                      />
                    </div>

                    <div className="mb-6">
                      <label className="block text-gray-700 mb-2">Additional Notes (Optional)</label>
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                        placeholder="Enter any additional notes"
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setShowAddForm(false)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 px-4 py-2 bg-[#1E3A8A] text-white rounded hover:bg-[#1E3A8A]/90 disabled:opacity-50"
                      >
                        {submitting ? 'Saving...' : 'Save Record'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {!data?.medicalRecord && !showAddForm && data?.appointment?.status !== 'completed' && (
                <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
                  <p className="text-4xl mb-3">📋</p>
                  <p className="text-gray-500">No medical record available</p>
                  {data?.appointment?.status !== 'completed' && (
                    <p className="text-sm text-gray-400 mt-2">
                      Complete the appointment to add records
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppointmentDetail;