import DropBar from "@/components/global/DropBar";
import { radiusBase } from "@/styles/base";
import { bg, text } from "@/styles/colors";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import Modal from "react-native-modal";
import { Searchbar } from "react-native-paper";

interface LangPickerModalProps {
  [key: string]: any;
}

const searchBarTheme = {
  colors: {
    onSurface: text.gray_600,
    elevation: {
      level3: '#fff',
    },
    onSurfaceVariant: text.gray_500,
  }
}

export default function LangPickerModal({ ...props }: LangPickerModalProps) {
  const [searchQuery, setSearchQuery] = useState('');

  function handleSearch(query: string) {
    setSearchQuery(query);
  }
  return (
    <Modal
      {...props}
      backdropOpacity={0.3}
      className="flex-1 w-full"
      style={styles.modal}
      swipeDirection={['down']}
      propagateSwipe={true}
      onSwipeComplete={props.onSwipeComplete}
      >
      <View className="h-3/5 absolute bottom-0 w-full" style={[styles.radius, styles.container]}>
        <DropBar />
        <ScrollView className="w-full flex-1" style={styles.radius} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
          <Searchbar placeholder="选择语言" value={searchQuery} onChangeText={handleSearch} theme={searchBarTheme} />
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    margin: 0,
  },
  container: {
    backgroundColor: bg.gray_100,
  },
  radius: {
    borderTopLeftRadius: radiusBase,
    borderTopRightRadius: radiusBase,
  },
  contentContainer: {
    padding: 20,
  }
});
