# 🎨 Cartoonopia Web Application

Cartoonopia is a full-stack web application built for COMP5347/COMP4347 Assignment 2 at the University of Sydney. Developed as a group project for the company *Datalytics*, the app functions as an online almanac of cartoon characters. Users can search, compare, edit, and contribute to the database of characters, with an approval system to manage content quality and integrity.

---

## 📚 Features

### 🖥️ Frontend
- Single Page Application (SPA) using React with Vite
- Search and filter characters by attributes (strength, speed, skill, fear factor, power, intelligence)
- Compare two characters with visual ticks based on attribute dominance
- View previous comparisons (stored locally)
- Login & Signup pages
- User profiles (favourites, comparison history, and contribution logs)
- Character detail pages
- Responsive layout

### 🔧 Backend
- Built with Node.js, Express, Prisma, and MongoDB
- RESTful API for:
  - User registration & authentication
  - Admin-only approval/rejection of edits/additions
  - Character CRUD operations
  - User profile data (liked characters, contributions, comparisons)
  - Change history tracking
- JWT-based access control
- Role-based access: Admin vs Regular User

---

## ⚙️ Tech Stack

| Layer         | Technology                         |
|--------------|-------------------------------------|
| Frontend      | React, TypeScript, Vite             |
| Backend       | Node.js, Express.js, Prisma         |
| Database      | MongoDB                             |
| Styling       | CSS                                 |
| Others        | JWT, Bcrypt, Axios, Lodash          |
| Project Tool  | Nx Monorepo                         |

---

## 📁 Project Structure

```
root/
├── backend/
│   └── comp5347-2024-l8-g4-a2-main/
│       ├── src/ (API, controllers, services)
│       ├── prisma/ (schema & seed data)
│       └── .env (local environment variables)
└── frontend/
    └── Lab-8-Group4-A2-master/
        ├── src/
        │   ├── pages/ (login, signup, admin, profile, etc.)
        │   ├── components/
        │   └── api/ (API calls to backend)
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (local or Atlas)
- NPM or Yarn
- `http-server` (for local JSON serving in frontend testing)

### Backend Setup

```bash
cd backend/comp5347-2024-l8-g4-a2-main
cp .env.example .env  # Edit DB connection string & JWT secret
npm install
npx prisma migrate dev  # Create tables
npx prisma db seed      # Optional: seed initial data
npm run start
```

> Runs on `http://localhost:3000` by default.

### Frontend Setup

```bash
cd frontend/Lab-8-Group4-A2-master
npm install
npm run dev
```

> Accessible at `http://localhost:5173`

---

## 🧪 Test Local JSON Loading (for A1)

To test local frontend JSON data (e.g., during Stage 1):

```bash
npm install -g http-server
http-server
```

> Then open `http://localhost:8080`

Use the provided function:

```js
getJsonObject("data.json", successCallback, errorCallback);
```

---

## 👤 User Roles

- **Unauthenticated users:** Can only view login/signup
- **Regular users:** Can add/edit characters (pending admin approval)
- **Admins:** Can approve/reject contributions, delete characters, manage users

---

## 📓 Notes for Marker

- Please ensure `.env` is configured for backend with a valid MongoDB URI
- The project uses **Nx** to manage backend services (`npm run start` uses Nx serve)
- All JSON data and images are referenced with **relative paths**
- Previous comparisons are stored **locally in browser**
- Frontend and backend are **decoupled** and communicate via REST API

---

## 👥 Team Members

- [Your Name] – Frontend logic & design
- [Teammate] – Backend APIs & DB schema
- [Teammate] – Authentication, admin panels
- [Teammate] – Contributions & approvals module

---

## 📌 Academic Integrity Acknowledgement

This project is completed in accordance with the University of Sydney's Academic Integrity Policy. Any AI assistance used (e.g. code formatting or README generation) is disclosed and integrated responsibly.

---

## 📃 License

This project is for educational use only.
