import { Octicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { Button } from "react-native-paper";
import IconBtn from "./IconBtn";

const styles = StyleSheet.create({
  labelStyle: {
    fontSize: 20,
    fontWeight: "bold",
    lineHeight: 35,
  },
  buttonStyle: {
    maxWidth: 120,
  }
});

export default function LangPicker() {
  return (
    <View className="flex flex-row items-center justify-around shrink w-full">
      <Button textColor="white" labelStyle={styles.labelStyle} contentStyle={styles.buttonStyle}>
        自动检测
      </Button>
      <IconBtn className="shrink">
        <Octicons name="arrow-switch" size={24} color="white" />
      </IconBtn>
      <Button textColor="white" labelStyle={styles.labelStyle} contentStyle={styles.buttonStyle}>
        阿拉伯语
      </Button>
    </View>
  );
}
