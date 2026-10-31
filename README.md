# Aman Chaurasiya — Portfolio

A full-stack portfolio website with a React frontend, an Express API, MongoDB-backed portfolio content, and a protected admin area for managing that content.

## Features

- Public portfolio sections for profile/about, skills, projects, education, experience, achievements, certifications, resume, and contact details.
- Admin sign-in and protected pages for managing portfolio content.
- CRUD API endpoints for profile, skills, projects, education, experience, achievements, and certifications.
- Image uploads and PDF resume uploads stored with Cloudinary.
- Cookie-based admin authentication, login rate limiting, request validation, and centralized API error handling.

## Tech stack

- **Frontend:** React 19, React Router, Axios, Vite
- **Backend:** Node.js, Express 5
- **Database:** MongoDB with Mongoose
- **Uploads:** Cloudinary and Multer

## Repository structure

```text
portfolio/
├── client/                              # React and Vite frontend
│   ├── .gitignore
│   ├── .oxlintrc.json                   # Oxlint configuration
│   ├── README.md                         # Vite template notes
│   ├── public/                          # Static assets served without bundling
│   │   ├── aman-logo.png
│   │   ├── favicon.png
│   │   ├── favicon.svg
│   │   └── icons.svg
│   ├── src/
│   │   ├── assets/                      # Imported images and starter SVGs
│   │   │   ├── hero.png
│   │   │   ├── react.svg
│   │   │   └── vite.svg
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   │   ├── AdminCrudPage.jsx    # Shared CRUD form/list interface
│   │   │   │   ├── AdminDashboard.jsx   # Admin overview and content counts
│   │   │   │   ├── ImageUploader.jsx
│   │   │   │   ├── ProjectManager.jsx
│   │   │   │   ├── ProtectedRoute.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   └── resumeUploader.jsx
│   │   │   └── portfolio/               # Public portfolio section components
│   │   ├── context/
│   │   │   └── AuthContext.jsx           # Admin session, login, and logout state
│   │   ├── layouts/
│   │   │   └── AdminLayout.jsx
│   │   ├── pages/
│   │   │   ├── admin/                    # Profile and content managers
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   └── NotFound.jsx
│   │   ├── services/
│   │   │   ├── api.js                    # Axios client and auth-expiry handling
│   │   │   ├── resumeService.js
│   │   │   └── uploadService.js
│   │   ├── App.css
│   │   ├── App.jsx                       # Client-side routes
│   │   ├── index.css
│   │   └── main.jsx                      # React entry point and AuthProvider
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   └── vite.config.js
└── server/                               # Express API and MongoDB backend
    ├── .gitignore
    ├── config/
    │   ├── cloudinary.js
    │   └── db.js
    ├── controllers/                      # Request handlers and shared CRUD logic
    ├── middleware/                       # Auth, validation, upload, and error handling
    ├── models/                           # Mongoose schemas for portfolio data
    ├── routes/                           # Express routers, mounted under /api
    ├── createAdmin.js                    # Create or reset the admin account
    ├── server.js                         # Middleware, API registration, startup
    ├── package-lock.json
    ├── package.json
    └── vercel.json
```

Client component and admin-page files:

- `client/src/components/portfolio/`: `About.jsx`, `Achievements.jsx`, `Certifications.jsx`, `Contact.jsx`, `Education.jsx`, `Experience.jsx`, `Footer.jsx`, `Hero.jsx`, `Navbar.jsx`, `Projects.jsx`, `Resume.jsx`, `Reveal.jsx`, and `Skills.jsx`.
- `client/src/pages/admin/`: `AchievementsManager.jsx`, `CertificationsManager.jsx`, `EducationManager.jsx`, `ExperienceManager.jsx`, `ProfileManager.jsx`, and `SkillsManager.jsx`.

Server implementation files by folder:

- `server/controllers/`: `authController.js`, `crudController.js`, `profileController.js`, `projectController.js`, `skillController.js`, `educationController.js`, `resumeController.js`, `uploadController.js`, and `achivementController.js`.
- `server/middleware/`: `authMiddleware.js`, `errorMiddleware.js`, `projectValidation.js`, `uploadMiddleware.js`, and `validation.js`.
- `server/models/`: `Admin.js`, `Achievement.js`, `Certification.js`, `Education.js`, `Experience.js`, `Profile.js`, `Project.js`, and `Skill.js`.
- `server/routes/`: `authRoutes.js`, `profileRoutes.js`, `projectRoutes.js`, `skillRoutes.js`, `educationRoutes.js`, `experienceRoutes.js`, `achievementRoutes.js`, `certificationRoutes.js`, `uploadRoutes.js`, and `resumeRoutes.js`.

## How the app works

1. `client/src/main.jsx` mounts the React application inside `AuthProvider`; `App.jsx` defines the public and admin routes.
2. The public home page requests profile, skills, projects, education, experience, achievements, and certifications from the API, then renders the portfolio components.
3. The admin sign-in and protected pages use the shared Axios client. The server sets and verifies the `adminToken` cookie; protected admin routes redirect unauthenticated users to the login page.
4. Express routes call controllers, which read or update MongoDB models. Image and resume uploads pass through Multer and are uploaded to Cloudinary.

## Requirements

- Node.js and npm
- A MongoDB database (local or MongoDB Atlas)
- A Cloudinary account for image and resume uploads

## Local setup

### 1. Configure the backend

Create `server/.env` with the following values. Replace the placeholders with your own credentials:

```dotenv
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGO_URI=mongodb://127.0.0.1:27017/portfolio
JWT_SECRET=replace-with-a-long-random-secret
ADMIN_NAME=Portfolio Admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=replace-with-a-strong-password
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

For MongoDB Atlas, use the connection URI from your Atlas project for `MONGO_URI`. Keep `.env` files private; never put backend credentials in the frontend or commit them to Git.

Install the backend dependencies and create the admin account:

```powershell
cd server
npm install
npm run create-admin
```

`create-admin` creates the configured admin if it does not exist, or resets the existing admin's name and password using `ADMIN_NAME`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD`.

### 2. Configure the frontend

The frontend defaults to `http://localhost:5000/api` for the API. To use a different API URL, create `client/.env.local`:

```dotenv
VITE_API_URL=http://localhost:5000/api
```

Install the frontend dependencies:

```powershell
cd client
npm install
```

### 3. Run the app

Start the backend and frontend in separate terminals:

```powershell
cd server
npm run dev
```

```powershell
cd client
npm run dev
```

Vite serves the frontend at `http://localhost:5173`; the API listens at `http://localhost:5000`. The backend health endpoint is `http://localhost:5000/api/health`.

## Admin area

- Sign-in: `http://localhost:5173/admin/login`
- Dashboard and management pages: `/admin/dashboard`, `/admin/profile`, `/admin/projects`, `/admin/skills`, `/admin/education`, `/admin/experience`, `/admin/achievements`, and `/admin/certifications`.
- Use the admin credentials configured in `server/.env`.

## API overview

| Base path | Methods and purpose |
| --- | --- |
| `/api/auth` | `POST /login`, `POST /logout`, `GET /me` — admin session |
| `/api/profile` | `GET /`, `PUT /` — read/update the portfolio profile |
| `/api/projects` | `GET /`, `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id` — projects |
| `/api/skills` | `GET /`, `POST /`, `PUT /:id`, `DELETE /:id` — skills |
| `/api/education` | `GET /`, `POST /`, `PUT /:id`, `DELETE /:id` — education |
| `/api/experience` | `GET /`, `POST /`, `PUT /:id`, `DELETE /:id` — experience |
| `/api/achievements` | `GET /`, `POST /`, `PUT /:id`, `DELETE /:id` — achievements |
| `/api/certifications` | `GET /`, `POST /`, `PUT /:id`, `DELETE /:id` — certifications |
| `/api/uploads` | `POST /image` — upload an image |
| `/api/resume` | `POST /` — upload a PDF resume |
| `/api/health` | `GET /` — backend health check |

Admin mutations and uploads require authentication; portfolio reads are public. Resume uploads accept PDF files up to 5 MB, and image uploads accept images up to 5 MB. Education, experience, achievement, and certification routes use the shared CRUD controller; projects, skills, profile, authentication, and uploads have dedicated controller logic.

## Useful scripts

| Directory | Command | Description |
| --- | --- | --- |
| `client` | `npm run dev` | Start the Vite development server |
| `client` | `npm run build` | Build the frontend for production |
| `client` | `npm run preview` | Preview the production frontend build |
| `client` | `npm run lint` | Run Oxlint |
| `server` | `npm run dev` | Start the API with Nodemon |
| `server` | `npm start` | Start the API with Node.js |
| `server` | `npm run create-admin` | Create or reset the admin account |
| `server` | `npm run reset-password` | Interactively reset or update the admin password |

## Troubleshooting

- **MongoDB Atlas `querySrv ECONNREFUSED`:** Check the Atlas IP allowlist, database credentials, and local DNS/VPN/firewall. On Windows, test the SRV record with `nslookup -type=SRV _mongodb._tcp.<your-cluster-host>`. If your network cannot resolve SRV records, use the standard non-SRV URI provided by Atlas.
- **Admin login reports invalid credentials:** Confirm `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `server/.env`, run `npm run create-admin` from `server`, and restart the API.
- **Uploads fail:** Verify the Cloudinary values in `server/.env` and that the backend is running.
