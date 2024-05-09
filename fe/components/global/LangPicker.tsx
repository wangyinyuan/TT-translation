import { langLabels } from "@/constants/langs";
import { LangsChoice } from "@/types/translate/lang";
import { Octicons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button } from "react-native-paper";
import LangPickerModal from "../translate/LangPickerModal/LangPickerModal";
import IconBtn from "./IconBtn";

const styles = StyleSheet.create({
  labelStyle: {
    fontSize: 20,
    fontWeight: "bold",
    lineHeight: 35,
  },
  buttonStyle: {
    maxWidth: 120,
  },
});

export default function LangPicker() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [langs, setLangs] = useState<LangsChoice>({
    from: "auto",
    to: "EN",
  });

  function toggleModal() {
    setIsModalVisible(!isModalVisible);
  }

  return (
    <View className="flex flex-row items-center justify-around shrink w-full">
      <Button
        textColor="white"
        labelStyle={styles.labelStyle}
        contentStyle={styles.buttonStyle}
        onPress={toggleModal}>
        {langLabels[langs.from]}
      </Button>
      <IconBtn className="shrink">
        <Octicons name="arrow-switch" size={24} color="white" />
      </IconBtn>
      <Button
        textColor="white"
        labelStyle={styles.labelStyle}
        contentStyle={styles.buttonStyle}
        onPress={toggleModal}>
        {langLabels[langs.to]}
      </Button>
      <LangPickerModal isVisible={isModalVisible} onBackdropPress={() => {
        setIsModalVisible(false);
      }} />
    </View>
  );
}
