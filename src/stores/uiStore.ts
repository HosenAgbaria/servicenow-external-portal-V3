import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UIState } from '../types';

interface UIStoreState extends UIState {
  // Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSuccess: (success: string | null) => void;
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  clearMessages: () => void;
  toggleSidebar: () => void;
  toggleTheme: () => void;
}

// Get initial theme from localStorage or system preference
const getInitialTheme = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') {
      return saved;
    }
    
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
  }
  return 'light';
};

const initialState: UIState = {
  loading: false,
  error: null,
  success: null,
  sidebarOpen: false,
  theme: getInitialTheme(),
};

export const useUIStore = create<UIStoreState>()(
  persist(
    (set) => ({
      ...initialState,

      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      setSuccess: (success) => set({ success }),
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
      setTheme: (theme) => set({ theme }),
      
      clearMessages: () => set({ error: null, success: null }),
      
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      
      toggleTheme: () => set((state) => ({ 
        theme: state.theme === 'light' ? 'dark' : 'light' 
      })),
    }),
    {
      name: 'ui-store',
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);