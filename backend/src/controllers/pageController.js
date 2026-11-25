const Page = require('../models/Page');
const ActivityLog = require('../models/ActivityLog');

const DEFAULT_PAGES = {
  'privacy-policy': {
    title: 'Privacy Policy',
    heroTitle: 'Privacy Policy',
    heroSubtitle: 'Your privacy, trust, and patient confidentiality are of paramount importance to Matruka — Complete Care for Her.',
    content: `### 1. Informational Purpose & Online Requests
This website provides public informational and educational guidance regarding the clinical services, doctors, facilities, and visiting guidelines of Matruka — Complete Care for Her. The website also allows users to submit basic appointment requests (such as name, contact number, preferred date/time, and concern summary) to help with consultation scheduling. We do not collect payment information through this website and request that sensitive diagnostic records only be shared in person during your clinical visit.

### 2. Patient Confidentiality
All personal data submitted through contact forms or consultation booking modules is strictly confidential and accessed solely by our clinic administration for scheduling and care coordination. We never sell, rent, or trade your contact details with external commercial third parties.

### 3. External Links & Communication
Our website includes convenient shortcuts to WhatsApp, direct calling links, and Google Maps directions. When interacting with these external services, their respective privacy policies apply.

### 4. Contact Information
For questions regarding our privacy practices or data inquiries, contact us directly:
- Address: Solaris Cure, Beside Ratnajyoti Apartment, VIP Road, Surat - 395007
- Phone: +91 79848 82273
- OPD Hours: 10:00 AM - 1:00 PM & 5:00 PM - 7:00 PM (Monday to Saturday)`,
  },
  'terms': {
    title: 'Terms and Conditions',
    heroTitle: 'Terms & Conditions',
    heroSubtitle: 'Important website terms of use, informational guidelines, and clinical consultation disclaimers.',
    content: `### 1. Medical Disclaimer
The content provided on this website is for informational and educational awareness only. It is not intended as a substitute for professional clinical medical advice, formal diagnosis, or individualized treatment plans. Always seek the advice of our qualified obstetricians and gynaecologists in person.

### 2. Website Scope
Matruka operates this website to provide transparent details regarding clinic infrastructure, qualified consultants Dr. Kairavi Yagnik and Dr. Rut Shah, medical specialities, and clinic hours. No clinical relationship is formed solely by browsing this website.

### 3. In-Person OPD Consultations
To receive medical consultations, prescriptions, examinations, or ultrasound diagnostics, patients must visit our clinic during regular OPD consultation hours:
- Morning OPD: 10:00 AM - 1:00 PM (Monday to Saturday)
- Evening OPD: 5:00 PM - 7:00 PM (Monday to Saturday)
- Address: Solaris Cure, Beside Ratnajyoti Apartment, VIP Road, Surat - 395007

### 4. Acute Obstetric & Gynecologic Emergencies
In situations of sudden heavy vaginal bleeding, acute lower abdominal agony, reduced fetal movement, or spontaneous rupture of membranes, directly call our emergency care helpline: +91 79848 82273.

### 5. Intellectual Property
All website content, clinical photography, doctor profiles, and graphics belong exclusively to Matruka Women’s Hospital. Unauthorized duplication or commercial use without prior written consent is strictly prohibited.`,
  },
};

exports.getAll = async (req, res) => {
  try {
    const pages = await Page.find().sort({ createdAt: -1 });

    // Ensure legacy dummy seed content is auto-upgraded in response
    const sanitized = pages.map((p) => {
      const obj = p.toObject();
      if (obj.slug === 'privacy-policy' && (!obj.content?.includes('Patient Confidentiality') || obj.content?.includes('purely informational updated'))) {
        obj.heroSubtitle = obj.heroSubtitle || DEFAULT_PAGES['privacy-policy'].heroSubtitle;
        obj.content = DEFAULT_PAGES['privacy-policy'].content;
      }
      if (obj.slug === 'terms' && (!obj.content?.includes('Website Scope') || obj.content?.includes('Clinic Consultations'))) {
        obj.heroSubtitle = obj.heroSubtitle || DEFAULT_PAGES['terms'].heroSubtitle;
        obj.content = DEFAULT_PAGES['terms'].content;
      }
      return obj;
    });

    res.json({ success: true, data: sanitized });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch pages' });
  }
};

exports.getBySlug = async (req, res) => {
  try {
    let page = await Page.findOne({ slug: req.params.slug });
    if (!page) return res.status(404).json({ success: false, error: 'Page not found' });

    const obj = page.toObject();
    if (obj.slug === 'privacy-policy' && (!obj.content?.includes('Patient Confidentiality') || obj.content?.includes('purely informational updated'))) {
      obj.heroSubtitle = obj.heroSubtitle || DEFAULT_PAGES['privacy-policy'].heroSubtitle;
      obj.content = DEFAULT_PAGES['privacy-policy'].content;
    }
    if (obj.slug === 'terms' && (!obj.content?.includes('Website Scope') || obj.content?.includes('Clinic Consultations'))) {
      obj.heroSubtitle = obj.heroSubtitle || DEFAULT_PAGES['terms'].heroSubtitle;
      obj.content = DEFAULT_PAGES['terms'].content;
    }

    res.json({ success: true, data: obj });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch page' });
  }
};

exports.create = async (req, res) => {
  try {
    const { title, heroTitle } = req.body;
    if (!title || !heroTitle) return res.status(400).json({ success: false, error: 'Title and hero title are required' });

    const slug = req.body.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const page = await Page.create({ ...req.body, slug });

    await ActivityLog.create({
      userId: req.user?._id?.toString() || 'admin',
      userName: req.user?.name || 'Admin',
      action: 'create',
      module: 'pages',
      description: `Created page: ${page.title} (${page.slug})`,
    });

    res.status(201).json({ success: true, data: page });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message || 'Failed to create page' });
  }
};

exports.update = async (req, res) => {
  try {
    const page = await Page.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!page) return res.status(404).json({ success: false, error: 'Page not found' });

    await ActivityLog.create({
      userId: req.user?._id?.toString() || 'admin',
      userName: req.user?.name || 'Admin',
      action: 'update',
      module: 'pages',
      description: `Updated page: ${page.title}`,
    });

    res.json({ success: true, data: page });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message || 'Failed to update page' });
  }
};

exports.remove = async (req, res) => {
  try {
    await Page.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Page deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete page' });
  }
};

