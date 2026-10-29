const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const connectDB = require('./src/config/db');
const adminRoutes = require('./src/routes/adminRoutes');
const publicRoutes = require('./src/routes/publicRoutes');

const app = express();

// Connect to Database
connectDB();

// Normalize double slashes in URL (e.g. //api/v1 -> /api/v1)
app.use((req, res, next) => {
  if (req.url.startsWith('//')) {
    req.url = req.url.replace(/^\/+/, '/');
  }
  next();
});

// Security & Utility Middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }, // Allows frontend to load images served from /uploads
  })
);

// Comprehensive CORS Middleware (Guarantees Access-Control-Allow-Origin for Netlify, Vercel & custom domains)
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  next();
});

app.use(
  cors({
    origin: (origin, callback) => callback(null, origin || true),
    credentials: true,
  })
);

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Serve local uploads and images directly from server filesystem (NO 3rd party!)
const uploadsPath = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsPath));
app.use('/images', express.static(uploadsPath));

// API Routes
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/public', publicRoutes);

// Root Health Endpoint
app.get(['/health', '/api/health'], (req, res) => {
  res.json({
    status: 'online',
    app: 'Matruka API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: `Route not found: ${req.originalUrl}` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Server Error]', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(` Matruka Backend Server running on port ${PORT}`);
  console.log(` Mode: ${process.env.NODE_ENV || 'development'}`);
  console.log(` MongoDB: ${process.env.MONGODB_URI}`);
  console.log(` Local Storage: ${uploadsPath}`);
  console.log(` Admin API: http://localhost:${PORT}/api/v1/admin`);
  console.log(` Public API: http://localhost:${PORT}/api/v1/public`);
  console.log(`=========================================`);
});
