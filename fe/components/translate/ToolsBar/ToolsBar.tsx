import { speechTranslationReq } from "@/apis/translate/speechTranslation";
import IconBtn from "@/components/global/IconBtn";
import { useCurLangsStore } from "@/stores/curLangsStore";
import { useSelectedImageStore } from "@/stores/selectedImage";
import { bg, text } from "@/styles/colors";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import { Audio } from "expo-av";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
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

interface ToolsBarProps {
  setInputText: (text: string) => void;
  setOutputText: (text: string) => void;
  setIsLoading: (bool: boolean) => void;
  loadAudio: (base64: string, isInput: boolean) => void;
}

const AnimatedIconBtn = Animated.createAnimatedComponent(IconBtn);

export default function ToolsBar({setInputText, setOutputText, setIsLoading, loadAudio}: ToolsBarProps) {
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isVoiceBack, setIsVoiceBack] = useState(true);
  const [cameraX, setCameraX] = useState(0);
  const [voiceX, setVoiceX] = useState(0);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const voiceBtnSize = useSharedValue<number>(52);
  const voiceBtnPosition = useSharedValue<number>(0);
  const voiceBtnColor = useSharedValue<number>(0);
  const cameraBtnRef = useRef<React.ElementRef<typeof IconBtn>>(null);
  const voiceBtnRef = useRef<React.ElementRef<typeof IconBtn>>(null);
  const setImgUrl = useSelectedImageStore((state) => state.setImgUrl);
  const langs = useCurLangsStore((state) => state.langs);

  const transX = cameraX - voiceX;

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.2,
    });

    if (!result.canceled) {
      setImgUrl(result.assets[0].uri);
      router.push("/(translate)/camera");
    }
  };

  const openCameraAsync = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.2,
    });

    if (!result.canceled) {
      setImgUrl(result.assets[0].uri);
      router.push("/(translate)/camera");
    }
  };

  useEffect(() => {
    if (cameraBtnRef.current && voiceBtnRef.current) {
      // @ts-ignore
      cameraBtnRef.current.measure((...args) => {
        const pageX = args[4];
        const width = args[2];
        setCameraX(pageX + width / 2);
      });

      // @ts-ignore
      voiceBtnRef.current.measure((...args) => {
        const pageX = args[4];
        const width = args[2];
        setVoiceX(pageX + width / 2);
      });
    }
  }, [cameraBtnRef, voiceBtnRef]);

  async function startRecording() {
    try {
      const permission = await Audio.requestPermissionsAsync();

      if (permission.status === 'granted') {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        }); 
        const recording = new Audio.Recording();
        await recording.prepareToRecordAsync();
        await recording.startAsync(); 
        setRecording(recording);
      } else {
        console.log('Permission to access microphone denied');
      }
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    if (!recording) return;
    try {
      await recording.stopAndUnloadAsync();
    } catch (error) {
      
    }
    const uri = recording.getURI();
    setRecording(null);

    if (uri) {
      const formData = new FormData();
      // @ts-ignore
      formData.append('file', {
        uri,
        name: 'recording.wav',
        type: 'audio/wav'
      });

      // Send formData to server
      try {
        // 清空输入输出文本
        setInputText('');
        setOutputText('');
        setIsLoading(true);
        const res = await speechTranslationReq({
          file: formData,
          from: langs.from,
          to: langs.to,
        })
        setIsLoading(false);
        setInputText(res.recognition_result);
        setOutputText(res.translation_result);
        if (res.SourceSpeechResponse.audio) {
          await loadAudio(res.SourceSpeechResponse.audio, true);
        }
        if (res.TargetSpeechResponse.audio) {
          await loadAudio(res.TargetSpeechResponse.audio, false);
        }
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  }


  function handleVoicePress() {
    if (isVoiceActive) {
      // 关闭语音
      setIsVoiceActive(false);
      // 结束录音，发送请求
      stopRecording();

    } else {
      setIsVoiceActive(true);
      startRecording();
    }
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
      });

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
      });

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
      [bg.purple_500, bg.red_600]
    );

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
        onPress={() => pickImageAsync()}
        size={34}
        style={[hideStyle]}>
        <FontAwesome6 name="image" size={24} color={text.white} />
      </IconBtn>
      <IconBtn
        ref={cameraBtnRef}
        mode="contained"
        containerColor={bg.purple_500}
        onPress={() => openCameraAsync()}
        size={68}
        style={[hideStyle]}>
        <FontAwesome name="camera" size={24} color={text.white} />
      </IconBtn>
      <AnimatedIconBtn
        ref={voiceBtnRef}
        mode="contained"
        onPress={() => handleVoicePress()}
        style={[animatedStyle, { backgroundColor: bg.purple_500 }]}>
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
