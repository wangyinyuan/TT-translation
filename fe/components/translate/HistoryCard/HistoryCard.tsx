import IconBtn from "@/components/global/IconBtn";
import { radiusBaseSm } from "@/styles/base";
import { bg, text as tColor } from "@/styles/colors";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { LayoutChangeEvent, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

// 卡片默认高度
const DEFAULT_HEIGHT = 125;

interface HistoryCardProps {
  from?: string;
  to?: string;
  text?: string;
  translatedText?: string;
  soundUrl?: string;
}

export default function HistoryCard({
  from,
  to,
  text,
  translatedText,
  soundUrl,
}: HistoryCardProps) {
  const cardHeight = useSharedValue(DEFAULT_HEIGHT);
  const [actualHeight, setActualHeight] = useState(0);
  const [expanded, setExpanded] = useState(false);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: withTiming(cardHeight.value, { duration: 300 }),
    };
  });

  function onLayout(event: LayoutChangeEvent) {
    setActualHeight(event.nativeEvent.layout.height);
  }


  function handleToggle() {
    setExpanded(!expanded);
    cardHeight.value = expanded ? DEFAULT_HEIGHT : actualHeight;
  }

  return (
    <View>
      <Animated.View style={[styles.card, animatedStyle]}>
        <View style={styles.headerContainer}>
          <Text style={styles.langText}>
            {from} -{">"} {to}
          </Text>
          <IconBtn style={styles.btn}>
            <MaterialIcons name="volume-up" size={24} color={tColor.gray_800} />
          </IconBtn>
        </View>
        <View
          style={{
            position: "relative",
            flex: 1,
            overflow: "hidden",
          }}>
          <View style={styles.contentContainer} onLayout={onLayout}>
            <Text style={[styles.transText, { color: tColor.gray_500 }]}>
              {text}
            </Text>
            <Text style={[styles.transText, { color: tColor.gray_950 }]}>
              {translatedText}
            </Text>
          </View>
        </View>
      </Animated.View>
      {actualHeight > DEFAULT_HEIGHT && (
        <View style={styles.toggleButtonContainer}>
          <IconBtn style={[styles.btn]} onPress={handleToggle}>
            <AntDesign
              name={expanded ? "up" : "down"}
              size={24}
              color="black"
            />
          </IconBtn>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    height: DEFAULT_HEIGHT,
    width: "100%",
    borderRadius: radiusBaseSm,
    backgroundColor: bg.white,
    paddingVertical: 10,
    paddingHorizontal: 20,
    overflow: "hidden",
    marginVertical: 10,
  },
  langText: {
    color: tColor.blue_500,
    fontWeight: "bold",
    fontSize: 20,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  btn: {
    margin: 0,
  },
  contentContainer: {
    position: "absolute",
    marginTop: 5,
    gap: 4,
    textAlign: "justify",
  },
  transText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  toggleButtonContainer: {
    alignItems: "center",
    marginTop: -8,
  },
});
