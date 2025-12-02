import { initializeApp } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';

// Your Firebase config
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
export const auth = getAuth(app);

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
}

export class AuthService {
  static async signUp(email: string, password: string, displayName: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      if (userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: displayName,
        });
      }
      
      return { success: true, user: userCredential.user };
    } catch (error: any) {
      let errorMessage = "Signup failed";
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Email already in use';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak';
      }
      
      return { success: false, error: errorMessage };
    }
  }

  static async signIn(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error: any) {
      let errorMessage = "Login failed";
      
      if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = 'User not found';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Wrong password';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many attempts. Try again later';
      }
      
      return { success: false, error: errorMessage };
    }
  }

  static async signOut() {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  static async sendPasswordResetEmail(email: string) {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error: any) {
      let errorMessage = "Failed to send reset email";
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'User not found';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many requests. Try again later';
      }
      
      return { success: false, error: errorMessage };
    }
  }

  static getCurrentUser(): User | null {
    const user = auth.currentUser;
    if (!user) return null;
    
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
    };
  }

  static onAuthStateChanged(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, (firebaseUser) => {
      console.log("Firebase auth state changed:", firebaseUser ? "User logged in" : "No user");
      if (firebaseUser) {
        callback({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
        });
      } else {
        callback(null);
      }
    });
  }
}