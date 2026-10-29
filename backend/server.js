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

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-side fetch)
      if (!origin) return callback(null, true);

      const clientUrl = process.env.CLIENT_URL;
      const configuredOrigins = clientUrl ? clientUrl.split(',').map((u) => u.trim()) : [];

      const allowedOrigins = [
        ...configuredOrigins,
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'http://localhost:3001',
        'https://matruka.in',
        'https://www.matruka.in',
      ];

      // Match configured origins, any vercel or netlify deployment, or matruka domain
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith('.vercel.app') ||
        origin.endsWith('.netlify.app') ||
        origin.includes('matruka') ||
        process.env.NODE_ENV !== 'production'
      ) {
        return callback(null, true);
      }

      // Safe fallback: allow all web clients for public informational website
      return callback(null, true);
    },
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
