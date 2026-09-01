import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext';
import { SavedProvider } from './context/SavedContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import HomePage from './pages/HomePage';
import ListingDetailPage from './pages/ListingDetailPage';
import PostLodgePage from './pages/PostLodgePage';
import MyListingsPage from './pages/MyListingsPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ContactPage from './pages/ContactPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID ||
    '1050366268506-p146h6p6ctfgn3o6b175t22ibo29vand.apps.googleusercontent.com';

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <Router>
        <AuthProvider>
          <SavedProvider>
            <div className="min-h-screen flex flex-col justify-between bg-white selection:bg-indigo-500 selection:text-white">
              <Navbar />

              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/details/:id" element={<ListingDetailPage />} />
                  <Route
                    path="/post"
                    element={
                      <ProtectedRoute agentOnly={true}>
                        <PostLodgePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/my-listings"
                    element={
                      <ProtectedRoute agentOnly={true}>
                        <MyListingsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/verify-email" element={<VerifyEmailPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>

              <Footer />
            </div>
          </SavedProvider>
        </AuthProvider>
      </Router>
    </GoogleOAuthProvider>
  );
}