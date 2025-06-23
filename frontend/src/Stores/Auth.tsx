import { create } from "zustand";

interface AuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
  setAccessToken: (token: string) => void;
  clearAccessToken: () => void;
  loadAccessToken: () => Promise<string | null>;
}

const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  isAuthenticated: false,

  setAccessToken: (token: string) => {
    set({ accessToken: token, isAuthenticated: true });
    // @ts-ignore
    window.electronAPI.saveAccessToken(token);
  },

  clearAccessToken: () => {
    set({ accessToken: null, isAuthenticated: false });
    // @ts-ignore
    window.electronAPI.clearAccessToken();
  },

  loadAccessToken: async () => {
    // @ts-ignore
    const token = await window.electronAPI.getAccessToken();
    if (token) {
      set({ accessToken: token, isAuthenticated: true });
    }
    return token;
  },
}));

export default useAuthStore;
