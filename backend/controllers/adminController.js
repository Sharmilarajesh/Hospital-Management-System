const User = require('../models/User');
const Appointment = require('../models/Appointment');
const bcrypt = require('bcryptjs');

// admin dashboard stats
const getDashboardStats = async (req, res) => {
    try {
        const totalDoctors = await User.countDocuments({ role: 'doctor' });
        const totalPatients = await User.countDocuments({ role: 'patient' });
        const totalAppointments = await Appointment.countDocuments();
        const pendingAppointments = await Appointment.countDocuments({ status: 'pending' });
        
        res.json({
            totalDoctors,
            totalPatients,
            totalAppointments,
            pendingAppointments
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

//  Add new doctor

const addDoctor = async (req, res) => {
    try {
        const { name, email, password, specialization, experience, phone } = req.body;
        
        if (!name || !email || !password || !specialization) {
            return res.status(400).json({ 
                message: 'Please provide all required fields' 
            });
        }
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ 
                message: 'Email already exists' 
            });
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const doctor = await User.create({
            name,
            email,
            password: hashedPassword,
            role: 'doctor',
            specialization,
            experience: experience || 0,
            phone: phone || null
        });
        
        const doctorResponse = doctor.toObject();
        delete doctorResponse.password;
        
        res.status(201).json({
            message: 'Doctor added successfully',
            doctor: doctorResponse
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

//   Get all doctors
const getDoctors = async (req, res) => {
    try {
        const doctors = await User.find({ role: 'doctor' }).select('-password');
        res.json(doctors);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

//Update doctor

const updateDoctor = async (req, res) => {
    try {
        const { name, email, specialization, experience, phone } = req.body;
        
        const doctor = await User.findById(req.params.id);
        
        if (!doctor || doctor.role !== 'doctor') {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        
        if (email && email !== doctor.email) {
            const emailExists = await User.findOne({ email, _id: { $ne: req.params.id } });
            if (emailExists) {
                return res.status(400).json({ message: 'Email already in use' });
            }
        }
        
        doctor.name = name || doctor.name;
        doctor.email = email || doctor.email;
        doctor.specialization = specialization || doctor.specialization;
        doctor.experience = experience !== undefined ? experience : doctor.experience;
        doctor.phone = phone || doctor.phone;
        
        await doctor.save();
        
        const doctorResponse = doctor.toObject();
        delete doctorResponse.password;
        
        res.json({
            message: 'Doctor updated successfully',
            doctor: doctorResponse
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete doctor

const deleteDoctor = async (req, res) => {
    try {
        const doctor = await User.findById(req.params.id);
        
        if (!doctor || doctor.role !== 'doctor') {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        
        await doctor.deleteOne();
        
        res.json({ message: 'Doctor deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

//   Get all appointments
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('patient', 'name email')
      .populate('doctor', 'name specialization')
      .sort({ createdAt: -1 }); 
    
    res.json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
    getDashboardStats,
    addDoctor,
    getDoctors,
    updateDoctor,
    deleteDoctor,
    getAllAppointments
};