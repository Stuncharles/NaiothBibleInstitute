import { api } from "./api";
import { Registration } from "../types";

// Helper to get or initialize local registrations
const getLocalRegistrations = (): Registration[] => {
  const local = localStorage.getItem("nbi_local_registrations");
  if (local) {
    try {
      return JSON.parse(local);
    } catch {
      // If corrupted, fallback
    }
  }
  
  // Default enrollees mirroring server's initial database
  const defaults: Registration[] = [
    {
      id: "NBI2026-0001",
      timestamp: "2026-06-25T10:15:30.123Z",
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
      fullName: "Blessing Amara Nwachukwu",
      email: "blessing.nwachukwu@yahoo.com",
      phoneNumber: "+234 812 345 6789",
      gender: "Female",
      church: "Living Faith Church (Winners Chapel)",
      referralSource: "Facebook",
      status: "Pending",
      createdBy: "Online Form",
      qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=NBI2026-0002"
    },
    {
      id: "NBI2026-0003",
      timestamp: "2026-07-01T08:05:00.000Z",
      fullName: "David Segun Alao",
      email: "david.segun@gmail.com",
      phoneNumber: "+234 905 987 6543",
      gender: "Male",
      church: "The Apostolic Church",
      referralSource: "Friend",
      status: "Approved",
      createdBy: "Online Form",
      qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=NBI2026-0003"
    },
    {
      id: "NBI2026-0004",
      timestamp: "2026-07-02T16:45:12.789Z",
      fullName: "Grace Chinemerem Ani",
      email: "grace.ani@outlook.com",
      phoneNumber: "+234 703 444 5555",
      gender: "Female",
      church: "House on the Rock",
      referralSource: "Other",
      status: "Rejected",
      createdBy: "Online Form",
      qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=NBI2026-0004"
    }
  ];
  localStorage.setItem("nbi_local_registrations", JSON.stringify(defaults));
  return defaults;
};

export const registrationService = {
  submitRegistration: async (data: {
    fullName: string;
    email: string;
    phoneNumber: string;
    gender: string;
    church: string;
    referralSource: string;
  }): Promise<{ success: boolean; data: Registration; message: string }> => {
    try {
      const response = await api.post("/register", data);
      return response.data;
    } catch (error) {
      // Offline fallback
      const localList = getLocalRegistrations();
      
      const nextNum = String(localList.length + 1).padStart(4, "0");
      const generatedId = `NBI2026-${nextNum}`;
      
      const newReg: Registration = {
        id: generatedId,
        timestamp: new Date().toISOString(),
        fullName: data.fullName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        gender: data.gender,
        church: data.church,
        referralSource: data.referralSource,
        status: "Pending",
        createdBy: "Online Form (Local Cache)",
        qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${generatedId}`
      };
      
      localList.push(newReg);
      localStorage.setItem("nbi_local_registrations", JSON.stringify(localList));
      
      return {
        success: true,
        data: newReg,
        message: "Registration submitted successfully! (Stored in Local Browser Session)"
      };
    }
  },

  trackRegistration: async (id: string): Promise<{ success: boolean; data: Registration }> => {
    try {
      const response = await api.get(`/track/${id}`);
      return response.data;
    } catch (error) {
      // Offline fallback
      const localList = getLocalRegistrations();
      const match = localList.find(r => r.id.toUpperCase() === id.toUpperCase());
      
      if (match) {
        return { success: true, data: match };
      }
      
      throw new Error("Registration not found (Offline cache checked).");
    }
  }
};
