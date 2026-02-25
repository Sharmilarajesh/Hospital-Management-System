import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { get } from '../../services/api';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';

const MedicalHistory = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    fetchRecords();
  }, [token]);

  const fetchRecords = async () => {
    const data = await get('/patient/medical-history', token);
    setRecords(data);
    setLoading(false);
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
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Medical History
            </h1>
            <p className="text-gray-600 mt-1">
              View all your diagnoses and prescriptions
            </p>
          </div>

          {records.length > 0 ? (
            <div className="space-y-4">
              {records.map((record) => (
                <div key={record._id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Dr. {record.doctor?.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {record.doctor?.specialization}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500">
                      {new Date(record.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Diagnosis</p>
                      <p className="text-gray-900 font-medium">{record.diagnosis}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Prescription</p>
                      <p className="text-gray-700 whitespace-pre-line">{record.prescription}</p>
                    </div>
                    {record.notes && (
                      <div>
                        <p className="text-sm text-gray-500">Additional Notes</p>
                        <p className="text-gray-700">{record.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <p className="text-5xl mb-4">📋</p>
              <p className="text-gray-500 text-lg">No medical records found</p>
              <p className="text-gray-400 text-sm mt-2">
                Your medical history will appear here after your doctor adds records
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default MedicalHistory;