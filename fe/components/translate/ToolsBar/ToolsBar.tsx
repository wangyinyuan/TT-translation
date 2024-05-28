import IconBtn from "@/components/global/IconBtn";
import { bg, text } from "@/styles/colors";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

export default function ToolsBar() {
  return (
    <View style={styles.container}>
      <IconBtn mode="contained" containerColor={bg.purple_500 } onPress={() => console.log("Button Pressed!")} size={ 34 }>
        <FontAwesome6 name="image" size={24} color={text.white} />
      </IconBtn>
      <IconBtn mode="contained" containerColor={bg.purple_500 } onPress={() => console.log("Button Pressed!")} size={ 68 }>
      <FontAwesome name="camera" size={24} color={text.white} />
      </IconBtn>
      <IconBtn mode="contained" containerColor={bg.purple_500 } onPress={() => console.log("Button Pressed!")} size={ 34 }>
        <FontAwesome6 name="microphone" size={24} color={text.white} />
      </IconBtn>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 50,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    width: "100%",
  }
})