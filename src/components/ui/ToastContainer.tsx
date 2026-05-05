// ToastContainer - Mounts global toasts from store
import React from "react";
import { Modal, View } from "react-native";
import { styles } from "./ToastContainer.styles";
import { useToastStore } from "../../stores/toastStore";
import { Toast } from "./Toast";

export function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts);
  const dismissToast = useToastStore((state) => state.dismissToast);

  if (toasts.length === 0) return null;

  return (
    <Modal
      visible
      transparent
      animationType="none"
      presentationStyle="overFullScreen"
      statusBarTranslucent
    >
      <View style={styles.modalWrapper} pointerEvents="box-none">
        <View style={styles.container} pointerEvents="box-none">
          {toasts.map((toast) => (
            <Toast
              key={toast.id}
              toast={toast}
              onDismiss={() => dismissToast(toast.id)}
            />
          ))}
        </View>
      </View>
    </Modal>
  );
}
