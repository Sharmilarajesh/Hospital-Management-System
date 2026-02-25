const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const seedAdmin = require('./seed/seedAdmin');
const path = require('path');

dotenv.config();

connectDB();
seedAdmin();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS Configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',
    process.env.CORS_ORIGIN || 'https://your-frontend-url.onrender.com'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/doctor', require('./routes/doctorRoutes'));
app.use('/api/patient', require('./routes/patientRoutes'));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  
  app.get('/*', (req, res) => {   // ← changed from '*'
    if (!req.path.startsWith('/api/')) {
      res.sendFile(
        path.join(__dirname, '../frontend/dist/index.html')
      );
    }
  });
}

app.get('/', (req, res) => {
  res.json({
    message: '🏥 Hospital Management System API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      admin: '/api/admin',
      doctor: '/api/doctor',
      patient: '/api/patient'
    },
    environment: process.env.NODE_ENV || 'development'
  });
});

app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error:
      process.env.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message
  });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`
  );
  console.log(`Local: http://localhost:${PORT}`);
});