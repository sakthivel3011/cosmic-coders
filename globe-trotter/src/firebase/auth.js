import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  updateEmail,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  FacebookAuthProvider,
  TwitterAuthProvider
} from 'firebase/auth';
import { auth } from './config';
import { db } from './firestore';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';

// Email/Password Authentication
export const emailAuth = {
  // Register new user
  register: async (email, password, userData = {}) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create user profile in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        displayName: userData.displayName || '',
        createdAt: new Date().toISOString(),
        photoURL: userData.photoURL || '',
        phoneNumber: userData.phoneNumber || '',
        ...userData
      });

      // Update profile in Firebase Auth
      if (userData.displayName || userData.photoURL) {
        await updateProfile(user, {
          displayName: userData.displayName || '',
          photoURL: userData.photoURL || ''
        });
      }

      toast.success('Account created successfully!');
      return { success: true, user };
    } catch (error) {
      console.error('Registration error:', error);
      
      const errorMessages = {
        'auth/email-already-in-use': 'Email already in use',
        'auth/invalid-email': 'Invalid email address',
        'auth/operation-not-allowed': 'Email/password accounts are not enabled',
        'auth/weak-password': 'Password should be at least 6 characters',
        'auth/network-request-failed': 'Network error. Please check your connection'
      };

      toast.error(errorMessages[error.code] || 'Registration failed');
      return { success: false, error: error.message };
    }
  },

  // Login user
  login: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      toast.success('Welcome back!');
      return { success: true, user: userCredential.user };
    } catch (error) {
      console.error('Login error:', error);
      
      const errorMessages = {
        'auth/invalid-credential': 'Invalid email or password',
        'auth/user-disabled': 'Account disabled',
        'auth/user-not-found': 'User not found',
        'auth/wrong-password': 'Incorrect password',
        'auth/too-many-requests': 'Too many attempts. Try again later',
        'auth/network-request-failed': 'Network error. Please check your connection'
      };

      toast.error(errorMessages[error.code] || 'Login failed');
      return { success: false, error: error.message };
    }
  },

  // Logout user
  logout: async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: error.message };
    }
  },

  // Reset password
  resetPassword: async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset email sent!');
      return { success: true };
    } catch (error) {
      console.error('Password reset error:', error);
      
      const errorMessages = {
        'auth/user-not-found': 'User not found',
        'auth/invalid-email': 'Invalid email address',
        'auth/network-request-failed': 'Network error. Please check your connection'
      };

      toast.error(errorMessages[error.code] || 'Failed to send reset email');
      return { success: false, error: error.message };
    }
  },

  // Update user profile
  updateProfile: async (userId, updates) => {
    try {
      // Update in Firestore
      await setDoc(doc(db, 'users', userId), updates, { merge: true });

      // Update in Firebase Auth if relevant fields exist
      const currentUser = auth.currentUser;
      if (currentUser && (updates.displayName || updates.photoURL)) {
        await updateProfile(currentUser, {
          displayName: updates.displayName || currentUser.displayName,
          photoURL: updates.photoURL || currentUser.photoURL
        });
      }

      toast.success('Profile updated successfully!');
      return { success: true };
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error('Failed to update profile');
      return { success: false, error: error.message };
    }
  },

  // Change email
  changeEmail: async (currentPassword, newEmail) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No user logged in');

      // Re-authenticate user
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Update email
      await updateEmail(user, newEmail);

      // Update in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: newEmail,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      toast.success('Email updated successfully!');
      return { success: true };
    } catch (error) {
      console.error('Change email error:', error);
      
      const errorMessages = {
        'auth/wrong-password': 'Incorrect password',
        'auth/requires-recent-login': 'Please re-login to change email',
        'auth/email-already-in-use': 'Email already in use'
      };

      toast.error(errorMessages[error.code] || 'Failed to change email');
      return { success: false, error: error.message };
    }
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No user logged in');

      // Re-authenticate user
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, newPassword);

      toast.success('Password updated successfully!');
      return { success: true };
    } catch (error) {
      console.error('Change password error:', error);
      
      const errorMessages = {
        'auth/wrong-password': 'Incorrect current password',
        'auth/requires-recent-login': 'Please re-login to change password',
        'auth/weak-password': 'New password is too weak'
      };

      toast.error(errorMessages[error.code] || 'Failed to change password');
      return { success: false, error: error.message };
    }
  }
};

// Social Authentication
export const socialAuth = {
  providers: {
    google: new GoogleAuthProvider(),
    facebook: new FacebookAuthProvider(),
    twitter: new TwitterAuthProvider()
  },

  // Social login
  loginWithProvider: async (providerName) => {
    try {
      let provider;
      switch (providerName) {
        case 'google':
          provider = socialAuth.providers.google;
          break;
        case 'facebook':
          provider = socialAuth.providers.facebook;
          break;
        case 'twitter':
          provider = socialAuth.providers.twitter;
          break;
        default:
          throw new Error('Invalid provider');
      }

      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user exists in Firestore, if not create
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          provider: providerName,
          createdAt: new Date().toISOString()
        });
      }

      toast.success(`Signed in with ${providerName.charAt(0).toUpperCase() + providerName.slice(1)}`);
      return { success: true, user };
    } catch (error) {
      console.error('Social login error:', error);
      
      const errorMessages = {
        'auth/popup-closed-by-user': 'Login cancelled',
        'auth/cancelled-popup-request': 'Login cancelled',
        'auth/account-exists-with-different-credential': 'Account exists with different credentials',
        'auth/network-request-failed': 'Network error. Please check your connection'
      };

      toast.error(errorMessages[error.code] || 'Social login failed');
      return { success: false, error: error.message };
    }
  }
};

// Authentication State Listener
export const authStateListener = {
  // Subscribe to auth state changes
  subscribe: (callback) => {
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch additional user data from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          const userData = userDoc.exists() ? userDoc.data() : {};
          
          callback({
            ...user,
            ...userData
          });
        } catch (error) {
          console.error('Error fetching user data:', error);
          callback(user);
        }
      } else {
        callback(null);
      }
    });
  },

  // Get current user with Firestore data
  getCurrentUser: async () => {
    const user = auth.currentUser;
    if (!user) return null;

    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      return userDoc.exists() ? { ...user, ...userDoc.data() } : user;
    } catch (error) {
      console.error('Error getting current user:', error);
      return user;
    }
  }
};

// Utility functions
export const authUtils = {
  // Check if user is authenticated
  isAuthenticated: () => {
    return !!auth.currentUser;
  },

  // Get user ID
  getUserId: () => {
    return auth.currentUser?.uid;
  },

  // Get user email
  getUserEmail: () => {
    return auth.currentUser?.email;
  },

  // Get user display name
  getUserDisplayName: () => {
    return auth.currentUser?.displayName;
  },

  // Get user photo URL
  getUserPhotoURL: () => {
    return auth.currentUser?.photoURL;
  },

  // Delete user account
  deleteAccount: async (password) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No user logged in');

      // Re-authenticate user
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);

      // Delete from Firestore
      await setDoc(doc(db, 'users', user.uid), {
        deletedAt: new Date().toISOString(),
        status: 'deleted'
      }, { merge: true });

      // Delete from Firebase Auth
      await user.delete();

      toast.success('Account deleted successfully');
      return { success: true };
    } catch (error) {
      console.error('Delete account error:', error);
      
      const errorMessages = {
        'auth/wrong-password': 'Incorrect password',
        'auth/requires-recent-login': 'Please re-login to delete account'
      };

      toast.error(errorMessages[error.code] || 'Failed to delete account');
      return { success: false, error: error.message };
    }
  }
};

// Default export
export default {
  emailAuth,
  socialAuth,
  authStateListener,
  authUtils
};