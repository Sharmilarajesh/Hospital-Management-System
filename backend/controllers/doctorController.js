const Appointment = require('../models/Appointment');
const MedicalRecord = require('../models/MedicalRecord');
const User = require('../models/User');

//    doctor dashboard
const getDashboard = async (req, res) => {
    try {
        const doctorId = req.user._id;
        
        const todayAppointments = await Appointment.countDocuments({ 
            doctor: doctorId, 
            status: 'pending' 
        });
        
        const completedAppointments = await Appointment.countDocuments({ 
            doctor: doctorId, 
            status: 'completed' 
        });
        
        const patientsList = await Appointment.distinct('patient', { 
            doctor: doctorId 
        });
        const totalPatients = patientsList.length;
        
        const upcomingAppointments = await Appointment.find({ 
            doctor: doctorId, 
            status: 'pending' 
        })
        .populate('patient', 'name email phone')
        .sort({ createdAt: -1 })
        .limit(10);
        
        res.json({
            todayAppointments,
            completedAppointments,
            totalPatients,
            upcomingAppointments
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

//   Get doctor's appointments
const getMyAppointments = async (req, res) => {
    try {
        const doctorId = req.user._id;
        
        const appointments = await Appointment.find({ doctor: doctorId })
            .populate('patient', 'name email phone')
            .sort({ createdAt: -1 });
        
        res.json(appointments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

//    Get appointment details with medical record
const getAppointmentDetails = async (req, res) => {
    try {
        const appointmentId = req.params.id;
        const doctorId = req.user._id;
        
        const appointment = await Appointment.findOne({ 
            _id: appointmentId, 
            doctor: doctorId 
        }).populate('patient', 'name email phone');
        
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        
        const medicalRecord = await MedicalRecord.findOne({ 
            patient: appointment.patient._id, 
            doctor: doctorId 
        }).sort({ createdAt: -1 });
        
        res.json({
            appointment,
            medicalRecord: medicalRecord || null
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

//  Add medical record for patient
const addMedicalRecord = async (req, res) => {
  try {
    const { patientId, diagnosis, prescription, notes } = req.body;
    const doctorId = req.user._id;

    const appointment = await Appointment.findOne({
      patient: patientId,
      doctor: doctorId,
      status: 'completed'
    });

    if (!appointment) {
      return res.status(400).json({ 
        message: 'You can only add medical records for patients you have treated' 
      });
    }

  
    const medicalRecord = await MedicalRecord.create({
      patient: patientId,
      doctor: doctorId,
      diagnosis,
      prescription,
      notes: notes || ''
    });

    res.status(201).json({
      message: 'Medical record added successfully',
      medicalRecord
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

//   Get medical records for a specific patient
const getPatientMedicalRecords = async (req, res) => {
  try {
    const { patientId } = req.params;
    const doctorId = req.user._id;

    const records = await MedicalRecord.find({
      patient: patientId,
      doctor: doctorId
    }).sort({ createdAt: -1 });

    res.json(records);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Update appointment status
const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const doctorId = req.user._id;

    const validStatuses = ['pending', 'approved', 'completed', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const appointment = await Appointment.findOne({
      _id: id,
      doctor: doctorId
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    appointment.status = status;
    await appointment.save();

    res.json({
      message: 'Appointment status updated successfully',
      appointment
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getDashboard,
  getMyAppointments,
  getAppointmentDetails,
  addMedicalRecord,
  getPatientMedicalRecords,
  updateAppointmentStatus
};


