React Native Movies Application (Expo)

A React Native app built with Expo showcasing authentication, API integration, native Android module, and performance-optimized UI.

📱 Core Features
🔐 Authentication

Firebase Email/Password login

Persistent session with AsyncStorage

Auto-redirect after successful login

🎬 Movies List

Fetches movie data from OMDB API

Renders list using optimized FlatList

Loading + error states

Memoized item components & keyExtractor for performance

📄 Movie Detail Screen

Detailed view with poster, plot, and ratings

Back navigation to list

🤖 Native Android Module (Kotlin)

Custom module built with Kotlin

Exposes device model, Android version, and manufacturer

Located at: android/app/src/main/java/.../demoapp/

🛠️ Tech Stack

Expo (React Native)

Expo Router

Firebase Authentication

OMDB API

AsyncStorage

Kotlin Native Module

React Native Paper UI

🐛 Debugging & Tools

React DevTools

Chrome DevTools

Flipper (network logs & native debugging)

Logcat (Android native logs)

Most Challenging Bug

Android build failures caused by mismatched SDK/NDK/Gradle versions.
Solved by aligning:

minSdkVersion = 24

compileSdk = 35

targetSdk = 34

ndkVersion = 25.1.8937393

Disabling New Architecture (newArchEnabled=false)

🚫 iOS Support

iOS is not supported, due to:

No macOS/Xcode

Native module requires Swift/Obj-C

Firebase iOS setup unavailable

Android support is fully tested and stable.

🎓 Learning Outcomes

Easier: UI development, API integration, authentication, state management
Challenging: Build configuration, native module bridging, Gradle/NDK version conflicts

Key Insight:
React Native + Expo offers rapid development, but requires careful version management when native code is involved.



https://github.com/user-attachments/assets/adcfe4fd-3d4e-44e3-a3bc-435b75ea97f5



# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
