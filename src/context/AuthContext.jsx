import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  loginUser as apiLogin,
  registerUser as apiRegister,
  loginWithGoogleBackend,
  signOutUser,
  changePassword as apiChangePassword,
  requestPasswordReset as apiRequestPasswordReset,
  resendVerificationEmail as apiResendVerificationEmail,
  fetchCurrentUser,
  updateCurrentUser
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
  const saveSession = (userData, authToken, refreshToken = null) => {
    setUser(userData);
    setToken(authToken);

    try {
      localStorage.setItem('loggedInUser', 'true');
      localStorage.setItem('userName', userData.name || '');
      localStorage.setItem('userEmail', userData.email || '');
      localStorage.setItem('userRole', userData.role || 'Lodger');
      localStorage.setItem('userData', JSON.stringify(userData));
      localStorage.setItem('accessToken', authToken);
      if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
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

    const authToken = res.access || res.access_token || res.key || res.token;
    if (!authToken) throw new Error('Login response did not include an access token.');
    saveSession(userData, authToken, res.refresh);
    return userData;
  };

  // 2. Google OAuth Login
  const loginWithGoogle = async (accessToken) => {
    const res = await loginWithGoogleBackend(accessToken);
    if (!res) throw new Error('Google login failed.');

    const isAgent = Boolean(res.user?.is_agent || res.is_agent);
    const userRole = isAgent ? 'Agent' : 'Lodger';

    const userData = {
      email: res.user?.email || 'googleuser@bookit.com',
      name: res.user?.full_name || res.user?.user_metadata?.full_name || res.user?.email?.split('@')[0] || 'Google User',
      role: userRole,
      is_agent: isAgent
    };

    const authToken = res.access || res.access_token || res.key || res.session?.access_token;
    if (!authToken) throw new Error('Social login response did not include an access token.');
    saveSession(userData, authToken, res.refresh);
    return userData;
  };

  // 3. Registration
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

    const authToken = res.access || res.access_token || res.key;
    if (authToken) saveSession(newUser, authToken, res.refresh);
    return newUser;
  };

  // 4. Logout
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

  const changePassword = (passwords) => apiChangePassword(passwords, token);
  const requestPasswordReset = (email) => apiRequestPasswordReset(email);
  const resendVerificationEmail = (email) => apiResendVerificationEmail(email);
  const getCurrentUser = () => fetchCurrentUser(token);
  const updateProfile = (userData, method = 'PATCH') => updateCurrentUser(userData, token, method);

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
        register,
        logout,
        changePassword,
        requestPasswordReset,
        resendVerificationEmail,
        getCurrentUser,
        updateProfile
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