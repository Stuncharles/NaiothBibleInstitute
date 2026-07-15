export interface Registration {
  id: string;
  timestamp: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  gender: "Male" | "Female" | string;
  church: string;
  referralSource: "Facebook" | "WhatsApp" | "Friend" | "Other" | string;
  status: "Pending" | "Approved" | "Rejected";
  createdBy: "Online Form" | "Admin Portal" | string;
  qrCode?: string;
}

export interface GenderStats {
  male: number;
  female: number;
}

export interface TimelineData {
  date: string;
  count: number;
}

export interface ReferralStats {
  Facebook: number;
  WhatsApp: number;
  Friend: number;
  Other: number;
  [key: string]: number;
}

export interface Stats {
  total: number;
  approved: number;
  pending: number;
  rejected: number;
  gender: GenderStats;
  referrals: ReferralStats;
  timeline: TimelineData[];
}

export interface User {
  email: string;
  role: string;
  name: string;
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  user?: User;
  message?: string;
}
