import { getTranslation } from "@/apis/translate/getTranslation";
import HeaderContainer from "@/components/global/HeaderContainer";
import IconBtn from "@/components/global/IconBtn";
import LangPicker from "@/components/global/LangPicker";
import LoadingSkeleton from "@/components/global/LoadingSkeleton";
import ToolsBar from "@/components/translate/ToolsBar/ToolsBar";
import { langLabels } from "@/constants/langs";
import { useCurLangsStore } from "@/stores/curLangsStore";
import { radiusBase } from "@/styles/base";
import { bg, text } from "@/styles/colors";
import { AntDesign, Entypo, Feather, MaterialIcons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const { height } = Dimensions.get("window");

export default function Index() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const langs = useCurLangsStore((state) => state.langs);

  function getTextLength() {
    return inputText.length;
  }

  const toBlur = () => {
    inputRef.current?.blur();
    console.log("inputText", inputText);
    // 如果输入框为空，直接结束
    if (inputText === "") return;
    // 展示加载动画
    setIsLoading(true);
    // 发送翻译请求
    setTranslation();
  };


  async function setTranslation() {
    try {
      const res = await getTranslation({
        text: inputText,
        from: langs.from,
        to: langs.to,
      });
      console.log(res);
    } catch (err) {
      console.error(err);
    } finally {
      // 关闭加载动画
      setIsLoading(false);
    }
  }


  function clearAll() {
    setInputText("");
  }

  async function copyTextToClipboard(isTarget: boolean) {
    console.log("copy");
    if (isTarget) {
      await Clipboard.setStringAsync(outputText);
    } else {
      await Clipboard.setStringAsync(inputText);
    }
  }

  // 键盘关闭事件注册
  useEffect(() => {
    const keyboardHideListener = Keyboard.addListener(
      "keyboardDidHide",
      toBlur,
    );

    return () => {
      keyboardHideListener.remove();
    };
  }, [inputText]);

  return (
    <View className="flex h-full" style={{ justifyContent: "flex-end" }}>
      <StatusBar style="light" />
      <HeaderContainer>
        <View className="flex flex-row items-center max-h-20 justify-between w-full">
          <IconBtn onPress={() => console.log("back")}>
            <AntDesign name="setting" size={24} color="white" />
          </IconBtn>
          <LangPicker />
          <Link href="/(translate)/history">
            <IconBtn>
              <Feather name="bookmark" size={24} color="white" />
            </IconBtn>
          </Link>
        </View>
      </HeaderContainer>
      <View style={[styles.bodyContainer]}>
        <View style={styles.topContainer}>
          <View style={styles.rowBetween}>
            <Text style={styles.clueText}>{langLabels[langs.from]}</Text>
            <View style={[styles.row]}>
              <IconBtn
                style={styles.iconBtn}
                onPress={() => copyTextToClipboard(false)}>
                <Feather name="copy" size={24} color={text.gray_800} />
              </IconBtn>
              <IconBtn style={styles.iconBtn}>
                <AntDesign name="sound" size={24} color={text.gray_800} />
              </IconBtn>
              <IconBtn style={styles.iconBtn} onPress={() => clearAll()}>
                <MaterialIcons name="cancel" size={24} color={text.gray_800} />
              </IconBtn>
            </View>
          </View>
          <View style={styles.textInputContainer}>
            <TextInput
              ref={inputRef}
              value={inputText}
              style={styles.textInput}
              onChangeText={(text) => setInputText(text)}
              cursorColor={bg.purple_400}
              maxLength={1000}
              multiline={true}
              textAlignVertical="top"></TextInput>
            <View style={styles.lengthHint}>
              {inputText.length > 0 && (
                <Text style={styles.hintText}>{getTextLength()}/1000</Text>
              )}
            </View>
          </View>
        </View>
        <View style={styles.bottomContainer}>
          <View style={[styles.rowBetween, styles.fullWidth]}>
            <Text style={[styles.clueText, { color: text.green_500 }]}>
              {langLabels[langs.to]}
            </Text>
            <View style={[styles.row]}>
              <IconBtn
                style={styles.iconBtn}
                onPress={() => copyTextToClipboard(true)}>
                <Feather name="copy" size={24} color={text.green_500} />
              </IconBtn>
              <IconBtn style={styles.iconBtn}>
                <AntDesign name="sound" size={24} color={text.green_500} />
              </IconBtn>
              <IconBtn style={styles.iconBtn}>
                <Entypo name="share" size={24} color={text.green_500} />
              </IconBtn>
            </View>
          </View>
          <ScrollView style={[styles.fullWidth]}>
            {isLoading && <LoadingSkeleton></LoadingSkeleton>}
            {/* <Text style={styles.textOutput}>Translations</Text> */}
          </ScrollView>
          <ToolsBar />
        </View>
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
    position: "relative",
    alignItems: "center",
    width: "100%",
    height: "60%",
    paddingTop: 20,
    paddingHorizontal: 20,
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
  textOutput: {
    fontSize: 24,
    color: text.green_500,
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
  },
  fullWidth: {
    width: "100%",
  },
});
