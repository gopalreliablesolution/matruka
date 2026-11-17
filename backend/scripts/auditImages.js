const path = require('path');
const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {}

require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');

async function auditImages() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to DB');

  const Doctor = mongoose.model('Doctor', new mongoose.Schema({}, { strict: false }));
  const { Service } = require('../src/models/Service');
  const Facility = mongoose.model('Facility', new mongoose.Schema({}, { strict: false }));
  const { Blog } = require('../src/models/Blog');
  const { GalleryItem } = require('../src/models/GalleryAlbum');
  const Banner = mongoose.model('Banner', new mongoose.Schema({}, { strict: false }));

  console.log('\n--- BLOGS ---');
  const blogs = await Blog.find();
  blogs.forEach(b => {
    console.log(`[Blog: ${b.title}] featuredImage: "${b.featuredImage}"`);
  });

  console.log('\n--- DOCTORS ---');
  const doctors = await Doctor.find();
  doctors.forEach(d => {
    console.log(`[Doctor: ${d.name}] photo: "${d.photo || d.image}"`);
  });

  console.log('\n--- SERVICES ---');
  const services = await Service.find();
  services.forEach(s => {
    console.log(`[Service: ${s.title || s.name}] icon: "${s.icon}", image: "${s.image}"`);
  });

  console.log('\n--- FACILITIES ---');
  const facilities = await Facility.find();
  facilities.forEach(f => {
    console.log(`[Facility: ${f.name}] image: "${f.image}"`);
  });

  console.log('\n--- GALLERY ---');
  const gallery = await GalleryItem.find();
  gallery.forEach(g => {
    console.log(`[Gallery: ${g.title}] imageUrl: "${g.imageUrl}"`);
  });

  console.log('\n--- BANNERS ---');
  const banners = await Banner.find();
  banners.forEach(b => {
    console.log(`[Banner: ${b.title}] imageUrl: "${b.imageUrl}"`);
  });

  await mongoose.disconnect();
}

auditImages().catch(console.error);
