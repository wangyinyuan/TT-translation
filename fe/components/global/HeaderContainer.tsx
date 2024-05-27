import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    zIndex: -1,
  }
})

export default function HeaderContainer({ children }: { children?: React.ReactNode}) {
  const insets = useSafeAreaInsets();

  return <View className='w-full h-52 bg-[--bg-purple-500] px-4 flex-row' style={[{paddingTop: insets.top}, styles.container]}>
    {children}
  </View>
}