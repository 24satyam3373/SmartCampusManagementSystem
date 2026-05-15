# 🎓 Smart Campus Management System (Galgotias University)

A full-stack campus management platform built with the **MERN Stack** (MongoDB, Express, React, Node.js), featuring role-based access control for **Admin**, **Faculty**, and **Student** users.

---

## 📋 Table of Contents

- [Prerequisites](#-prerequisites)
- [Project Structure](#-project-structure)
- [Installation & Setup](#-installation--setup)
- [Environment Configuration](#-environment-configuration)
- [Running the Project](#-running-the-project)
- [Default Login Credentials](#-default-login-credentials)
- [Features](#-features)
- [API Documentation](#-api-documentation)
- [Tech Stack](#-tech-stack)
- [Database Schema](#-database-schema)
- [Architecture](#-architecture)
- [Troubleshooting](#-troubleshooting)

---

## 🔧 Prerequisites

Make sure you have the following installed on your system before proceeding:

| Software | Version | Download Link |
|----------|---------|---------------|
| **Node.js** | v18 or higher | [https://nodejs.org](https://nodejs.org) |
| **npm** | v9 or higher | Comes with Node.js |
| **Git** | Latest | [https://git-scm.com](https://git-scm.com) |
| **MongoDB** | Atlas (cloud) or Local v7+ | [https://mongodb.com/atlas](https://mongodb.com/atlas) |

### Verify Installation
```bash
node --version    # Should show v18.x.x or higher
npm --version     # Should show v9.x.x or higher
git --version     # Should show git version 2.x.x
```

---

## 📁 Project Structure

```
Smart Campus Management System/
│
├── backend/                    # 🖥️ Node.js + Express REST API (Port 5000)
│   ├── config/
│   │   └── db.js               # MongoDB connection utility
│   ├── controllers/
│   │   ├── authController.js   # Login, Register, Profile, Password, Stats
│   │   ├── courseController.js  # CRUD, Enrollment, State transitions
│   │   ├── attendanceController.js  # Bulk marking, Queries, Stats
│   │   ├── gradeController.js  # Grade upsert, GPA computation
│   │   └── notificationController.js # Create, List, Mark-as-read
│   ├── middleware/
│   │   ├── auth.js             # JWT token verification
│   │   └── roleCheck.js        # Role-based access control
│   ├── models/
│   │   ├── User.js             # User schema (bcrypt hashing)
│   │   ├── Course.js           # Course schema (state machine)
│   │   ├── Attendance.js       # Attendance schema (compound index)
│   │   ├── Grade.js            # Grade schema (auto-compute GPA)
│   │   └── Notification.js     # Notification schema (role targeting)
│   ├── routes/
│   │   ├── authRoutes.js       # /api/auth/*
│   │   ├── courseRoutes.js     # /api/courses/*
│   │   ├── attendanceRoutes.js # /api/attendance/*
│   │   ├── gradeRoutes.js      # /api/grades/*
│   │   └── notificationRoutes.js # /api/notifications/*
│   ├── .env                    # Environment variables (DO NOT COMMIT)
│   ├── .env.example            # Environment template
│   ├── package.json            # Backend dependencies
│   ├── seed.js                 # Database seeding script
│   └── server.js               # Express app entry point
│
├── frontend/                   # 🌐 React Public Landing Site (Port 5173)
│   ├── index.html              # HTML entry point
│   ├── package.json            # Frontend dependencies
│   ├── vite.config.js          # Vite configuration
│   └── src/
│       ├── main.jsx            # React entry point
│       ├── App.jsx             # Router setup (Home, About, Modules, Contact)
│       ├── index.css           # Global styles (dark theme, glassmorphism)
│       ├── components/
│       │   └── Navbar.jsx      # Navigation bar with scroll effects
│       └── pages/
│           ├── Home.jsx        # Landing page with hero, features, stats
│           ├── About.jsx       # Project scope and architecture
│           ├── Modules.jsx     # Admin/Faculty/Student capability cards
│           └── Contact.jsx     # Contact form
│
├── dashboard/                  # 📊 React + MUI Dashboard App (Port 5174)
│   ├── index.html              # HTML entry point
│   ├── package.json            # Dashboard dependencies
│   ├── vite.config.js          # Vite config (port 5174)
│   └── src/
│       ├── main.jsx            # React entry with MUI ThemeProvider
│       ├── App.jsx             # Router with ProtectedRoute
│       ├── index.css           # Dashboard CSS overrides
│       ├── theme.js            # MUI dark theme configuration
│       ├── services/
│       │   └── api.js          # Axios instance (baseURL, JWT interceptor)
│       ├── context/
│       │   ├── AuthContext.jsx  # JWT auth state management
│       │   └── SnackbarContext.jsx # Toast notification context
│       ├── components/
│       │   ├── auth/
│       │   │   └── ProtectedRoute.jsx  # Route guard
│       │   ├── layout/
│       │   │   ├── TopNav.jsx          # Top navigation bar
│       │   │   ├── Sidebar.jsx         # Searchable sidebar
│       │   │   └── DashboardLayout.jsx # Layout wrapper
│       │   └── common/
│       │       ├── ExportButton.jsx    # CSV export component
│       │       └── SkeletonTable.jsx   # Loading skeleton
│       └── pages/
│           ├── LoginPage.jsx       # Login with quick-access buttons
│           ├── DashboardHome.jsx   # Stats + Charts (Recharts)
│           ├── CoursesPage.jsx     # CRUD table + enrollment
│           ├── AttendancePage.jsx  # Bulk marking + records
│           ├── GradesPage.jsx      # Grading + GPA card
│           ├── NotificationsPage.jsx # Inbox + create
│           ├── TimetablePage.jsx   # Weekly schedule grid
│           └── ProfilePage.jsx     # Profile edit + password change
│
└── README.md                   # This file
```

---

## 📥 Installation & Setup

### Step 1: Clone or Download the Project

```bash
# If using Git
git clone <repository-url>
cd "Smart Campus Management System"
```

### Step 2: Install Backend Dependencies

```bash
cd backend
npm install
```

This installs:
| Package | Purpose |
|---------|---------|
| `express` | Web framework |
| `mongoose` | MongoDB ODM |
| `bcryptjs` | Password hashing |
| `jsonwebtoken` | JWT auth tokens |
| `cors` | Cross-origin requests |
| `dotenv` | Environment variables |
| `morgan` | HTTP request logging |
| `nodemon` (dev) | Auto-restart on changes |

### Step 3: Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

This installs: `react-router-dom`, `axios`, `vite`

### Step 4: Install Dashboard Dependencies

```bash
cd ../dashboard
npm install
```

This installs:
| Package | Purpose |
|---------|---------|
| `@mui/material` + `@emotion/*` | UI component library |
| `@mui/icons-material` | Material icons |
| `recharts` | Chart/graph library |
| `axios` | HTTP client |
| `react-router-dom` | Client-side routing |

---

## ⚙ Environment Configuration

### Step 1: Create the `.env` file

```bash
cd backend
```

Create a `.env` file (or copy from `.env.example`):

```bash
cp .env.example .env    # Linux/Mac
copy .env.example .env  # Windows CMD
```

### Step 2: Edit `.env` with your values

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/Galgotias University?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
```

### Environment Variables Explained

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `PORT` | Yes | Backend server port | `5000` |
| `MONGO_URI` | Yes | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/Galgotias University` |
| `JWT_SECRET` | Yes | Secret key for signing JWT tokens | `my_super_secret_key_123` |
| `JWT_EXPIRE` | Yes | Token expiration time | `7d` (7 days) |
| `NODE_ENV` | No | Environment mode | `development` or `production` |

### MongoDB Atlas Setup (if using cloud)

1. Go to [https://cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a free cluster (M0 Sandbox)
3. Create a database user (Database Access → Add New Database User)
4. Whitelist your IP (Network Access → Add IP Address → Allow Access from Anywhere: `0.0.0.0/0`)
5. Get connection string (Database → Connect → Drivers → Copy URI)
6. Replace `<username>`, `<password>` in the URI
7. **Important**: If your password contains `@`, replace it with `%40` in the URI

### Using Local MongoDB (alternative)

```env
MONGO_URI=mongodb://localhost:27017/Galgotias University
```

Make sure MongoDB is running locally: `mongod --dbpath /data/db`

---

## 🚀 Running the Project

You need **3 separate terminals** to run all services:

### Terminal 1: Backend API (Port 5000)

```bash
cd backend

# First time only - seed the database with sample data
npm run seed

# Start the development server
npm run dev
```

Expected output:
```
[nodemon] starting `node server.js`
🚀 Galgotias University Backend running on port 5000
✅ MongoDB Connected: ac-xxxxx-shard-00-00.xxxxx.mongodb.net
```

### Terminal 2: Frontend Landing Site (Port 5173)

```bash
cd frontend
npm run dev
```

Expected output:
```
VITE v8.0.12 ready in 147 ms
  ➜  Local:   http://localhost:5173/
```

### Terminal 3: Dashboard App (Port 5174)

```bash
cd dashboard
npm run dev
```

Expected output:
```
VITE v8.0.12 ready in 219 ms
  ➜  Local:   http://localhost:5174/
```

### Access the Application

| Application | URL | Description |
|-------------|-----|-------------|
| **Frontend** | [http://localhost:5173](http://localhost:5173) | Public landing page |
| **Dashboard** | [http://localhost:5174](http://localhost:5174) | Login → Role-based dashboard |
| **API Health** | [http://localhost:5000/api/health](http://localhost:5000/api/health) | Backend health check |

### Production Build

```bash
# Frontend
cd frontend
npx vite build    # Output: frontend/dist/

# Dashboard
cd dashboard
npx vite build    # Output: dashboard/dist/

# Backend
cd backend
npm start         # Runs without nodemon
```

---

## 🔑 Default Login Credentials

After running `npm run seed`, these accounts are created:

| Role | Name | Email | Password | ID |
|------|------|-------|----------|----|
| **Admin** | Dr. Admin | `admin@Galgotias University.edu` | `admin123` | — |
| **Faculty** | Dr. Sarah Mitchell | `faculty1@Galgotias University.edu` | `faculty123` | FAC001 |
| **Faculty** | Prof. James Carter | `faculty2@Galgotias University.edu` | `faculty123` | FAC002 |
| **Student** | Alice Johnson | `student1@Galgotias University.edu` | `student123` | STU001 |
| **Student** | Bob Williams | `student2@Galgotias University.edu` | `student123` | STU002 |
| **Student** | Carol Davis | `student3@Galgotias University.edu` | `student123` | STU003 |
| **Student** | David Brown | `student4@Galgotias University.edu` | `student123` | STU004 |
| **Student** | Eve Wilson | `student5@Galgotias University.edu` | `student123` | STU005 |

### Seeded Data Summary

| Data Type | Count | Details |
|-----------|-------|---------|
| Users | 8 | 1 Admin, 2 Faculty, 5 Students |
| Courses | 4 | CS101, MATH201, PHY101, ENG102 |
| Attendance | ~42 | Last 10 weekdays for CS101 & MATH201 |
| Grades | 3 | For CS101 enrolled students |
| Notifications | 2 | Welcome + Mid-Term announcements |

---

## ✨ Features

### Core Features
- **JWT Authentication** — Secure login with role-based access control
- **Course Lifecycle** — State machine: `Draft → Published → Enrollment Open → In Progress → Completed → Archived`
- **Bulk Attendance Marking** — Faculty marks all students at once with Present/Absent/Late/Excused
- **Weighted Grade Computation** — Auto-calculates totalGrade, letterGrade (A+ to F), and GPA (4.0 scale)
- **Notification System** — Role-targeted notifications with priority levels and read/unread tracking

### Premium UI & Interactive Motion
- **Interactive Particle Canvas** — Fluid starry constellation background that dynamically repels particles away from your mouse cursor in real-time across both the landing site and protected dashboard apps.
- **Global Anti-Gravity Shapes** — Continuous floating glowing background shapes layered perfectly between ambient gradients and text containers.
- **Custom Animated Cursor** — Modern SaaS-style dual-layer dot/ring cursor overlay with responsive hover states and click-scaling feedback.
- **Advanced Micro-Interactions** — Smooth button parallax effects, glowing interactive cards, multi-column responsive CSS Grid footer, and persistent floating CTAs.

### Analytics & Charts
- **Attendance Trend** — Area chart (present vs absent over 30 days)
- **Attendance Distribution** — Interactive donut pie chart
- **Enrollment vs Capacity** — Bar chart per course
- **Grade Distribution** — Color-coded bar chart by letter grade

### Additional Features
- 📅 **Timetable** — Visual weekly grid with color-coded course blocks and room numbers
- 👤 **Profile Management** — Edit name, phone, department + change password
- 📥 **CSV Export** — Download attendance and grade data as CSV files
- 🔍 **Searchable Sidebar** — User directory (Admin) or course list (Student/Faculty)
- ⏳ **Skeleton Loading** — Smooth loading placeholders
- 🔔 **Toast Notifications** — Snackbar feedback for all actions

### Role Permissions

| Action | Admin | Faculty | Student |
|--------|:-----:|:-------:|:-------:|
| Create/Edit/Delete Courses | ✅ | ❌ | ❌ |
| Change Course Status | ✅ | ❌ | ❌ |
| Assign Faculty to Course | ✅ | ❌ | ❌ |
| Enroll/Unenroll from Course | ❌ | ❌ | ✅ |
| Mark Attendance | ✅ | ✅ | ❌ |
| View All Attendance | ✅ | ✅ | ❌ |
| View Own Attendance | ❌ | ❌ | ✅ |
| Assign Grades | ✅ | ✅ | ❌ |
| View Own Grades + GPA | ❌ | ❌ | ✅ |
| Create Notifications | ✅ | ❌ | ❌ |
| View Notifications | ✅ | ✅ | ✅ |
| Manage Users | ✅ | ❌ | ❌ |
| Edit Own Profile | ✅ | ✅ | ✅ |
| Change Password | ✅ | ✅ | ✅ |

---

## 📡 API Documentation

Base URL: `http://localhost:5000/api`

All protected routes require: `Authorization: Bearer <token>` header

### Authentication (`/api/auth`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/auth/register` | Public/Admin | Register new user |
| `POST` | `/auth/login` | Public | Login & get JWT token |
| `GET` | `/auth/me` | Private | Get current user profile |
| `PUT` | `/auth/update-profile` | Private | Update name, phone, dept |
| `PUT` | `/auth/change-password` | Private | Change password |
| `GET` | `/auth/users` | Admin | Get all users (paginated) |
| `GET` | `/auth/dashboard-stats` | Private | Aggregated dashboard statistics |

**Login Example:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@Galgotias University.edu","password":"admin123"}'
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "...",
    "name": "Dr. Admin",
    "email": "admin@Galgotias University.edu",
    "role": "Admin",
    "department": "Administration"
  }
}
```

### Courses (`/api/courses`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/courses` | Private | Get all courses (filterable) |
| `GET` | `/courses/:id` | Private | Get single course |
| `POST` | `/courses` | Admin | Create new course |
| `PUT` | `/courses/:id` | Admin | Update course / change status |
| `DELETE` | `/courses/:id` | Admin | Delete course |
| `POST` | `/courses/:id/enroll` | Student | Enroll in course |
| `POST` | `/courses/:id/unenroll` | Student | Unenroll from course |
| `PUT` | `/courses/:id/assign-faculty` | Admin | Assign faculty to course |

**Query filters:** `?status=In_Progress&department=CS&semester=Fall&search=intro`

### Attendance (`/api/attendance`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/attendance/mark` | Faculty/Admin | Bulk mark attendance |
| `GET` | `/attendance/course/:courseId` | Faculty/Admin | Get course attendance |
| `GET` | `/attendance/student/:studentId` | Private | Get student's attendance |
| `GET` | `/attendance/stats/:courseId` | Private | Attendance statistics |

**Mark Attendance Example:**
```json
{
  "courseId": "...",
  "date": "2026-05-13",
  "records": [
    { "studentId": "...", "status": "Present" },
    { "studentId": "...", "status": "Absent" }
  ]
}
```

### Grades (`/api/grades`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/grades` | Faculty/Admin | Create/update grade |
| `GET` | `/grades/course/:courseId` | Faculty/Admin | Get all grades for course |
| `GET` | `/grades/student/:studentId` | Private | Get student's grades |
| `GET` | `/grades/gpa/:studentId` | Private | Get cumulative GPA |

### Notifications (`/api/notifications`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/notifications` | Admin | Create notification |
| `GET` | `/notifications` | Private | Get user's notifications |
| `PUT` | `/notifications/:id/read` | Private | Mark as read |

### Health Check

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/health` | Public | Server status check |

---

## 🛠 Tech Stack

| Layer | Technology | Version |
|-------|------------|---------|
| **Runtime** | Node.js | v18+ |
| **Backend Framework** | Express.js | v4.21 |
| **Database** | MongoDB (via Mongoose) | v8.7 |
| **Authentication** | JSON Web Tokens (JWT) | v9.0 |
| **Password Hashing** | bcryptjs | v2.4 |
| **Frontend Framework** | React | v19 |
| **Frontend Build** | Vite | v8.0 |
| **UI Library** | Material UI (MUI) | v9.0 |
| **Charts** | Recharts | v3.8 |
| **HTTP Client** | Axios | v1.16 |
| **Routing** | React Router DOM | v7.15 |

---

## 🗄 Database Schema

### User Model
| Field | Type | Description |
|-------|------|-------------|
| `name` | String | Full name (max 50) |
| `email` | String | Unique email |
| `password` | String | Bcrypt hashed |
| `role` | Enum | `Student`, `Faculty`, `Admin` |
| `department` | String | Department name |
| `studentId` / `facultyId` | String | Unique ID code |
| `phone` | String | Contact number |
| `avatar` | String | Avatar URL |

### Course Model
| Field | Type | Description |
|-------|------|-------------|
| `courseCode` | String | Unique code (e.g., CS101) |
| `title` | String | Course name |
| `credits` | Number | 1–6 |
| `status` | Enum | Draft, Published, Enrollment_Open, In_Progress, Completed, Archived |
| `faculty` | ObjectId → User | Assigned faculty |
| `enrolledStudents` | [ObjectId → User] | Enrolled students array |
| `schedule` | Object | `{ days, startTime, endTime, room }` |
| `maxCapacity` | Number | Max enrollment |

### Attendance Model
| Field | Type | Description |
|-------|------|-------------|
| `student` | ObjectId → User | Student ref |
| `course` | ObjectId → Course | Course ref |
| `date` | Date | Attendance date |
| `status` | Enum | Present, Absent, Late, Excused |
| `markedBy` | ObjectId → User | Faculty who marked |
| **Index** | Compound Unique | `{ student, course, date }` |

### Grade Model
| Field | Type | Description |
|-------|------|-------------|
| `student` | ObjectId → User | Student ref |
| `course` | ObjectId → Course | Course ref |
| `assignments` | Array | `[{ title, score, maxScore, weight }]` |
| `midterm` | Object | `{ score, maxScore }` |
| `final` | Object | `{ score, maxScore }` |
| `totalGrade` | Number | Auto-computed (0–100) |
| `letterGrade` | String | Auto-mapped (A+ to F) |
| `gpa` | Number | Auto-computed (0.0–4.0) |

### Notification Model
| Field | Type | Description |
|-------|------|-------------|
| `title` | String | Notification title |
| `message` | String | Notification body |
| `type` | Enum | Announcement, Alert, Reminder |
| `targetRole` | Enum | All, Student, Faculty |
| `priority` | Enum | Low, Medium, High |
| `readBy` | [ObjectId] | Users who have read it |

---

## 📐 Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      BROWSER                            │
├────────────────────────┬────────────────────────────────┤
│ Frontend (Port 5173)   │ Dashboard (Port 5174)          │
│ React + Vite           │ React + MUI + Recharts + Vite  │
│ Public Landing Site    │ Protected RBAC Application     │
└──────────┬─────────────┴──────────────┬─────────────────┘
           │                            │
           │        HTTP/REST           │
           │     (Axios + JWT)          │
           └──────────┬─────────────────┘
                      │
           ┌──────────▼──────────┐
           │ Backend (Port 5000) │
           │ Express.js + JWT    │
           │ CORS + Morgan       │
           ├─────────────────────┤
           │ Routes → Middleware │
           │ → Controllers       │
           └──────────┬──────────┘
                      │
           ┌──────────▼──────────┐
           │ MongoDB Atlas       │
           │ (Mongoose ODM)      │
           │ Collections:        │
           │ users, courses,     │
           │ attendances, grades,│
           │ notifications       │
           └─────────────────────┘
```

### Course State Machine
```
Draft → Published → Enrollment_Open → In_Progress → Completed → Archived
  ↑        ↓              ↓
  └────────┘      ←───────┘
```
Invalid transitions are blocked at the API level.

---

## ❗ Troubleshooting

### 1. `ECONNREFUSED` or `querySrv ECONNREFUSED` when connecting to MongoDB Atlas

**Cause:** Your network DNS can't resolve MongoDB SRV records (common on campus/corporate WiFi).

**Solutions:**
- The backend already forces Google DNS (`8.8.8.8`) in `server.js`. If that doesn't work:
- For seeding, run: `node -e "require('dns').setServers(['8.8.8.8','8.8.4.4']); require('./seed.js')"`
- Try switching to mobile hotspot or a different network
- Use local MongoDB instead: `MONGO_URI=mongodb://localhost:27017/Galgotias University`

### 2. `MongoServerError: bad auth` — Authentication failed

**Cause:** Wrong username/password in `MONGO_URI`.

**Fix:**
- Verify credentials in MongoDB Atlas → Database Access
- If password contains `@`, encode it as `%40` in the URI
- Example: `Smartcampus@1425` becomes `Smartcampus%401425`

### 3. `npm ERR! code ENOENT` — Package not found

**Fix:** Make sure you're in the correct directory and run `npm install` first:
```bash
cd backend && npm install
cd ../frontend && npm install
cd ../dashboard && npm install
```

### 4. Port already in use

**Fix:** Kill the process using the port:
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :5000
kill -9 <PID>
```

### 5. Dashboard shows blank page or API errors

**Fix:** Make sure the backend is running on port 5000 first. The dashboard makes API calls to `http://localhost:5000/api`.

### 6. `tsc && vite build` fails (TypeScript error)

**Fix:** For development, use `npx vite build` directly (skips TypeScript check). The project uses JSX files, not TSX.

### 7. Seed script says "No data" or "Already seeded"

**Fix:** The seed script clears all data before seeding. Run: `npm run seed`

---

## 📜 NPM Scripts Reference

### Backend (`cd backend`)
| Command | Description |
|---------|-------------|
| `npm run dev` | Start with nodemon (auto-restart) |
| `npm start` | Start production server |
| `npm run seed` | Seed database with sample data |

### Frontend (`cd frontend`)
| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server (port 5173) |
| `npx vite build` | Build for production |
| `npm run preview` | Preview production build |

### Dashboard (`cd dashboard`)
| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server (port 5174) |
| `npx vite build` | Build for production |
| `npm run preview` | Preview production build |

---

## 👨‍💻 Quick Start (TL;DR)

```bash
# Terminal 1 — Backend
cd backend
npm install
# Edit .env with your MongoDB URI
npm run seed
npm run dev

# Terminal 2 — Frontend
cd frontend
npm install
npm run dev

# Terminal 3 — Dashboard
cd dashboard
npm install
npm run dev
```

Then open:
- 🌐 **http://localhost:5173** — Landing page
- 📊 **http://localhost:5174** — Dashboard (login: `admin@Galgotias University.edu` / `admin123`)
- 🔗 **http://localhost:5000/api/health** — API health check
