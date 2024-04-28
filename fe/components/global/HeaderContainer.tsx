import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HeaderContainer({ children }: { children?: React.ReactNode}) {
  const insets = useSafeAreaInsets();

  return <View className='w-full h-52 bg-[--bg-purple-500] px-8' style={{paddingTop: insets.top}}>
    {children}
  </View>
}