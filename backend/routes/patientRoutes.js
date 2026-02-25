const express = require('express');
const router = express.Router();
const {
    getDashboard,
    getDoctors,
    bookAppointment,
    getMyAppointments,
    getMedicalHistory
} = require('../controllers/patientController');
const { protect, patientOnly } = require('../middleware/authMiddleware');

router.use(protect);
router.use(patientOnly);

router.get('/dashboard', getDashboard);
router.get('/doctors', getDoctors);
router.post('/book', bookAppointment);
router.get('/appointments', getMyAppointments);
router.get('/medical-history', getMedicalHistory);

module.exports = router;