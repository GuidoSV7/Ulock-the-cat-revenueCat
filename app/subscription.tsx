import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  PurchasesOfferings,
  PurchasesPackage,
} from "react-native-purchases";
import { getOfferings as getRevenueCatOfferings, purchasePackage, refreshOfferings } from "../config/revenuecat";

const SubscriptionPlan = ({
  title,
  price,
  period,
  features,
  isPopular,
  onPress,
}: {
  title: string;
  price: string;
  period: string;
  features: string[];
  isPopular?: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
    <View style={[styles.planCard, isPopular && styles.popularCard]}>
      {isPopular && (
        <View style={styles.popularBadge}>
          <Text style={styles.popularText}>MOST POPULAR</Text>
        </View>
      )}

      <Text style={styles.planTitle}>{title}</Text>
      <View style={styles.priceContainer}>
        <Text style={styles.price}>{price}</Text>
        <Text style={styles.period}>/{period}</Text>
      </View>

      <View style={styles.featuresContainer}>
        {features.map((feature, index) => (
          <View key={index} style={styles.featureRow}>
            <Ionicons name="checkmark-circle" size={20} color="#4ade80" />
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>

      <LinearGradient
        colors={isPopular ? ["#e94560", "#f27121"] : ["#4a5568", "#2d3748"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.selectButton}
      >
        <Text style={styles.selectButtonText}>Select Plan</Text>
      </LinearGradient>
    </View>
  </TouchableOpacity>
);

export default function SubscriptionScreen() {
  const [offerings, setOfferings] = useState<PurchasesOfferings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadOfferings();
  }, []);

  const handleSubscribe = async (pkg: PurchasesPackage) => {
    try {
      const customerInfo = await purchasePackage(pkg);
      if (
        typeof customerInfo.entitlements.active["Premium Cats"] !== "undefined"
      ) {
        router.push("/");
      }
    } catch (e) {
      console.log("📢 error", e);
    }
  };

  // Función para obtener todos los paquetes de todas las ofertas
  const getAllPackages = (offerings: PurchasesOfferings) => {
    const allPackages: PurchasesPackage[] = [];
    
    // Recorrer todas las ofertas disponibles
    Object.values(offerings.all).forEach(offering => {
      if (offering.availablePackages) {
        allPackages.push(...offering.availablePackages);
      }
    });
    
    return allPackages;
  };

  async function loadOfferings(forceRefresh = false) {
    try {
      setLoading(true);
      setError(null);
      
      // Usar refreshOfferings si se fuerza la actualización
      const offerings = forceRefresh 
        ? await refreshOfferings()
        : await getRevenueCatOfferings();
      
      // Usar las ofertas reales que vienen de RevenueCat
      setOfferings(offerings);
    } catch (error) {
      console.log("📢 Error getting offerings:", error);
      setError("Error loading subscription plans. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <LinearGradient
      colors={["#1a1a2e", "#16213e", "#0f3460"]}
      style={styles.container}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={28} color="white" />
          </TouchableOpacity>

          <Text style={styles.title}>Unlock Premium Cats</Text>
          <Text style={styles.subtitle}>
            Choose the perfect plan for your feline obsession
          </Text>
        </View>

        <View style={styles.benefitsContainer}>
          <Text style={styles.benefitsTitle}>What You&apos;ll Get:</Text>
          <View style={styles.benefitsList}>
            <View style={styles.benefitItem}>
              <Ionicons name="infinite" size={24} color="#4ade80" />
              <Text style={styles.benefitText}>Unlimited cat photos</Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="sparkles" size={24} color="#4ade80" />
              <Text style={styles.benefitText}>Daily exclusive cats</Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="heart" size={24} color="#4ade80" />
              <Text style={styles.benefitText}>Save your favorites</Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="ban" size={24} color="#4ade80" />
              <Text style={styles.benefitText}>No ads, ever</Text>
            </View>
          </View>
        </View>

        <View style={styles.plansContainer}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading subscription plans...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity onPress={loadOfferings} style={styles.retryButton}>
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : offerings && getAllPackages(offerings).length ? (
            <>
              {/* Mostrar si está en modo Preview */}
              {offerings.current?.identifier === "preview-offering" && (
                <View style={styles.previewWarning}>
                  <Text style={styles.previewWarningText}>
                    ⚠️ Modo Preview - Usando ofertas de prueba
                  </Text>
                  <TouchableOpacity onPress={() => loadOfferings(true)} style={styles.refreshButton}>
                    <Text style={styles.refreshButtonText}>Refresh Real Offers</Text>
                  </TouchableOpacity>
                </View>
              )}
              
              {getAllPackages(offerings).map((pkg, index) => (
                <SubscriptionPlan
                  key={`${pkg.offeringIdentifier}-${pkg.identifier}`}
                  title={`${pkg.offeringIdentifier.charAt(0).toUpperCase() + pkg.offeringIdentifier.slice(1)} Plan`}
                  price={pkg.product.priceString}
                  period={pkg.packageType.toLowerCase()}
                  features={[
                    "Unlock all cats",
                    "Remove blur effect",
                    "Monthly new cats",
                    "Basic support",
                  ]}
                  isPopular={pkg.offeringIdentifier === "standar"}
                  onPress={() => handleSubscribe(pkg)}
                />
              ))}
            </>
          ) : (
            <View style={styles.noPlansContainer}>
              <Text style={styles.noPlansText}>No subscription plans available</Text>
              <TouchableOpacity onPress={() => loadOfferings(true)} style={styles.refreshButton}>
                <Text style={styles.refreshButtonText}>Refresh Offers</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Cancel anytime • Secure payment • Instant access
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.7)",
  },
  benefitsContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  benefitsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginBottom: 15,
  },
  benefitsList: {
    gap: 12,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  benefitText: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
  },
  plansContainer: {
    paddingHorizontal: 20,
    gap: 20,
    paddingBottom: 20,
  },
  planCard: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  popularCard: {
    borderColor: "#e94560",
    borderWidth: 2,
    transform: [{ scale: 1.02 }],
  },
  popularBadge: {
    position: "absolute",
    top: -12,
    alignSelf: "center",
    backgroundColor: "#e94560",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  popularText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  planTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 20,
  },
  price: {
    fontSize: 36,
    fontWeight: "bold",
    color: "white",
  },
  period: {
    fontSize: 18,
    color: "rgba(255, 255, 255, 0.7)",
    marginLeft: 5,
  },
  featuresContainer: {
    gap: 10,
    marginBottom: 20,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  featureText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    flex: 1,
  },
  selectButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  selectButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  footer: {
    paddingVertical: 30,
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.5)",
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.7)",
  },
  errorContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  errorText: {
    fontSize: 16,
    color: "#e94560",
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#e94560",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  noPlansContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  noPlansText: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.7)",
  },
  previewWarning: {
    backgroundColor: "rgba(255, 193, 7, 0.1)",
    borderColor: "#ffc107",
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    alignItems: "center",
  },
  previewWarningText: {
    color: "#ffc107",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  refreshButton: {
    backgroundColor: "#ffc107",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  refreshButtonText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "bold",
  },
});
