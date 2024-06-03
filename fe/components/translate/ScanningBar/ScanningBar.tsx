import { radiusXs } from "@/styles/base";
import { bg } from "@/styles/colors";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect } from "react";
import { Dimensions, StyleSheet } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

const { width: screenWidth } = Dimensions.get("window");

const ScanningBar = () => {
  const translateX = useSharedValue(0);

  useEffect(() => {
    translateX.value = withRepeat(
      withTiming(screenWidth, {
        duration: 1500,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, [translateX]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <Animated.View style={[styles.scanningBar, animatedStyle]}>
      <LinearGradient
        style={styles.gradient}
        colors={['transparent', bg.purple_400, 'transparent']}
        locations={[0, 0.5, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}></LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  scanningBar: {
    position: "absolute",
    left: 0,
    top: 0,
    zIndex: 10,
    width: 20,
    height: "100%",
    borderRadius: radiusXs,
    elevation: 20,
    shadowColor: "white",
  },
  gradient: {
    width: "100%",
    height: "100%",
    borderRadius: radiusXs,
  },
});

export default ScanningBar;
