# Er. Denish Adhikari — Professional Civil Engineering Portfolio & Admin CMS

[![Live Portfolio](https://img.shields.io/badge/Live%20Demo-denish--adhikari--portfolio.vercel.app-0070F3?style=for-the-badge&logo=vercel&logoColor=white)](https://denish-adhikari-portfolio.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/NEC%20License-No.%2079422%20Civil-emerald?style=for-the-badge&logo=civicwork&logoColor=white)](https://nec.gov.np)
[![Security](https://img.shields.io/badge/Admin%202FA-Resend%20OTP-0284c7?style=for-the-badge&logo=shield&logoColor=white)](https://resend.com)

> Official engineering portfolio, technical field records, and administrative console for **Er. Denish Adhikari**, licensed Civil Engineer registered with the **Nepal Engineering Council (NEC Reg. No. 79422 "Civil")**. Specialized in municipal wastewater treatment infrastructure (Construction of Wastewater Treatment Plant at Sallaghari, Kodku and Dhobighat), heavy reinforced concrete (RCC) execution, precision surveying (Total Station & Auto Level), and seismic structural compliance (NBC 105:2020 & IS codes).

---

## 🏗️ Quick Links

- **Live Production URL:** [https://denish-adhikari-portfolio.vercel.app/](https://denish-adhikari-portfolio.vercel.app/)
- **Engineering Admin Console:** [https://denish-adhikari-portfolio.vercel.app/admin](https://denish-adhikari-portfolio.vercel.app/admin)
- **Printable ATS Resume:** [https://denish-adhikari-portfolio.vercel.app/resume](https://denish-adhikari-portfolio.vercel.app/resume)
- **Source Code:** [https://github.com/JholeyCodes/Denish-Adhikari-Portfolio](https://github.com/JholeyCodes/Denish-Adhikari-Portfolio)

---

## 📐 Portfolio Highlights & Features

### 1. Client-Facing Portfolio
| Feature | Description |
| :--- | :--- |
| **Field Case Studies** | Comprehensive documentation of real-world civil engineering projects, including the Construction of Wastewater Treatment Plant at Sallaghari, Kodku and Dhobighat (RCC clarifiers, aeration tanks, deep bored piling, 40–50 labor force management) and technical drawings. |
| **Interactive Nepal Map** | Vector-based SVG geographic visualization marking project execution locations across Bhaktapur, Kathmandu Valley, Pokhara, Gandaki Province, and Lumbini Province. |
| **Category-Filtered Projects** | Dynamic filtering covering Infrastructure, Buildings, Surveying, and Academic Capstone with instantaneous keyword search. |
| **Construction & Survey Records** | High-resolution photographic site records documenting excavation, rebar cage fabrication, concreting, and Total Station instrument setups. |
| **Dedicated ATS Digital Resume** | Standalone `/resume` route with `@media print` styling for 1-click PDF generation and municipal compliance dossiers. |
| **Interactive Inquiry Submission** | Direct client inquiry form with service selection (RCC Design, Seismic Review, Supervision) and 1-click WhatsApp scope pre-population. |

### 2. Engineering Admin CMS & Two-Factor Authentication (`/admin`)
| Capability | Description |
| :--- | :--- |
| **Zero-Trust 2FA Security** | 2-step authentication: Master password verification followed by an automated, single-use 6-digit cryptographic OTP dispatched directly to the admin email via [Resend](https://resend.com). |
| **Live Content Editor** | Modify bio, rotating specializations, contact numbers, and licensing metadata in real time. |
| **Project & Experience Manager** | Add, edit, or delete case studies, structural deliverables, and timeline milestones. |
| **Field Photo Gallery Manager** | Upload and curate on-site photographic proof with technical tags and captions. |
| **Technical Skills Manager** | Adjust proficiency bars across structural software, surveying equipment, and design codes. |
| **Client Inquiries Inbox** | Read, manage, and toggle read/unread status on incoming consultation requests, with **1-click CSV export**. |
| **Direct GitHub Synchronization** | Commit admin edits directly back to the GitHub repository using a GitHub Personal Access Token (PAT). |
| **JSON Backup & Restore** | Export or import the entire portfolio data state with one click. |

---

## 🛠️ Tech Stack & Architecture

- **Framework:** [Next.js 14 (App Router)](https://nextjs.org/)
- **Language:** TypeScript 5.0
- **Styling:** Tailwind CSS (Dark slate, structural grid & blueprint aesthetic)
- **Email Delivery:** [Resend API](https://resend.com/) (Zero-dependency native `fetch` dispatcher)
- **Security:** Cryptographic HMAC-SHA256 session tokens & signed OTP challenge verification
- **Icons:** Lucide React
- **Hosting & CI/CD:** [Vercel](https://vercel.com/) (Automated deployments from `main`)

---

## 🔐 Environment Configuration

Create a `.env.local` file in the root directory (see [`.env.example`](.env.example)):

```env
# Master Administration Password (Step 1)
ADMIN_PASSWORD=denish2026!

# Recipient Email for 2FA Verification Codes
ADMIN_EMAIL=aprajwal9fguy@gmail.com

# Transactional Email Dispatcher (Resend API)
RESEND_API_KEY=re_your_api_key_here

# Optional: Verified Custom Sender Domain (Defaults to: Er. Denish Security <onboarding@resend.dev>)
# MAIL_FROM="Er. Denish Adhikari <security@denishadhikari.com>"
```

---

## 📂 Project Directory Structure

```bash
denish_portfolio/
├── app/
│   ├── globals.css              # Custom tokens, structural blueprint grid, print rules
│   ├── layout.tsx               # Root layout, dynamic OpenGraph metadata & SEO
│   ├── page.tsx                 # Main streamlined homepage
│   ├── admin/
│   │   └── page.tsx             # Protected Admin CMS & 2FA login console
│   ├── api/
│   │   ├── admin/auth/          # 2FA challenge generation, email dispatch & session cookies
│   │   └── admin/content/       # Unified content hydration & persistence endpoints
│   ├── projects/[slug]/         # Dynamic project deep-dive case study routes
│   └── resume/                  # Standalone ATS-formatted printable resume route
├── components/
│   ├── AboutSection.tsx         # Engineering credentials & background
│   ├── CaseStudyModal.tsx       # Detailed project breakdown modal
│   ├── ContactSection.tsx       # Inquiry form with WhatsApp deep-link
│   ├── ExperienceSection.tsx    # Professional & site supervision timeline
│   ├── GallerySection.tsx       # Construction records photography lightbox
│   ├── Hero.tsx                 # Hero section with dynamic specialization ticker
│   ├── Navbar.tsx               # Sticky navigation with active scroll-spy & license badge
│   ├── NepalMapSection.tsx      # SVG interactive project map
│   ├── ProjectsSection.tsx      # Instant search & categorized case studies
│   ├── ResumeModal.tsx          # In-app printable CV modal
│   ├── SkillsSection.tsx        # Technical software, surveying tools & IS/NBC codes
│   └── StatsCounter.tsx         # Quantified site achievements
├── data/
│   ├── experience.ts            # Career history & site responsibilities
│   ├── gallery.ts               # Construction site photography & metadata
│   ├── projects.ts              # Detailed project specs, scopes & outcomes
│   ├── siteData.ts              # Personal info, contact channels & navigation
│   ├── skills.ts                # Software, standards & field competencies
│   └── PortfolioContext.tsx     # Unified reactive context hydrating admin updates
├── lib/
│   └── sendEmail.ts             # Zero-dependency transactional email dispatcher
└── public/
    ├── images/                  # Project photos, blueprints & portrait assets
    └── og-image.png             # 1200x630px social preview card
```

---

## 💻 Local Development Setup

```bash
# 1. Clone repository
git clone https://github.com/JholeyCodes/Denish-Adhikari-Portfolio.git

# 2. Navigate to project directory
cd Denish-Adhikari-Portfolio

# 3. Install dependencies
npm install

# 4. Set up environment variables
cp .env.example .env.local
# (Edit .env.local with your RESEND_API_KEY)

# 5. Start local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the portfolio and [http://localhost:3000/admin](http://localhost:3000/admin) for the admin console.

To verify a production build:
```bash
npm run build
npm run start
```

---

## 👨‍💼 Contact Er. Denish Adhikari

- **License:** Nepal Engineering Council (NEC No. 79422 "Civil")
- **Email:** [den.adh0709@gmail.com](mailto:den.adh0709@gmail.com)
- **Phone / WhatsApp:** [+977 9867730557](https://wa.me/9779867730557)
- **Location:** Kathmandu, Nepal
- **LinkedIn:** [linkedin.com/in/denish-adhikari](https://www.linkedin.com/in/denish-adhikari/)

---

*Engineered with precision for modern civil engineering practice.*
