# Hospital Management System (HMS)

A full-stack, responsive Hospital Management System built with **React 19**, **Vite**, **Tailwind CSS v4**, **Express**, and **MongoDB**. The application integrates **Clerk Authentication** for secure frontend route protection, and supports comprehensive CRUD operations for **Patients**, **Doctors**, **Appointments**, and **Medical Records**.

---

## 📸 Screenshots

- **Home Page**: [Home Page](https://github.com/Abhimanyu-Chandran/Hospital-Management-System/blob/2c585eb7aef5003aed11a97ff5f0cf2dd4c8b787/Home%20Page.png)
- **Dashboard Page**: [Dashboard Page](https://github.com/Abhimanyu-Chandran/Hospital-Management-System/blob/2c585eb7aef5003aed11a97ff5f0cf2dd4c8b787/Dashboard%20Page.png)
- **Patients Page**: [Patients Page](https://github.com/Abhimanyu-Chandran/Hospital-Management-System/blob/2c585eb7aef5003aed11a97ff5f0cf2dd4c8b787/Patients%20Page.png)
- **Appointments Page**: [Appointments Page](https://github.com/Abhimanyu-Chandran/Hospital-Management-System/blob/2c585eb7aef5003aed11a97ff5f0cf2dd4c8b787/Appointments%20Page.png)
- **Doctors Page**: [Doctors Page](https://github.com/Abhimanyu-Chandran/Hospital-Management-System/blob/2c585eb7aef5003aed11a97ff5f0cf2dd4c8b787/Doctors%20Page.png)
- **Medical Records Page**: [Medical Records Page](https://github.com/Abhimanyu-Chandran/Hospital-Management-System/blob/2c585eb7aef5003aed11a97ff5f0cf2dd4c8b787/Medical%20Records%20Page.png)

---

## 🚀 Key Features

### 🔐 Clerk Authentication Process
- **Provider Setup**: Instantiated in [main.jsx](file:///e:/Additional%20Softwares/VS%20Codes/Hospital%20Management%20System/client/main.jsx) by wrapping the application within the `<ClerkProvider>` component and loading the public publishable key via `import.meta.env.VITE_CLERK_PUBLISHABLE_KEY`.
- **Pre-Built UI Components**: Standardized login and signup forms are rendered in [Login.jsx](file:///e:/Additional%20Softwares/VS%20Codes/Hospital%20Management%20System/client/auth/Login.jsx) and [Signup.jsx](file:///e:/Additional%20Softwares/VS%20Codes/Hospital%20Management%20System/client/auth/Signup.jsx) via Clerk's `<SignIn>` and `<SignUp>` components, styled inside custom gradient containers.
- **Route Guarding & Access Control**: 
  - Admin portals and management pages are wrapped in a custom `<ProtectedRoute>` component in [App.jsx](file:///e:/Additional%20Softwares/VS%20Codes/Hospital%20Management%20System/client/App.jsx) that validates `isSignedIn` and `isLoaded` using the `useAuth()` hook. Unauthenticated users are redirected to `/login`.
  - Authentication routes (`/login` and `/signup`) are wrapped in `<AuthRoute>` to redirect active user sessions automatically to `/dashboard`.
- **Dynamic Identity Integration**:
  - The [SideBar.jsx](file:///e:/Additional%20Softwares/VS%20Codes/Hospital%20Management%20System/client/navigation/SideBar.jsx) renders user profiles using the `useUser()` hook to retrieve email addresses, avatars, and names dynamically.
  - The `<UserButton>` component is embedded in the Sidebar and [HomePage.jsx](file:///e:/Additional%20Softwares/VS%20Codes/Hospital%20Management%20System/client/components/HomePage.jsx) header to facilitate instant profile customization and secure logouts.
- **Bypassed Backend Session Management**: Custom JWT token management (cookies/local storage/server verify routes) has been removed in favor of Clerk's secure front-end session handling.

### 📊 Interactive Admin Dashboard
- **Summary Metrics**: Instantly shows hospital stats (Total Patients, Doctors, Appointments, Medical Records) inside animated [DashboardCard.jsx](file:///e:/Additional%20Softwares/VS%20Codes/Hospital%20Management%20System/client/components/Dashboard/DashboardCard.jsx) widgets.
- **Weekly Appointments Trend**: Line charts in [WeeklyAppointments.jsx](file:///e:/Additional%20Softwares/VS%20Codes/Hospital%20Management%20System/client/components/Dashboard/WeeklyAppointments.jsx) powered by `Recharts` to monitor daily booking volumes.
- **Patient Registration Growth**: Bar graphs in [PatientsGrowth.jsx](file:///e:/Additional%20Softwares/VS%20Codes/Hospital%20Management%20System/client/components/Dashboard/PatientsGrowth.jsx) powered by `Recharts` representing system growth.
- **Recent Registrations table**: Provides quick access to scheduling lists in [RecentAppointments.jsx](file:///e:/Additional%20Softwares/VS%20Codes/Hospital%20Management%20System/client/components/Dashboard/RecentAppointments.jsx).

### 🏥 Full CRUD Management
- **Patients**: Custom registration, contact details, filters, and modal-based addition/editing.
- **Doctors**: Manage staff data, departments, specialties, and contact records.
- **Appointments**: Form scheduling with doctor availability, patient association, and status updates (Scheduled, Completed, Cancelled).
- **Medical Records**: Complex record documentation. The backend automatically populates nested patient and doctor references so complete details display cleanly.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, React Router DOM v7, Tailwind CSS v4, Recharts, Lucide React, `@clerk/react`.
- **Backend**: Node.js, Express 5, Mongoose.
- **Database**: MongoDB.

---

## 📂 Project Structure

- `client/` – React/Vite source components and API services.
- `server/` – Express API configurations, MongoDB connection, schema models, and backend controllers.
- `index.html` – Root-level Vite entry page.
- `package.json` – Frontend client dependencies and scripts.
- `server/package.json` – Backend Express server dependencies and start scripts.

---

## ⚙️ Environment Configuration

Set up environment variables for both the client (project root) and the server (`/server`).

### 1) Client Environment (Project Root)
Create a `.env` file in the **root** folder:
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```

### 2) Server Environment (`/server`)
Create a `.env` file inside the `server/` folder:
```env
PORT=5000
MONGODB_URI=mongodb+srv://...
```

---

## 🏃 Running the Application Locally

You will need to launch both the frontend client and the backend server.

### 1) Start the Backend Server
From the project root:
```bash
cd server
npm install
npm run start
```
The server will boot by default on `http://localhost:5000`.

### 2) Start the Frontend Client
From the project root (where Vite is configured):
```bash
npm install
npm run dev
```
Open the Vite development server address (usually `http://localhost:5173`) in your web browser.

---

## 🔌 API Reference

**Base URL**: `http://localhost:5000/api`

### Patients Endpoints (`/api/patients`)
- `GET /` – Get list of all patients.
- `GET /:id` – Get single patient details.
- `POST /` – Add a new patient record.
- `PUT /:id` – Update patient information.
- `DELETE /:id` – Remove a patient record.

### Doctors Endpoints (`/api/doctors`)
- `GET /` – Get list of all doctors.
- `GET /:id` – Get single doctor details.
- `POST /` – Register a new doctor.
- `PUT /:id` – Update doctor details.
- `DELETE /:id` – Remove a doctor.

### Appointments Endpoints (`/api/appointments`)
- `GET /` – Get list of all appointments.
- `GET /:id` – Retrieve a specific appointment details.
- `POST /` – Schedule a new appointment.
- `PUT /:id` – Reschedule or modify status.
- `DELETE /:id` – Cancel/Delete an appointment.

### Medical Records Endpoints (`/api/medical-records`)
- `GET /` – Get all records (populates doctor and patient relations automatically).
- `GET /:id` – Get single record info.
- `POST /` – Add a new medical record.
- `PUT /:id` – Modify record parameters.
- `DELETE /:id` – Delete a medical record.

---

## 🧭 Client Routes (UI Navigation)

Client routes are handled by React Router DOM. Administrative panels are protected and require a signed-in Clerk account.

- `/` – **Home Page**: Visual entry page containing HMS summary and login/signup navigation buttons.
- `/login` – **Login Page**: Renders Clerk's `<SignIn>` form. Redirects active sessions to `/dashboard`.
- `/signup` – **Register Page**: Renders Clerk's `<SignUp>` form. Redirects active sessions to `/dashboard`.
- `/dashboard` – **Dashboard**: Main metrics overview and Recharts statistics (Protected).
- `/patients` – **Patients**: View, register, and update patient forms (Protected).
- `/appointments` – **Appointments**: Schedule and status-track bookings (Protected).
- `/doctors` – **Doctors**: Staff register and department assignments (Protected).
- `/medical-records` – **Medical Records**: Document patient diagnostics and prescriptions (Protected).

---

## 📝 Development Notes
- **SPA Fallback Routing**: The backend server is configured to serve the root `index.html` file for non-API GET requests, allowing deep links (like `/patients` or `/dashboard`) to be refreshed directly in the browser without 404 errors.
- **Session Security**: Authentication cookies and tokens are handled entirely by Clerk's secure SDK on the frontend, eliminating manual storage handling in the client codebase.

---

## 📄 License

This project is licensed under the [MIT License](file:///e:/Additional%20Softwares/VS%20Codes/Hospital%20Management%20System/LICENSE).
