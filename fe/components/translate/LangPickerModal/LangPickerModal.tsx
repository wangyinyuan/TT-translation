import { ScrollView, StyleSheet, Text } from "react-native";
import Modal from "react-native-modal";

interface LangPickerModalProps {
  [key: string]: any;
}

export default function LangPickerModal({ ...props }: LangPickerModalProps) {
  return (
    <Modal {...props} backdropOpacity={0.3} className="flex w-full">
      <ScrollView className="bg-white w-full">
        <Text>I am the modal content!</Text>
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    position: "absolute",
    justifyContent: "center",
    width: "100%",
    height: '60%',
    bottom: 0,
    left: 0,
  }
})