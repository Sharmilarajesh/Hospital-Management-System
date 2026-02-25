import { useNavigate } from 'react-router-dom';

const DoctorCard = ({ doctor, showBookButton = false }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Dr. {doctor.name}
          </h3>
          <p className="text-gray-600">{doctor.specialization}</p>
          <p className="text-sm text-gray-500 mt-1">
            Experience: {doctor.experience} years
          </p>
          {doctor.phone && (
            <p className="text-sm text-gray-500 mt-1">
              📞 {doctor.phone}
            </p>
          )}
        </div>

        {showBookButton && (
          <button
            onClick={() => navigate(`/patient/book/${doctor._id}`)}
            className="bg-[#1E3A8A] text-white px-4 py-2 rounded hover:bg-[#1E3A8A]/90"
          >
            Book Appointment
          </button>
        )}
      </div>
    </div>
  );
};

export default DoctorCard;