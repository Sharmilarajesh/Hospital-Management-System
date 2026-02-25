const User = require('../models/User');
const bcrypt = require('bcryptjs');

const seedAdmin = async () => {
    try {
        const adminExists = await User.findOne({ role: 'admin' });
        
        if (!adminExists) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('admin123', salt);
            
            await User.create({
                name: 'Super Admin',
                email: 'admin@hms.com',
                password: hashedPassword,
                role: 'admin',
                phone: '0000000000'
            });
            
            console.log('Admin seeded successfully');
            console.log('Email: admin@hms.com');
            console.log('Password: admin123');
        } else {
            console.log('Admin already exists');
        }
    } catch (error) {
        console.error('Error seeding admin:', error.message);
    }
};

module.exports = seedAdmin;