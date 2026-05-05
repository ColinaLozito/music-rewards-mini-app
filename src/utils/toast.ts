// Toast helper - Easy access to toast store
import { useToastStore } from '../stores/toastStore';
import type { ToastType } from '../types/toast';

export const toast = {
  success: (message: string) => 
    useToastStore.getState().showToast(message, 'success'),
  warning: (message: string) => 
    useToastStore.getState().showToast(message, 'warning'),
  error: (message: string) => 
    useToastStore.getState().showToast(message, 'error'),
};
