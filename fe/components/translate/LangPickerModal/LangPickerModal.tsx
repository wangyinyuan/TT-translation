import DropBar from "@/components/global/DropBar";
import { langLabels, langOptions } from "@/constants/langs";
import { radiusBase, radiusSm } from "@/styles/base";
import { bg, text } from "@/styles/colors";
import { LangsChoice, LangsValue } from "@/types/translate/lang";
import { useEffect, useRef, useState } from "react";
import {
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import Modal from "react-native-modal";
import { List, Searchbar } from "react-native-paper";
import LangOption from "./LangOption";

interface LangPickerModalProps {
  [key: string]: any;
  onLangChange?: (lang: LangsChoice) => void;
  recentLangs?: LangsValue[];
}

const searchBarTheme = {
  colors: {
    onSurface: text.gray_600,
    elevation: {
      level3: "#fff",
    },
    onSurfaceVariant: text.gray_500,
  },
};

export default function LangPickerModal({
  onLangChange,
  recentLangs,
  ...props
}: LangPickerModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [scrollOffset, setScrollOffset] = useState(0);
  const [scrollOffsetMax, setScrollOffsetMax] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);
  const scrollViewRef = useRef<ScrollView | null>(null);

  const allLangOptions = () => {
    const last = langOptions.length - 1;
    return langOptions.map((lang: LangsValue, index: number) => {
      return (
        <LangOption
          key={lang}
          isLast={index === last ? true : false}
          title={langLabels[lang]}
          onPress={() => handleLangChange(lang)}
        />
      );
    });
  };

  const recLangOptions = () => {
    if (!recentLangs) return null;
    const last = recentLangs?.length - 1;
    return recentLangs?.map((lang: LangsValue, index: number) => {
      return (
        <LangOption
          key={lang}
          isLast={index === last ? true : false}
          title={langLabels[lang]}
          onPress={() => handleLangChange(lang)}
        />
      );
    });
  };

  function handleSearch(query: string) {
    setSearchQuery(query);
  }

  // 处理滚动逻辑
  function handleOnScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
    setScrollOffset(e.nativeEvent.contentOffset.y);
  }

  function handleScrollTo(p: any) {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        ...p,
        animated: true,
      });
    }
  }

  function handleContentSizeChange(_width: number, height: number) {
    setContentHeight(height);
  }

  function handleLayout(e: LayoutChangeEvent) {
    const { height } = e.nativeEvent.layout;
    setScrollViewHeight(height);
  }

  function handleLangChange(lang: LangsValue | "auto") {
    console.log("语言变成", lang);
  }

  useEffect(() => {
    setScrollOffsetMax(contentHeight - scrollViewHeight);
  }, [contentHeight, scrollViewHeight]);

  return (
    <Modal
      {...props}
      backdropOpacity={0.3}
      className="flex-1 w-full"
      style={styles.modal}
      swipeDirection={["down"]}
      propagateSwipe={true}
      onSwipeComplete={props.onSwipeComplete}
      scrollTo={handleScrollTo}
      scrollOffset={scrollOffset}
      scrollOffsetMax={scrollOffsetMax}>
      <View
        className="h-3/5 absolute bottom-0 w-full"
        style={[styles.radius, styles.container]}>
        <DropBar />
        <ScrollView
          ref={scrollViewRef}
          onScroll={handleOnScroll}
          scrollEventThrottle={16}
          className="w-full flex-1"
          style={styles.radius}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={handleContentSizeChange}
          onLayout={handleLayout}>
          <Searchbar
            placeholder="选择语言"
            value={searchQuery}
            onChangeText={handleSearch}
            theme={searchBarTheme}
            inputStyle={styles.input}
          />
          <List.Section>
            <List.Subheader style={styles.subHeader}>
              Recent languages
            </List.Subheader>
            <View style={styles.langOptionsContainer}>{recLangOptions()}</View>
          </List.Section>
          <List.Section>
            <List.Subheader style={styles.subHeader}>
              All languages
            </List.Subheader>
            <View style={styles.langOptionsContainer}>{allLangOptions()}</View>
          </List.Section>
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
    paddingVertical: 20,
  },
  radius: {
    borderTopLeftRadius: radiusBase,
    borderTopRightRadius: radiusBase,
  },
  contentContainer: {
    paddingHorizontal: 20,
  },
  input: {
    color: text.gray_950,
  },
  langOptionsContainer: {
    flexWrap: "wrap",
    backgroundColor: bg.white,
    borderRadius: radiusSm,
    width: "100%",
    height: "auto",
  },
  subHeader: {
    color: text.gray_950,
    fontWeight: "bold",
    fontSize: 24,
    marginTop: 22,
    paddingLeft: 0,
    paddingBottom: 15,
  },
});
