import { create } from "zustand";

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
  totalFiles?: number;
  currentFileIndex?: number;
  fileName?: string;
  fileSize?: number;
  uploadSpeed?: number;
  timeLeft?: number;
}

interface AppStore {
  user: User | null;
  token: string | null;
  usageStats: UsageStats;
  currentPlan: Plan;
  uploadedFiles: File[];
  activeToolId: string | null;
  processingState: ProcessingState;
  securitySettings: {
    retentionDays: number;
    restrictedAccess: boolean;
  };

  login: (user: User, token: string | null) => void;
  logout: () => void;
  clearFiles: () => void;
  setProcessing: (isProcessing: boolean, state?: Partial<Omit<ProcessingState, 'isProcessing'>>) => void;
  setUploadedFiles: (files: File[]) => void;
  setActiveToolId: (toolId: string | null) => void;
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
  activeToolId: null,
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
      activeToolId: null,
      processingState: { isProcessing: false, progress: 0 }
    })),

  clearFiles: () => set(() => ({ uploadedFiles: [] })),

  setProcessing: (isProcessing, state = {}) =>
    set((prev) => ({
      processingState: { 
        ...prev.processingState,
        ...state,
        isProcessing,
        progress: state.progress ?? (isProcessing ? prev.processingState.progress : 0)
      }
    })),

  setUploadedFiles: (files) => set(() => ({ uploadedFiles: files }))
  ,

  setActiveToolId: (toolId) => set(() => ({ activeToolId: toolId })),

  updateSecuritySettings: (retentionDays, restrictedAccess) =>
    set((state) => ({
      securitySettings: { retentionDays, restrictedAccess }
    }))
}));
