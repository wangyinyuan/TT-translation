import { Divider, List } from "react-native-paper";

function CheckIcon() {
  return <List.Icon icon="check" />;
}

export default function LangOption() {
  return (
    <>
      <List.Item title="英语" right={CheckIcon} onPress={() => console.log("LangOption was Pressed!")}></List.Item>
      <Divider />
    </>
  );
}
