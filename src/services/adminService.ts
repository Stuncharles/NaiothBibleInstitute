import { api } from "./api";
import { Registration, Stats } from "../types";

export interface SecurityNotification {
  id: string;
  timestamp: string;
  message: string;
  type: "security" | "info";
}

export const adminService = {
  getRegistrations: async (): Promise<{ success: boolean; data: Registration[] }> => {
    const response = await api.get("/registrations");
    return response.data;
  },

  updateRegistrationStatus: async (
    id: string,
    status: "Pending" | "Approved" | "Rejected"
  ): Promise<{ success: boolean; data: Registration; message: string }> => {
    const response = await api.patch(`/registrations/${id}/status`, { status });
    return response.data;
  },

  getStats: async (): Promise<{ success: boolean; stats: Stats }> => {
    const response = await api.get("/stats");
    return response.data;
  },

  changeCredentials: async (payload: {
    currentPassword: string;
    newEmail?: string;
    newPassword?: string;
  }): Promise<{ success: boolean; message: string }> => {
    const response = await api.post("/admin/change-credentials", payload);
    return response.data;
  },

  getNotifications: async (): Promise<{ success: boolean; notifications: SecurityNotification[] }> => {
    const response = await api.get("/admin/notifications");
    return response.data;
  }
};
