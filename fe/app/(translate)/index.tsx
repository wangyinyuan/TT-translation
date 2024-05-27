import HeaderContainer from "@/components/global/HeaderContainer";
import IconBtn from "@/components/global/IconBtn";
import LangPicker from "@/components/global/LangPicker";
import LoadingBar from "@/components/global/LoadingBar";
import { useCurLangsStore } from "@/stores/curLangsStore";
import { radiusBase } from "@/styles/base";
import { bg } from '@/styles/colors';
import { AntDesign, Feather } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";

const { height } = Dimensions.get('window');

export default function Index() {
  const langs = useCurLangsStore((state) => state.langs);

  return (
    <View className="flex h-full">
      <StatusBar style="light" />
      <HeaderContainer>
        <View className="flex flex-row items-center max-h-20 justify-between w-full">
          <IconBtn onPress={() => console.log("back")}>
          <AntDesign name="setting" size={24} color="white" />
          </IconBtn>
          <LangPicker />
          <IconBtn>
            <Feather name="bookmark" size={24} color="white" />
          </IconBtn>
        </View>
      </HeaderContainer>
      <View style={styles.bodyContainer}>
        <Text>源语言：{langs.from}</Text>
        <Text>目标语言：{langs.to}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bodyContainer: {
    position: "absolute",
    bottom: 0,
    height: height - 70,
    width: "100%",
    paddingVertical: 20,
    backgroundColor: bg.page,
    borderTopLeftRadius: radiusBase,
    borderTopRightRadius: radiusBase,
  }
})