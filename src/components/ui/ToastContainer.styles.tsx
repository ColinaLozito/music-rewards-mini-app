// Styles for ToastContainer component
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  modalWrapper: {
    flex: 1,
    backgroundColor: "transparent",
  },
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 99999,
    elevation: 99999,
    paddingTop: 50, // Safe area offset
  },
});
