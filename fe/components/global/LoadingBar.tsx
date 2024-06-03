import { radiusXs } from "@/styles/base";
import { bg } from "@/styles/colors";
import { useEffect } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

const DEFAULT_WIDTH = Dimensions.get("window").width - 100;
const DEFAULT_HEIGHT = 25;
const DEFAULT_TRACK_COLOR = bg.gray_200;
const DEFAULT_HIGHLIGHT_COLOR = bg.green_100;
const DEFAULT_RADIUS = radiusXs;
const ANIMATION_DURATION = 1000;

interface LoadingBarProps {
  width?: number;
  height?: number;
  trackColor?: string;
  highlightColor?: string;
  borderRadius?: number;
}


export default function LoadingBar({
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  trackColor = DEFAULT_TRACK_COLOR,
  highlightColor = DEFAULT_HIGHLIGHT_COLOR,
  borderRadius = DEFAULT_RADIUS,
}: LoadingBarProps) {
  const highlightWidthStart = width * 0.3;
  const highlightWidthEnd = width * 0.6;
  const translateX = useSharedValue(-highlightWidthStart);

  useEffect(() => {
    translateX.value = withRepeat(
      withTiming(width, {
        duration: ANIMATION_DURATION,
        easing: Easing.ease,
      }),
      -1
    );
  }, [width]);

  const highlightWidth = useDerivedValue(() => {
    const progress = translateX.value / width;
    const midPoint = 0.45;
    if (progress < midPoint) {
        return highlightWidthStart + (highlightWidthEnd - highlightWidthStart) * (progress / midPoint);
    } else {
      return highlightWidthEnd - (highlightWidthEnd - highlightWidthStart) * ((progress - midPoint) / midPoint);
    }
  })

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
      width: highlightWidth.value,
    };
  });

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.loadingBar,
          {
            width,
            height,
            backgroundColor: trackColor,
            borderRadius,
          },
        ]}>
        <Animated.View
          style={[
            styles.hightLight,
            {
              width: highlightWidth,
              backgroundColor: highlightColor,
              borderRadius,
            },
            animatedStyle,
          ]}></Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingBar: {
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
    backgroundColor: DEFAULT_TRACK_COLOR,
    borderRadius: DEFAULT_RADIUS,
    overflow: "hidden",
  },
  hightLight: {
    height: "100%",
    backgroundColor: DEFAULT_HIGHLIGHT_COLOR,
    borderRadius: DEFAULT_RADIUS,
  },
});
