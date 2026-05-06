# Music Reward mini App - React Native (Expo)

A high-performance music application built with React Native and Expo, featuring background audio playback, lock screen controls, and a custom challenge-based progress persistence system.

## 🎵 Features

### Core Gameplay
- **Challenge List**: Display a list of music tracks to complete listening challenges
- **Points System**: Earn points after completing challenges (points awarded at 98% threshold)
- **Achievement Badges**: Unlock achievements by reaching different levels of earned points
- **Anti-Cheat Protection**: Progress bar is non-interactable until challenge is completed
- **Resume Later**: If challenge started but not completed, progress is saved and can be resumed later
- **Replay**: Once completed, revisit songs and manage playback freely

### Audio Experience
- **Background Audio**: Music continues playing when app is minimized or screen is locked (iOS `audio` background mode)
- **Mini Player**: Bottom bar appears when track is playing for easy control without opening full player
- **Lock Screen Controls**: Play/pause/seek from iOS Lock Screen and Control Center
- **Hybrid Loading**: Smart detection (500ms fast-path) with loading overlay for slow networks
- **Audio Interruption Handling**: Auto-pause on phone calls, ducking for notifications

### Technical Highlights
- **Single Responsibility**: `useMusicPlayer.ts` (65 lines) acts as glue only
- **Singleton Services**: `PlaybackOrchestrator.ts` handles playback orchestration
- **Global Persistence**: `useTrackPersistence.ts` tracks progress in background
- **Data-Driven UI**: Achievements and challenge progress lists are reusable components
- **Glassmorphism Design**: Consistent glass card/button components with blur effects
- **Zustand Stores**: Persistent state management with selector pattern for performance


## DEMO IMAGES

| | | |
|:-------------------------:|:-------------------------:|:-------------------------:|
| <img src="https://github.com/user-attachments/assets/930d9e3d-c024-44e4-bc44-a2dcdbcf527f" width="100%" /> | <img src="https://github.com/user-attachments/assets/487f9491-2c7b-4add-a935-b86dc111d513" width="100%" /> | <img src="https://github.com/user-attachments/assets/56341710-1c22-47f6-a0f2-000579713769" width="100%" /> |
| <img src="https://github.com/user-attachments/assets/a0e09a16-17cb-421b-8f5c-d9c49294157e" width="100%" /> | <img src="https://github.com/user-attachments/assets/c665a3e8-fb03-449e-aeba-8bd2d3f2ab71" width="100%" /> | <img src="https://github.com/user-attachments/assets/76b50259-9206-4a87-943b-5f7dfbad1ab2" width="100%" /> |


---

## 🚀 Getting Started

Follow these steps to set up the development environment and run the application.

### 1. Prerequisites
- **Node.js** (LTS version recommended)
- **Watchman** (for macOS users)
- **Xcode** (for iOS development)
- **CocoaPods** (`sudo gem install cocoapods`)

### 2. Installation
First, clone the repository and install the necessary dependencies:

```bash
# Install project dependencies
npm install

# Install iOS native dependencies
npx pod-install

``` 
### 2. Running the App
To launch the application on the iOS Simulator:

# Run on iOS Simulator
```bash
npx expo run:ios
```

Tip: If you encounter unexpected behavior or cache issues with Metro Bundler, restart with the clear cache flag:

```bash
npx expo start -c
```
## 📱 Testing on a Real Device (iOS)

Testing on a real device is crucial to verify **Background Audio** and **Lock Screen Controls**, as simulators often have limitations with native background modes.

### Option A: Release Build
This is the most reliable way to test native modules like `react-native-track-player`.

1. **Connect your iPhone** to your Mac via USB.
2. **Open the project in Xcode**: Navigate to the `ios` folder and open `.xcworkspace`.
3. **Configure Signing**: 
   - Select the project in the left sidebar.
   - Go to **Signing & Capabilities**.
   - Select your Development Team.
   - Edit schema -> Run -> Build Config -> Release
   - Select your device
   - Run

### Option B: Develop Build 

**Run from Terminal**:
```bash
   npx expo run:ios --device
```


## /////////////////////////////////////////////

# Incident Report: Xcode Build Database Corruption (Disk I/O Error)

## 1. Problem Description
The iOS build failed during the compilation phase with a specific infrastructure error from the Xcode build engine.

**Error Message:**
`❌ error: error: accessing build database ".../Build/Intermediates.noindex/XCBuildData/build.db": disk I/O error`

**Root Cause:**
The Xcode `build.db` became corrupted or locked. This typically occurs when file paths are changed (e.g., moving style folders) while a build process is active, or due to a crash in the `XCBuild` daemon.

---

## 2. Recovery Instructions

### Phase 1: Environment Cleanup
Clear the corrupted Xcode database and reset the file watcher.
```bash
# 1. Clear Xcode Derived Data (The most critical step)
rm -rf ~/Library/Developer/Xcode/DerivedData/

# 2. Reset Watchman (Prevents stale file references)
watchman watch-del-all

# 3. Purge Metro Bundler cache
rm -rf $TMPDIR/metro-cache

```

### Phase 2: Native Project Restoration (If necessary)
If the project structure was significantly modified, regenerate the native directory using Expo Prebuild.

# 1. Remove existing ios folder
rm -rf ios

# 2. Regenerate native files from app.json/app.config.js
npx expo prebuild --platform ios

# 3. Reinstall CocoaPods dependencies
npx pod-install ios

### Phase 3: Re-execution
Run the build command to rebuild the database from scratch.

```bash
npx expo run:ios
```




📄 License
This project is private and confidential.

### Notas adicionales para tu configuración:
*   **`.gitignore`**: Asegúrate de que el archivo que definimos anteriormente esté aplicado para que al hacer el `npm install` y el `npx expo run:ios`, no intentes subir accidentalmente la carpeta `ios/Pods` o los binarios generados.
*   **Bundle Identifier**: Si es la primera vez que corres en un dispositivo real, Xcode te pedirá un "Bundle Identifier" único. Puedes cambiarlo en la pestaña de *General* dentro de Xcode.
