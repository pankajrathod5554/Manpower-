# CrewConnect — Event Staff Deployment & Attendance Platform

CrewConnect is a premium, real-time staff deployment and attendance management system. It enables event administrators to create events, deploy vetted staff across five core event verticals, and track on-site attendance securely using Geolocation GPS coordinates and HTML5 camera selfie validation.

---

## 🌟 Key Features

- **Simplified Role Access:** Limited to exactly two user profiles: **Admin** and **Staff**.
- **Admin Deployment Console:**
  - Track events by status (Upcoming, Active, Completed).
  - Manage events (Create, Edit, Delete events with details like date, time, location, category).
  - Assign crew (Name, Mobile, Category) to specific event deployments.
  - Live attendance log viewer displaying check-in/out timestamps, Google Maps coordinates link, and selfie verification photos.
- **Staff Shift Portal:**
  - View list of active deployments and assigned event venues.
  - Check-In and Check-Out actions for deployed shifts.
  - Built-in GPS position tracking and webcam selfie capture for verified, fraud-free attendance reporting.
- **Sleek landing page:** Showcases the 5 manpower categories with high-end imagery.
- **In-Memory Fallback DB:** Automatic backup system fallback to an in-memory mock database if MongoDB connections are down, enabling smooth demo deployments.

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

```
stitch_event_manpower_management_platform/
├── .next/                   # Next.js build cache (ignored in git)
├── node_modules/            # Node dependencies (ignored in git)
├── src/
│   ├── app/                 # Next.js App Router directories
│   │   ├── admin/           # Admin Command Center Console
│   │   ├── api/             # API routes
│   │   │   ├── auth/        # Login, logout, session endpoints
│   │   │   └── events/      # Event CRUD & Staff Attendance checkin/out
│   │   ├── contact/         # Contact & support page
│   │   ├── dashboard/       # Specialized Staff shift portal
│   │   │   └── staff/       # Staff shifts feed and attendance controls
│   │   ├── login/           # Unified portal sign-in (Admin vs Staff)
│   │   ├── services/        # Service catalog listing the 5 categories
│   │   ├── globals.css      # Core Tailwind styling & custom components
│   │   ├── layout.tsx       # Global Navigation headers & footers
│   │   └── page.tsx         # Redesigned landing page showcasing service categories
│   └── lib/                 # Core utilities, database configuration, & models
│       ├── auth.ts          # Auth helper logic
│       ├── db.ts            # MongoDB connection manager
│       ├── mockDb.ts        # Seeded in-memory mock database fallback
│       └── models.ts        # Mongoose Schemas (User & Event models)
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

### 1. Install Dependencies
Run the following command at the root directory:
```bash
npm install
```

### 2. Environment Setup
Create a `.env` file at the root of the workspace:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key_or_placeholder
```
*(Note: If no `MONGODB_URI` is provided, the application will automatically fall back to the dynamic In-Memory Mock Database).*

### 3. Run Development Server
Start the local development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### 4. Build for Production
To create an optimized production build:
```bash
npm run build
```

---

## ⚡ Deployment Guide

### Option 1: Vercel (Recommended)
1. Sign in to [Vercel](https://vercel.com/) and click **Add New Project**.
2. Import your GitHub repository.
3. Add your **Environment Variables** (`MONGODB_URI`, `JWT_SECRET`) in the configuration panel.
4. Click **Deploy**.

### Option 2: Netlify
1. Log in to [Netlify](https://www.netlify.com/) and select **Import from Git**.
2. Connect your Git provider and select the repository.
3. Configure Env vars under Site Settings > Environment Variables.
4. Click **Deploy Site**.

### Option 3: VPS Hosting (Ubuntu / Nginx / PM2)
1. Clone the project onto the server.
2. Build and Run:
   ```bash
   npm install
   npm run build
   pm2 start npm --name "crewconnect" -- start
   ```
3. Configure Nginx Reverse Proxy to target port `3000`.
