# CrewConnect — Event Manpower Management Platform

CrewConnect is a premium, real-time marketplace that links elite wedding planners, luxury hotels, caterers, and corporate event organizers with vetted, skilled, and professional event crew. It removes the friction of event staffing by offering seamless dispatching, automated attendance, and unified dashboards.

---

## 🌟 Features

- **Double-Sided Marketplace:** Specialized dashboards for both **Employers** (planners, venues) and **Workers** (hospitality crew).
- **Vetted & Verified Crew:** Onboarding processes verify credentials, reviews, and event specializations (Hostesses, Promoters, Security, VIP Hospitality).
- **Instant Shift Booking:** Planners can post shifts, set pay rates, and hire applied staff in a few clicks.
- **Admin Command Center:** High-level dashboard for managing users, approving new workers, tracking active shifts, and overseeing system analytics.
- **Mock Database Fallback:** Automatic dynamic fallback to an in-memory mock database when MongoDB connections are unavailable, allowing offline demonstration and continuous testing.
- **Aesthetic Premium Design:** Engineered with a sleek dark-themed hero landing page, clear grid systems, and smooth UI interactions.

---

## 🛠️ Technologies Used

### Frontend & Framework
- **Next.js 14 (App Router)** — React framework for static & dynamic server rendering
- **Tailwind CSS** — Modern utility-first styling with responsive, curated color palettes
- **TypeScript** — Strongly typed codebase for maximum reliability
- **Lucide React** — Premium modern SVG icons

### Backend & Authentication
- **MongoDB & Mongoose** — Document database and object modeling
- **JSON Web Tokens (JWT)** — Secure session authentication via HTTP-only cookies
- **Bcryptjs** — Strong password hashing and security

---

## 📂 Folder Structure

The project has been optimized into a clean single-project layout at the root directory, with design mockups preserved separately.

```
stitch_event_manpower_management_platform/
├── .next/                   # Next.js build cache (ignored in git)
├── node_modules/            # Node dependencies (ignored in git)
├── src/
│   ├── app/                 # Next.js App Router directories
│   │   ├── admin/           # Admin Dashboard layout & logic
│   │   ├── api/             # API routes (Auth, Jobs, Profiles, Applications)
│   │   ├── contact/         # Contact & support page
│   │   ├── dashboard/       # Specialized Employer & Worker dashboards
│   │   ├── hire/            # Staff discovery and requisition portal
│   │   ├── jobs/            # Job details and worker application feeds
│   │   ├── join/            # Onboarding marketing page for crew
│   │   ├── join-team-reg... # Step-by-step worker registration forms
│   │   ├── login/           # Authentication portal
│   │   ├── register/        # Registration selection (Employer vs. Worker)
│   │   ├── services/        # Service catalog listing
│   │   ├── globals.css      # Core Tailwind styling & custom components
│   │   ├── layout.tsx       # Root layout, fonts, and global metadata
│   │   └── page.tsx         # Main premium Landing page (CrewConnect)
│   └── lib/                 # Core utilities, database configuration, & models
│       ├── auth.ts          # Auth helper logic
│       ├── db.ts            # MongoDB connection manager
│       ├── mockDb.ts        # Dynamic in-memory fallback database
│       └── models.ts        # Mongoose Schemas (User, Job, Profile, Application)
├── stitch_design_screens/   # Stitch-generated mockup screens (code.html & screen.png)
├── .env                     # Local environment configurations (ignored in git)
├── .gitignore               # System configuration to ignore non-repository files
├── next.config.mjs          # Next.js runtime configurations
├── package.json             # Script definitions and package dependencies
├── postcss.config.js        # PostCSS build configurations
├── tailwind.config.js       # Tailwind CSS custom theme settings
└── tsconfig.json            # TypeScript build configurations
```

---

## 🚀 Installation & Local Development

### Prerequisites
Make sure you have [Node.js (v18.x or later)](https://nodejs.org/) installed.

### 1. Clone & Re-organize
If you haven't already, ensure the files are in their optimized root structure.

### 2. Install Dependencies
Run the following command at the root directory:
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file at the root of the workspace (refer to the existing `.env` or follow this template):
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key_or_placeholder
```
*Note: If no `MONGODB_URI` is provided, the application will automatically fall back to the dynamic **In-Memory Mock Database**.*

### 4. Run Development Server
Start the local development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### 5. Build for Production
To create an optimized production build:
```bash
npm run build
```

---

## ⚡ Performance Improvements & Best Practices

1. **Database Connection Pooling:** The Mongoose connector in [db.ts](file:///e:/pankaj test/MP project/stitch_event_manpower_management_platform/src/lib/db.ts) caches the active connection to prevent connection exhaustion during serverless Next.js API requests.
2. **Next.js Route Segment Config:** For routes relying on dynamic data or cookies, verify `export const dynamic = 'force-dynamic'` is configured to prevent build-time static page generation warnings.
3. **Image Optimization:** Migrate regular `<img>` elements in the UI to the Next.js `<Image />` component from `next/image` to automatically resize, compress, and lazy-load landing page images.
4. **Tailwind Purge Optimization:** Ensure class-based purge setups inside `tailwind.config.js` point only to the source files (`./src/app/**/*.{js,ts,jsx,tsx}`) to minimize CSS file sizes.

---

## 🌐 Deployment Guide

### Option 1: Vercel (Recommended)
Because Vercel is the creator of Next.js, it offers seamless integration and automatic SSR configurations.
1. Sign in to [Vercel](https://vercel.com/) and click **Add New Project**.
2. Import your GitHub repository.
3. Keep the build command as `npm run build` and output directory as default.
4. Add your **Environment Variables** (`MONGODB_URI`, `JWT_SECRET`) in the configuration panel.
5. Click **Deploy**.

### Option 2: Netlify
1. Log in to [Netlify](https://www.netlify.com/) and select **Import from Git**.
2. Connect your Git provider and select the repository.
3. Netlify automatically detects Next.js and configures the build settings (using Netlify Next.js Runtime).
4. Add the environment variables under **Site Settings > Environment Variables**.
5. Click **Deploy Site**.

### Option 3: VPS Hosting (Ubuntu / Nginx / PM2)
For hosting on a Virtual Private Server (DigitalOcean, AWS EC2, Linode):
1. **Clone the project** onto the server.
2. **Install Node.js & PM2** globally:
   ```bash
   sudo apt update
   sudo apt install nodejs npm -y
   npm install -g pm2
   ```
3. **Setup Environment:** Create the `.env` file in the project folder.
4. **Build and Run:**
   ```bash
   npm install
   npm run build
   pm2 start npm --name "crewconnect" -- start
   ```
5. **Configure Nginx Reverse Proxy:** Edit `/etc/nginx/sites-available/default` and map requests to port `3000`:
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
6. **Restart Nginx:**
   ```bash
   sudo systemctl restart nginx
   ```
