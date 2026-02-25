const Appointment = require('../models/Appointment');
const MedicalRecord = require('../models/MedicalRecord');
const User = require('../models/User');

//   Get patient dashboard
const getDashboard = async (req, res) => {
    try {
        const patientId = req.user._id;
        
        const upcomingAppointments = await Appointment.find({ 
            patient: patientId, 
            status: 'pending' 
        })
        .populate('doctor', 'name email specialization')
        .sort({ createdAt: -1 });
        
        const completedAppointments = await Appointment.find({ 
            patient: patientId, 
            status: 'completed' 
        })
        .populate('doctor', 'name email specialization')
        .sort({ createdAt: -1 });
        
        res.json({
            upcomingAppointments,
            completedAppointments
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

//    Get all doctors 
const getDoctors = async (req, res) => {
    try {
        const { specialization } = req.query;
        
        let filter = { role: 'doctor' };
        if (specialization) {
            filter.specialization = specialization;
        }
        
        const doctors = await User.find(filter)
            .select('name email specialization experience phone')
            .sort({ name: 1 });
        
        res.json(doctors);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

//   Book  appointment
const bookAppointment = async (req, res) => {
    try {
        const { doctor, date, time } = req.body;
        const patientId = req.user._id;
        
        if (!doctor || !date || !time) {
            return res.status(400).json({ 
                message: 'Please provide all required fields' 
            });
        }
        
        const doctorExists = await User.findOne({ _id: doctor, role: 'doctor' });
        if (!doctorExists) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        
        const existingAppointment = await Appointment.findOne({
            patient: patientId,
            date,
            time,
            status: { $in: ['pending', 'approved'] }
        });
        
        if (existingAppointment) {
            return res.status(400).json({ 
                message: 'You already have an appointment at this time' 
            });
        }
        
        const appointment = await Appointment.create({
            patient: patientId,
            doctor,
            date,
            time,
            status: 'pending'
        });
        
        await appointment.populate('doctor', 'name email specialization');
        
        res.status(201).json({
            message: 'Appointment booked successfully',
            appointment
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

//Get patient's appointments
const getMyAppointments = async (req, res) => {
    try {
        const patientId = req.user._id;
        
        const appointments = await Appointment.find({ patient: patientId })
            .populate('doctor', 'name email specialization')
            .sort({ createdAt: -1 });
        
        res.json(appointments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

//   Get patient's medical history
const getMedicalHistory = async (req, res) => {
    try {
        const patientId = req.user._id;
        
        const medicalRecords = await MedicalRecord.find({ patient: patientId })
            .populate('doctor', 'name email specialization')
            .sort({ createdAt: -1 });
        
        res.json(medicalRecords);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    getDashboard,
    getDoctors,
    bookAppointment,
    getMyAppointments,
    getMedicalHistory
};