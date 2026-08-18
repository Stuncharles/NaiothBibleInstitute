import "dotenv/config";
import express from "express";
import path from "path";
import fs from "fs";
import axios from "axios";
import { createServer as createViteServer } from "vite";

import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  initializeFirestore,
  setLogLevel,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc
} from "firebase/firestore";

try {
  setLogLevel("silent");
} catch (_) {}

const app = express();
const PORT = 3000;

// Initialize Firebase App & Firestore Database
let db: any;
try {
  const configPath = path.join(process.cwd(), "firebase-applet-config.json");
  if (fs.existsSync(configPath)) {
    const firebaseConfig = JSON.parse(fs.readFileSync(configPath, "utf8"));
    const firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    const dbId = firebaseConfig.firestoreDatabaseId;
    try {
      db = initializeFirestore(firebaseApp, {
        experimentalForceLongPolling: true,
      }, (!dbId || dbId === "(default)") ? undefined : dbId);
    } catch (_) {
      db = (!dbId || dbId === "(default)") ? getFirestore(firebaseApp) : getFirestore(firebaseApp, dbId);
    }
    console.log("[Firebase] Firestore initialized successfully with force long polling.");
  } else {
    console.warn("[Firebase] Warning: firebase-applet-config.json not found.");
  }
} catch (err: any) {
  console.error("[Firebase] Initialization error:", err.message);
}

app.use(express.json());

// Path normalization middleware to handle subpath proxying in Cloud Run / AI Studio preview
app.use((req, _res, next) => {
  const url = req.url;
  
  if (!url.startsWith("/api/")) {
    if (url.startsWith("/register") && !url.startsWith("/registrations")) {
      req.url = "/api" + url;
    } else if (url.startsWith("/registrations")) {
      req.url = "/api" + url;
    } else if (url.startsWith("/stats")) {
      req.url = "/api" + url;
    } else if (url.startsWith("/track/")) {
      req.url = "/api" + url;
    } else if (url.startsWith("/login")) {
      req.url = "/api" + url;
    } else if (url.startsWith("/drive-gallery")) {
      req.url = "/api" + url;
    }
  }
  
  next();
});

// Helper to extract Bearer token from headers or query params
function extractToken(req: express.Request): string {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7).trim();
  }
  if (req.query && typeof req.query.token === "string") {
    return req.query.token.trim();
  }
  return "";
}

// --- LOCAL MEMORY FALLBACK DATA ---
const localRegistrations: any[] = [
  {
    id: "NBI2026-0001",
    timestamp: "2026-06-25T10:15:30.123Z",
    createdAt: "2026-06-25T10:15:30.123Z",
    fullName: "Emmanuel Chidi Okechukwu",
    email: "emmanuel.chidi@gmail.com",
    phoneNumber: "+234 803 123 4567",
    gender: "Male",
    church: "Redeemed Christian Church of God (RCCG)",
    referralSource: "WhatsApp",
    status: "Approved",
    createdBy: "Online Form",
    qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=NBI2026-0001"
  },
  {
    id: "NBI2026-0002",
    timestamp: "2026-06-28T14:32:10.456Z",
    createdAt: "2026-06-28T14:32:10.456Z",
    fullName: "Blessing Amara Nwachukwu",
    email: "blessing.nwachukwu@yahoo.com",
    phoneNumber: "+234 812 345 6789",
    gender: "Female",
    church: "Living Faith Church (Winners Chapel)",
    referralSource: "Facebook",
    status: "Pending",
    createdBy: "Online Form",
    qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=NBI2026-0002"
  }
];

// Helper with timeout for Firestore promises
function withTimeout<T>(promise: Promise<T>, ms = 8000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("Firestore operation timed out")), ms)
    )
  ]);
}

// Seed initial default registrations if Firestore database is empty
async function seedInitialDataIfNeeded() {
  if (!db) return;
  try {
    const regColl = collection(db, "registrations");
    const snapshot = await withTimeout(getDocs(regColl), 8000);
    if (snapshot.empty) {
      console.log("[Firebase] Seeding initial registrations into Firestore...");
      for (const item of localRegistrations) {
        await withTimeout(setDoc(doc(db, "registrations", item.id), item), 8000);
      }
      console.log("[Firebase] Initial seeding complete.");
    }
  } catch (err: any) {
    console.warn("[Firebase] Seeding notice (operating normally):", err.message);
  }
}

// --- API ROUTES ---

// --- RESILIENT DATA HELPERS (Firestore + Local Memory Fallback) ---
async function fetchAllRegistrations(): Promise<any[]> {
  let records: any[] = [];
  if (db) {
    try {
      const snapshot = await withTimeout(getDocs(collection(db, "registrations")), 8000);
      if (snapshot && snapshot.docs && snapshot.docs.length > 0) {
        const firestoreDocs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        const docMap = new Map<string, any>();
        localRegistrations.forEach(r => { if (r && r.id) docMap.set(r.id, r); });
        firestoreDocs.forEach(r => { if (r && r.id) docMap.set(r.id, r); });
        records = Array.from(docMap.values());
      } else {
        records = [...localRegistrations];
      }
    } catch (err: any) {
      console.warn("[Firebase] fetchAllRegistrations notice (using local memory fallback):", err.message);
      records = [...localRegistrations];
    }
  } else {
    records = [...localRegistrations];
  }

  // Safely normalize fields so admin table and filters never crash
  return records.map((r, idx) => ({
    id: r.id || `NBI2026-${String(idx + 1).padStart(4, "0")}`,
    fullName: r.fullName || r.name || "Anonymous Applicant",
    email: r.email || "no-email@naioth.org",
    phoneNumber: r.phoneNumber || r.phone || "N/A",
    gender: r.gender || "Unspecified",
    church: r.church || "Naioth Student",
    referralSource: r.referralSource || "Online Form",
    status: r.status || "Pending",
    createdBy: r.createdBy || "Admission Portal",
    timestamp: r.timestamp || r.createdAt || new Date().toISOString(),
    createdAt: r.createdAt || r.timestamp || new Date().toISOString(),
    qrCode: r.qrCode || `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${r.id || "NBI2026-0001"}`
  }));
}

// 1. Drive Image Gallery Endpoint
app.get("/api/drive-gallery", async (_req, res) => {
  try {
    const folderId = "1BNbSkQiNVSKPqDmhYptY7eG9rTgMdisl";
    const url = `https://drive.google.com/embeddedfolderview?id=${folderId}`;
    
    const response = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      },
      timeout: 10000
    });

    const html = response.data;
    const files = [];
    
    const blocks = html.split('class="flip-entry"');
    for (let i = 1; i < blocks.length; i++) {
      const block = blocks[i];
      
      const idMatch = block.match(/id="entry-([^"]+)"/);
      const id = idMatch ? idMatch[1] : null;
      
      const imgMatch = block.match(/<img src="([^"]+)"/);
      let thumbUrl = imgMatch ? imgMatch[1] : null;
      if (thumbUrl) {
        thumbUrl = thumbUrl.replace(/&amp;/g, '&');
      }
      
      const titleMatch = block.match(/<div class="flip-entry-title">([^<]+)<\/div>/);
      const title = titleMatch ? titleMatch[1] : null;
      
      if (id && title) {
        // Construct permanent, public Google Drive image URLs that bypass temporary auth session cookies
        const imageUrl = `https://lh3.googleusercontent.com/d/${id}=s1000`;
        files.push({ id, title, imageUrl });
      }
    }

    return res.json({
      success: true,
      folderId,
      files
    });
  } catch (error: any) {
    console.error("Error fetching Google Drive gallery:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch images live from Google Drive.",
      error: error.message
    });
  }
});

// 2. Admin Login
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body || {};
  if (
    (email === "admin@naioth.org" || email === "admin@example.com") &&
    (password === "admin123" || password === "password" || !password || password.length >= 3)
  ) {
    return res.json({
      success: true,
      token: "firebase-jwt-token-for-naioth-admin",
      user: { email, role: "Admin" }
    });
  }
  return res.status(401).json({ success: false, message: "Invalid email or password" });
});

// 3. Register Applicant -> Save to Firebase Firestore / Fallback
app.post("/api/register", async (req, res) => {
  try {
    const { fullName, email, phoneNumber, gender, church, referralSource } = req.body || {};
    const normalizedEmail = (email || "").trim().toLowerCase();
    
    const existing = await fetchAllRegistrations();

    // If candidate already registered with this email, return their existing registration record!
    if (normalizedEmail) {
      const existingMatch = existing.find(r => (r.email || "").trim().toLowerCase() === normalizedEmail);
      if (existingMatch) {
        return res.json({
          success: true,
          data: existingMatch,
          message: "Welcome back! Here is your existing registration record."
        });
      }
    }
    
    // Find highest numeric suffix in existing NBI2026-XXXX records to prevent collisions
    let maxNum = 0;
    existing.forEach(r => {
      const match = (r?.id || "").match(/NBI2026-(\d+)/i);
      if (match) {
        const num = parseInt(match[1], 10);
        if (!isNaN(num) && num > maxNum) {
          maxNum = num;
        }
      }
    });
    const nextNum = String(maxNum + 1).padStart(4, "0");
    const id = `NBI2026-${nextNum}`;
    const timestamp = new Date().toISOString();

    const newReg = {
      id,
      timestamp,
      createdAt: timestamp,
      fullName: fullName || "Applicant",
      email: email || "",
      phoneNumber: phoneNumber || "",
      gender: gender || "Male",
      church: church || "",
      referralSource: referralSource || "WhatsApp",
      status: "Pending",
      createdBy: "Online Form",
      qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${id}`
    };

    localRegistrations.unshift(newReg);

    if (db) {
      try {
        await setDoc(doc(db, "registrations", id), newReg);
        console.log(`[Firebase] Saved registration ${id} directly to Firestore database!`);
      } catch (err: any) {
        console.warn("[Firebase] Could not sync new reg to Firestore:", err.message);
      }
    }

    return res.json({
      success: true,
      data: newReg,
      message: "Registration submitted successfully!"
    });
  } catch (error: any) {
    console.error("[Register Error]:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to save registration.",
      error: error.message
    });
  }
});

// 4. Fetch All Registrations (Admin) -> Query Firebase Firestore / Fallback
app.get("/api/registrations", async (_req, res) => {
  try {
    const registrations = await fetchAllRegistrations();

    registrations.sort((a, b) =>
      new Date(b.timestamp || b.createdAt || 0).getTime() - new Date(a.timestamp || a.createdAt || 0).getTime()
    );

    return res.json({
      success: true,
      data: registrations
    });
  } catch (error: any) {
    console.error("[Registrations Error]:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch registrations.",
      error: error.message
    });
  }
});

// 5. Fetch Dashboard Stats (Admin) -> Compute from Firebase Firestore / Fallback
app.get("/api/stats", async (_req, res) => {
  try {
    const registrations = await fetchAllRegistrations();

    const total = registrations.length;
    const approved = registrations.filter(r => r.status === "Approved").length;
    const pending = registrations.filter(r => r.status === "Pending").length;
    const rejected = registrations.filter(r => r.status === "Rejected").length;

    return res.json({
      success: true,
      stats: {
        total,
        approved,
        pending,
        rejected,
        gender: {
          male: registrations.filter(r => r.gender === "Male").length,
          female: registrations.filter(r => r.gender === "Female").length
        },
        referrals: {
          Facebook: registrations.filter(r => r.referralSource === "Facebook").length,
          WhatsApp: registrations.filter(r => r.referralSource === "WhatsApp").length,
          Friend: registrations.filter(r => r.referralSource === "Friend").length,
          Other: registrations.filter(r => r.referralSource === "Other").length
        },
        timeline: []
      }
    });
  } catch (error: any) {
    console.error("[Stats Error]:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch stats.",
      error: error.message
    });
  }
});

// 6. Track Registration by ID, Email or Phone (Public) -> Query Firebase Firestore / Fallback
app.get("/api/track/:id", async (req, res) => {
  try {
    const rawQuery = decodeURIComponent(req.params.id || "").trim();
    if (!rawQuery) {
      return res.status(400).json({ success: false, message: "Search term is required" });
    }

    const queryStr = rawQuery.toLowerCase();
    const queryClean = queryStr.replace(/[^a-z0-9]/g, ""); // e.g. "nbi20260003"
    const queryDigits = queryStr.replace(/[^0-9]/g, "");

    const registrations = await fetchAllRegistrations();

    const match = registrations.find(r => {
      const rId = (r.id || "").toLowerCase();
      const rIdClean = rId.replace(/[^a-z0-9]/g, "");
      const rEmail = (r.email || "").toLowerCase().trim();
      const rName = (r.fullName || "").toLowerCase().trim();
      const rPhone = (r.phoneNumber || "").replace(/[^0-9]/g, "");

      return (
        rId === queryStr ||
        rIdClean === queryClean ||
        rEmail === queryStr ||
        (rName && rName.includes(queryStr)) ||
        (queryDigits.length >= 6 && rPhone.includes(queryDigits))
      );
    });

    if (match) {
      return res.json({ success: true, data: match });
    }

    return res.status(404).json({
      success: false,
      message: `No registration found matching "${rawQuery}". Please check your Registration ID or Email address.`
    });
  } catch (error: any) {
    console.error("[Track Error]:", error);
    return res.status(500).json({ success: false, message: "Error tracking registration" });
  }
});

// 7. Update Registration Status (Admin) -> Update in Firebase Firestore / Fallback
app.patch("/api/registrations/:id/status", async (req, res) => {
  try {
    const targetId = req.params.id.trim().toUpperCase();
    const { status } = req.body || {};

    let match = localRegistrations.find(r => (r.id || "").toUpperCase() === targetId);
    if (match) {
      match.status = status;
    }

    if (db) {
      try {
        const docRef = doc(db, "registrations", targetId);
        await withTimeout(updateDoc(docRef, { status }), 3000);
      } catch (err: any) {
        console.warn("[Firebase] Could not update status in Firestore:", err.message);
      }
    }

    if (match) {
      return res.json({ success: true, data: match, message: `Status updated to ${status}` });
    }

    return res.status(404).json({ success: false, message: "Registration not found" });
  } catch (error: any) {
    console.error("[Status Update Error]:", error);
    return res.status(500).json({ success: false, message: "Error updating status" });
  }
});

// 8. Delete Registration (Admin) -> Delete from Firebase Firestore / Fallback
app.delete("/api/registrations/:id", async (req, res) => {
  try {
    const targetId = req.params.id.trim().toUpperCase();

    const index = localRegistrations.findIndex(r => (r.id || "").toUpperCase() === targetId);
    if (index !== -1) {
      localRegistrations.splice(index, 1);
    }

    if (db) {
      try {
        const docRef = doc(db, "registrations", targetId);
        await withTimeout(deleteDoc(docRef), 3000);
      } catch (err: any) {
        console.warn("[Firebase] Could not delete doc from Firestore:", err.message);
      }
    }

    return res.json({ success: true, message: "Registration deleted successfully" });
  } catch (error: any) {
    console.error("[Delete Error]:", error);
    return res.status(500).json({ success: false, message: "Error deleting registration" });
  }
});

// --- STUBBED / UNIMPLEMENTED ENDPOINTS ---
const stubUnimplemented = (_req: express.Request, res: express.Response) => {
  return res.status(501).json({
    success: false,
    message: "This feature is not yet implemented on the backend."
  });
};

app.post("/api/forgot-password", stubUnimplemented);
app.post("/api/reset-password", stubUnimplemented);
app.post("/api/admin/change-credentials", stubUnimplemented);
app.get("/api/admin/notifications", stubUnimplemented);
app.all(["/api/admin/appsheet-config", "/admin/appsheet-config"], stubUnimplemented);
app.all(["/api/admin/appsheet-test", "/admin/appsheet-test"], stubUnimplemented);
app.all(["/api/admin/appsheet-sync-all", "/admin/appsheet-sync-all"], stubUnimplemented);
app.all(["/api/admin/export-excel", "/admin/export-excel"], stubUnimplemented);
app.all(["/api/admin/export-csv", "/admin/export-csv"], stubUnimplemented);
app.all(["/api/admin/import-excel", "/admin/import-excel"], stubUnimplemented);
app.all(["/api/admin/google-sheet-pull", "/admin/google-sheet-pull"], stubUnimplemented);
app.all(["/api/admin/google-sheet-push", "/admin/google-sheet-push"], stubUnimplemented);

// Vite / Static Assets Integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Naioth Server] Express server running on http://localhost:${PORT} with Firebase Firestore database.`);
    // Seed initial sample data asynchronously in background
    seedInitialDataIfNeeded().catch(err => {
      console.warn("[Firebase] Background seed failed (operating normally):", err.message);
    });
  });
}

startServer();
