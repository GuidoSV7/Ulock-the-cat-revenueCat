import { Stack } from "expo-router";
import { useEffect } from "react";
import { getCustomerInfo, initializeRevenueCat } from "../config/revenuecat";

export default function RootLayout() {
  useEffect(() => {
    initializeApp();
  }, []);

  async function initializeApp() {
    // Inicializar RevenueCat
    const revenueCatInitialized = await initializeRevenueCat();
    
    if (revenueCatInitialized) {
      // Obtener información del cliente
      await getCustomerInfo();
    }
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
