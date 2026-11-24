const HomepageSection = require('../models/HomepageSection');
const ActivityLog = require('../models/ActivityLog');

const DEFAULT_SECTIONS = [
  { sectionKey: 'hero_slider', name: 'Hero Banner & Slider', title: 'Complete Care For Her', isEnabled: true, sortOrder: 1 },
  { sectionKey: 'emergency_ribbon', name: 'Emergency & Timings Ribbon', title: 'Clinic Contact & Timings', isEnabled: true, sortOrder: 2 },
  { sectionKey: 'about_clinic', name: 'About Matruka Overview', title: 'Compassionate Women’s Healthcare', isEnabled: true, sortOrder: 3 },
  { sectionKey: 'care_statistics', name: 'Care Highlights & Statistics', title: 'Why Women Trust Matruka', isEnabled: true, sortOrder: 4 },
  { sectionKey: 'services_specialities', name: 'Services & Specialities', title: 'Our Clinical Specialities', isEnabled: true, sortOrder: 5 },
  { sectionKey: 'why_choose_us', name: 'Why Choose Matruka', title: 'Specialized Expertise, Gentle Care', isEnabled: true, sortOrder: 6 },
  { sectionKey: 'maternity_pathway', name: 'Maternity Journey Pathway', title: 'Your Pathway to Motherhood — Complete Care at Every Step', isEnabled: true, sortOrder: 7 },
  { sectionKey: 'featured_doctors', name: 'Our Expert Doctors', title: 'Meet Dr. Kairavi Yagnik & Dr. Rut Shah', isEnabled: true, sortOrder: 8 },
  { sectionKey: 'facilities_infrastructure', name: 'Clinic Facilities & Technology', title: 'Modern Medical Infrastructure', isEnabled: true, sortOrder: 9 },
  { sectionKey: 'gallery_preview', name: 'Gallery Preview', title: 'Inside Matruka Clinic', isEnabled: true, sortOrder: 10 },
  { sectionKey: 'testimonials', name: 'Patient Stories & Reviews', title: 'Words From Our Mothers & Patients', isEnabled: true, sortOrder: 11 },
  { sectionKey: 'latest_blogs', name: 'Pregnancy & Health Articles', title: 'Educational Health Knowledge', isEnabled: true, sortOrder: 12 },
  { sectionKey: 'faqs', name: 'Frequently Asked Questions', title: 'Common Questions & Answers', isEnabled: true, sortOrder: 13 },
  { sectionKey: 'location_contact', name: 'Clinic Location & OPD Schedule', title: 'Visit Us at Solaris Cure, VIP Road', isEnabled: true, sortOrder: 14 },
];

exports.getSections = async (req, res) => {
  try {
    let sections = await HomepageSection.find().sort({ sortOrder: 1 });

    // Auto-ensure any newly introduced core sections exist in the database
    const existingKeys = new Set(sections.map((s) => s.sectionKey));
    const missingSections = DEFAULT_SECTIONS.filter((ds) => !existingKeys.has(ds.sectionKey));

    if (missingSections.length > 0) {
      await HomepageSection.insertMany(missingSections);
      sections = await HomepageSection.find().sort({ sortOrder: 1 });
    }

    res.json({ success: true, data: sections });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch homepage sections' });
  }
};

exports.updateSection = async (req, res) => {
  try {
    const section = await HomepageSection.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!section) return res.status(404).json({ success: false, error: 'Section not found' });

    await ActivityLog.create({
      userId: req.user?._id?.toString() || 'admin',
      userName: req.user?.name || 'Admin',
      action: 'update',
      module: 'homepage',
      description: `Updated homepage section: ${section.name}`,
    });

    res.json({ success: true, data: section });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update section' });
  }
};

exports.bulkUpdateOrder = async (req, res) => {
  try {
    const { sections } = req.body; // Array of { id, sortOrder, isEnabled }
    if (!Array.isArray(sections)) {
      return res.status(400).json({ success: false, error: 'Sections array is required' });
    }

    const updates = sections.map((sec) =>
      HomepageSection.findByIdAndUpdate(sec.id, {
        sortOrder: sec.sortOrder,
        isEnabled: sec.isEnabled !== undefined ? sec.isEnabled : true,
      })
    );
    await Promise.all(updates);

    res.json({ success: true, message: 'Homepage sections reordered successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to reorder sections' });
  }
};

