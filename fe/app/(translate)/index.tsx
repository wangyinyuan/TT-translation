import HeaderContainer from "@/components/global/HeaderContainer";
import IconBtn from "@/components/global/IconBtn";
import LangPicker from "@/components/global/LangPicker";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { View } from "react-native";

export default function Index() {
  return (
    <View className="flex">
      <StatusBar style="light" />
      <HeaderContainer>
        <View className="flex flex-row items-center max-h-20 justify-between w-full">
          <IconBtn onPress={() => console.log("back")}>
            <MaterialIcons name="arrow-back-ios" size={24} color="white" />
          </IconBtn>
          <LangPicker />
          <IconBtn>
            <Feather name="bookmark" size={24} color="white" />
          </IconBtn>
        </View>
      </HeaderContainer>
    </View>
  );
}
