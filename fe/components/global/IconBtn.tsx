import { IconButton } from "react-native-paper";
import { GestureHandlerEvent } from "react-native-reanimated/lib/typescript/reanimated2/hook";

interface IconBtnProps {
  onPress?: (e: GestureHandlerEvent<any>) => void;
  children: React.ReactNode;
  [x: string]: any;
}

export default function IconBtn({onPress, children, ...rest} : IconBtnProps) {
  return (
    <IconButton icon={() => children}  onPress={onPress} {...rest} />
  )
} 