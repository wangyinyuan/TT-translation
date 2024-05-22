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
  const [isTarget, setIsTarget] = useState(false);
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

  function toggleModal(isTarget: boolean) {
    setIsTarget(isTarget);
    setIsModalVisible(!isModalVisible);
  }

  function handleModalClose() {
    setIsModalVisible(false);
  }

  function handleLangChange(lang: LangsValue | "auto") {
    // 改变选中的语言
    if (isTarget) {
      setLangs((prev) => ({
        ...prev,
        to: lang as LangsValue,
      }));
    } else {
      setLangs((prev) => ({
        ...prev,
        from: lang,
      }));
    }

    // 添加到最近使用的语言
    if (lang !== 'auto') {
      addLang(lang);
    }
  }

  return (
    <View className="flex flex-row items-center justify-around shrink w-full">
      <Button
        textColor="white"
        labelStyle={styles.labelStyle}
        contentStyle={styles.buttonStyle}
        onPress={() => toggleModal(false)}>
        {langLabels[langs.from]}
      </Button>
      <IconBtn className="shrink">
        <Octicons name="arrow-switch" size={24} color="white" />
      </IconBtn>
      <Button
        textColor="white"
        labelStyle={styles.labelStyle}
        contentStyle={styles.buttonStyle}
        onPress={() => toggleModal(true)}>
        {langLabels[langs.to]}
      </Button>
      <LangPickerModal
        curLangs={langs}
        isTargetPicker={isTarget}
        onLangChange={handleLangChange}
        recentLangs={recentLangs}
        isVisible={isModalVisible}
        onBackdropPress={handleModalClose}
        onSwipeComplete={handleModalClose}
      />
    </View>
  );
}
