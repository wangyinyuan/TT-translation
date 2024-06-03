import { ocrRequest } from "@/apis/translate/ocrRequest";
import HeaderContainer from "@/components/global/HeaderContainer";
import IconBtn from "@/components/global/IconBtn";
import LangPicker from "@/components/global/LangPicker";
import ScanningBar from "@/components/translate/ScanningBar/ScanningBar";
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

const { height, width } = Dimensions.get("window");
const bottomContainerHeight = 240;
const innerContainerHeight = bottomContainerHeight / 1.8;

const placeHolderImg = `https://placehold.co/${Math.ceil(width + 10)}x${(
  height - 60
).toFixed(0)}/2A2D37/FFFFFF/svg?text=No+Hurry...`;

export default function CameraView() {
  const imgUrl = useSelectedImageStore((state) => state.imgUrl);
  const langs = useCurLangsStore((state) => state.langs);
  const [isLoading, setIsLoading] = useState(false);
  const [ocrText, setOcrText] = useState(
    "在这个实现中，LinearGradient 用于创建从左到右的渐变效果。Animated.View 用于实现从左到右的动画效果。translateX 控制扫描条的水平移动。这样就可以实现一个从左到右的扫描动画，带有渐变效果。"
  );
  const [transText, setTransText] = useState(
    "在这个实现中，LinearGradient 用于创建从左到右的渐变效果。Animated.View 用于实现从左到右的动画效果。translateX 控制扫描条的水平移动。这样就可以实现一个从左到右的扫描动画，带有渐变效果。"
  );

  const recognizeTextFromImage = async () => {
    try {
      const formData = createFormData(imgUrl);
      const res = await ocrRequest({ file: formData });
      console.log(res);
      res.ParsedResults.forEach((result: any) => {
        console.log(result.ParsedText);
      });
    } catch (err) {
      console.error("OCR 识别出错: ", err);
    }
  };

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

  useEffect(() => {
    // recognizeTextFromImage();
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
        <View style={[styles.bottomFirstContainer]}>
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
          <View style={[styles.innerContainer]}>
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
          </View>
        </View>
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
