import { AntDesign } from '@expo/vector-icons';
import React, { useState } from 'react';
import { LayoutChangeEvent, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const MAX_HEIGHT = 150; // 最大高度

const ExpandableCard = ({ children }: any) => {
  const [expanded, setExpanded] = useState(false);
  const contentHeight = useSharedValue(MAX_HEIGHT);
  const actualHeight = useSharedValue(0);
  const [measured, setMeasured] = useState(false);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: withTiming(contentHeight.value, { duration: 300 }),
    };
  });

  const toggleExpand = () => {
    setExpanded(!expanded);
    contentHeight.value = expanded ? MAX_HEIGHT : actualHeight.value;
  };

  const onLayout = (event: LayoutChangeEvent) => {
    if (!measured) {
      actualHeight.value = event.nativeEvent.layout.height;
      setMeasured(true);
      contentHeight.value = Math.min(MAX_HEIGHT, event.nativeEvent.layout.height);
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.card, animatedStyle]}>
        <View style={styles.hiddenContainer}>
          <View onLayout={onLayout} style={styles.absoluteContainer}>
            {children}
          </View>
        </View>
        {measured && <View>{children}</View>}
      </Animated.View>
      <TouchableOpacity onPress={toggleExpand} style={styles.iconContainer}>
        <AntDesign name={expanded ? 'up' : 'down'} size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    overflow: 'hidden',
  },
  hiddenContainer: {
    position: 'absolute',
    width: '100%',
    zIndex: -1,
    opacity: 0,
  },
  absoluteContainer: {
    position: 'absolute',
    width: '100%',
  },
  iconContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
});

export default ExpandableCard;
