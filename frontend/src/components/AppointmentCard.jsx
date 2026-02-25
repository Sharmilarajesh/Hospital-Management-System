import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AppointmentCard = ({ appointment }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

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

  const handleCardClick = () => {
    if (appointment.status === 'completed') {
      if (user?.role === 'patient') {
        navigate('/patient/medical-history');
      } else if (user?.role === 'doctor') {
        navigate(`/doctor/appointment/${appointment._id}`);
      }
    } else {
      if (user?.role === 'patient') {
        return;
      } else if (user?.role === 'doctor') {
        navigate(`/doctor/appointment/${appointment._id}`);
      }
    }
  };

  return (
    <div 
      onClick={handleCardClick}
      className={`bg-white rounded-lg border border-gray-200 p-4 mb-3 ${
        appointment.status === 'completed' && user?.role === 'patient'
          ? 'cursor-pointer hover:shadow-md transition hover:border-blue-300' 
          : ''
      }`}
    >
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-semibold text-gray-900">
            Dr. {appointment.doctor?.name}
          </h4>
          <p className="text-sm text-gray-600">
            {appointment.doctor?.specialization}
          </p>
          <div className="mt-2 text-sm text-gray-700">
            <p>📅 Date: {appointment.date}</p>
            <p>⏰ Time: {appointment.time}</p>
          </div>
          
          {appointment.status === 'completed' && user?.role === 'patient' && (
            <p className="text-xs text-blue-600 mt-2">
              Click to view medical history
            </p>
          )}
        </div>
        
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
          {appointment.status}
        </span>
      </div>
    </div>
  );
};

export default AppointmentCard;