import HeaderContainer from "@/components/global/HeaderContainer";
import IconBtn from "@/components/global/IconBtn";
import LangPicker from "@/components/global/LangPicker";
import { useCurLangsStore } from "@/stores/curLangsStore";
import { radiusBase } from "@/styles/base";
import { bg, text } from "@/styles/colors";
import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";

const { height } = Dimensions.get("window");

export default function Index() {
  const [inputText, setInputText] = useState("");
  const langs = useCurLangsStore((state) => state.langs);

  function getTextLength() {
    return inputText.length;
  }

  return (
    <View className="flex h-full" style={{ justifyContent: "flex-end" }}>
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
      <View style={[styles.bodyContainer]}>
        <View style={styles.topContainer}>
          <View style={styles.rowBetween}>
            <Text style={styles.clueText}>英语</Text>
            <View style={[styles.row]}>
              <IconBtn style={styles.iconBtn}>
                <Feather name="copy" size={24} color={text.gray_800} />
              </IconBtn>
              <IconBtn style={styles.iconBtn}>
                <AntDesign name="sound" size={24} color={text.gray_800} />
              </IconBtn>
              <IconBtn style={styles.iconBtn}>
                <MaterialIcons name="cancel" size={24} color={text.gray_800} />
              </IconBtn>
            </View>
          </View>
          <View style={styles.textInputContainer}>
            <TextInput
              value={inputText}
              style={styles.textInput}
              onChangeText={(text) => setInputText(text)}
              cursorColor={bg.purple_400}
              maxLength={1000}
              multiline={true}
              textAlignVertical="top"
              ></TextInput>
              <View style={styles.lengthHint}>
                {inputText.length > 0 && <Text style={styles.hintText}>{getTextLength()}/1000</Text>}
              </View>
          </View>
        </View>
        <View style={styles.bottomContainer}></View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: bg.page,
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
  topContainer: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 20,
  },
  bottomContainer: {
    width: "100%",
    height: "60%",
    backgroundColor: bg.white,
    borderTopLeftRadius: radiusBase,
    borderTopRightRadius: radiusBase,
  },
  clueText: {
    color: text.gray_900,
    fontSize: 16,
    fontWeight: "bold",
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textInputContainer: {
    flex: 1,
    // backgroundColor: bg.white,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBtn: {
    marginVertical: 0,
    marginHorizontal: 3,
  },
  textInput: {
    height: "85%",
    width: "100%",
    margin: 0,
    fontSize: 24,
  },
  lengthHint: {
    width: "100%",
    flex: 1,
    alignItems: "flex-end",
    paddingTop: 8,
  },
  hintText: {
    fontSize: 12,
    color: text.gray_600,
  }
});
