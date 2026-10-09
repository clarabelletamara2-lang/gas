import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  getDocFromServer,
  onSnapshot,
  Unsubscribe
} from 'firebase/firestore';
import { StudentProfile } from '../types';
import firebaseConfigData from '../../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: firebaseConfigData.apiKey,
  authDomain: firebaseConfigData.authDomain,
  projectId: firebaseConfigData.projectId,
  storageBucket: firebaseConfigData.storageBucket,
  messagingSenderId: firebaseConfigData.messagingSenderId,
  appId: firebaseConfigData.appId,
};

// Initialize Firebase App
export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore with specific databaseId if provided
export const db = firebaseConfigData.firestoreDatabaseId
  ? getFirestore(app, firebaseConfigData.firestoreDatabaseId)
  : getFirestore(app);

// Test connection on boot
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline, using offline cache.');
    }
  }
}
testConnection();

const STORAGE_ACCOUNTS_KEY = 'glowers_student_accounts_v1';

// Save student account to Firestore cloud (and cache locally)
export async function saveAccountToCloud(profile: StudentProfile): Promise<boolean> {
  const cleanUsername = profile.username.toLowerCase().trim();
  let cloudSuccess = false;

  // 1. Save to Firestore cloud database
  try {
    const docRef = doc(db, 'students', cleanUsername);
    await setDoc(docRef, {
      ...profile,
      username: cleanUsername,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
    cloudSuccess = true;
  } catch (err) {
    console.warn('Gagal sync ke cloud Firebase, disimpan di cache lokal:', err);
  }

  // 2. Always sync to localStorage cache
  try {
    const local = localStorage.getItem(STORAGE_ACCOUNTS_KEY);
    const accounts = local ? JSON.parse(local) : {};
    accounts[cleanUsername] = profile;
    localStorage.setItem(STORAGE_ACCOUNTS_KEY, JSON.stringify(accounts));
  } catch (e) {
    console.debug('Error saving local cache', e);
  }

  return cloudSuccess;
}

// Fetch student account from Firestore cloud (or fallback to local cache)
export async function fetchAccountFromCloud(username: string): Promise<StudentProfile | null> {
  const cleanUsername = username.toLowerCase().trim();

  // 1. Try fetching from Firestore cloud
  try {
    const docRef = doc(db, 'students', cleanUsername);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data() as StudentProfile;
      // Update local cache
      try {
        const local = localStorage.getItem(STORAGE_ACCOUNTS_KEY);
        const accounts = local ? JSON.parse(local) : {};
        accounts[cleanUsername] = data;
        localStorage.setItem(STORAGE_ACCOUNTS_KEY, JSON.stringify(accounts));
      } catch (e) {
        console.debug('Error updating local cache', e);
      }
      return data;
    }
  } catch (err) {
    console.warn('Cloud fetch failed, trying local cache:', err);
  }

  // 2. Fallback to localStorage cache
  try {
    const local = localStorage.getItem(STORAGE_ACCOUNTS_KEY);
    if (local) {
      const accounts = JSON.parse(local);
      if (accounts[cleanUsername]) {
        return accounts[cleanUsername];
      }
    }
  } catch (e) {
    console.debug('Local cache read failed', e);
  }

  return null;
}

// Real-time synchronization listener for cross-device updates
export function subscribeToAccount(
  username: string,
  onUpdate: (profile: StudentProfile) => void
): Unsubscribe {
  const cleanUsername = username.toLowerCase().trim();
  const docRef = doc(db, 'students', cleanUsername);

  return onSnapshot(
    docRef,
    (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as StudentProfile;
        // Update local storage
        try {
          const local = localStorage.getItem(STORAGE_ACCOUNTS_KEY);
          const accounts = local ? JSON.parse(local) : {};
          accounts[cleanUsername] = data;
          localStorage.setItem(STORAGE_ACCOUNTS_KEY, JSON.stringify(accounts));
        } catch (e) {
          console.debug('Error updating local cache from snapshot', e);
        }
        onUpdate(data);
      }
    },
    (err) => {
      console.warn('Real-time listener warning:', err);
    }
  );
}
