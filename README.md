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

📄 License
This project is private and confidential.

### Notas adicionales para tu configuración:
*   **`.gitignore`**: Asegúrate de que el archivo que definimos anteriormente esté aplicado para que al hacer el `npm install` y el `npx expo run:ios`, no intentes subir accidentalmente la carpeta `ios/Pods` o los binarios generados.
*   **Bundle Identifier**: Si es la primera vez que corres en un dispositivo real, Xcode te pedirá un "Bundle Identifier" único. Puedes cambiarlo en la pestaña de *General* dentro de Xcode.