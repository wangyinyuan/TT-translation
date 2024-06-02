import { Dimensions, StyleSheet, View } from 'react-native';
import LoadingBar from './LoadingBar';

const { width } = Dimensions.get('window');

export default function LoadingSkeleton() {
  const smBarWidth = width * 0.5;

  return (
    <View style={styles.container}>
      <LoadingBar />
      <LoadingBar />
      <LoadingBar width={smBarWidth}/>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    gap: 10,
    alignItems: 'flex-start',
    paddingHorizontal: 20,
  }
})