import HeaderContainer from "@/components/global/HeaderContainer";
import IconBtn from "@/components/global/IconBtn";
import HistoryCard from "@/components/translate/HistoryCard/HistoryCard";
import { radiusBase } from "@/styles/base";
import { bg, text } from "@/styles/colors";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";

const { height } = Dimensions.get("window");

export default function HistoryView() {
  return (
    <View className="flex h-full w-full" style={styles.pageContainer}>
      <StatusBar style="light" />
      <HeaderContainer>
        <View style={styles.headerContainer}>
          <IconBtn onPress={() => router.back()}>
            <MaterialIcons name="arrow-back-ios" size={24} color="white" />
          </IconBtn>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerText}>History</Text>
          </View>
        </View>
      </HeaderContainer>
      <View style={styles.bodyContainer}>
        <View className="flex-row justify-end mt-2 px-4">
          <IconBtn>
            <FontAwesome5 name="trash" size={24} color={bg.red_600} />
          </IconBtn>
        </View>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          <View>
            <HistoryCard
              from="中文"
              to="英文"
              text="你好啊"
              translatedText="Hi, there!"></HistoryCard>
            <HistoryCard
              from="中文"
              to="英文"
              text="你好啊确保组件已经渲染完成，否则可能无法获取正确的尺寸"
              translatedText=" Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                Voluptate dolorem placeat soluta, veritatis ullam dicta
                repudiandae. Necessitatibus veniam dolor dolores consequatur,
                temporibus aliquid maxime repellendus cum iure, in ipsum optio!
                Rerum modi earum quis impedit, veritatis commodi ad dolor"></HistoryCard>
          </View>
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
    backgroundColor: bg.page,
    borderTopLeftRadius: radiusBase,
    borderTopRightRadius: radiusBase,
  },
  headerText: {
    color: text.white,
    fontSize: 24,
    fontWeight: "bold",
  },
  headerContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    maxHeight: 70,
  },
  headerTextContainer: {
    position: "absolute",
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
  },
  scrollView: {
    width: "100%",
    height: "100%",
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
});
