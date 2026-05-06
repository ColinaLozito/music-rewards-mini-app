# Music Rewards Mini App - Architecture

## Overview
Expo Router + React Native app for music challenge rewards. Users complete listening challenges to earn points. Built with Expo 54, Zustand, react-native-track-player.

---

## Directory Structure
```
src/
├── app/                                   # Expo Router screens & layouts
│   ├── (tabs)/                             # Tab navigation screens
│   └── (modals)/                           # Modal screens
│
├── components/                            # Reusable + feature components
│   ├── ui/                                # Reusable UI components (GlassCard, RoundedIconButton, etc.)
│   ├── challenge/                         # Challenge-specific components (ChallengeCard, ChallengeList, etc.)
│   └── profile/                           # Profile-specific components (AchievementsList, etc.)
│
├── hooks/                                 # Business logic hooks
│
├── services/                              # Singleton services (no React hooks)
│
├── stores/                                # Zustand state management
│
├── types/                                 # TypeScript type definitions
│
├── constants/                             # Centralized data (theme, icons, achievements, etc.)
│
└── utils/                                 # Pure utility functions

---

## Design Decisions

### 1. Single Responsibility Principle (SRP)
- `useMusicPlayer.ts`: 267→65 lines (glue only)
- `PlaybackOrchestrator.ts`: Singleton service (no hooks)
- `useTrackPersistence.ts`: Global progress sync + completion
- `usePointsCounter.ts`: Reactive points calculation

### 2. Container/Presenter Pattern
- `player.tsx` (UI) + `usePlayerModal.ts` (logic)
- `profile.tsx` (UI) + `AchievementsList.tsx` (data-driven)
- `ChallengeProgressList.tsx` (reusable across screens)

### 3. Data-Driven Architecture
- Achievements: `constants/achievements.ts` (add achievement = add 1 object)
- `AchievementBadge.tsx`: Reusable across app
- No hardcoded UI conditionals

### 4. Centralized Resources
- `constants/icons.ts`: All icon imports (avoid require() in components)
- `constants/theme.ts`: Design tokens (colors, spacing, fonts)
- `assets.d.ts`: TypeScript declarations for images

---

## Audio Resilience & System Integration

### Background Audio
App leverages `react-native-track-player` as background service.
- **Persistence:** Audio continues when app minimized or screen locked.
- **Capabilities:** Requires `audio` background mode in iOS (`app.json`).
- **iOS Category:** `Playback` with `AllowBluetooth`, `AllowAirPlay`, `MixWithOthers`.

### Initialization Flow
```mermaid
sequenceDiagram
    participant JS as JS Bundle
    participant Bridge as Native Bridge
    participant iOS as iOS Audio Session
    
    JS->>Bridge: teardownTrackPlayerForJsReload()
    Bridge->>iOS: Stop + Reset (kill zombie player)
    JS->>Bridge: setupTrackPlayer()
    Bridge->>iOS: Configure Audio Session (Playback)
    iOS-->>JS: Player Ready
```

### Interruption Management
`playbackService.ts` handles hardware-level events (registered in `index.js`):
- **Remote Play/Pause:** Lock screen controls
- **Remote Duck:** Auto-lowers volume for system sounds (navigation, notifications)
- **Remote Stop:** Full pause when phone call received
- **PlaybackQueueEnded:** Handle track finish
- **PlaybackError:** Log and recover

### Hybrid Loading Strategy
```mermaid
flowchart TD
    A[Play Track] --> B{Metadata loads <500ms?}
    B -->|Yes| C[Play Immediately]
    B -->|No| D[Show LoadingOverlay]
    D --> E{Poll duration every 100ms}
    E -->|Found| F[Play + Seek to Position]
    E -->|5s timeout| G[Throw Error]
```

**Why?** Fast-path avoids flash of loading. Slow-path protects UX when network slow.

---

## Component Hierarchy
```mermaid
graph TD
    Root[_layout.tsx] --> Home[tabs/index.tsx]
    Root --> Profile[tabs/profile.tsx]
    Root --> Player[modals/player.tsx]
    
    Home --> ChallengeList
    Home --> MiniPlayer
    
    Profile --> StatsCard
    Profile --> ChallengeProgressList
    Profile --> AchievementsList
    
    Player --> AudioProgressBar
    Player --> RoundedIconButton
    Player --> PointsCounter
    
    ChallengeProgressList --> ChallengeProgressItem
    AchievementsList --> AchievementBadge
```

---

## State Management

### `musicStore.ts` (Player State)
- `currentTrack: MusicChallenge | null`
- `isPlaying: boolean`
- `challenges: MusicChallenge[]` (persisted)

### `userStore.ts` (User Data)
- `completedChallenges: string[]` (persisted)
- `listenedTimeMap: Record<string, number>` (max seconds listened)
- `awardedChallenges: Record<string, number>` (points awarded)

### Selector Pattern
```typescript
// Performance: avoid re-renders
export const selectCurrentTrack = (state: MusicStore) => state.currentTrack;
export const selectCompletedChallenges = (state: UserStore) => state.completedChallenges;
```

---

## Performance Optimizations

### 1. Throttled Progress Sync
```typescript
// Every 5 seconds, not every 1ms progress tick
const SYNC_INTERVAL = 5;
if (seconds - lastSyncedRef.current >= SYNC_INTERVAL) {
  updateMaxListenedTime(trackId, position);
}
```

### 2. Memoized Computations
```typescript
const progress = useMemo(() => {
  if (!duration) return 0;
  return (position / duration) * 100;
}, [position, duration]);
```

### 3. Zombie Player Prevention
```typescript
// Kill ghost player on JS reload
export const teardownTrackPlayerForJsReload = async () => {
  await ensureTrackPlayerInitialized();
  await TrackPlayer.pause();
  await TrackPlayer.reset();
};
```

---

## Error Handling & Network Resilience

### Error Types & Toast Mapping
| Error Type | Toast Color | Trigger | Recovery |
|-----------|-------------|--------|----------|
| Track load failure | Red (error) | Bad URL / 8s timeout | Retry button |
| Network down (while playing) | Yellow (warning) | `PlaybackError` with network keywords | Auto-resume when network returns |
| Buffering (>5s stalled) | Yellow (warning) | Position stops advancing for 5s | Player continues from buffer, auto-clears when advances |
| Network down (player stopped) | Red (error) | `PlaybackError` + player not playing | Retry button, auto-resume |
| Challenge complete | Green (success) | Progress ≥98% | Auto-dismiss modal + toast |

### Current Implementation

**1. No auto-pause on network loss:**
- Player continues playing from buffer until naturally stops
- Only shows warning toasts, doesn't interrupt playback

**2. Buffering detection (`useMusicPlayer.ts`):**
```typescript
// Poll progress.position every 100ms
// If position unchanged for 5s → show "Buffering: Network may be slow"
const BUFFER_TIMEOUT_MS = 5000;

useEffect(() => {
  if (currentPos === lastPositionRef.current && currentPos > 0) {
    bufferTimerRef.current = setTimeout(() => {
      toast.warning('Buffering: Network may be slow');
      setIsBuffering(true);
    }, BUFFER_TIMEOUT_MS);
  } else {
    // Position changed → clear timer + clear error
    clearTimeout(bufferTimerRef.current);
    setError(null);
    setIsBuffering(false);
  }
}, [isPlayingValue, progress.position]);
```

**3. Network recovery auto-resume (`PlaybackOrchestrator.ts`):**
```typescript
_startNetworkListener(): void {
  NetInfo.addEventListener(state => {
    if (state.isConnected && state.isInternetReachable) {
      // Network returned → auto-resume if not playing
      TrackPlayer.getPlaybackState().then(state => {
        if (state.state !== State.Playing && currentTrackRef) {
          this.resume().catch(console.error);
        }
      });
    }
  });
}
```

**4. Error state + toast flow:**
```
Network cuts → buffer plays → toast.warning("Buffering: Network may be slow")
     ↓
Buffer empties → player stops naturally → PlaybackError fired
     ↓
If not playing: setError() + toast.error() + retry button appears
     ↓
Network returns → NetInfo listener → auto-resume()
     ↓
Playback recovers → setError(null) + setIsBuffering(false)
```

### Fast Failure for Track Load
```typescript
// _waitForPlaybackStart(): Fail after 8s (5s load + 2s buffer + 1s margin)
async _waitForPlaybackStart(timeout: number): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const state = await TrackPlayer.getPlaybackState();
    if (state.state === State.Playing) return;
    await new Promise(r => setTimeout(r, 100));
  }
  throw new Error('Track failed to start playback');
}
```

**Why 8s?** Loading overlay shows for 5s (duration poll), then 2s buffer for iOS to actually start playback.

### Network Interrupt Handling (Updated)
```mermaid
sequenceDiagram
    participant Track as TrackPlayer
    participant Hook as useMusicPlayer
    participant Orchestrator as PlaybackOrchestrator
    participant NetInfo as @react-native-community/netinfo
    participant UI as player.tsx

    Note over Track,UI: Network cuts during playback
    Track->>Track: Buffer plays naturally
    Hook->>Hook: Position unchanged 5s
    Hook->>UI: toast.warning("Buffering...")
    Track->>Track: Buffer empties, player stops
    Track->>Orchestrator: PlaybackError (network)
    Orchestrator->>Hook: setError() + toast.error()
    Hook->>UI: error state → retry button appears
    NetInfo->>NetInfo: network change (isConnected=true)
    NetInfo->>Orchestrator: auto-resume()
    Orchestrator->>Track: TrackPlayer.resume()
    Track->>Hook: playback recovered → setError(null)
```

---

## Global Toast Notification System

### Toast Schema
```typescript
// src/types/toast.ts
export type ToastType = 'success' | 'warning' | 'error';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  createdAt: number;
}
```

### Toast Colors (from theme.ts)
```typescript
toast: {
  success: '#22C55E', // green-500 (challenge completed)
  warning: '#EAB308', // yellow-500 (buffering, retry)
  error: '#EF4444',   // red-500 (network error, playback failure)
}
```

### Toast Flow Diagram
```mermaid
sequenceDiagram
    participant Any as Any Component
    participant Store as toastStore (Zustand)
    participant Container as ToastContainer
    participant Toast as ToastItem (Animated)

    Any->>Store: toast.success("Challenge completed!")
    Store->>Store: Add toast to array
    Store->>Container: Re-render with new toast
    Container->>Toast: Mount with slide animation
    Toast->>Toast: Animated.timing slideY: -100→0 (300ms)
    Note over Toast: Visible for 3000ms
    Toast->>Store: Auto-dismiss (setTimeout 3000ms)
    Store->>Store: Remove toast from array
    Store->>Container: Re-render (toast removed)
    Toast->>Toast: Animated.timing slideY: 0→-100 (200ms)
    Toast->>Toast: Unmount after animation complete
```

### Toast diagram

┌─────────────────────────────────────────┐
│         RootLayout (_layout.tsx)        │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │      ToastProvider (Global)     │    │
│  │  - Mounts ToastContainer        │    │
│  │  - Provides toast() function    │    │
│  └─────────────────────────────────┘    │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │      LoadingOverlay (Existing)  │    │
│  └─────────────────────────────────┘    │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │         App Stack / Tabs        │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘

ToastStore (Zustand)
├── toasts: Toast[]
├── showToast(message, type) 
├── dismissToast(id)
└── autoDismiss after 3s


### Toast Usage
```typescript
import { toast } from '../utils/toast';

// Success (green) - Challenge completed
toast.success('Challenge completed successfully!');

// Warning (yellow) - Recoverable issues
toast.warning('Retrying playback...');
toast.warning('Buffering...');

// Error (red) - Network/playback failures
toast.error('Network error: Check your connection');
toast.error('Playback error: Unable to load track');
```

### Architecture
```
src/
├── types/toast.ts              # ToastType, Toast interfaces
├── stores/toastStore.ts        # Zustand store (global state)
├── components/ui/Toast.tsx     # Animated toast item (react-native-reanimated)
├── components/ui/ToastContainer.tsx  # Mounts in root layout
└── utils/toast.ts              # Helper: toast.success/warning/error
```

**Mounted in:** `src/app/_layout.tsx` (global scope, top of screen)

---

## Key Libraries
- **Expo Router:** File-based routing (tabs + modals)
- **Zustand:** Lightweight state management with persistence
- **react-native-track-player:** Background audio + lock screen controls
- **expo-blur:** Glassmorphism effects (expo-blur)
- **AsyncStorage:** Persistent storage backend

---

## iOS Configuration (app.json)
```json
{
  "ios": {
    "backgroundModes": ["audio"],
    "infoPlist": {
      "UIBackgroundModes": ["audio"]
    }
  }
}
```

**Critical:** Without `backgroundModes: ["audio"]`, iOS kills audio when app backgrounds.

---

## Implementation Summary

### ✅ Completed (BASIC)
- Proper Zustand store implementation with selectors
- Custom hooks for business logic separation
- Clean component composition
- Proper TypeScript typing throughout
- react-native-track-player integration
- Proper audio session management
- Glass design system with blur effects
- Smooth modal presentations
- Consistent spacing and typography
- Loading states and error handling
- Audio controls and progress visualization
- Points counter animation
- Audio playback with react-native-track-player
- Proper navigation patterns (Expo Router)
- Performance considerations (memoization, selectors)
- AsyncStorage persistence
- Background audio handling
- Audio interruption handling
- TypeScript best practices
- Component reusability
- Error boundaries and fallbacks
- Code organization and naming
- Proper cleanup and memory management

### 🚀 Completed (EXTRA)
- Background playback continuation
- Audio interruption handling (phone calls, notifications)
- Custom toast notifications system (success/warning/error)
- Gesture-based navigation (swipe to close modal)

---

## Planned for Next Iteration

### 🚀 Future Features
- Offline-first architecture
- State persistence with versioning/migrations
- Optimistic updates with rollback
- Real-time sync simulation
- Haptic feedback integration
- Dark/light theme toggle
- Audio visualization (waveform or spectrum)
- Crossfade between tracks
- Playlist support

