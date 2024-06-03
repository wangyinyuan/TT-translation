import { getTranslation } from "@/apis/translate/getTranslation";
import { ocrRequest } from "@/apis/translate/ocrRequest";
import HeaderContainer from "@/components/global/HeaderContainer";
import IconBtn from "@/components/global/IconBtn";
import LangPicker from "@/components/global/LangPicker";
import ScanningBar from "@/components/translate/ScanningBar/ScanningBar";
import { toastConfig } from "@/constants/toastConfig";
import { useCurLangsStore } from "@/stores/curLangsStore";
import { useSelectedImageStore } from "@/stores/selectedImage";
import { radiusBase } from "@/styles/base";
import { bg, text as tColor } from "@/styles/colors";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Toast from "react-native-root-toast";

const { height, width } = Dimensions.get("window");
const bottomContainerHeight = 240;
const innerContainerHeight = bottomContainerHeight / 1.8;
const heightAnimationDuration = 300;

const placeHolderImg = `https://placehold.co/${Math.ceil(width + 10)}x${(
  height - 60
).toFixed(0)}/2A2D37/FFFFFF/svg?text=No+Hurry...`;

export default function CameraView() {
  const imgUrl = useSelectedImageStore((state) => state.imgUrl);
  const langs = useCurLangsStore((state) => state.langs);
  const [isLoading, setIsLoading] = useState(true);
  const [ocrText, setOcrText] = useState("");
  const [transText, setTransText] = useState("");
  const bottomHeight = useSharedValue(0);
  const innerHeight = useSharedValue(0);

  const recognizeTextFromImage = async () => {
    try {
      let ocrText = "";
      const formData = createFormData(imgUrl);
      const res = await ocrRequest({ file: formData });
      res.ParsedResults.forEach((result: any) => {
        ocrText += result.ParsedText;
      });
      setOcrText(ocrText);
    } catch (err) {
      Toast.show("OCR 识别出错", toastConfig.error);
    }
  };


  const animatedBottomStyle = useAnimatedStyle(() => {
    return {
      height: withTiming(bottomHeight.value, {
        duration: heightAnimationDuration,
        easing: Easing.ease,
      }),
    };
  });

  const animatedInnerStyle = useAnimatedStyle(() => {
    return {
      height: withTiming(innerHeight.value, {
        duration: heightAnimationDuration,
        easing: Easing.ease,
      }),
    };
  });

  const createFormData = (uri: string) => {
    const formData = new FormData();
    const filename = uri.split("/").pop() || "image";
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : "image";

    formData.append("file", {
      uri,
      name: filename,
      type,
    } as any);

    return formData;
  };

  async function setTranslation() {
    const res = await getTranslation({
      text: ocrText,
      from: langs.from,
      to: langs.to,
    })
    setTransText(res.translation);
    setIsLoading(false);
  }

  // 翻译文本
  useEffect(() => {
    if (!ocrText) return;
    setTranslation();
  }, [ocrText])

  // 当选择语言的时候，重新翻译
  useEffect(() => {
    setIsLoading(true);
    if (ocrText) {
      setTranslation();
    }
  }, [langs.from, langs.to])

  const showBottomContainer = () => {
    bottomHeight.value = bottomContainerHeight;
    innerHeight.value = innerContainerHeight;
  };

  const hideBottomContainer = () => {
    bottomHeight.value = 0;
    innerHeight.value = 0;
  }

  useEffect(() => {
    if (!isLoading) {
      showBottomContainer();
    } else {
      hideBottomContainer();
    }
  }, [isLoading]);

  useEffect(() => {
    if (imgUrl) {
      recognizeTextFromImage();
    }
  }, [imgUrl]);

  return (
    <View className="flex h-full" style={{ justifyContent: "flex-end" }}>
      <StatusBar style="light" />
      <HeaderContainer bgColor={bg.black_700}>
        <View className="flex flex-row items-center max-h-20 justify-between w-full">
          <IconBtn onPress={() => router.back()}>
            <MaterialIcons name="arrow-back-ios" size={24} color="white" />
          </IconBtn>
          <LangPicker />
          <IconBtn>
            <MaterialIcons
              name="arrow-back-ios"
              size={24}
              color="transparent"
            />
          </IconBtn>
        </View>
      </HeaderContainer>
      <View style={[styles.bodyContainer]}>
        {isLoading && <ScanningBar />}
        <Image
          source={imgUrl}
          style={styles.img}
          placeholder={placeHolderImg}></Image>
        <Animated.View
          style={[styles.bottomFirstContainer, animatedBottomStyle]}>
          <View style={styles.bottomLayoutContainer}>
            <ScrollView
              style={styles.scrollViewStyle}
              showsVerticalScrollIndicator={false}>
              <Text style={[styles.textBase]}>{ocrText}</Text>
            </ScrollView>
            <IconBtn>
              <MaterialIcons
                name="volume-up"
                size={24}
                color={tColor.gray_800}
              />
            </IconBtn>
          </View>
          <Animated.View style={[styles.innerContainer, animatedInnerStyle]}>
            <View style={styles.bottomLayoutContainer}>
              <ScrollView
                style={styles.scrollViewStyle}
                showsVerticalScrollIndicator={false}>
                <Text style={[styles.textBase, { color: tColor.white }]}>
                  {transText}
                </Text>
              </ScrollView>
              <IconBtn>
                <FontAwesome
                  name="long-arrow-right"
                  size={24}
                  color={tColor.white}
                />
              </IconBtn>
            </View>
          </Animated.View>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bodyContainer: {
    position: "relative",
    height: height - 80,
    width: "100%",
    backgroundColor: bg.page,
    borderTopLeftRadius: radiusBase,
    borderTopRightRadius: radiusBase,
  },
  img: {
    width: "100%",
    height: "100%",
    borderTopLeftRadius: radiusBase,
    borderTopRightRadius: radiusBase,
  },
  bottomFirstContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: bottomContainerHeight,
    borderTopLeftRadius: radiusBase,
    borderTopRightRadius: radiusBase,
    backgroundColor: bg.white,
  },
  innerContainer: {
    height: innerContainerHeight,
    width: "100%",
    backgroundColor: bg.purple_500,
    borderTopLeftRadius: radiusBase,
    borderTopRightRadius: radiusBase,
  },
  scrollViewStyle: {
    height: "100%",
    paddingRight: 0,
    paddingLeft: 25,
  },
  bottomLayoutContainer: {
    flex: 1,
    width: "100%",
    flexDirection: "row",
    borderTopRightRadius: radiusBase,
    borderTopLeftRadius: radiusBase,
    paddingVertical: 20,
  },
  textBase: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
