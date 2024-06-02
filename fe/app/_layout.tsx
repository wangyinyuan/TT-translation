import { Stack } from "expo-router/stack";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { vars } from "nativewind";
import { View } from "react-native";
import { PaperProvider } from "react-native-paper";
import { RootSiblingParent } from "react-native-root-siblings";
import "../global.css";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from "expo-router";

const customTheme = vars({
  "--bg-purple-500": "#8980F0",
});

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // 立即显示应用
  SplashScreen.hideAsync();

  return (
    <PaperProvider>
      <RootSiblingParent>
        <View style={customTheme} className="h-full w-full">
          <RootLayoutNav />
        </View>
      </RootSiblingParent>
      <StatusBar style="light" />
    </PaperProvider>
  );
}

function RootLayoutNav() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="(translate)/index"></Stack.Screen>
      <Stack.Screen name="(translate)/history"></Stack.Screen>
      <Stack.Screen
        name="(translate)/camera"
        options={{
          animation: "slide_from_bottom",
        }}></Stack.Screen>
    </Stack>
  );
}
