import { useSelectedImageStore } from '@/stores/selectedImage';
import { Text, View } from 'react-native';

export default function CameraView() {
  const imgUrl = useSelectedImageStore((state) => state.imgUrl);


  return (
    <View>
      
      <Text>Camera</Text>
      <Text>{ imgUrl }</Text>
    </View>
  )
}