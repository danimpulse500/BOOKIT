import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  loginUser as apiLogin,
  registerUser as apiRegister,
  loginWithGoogleBackend,
  sendPhoneOTP,
  verifyPhoneOTP,
  signOutUser
} from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load session from localStorage on mount
    const savedUser = localStorage.getItem('userData');
    const savedToken = localStorage.getItem('accessToken');
    const loggedInFlag = localStorage.getItem('loggedInUser');

    if (savedUser && savedToken && loggedInFlag === 'true') {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setToken(savedToken);
      } catch (e) {
        console.error('Error parsing stored user data:', e);
        localStorage.clear();
      }
    }
    setLoading(false);
  }, []);

  // Helper function to persist session consistently
  const saveSession = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);

    try {
      localStorage.setItem('loggedInUser', 'true');
      localStorage.setItem('userName', userData.name || '');
      localStorage.setItem('userEmail', userData.email || '');
      localStorage.setItem('userRole', userData.role || 'Lodger');
      localStorage.setItem('userData', JSON.stringify(userData));
      localStorage.setItem('accessToken', authToken);
    } catch (err) {
      console.error('Failed to save session to localStorage:', err);
    }
  };

  // 1. Password / Email Login
  const login = async (credentials) => {
    const res = await apiLogin(credentials);
    if (!res) throw new Error('No response received from authentication server.');

    const isAgent = Boolean(res.user?.is_agent || credentials.email?.toLowerCase().includes('agent'));
    const userRole = isAgent ? 'Agent' : 'Lodger';

    const userEmail = credentials.email || res.user?.email || '';
    const fallbackName = userEmail ? userEmail.split('@')[0] : 'User';

    const userData = {
      email: userEmail,
      name: res.user?.full_name || res.user?.name || fallbackName,
      role: userRole,
      is_agent: isAgent
    };

    const authToken = res.key || res.access_token || res.token || ('token_' + Date.now());
    saveSession(userData, authToken);
    return userData;
  };

  // 2. Google OAuth Login
  const loginWithGoogle = async (googleToken) => {
    const res = await loginWithGoogleBackend(googleToken);
    if (!res) throw new Error('Google login failed.');

    const isAgent = Boolean(res.user?.is_agent || res.is_agent);
    const userRole = isAgent ? 'Agent' : 'Lodger';

    const userData = {
      email: res.user?.email || 'googleuser@bookit.com',
      name: res.user?.full_name || res.user?.user_metadata?.full_name || res.user?.email?.split('@')[0] || 'Google User',
      role: userRole,
      is_agent: isAgent
    };

    const authToken = res.key || res.access_token || res.session?.access_token || ('google_token_' + Date.now());
    saveSession(userData, authToken);
    return userData;
  };

  // 3. Phone OTP Handlers
  const requestPhoneOTP = async (phoneNumber) => {
    return await sendPhoneOTP(phoneNumber);
  };

  const confirmPhoneOTP = async (phoneNumber, otpToken) => {
    const res = await verifyPhoneOTP(phoneNumber, otpToken);
    if (!res) throw new Error('Phone verification failed.');

    const isAgent = Boolean(res.user?.is_agent);
    const userRole = isAgent ? 'Agent' : 'Lodger';

    const rawEmail = res.user?.email || `${phoneNumber.replace(/[^0-9]/g, '')}@bookit.com`;
    const rawName = res.user?.user_metadata?.full_name || res.user?.full_name || `User (${phoneNumber.slice(-4)})`;

    const userData = {
      phone: phoneNumber,
      email: rawEmail,
      name: rawName,
      role: userRole,
      is_agent: isAgent
    };

    const authToken = res.session?.access_token || res.key || res.access_token || ('phone_token_' + Date.now());
    saveSession(userData, authToken);
    return userData;
  };

  // 4. Registration
  const register = async (userData) => {
    const res = await apiRegister(userData);
    if (!res) throw new Error('Registration failed.');

    const isAgent = Boolean(userData.is_agent);
    const userRole = isAgent ? 'Agent' : 'Lodger';

    const newUser = {
      email: userData.email,
      name: userData.full_name || userData.email.split('@')[0],
      phone: userData.phone_number,
      role: userRole,
      is_agent: isAgent
    };

    const authToken = res.key || res.access_token || ('token_' + Date.now());
    saveSession(newUser, authToken);
    return newUser;
  };

  // 5. Logout
  const logout = async () => {
    try {
      await signOutUser();
    } catch (err) {
      console.warn('Sign out call failed, clearing local state anyway:', err);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.clear();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isLoggedIn: !!user,
        isAgent: Boolean(user?.is_agent || user?.role?.toLowerCase() === 'agent'),
        login,
        loginWithGoogle,
        requestPhoneOTP,
        confirmPhoneOTP,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};