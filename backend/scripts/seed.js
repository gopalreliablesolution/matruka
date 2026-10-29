const mongoose = require('mongoose');
const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {}
require('dotenv').config();

const User = require('../src/models/User');
const Doctor = require('../src/models/Doctor');
const { Service, ServiceCategory } = require('../src/models/Service');
const Facility = require('../src/models/Facility');
const { Blog, BlogCategory } = require('../src/models/Blog');
const { GalleryAlbum, GalleryItem } = require('../src/models/GalleryAlbum');
const Testimonial = require('../src/models/Testimonial');
const FAQ = require('../src/models/FAQ');
const Banner = require('../src/models/Banner');
const MenuItem = require('../src/models/MenuItem');
const Setting = require('../src/models/Setting');
const HomepageSection = require('../src/models/HomepageSection');
const Page = require('../src/models/Page');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/matruka';

async function seedDatabase() {
  try {
    console.log('[Seed] Connecting to MongoDB at:', MONGODB_URI);
    await mongoose.connect(MONGODB_URI);
    console.log('[Seed] Database connected successfully.');

    // 1. Seed Super Admin User
    console.log('[Seed] Checking Admin Users...');
    const existingAdmin = await User.findOne({ email: 'admin@matruka.in' });
    if (!existingAdmin) {
      await User.create({
        name: 'Matruka Administrator',
        email: 'admin@matruka.in',
        passwordHash: 'Admin@Matruka2026', // Will be hashed by User pre-save hook
        role: 'super_admin',
        isActive: true,
      });
      console.log('[Seed] Created default Super Admin: admin@matruka.in / Admin@Matruka2026');
    } else {
      console.log('[Seed] Super Admin already exists.');
    }

    // 2. Seed Website Settings
    console.log('[Seed] Seeding Website Settings...');
    await Setting.deleteMany({});
    await Setting.create({
      clinicName: 'Matruka',
      gujaratiName: 'માતૃકા',
      tagline: 'Complete Care for Her',
      appointmentPhone: '7984882273',
      emergencyPhone: '7984882273',
      whatsappNumber: '917984882273',
      email: 'info@matruka.in',
      website: 'www.matruka.in',
      address: '303-306, Solaris Cure, Besides Ratnajyoti Apartment, VIP Road, Surat - 395007',
      landmark: 'Besides Ratnajyoti Apartment, VIP Road',
      city: 'Surat',
      state: 'Gujarat',
      pincode: '395007',
      googleMapsEmbedUrl:
        'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3721.2223847847953!2d72.825!3d21.145!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04f4c!2sSolaris+Cure+VIP+Road+Surat!5e0!3m2!1sen!2sin!4v1680000000000!5m2!1sen!2sin',
      googleMapsDirectionsUrl: 'https://maps.google.com/?q=Solaris+Cure+VIP+Road+Surat+395007',
      opdTimings: '10:00 AM - 1:00 PM | 5:00 PM - 7:00 PM (Monday to Saturday)',
      sundayTimings: 'Emergency Only (24*7)',
      emergencyHours: '24*7 Available for Obstetrics & Emergency',
      socialLinks: {
        facebook: 'https://facebook.com/matrukasurat',
        instagram: 'https://instagram.com/matruka_surat',
        youtube: '',
        linkedin: '',
      },
      copyrightText: '© 2026 Matruka — Complete Care for Her. All rights reserved.',
      logoUrl: '/logo.png',
      faviconUrl: '/favicon.png',
      announcementBarText:
        'OPD Timings: 10:00 AM - 1:00 PM & 5:00 PM - 7:00 PM (Mon-Sat) | 24*7 Emergency Care Available',
      isAnnouncementActive: true,
      seoDefaults: {
        metaTitle: 'Matruka — Complete Care for Her | Best OBGYN & Maternity Clinic in Surat',
        metaDescription:
          'Expert Obstetrics & Gynaecology, Advanced Laparoscopic Surgery, and Infertility Care in Surat led by Dr. Kairavi Yagnik & Dr. Rut Shah at Solaris Cure, VIP Road.',
        keywords:
          'gynecologist in surat, maternity clinic surat, Dr Kairavi Yagnik, Dr Rut Shah, normal delivery, laparoscopic surgery surat, infertility clinic surat',
      },
    });

    // 3. Seed Doctors
    console.log('[Seed] Seeding Doctors...');
    await Doctor.deleteMany({});
    await Doctor.create([
      {
        name: 'Dr. Kairavi Yagnik',
        slug: 'dr-kairavi-yagnik',
        designation: 'Consultant Obstetrician & Gynaecologist',
        qualifications: 'MBBS, MS OBGYN',
        specialization: 'Obstetrics, High-Risk Pregnancy & Infertility Specialist',
        experienceYears: 12,
        bio: 'Dr. Kairavi Yagnik is an accomplished Consultant Obstetrician and Gynaecologist with specialized training in Advanced Laparoscopic Surgery and FOGSI-certified Ultrasound. With over a decade of compassionate clinical experience, Dr. Kairavi provides comprehensive prenatal care, high-risk pregnancy monitoring, painless deliveries, and compassionate reproductive guidance at Matruka.',
        areasOfExpertise: [
          'Personalized Antenatal Care',
          'High Risk Pregnancy Management',
          'Painless Vaginal Delivery & Cesarean Section',
          'Gynec Ultrasound & Fetal Assessment',
          'Infertility Evaluation & Treatment',
          'Adolescent Healthcare & Menstrual Wellness',
        ],
        fellowshipsAndCertifications: [
          'Fellowship in Advanced Laparoscopic Surgery',
          'FOGSI Certificate in Obstetrics & Gynaec Ultrasound',
          'Specialist Certification in Infertility & Reproductive Medicine',
        ],
        opdTimings: '10:00 AM - 1:00 PM | 5:00 PM - 7:00 PM (Mon - Sat)',
        profileImage: '/images/doctors/dr-kairavi-yagnik.jpg',
        phone: '7984882273',
        email: 'info@matruka.in',
        isFeatured: true,
        isPublished: true,
        sortOrder: 1,
        seoTitle: 'Dr. Kairavi Yagnik - Consultant Obstetrician & Gynaecologist in Surat | Matruka',
        seoDescription:
          'Consult Dr. Kairavi Yagnik (MBBS, MS OBGYN), leading Obstetrician, Infertility Specialist and Laparoscopic Surgeon at Matruka, VIP Road, Surat.',
      },
      {
        name: 'Dr. Rut Shah',
        slug: 'dr-rut-shah',
        designation: 'Consultant Obstetrician & Gynaecologist',
        qualifications: 'MBBS, MS OBGYN',
        specialization: 'Advanced Laparoscopic Surgery, Obstetrics & Gynaecology',
        experienceYears: 12,
        bio: 'Dr. Rut Shah is a highly skilled Consultant Obstetrician and Gynaecological Laparoscopic Surgeon. Holding fellowships in Advanced Minimal Access Surgery and FOGSI ultrasound certification, Dr. Rut specializes in minimally invasive hysterectomy, ovarian cyst management, fertility-enhancing laparoscopic procedures, and safe, dignified obstetric care.',
        areasOfExpertise: [
          'Gynec Laparoscopic Surgeries (Minimal Access)',
          'Abdominal, Vaginal & Laparoscopic Hysterectomy',
          'Pre-conceptional Counselling & Fertility Workup',
          'Normal & Operative Deliveries',
          'Menopause Care & Hormone Health',
          'Treatment of Complex Menstrual Irregularities',
        ],
        fellowshipsAndCertifications: [
          'Fellowship in Advanced Laparoscopic Surgery',
          'FOGSI Certificate in Obstetrics & Gynaec Ultrasound',
          'Infertility Specialist Certification',
        ],
        opdTimings: '10:00 AM - 1:00 PM | 5:00 PM - 7:00 PM (Mon - Sat)',
        profileImage: '/images/doctors/dr-rut-shah.jpg',
        phone: '7984882273',
        email: 'info@matruka.in',
        isFeatured: true,
        isPublished: true,
        sortOrder: 2,
        seoTitle: 'Dr. Rut Shah - Laparoscopic Gynaecologist & Obstetrician in Surat | Matruka',
        seoDescription:
          'Consult Dr. Rut Shah (MBBS, MS OBGYN), specialist in Advanced Laparoscopic Surgery and Gynaecology at Matruka, Solaris Cure, VIP Road Surat.',
      },
    ]);

    // 4. Seed Service Categories & Services (All 14 from banner)
    console.log('[Seed] Seeding Service Categories and Services...');
    await ServiceCategory.deleteMany({});
    const categories = await ServiceCategory.create([
      { name: 'Pregnancy & Maternity Care', slug: 'pregnancy-maternity-care', sortOrder: 1 },
      { name: 'Gynaecology & Women Health', slug: 'gynaecology-women-health', sortOrder: 2 },
      { name: 'Laparoscopic Surgery', slug: 'laparoscopic-surgery', sortOrder: 3 },
      { name: 'Infertility & Conception', slug: 'infertility-conception', sortOrder: 4 },
      { name: 'Ultrasound & Diagnostics', slug: 'ultrasound-diagnostics', sortOrder: 5 },
    ]);

    await Service.deleteMany({});
    await Service.create([
      {
        name: 'Personalized Antenatal Care',
        slug: 'personalized-antenatal-care',
        category: 'Pregnancy & Maternity Care',
        shortDescription:
          'Structured, compassionate medical monitoring for expecting mothers from first trimester through to term.',
        fullDescription:
          'Every pregnancy is a unique and precious journey. At Matruka, our Personalized Antenatal Care is designed to support both mother and baby at every milestone. We provide continuous clinical assessments, dietary and lifestyle counselling, vital monitoring, routine screening protocols, and early identification of gestational variations to ensure a safe, joyful pregnancy.',
        featuredImage: '/images/services/antenatal-care.jpg',
        treatments: [
          'First trimester vitality and dating scans',
          'Nutritional and micronutrient guidance',
          'Blood pressure and gestational diabetes screening',
          'Fetal growth velocity evaluations',
          'Birth planning and emotional reassurance',
        ],
        benefits: [
          'Evidence-based maternal and fetal monitoring',
          'Direct consultation with Dr. Kairavi Yagnik & Dr. Rut Shah',
          'Calm, unhurried checkup sessions',
        ],
        faqs: [
          {
            question: 'How often should I attend antenatal checkups at Matruka?',
            answer:
              'Typically, visits are scheduled monthly until 28 weeks, bi-weekly until 36 weeks, and weekly thereafter until delivery, tailored to your clinical assessment.',
          },
        ],
        isFeatured: true,
        isPublished: true,
        sortOrder: 1,
      },
      {
        name: 'Normal Delivery & Cesarean Section',
        slug: 'normal-delivery-cesarean-section',
        category: 'Pregnancy & Maternity Care',
        shortDescription:
          'Comprehensive intrapartum care prioritizing natural, dignified birth with complete surgical capability for emergency C-sections.',
        fullDescription:
          'At Matruka, we believe in supporting spontaneous normal delivery whenever clinically indicated while maintaining state-of-the-art surgical readiness for elective or emergency Cesarean sections. Our labor rooms are equipped with modern fetal cardiotocography (CTG) monitors and staffed by dedicated obstetric teams ensuring maximum safety and respect for the mother.',
        featuredImage: '/images/services/delivery-care.jpg',
        treatments: [
          'Natural vaginal birth support in dedicated labor suites',
          'Continuous fetal electronic heart rate monitoring (CTG)',
          'Elective and emergency Cesarean section capability',
          'Immediate newborn care & golden hour skin-to-skin',
          'Perineal integrity preservation protocols',
        ],
        benefits: ['Patient-centered birth philosophy', '24x7 emergency obstetric readiness', 'Clean, supportive delivery suites'],
        faqs: [
          {
            question: 'Does Matruka support natural normal deliveries?',
            answer:
              'Yes, our primary medical philosophy encourages natural vaginal delivery with minimal unnecessary intervention, provided maternal and fetal vitals remain reassuring.',
          },
        ],
        isFeatured: true,
        isPublished: true,
        sortOrder: 2,
      },
      {
        name: 'Painless Vaginal Delivery',
        slug: 'painless-vaginal-delivery',
        category: 'Pregnancy & Maternity Care',
        shortDescription:
          'Modern labour analgesia (epidural) enabling comfortable, pain-managed vaginal childbirth under expert anaesthetic supervision.',
        fullDescription:
          'Labour pain should never prevent a mother from experiencing a calm, conscious, and empowered childbirth. Painless vaginal delivery utilizing continuous lumbar epidural analgesia allows mothers to rest and conserve stamina through contractions while actively participating in the final delivery phase with significantly reduced discomfort.',
        featuredImage: '/images/services/painless-delivery.jpg',
        treatments: [
          'Pre-labour anaesthetic evaluation and consultation',
          'Continuous low-dose epidural infusion',
          'Active mobility and comfort preservation',
          'Real-time maternal-fetal parameter monitoring',
        ],
        isFeatured: true,
        isPublished: true,
        sortOrder: 3,
      },
      {
        name: 'High Risk Pregnancy Management',
        slug: 'high-risk-pregnancy-management',
        category: 'Pregnancy & Maternity Care',
        shortDescription:
          'Specialized vigilance for pregnancies complicated by hypertension, diabetes, multiple gestation, or previous obstetric difficulties.',
        fullDescription:
          'Certain pregnancies require advanced medical oversight. Whether due to gestational diabetes, pre-eclampsia, recurrent pregnancy loss, advanced maternal age, thyroid disorders, or twin pregnancies, our team at Matruka utilizes evidence-based risk stratification and frequent sonographic assessment to safeguard both mother and child.',
        featuredImage: '/images/services/high-risk-pregnancy.jpg',
        treatments: [
          'Gestational diabetes mellitus (GDM) control',
          'Pregnancy-induced hypertension & pre-eclampsia protocols',
          'Cervical cerclage for incompetence',
          'Intrauterine growth restriction (IUGR) surveillance',
          'Multiple gestation management',
        ],
        isFeatured: true,
        isPublished: true,
        sortOrder: 4,
      },
      {
        name: 'Gynec Laparoscopic Surgeries',
        slug: 'gynec-laparoscopic-surgeries',
        category: 'Laparoscopic Surgery',
        shortDescription:
          'Keyhole minimally invasive surgical techniques for fibroids, ovarian cysts, endometriosis, and tubal procedures with rapid recovery.',
        fullDescription:
          'Both Dr. Kairavi Yagnik and Dr. Rut Shah hold specialized Fellowships in Advanced Laparoscopic Surgery. Through precision keyhole incisions of just 5mm to 10mm, complex gynaecological conditions are addressed with minimal tissue trauma, significantly reduced blood loss, lesser pain, and rapid return to everyday life.',
        featuredImage: '/images/services/laparoscopic-surgery.jpg',
        treatments: [
          'Laparoscopic myomectomy (fibroid removal)',
          'Laparoscopic ovarian cystectomy',
          'Endometriosis excision and adhesiolysis',
          'Diagnostic laparoscopy & hysteroscopy for infertility',
          'Ectopic pregnancy laparoscopic management',
        ],
        isFeatured: true,
        isPublished: true,
        sortOrder: 5,
      },
      {
        name: 'Abdominal, Vaginal & Laparoscopic Hysterectomy',
        slug: 'hysterectomy-surgeries',
        category: 'Laparoscopic Surgery',
        shortDescription:
          'Tailored uterine removal surgeries chosen based on clinical indications, uterus size, and patient health profile.',
        fullDescription:
          'When non-surgical therapies have been exhausted for severe adenomyosis, large fibroids, or abnormal uterine bleeding, hysterectomy may be indicated. Matruka provides the complete spectrum of surgical options—total laparoscopic hysterectomy (TLH), non-descent vaginal hysterectomy (NDVH), and abdominal hysterectomy—ensuring the least invasive approach is chosen.',
        featuredImage: '/images/services/hysterectomy.jpg',
        treatments: [
          'Total Laparoscopic Hysterectomy (TLH)',
          'Laparoscopy-Assisted Vaginal Hysterectomy (LAVH)',
          'Non-descent Vaginal Hysterectomy (NDVH)',
          'Abdominal Hysterectomy for large multi-fibroid uteri',
        ],
        isFeatured: false,
        isPublished: true,
        sortOrder: 6,
      },
      {
        name: 'Pre-conceptional Counselling',
        slug: 'pre-conceptional-counselling',
        category: 'Pregnancy & Maternity Care',
        shortDescription:
          'Comprehensive health evaluation and reproductive planning before pregnancy to ensure optimal maternal and fetal well-being.',
        fullDescription:
          'Planning for pregnancy starts before conception. We review medical history, optimize maternal nutrition, prescribe essential pre-conception folic acid, screen for genetic or metabolic conditions, and guide couples on ovulation timing.',
        featuredImage: '/images/services/preconceptional-counselling.jpg',
        treatments: [
          'Pre-pregnancy wellness and fertility assessment',
          'Folic acid and nutritional guidance',
          'Rubella, thyroid, and blood group compatibility screening',
          'Lifestyle and ovulation tracking counselling',
        ],
        isFeatured: false,
        isPublished: true,
        sortOrder: 7,
      },
      {
        name: 'Postpartum Care & Lactation Advice',
        slug: 'postpartum-care-lactation-advice',
        category: 'Pregnancy & Maternity Care',
        shortDescription:
          'Dedicated maternal recovery checkups, pelvic health assessments, emotional well-being guidance, and specialized lactation support.',
        fullDescription:
          'Care does not conclude with birth. Matruka provides structured postpartum visits focusing on uterine involution, episiotomy/cesarean incision healing, mental health screening for postpartum blues, and one-on-one lactation coaching.',
        featuredImage: '/images/services/postpartum-care.jpg',
        treatments: [
          'Lactation latch guidance and mastitis prevention',
          'Surgical wound healing assessment',
          'Pelvic floor toning and physical recovery guidance',
          'Postpartum contraception counselling',
        ],
        isFeatured: false,
        isPublished: true,
        sortOrder: 8,
      },
      {
        name: 'Family Planning',
        slug: 'family-planning',
        category: 'Gynaecology & Women Health',
        shortDescription:
          'Confidential, medically grounded guidance on temporary and permanent contraceptive methods suited to your life stage.',
        fullDescription:
          'We offer informed counselling on the full spectrum of modern contraceptive options, from intrauterine contraceptive devices (IUCD/Mirena) to oral pills and postpartum spacing.',
        featuredImage: '/images/services/family-planning.jpg',
        treatments: [
          'Copper T and hormonal IUCD insertion',
          'Oral contraceptive counselling',
          'Barrier method counselling',
          'Permanent sterilization advice',
        ],
        isFeatured: false,
        isPublished: true,
        sortOrder: 9,
      },
      {
        name: 'Gynec Ultrasound',
        slug: 'gynec-ultrasound',
        category: 'Ultrasound & Diagnostics',
        shortDescription:
          'In-clinic high-resolution pelvic and transvaginal ultrasonography conducted directly by certified FOGSI sonologists.',
        fullDescription:
          'Accurate ultrasound imaging is essential for women’s health. Both of our consultant gynaecologists hold FOGSI certifications in obstetric and gynaecological ultrasound, allowing immediate in-clinic diagnostic clarity for uterine, ovarian, and follicular conditions.',
        featuredImage: '/images/services/gynec-ultrasound.jpg',
        treatments: [
          'Transvaginal sonography (TVS) for endometrium & ovaries',
          'Follicular tracking for conception planning',
          'Early obstetric viability and dating scans',
          'Fibroid, polyp, and cyst dimensional mapping',
        ],
        isFeatured: false,
        isPublished: true,
        sortOrder: 10,
      },
      {
        name: 'Adolescent Healthcare',
        slug: 'adolescent-healthcare',
        category: 'Gynaecology & Women Health',
        shortDescription:
          'Supportive and empathetic medical consultation for young girls navigating pubertal changes and reproductive health.',
        fullDescription:
          'The transition into womanhood requires gentle and non-judgmental medical guidance. We address early menstrual issues, dysmenorrhea, heavy bleeding, HPV cervical cancer vaccination, and pubertal growth concerns in a reassuring environment.',
        featuredImage: '/images/services/adolescent-healthcare.jpg',
        treatments: [
          'Evaluation of pubertal development',
          'Cervical cancer (HPV) vaccination',
          'Severe menstrual cramp (dysmenorrhea) relief',
          'Nutritional anaemia screening and treatment',
        ],
        isFeatured: false,
        isPublished: true,
        sortOrder: 11,
      },
      {
        name: 'Treatment of Menstrual Irregularities',
        slug: 'treatment-of-menstrual-irregularities',
        category: 'Gynaecology & Women Health',
        shortDescription:
          'Systematic investigation and hormone-balanced treatment for PCOS/PCOD, irregular periods, and abnormal uterine bleeding.',
        fullDescription:
          'Polycystic Ovarian Syndrome (PCOS) and hormonal imbalances affect millions of women. We offer comprehensive diagnostic hormonal profiling, ultrasound evaluation, and long-term metabolic lifestyle management to restore healthy cycles.',
        featuredImage: '/images/services/menstrual-irregularities.jpg',
        treatments: [
          'PCOS / PCOD clinical staging and management',
          'Abnormal uterine bleeding (AUB) workup',
          'Hormonal balance therapy',
          'Endometrial thickness evaluation',
        ],
        isFeatured: false,
        isPublished: true,
        sortOrder: 12,
      },
      {
        name: 'Infertility Evaluation & Management',
        slug: 'infertility-evaluation-management',
        category: 'Infertility & Conception',
        shortDescription:
          'Scientific, empathetic investigation of female and male factors, ovulation induction, and follicular monitoring.',
        fullDescription:
          'Facing conception challenges can be emotionally taxing. At Matruka, Dr. Kairavi Yagnik and Dr. Rut Shah conduct thorough diagnostic investigations into tubal patency, ovulatory function, uterine cavity health, and semen parameters to provide clear, honest medical pathways.',
        featuredImage: '/images/services/infertility-management.jpg',
        treatments: [
          'Baseline hormone evaluation and ovarian reserve testing',
          'Serial sonographic follicular tracking',
          'Tubal patency assessment (HSG / Sonosalpingography)',
          'Ovulation induction protocols',
          'Diagnostic laparoscopy & hysteroscopy',
        ],
        isFeatured: true,
        isPublished: true,
        sortOrder: 13,
      },
      {
        name: 'Menopause Care',
        slug: 'menopause-care',
        category: 'Gynaecology & Women Health',
        shortDescription:
          'Comprehensive health support for women transitioning through perimenopause and post-menopause with emphasis on bone and cardiovascular vitality.',
        fullDescription:
          'Menopause is a natural life transition. Our menopause clinic addresses hot flashes, sleep disturbances, mood changes, urogenital atrophy, osteoporosis risk, and cardiovascular screening, empowering women to enjoy vibrant post-reproductive years.',
        featuredImage: '/images/services/menopause-care.jpg',
        treatments: [
          'Vasomotor symptom (hot flashes/night sweats) management',
          'Bone mineral density (BMD) monitoring and calcium therapy',
          'Cervical Pap smear and breast wellness screening',
          'Urogenital wellness and pelvic health',
        ],
        isFeatured: false,
        isPublished: true,
        sortOrder: 14,
      },
    ]);

    // 5. Seed Facilities
    console.log('[Seed] Seeding Facilities...');
    await Facility.deleteMany({});
    await Facility.create([
      {
        name: 'Gynec Ultrasound & Sonography Suite',
        slug: 'ultrasound-suite',
        shortDescription: 'In-clinic high-definition imaging conducted directly by certified sonologists.',
        fullDescription:
          'Equipped with advanced multi-frequency probes for transabdominal and transvaginal sonography, enabling instantaneous assessment during your consultation.',
        icon: 'Activity',
        image: '/images/facilities/ultrasound.jpg',
        features: ['Real-time 2D/Color Doppler', 'Immediate doctor reporting', 'Private, serene scanning room'],
        sortOrder: 1,
        isPublished: true,
      },
      {
        name: 'Advanced Modular Laparoscopic OT',
        slug: 'laparoscopic-ot',
        shortDescription: 'State-of-the-art operating theater dedicated to minimally invasive gynaecological surgeries.',
        fullDescription:
          'Engineered with HEPA-filtered laminar airflow, high-definition camera systems, advanced electrosurgical generators, and precision laparoscopic instruments.',
        icon: 'ShieldCheck',
        image: '/images/facilities/ot.jpg',
        features: ['Laminar air-flow system', 'HD endoscopic visual towers', 'Zero-infection protocols'],
        sortOrder: 2,
        isPublished: true,
      },
      {
        name: 'Labor, Delivery & Recovery (LDR) Suite',
        slug: 'labor-delivery-suite',
        shortDescription: 'Comfortable, private birthing environment designed for respectful, dignified maternity care.',
        fullDescription:
          'Our labor suites allow the mother to labor and deliver in a warm, supportive setting equipped with continuous electronic fetal monitoring.',
        icon: 'HeartHandshake',
        image: '/images/facilities/ldr.jpg',
        features: ['Multi-position delivery bed', 'Continuous CTG fetal monitoring', 'Partner support accommodation'],
        sortOrder: 3,
        isPublished: true,
      },
      {
        name: 'Private Maternity & Recovery Rooms',
        slug: 'maternity-recovery-rooms',
        shortDescription: 'Comfortable, peaceful recovery rooms with ensuite facilities for new mothers and families.',
        fullDescription:
          'Designed to promote restful bonding between mother and baby, with 24x7 nursing assistance, comfortable attendant seating, and clean sanitization.',
        icon: 'Home',
        image: '/images/facilities/rooms.jpg',
        features: ['Quiet, air-conditioned rooms', 'Ensuite sanitary facilities', '24x7 nurse call buzzer'],
        sortOrder: 4,
        isPublished: true,
      },
    ]);

    // 6. Seed Homepage Sections
    console.log('[Seed] Seeding Homepage Sections...');
    await HomepageSection.deleteMany({});
    await HomepageSection.create([
      { sectionKey: 'hero_slider', name: 'Hero Banner & Slider', title: 'Complete Care For Her', isEnabled: true, sortOrder: 1 },
      { sectionKey: 'emergency_ribbon', name: 'Emergency & Timings Ribbon', title: 'Clinic Contact & Timings', isEnabled: true, sortOrder: 2 },
      { sectionKey: 'about_clinic', name: 'About Matruka Overview', title: 'Compassionate Women’s Healthcare', isEnabled: true, sortOrder: 3 },
      { sectionKey: 'care_statistics', name: 'Care Highlights & Statistics', title: 'Why Women Trust Matruka', isEnabled: true, sortOrder: 4 },
      { sectionKey: 'services_specialities', name: 'Services & Specialities', title: 'Our Clinical Specialities', isEnabled: true, sortOrder: 5 },
      { sectionKey: 'why_choose_us', name: 'Why Choose Matruka', title: 'Specialized Expertise, Gentle Care', isEnabled: true, sortOrder: 6 },
      { sectionKey: 'featured_doctors', name: 'Our Expert Doctors', title: 'Meet Dr. Kairavi Yagnik & Dr. Rut Shah', isEnabled: true, sortOrder: 7 },
      { sectionKey: 'facilities_infrastructure', name: 'Clinic Facilities & Technology', title: 'Modern Medical Infrastructure', isEnabled: true, sortOrder: 8 },
      { sectionKey: 'testimonials', name: 'Patient Stories & Reviews', title: 'Words From Our Mothers & Patients', isEnabled: true, sortOrder: 9 },
      { sectionKey: 'gallery_preview', name: 'Gallery Preview', title: 'Inside Matruka Clinic', isEnabled: true, sortOrder: 10 },
      { sectionKey: 'latest_blogs', name: 'Pregnancy & Health Articles', title: 'Educational Health Knowledge', isEnabled: true, sortOrder: 11 },
      { sectionKey: 'faqs', name: 'Frequently Asked Questions', title: 'Common Questions & Answers', isEnabled: true, sortOrder: 12 },
      { sectionKey: 'location_contact', name: 'Clinic Location & OPD Schedule', title: 'Visit Us at Solaris Cure, VIP Road', isEnabled: true, sortOrder: 13 },
    ]);

    // 7. Seed Banners
    console.log('[Seed] Seeding Banners...');
    await Banner.deleteMany({});
    await Banner.create([
      {
        title: 'Nurturing Motherhood With Expertise & Love',
        subtitle:
          'Comprehensive maternity, high-risk pregnancy, and advanced gynaecological laparoscopic care led by Dr. Kairavi Yagnik & Dr. Rut Shah in Surat.',
        badgeText: 'Complete Care for Her',
        desktopImage: '/images/banners/maternity-hero.jpg',
        primaryBtnText: 'Explore Our Services',
        primaryBtnLink: '/services',
        secondaryBtnText: 'Meet Our Doctors',
        secondaryBtnLink: '/doctors',
        sortOrder: 1,
        isActive: true,
      },
      {
        title: 'Advanced Gynec Laparoscopic Surgeries',
        subtitle:
          'Minimally invasive keyhole procedures for fibroids, ovarian cysts, and hysterectomy with minimal pain, tiny incisions, and faster recovery.',
        badgeText: 'Fellowship-Trained Surgeons',
        desktopImage: '/images/banners/laparoscopy-hero.jpg',
        primaryBtnText: 'Learn About Laparoscopy',
        primaryBtnLink: '/services/gynec-laparoscopic-surgeries',
        secondaryBtnText: 'Call Clinic: 7984882273',
        secondaryBtnLink: 'tel:7984882273',
        sortOrder: 2,
        isActive: true,
      },
    ]);

    // 8. Seed FAQs
    console.log('[Seed] Seeding FAQs...');
    await FAQ.deleteMany({});
    await FAQ.create([
      {
        question: 'What are the OPD consultation hours at Matruka?',
        answer:
          'Our OPD is open Monday to Saturday in two sessions: Morning: 10:00 AM to 1:00 PM and Evening: 5:00 PM to 7:00 PM. On Sundays, the clinic is available for emergencies.',
        category: 'Clinic & Timings',
        sortOrder: 1,
        isPublished: true,
      },
      {
        question: 'Where is Matruka located in Surat?',
        answer:
          'Matruka is located at 303-306, Solaris Cure, Besides Ratnajyoti Apartment, VIP Road, Surat - 395007. It is easily accessible with parking facilities.',
        category: 'Clinic & Timings',
        sortOrder: 2,
        isPublished: true,
      },
      {
        question: 'Is 24x7 emergency care available for pregnant mothers?',
        answer:
          'Yes, Matruka provides round-the-clock 24x7 emergency care for acute obstetric needs, labour onset, and gynaecological emergencies. You can reach the clinic at 7984882273.',
        category: 'Pregnancy & Delivery',
        sortOrder: 3,
        isPublished: true,
      },
      {
        question: 'What is painless delivery and is it safe for my baby?',
        answer:
          'Painless delivery uses epidural analgesia administered by a specialist anaesthetist. It effectively relieves intense labour contractions without sedating the baby or hindering normal birth mechanics.',
        category: 'Pregnancy & Delivery',
        sortOrder: 4,
        isPublished: true,
      },
      {
        question: 'What are the benefits of laparoscopic surgery over traditional open surgery?',
        answer:
          'Laparoscopic surgery uses micro-incisions (5-10 mm) and high-resolution cameras. This results in minimal blood loss, significantly less post-operative pain, negligible scarring, and hospital discharge within 24 to 48 hours.',
        category: 'Laparoscopy & Surgery',
        sortOrder: 5,
        isPublished: true,
      },
    ]);

    // 9. Seed Testimonials (Consented patient experiences)
    console.log('[Seed] Seeding Testimonials...');
    await Testimonial.deleteMany({});
    await Testimonial.create([
      {
        patientName: 'Pooja M. Patel',
        location: 'Vesu, Surat',
        story:
          'Dr. Kairavi Yagnik guided me through my entire pregnancy with immense patience. Even during my sudden gestational hypertension in the 8th month, her calm reassurance and decisive care resulted in a healthy, safe normal delivery. The staff at Matruka are wonderfully caring.',
        rating: 5,
        treatmentReceived: 'Personalized Antenatal Care & Normal Delivery',
        doctorAttended: 'Dr. Kairavi Yagnik',
        isFeatured: true,
        isPublished: true,
        sortOrder: 1,
      },
      {
        patientName: 'Megha D. Shah',
        location: 'VIP Road, Surat',
        story:
          'I had severe chronic pelvic pain from a 7cm ovarian cyst. Dr. Rut Shah performed laparoscopic surgery with absolute perfection. I was walking the next morning and back to work within 10 days with almost invisible scars. Highly recommend Matruka!',
        rating: 5,
        treatmentReceived: 'Laparoscopic Cystectomy',
        doctorAttended: 'Dr. Rut Shah',
        isFeatured: true,
        isPublished: true,
        sortOrder: 2,
      },
      {
        patientName: 'Ananya S. Desai',
        location: 'City Light, Surat',
        story:
          'The clean, peaceful environment at Solaris Cure and the thorough explanation by both doctors made us feel so comfortable. We had been trying to conceive for two years; their structured evaluation gave us clarity and hope.',
        rating: 5,
        treatmentReceived: 'Infertility Evaluation & Follicular Monitoring',
        doctorAttended: 'Dr. Kairavi Yagnik & Dr. Rut Shah',
        isFeatured: true,
        isPublished: true,
        sortOrder: 3,
      },
    ]);

    // 10. Seed Blogs
    console.log('[Seed] Seeding Blogs...');
    await BlogCategory.deleteMany({});
    await BlogCategory.create([
      { name: 'Pregnancy & Childbirth', slug: 'pregnancy-childbirth' },
      { name: 'Women Health & Wellness', slug: 'women-health-wellness' },
      { name: 'Laparoscopic Surgery', slug: 'laparoscopic-surgery' },
    ]);

    await Blog.deleteMany({});
    await Blog.create([
      {
        title: 'Essential Nutritional Guidelines for a Healthy First Trimester',
        slug: 'essential-nutritional-guidelines-first-trimester',
        excerpt:
          'Key dietary considerations, micronutrients, and hydration tips to support early embryonic organogenesis and curb morning sickness.',
        content: `
### Understanding the First Trimester Journey

The first twelve weeks of pregnancy mark a period of rapid development for your baby. During this phase, vital organs, the neural tube, and early physiological systems form.

#### 1. Folic Acid and Neural Development
Daily folic acid supplementation (400 to 800 mcg) is paramount before conception and through the first trimester to prevent neural tube defects. Include folate-rich foods such as spinach, lentils, oranges, and fortified whole grains.

#### 2. Managing Morning Sickness Gently
Nausea and food aversions are common due to rising human chorionic gonadotropin (hCG) levels. Try eating small, frequent meals rather than large ones. Keep plain crackers beside your bed, avoid greasy foods, and stay hydrated with sips of lemon-infused water.

#### 3. Hydration Matters
Aim for at least 2.5 to 3 litres of clean water daily. Coconut water, buttermilk, and clear soups are excellent additions.

*Always consult your obstetrician before taking any herbal remedies or over-the-counter medications.*
        `,
        featuredImage: '/images/blogs/pregnancy-nutrition.jpg',
        author: 'Dr. Kairavi Yagnik',
        category: 'Pregnancy & Childbirth',
        tags: ['Pregnancy', 'Nutrition', 'First Trimester', 'Antenatal Care'],
        status: 'published',
        isFeatured: true,
        readTime: '4 min read',
      },
      {
        title: 'Everything You Need to Know About Gynecological Laparoscopic Surgery',
        slug: 'everything-about-gynecological-laparoscopic-surgery',
        excerpt:
          'How keyhole surgery has transformed the treatment of fibroids, ovarian cysts, and endometriosis with faster recovery times.',
        content: `
### What is Laparoscopic Surgery?

Laparoscopy, often referred to as minimally invasive or keyhole surgery, allows gynaecological surgeons to diagnose and treat pelvic conditions through small incisions (5–10 mm) instead of a large abdominal cut.

#### Why Choose Laparoscopy?
- **Significantly Less Pain:** Smaller incisions minimize abdominal muscle trauma.
- **Minimal Blood Loss:** High-definition magnification allows meticulous vessel coagulation.
- **Reduced Hospital Stay:** Most patients are discharged within 24 to 48 hours.
- **Fast Recovery:** Return to routine light activities within days rather than weeks.

At Matruka, our operating suite is equipped with modern video endoscopy columns ensuring optimal clinical precision.
        `,
        featuredImage: '/images/blogs/laparoscopy-guide.jpg',
        author: 'Dr. Rut Shah',
        category: 'Laparoscopic Surgery',
        tags: ['Laparoscopy', 'Surgery', 'Fibroids', 'Ovarian Cyst'],
        status: 'published',
        isFeatured: true,
        readTime: '5 min read',
      },
    ]);

    // 11. Seed Menus
    console.log('[Seed] Seeding Navigation Menus...');
    await MenuItem.deleteMany({});
    await MenuItem.create([
      { label: 'Home', url: '/', sortOrder: 1, isHeader: true, isFooter: false },
      { label: 'About Us', url: '/about', sortOrder: 2, isHeader: true, isFooter: true, footerSection: 'quick_links' },
      { label: 'Services', url: '/services', sortOrder: 3, isHeader: true, isFooter: true, footerSection: 'quick_links' },
      { label: 'Doctors', url: '/doctors', sortOrder: 4, isHeader: true, isFooter: true, footerSection: 'quick_links' },
      { label: 'Facilities', url: '/facilities', sortOrder: 5, isHeader: true, isFooter: true, footerSection: 'quick_links' },
      { label: 'Gallery', url: '/gallery', sortOrder: 6, isHeader: true, isFooter: true, footerSection: 'quick_links' },
      { label: 'Blogs', url: '/blog', sortOrder: 7, isHeader: true, isFooter: true, footerSection: 'quick_links' },
      { label: 'FAQs', url: '/faqs', sortOrder: 8, isHeader: true, isFooter: true, footerSection: 'patient_info' },
      { label: 'Contact Us', url: '/contact', sortOrder: 9, isHeader: true, isFooter: true, footerSection: 'quick_links' },
      { label: 'Privacy Policy', url: '/privacy-policy', sortOrder: 10, isHeader: false, isFooter: true, footerSection: 'patient_info' },
      { label: 'Terms & Conditions', url: '/terms', sortOrder: 11, isHeader: false, isFooter: true, footerSection: 'patient_info' },
    ]);

    // 12. Seed Pages
    console.log('[Seed] Seeding Static Pages...');
    await Page.deleteMany({});
    await Page.create([
      {
        title: 'About Us',
        slug: 'about',
        heroTitle: 'About Matruka — Complete Care for Her',
        heroSubtitle: 'Dedicated to women’s health, maternity excellence, and compassionate gynaecological care in Surat.',
        content: `
Matruka was founded with a singular, resolute mission: to provide women in Surat and South Gujarat with a warm, modern, and clinically rigorous healthcare home through every stage of their lives.

From pre-conception counselling and joyful maternity journeys to advanced gynaecological laparoscopy and menopause transition, our clinic combines clinical precision with genuine warmth.

Led by Dr. Kairavi Yagnik and Dr. Rut Shah—both MS Obstetricians, Gynaecologists, and fellowship-trained laparoscopic surgeons—Matruka prioritizes evidence-based care, ethical consultation, and patient dignity.
        `,
        sections: [
          {
            title: 'Our Vision',
            subtitle: 'Empowering Every Mother and Woman',
            content: 'To be the most trusted, patient-centric maternity and women’s health clinic in Surat, renowned for clinical excellence and compassionate healing.',
            sortOrder: 1,
          },
          {
            title: 'Our Care Philosophy',
            subtitle: 'Dignified, Transparent, and Safe',
            content: 'We believe that medical care should be collaborative, unhurried, and transparent. We explain diagnoses clearly, support natural birth pathways, and utilize minimally invasive techniques whenever surgery is necessary.',
            sortOrder: 2,
          },
        ],
        isPublished: true,
      },
      {
        title: 'Privacy Policy',
        slug: 'privacy-policy',
        heroTitle: 'Privacy Policy',
        heroSubtitle: 'Your privacy and trust are of paramount importance to Matruka.',
        content: `
At Matruka — Complete Care for Her, we respect your privacy. This website is purely informational. 

### 1. Information Collection
We do not collect personal medical records, booking requests, or financial data through this website. Any contact initiated via telephone, WhatsApp, or clinic visit is held in strict medical confidentiality in accordance with Indian healthcare regulations.

### 2. Website Usage
This website provides informational guidance regarding our doctors, services, OPD timings, and clinic location.
        `,
        isPublished: true,
      },
      {
        title: 'Terms and Conditions',
        slug: 'terms',
        heroTitle: 'Terms & Conditions',
        heroSubtitle: 'Website terms of use and informational disclaimer.',
        content: `
### 1. Medical Disclaimer
The information presented on this website is for general educational and informational purposes only. It does not constitute medical advice or a substitute for a professional clinical consultation.

### 2. Clinic Consultations
For clinical evaluation, diagnosis, and treatment planning, patients are requested to visit Matruka during official OPD timings (10:00 AM - 1:00 PM and 5:00 PM - 7:00 PM, Monday to Saturday).

### 3. Emergency Care
In case of acute medical emergencies, please visit the clinic directly or call our emergency line at 7984882273.
        `,
        isPublished: true,
      },
    ]);

    console.log('[Seed] Database seeded successfully with genuine Matruka data!');
    process.exit(0);
  } catch (error) {
    console.error('[Seed] Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();

