import { useEffect } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

const { width } = Dimensions.get('window')

export default function LoadingBar() {
  const translateX = useSharedValue(-width);

  useEffect(() => {
    translateX.value = withRepeat(withTiming(width, {
      duration: 2000,
      easing: Easing.ease,
    }), -1)
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value}]
    }
  })

  return (<View style={styles.container}>
    <View style={styles.loadingBar}>
      <Animated.View style={[styles.hightLight, animatedStyle]}></Animated.View>
    </View>
  </View>)
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingBar: {
    width: width,
    height: 2,
    backgroundColor: '#ccc',
    overflow: 'hidden',
  },
  hightLight: {
    width: '30%',
    height: '100%',
    backgroundColor: 'rgba(102, 188, 204, 1)',
    opacity: 0.5,
    borderRadius: 10,
  }
})