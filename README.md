# Smart College Management System 🎓

A MERN Stack-based Smart College Management System designed to simplify and manage college activities through separate Admin, Faculty, and Student dashboards.

## 📌 About the Project

The Smart College Management System is a web-based application developed using the MERN stack. It helps manage academic and administrative activities in a college through a centralized platform.

The system provides different functionalities for administrators, faculty members, and students.

## ✨ Features

### 👨‍💼 Admin Dashboard
- Manage students and faculty.
- Manage college notices.
- Manage academic activities.
- Oversee college information.

### 👨‍🏫 Faculty Dashboard
- Manage student attendance.
- Manage academic results.
- View relevant college information.

### 👨‍🎓 Student Dashboard
- View personal profile.
- View attendance details.
- View examination results.
- View college notices.
- Access available academic information.

## 🛠️ Technologies Used

**Frontend:**
- React.js
- Vite
- HTML
- CSS
- JavaScript

**Backend:**
- Node.js
- Express.js

**Database:**
- MongoDB
- MongoDB Atlas

**Authentication:**
- JSON Web Token (JWT)

**Development Tools:**
- Visual Studio Code
- Git
- GitHub
- Postman

## 📂 Project Structure

```text
smart-college/
│
├── client/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
├── .gitignore
└── README.md
```

## ⚙️ Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR-USERNAME/smart-college-management-system.git
```

### 2. Navigate to the Project

```bash
cd smart-college-management-system
```

### 3. Install Backend Dependencies

```bash
cd server
npm install
```

### 4. Configure Environment Variables

Create a `.env` file inside the server folder.

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
```

Use your actual environment variable names from the backend configuration.

### 5. Start Backend Server

```bash
npm run dev
```

### 6. Install Frontend Dependencies

Open another terminal:

```bash
cd client
npm install
```

### 7. Start Frontend

```bash
npm run dev
```

Open the local URL displayed by Vite in your browser.

## 🔐 Security

- Environment variables are used for sensitive configuration.
- Authentication is implemented using JWT.
- Protected routes restrict access to authorized users.
- Role-based authorization controls access to different functionalities.

## 🚀 Future Enhancements

- Online fee payment integration.
- Email and notification system.
- Timetable management.
- Advanced academic analytics.
- Enhanced reporting and dashboards.

## 👩‍💻 Developer

**Ruchita Prajapati**

Computer Engineering

GitHub: https://github.com/YOUR-USERNAME

---

⭐ If you find this project useful, consider giving it a star!
