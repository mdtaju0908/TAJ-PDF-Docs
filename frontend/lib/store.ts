import { create } from "zustand";
import type { PdfToolId } from "@/lib/tools";

export type Plan = "free" | "pro";

export interface User {
  id: string;
  email: string;
  roles: string[];
}

export interface UsageStats {
  documentsToday: number;
  successRate: number;
  collaborators: number;
}

export interface ProcessingState {
  isProcessing: boolean;
  progress: number;
}

interface AppStore {
  user: User | null;
  token: string | null;
  usageStats: UsageStats;
  currentPlan: Plan;
  uploadedFiles: File[];
  processingState: ProcessingState;
  securitySettings: {
    retentionDays: number;
    restrictedAccess: boolean;
  };

  login: (user: User, token: string | null) => void;
  logout: () => void;
  clearFiles: () => void;
  setProcessing: (isProcessing: boolean, progress?: number) => void;
  setUploadedFiles: (files: File[]) => void;
  updateSecuritySettings: (retentionDays: number, restrictedAccess: boolean) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  user: null,
  token: null,
  usageStats: {
    documentsToday: 0,
    successRate: 0,
    collaborators: 0
  },
  currentPlan: "free",
  uploadedFiles: [],
  processingState: {
    isProcessing: false,
    progress: 0
  },
  securitySettings: {
    retentionDays: 0,
    restrictedAccess: false
  },

  login: (user, token) =>
    set(() => ({
      user,
      token
    })),

  logout: () =>
    set(() => ({
      user: null,
      token: null,
      uploadedFiles: [],
      processingState: { isProcessing: false, progress: 0 }
    })),

  clearFiles: () => set(() => ({ uploadedFiles: [] })),

  setProcessing: (isProcessing, progress = 0) =>
    set(() => ({
      processingState: { isProcessing, progress }
    })),

  setUploadedFiles: (files) => set(() => ({ uploadedFiles: files }))
  ,

  updateSecuritySettings: (retentionDays, restrictedAccess) =>
    set((state) => ({
      securitySettings: { retentionDays, restrictedAccess }
    }))
}));
