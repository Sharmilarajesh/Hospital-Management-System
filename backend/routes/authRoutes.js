const express = require('express');
const router = express.Router();
const { registerPatient, login } = require('../controllers/authController');


router.post('/register', registerPatient);
router.post('/login', login);

module.exports = router;