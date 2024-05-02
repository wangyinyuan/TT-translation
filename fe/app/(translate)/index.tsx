import HeaderContainer from "@/components/global/HeaderContainer";
import IconBtn from "@/components/global/IconBtn";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { View } from "react-native";

export default function Index() {
  return (
    <View className="flex">
      <HeaderContainer>
        <IconBtn onPress={() => console.log("back")}>
          <MaterialIcons name="arrow-back-ios" size={24} color="white" />
        </IconBtn>
      </HeaderContainer>
    </View>
  );
}
