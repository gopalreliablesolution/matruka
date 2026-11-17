const path = require('path');
const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {}

require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const MenuItem = require('../src/models/MenuItem');

const DEFAULT_SERVICES = [
  { label: 'Personalized Antenatal Care (ANC)', url: '/services/personalized-antenatal-care', sortOrder: 1 },
  { label: 'Normal Delivery & Cesarean Section', url: '/services/normal-delivery-cesarean-section', sortOrder: 2 },
  { label: 'Painless Vaginal Delivery (Epidural)', url: '/services/painless-vaginal-delivery', sortOrder: 3 },
  { label: 'High Risk Pregnancy Management', url: '/services/high-risk-pregnancy-management', sortOrder: 4 },
  { label: 'Gynecological Endoscopic Surgeries', url: '/services/gynecological-endoscopic-surgeries', sortOrder: 5 },
  { label: 'Fertility Evaluation & Workup', url: '/services/fertility-evaluation-workup', sortOrder: 6 },
];

const DEFAULT_MEDIA = [
  { label: 'Photo Gallery', url: '/gallery', sortOrder: 1 },
  { label: 'Video Showcase (YouTube)', url: '/videos', sortOrder: 2 },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  // Find or create "Services" top-level
  let servicesParent = await MenuItem.findOne({
    $or: [{ url: '/services' }, { label: /^services$/i }],
    parentId: null,
  });

  if (!servicesParent) {
    servicesParent = await MenuItem.create({
      label: 'Services',
      url: '/services',
      sortOrder: 3,
      isHeader: true,
      isFooter: true,
      footerSection: 'quick_links',
      isActive: true,
      parentId: null,
    });
    console.log('Created Services top-level menu item');
  }

  // Seed services submenus if none exist
  const existingServiceChildren = await MenuItem.countDocuments({ parentId: servicesParent._id });
  if (existingServiceChildren === 0) {
    for (const item of DEFAULT_SERVICES) {
      await MenuItem.create({
        label: item.label,
        url: item.url,
        sortOrder: item.sortOrder,
        parentId: servicesParent._id,
        isHeader: true,
        isFooter: false,
        isActive: true,
      });
      console.log(`Created submenu under Services: ${item.label}`);
    }
  } else {
    console.log(`Services already has ${existingServiceChildren} submenus`);
  }

  // Find or create "Media" top-level
  let mediaParent = await MenuItem.findOne({
    $or: [{ url: '/media' }, { label: /^media$/i }],
    parentId: null,
  });

  if (!mediaParent) {
    // If there is an existing Gallery top-level, convert or create Media
    const galleryItem = await MenuItem.findOne({ url: '/gallery', parentId: null });
    if (galleryItem) {
      galleryItem.label = 'Media';
      galleryItem.url = '/media';
      await galleryItem.save();
      mediaParent = galleryItem;
      console.log('Updated Gallery top-level to Media');
    } else {
      mediaParent = await MenuItem.create({
        label: 'Media',
        url: '/media',
        sortOrder: 6,
        isHeader: true,
        isFooter: true,
        footerSection: 'quick_links',
        isActive: true,
        parentId: null,
      });
      console.log('Created Media top-level menu item');
    }
  }

  // Seed media submenus if none exist
  const existingMediaChildren = await MenuItem.countDocuments({ parentId: mediaParent._id });
  if (existingMediaChildren === 0) {
    for (const item of DEFAULT_MEDIA) {
      await MenuItem.create({
        label: item.label,
        url: item.url,
        sortOrder: item.sortOrder,
        parentId: mediaParent._id,
        isHeader: true,
        isFooter: false,
        isActive: true,
      });
      console.log(`Created submenu under Media: ${item.label}`);
    }
  } else {
    console.log(`Media already has ${existingMediaChildren} submenus`);
  }

  // Ensure all top-level items have clean sortOrder 1, 2, 3...
  const topLevels = await MenuItem.find({ parentId: null }).sort({ sortOrder: 1, createdAt: 1 });
  for (let i = 0; i < topLevels.length; i++) {
    topLevels[i].sortOrder = i + 1;
    await topLevels[i].save();
  }

  console.log('Seeding completed successfully!');
  await mongoose.disconnect();
}

seed().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
