import { Stack } from 'expo-router/stack';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from "react-native-paper";
import "../global.css";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from "expo-router";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // 立即显示应用
  SplashScreen.hideAsync();

  return (
    <PaperProvider>
      <RootLayoutNav />
      <StatusBar style="auto" />
    </PaperProvider>
  );
}

function RootLayoutNav() {
  return <Stack screenOptions={{
    headerShown: false
  }}>
  </Stack>;
}
