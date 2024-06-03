import { bg, text } from "@/styles/colors";
import { StyleSheet } from "react-native";
import { Divider, List } from "react-native-paper";

interface LangOptionProps {
  isSelected?: boolean;
  onPress?: () => void;
  title: string;
  isLast?: boolean;
}

const dividerTheme = {
  colors: {
    outlineVariant: bg.gray_200,
  },
};

function CheckIcon() {
  return <List.Icon icon="check" color={text.green_500} />;
}

export default function LangOption({ isSelected = false, isLast = false, onPress, title }: LangOptionProps) {
  return (
    <>
      <List.Item
        title={title}
        right={() => {
          return isSelected ? <CheckIcon /> : null;
        }}
        onPress={() => onPress && onPress()}
        titleStyle={[
          styles.title,
          isSelected ? { color: text.green_500 } : {},
        ]}></List.Item>
      { !isLast && <Divider
        theme={dividerTheme}
        style={styles.divider}
        horizontalInset={true}
      />}
    </>
  );
}

const styles = StyleSheet.create({
  divider: {
    height: 1.2,
    width: "90%",
  },
  title: {
    color: text.gray_950,
    fontWeight: "600",
    fontSize: 17,
  },
});
