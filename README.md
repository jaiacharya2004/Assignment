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

https://github.com/user-attachments/assets/ab5e289e-55bc-4e49-8333-75f2f126b68c

