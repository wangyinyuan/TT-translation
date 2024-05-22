import { langLabels } from "@/constants/langs";
import { LangsChoice, LangsValue } from "@/types/translate/lang";
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

  const [recentLangs, setRecentLangs] = useState<LangsValue[]>(["EN"]);
  // 修改最近使用的语言
  const addLang = (lang: LangsValue) => {
    setRecentLangs((prev) => {
      const langSet = new Set(prev);
      langSet.add(lang);
      return Array.from(langSet);
    });
  };

  function toggleModal() {
    setIsModalVisible(!isModalVisible);
  }

  function handleModalClose() {
    setIsModalVisible(false);
  }

  function handleLangChange(lang: LangsChoice) {
    setLangs((prev) => {
      return {
        ...prev,
        ...lang,
      };
    });

    if (lang.from && lang.from !== "auto") {
      addLang(lang.from);
    }

    if (lang.to) {
      addLang(lang.to);
    }
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
      <LangPickerModal
        onLangChange={handleLangChange}
        recentLangs={recentLangs}
        isVisible={isModalVisible}
        onBackdropPress={handleModalClose}
        onSwipeComplete={handleModalClose}
      />
    </View>
  );
}
