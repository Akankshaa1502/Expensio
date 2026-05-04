import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const USERS_KEY = 'expensio_users';
const SESSION_KEY = 'expensio_session';

// Get stored users from localStorage
const getStoredUsers = () => {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch {
    return [];
  }
};

// Save users to localStorage
const saveUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// Get current session
const getSession = () => {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY));
  } catch {
    return null;
  }
};

// Save session
const saveSession = (user) => {
  if (user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const session = getSession();
    if (session) {
      setUser(session);
    }
    setLoading(false);
  }, []);

  const signup = async (email, password, displayName) => {
    // Simulate network delay for realistic UX
    await new Promise(resolve => setTimeout(resolve, 600));

    const users = getStoredUsers();
    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (existingUser) {
      const error = new Error('An account with this email already exists.');
      error.code = 'auth/email-already-in-use';
      throw error;
    }

    if (password.length < 6) {
      const error = new Error('Password should be at least 6 characters.');
      error.code = 'auth/weak-password';
      throw error;
    }

    const newUser = {
      uid: 'user_' + Date.now() + '_' + Math.random().toString(36).slice(2, 9),
      email: email.toLowerCase(),
      displayName,
      password, // In a real app, this would be hashed
      photoURL: null,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveUsers(users);

    // Create session (without password)
    const sessionUser = { uid: newUser.uid, email: newUser.email, displayName: newUser.displayName, photoURL: newUser.photoURL };
    setUser(sessionUser);
    saveSession(sessionUser);

    return { user: sessionUser };
  };

  const login = async (email, password) => {
    await new Promise(resolve => setTimeout(resolve, 600));

    const users = getStoredUsers();
    const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!foundUser) {
      const error = new Error('No account found with this email.');
      error.code = 'auth/user-not-found';
      throw error;
    }

    if (foundUser.password !== password) {
      const error = new Error('Incorrect password.');
      error.code = 'auth/wrong-password';
      throw error;
    }

    const sessionUser = { uid: foundUser.uid, email: foundUser.email, displayName: foundUser.displayName, photoURL: foundUser.photoURL };
    setUser(sessionUser);
    saveSession(sessionUser);

    return { user: sessionUser };
  };

  const loginWithGoogle = async () => {
    await new Promise(resolve => setTimeout(resolve, 400));

    // Simulate Google sign-in with a demo account
    const googleUser = {
      uid: 'google_' + Date.now(),
      email: 'demo@gmail.com',
      displayName: 'Demo User',
      photoURL: null,
    };

    // Check if this Google user already exists
    const users = getStoredUsers();
    const existing = users.find(u => u.email === googleUser.email);
    if (!existing) {
      users.push({ ...googleUser, password: null, createdAt: new Date().toISOString() });
      saveUsers(users);
    }

    setUser(googleUser);
    saveSession(googleUser);

    return { user: googleUser };
  };

  const logout = async () => {
    setUser(null);
    saveSession(null);
  };

  const value = {
    user,
    loading,
    signup,
    login,
    loginWithGoogle,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export default AuthContext;
