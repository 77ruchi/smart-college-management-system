# 🎓 Smart College Management System — Setup Guide

Full MERN stack project: **MongoDB, Express, React (Vite), Node.js**.

This guide takes you from zero to a fully running app with login, role-based
dashboards (Admin / Faculty / Student), attendance, results, fees, and notices.

---

## 0. Prerequisites

Install these first:

| Tool | Check version | Download |
|---|---|---|
| Node.js (v18+) | `node -v` | https://nodejs.org |
| npm (comes with Node) | `npm -v` | — |
| Git (optional) | `git -v` | https://git-scm.com |
| VS Code (recommended editor) | — | https://code.visualstudio.com |

---

## 1. MongoDB Setup (Cloud — MongoDB Atlas, recommended)

You don't need to install MongoDB locally — use the free Atlas cloud cluster.

1. **Create an account**: Go to https://w ww.mongodb.com/cloud/atlas/register and sign up (free).
2. **Create a free cluster**:
   - Click "Build a Database" → choose the **M0 Free** tier.
   - Pick any cloud provider/region close to you → click "Create".
3. **Create a database user**:
   - Go to *Database Access* (left sidebar) → "Add New Database User".
   - Set a username and password (save these — you'll need them). Choose "Password" auth.
   - Give it "Read and write to any database" permission.
4. **Allow network access**:
   - Go to *Network Access* → "Add IP Address".
   - For local development, click "Allow Access from Anywhere" (0.0.0.0/0). *(For production, restrict this.)*
5. **Get your connection string**:
   - Go to *Database* → click "Connect" on your cluster → "Drivers".
   - Copy the connection string. It looks like:
     ```
     mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
     ```
   - Replace `<username>` and `<password>` with the database user you created.
   - Add your database name before the `?`, e.g. `.../smart_college?retryWrites=true...`

### Alternative: Local MongoDB (no internet dependency)
If you prefer running MongoDB on your own machine instead of Atlas:
```bash
# macOS (Homebrew)
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Windows: download the MSI installer from mongodb.com/try/download/community
# Ubuntu/Linux: sudo apt install mongodb
```
Then your connection string is simply:
```
mongodb://localhost:27017/smart_college
```

---

## 2. Backend Setup

```bash
cd smart-college/server
npm install
```

Create your real `.env` file from the example:
```bash
cp .env.example .env
```

Open `.env` and fill in:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/smart_college?retryWrites=true&w=majority
JWT_SECRET=make_this_a_long_random_string_at_least_32_chars
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

> 🔑 **Generate a strong JWT_SECRET** quickly:
> ```bash
> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
> ```

**Seed demo data** (creates 1 admin, 1 faculty, 1 student, 1 sample course):
```bash
npm run seed
```
This prints demo login credentials to your terminal.

**Start the backend server**:
```bash
npm run dev
```
You should see:
```
✅ MongoDB Connected: cluster0-xxxxx.mongodb.net
🚀 Server running in development mode on port 5000
```

Test it's alive by visiting: http://localhost:5000/api/health

---

## 3. Frontend Setup

Open a **new terminal** (keep the backend running):

```bash
cd smart-college/client
npm install  
cp .env.example .env
```

The default `.env` already points to `http://localhost:5000/api` — leave it as is
for local development.

**Start the frontend**:
```bash
npm run dev
```
Visit: **http://localhost:5173**

---   

## 4. Login with Demo Accounts

After running `npm run seed` in the backend, use these to log in:

| Role | Email | Password |
|---|---|---|
| Admin | admin@college.com | Admin@123 |
| Faculty | faculty@college.com | Faculty@123 |
| Student | student@college.com | Student@123 |

**Suggested first walkthrough:**
1. Log in as **Admin** → Manage Courses → confirm "Data Structures (CS101)" exists, assigned to Prof. Sharma.
2. Log in as **Faculty** (faculty@college.com) → open the course → "Mark Attendance" → mark the seeded student present/absent → Save.
3. Log in as **Student** (student@college.com) → check "My Attendance" — you'll see the percentage update live.
4. As Admin or Faculty, post a Notice → log in as Student → see it on the Notice Board.



## 5. Project Structure Recap

```
smart-college/
├── server/          # Express + MongoDB API (port 5000)
│   ├── models/       # Mongoose schemas
│   ├── controllers/  # Business logic
│   ├── routes/       # /api/auth, /api/admin, /api/faculty, /api/student, /api/notices
│   ├── middlewares/  # JWT auth + role guards
│   └── server.js
└── client/          # React + Vite + Tailwind (port 5173)
    └── src/
        ├── pages/admin, pages/faculty, pages/student
        ├── context/AuthContext.jsx   # login state, JWT storage
        ├── services/api.js           # axios instance w/ auto-token
        └── App.jsx                   # all routes
```

---

## 6. How Roles & Auth Work

- On login, the backend returns a **JWT** containing the user's `id` and `role`.
- The frontend stores this token in `localStorage` and attaches it to every
  API request automatically (see `src/services/api.js`).
- Backend routes are locked down with `protect` (must have valid token) and
  `authorize("admin", "faculty", ...)` (must have the right role) middleware.
- The frontend also guards routes with `<ProtectedRoute allowedRoles={[...]}>`
  so users are redirected if they try to access a page for another role.

---

## 7. Next Features to Add (Roadmap)

The core system (auth, admin CRUD, attendance, results, fees, notices) is
fully working. Natural next additions, in order of effort:

1. **Assignments module** — faculty uploads files (use `multer` + Cloudinary), students submit
2. **Email notifications** — Nodemailer for low attendance / fee due alerts (`node-cron` for scheduling)
3. **Payment gateway** — Razorpay/Stripe checkout wired to the `Fee` model
4. **Real-time notices** — Socket.io push instead of polling
5. **Charts** — `recharts` is already installed on the frontend; wire it to `/api/admin/dashboard`
6. **CSV bulk user import** — `multer` + `csv-parser` on an admin upload route

---

## 8. Deployment (when ready)
y cloud-hosted — just update Network Access to allow your host's IP (or 0.0.0.0/0) |

Remember to update `CLIENT_URL` in the backend `.env` to your deployed frontend
URL (for CORS), and `VITE_API_URL` in the frontend to your deployed backend URL.
| Part | Recommended host | Notes |
|---|---|---|
| Backend | Render / Railway | Set the same env vars as your `.env` |
| Frontend | Vercel / Netlify | Set `VITE_API_URL` to your deployed backend URL |
| Database | MongoDB Atlas | Alread

---

## 9. Troubleshooting

| Problem | Fix |
|---|---|
| `MongoDB connection error` | Double-check username/password in `MONGO_URI`, and that your IP is whitelisted in Atlas Network Access |
| `CORS error` in browser console | Make sure `CLIENT_URL` in server `.env` matches your frontend's actual URL exactly |
| `401 Unauthorized` right after login | Check `JWT_SECRET` is set in `.env` and the server was restarted after editing `.env` |
| Frontend shows blank page | Check the browser console; usually means the backend isn't running or `VITE_API_URL` is wrong |
| `npm run seed` fails | Make sure `MONGO_URI` is correct and backend `npm install` finished successfully first |

---

That's it — you have a working, real, role-based college management system. Ask me for help adding any of the roadmap features above, or wiring the Python microservice for face-recognition attendance / predictive analytics.
