require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import config
const config = require('./config/config');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// ===== CONFIGURATION =====
const { PORT, MONGO_URI, JWT_SECRET, EMAIL_USER, EMAIL_PASS, CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = config;

// Make config available globally
global.config = config;

// Kết nối MongoDB Atlas
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Middlewares
app.use(cors()); // Cho phép cross-origin
app.use(express.json()); // Parse JSON body
app.use(express.urlencoded({ limit: '50mb', extended: true })); // Parse form-data

// Routes
app.use('/', authRoutes); // Routes cho /signup, /login, /forgot-password...
app.use('/', userRoutes); // Routes cho /profile, /users, /upload-avatar...

// Xử lý lỗi (Cơ bản)
app.use((err, req, res) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Something broke!'
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});