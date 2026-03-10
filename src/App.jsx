/**
 * MediCare Hospital Booking — Frontend App
 *
 * Design Highlights:
 * • Premium medical blue/teal color palette
 * • Glassmorphism navbar with backdrop blur
 * • Animated hero section with floating card and glowing orbs
 * • Micro-animations on hover (cards lift, buttons scale)
 * • Fully responsive layout
 * • Status badges with color-coded states
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import './index.css';
import Login from './pages/Login';
import Register from './pages/Register';
import Doctors from './pages/Doctors';
import BookAppointment from './pages/BookAppointment';
import MyAppointments from './pages/MyAppointments';
import AdminDashboard from './pages/AdminDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminUserDashboard from './pages/AdminUserDashboard';
import DoctorAccount from './pages/DoctorAccount';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/book/:id" element={
              <ProtectedRoute>
                <BookAppointment />
              </ProtectedRoute>
            } />
            <Route path="/my-appointments" element={
              <ProtectedRoute>
                <MyAppointments />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute adminOnly>
                <AdminUserDashboard />
              </ProtectedRoute>
            } />
            <Route path="/doctor-dashboard" element={
              <ProtectedRoute>
                <DoctorDashboard />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
