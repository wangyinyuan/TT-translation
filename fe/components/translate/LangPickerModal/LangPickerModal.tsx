import { ScrollView, StyleSheet, Text } from "react-native";
import Modal from "react-native-modal";

interface LangPickerModalProps {
  [key: string]: any;
}

export default function LangPickerModal({ ...props }: LangPickerModalProps) {
  return (
    <Modal {...props} backdropOpacity={0.3} className="flex w-full" style={styles.modal}>
      <ScrollView className="bg-white w-full h-full">
        <Text>I am the modal content!</Text>
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    margin: 0,
  }
})