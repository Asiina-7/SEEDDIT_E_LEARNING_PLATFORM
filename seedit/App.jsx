
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import CourseDetail from './pages/CourseDetail';
import LearningSession from './pages/LearningSession';
import Contact from './pages/Contact';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import Dashboard from './pages/Dashboard';
import MentorDashboard from './pages/MentorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Payment from './pages/Payment';
import MockEmailNotification from './components/MockEmailNotification';

const App = () => {
  return (
    <Router>
      <MockEmailNotification />
      <div className="min-h-screen flex flex-col">
        <Routes>
          {/* Routes WITHOUT standard navbar  */}
          <Route path="/learn/:id" element={<LearningSession />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/payment/:courseId" element={<Payment />} />
          <Route path="/mentor/dashboard" element={<MentorDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />

          {/* Routes WITH standard navbar */}
          <Route path="*" element={
            <>
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/catalog" element={<Catalog />} />
                  <Route path="/course/:id" element={<CourseDetail />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/catalog" element={<Catalog />} />
                  <Route path="/course/:id" element={<CourseDetail />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/profile" element={<Profile />} />
                </Routes>
              </main>
              <footer className="bg-white border-t border-slate-200 py-12">
                <div className="max-w-7xl mx-auto px-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-4 text-emerald-600 font-bold text-xl">
                    <i className="fas fa-seedling"></i> SeedIt
                  </div>
                  <p className="text-slate-500 text-sm">&copy; 2026 SeedIt Academy. All rights reserved.</p>
                </div>
              </footer>
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
