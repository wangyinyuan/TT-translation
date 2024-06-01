import HeaderContainer from "@/components/global/HeaderContainer";
import IconBtn from "@/components/global/IconBtn";
import { radiusBase } from "@/styles/base";
import { bg } from "@/styles/colors";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";

const { height } = Dimensions.get("window");

export default function HistoryView() {

  return (
    <View className="flex h-full w-full" style={styles.pageContainer}>
      <StatusBar style="light" />
      <HeaderContainer>
        <IconBtn onPress={() => router.back()}>
          <MaterialIcons name="arrow-back-ios" size={24} color="white" />
        </IconBtn>
      </HeaderContainer>
      <View style={styles.bodyContainer}>
        <ScrollView>
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugiat
            sit, sapiente magnam velit hic, unde minima tempora voluptatem
            repellat dicta excepturi iure atque! Perferendis voluptatibus natus,
            porro alias magnam libero.
          </Text>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    justifyContent: "flex-end",
  },
  bodyContainer: {
    position: "relative",
    height: height - 70,
    width: "100%",
    paddingVertical: 20,
    paddingBottom: 0,
    backgroundColor: bg.page,
    borderTopLeftRadius: radiusBase,
    borderTopRightRadius: radiusBase,
  },
});
