# Hospital Management System (MERN)

A full-stack Hospital Management System built with **React (Vite)**, **Express**, and **MongoDB (Mongoose)**. The app provides JWT-based authentication and CRUD APIs for **Patients**, **Doctors**, **Appointments**, and **Medical Records**.

## Features

- **Authentication (JWT)**
  - Register
  - Login
  - Auth-protected routes (client-side)
  - `/api/auth/me` to fetch current user
- **Dashboard** (protected)
- **Patients CRUD**
  - List all patients
  - View single patient
  - Create, update, delete patient
- **Doctors CRUD**
  - List all doctors
  - View single doctor
  - Create, update, delete doctor
- **Appointments CRUD**
  - List all appointments
  - View single appointment
  - Create, update, delete appointment
- **Medical Records CRUD**
  - List all medical records (with populated patient/doctor details)
  - View single medical record (with populated patient/doctor details)
  - Create, update, delete medical record

## Tech Stack

- **Frontend**: React 19, React Router DOM, Tailwind CSS, Recharts
- **Backend**: Node.js, Express, Mongoose, JSON Web Tokens (JWT), bcryptjs
- **Database**: MongoDB

## Project Structure

- `client/` – React application
- `server/` – Express API + MongoDB connection
- `index.html` – Vite entry HTML

## Getting Started

### Prerequisites

- Node.js (LTS recommended)
- MongoDB (local or Atlas)

### Environment Variables

Create a `.env` file in the `server/` directory with:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Notes:
- If `JWT_SECRET` is not provided, the server falls back to `dev-secret`.

## Running the App Locally

You need to run **both** the client and the server.

### 1) Server

From the project root:

```bash
cd server
npm install
npm run start
```

Server listens on `http://localhost:5000` by default.

### 2) Client

From the project root:

```bash
cd client
npm install
npm run dev
```

Open the URL shown by Vite (typically `http://localhost:5173`).

## API Reference

Base URL (client config):

- `http://localhost:5000/api`

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Patients

- `GET /api/patients`
- `GET /api/patients/:id`
- `POST /api/patients`
- `PUT /api/patients/:id`
- `DELETE /api/patients/:id`

### Doctors

- `GET /api/doctors`
- `GET /api/doctors/:id`
- `POST /api/doctors`
- `PUT /api/doctors/:id`
- `DELETE /api/doctors/:id`

### Appointments

- `GET /api/appointments`
- `GET /api/appointments/:id`
- `POST /api/appointments`
- `PUT /api/appointments/:id`
- `DELETE /api/appointments/:id`

### Medical Records

- `GET /api/medical-records` (populates `patientId` and `doctorId`)
- `GET /api/medical-records/:id` (populates `patientId` and `doctorId`)
- `POST /api/medical-records`
- `PUT /api/medical-records/:id`
- `DELETE /api/medical-records/:id`

## Client Routes (UI)

Protected routes redirect to `/login` if the user is not authenticated.

- `/` – Home (protected)
- `/register` – Register
- `/login` – Login
- `/dashboard` – Dashboard (protected)
- `/patients` – Patients (protected)
- `/appointments` – Appointments (protected)
- `/doctors` – Doctors (protected)
- `/medical-records` – Medical Records (protected)

## Notes

- The server includes an SPA fallback for non-API GET requests so client-side routes can load correctly.
- JWT token is stored in the browser `localStorage` as `token`.

## License

MIT
