import { create } from "zustand";
import type { PdfToolId } from "@/lib/tools";

export type Plan = "free" | "pro";

export interface User {
  id: string;
  email: string;
  roles: string[];
}

export interface RecentFile {
  name: string;
  size: number;
  type: string;
  processedAt: number;
  toolId: PdfToolId;
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
  favorites: PdfToolId[];
  recentFiles: RecentFile[];
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
  addFavorite: (toolId: PdfToolId) => void;
  removeFavorite: (toolId: PdfToolId) => void;
  addRecentFile: (file: RecentFile) => void;
  clearFiles: () => void;
  setProcessing: (isProcessing: boolean, progress?: number) => void;
  setUploadedFiles: (files: File[]) => void;
  updateSecuritySettings: (retentionDays: number, restrictedAccess: boolean) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  user: null,
  token: null,
  favorites: [],
  recentFiles: [],
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

  addFavorite: (toolId) =>
    set((state) => {
      if (state.favorites.includes(toolId)) return state;
      return { favorites: [...state.favorites, toolId] };
    }),

  removeFavorite: (toolId) =>
    set((state) => ({
      favorites: state.favorites.filter((id) => id !== toolId)
    })),

  addRecentFile: (file) =>
    set((state) => {
      const next = [file, ...state.recentFiles].slice(0, 50);
      const docsToday = next.filter((f) => {
        const today = new Date();
        const d = new Date(f.processedAt);
        return (
          d.getFullYear() === today.getFullYear() &&
          d.getMonth() === today.getMonth() &&
          d.getDate() === today.getDate()
        );
      }).length;
      const successRate =
        next.length === 0 ? 0 : Math.min(100, Math.round((next.length / (next.length + 1)) * 100));
      return {
        recentFiles: next,
        usageStats: {
          ...state.usageStats,
          documentsToday: docsToday,
          successRate
        }
      };
    }),

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
