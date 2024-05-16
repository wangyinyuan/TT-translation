import { StyleSheet, View, ViewStyle } from "react-native";

interface DropBarProps {
  color?: string;
  style?: ViewStyle;
}

export default function DropBar({color, style}: DropBarProps) {
  const backgroundColor = color || '#D3D9EB';

  return <View style={[styles.dropBar, {
    backgroundColor, 
  }, style]}></View>
}

const styles = StyleSheet.create({
  dropBar: {
    backgroundColor: '#D3D9EB',
    width: 80,
    height: 7,
    borderRadius: 30,
    position: 'absolute',
    top: -15,
    left: '50%',
    transform: [{translateX: -40}]
  }
})