import { bg } from '@/styles/colors';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    zIndex: -1,
  }
})

export default function HeaderContainer({ children, bgColor }: { children?: React.ReactNode; bgColor?: string}) {
  const insets = useSafeAreaInsets();

  const dynamicStyles = {
    backgroundColor: bgColor || bg.purple_500,
    paddingTop: insets.top,
  }

  return <View className='w-full h-52 px-4 flex-row' style={[dynamicStyles, styles.container]}>
    {children}
  </View>
}