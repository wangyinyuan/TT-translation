import { radiusSm } from "@/styles/base";
import { useEffect } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

const DEFAULT_WIDTH = Dimensions.get("window").width - 100;
const DEFAULT_HEIGHT = 30;
const DEFAULT_TRACK_COLOR = "#ccc";
const DEFAULT_HIGHLIGHT_COLOR = "rgba(102, 188, 204, 1)";

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
  trackColor = DEFAULT_HIGHLIGHT_COLOR,
  highlightColor = DEFAULT_HIGHLIGHT_COLOR,
  borderRadius = radiusSm,
}: LoadingBarProps) {
  const translateX = useSharedValue(-width);

  useEffect(() => {
    translateX.value = withRepeat(
      withTiming(width, {
        duration: 2000,
        easing: Easing.ease,
      }),
      -1
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
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
    borderRadius: radiusSm,
    overflow: "hidden",
  },
  hightLight: {
    width: "30%",
    height: "100%",
    backgroundColor: DEFAULT_HIGHLIGHT_COLOR,
    opacity: 0.5,
    borderRadius: radiusSm,
  },
});
