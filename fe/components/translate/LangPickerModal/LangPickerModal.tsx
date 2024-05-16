import { radiusBase } from "@/styles/base";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Modal from "react-native-modal";

interface LangPickerModalProps {
  [key: string]: any;
}

export default function LangPickerModal({ ...props }: LangPickerModalProps) {
  return (
    <Modal
      {...props}
      backdropOpacity={0.3}
      className="flex-1 w-full"
      style={styles.modal}>
      <View className="bg-white h-3/5 absolute bottom-0 w-full" style={[styles.radius]}>
        <ScrollView className="w-full flex-1" style={styles.radius} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
          <Text className="text-9xl">I am the modal content! Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolore, autem earum! At vero similique animi! Eum error optio, mollitia natus quas placeat deleniti a autem delectus sunt blanditiis odio voluptate.</Text>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    margin: 0,
  },
  radius: {
    borderTopLeftRadius: radiusBase,
    borderTopRightRadius: radiusBase,
  },
  contentContainer: {
    paddingVertical: 40,
    paddingHorizontal: 20,
  }
});
