import { api } from "./api";
import { LoginResponse, User } from "../types";

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await api.post("/login", { email, password });
    const { success, token, user } = response.data;
    
    if (success && token && user) {
      localStorage.setItem("nbi_admin_token", token);
      localStorage.setItem("nbi_admin_user", JSON.stringify(user));
    }
    
    return response.data;
  },

  logout: (): void => {
    localStorage.removeItem("nbi_admin_token");
    localStorage.removeItem("nbi_admin_user");
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem("nbi_admin_user");
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem("nbi_admin_token");
  },

  forgotPassword: async (email: string): Promise<any> => {
    const response = await api.post("/forgot-password", { email });
    return response.data;
  },

  resetPassword: async (email: string, code: string, newPassword: string): Promise<any> => {
    const response = await api.post("/reset-password", { email, code, newPassword });
    return response.data;
  }
};
