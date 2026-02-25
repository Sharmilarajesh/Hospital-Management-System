const express = require('express');
const router = express.Router();
const {
    getDashboard,
    getMyAppointments,
    getAppointmentDetails,
    addMedicalRecord,
    getPatientMedicalRecords ,
    updateAppointmentStatus
} = require('../controllers/doctorController');
const { protect, doctorOnly } = require('../middleware/authMiddleware');

router.use(protect);
router.use(doctorOnly);

router.get('/dashboard', getDashboard);
router.get('/appointments', getMyAppointments);
router.get('/appointment/:id', getAppointmentDetails);
router.post("/medical-record", addMedicalRecord);             
router.get("/patient/:patientId/records", getPatientMedicalRecords); 
router.put("/appointment/:id/status", updateAppointmentStatus);  


module.exports = router;