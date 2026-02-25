const User = require('../models/User');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken'); // Import from utils

//  Register a new patient
const registerPatient = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;
      
        if (!name || !email || !password) {
            return res.status(400).json({ 
                message: 'Please provide all required fields' 
            });
        }
        
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ 
                message: 'User already exists with this email' 
            });
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: 'patient',
            phone: phone || null
        });
        
        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id, user.role) 
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

//   Login user
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ 
                message: 'Please provide email and password' 
            });
        }
        
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(401).json({ 
                message: 'Invalid email or password' 
            });
        }
        
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        
        if (!isPasswordMatch) {
            return res.status(401).json({ 
                message: 'Invalid email or password' 
            });
        }
        
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            specialization: user.specialization, 
            experience: user.experience,         
            phone: user.phone,
            token: generateToken(user._id, user.role) 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { registerPatient, login };