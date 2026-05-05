// Toast store - Global toast notification state
import { create } from 'zustand';
import type { Toast, ToastType } from '../types/toast';

interface ToastStore {
  toasts: Toast[];
  showToast: (message: string, type: ToastType) => void;
  dismissToast: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set, get) => ({
  toasts: [],

  showToast: (message: string, type: ToastType) => {
    const id = Date.now().toString();
    const newToast: Toast = { id, message, type, createdAt: Date.now() };
    
    set((state) => ({ toasts: [...state.toasts, newToast] }));
  },

  dismissToast: (id: string) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },
}));
