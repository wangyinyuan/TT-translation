import { forwardRef } from "react";
import { IconButton } from "react-native-paper";
import { GestureHandlerEvent } from "react-native-reanimated/lib/typescript/reanimated2/hook";

interface IconBtnProps {
  onPress?: (e: GestureHandlerEvent<any>) => void;
  children: React.ReactNode;
  size?: number;
  [x: string]: any;
}

export default forwardRef(function IconBtn({
  onPress,
  children,
  size,
  ...rest
}: IconBtnProps, ref: any) {
  return <IconButton ref={ref} size={size} icon={() => children} onPress={onPress} {...rest} />;
});
