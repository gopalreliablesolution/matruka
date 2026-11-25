const path = require('path');

// Test runs receive an explicit isolated environment and must never source backend/.env.
if (process.env.NODE_ENV !== 'test') {
  require('dotenv').config();
}

// Sanitize MongoDB URIs to remove any enclosing quotes (e.g. from environment managers or .env)
for (const key of ['MONGODB_URI', 'MONGO_URI']) {
  if (process.env[key]) {
    process.env[key] = process.env[key].trim().replace(/^["']|["']$/g, '').trim();
  }
}

const app = require('./app');
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 5000;
const uploadsPath = path.join(__dirname, 'uploads');

if (require.main === module) {
  connectDB().then(() => {
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
  });
}

module.exports = app;
