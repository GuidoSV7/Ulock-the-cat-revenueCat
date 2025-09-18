# 🐱 Unlock the Cat

A React Native app built with [Expo](https://expo.dev) that demonstrates monetization using [RevenueCat](https://www.revenuecat.com). Users can subscribe to unlock premium cat photos!

[![Video Walkthrough](https://img.youtube.com/vi/R3fLKC-2Qh0/maxresdefault.jpg)](https://youtu.be/R3fLKC-2Qh0)

## 🎯 Overview

Unlock the Cat is a simple yet complete example of implementing in-app purchases in a React Native/Expo environment. The app displays blurred cat images that users can unlock by subscribing to a premium plan through RevenueCat's subscription management system.

### Key Features

- 🖼️ Cat images fetched from the Cataas API
- 🔒 Paywall implementation with blurred content for free users
- 💳 Subscription management via RevenueCat
- 📱 Cross-platform support (iOS & Android)
- 🎨 Beautiful UI with gradients and blur effects
- 🧪 Debug mode for testing subscription states

## 🎨 App Icon

The app icon was generated using [SnapAI](https://github.com/betomoedano/snapai) - an AI-powered icon generator.

## 🛠️ Technology Stack

- **Runtime**: [Bun](https://bun.sh) - Fast all-in-one JavaScript runtime
- **Framework**: [React Native](https://reactnative.dev) with [Expo](https://expo.dev)
- **Language**: TypeScript
- **Navigation**: Expo Router (file-based routing)
- **Monetization**: [RevenueCat](https://www.revenuecat.com)
- **UI Components**:
  - expo-blur (iOS blur effects)
  - expo-linear-gradient
  - @expo/vector-icons

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/betomoedano/unlock-the-cat.git
   cd unlock-the-cat
   ```

2. **Install dependencies**

   ```bash
   bun install
   ```

3. **Configure RevenueCat**
   - Create a RevenueCat account at [revenuecat.com](https://www.revenuecat.com)
   - Set up your iOS and Android apps in the RevenueCat dashboard
   - Update the API keys in `app/_layout.tsx`:
     ```typescript
     const REVENUE_CAT_IOS_KEY = "your-ios-key";
     const REVENUE_CAT_ANDROID_KEY = "your-android-key";
     ```

## 🚀 Development

### Run on iOS Simulator

```bash
bun run ios
```

### Run on Android Emulator

```bash
bun run android
```

### Start Expo Development Server

```bash
bun start
```

## 📱 Building for Production

This project is configured with [EAS Build](https://docs.expo.dev/build/introduction/) for creating production builds.

### Build for iOS

```bash
eas build --platform ios
```

### Build for Android

```bash
eas build --platform android
```

## 🎨 App Icon

The app icon was generated using [SnapAI](https://github.com/betomoedano/snapai) - an AI-powered icon generator.

## 📚 Resources

- [Expo Documentation](https://docs.expo.dev/)
- [RevenueCat Documentation](https://docs.revenuecat.com/)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Bun Documentation](https://bun.sh/docs)
- [Video Tutorial](https://youtu.be/R3fLKC-2Qh0)

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
