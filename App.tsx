import { StatusBar } from "expo-status-bar";
import Navigation from "./src/navigation";
import { useFonts } from "expo-font";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { fonts } from "./src/theme/fonts";
import { ActivityIndicator } from "react-native";

export default function App() {
  // Change fonts format to otf for android support
  const [fontsLoaded] = useFonts({
    [fonts.regular]:
      "https://fonts.cdnfonts.com/s/15011/CircularStd-Medium.otf",
    [fonts.bold]: "https://fonts.cdnfonts.com/s/15011/CircularStd-Bold.otf",
  });
  if (!fontsLoaded)
    return (
      <ActivityIndicator
        size="large"
        style={{ justifyContent: "center", flex: 1 }}
      />
    );
  return (
    <SafeAreaProvider>
      <Navigation />
      <StatusBar />
    </SafeAreaProvider>
  );
}
