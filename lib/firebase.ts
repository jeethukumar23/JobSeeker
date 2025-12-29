import { initializeApp, getApps } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const isConfigValid = Object.values(firebaseConfig).every(
  (value) => typeof value === "string" && value.trim() !== "" && value !== "undefined",
)

if (!isConfigValid) {
  console.error(
    "[v0] Firebase configuration is incomplete. Please add all required Vite environment variables:",
    "\n- VITE_FIREBASE_API_KEY",
    "\n- VITE_FIREBASE_AUTH_DOMAIN",
    "\n- VITE_FIREBASE_PROJECT_ID",
    "\n- VITE_FIREBASE_STORAGE_BUCKET",
    "\n- VITE_FIREBASE_MESSAGING_SENDER_ID",
    "\n- VITE_FIREBASE_APP_ID",
  )
}

let app: any = null
let auth: any = null
let db: any = null

if (isConfigValid) {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
  auth = getAuth(app)
  db = getFirestore(app)
} else {
  console.warn("[v0] Skipping Firebase initialization due to missing configuration")
}

export { app, auth, db, isConfigValid }
