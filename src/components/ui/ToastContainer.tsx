// ToastContainer - Mounts global toasts from store
import React from 'react';
import { View } from 'react-native';
import { styles } from './ToastContainer.styles';
import { useToastStore } from '../../stores/toastStore';
import { Toast } from './Toast';

export function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts);
  const dismissToast = useToastStore((state) => state.dismissToast);

  if (toasts.length === 0) return null;

  return (
    <View style={styles.container} pointerEvents="box-none">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          toast={toast}
          onDismiss={() => dismissToast(toast.id)}
        />
      ))}
    </View>
  );
}
