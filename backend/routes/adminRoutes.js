const express = require('express');
const router = express.Router();
const {
    getDashboardStats,
    addDoctor,
    getDoctors,
    updateDoctor,
    deleteDoctor,
    getAllAppointments
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.use(protect);
router.use(adminOnly);

router.get('/dashboard', getDashboardStats);
router.post('/doctor', addDoctor);
router.get('/doctors', getDoctors);
router.put('/doctor/:id', updateDoctor);
router.delete('/doctor/:id', deleteDoctor);
router.get('/appointments', getAllAppointments);

module.exports = router;