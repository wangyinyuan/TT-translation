import { useSelectedImageStore } from '@/stores/selectedImage';
import { useEffect } from 'react';
import { Text, View } from 'react-native';


export default function CameraView() {
  const imgUrl = useSelectedImageStore((state) => state.imgUrl);
  const tessOptions = {};

  const recognizeTextFromImage = async () => {
    try {
      const image = await fetch(imgUrl);
      const blob = await image.blob();
    } catch (err) {
      console.error("OCR 识别出错: ", err);
    }
  }

  useEffect(() => {
    recognizeTextFromImage();
  }, [imgUrl])
  

  return (
    <View>
      <Text>Camera</Text>
      <Text>{ imgUrl }</Text>
    </View>
  )
}