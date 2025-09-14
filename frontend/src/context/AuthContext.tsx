import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User as FirebaseUser,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth } from '../firebase';
import { User } from '../types';
import { toast } from 'react-hot-toast';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: User | null;
  loading: boolean;
  login: (email: string, password: string, role?: string) => Promise<void>;
  register: (email: string, password: string, userData: Partial<User>) => Promise<void>;
  loginWithGoogle: (role?: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  /** -------------------------
   * MANUAL LOGIN (Backend)
   * ------------------------- */
  const login = async (email: string, password: string, role: string = 'user') => {
    try {
      setLoading(true);
      console.log("Attempting login with email:", email);
      
      // First, try to sign in with Firebase
      try {
        // Since you're using Firebase in your app, you would normally do:
        // const userCredential = await signInWithEmailAndPassword(auth, email, password);
        // const firebaseUid = userCredential.user.uid;
        
        // But for now, we'll just proceed with email-based login to the backend
      } catch (firebaseError) {
        console.error("Firebase login error:", firebaseError);
        // Continue with backend login even if Firebase login fails
      }
      
      // Now authenticate with backend
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      console.log("Login response status:", res.status);
      const result = await res.json();
      console.log("Login response:", result);
      
      if (!res.ok) throw new Error(result.message || 'Login failed');

      // Ensure user has a name property
      const userToStore = result.user || {};
      if (!userToStore.name) {
        // Use email username as fallback
        userToStore.name = email.split('@')[0];
      }

      // Save JWT + user info
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(userToStore));

      setUserProfile(userToStore);
      console.log("Login: Set user profile to:", userToStore);
      toast.success('Logged in successfully!');
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || 'Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /** -------------------------
   * MANUAL REGISTER (Backend)
   * ------------------------- */
  const register = async (email: string, password: string, userData: Partial<User>) => {
    try {
      setLoading(true);
      console.log("Attempting registration with:", { email, name: userData.name, role: userData.role });

      // First, create user in Firebase
      try {
        // Since you're using Firebase in your app, you would normally do:
        // const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // const firebaseUid = userCredential.user.uid;
        
        // But for testing purposes, we'll generate a fake firebase_uid
        const fakeFirebaseUid = `test-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
        
        // Register user in backend
        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            firebase_uid: fakeFirebaseUid,
            name: userData.name, 
            email, 
            role: userData.role || 'user' 
          }),
        });

        console.log("Registration response status:", res.status);
        const result = await res.json();
        console.log("Registration response:", result);
        
        if (!res.ok) throw new Error(result.message || 'Registration failed');

        // If registration was successful and the backend returned user data and token
        if (result.user && result.token) {
          // Store user data and token
          localStorage.setItem('token', result.token);
          localStorage.setItem('user', JSON.stringify(result.user));
          setUserProfile(result.user);
        }

        toast.success('Account created!');
      } catch (firebaseError) {
        console.error("Firebase registration error:", firebaseError);
        throw firebaseError;
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error.message || 'Failed to register');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /** -------------------------
   * GOOGLE LOGIN (Firebase)
   * ------------------------- */
  const loginWithGoogle = async (role: string = 'user') => {
    try {
      setLoading(true);
      console.log("Attempting Google login");
      
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      console.log("Google sign-in successful", result.user);

      // Get Firebase UID and other user details
      const firebase_uid = result.user.uid;
      const userName = result.user.displayName || result.user.email?.split('@')[0] || 'User';
      const email = result.user.email;

      if (!email) {
        throw new Error("No email found from Google account");
      }

      // Register or login Google user in backend
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firebase_uid,
          name: userName,
          email,
          role,
        }),
      });

      console.log("Backend register response status:", res.status);
      const dbUser = await res.json();
      console.log("Backend register response:", dbUser);
      
      if (!res.ok) {
        // If registration fails because user exists, try login instead
        if (res.status === 409) {
          console.log("User already exists, trying login instead");
          
          const loginRes = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              firebase_uid,
              email
            }),
          });
          
          console.log("Login response status:", loginRes.status);
          const loginResult = await loginRes.json();
          console.log("Login response:", loginResult);
          
          if (!loginRes.ok) throw new Error(loginResult.message || 'Login failed');
          
          // Ensure the user object has a name property before storing
          const userToStore = loginResult.user || {};
          if (!userToStore.name && userName) {
            userToStore.name = userName;
          }
          
          localStorage.setItem('token', loginResult.token || '');
          localStorage.setItem('user', JSON.stringify(userToStore));
          
          setUserProfile(userToStore);
          toast.success('Google login successful!');
          return;
        } else {
          throw new Error(dbUser.message || 'Registration failed');
        }
      }
      
      // Handle successful registration
      const userToStore = dbUser.user || {};
      if (!userToStore.name && userName) {
        userToStore.name = userName;
      }
      
      localStorage.setItem('token', dbUser.token || '');
      localStorage.setItem('user', JSON.stringify(userToStore));

      setUserProfile(userToStore);
      console.log("Set user profile to:", userToStore);
      toast.success('Google login successful!');
    } catch (error: any) {
      console.error("Google login error:", error);
      toast.error(error.message || 'Google login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /** -------------------------
   * LOGOUT
   * ------------------------- */
  const logout = async () => {
    try {
      await signOut(auth); // clears Firebase session if used
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUserProfile(null);
      toast.success('Logged out');
    } catch (error: any) {
      toast.error(error.message || 'Failed to logout');
    }
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const updateUserProfile = async (data: Partial<User>) => {
    if (userProfile) {
      setUserProfile({ ...userProfile, ...data });
    }
  };

  useEffect(() => {
    // Load user profile from localStorage on startup
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Ensure user has a name property
        if (!parsedUser.name && parsedUser.email) {
          parsedUser.name = parsedUser.email.split('@')[0];
        }
        setUserProfile(parsedUser);
        console.log("Loaded user from localStorage:", parsedUser);
      } catch (error) {
        console.error("Error parsing stored user:", error);
      }
    }

    const unsubscribe = onAuthStateChanged(auth, async (user: FirebaseUser | null) => {
      setCurrentUser(user);
      // If no Firebase user, check localStorage for JWT user
      if (!user) {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            // Ensure user has a name property
            if (!parsedUser.name && parsedUser.email) {
              parsedUser.name = parsedUser.email.split('@')[0];
            }
            setUserProfile(parsedUser);
          } catch (error) {
            console.error("Error parsing stored user:", error);
          }
        }
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    userProfile,
    loading,
    login,
    register,
    loginWithGoogle,
    logout,
    resetPassword,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
