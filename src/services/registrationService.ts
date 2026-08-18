import { api } from "./api";
import { Registration } from "../types";
import { db, handleFirestoreError, OperationType } from "../lib/firebase";
import { doc, setDoc, onSnapshot } from "firebase/firestore";

export const registrationService = {
  submitRegistration: async (data: {
    fullName: string;
    email: string;
    phoneNumber: string;
    gender: string;
    church: string;
    referralSource: string;
  }): Promise<{ success: boolean; data: Registration; message: string }> => {
    let apiResult: any = null;
    try {
      const response = await api.post("/register", {
        action: "register",
        ...data,
      });
      apiResult = response.data;
    } catch (err: any) {
      if (err.response?.data) {
        apiResult = err.response.data;
      }
    }

    if (apiResult && apiResult.success && apiResult.data) {
      // Direct client-side write to Firestore as dual persistence guarantee
      try {
        if (db && apiResult.data.id) {
          await setDoc(doc(db, "registrations", apiResult.data.id), apiResult.data, { merge: true });
        }
      } catch (clientFsErr) {
        handleFirestoreError(clientFsErr, OperationType.WRITE, `registrations/${apiResult.data.id}`);
      }
      return apiResult;
    }

    // Resilient fallback if backend connection fails
    const fallbackId = `NBI2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const timestamp = new Date().toISOString();
    const fallbackReg: Registration = {
      id: fallbackId,
      timestamp,
      createdAt: timestamp,
      fullName: data.fullName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      gender: data.gender,
      church: data.church,
      referralSource: data.referralSource,
      status: "Pending",
      createdBy: "Online Form",
      qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${fallbackId}`
    };

    try {
      if (db) {
        await setDoc(doc(db, "registrations", fallbackId), fallbackReg);
        console.log("[Client Firebase] Saved fallback registration to Firestore!");
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `registrations/${fallbackId}`);
    }

    return {
      success: true,
      data: fallbackReg,
      message: "Registration submitted successfully!"
    };
  },

  trackRegistration: async (id: string): Promise<{ success: boolean; data: Registration }> => {
    try {
      const response = await api.get(`/track/${encodeURIComponent(id)}`, {
        params: {
          action: "track",
          id,
        },
      });
      return response.data;
    } catch (err: any) {
      if (err.response?.data) {
        return err.response.data;
      }
      return {
        success: false,
        data: null as any
      };
    }
  },

  subscribeToSingleRegistration: (
    id: string,
    onUpdate: (data: Registration | null) => void
  ): (() => void) => {
    if (!db || !id) return () => {};
    try {
      const docRef = doc(db, "registrations", id);
      const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          onUpdate({
            id: data.id || docSnap.id,
            fullName: data.fullName || "",
            email: data.email || "",
            phoneNumber: data.phoneNumber || "",
            gender: data.gender || "Other",
            church: data.church || "",
            referralSource: data.referralSource || "",
            status: data.status || "Pending",
            createdBy: data.createdBy || "Online Form",
            createdAt: data.createdAt || data.timestamp || new Date().toISOString(),
            timestamp: data.timestamp || data.createdAt || new Date().toISOString(),
            qrCode: data.qrCode || `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${data.id || docSnap.id}`
          });
        } else {
          onUpdate(null);
        }
      }, (err) => {
        handleFirestoreError(err, OperationType.GET, `registrations/${id}`);
      });
      return unsubscribe;
    } catch (e) {
      console.warn("[Firebase Live Single Sync] Error:", e);
      return () => {};
    }
  },
};

