import IconBtn from "@/components/global/IconBtn";
import { bg, text } from "@/styles/colors";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const voiceBtnAnimationDuration = 500;

const AnimatedIconBtn = Animated.createAnimatedComponent(IconBtn);

export default function ToolsBar() {
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isVoiceBack, setIsVoiceBack] = useState(true);
  const [cameraX, setCameraX] = useState(0);
  const [voiceX, setVoiceX] = useState(0);
  const voiceBtnSize = useSharedValue<number>(52);
  const voiceBtnPosition = useSharedValue<number>(0);
  const voiceBtnColor = useSharedValue<number>(0);
  const cameraBtnRef = useRef<React.ElementRef<typeof IconBtn>>(null);
  const voiceBtnRef = useRef<React.ElementRef<typeof IconBtn>>(null);

  const transX = cameraX - voiceX;

  useEffect(() => {
    if (cameraBtnRef.current && voiceBtnRef.current) {
      // @ts-ignore
      cameraBtnRef.current.measure((_x, _y, width, height, pageX, pageY) => {
        setCameraX(pageX + width / 2);
      });

      // @ts-ignore
      voiceBtnRef.current.measure((_x, _y, width, height, pageX, pageY) => {
        setVoiceX(pageX + width / 2);
      });
    }
  }, [cameraBtnRef, voiceBtnRef]);

  function handleVoicePress() {
    setIsVoiceActive((prev) => !prev);
  }

  // 监听声音按钮是否被点击，应用动画
  useEffect(() => {
    if (isVoiceActive) {
      // 改变按钮大小
      voiceBtnSize.value = withTiming(84, {
        duration: voiceBtnAnimationDuration,
        easing: Easing.back(1.3),
      });

      voiceBtnPosition.value = withTiming(transX, {
        duration: voiceBtnAnimationDuration,
        easing: Easing.back(1.3),
      });

      // 改变按钮颜色
      voiceBtnColor.value = withTiming(1, {
        duration: voiceBtnAnimationDuration,
        easing: Easing.linear,
      })

      setIsVoiceBack(false);
    } else {
      voiceBtnSize.value = withTiming(52, {
        duration: voiceBtnAnimationDuration,
        easing: Easing.back(1.3),
      });

      voiceBtnPosition.value = withTiming(0, {
        duration: voiceBtnAnimationDuration,
        easing: Easing.back(1.3),
      });

      voiceBtnColor.value = withTiming(0, {
        duration: voiceBtnAnimationDuration,
        easing: Easing.linear,
      })

      if (!isVoiceBack) {
        setTimeout(() => {
          setIsVoiceBack(true);
        }, voiceBtnAnimationDuration);
      }
    }
  }, [isVoiceActive, voiceBtnSize, voiceBtnPosition]);

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      voiceBtnColor.value,
      [0, 1],
      [bg.purple_500, bg.red_600],
    )

    return {
      width: voiceBtnSize.value,
      height: voiceBtnSize.value,
      borderRadius: voiceBtnSize.value / 2,
      transform: [{ translateX: voiceBtnPosition.value }],
      backgroundColor,
    };
  });

  const hideStyle = {
    opacity: isVoiceActive ? 0 : isVoiceBack ? 1 : 0,
  };

  return (
    <View style={styles.container}>
      <IconBtn
        mode="contained"
        containerColor={bg.purple_500}
        onPress={() => console.log("Button Pressed!")}
        size={34}
        style={[hideStyle]}>
        <FontAwesome6 name="image" size={24} color={text.white} />
      </IconBtn>
      <IconBtn
        ref={cameraBtnRef}
        mode="contained"
        containerColor={bg.purple_500}
        onPress={() => console.log("Button Pressed!")}
        size={68}
        style={[hideStyle]}>
        <FontAwesome name="camera" size={24} color={text.white} />
      </IconBtn>
      <AnimatedIconBtn
        ref={voiceBtnRef}
        mode="contained"
        onPress={() => handleVoicePress()}
        style={[animatedStyle, {backgroundColor: bg.purple_500}]}>
        <FontAwesome6 name="microphone" size={24} color={text.white} />
      </AnimatedIconBtn>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 50,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    width: "100%",
  },
});
