const fs = require('fs');
const path = require('path');
const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {}

require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');

const frontendBlogsDir = path.join(__dirname, '../../frontend/public/images/blogs');
const backendBlogsDir = path.join(__dirname, '../uploads/blogs');

[frontendBlogsDir, backendBlogsDir].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// 1. Ensure missing blog images exist on disk in both public and uploads
const srcLaparoscopy = path.join(frontendBlogsDir, 'blog_laparoscopy_benefits.jpg');
const srcNutrition = path.join(frontendBlogsDir, 'blog_ivf_premature.png');
const srcDefault = path.join(frontendBlogsDir, 'blog_fibroids_pregnancy.png');

if (fs.existsSync(srcLaparoscopy)) {
  fs.copyFileSync(srcLaparoscopy, path.join(frontendBlogsDir, 'laparoscopy-guide.jpg'));
  fs.copyFileSync(srcLaparoscopy, path.join(backendBlogsDir, 'laparoscopy-guide.jpg'));
  console.log('Copied laparoscopy-guide.jpg');
}

if (fs.existsSync(srcNutrition)) {
  fs.copyFileSync(srcNutrition, path.join(frontendBlogsDir, 'pregnancy-nutrition.jpg'));
  fs.copyFileSync(srcNutrition, path.join(backendBlogsDir, 'pregnancy-nutrition.jpg'));
  console.log('Copied pregnancy-nutrition.jpg');
}

if (fs.existsSync(srcDefault)) {
  fs.copyFileSync(srcDefault, path.join(frontendBlogsDir, 'default-blog.jpg'));
  fs.copyFileSync(srcDefault, path.join(backendBlogsDir, 'default-blog.jpg'));
  console.log('Copied default-blog.jpg');
}

// Sync all images between frontend/public/images/blogs and backend/uploads/blogs
const frontendFiles = fs.readdirSync(frontendBlogsDir);
frontendFiles.forEach(file => {
  const src = path.join(frontendBlogsDir, file);
  const dest = path.join(backendBlogsDir, file);
  if (fs.statSync(src).isFile() && !fs.existsSync(dest)) {
    fs.copyFileSync(src, dest);
    console.log(`Synced to backend uploads: ${file}`);
  }
});

async function verifyDb() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
  const { Blog } = require('../src/models/Blog');

  const blogs = await Blog.find();
  console.log(`Auditing ${blogs.length} blogs in DB...`);

  for (const b of blogs) {
    let img = b.featuredImage;
    if (!img || img === '/images/blogs/default-blog.jpg') {
      b.featuredImage = '/images/blogs/blog_fibroids_pregnancy.png';
      await b.save();
      console.log(`Updated default image on ${b.title}`);
    } else {
      // Check if image filename exists on disk
      const filename = path.basename(img);
      const exists = fs.existsSync(path.join(frontendBlogsDir, filename));
      if (!exists) {
        console.log(`WARNING: ${filename} does not exist for "${b.title}", fixing to blog_laparoscopy_benefits.jpg`);
        b.featuredImage = '/images/blogs/blog_laparoscopy_benefits.jpg';
        await b.save();
      } else {
        console.log(`OK: "${b.title}" -> ${img}`);
      }
    }
  }

  await mongoose.disconnect();
  console.log('DB Audit complete!');
}

verifyDb().catch(console.error);
