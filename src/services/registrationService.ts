import { api } from "./api";
import { Registration } from "../types";

export const registrationService = {
  submitRegistration: async (data: {
    fullName: string;
    email: string;
    phoneNumber: string;
    gender: string;
    church: string;
    referralSource: string;
  }): Promise<{ success: boolean; data: Registration; message: string }> => {
    const response = await api.post("/register", data);
    return response.data;
  },

  trackRegistration: async (id: string): Promise<{ success: boolean; data: Registration }> => {
    const response = await api.get(`/track/${id}`);
    return response.data;
  }
};
