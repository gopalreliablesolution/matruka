# MATRUKA — COMPLETE CARE FOR HER
### Professional Women's Healthcare Hospital Website & Dynamic CMS

Matruka (`માતૃકા`) is a premier women's healthcare, maternity, pregnancy, and gynecology clinic based in Surat, Gujarat, led by **Dr. Kairavi Yagnik** (MBBS, MS OBGYN) and **Dr. Rut Shah** (MBBS, MS OBGYN).

---

## 🏥 Confirmed Clinic Information

- **Brand:** Matruka — Complete Care for Her
- **Founding Obstetricians & Gynaecologists:**
  - **Dr. Kairavi Yagnik** — MBBS, MS (OBGYN), Fellowship in Advanced Laparoscopic Surgery, FOGSI Ultrasound Certified.
  - **Dr. Rut Shah** — MBBS, MS (OBGYN), Fellowship in Advanced Laparoscopic Surgery, FOGSI Ultrasound Certified.
- **Address:** 303-306, Solaris Cure, Besides Ratnajyoti Apartment, VIP Road, Surat - 395007
- **Appointment / Contact Phone:** `+91 79848 82273`
- **Emergency Service:** `24 * 7 Emergency Maternity & Gynecological Care`
- **OPD Consultation Timings:**
  - **Morning:** `10:00 AM - 1:00 PM` (Monday to Saturday)
  - **Evening:** `5:00 PM - 7:00 PM` (Monday to Saturday)
  - **Sunday:** Emergency Only
- **Core Clinical Services (14 Confirmed Specialities):**
  1. Personalized Antenatal Care (ANC)
  2. Normal Delivery & Cesarean Section
  3. Painless Vaginal Delivery (PVD)
  4. High-Risk Pregnancy Management
  5. Gynecological Laparoscopic Surgeries
  6. Hysterectomy Surgeries (TLH, NDVH, Abdominal)
  7. Pre-Conceptional Counselling
  8. Postpartum Care & Lactation Advice
  9. Family Planning & Contraceptive Guidance
  10. Gynecological Ultrasound Diagnostics
  11. Adolescent Healthcare & Puberty Guidance
  12. Treatment of Menstrual Irregularities & PCOD/PCOS
  13. Infertility Evaluation & Management
  14. Menopause Care & Hormone Replacement Therapy

---

## 💡 Strictly Informational Public Website Policy

In accordance with strict clinic requirements:
- **No Online Appointment Booking Forms** (avoids unverified registrations and ghost slots)
- **No Online Payment Gateways**
- **No Patient Portal / Registration Forms**
- **No Generic Enquiry Forms**
- **Direct Engagement Only:** Direct Click-to-Call (`tel:+917984882273`), Direct WhatsApp Chat with clinical desk (`https://wa.me/917984882273`), and Direct Google Maps navigation to Solaris Cure, Surat.

---

## 📁 Storage & Database Policy

1. **MongoDB Database:**
   - Database URL: `mongodb://127.0.0.1:27017/matruka`
   - Complete Mongoose schemas for all 18 CMS modules with auto-slug generation, indexes, and full text search.
2. **Local Server Disk File Storage:**
   - **Zero 3rd party cloud dependencies** (no Cloudinary, AWS S3, or Firebase).
   - All uploaded images and media documents are stored directly on the host server filesystem inside `backend/uploads/` with unique sanitized timestamps and MIME validation.
   - Files are served securely via Express static middleware at `http://localhost:5000/uploads/:filename`.

---

## 🏗️ Architecture & Technology Stack

```
D:\Project's\MATRUKA\
├── backend/                       # Express.js REST API Server (Port 5000)
│   ├── src/
│   │   ├── config/                # MongoDB Mongoose connection
│   │   ├── controllers/           # 18 Modular API controllers
│   │   ├── middlewares/           # JWT auth, RBAC roles, Multer disk storage
│   │   ├── models/                # 15 Mongoose schemas
│   │   └── routes/                # Admin & Public API routes
│   ├── scripts/seed.js            # Comprehensive database seed script
│   ├── uploads/                   # Local server storage for media uploads
│   └── server.js                  # Entry point
│
├── frontend/                      # Next.js 15 (React 19, TypeScript, Tailwind) (Port 3000)
│   ├── app/
│   │   ├── (marketing)/           # 13 Public informational pages
│   │   │   ├── page.tsx           # Dynamic homepage (13 configurable sections)
│   │   │   ├── about/             # Clinic vision, story, philosophy
│   │   │   ├── services/          # Grid view & [slug] service detail pages
│   │   │   ├── doctors/           # Consultant profiles & [slug] doctor pages
│   │   │   ├── facilities/        # Ultrasound, OT, LDR suites, recovery rooms
│   │   │   ├── gallery/           # Clinical & infrastructure albums
│   │   │   ├── testimonials/      # Patient experiences & verified reviews
│   │   │   ├── blog/              # Medical articles & [slug] guides
│   │   │   ├── faqs/              # Categorized patient questions & answers
│   │   │   ├── contact/           # Map, address, click-to-call, OPD hours
│   │   │   ├── privacy-policy/    # Patient confidentiality notice
│   │   │   └── terms/             # Informational disclaimer
│   │   └── admin/                 # Complete Matruka CMS Admin Panel
│   │       ├── login/             # Secure JWT login
│   │       ├── page.tsx           # Dashboard statistics & activity feeds
│   │       ├── doctors/           # Doctor profiles management
│   │       ├── services/          # 14 Clinical specialities & SEO
│   │       ├── facilities/        # Clinic infrastructure manager
│   │       ├── blogs/             # Healthcare article manager
│   │       ├── media/             # Media library & local file uploader
│   │       ├── settings/          # Contact details, address, OPD hours
│   │       ├── homepage/          # Hero banner, stats, badges, section orders
│   │       ├── faqs/              # Q&A management & categories
│   │       ├── banners/           # Hero slider & promotional banner slides
│   │       ├── testimonials/      # Patient reviews & star ratings
│   │       ├── gallery/           # Album & media manager
│   │       ├── menus/             # Header & footer navigation links
│   │       ├── pages/             # Dynamic static pages
│   │       ├── users/             # Admin accounts & role assignments
│   │       ├── activity-logs/     # Audit logging (Who changed what & when)
│   │       └── backup/            # System health, MongoDB status, disk info
│   ├── components/                # Reusable UI & Admin components
│   └── lib/                       # Axios client & Auth context
│
├── dev.js                         # Root development runner (backend + frontend)
└── package.json                   # Root orchestrator scripts
```

---

## 🚀 Quick Start Guide

### Prerequisites
1. **Node.js**: v18.0.0 or higher
2. **MongoDB**: Local MongoDB community service running at `mongodb://127.0.0.1:27017`

### Step 1: Install Dependencies
Run in the root folder:
```bash
# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install
cd ..
```

### Step 2: Seed the Database
Populate MongoDB with authentic Matruka clinic information, the 14 confirmed services, doctors, facilities, blogs, FAQs, and create the default Super Admin:
```bash
npm run seed
```

### Step 3: Run Development Servers
Start both backend (port 5000) and frontend (port 3000) concurrently:
```bash
npm run dev
```

- **Public Website:** `http://localhost:3000`
- **Admin Panel:** `http://localhost:3000/admin`
- **Backend API:** `http://localhost:5000/api/v1`
- **Health Check:** `http://localhost:5000/health`

---

## 🔐 Default Admin Credentials

Upon running `npm run seed`:
- **URL:** `http://localhost:3000/admin/login`
- **Email:** `admin@matruka.in`
- **Password:** `Admin@Matruka2026`
- **Role:** `super_admin`

---

## 🎨 Color Palette Reference

- **Primary Teal:** `#05A6B4`
- **Deep Teal:** `#078F9C`
- **Gold Accent:** `#F2B632`
- **Light Aqua:** `#EAF8F8`
- **Dark Text:** `#344B53`
- **Clean White:** `#FFFFFF`

