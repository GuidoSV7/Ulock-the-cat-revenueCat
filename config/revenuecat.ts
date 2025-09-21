import { Platform } from "react-native";
import Purchases, { LOG_LEVEL } from "react-native-purchases";

// Configuración de RevenueCat - Solo Android
export const REVENUECAT_CONFIG = {
  // API Key de Android
  android: "", // Tu API key de Android
  
  // Configuración de debug
  enableLogs: true,
  logLevel: LOG_LEVEL.VERBOSE,
  
  // Configuración de modo
  useSandbox: false, // false para usar ofertas reales de tu dashboard
};

// Función para inicializar RevenueCat - Solo Android
export async function initializeRevenueCat() {
  try {
    // Solo inicializar en Android
    if (Platform.OS !== "android") {
      console.log("ℹ️ RevenueCat solo está configurado para Android. Saltando inicialización en", Platform.OS);
      return false;
    }

    // Habilitar logs si está en modo debug
    if (REVENUECAT_CONFIG.enableLogs) {
      Purchases.setLogLevel(REVENUECAT_CONFIG.logLevel);
    }

    const apiKey = REVENUECAT_CONFIG.android;
    
    if (!apiKey) {
      console.error("❌ Android API key not configured in REVENUECAT_CONFIG");
      return false;
    }

    // Configurar RevenueCat con la API key de Android
    await Purchases.configure({ 
      apiKey,
      appUserID: undefined, // Dejar que RevenueCat genere un ID único
    });

    console.log("✅ RevenueCat initialized successfully for Android");
    console.log("🔑 Using Android API key:", apiKey.substring(0, 10) + "...");
    console.log("📱 Platform:", Platform.OS);
    
    return true;
  } catch (error) {
    console.error("❌ Error initializing RevenueCat:", error);
    return false;
  }
}

// Función para obtener información del cliente
export async function getCustomerInfo() {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    console.log("📢 Customer Info:", JSON.stringify(customerInfo, null, 2));
    return customerInfo;
  } catch (error) {
    console.error("❌ Error getting customer info:", error);
    throw error;
  }
}

// Función para obtener ofertas
export async function getOfferings() {
  try {
    const offerings = await Purchases.getOfferings();
    console.log("📢 Offerings:", JSON.stringify(offerings, null, 2));
    
    // Verificar si estamos en modo Preview
    if (offerings.current?.identifier === "preview-offering") {
      console.warn("⚠️ Running in Preview mode!");
      console.warn("⚠️ This means RevenueCat is not connecting to your real dashboard.");
      console.warn("⚠️ Check your Android API key and ensure your app is properly configured.");
    } else {
      console.log("✅ Using real offerings from your RevenueCat dashboard");
      console.log("📦 Current offering:", offerings.current?.identifier);
      console.log("📦 Available packages:", offerings.current?.availablePackages?.length || 0);
    }
    
    return offerings;
  } catch (error) {
    console.error("❌ Error getting offerings:", error);
    throw error;
  }
}

// Función para realizar una compra
export async function purchasePackage(pkg: any) {
  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    console.log("✅ Purchase successful:", customerInfo);
    return customerInfo;
  } catch (error) {
    console.error("❌ Purchase failed:", error);
    throw error;
  }
}

// Función para forzar la recarga de ofertas (útil para salir del modo Preview)
export async function refreshOfferings() {
  try {
    console.log("🔄 Refreshing offerings...");
    
    // Invalidar caché de ofertas
    await Purchases.invalidateCustomerInfoCache();
    
    // Obtener ofertas frescas
    const offerings = await Purchases.getOfferings();
    
    console.log("📢 Fresh Offerings:", JSON.stringify(offerings, null, 2));
    return offerings;
  } catch (error) {
    console.error("❌ Error refreshing offerings:", error);
    throw error;
  }
}
