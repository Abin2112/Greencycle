import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
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

  // Simulated API calls - replace with actual API calls
  const fetchUserProfile = async (firebaseUser: FirebaseUser, role: string = 'user'): Promise<User | null> => {
    try {
      // This would be a real API call
      // const response = await fetch(`/api/users/profile/${firebaseUser.uid}`);
      // const userData = await response.json();
      
      // Mock user data for now
      const mockUser: User = {
        id: firebaseUser.uid,
        firebaseUid: firebaseUser.uid,
        name: firebaseUser.displayName || 'User',
        email: firebaseUser.email || '',
        role: role as any, // Use the provided role
        points: 150,
        badges: ['Eco Warrior', 'First Upload'],
        profileImage: firebaseUser.photoURL || undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      return mockUser;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  const login = async (email: string, password: string, role: string = 'user') => {
    try {
      setLoading(true);
      const result = await signInWithEmailAndPassword(auth, email, password);
      // Store role in localStorage for persistence
      localStorage.setItem('userRole', role);
      const profile = await fetchUserProfile(result.user, role);
      setUserProfile(profile);
      toast.success('Successfully logged in!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to login');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, userData: Partial<User>) => {
    try {
      setLoading(true);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create user profile in your backend
      // const response = await fetch('/api/users/create', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     firebaseUid: result.user.uid,
      //     email: result.user.email,
      //     ...userData
      //   })
      // });
      
      const profile = await fetchUserProfile(result.user, userData.role || 'user');
      setUserProfile(profile);
      toast.success('Account created successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async (role: string = 'user') => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      // Store role in localStorage for persistence
      localStorage.setItem('userRole', role);
      const profile = await fetchUserProfile(result.user, role);
      setUserProfile(profile);
      toast.success('Successfully logged in with Google!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to login with Google');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUserProfile(null);
      // Clear stored role on logout
      localStorage.removeItem('userRole');
      toast.success('Successfully logged out!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to logout');
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset email sent!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send password reset email');
      throw error;
    }
  };

  const updateUserProfile = async (data: Partial<User>) => {
    try {
      // This would be a real API call
      // await fetch('/api/users/update', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data)
      // });
      
      if (userProfile) {
        setUserProfile({ ...userProfile, ...data });
      }
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Get stored role from localStorage, default to 'user'
        const storedRole = localStorage.getItem('userRole') || 'user';
        const profile = await fetchUserProfile(user, storedRole);
        setUserProfile(profile);
      } else {
        setUserProfile(null);
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