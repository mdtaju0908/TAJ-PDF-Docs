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
  phase?: "uploading" | "processing" | "finalizing";
  totalFiles?: number;
  currentFileIndex?: number;
  fileName?: string;
  fileSize?: number;
  uploadSpeed?: number;
  timeLeft?: number;
  queueCompletedFiles?: number;
  queueTotalFiles?: number;
  isPaused?: boolean;
}

interface AppStore {
  user: User | null;
  token: string | null;
  usageStats: UsageStats;
  currentPlan: Plan;
  uploadedFiles: File[];
  activeToolId: string | null;
  toolOptions: Record<string, Record<string, string | number | boolean>>;
  processingState: ProcessingState;
  uploadControls: {
    pauseRequested: boolean;
    resumeRequested: boolean;
    cancelRequested: boolean;
  };
  securitySettings: {
    retentionDays: number;
    restrictedAccess: boolean;
  };

  login: (user: User, token: string | null) => void;
  logout: () => void;
  clearFiles: () => void;
  setProcessing: (isProcessing: boolean, state?: Partial<Omit<ProcessingState, 'isProcessing'>>) => void;
  requestPauseUpload: () => void;
  requestResumeUpload: () => void;
  requestCancelUpload: () => void;
  clearUploadRequests: () => void;
  setUploadedFiles: (files: File[]) => void;
  setActiveToolId: (toolId: string | null) => void;
  setToolOption: (toolId: string, key: string, value: string | number | boolean) => void;
  clearToolOptions: (toolId?: string) => void;
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
  toolOptions: {},
  processingState: {
    isProcessing: false,
    progress: 0
  },
  uploadControls: {
    pauseRequested: false,
    resumeRequested: false,
    cancelRequested: false
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
      toolOptions: {},
      processingState: { isProcessing: false, progress: 0 },
      uploadControls: {
        pauseRequested: false,
        resumeRequested: false,
        cancelRequested: false
      }
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

  requestPauseUpload: () =>
    set((state) => ({
      uploadControls: {
        ...state.uploadControls,
        pauseRequested: true,
        resumeRequested: false
      }
    })),

  requestResumeUpload: () =>
    set((state) => ({
      uploadControls: {
        ...state.uploadControls,
        pauseRequested: false,
        resumeRequested: true
      }
    })),

  requestCancelUpload: () =>
    set((state) => ({
      uploadControls: {
        ...state.uploadControls,
        cancelRequested: true
      }
    })),

  clearUploadRequests: () =>
    set(() => ({
      uploadControls: {
        pauseRequested: false,
        resumeRequested: false,
        cancelRequested: false
      }
    })),

  setUploadedFiles: (files) => set(() => ({ uploadedFiles: files }))
  ,

  setActiveToolId: (toolId) => set(() => ({ activeToolId: toolId })),

  setToolOption: (toolId, key, value) =>
    set((state) => ({
      toolOptions: {
        ...state.toolOptions,
        [toolId]: {
          ...(state.toolOptions[toolId] ?? {}),
          [key]: value,
        },
      },
    })),

  clearToolOptions: (toolId) =>
    set((state) => {
      if (!toolId) return { toolOptions: {} };
      const next = { ...state.toolOptions };
      delete next[toolId];
      return { toolOptions: next };
    }),

  updateSecuritySettings: (retentionDays, restrictedAccess) =>
    set((state) => ({
      securitySettings: { retentionDays, restrictedAccess }
    }))
}));
