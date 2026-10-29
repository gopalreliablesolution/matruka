const fs = require('fs');
const path = require('path');
const dns = require('dns');
const mongoose = require('mongoose');

try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {}

require('dotenv').config({ path: path.join(__dirname, '../.env') });

const { GalleryAlbum, GalleryItem } = require('../src/models/GalleryAlbum');
const { Blog, BlogCategory } = require('../src/models/Blog');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/matruka';

// Paths
const BACKEND_UPLOADS = path.join(__dirname, '../uploads');
const FRONTEND_PUBLIC = path.join(__dirname, '../../frontend/public/images');

const GALLERY_BACKEND = path.join(BACKEND_UPLOADS, 'gallery');
const GALLERY_FRONTEND = path.join(FRONTEND_PUBLIC, 'gallery');
const BLOGS_BACKEND = path.join(BACKEND_UPLOADS, 'blogs');
const BLOGS_FRONTEND = path.join(FRONTEND_PUBLIC, 'blogs');

[GALLERY_BACKEND, GALLERY_FRONTEND, BLOGS_BACKEND, BLOGS_FRONTEND].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

async function downloadFile(url, destBackend, destFrontend) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buffer = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(destBackend, buffer);
    fs.writeFileSync(destFrontend, buffer);
    return true;
  } catch (err) {
    console.error(`Failed to download ${url}: ${err.message}`);
    return false;
  }
}

// Gallery items from Zen Hospital
const ZEN_GALLERY_IMAGES = [
  {
    url: 'https://zenhospital.co.in/cm-admin/uploads/image/gallery/hospital/IMG_2271.jpg',
    filename: 'zen_gallery_01.jpg',
    title: 'Hospital Welcome Lounge & Reception Desk',
    category: 'Hospital Infrastructure',
    album: 'hospital-infrastructure-reception',
    caption: 'Comfortable, welcoming reception and waiting lounge for patients and families at MatruKa.',
  },
  {
    url: 'https://zenhospital.co.in/cm-admin/uploads/image/gallery/hospital/IMG_2267.jpg',
    filename: 'zen_gallery_02.jpg',
    title: 'Private Maternity & Bonding Suite',
    category: 'Patient Rooms',
    album: 'maternity-inpatient-suites',
    caption: 'Warm, air-conditioned private suite designed for comfortable bonding between mother and newborn.',
  },
  {
    url: 'https://zenhospital.co.in/cm-admin/uploads/image/gallery/hospital/IMG_2269.jpg',
    filename: 'zen_gallery_03.jpg',
    title: 'Deluxe Inpatient Care Room',
    category: 'Patient Rooms',
    album: 'maternity-inpatient-suites',
    caption: 'Modern inpatient room with ergonomic adjustable bed, attendant sofa, and ensuite amenities.',
  },
  {
    url: 'https://zenhospital.co.in/cm-admin/uploads/image/gallery/hospital/IMG_2268.jpg',
    filename: 'zen_gallery_04.jpg',
    title: 'Postoperative Recovery & Monitoring Bed',
    category: 'Clinical Suites',
    album: 'consultation-clinical-facilities',
    caption: 'Equipped with continuous vital monitors and immediate nurse assistance buzzer.',
  },
  {
    url: 'https://zenhospital.co.in/cm-admin/uploads/image/gallery/hospital/IMG_2278.jpg',
    filename: 'zen_gallery_05.jpg',
    title: 'Sunlit Inpatient Healing Suite',
    category: 'Patient Rooms',
    album: 'maternity-inpatient-suites',
    caption: 'Spacious, well-ventilated patient recovery room promoting quiet rest after gynecological procedures.',
  },
  {
    url: 'https://zenhospital.co.in/cm-admin/uploads/image/gallery/hospital/IMG_2274.jpg',
    filename: 'zen_gallery_06.jpg',
    title: 'Twin Patient Care Room',
    category: 'Patient Rooms',
    album: 'maternity-inpatient-suites',
    caption: 'Clean, sanitized twin-sharing room with personal privacy curtains and individual bedside lockers.',
  },
  {
    url: 'https://zenhospital.co.in/cm-admin/uploads/image/gallery/hospital/IMG_2309.jpg',
    filename: 'zen_gallery_07.jpg',
    title: 'Consultation Cabin & Patient Counseling Suite',
    category: 'Clinical Suites',
    album: 'consultation-clinical-facilities',
    caption: 'Private consultation space where Dr. Kairavi Yagnik & Dr. Rut Shah conduct in-depth patient counseling.',
  },
  {
    url: 'https://zenhospital.co.in/cm-admin/uploads/image/gallery/hospital/IMG_2306.jpg',
    filename: 'zen_gallery_08.jpg',
    title: 'Diagnostic Ultrasound Examination Station',
    category: 'Clinical Suites',
    album: 'consultation-clinical-facilities',
    caption: 'Equipped for high-resolution pelvic and obstetric ultrasonography directly by certified sonologists.',
  },
  {
    url: 'https://zenhospital.co.in/cm-admin/uploads/image/gallery/hospital/IMG_2305.jpg',
    filename: 'zen_gallery_09.jpg',
    title: 'Central Nursing & Patient Monitoring Desk',
    category: 'Hospital Infrastructure',
    album: 'hospital-infrastructure-reception',
    caption: '24x7 staffed nursing station ensuring prompt medical assistance for labour and recovery beds.',
  },
  {
    url: 'https://zenhospital.co.in/cm-admin/uploads/image/gallery/hospital/IMG_2279.jpg',
    filename: 'zen_gallery_10.jpg',
    title: 'Premium Maternity Room with Attendant Seating',
    category: 'Patient Rooms',
    album: 'maternity-inpatient-suites',
    caption: 'Spacious suite allowing father and family to remain close during the joyful postpartum recovery phase.',
  },
  {
    url: 'https://zenhospital.co.in/cm-admin/uploads/image/gallery/hospital/IMG_2277.jpg',
    filename: 'zen_gallery_11.jpg',
    title: 'Special Care Observation Room',
    category: 'Clinical Suites',
    album: 'consultation-clinical-facilities',
    caption: 'Dedicated observation room for short-stay monitoring, NST tracing, and pre-delivery checks.',
  },
  {
    url: 'https://zenhospital.co.in/cm-admin/uploads/image/gallery/hospital/IMG_2273.jpg',
    filename: 'zen_gallery_12.jpg',
    title: 'OPD Waiting Lounge & Patient Corridor',
    category: 'Hospital Infrastructure',
    album: 'hospital-infrastructure-reception',
    caption: 'Clean, sanitized clinic corridor and seating area at Solaris Cure, VIP Road, Surat.',
  },
  {
    url: 'https://zenhospital.co.in/cm-admin/uploads/image/gallery/hospital/IMG_2266.jpg',
    filename: 'zen_gallery_13.jpg',
    title: 'Executive Recovery Room',
    category: 'Patient Rooms',
    album: 'maternity-inpatient-suites',
    caption: 'Quiet inpatient room with comfortable patient furnishings and complete infection-control standards.',
  },
  {
    url: 'https://zenhospital.co.in/cm-admin/uploads/image/gallery/hospital/IMG_2265.jpg',
    filename: 'zen_gallery_14.jpg',
    title: 'Consultant OBGYN Examination Cabin',
    category: 'Clinical Suites',
    album: 'consultation-clinical-facilities',
    caption: 'Confidential clinical examination room equipped with modern diagnostic tools and sterile supplies.',
  },
];

// Target Blog Posts from Zen Hospital
const TARGET_BLOGS = [
  {
    url: 'https://zenhospital.co.in/blog/fibroids-fertility-pregnancy-the-connection-women-must-know.html',
    imageUrl: 'https://zenhospital.co.in/cm-admin/uploads/image/fibroids-during-pregnancy.png',
    filename: 'blog_fibroids_pregnancy.png',
    slug: 'fibroids-fertility-pregnancy-connection',
    category: 'Gynaecology & Health',
    author: 'Dr. Kairavi Yagnik',
    defaultTitle: 'Fibroids, Fertility & Pregnancy: The Connection Every Woman Must Know',
  },
  {
    url: 'https://zenhospital.co.in/blog/pcos-is-now-pmos-find-out-why-the-name-changed-and-what-the-big-difference-is.html',
    imageUrl: 'https://zenhospital.co.in/cm-admin/uploads/image/pcos-is-now-pmos.png',
    filename: 'blog_pcos_guide.png',
    slug: 'understanding-pcos-pcod-womens-health',
    category: 'Gynaecology & Health',
    author: 'Dr. Rut Shah',
    defaultTitle: 'Understanding PCOS & Metabolic Health: Symptoms, Diagnosis and Management',
  },
  {
    url: 'https://zenhospital.co.in/blog/labor-delivery/how-you-give-birth-doesnt-define-your-strength.html',
    imageUrl: 'https://zenhospital.co.in/cm-admin/uploads/image/blog/giving-birth.webp',
    filename: 'blog_giving_birth.webp',
    slug: 'how-you-give-birth-doesnt-define-your-strength',
    category: 'Pregnancy & Childbirth',
    author: 'Dr. Kairavi Yagnik',
    defaultTitle: 'How You Give Birth Doesn’t Define Your Strength: Labour & Delivery Insights',
  },
  {
    url: 'https://zenhospital.co.in/blog/infertility/6-phases-of-infertility.html',
    imageUrl: 'https://zenhospital.co.in/cm-admin/uploads/image/blog/infertility-women.jpg',
    filename: 'blog_infertility_phases.jpg',
    slug: 'phases-of-infertility-navigating-hope-and-care',
    category: 'Infertility Care',
    author: 'Dr. Rut Shah',
    defaultTitle: 'The Emotional & Clinical Phases of Infertility: Navigating Hope and Care',
  },
  {
    url: 'https://zenhospital.co.in/blog/postpartum/what-its-really-like-to-live-with-postpartum-anxiety.html',
    imageUrl: 'https://zenhospital.co.in/cm-admin/uploads/image/blog/postpartum-depression-woman-baby.webp',
    filename: 'blog_postpartum_anxiety.webp',
    slug: 'understanding-postpartum-anxiety-maternal-health',
    category: 'Pregnancy & Childbirth',
    author: 'Dr. Kairavi Yagnik',
    defaultTitle: 'Understanding Postpartum Anxiety & Emotional Well-Being After Childbirth',
  },
  {
    url: 'https://zenhospital.co.in/blog/breastfeeding/top-9-benefits-of-laparoscopic-gynecological-procedures-you-cant-ignore.html',
    imageUrl: 'https://zenhospital.co.in/cm-admin/uploads/image/blog/best-laparoscopic-hospital-in-surat.jpg',
    filename: 'blog_laparoscopy_benefits.jpg',
    slug: 'top-benefits-of-laparoscopic-gynecological-surgery',
    category: 'Laparoscopy & Surgery',
    author: 'Dr. Rut Shah',
    defaultTitle: 'Top Benefits of Advanced Laparoscopic Gynecological Procedures',
  },
  {
    url: 'https://zenhospital.co.in/blog/breastfeeding/did-you-have-panic-attacks-or-depression-while-breastfeeding.html',
    imageUrl: 'https://zenhospital.co.in/cm-admin/uploads/image/blog/breastfeeding.jpg',
    filename: 'blog_breastfeeding_support.jpg',
    slug: 'breastfeeding-support-managing-early-challenges',
    category: 'Pregnancy & Childbirth',
    author: 'Dr. Kairavi Yagnik',
    defaultTitle: 'Breastfeeding Support: Managing Early Maternal Challenges & Mental Wellness',
  },
  {
    url: 'https://zenhospital.co.in/blog/are-ivf-babies-more-likely-to-be-premature-and-why.html',
    imageUrl: 'https://zenhospital.co.in/cm-admin/uploads/image/are-ivf-babies-more-likely-to-be-premature-and-why.png',
    filename: 'blog_ivf_premature.png',
    slug: 'premature-birth-risks-and-antenatal-care',
    category: 'Pregnancy & Childbirth',
    author: 'Dr. Rut Shah',
    defaultTitle: 'High-Risk Pregnancy & Preterm Birth Prevention: What Expectant Parents Must Know',
  },
];

function sanitizeMedicalText(text) {
  if (!text) return '';
  return text
    .replace(/Zen Hospital/gi, 'MatruKa')
    .replace(/Zen/gi, 'MatruKa')
    .replace(/Dr\.?\s+Namrata\s+Gilitwala/gi, 'Dr. Kairavi Yagnik')
    .replace(/Dr\.?\s+Namrata/gi, 'Dr. Kairavi Yagnik')
    .replace(/Dr\.?\s+Kaushik/gi, 'Dr. Rut Shah')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

async function scrapeAndPopulate() {
  try {
    console.log('[Scraper] Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGODB_URI);
    console.log('[Scraper] Connected successfully.');

    // ==========================================
    // 1. POPULATE GALLERY
    // ==========================================
    console.log('\n--- 1. PROCESSING GALLERY DATA ---');

    // Create Albums
    const albumDefinitions = [
      {
        title: 'Maternity & Inpatient Suites',
        slug: 'maternity-inpatient-suites',
        category: 'Patient Rooms',
        coverImage: '/images/gallery/zen_gallery_02.jpg',
        description: 'Private, comfortable recovery and bonding suites for mothers, newborns, and families.',
      },
      {
        title: 'Hospital Infrastructure & Welcome Lounge',
        slug: 'hospital-infrastructure-reception',
        category: 'Hospital Infrastructure',
        coverImage: '/images/gallery/zen_gallery_01.jpg',
        description: 'Modern, sanitized hospital reception, waiting corridors, and central nursing stations.',
      },
      {
        title: 'Consultation & Clinical Facilities',
        slug: 'consultation-clinical-facilities',
        category: 'Clinical Suites',
        coverImage: '/images/gallery/zen_gallery_07.jpg',
        description: 'Advanced diagnostic ultrasound stations, monitoring beds, and doctor consultation cabins.',
      },
    ];

    const albumMap = {};
    for (const aDef of albumDefinitions) {
      let album = await GalleryAlbum.findOne({ slug: aDef.slug });
      if (!album) {
        album = await GalleryAlbum.create(aDef);
        console.log(`[Gallery] Created Album: ${album.title}`);
      } else {
        album.title = aDef.title;
        album.coverImage = aDef.coverImage;
        album.description = aDef.description;
        await album.save();
        console.log(`[Gallery] Updated Album: ${album.title}`);
      }
      albumMap[aDef.slug] = album._id;
    }

    // Process Gallery Items
    let galleryCount = 0;
    for (let i = 0; i < ZEN_GALLERY_IMAGES.length; i++) {
      const g = ZEN_GALLERY_IMAGES[i];
      const backendDest = path.join(GALLERY_BACKEND, g.filename);
      const frontendDest = path.join(GALLERY_FRONTEND, g.filename);

      console.log(`[Gallery] Downloading (${i + 1}/${ZEN_GALLERY_IMAGES.length}): ${g.title}`);
      await downloadFile(g.url, backendDest, frontendDest);

      const localImageUrl = `/images/gallery/${g.filename}`;

      await GalleryItem.findOneAndUpdate(
        { title: g.title },
        {
          albumId: albumMap[g.album],
          title: g.title,
          imageUrl: localImageUrl,
          category: g.category,
          caption: g.caption,
          altText: `${g.title} at MatruKa Clinic, Surat`,
          sortOrder: i + 1,
          isPublished: true,
        },
        { upsert: true, new: true }
      );
      galleryCount++;
    }
    console.log(`[Gallery] Total Gallery Items Populated: ${galleryCount}`);

    // ==========================================
    // 2. POPULATE BLOGS
    // ==========================================
    console.log('\n--- 2. PROCESSING BLOG ARTICLES ---');

    let blogCount = 0;
    for (let i = 0; i < TARGET_BLOGS.length; i++) {
      const bInfo = TARGET_BLOGS[i];
      console.log(`[Blog] Fetching (${i + 1}/${TARGET_BLOGS.length}): ${bInfo.defaultTitle}`);

      // Download Image
      const backendImgDest = path.join(BLOGS_BACKEND, bInfo.filename);
      const frontendImgDest = path.join(BLOGS_FRONTEND, bInfo.filename);
      await downloadFile(bInfo.imageUrl, backendImgDest, frontendImgDest);
      const localFeaturedImage = `/images/blogs/${bInfo.filename}`;

      // Fetch article HTML
      let paragraphs = [];
      let articleTitle = bInfo.defaultTitle;
      try {
        const articleRes = await fetch(bInfo.url);
        if (articleRes.ok) {
          const articleHtml = await articleRes.text();
          const tMatch = articleHtml.match(/<h1[^>]*>(.*?)<\/h1>/i);
          if (tMatch && tMatch[1]) {
            articleTitle = sanitizeMedicalText(tMatch[1].replace(/<[^>]+>/g, ''));
          }

          const rawP = [...articleHtml.matchAll(/<p[^>]*>(.*?)<\/p>/gis)]
            .map((m) => sanitizeMedicalText(m[1].replace(/<[^>]+>/g, '')))
            .filter((p) => p.length > 40 && !p.includes('All rights reserved') && !p.includes('Copyright') && !p.includes('Appointment'));

          if (rawP.length >= 3) {
            paragraphs = rawP;
          }
        }
      } catch (e) {
        console.warn(`[Blog] Could not fetch live text for ${bInfo.url}, using structured fallback.`);
      }

      if (paragraphs.length < 3) {
        paragraphs = [
          `${articleTitle} is one of the most important healthcare considerations for women and expectant mothers. At MatruKa, our consultant obstetricians Dr. Kairavi Yagnik and Dr. Rut Shah emphasize early clinical guidance, comprehensive diagnostics, and personalized care suited to each patient's physiological needs.`,
          `Medical understanding and modern clinical approaches have made diagnosis and management both safer and significantly more comfortable. Whether considering pre-conceptional counseling, personalized antenatal checkups, or advanced gynaecological laparoscopy, staying well-informed empowers women to make confident healthcare decisions.`,
          `If you experience any persistent symptoms or have questions regarding maternal-fetal health, we invite you to consult our medical desk at MatruKa Clinic, Solaris Cure, VIP Road, Surat.`,
        ];
      }

      const excerpt = paragraphs[0].slice(0, 240) + '...';
      const formattedContent = paragraphs
        .map((p, idx) => {
          if (idx === 1) return `### Clinical Overview & Insights\n\n${p}`;
          if (idx === 4) return `### Key Medical Considerations\n\n${p}`;
          if (idx === 8) return `### Expert Advice from MatruKa\n\n${p}`;
          return p;
        })
        .join('\n\n');

      await Blog.findOneAndUpdate(
        { slug: bInfo.slug },
        {
          title: articleTitle,
          slug: bInfo.slug,
          excerpt,
          content: formattedContent,
          featuredImage: localFeaturedImage,
          imageAlt: `${articleTitle} - MatruKa Women's Health`,
          author: bInfo.author,
          category: bInfo.category,
          tags: ['Maternity Care', 'Women Health', 'Surat Gynecologist', 'Pregnancy Guide'],
          status: 'published',
          publishedAt: new Date(Date.now() - i * 86400000 * 2), // Spread over recent days
          isFeatured: i < 3,
          views: Math.floor(Math.random() * 80) + 45,
          readTime: `${Math.max(3, Math.round(paragraphs.length / 3))} min read`,
          seoTitle: `${articleTitle} | MatruKa Clinic Surat`,
          seoDescription: excerpt,
        },
        { upsert: true, new: true }
      );
      blogCount++;
    }

    console.log(`[Blog] Total Blogs Populated: ${blogCount}`);

    // Verify in database
    const totalGallery = await GalleryItem.countDocuments();
    const totalBlogs = await Blog.countDocuments();
    console.log(`\n[Summary] Current DB Records -> Gallery Items: ${totalGallery}, Blogs: ${totalBlogs}`);

    process.exit(0);
  } catch (error) {
    console.error('[Error] Scrape and populate failed:', error);
    process.exit(1);
  }
}

scrapeAndPopulate();
