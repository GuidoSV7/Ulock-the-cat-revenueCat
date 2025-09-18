import { Stack } from "expo-router";
import { useEffect } from "react";
import { Platform } from "react-native";
import Purchases from "react-native-purchases";

export default function RootLayout() {
  useEffect(() => {
    // Purchases.setLogLevel(LOG_LEVEL.VERBOSE);

    if (Platform.OS === "ios") {
      Purchases.configure({ apiKey: "appl_EcbMCqjZgXBWAzYBhshcaJHpjOa" });
    } else if (Platform.OS === "android") {
      Purchases.configure({ apiKey: "goog_SOhwxVOHyeCjxadVfIrITqTHMrd" });
    }

    // getCustomerInfo();
  }, []);

  async function getCustomerInfo() {
    const customerInfo = await Purchases.getCustomerInfo();

    console.log("📢 customerInfo", JSON.stringify(customerInfo, null, 2));
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
