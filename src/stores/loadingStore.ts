import { create } from 'zustand';

interface LoadingStore {
  visible: boolean;
  message: string;
  showLoading: (msg?: string) => void;
  hideLoading: () => void;
}

export const useLoadingStore = create<LoadingStore>((set) => ({
  visible: false,
  message: 'Loading...',
  showLoading: (msg = 'Loading...') => {
    set({ visible: true, message: msg });
    // Auto-hide after 5s (prevents stuck loading)
    setTimeout(() => {
      set((state) => state.visible ? { visible: false, message: 'Loading...' } : {});
    }, 5000);
  },
  hideLoading: () => set({ visible: false, message: 'Loading...' }),
}));
