# FIX LOG - Implementation Plan for Missing HIGH Priority Files

**Date:** 2026-05-02
**Session:** HIGH Priority Missing Files Creation
**Based on:** `FIXES_PROGRESS.md` + `.opencode/PROJECT_RULES.md` + `.opencode/CODE_RULES.md`

---

## **Overview**

Creating 5 missing files required by project rules:
1. `src/hooks/usePointsCounter.ts`
2. `src/hooks/useChallenges.ts`
3. `src/components/challenge/ChallengeList.tsx`
4. `src/components/ui/PointsCounter.tsx`
5. `src/components/ErrorBoundary.tsx`

---

## **1. `src/hooks/usePointsCounter.ts`**

### **Purpose:**
Implements `UsePointsCounterReturn` interface from `types/index.ts:37-45`

### **Dependencies:**
- `useCallback`, `useEffect`, `useRef`, `useState` from 'react'
- `useProgress` from 'react-native-track-player'
- `PointsCounterConfig`, `UsePointsCounterReturn` from '../types'

### **Implementation Details:**

**State:**
- `currentPoints: number` — points earned so far
- `pointsEarned: number` — total points when completed
- `isActive: boolean` — whether counter is running
- `config: PointsCounterConfig | null` — stores config
- `intervalRef: useRef<NodeJS.Timeout>()` — for cleanup

**Logic:**
- `startCounting(config: PointsCounterConfig)` — initializes counter, sets active, resets points
- `stopCounting()` — stops counter, clears interval
- `resetProgress()` — resets currentPoints and pointsEarned to 0
- `progress` from `useProgress()` to track playback position

**useEffect:**
- Watches `progress.position`, `progress.duration`, `isActive`, `config`
- Calculates `progressPercentage = (position / duration) * 100`
- Calculates `earnedPoints = Math.floor((progressPercentage / 100) * config.totalPoints)`
- Updates `pointsEarned` and `currentPoints` when increased
- Returns cleanup function to clear interval

**Returns:** Object matching `UsePointsCounterReturn` interface

**Memoization:**
- Wrap `startCounting`, `stopCounting`, `resetProgress` in `useCallback`

---

## **2. `src/hooks/useChallenges.ts`**

### **Purpose:**
Implements `UseChallengesReturn` interface from `types/index.ts:47-54`

### **Dependencies:**
- `useCallback`, `useEffect`, `useState` from 'react'
- `useMusicStore`, `selectChallenges`, `selectCurrentTrack` from '../stores/musicStore'
- `useUserStore`, `selectCompletedChallenges` from '../stores/userStore'
- `MusicChallenge`, `UseChallengesReturn` from '../types'

### **Implementation Details:**

**State:**
- `loading: boolean` — for async operations
- `error: string | null` — for error handling

**Store Selectors:**
- `challenges = useMusicStore(selectChallenges)`
- `completedChallenges = useUserStore(selectCompletedChallenges)`
- `markChallengeComplete = useMusicStore((s) => s.markChallengeComplete)`
- `completeChallenge = useUserStore((s) => s.completeChallenge)`

**Logic:**
- `refreshChallenges()` — calls `loadChallenges()` from musicStore (if exists) or resets to SAMPLE_CHALLENGES
- `completeChallenge(challengeId: string)` — calls both:
  - `markChallengeComplete(challengeId)` from musicStore
  - `completeChallenge(challengeId)` from userStore

**Returns:** Object matching `UseChallengesReturn` interface

**Memoization:**
- Wrap `refreshChallenges`, `completeChallenge` in `useCallback`

---

## **3. `src/components/challenge/ChallengeList.tsx`**

### **Purpose:**
Extract FlatList from `src/app/(tabs)/index.tsx:59-65`

### **Dependencies:**
- `FlatList`, `View`, `StyleSheet` from 'react-native'
- `ChallengeCard` from './ChallengeCard'
- `useMusicPlayer` from '../../hooks/useMusicPlayer'
- `useMusicStore`, `selectChallenges`, `selectCurrentTrack`, `selectIsPlaying`
- `MusicChallenge` from '../../types'

### **Props Interface:**
```typescript
interface ChallengeListProps {
  challenges: MusicChallenge[];
  currentTrackId?: string | null;
  isPlaying: boolean;
  onPlayChallenge: (challenge: MusicChallenge) => void;
}
```

### **Implementation Details:**

**Component:** `export const ChallengeList = React.memo<ChallengeListProps>(({...}) => { ... })`

**renderItem:** Memoized with `useCallback`
```typescript
const renderChallenge = useCallback(({ item }: { item: MusicChallenge }) => (
  <ChallengeCard
    challenge={item}
    onPlay={onPlayChallenge}
    isCurrentTrack={currentTrackId === item.id}
    isPlaying={isPlaying}
  />
), [onPlayChallenge, currentTrackId, isPlaying]);
```

**getItemLayout:** For performance (item height ~280px)
```typescript
const getItemLayout = useCallback((data: any, index: number) => ({
  length: 280,
  offset: 280 * index,
  index,
}), []);
```

**FlatList props:**
- `data={challenges}`
- `renderItem={renderChallenge}`
- `keyExtractor={(item) => item.id}`
- `getItemLayout={getItemLayout}`
- `contentContainerStyle={styles.listContainer}`
- `showsVerticalScrollIndicator={false}`

---

## **4. `src/components/ui/PointsCounter.tsx`**

### **Purpose:**
Reusable points counter UI component (required by PROJECT_RULES.md)

### **Dependencies:**
- `View`, `Text`, `StyleSheet` from 'react-native'
- `GlassCard` from './GlassCard'
- `usePointsCounter` from '../../hooks/usePointsCounter'
- `THEME` from '../../constants/theme'
- `PointsCounterConfig` from '../../types'

### **Props Interface:**
```typescript
interface PointsCounterProps {
  totalPoints: number;
  durationSeconds: number;
  challengeId: string;
  isActive: boolean;
  style?: ViewStyle;
  onComplete?: () => void;
}
```

### **Implementation Details:**

**Component:** `export const PointsCounter = React.memo<PointsCounterProps>(({...}) => { ... })`

**Uses hook internally:**
```typescript
const {
  currentPoints,
  pointsEarned,
  progress,
  isActive,
  startCounting,
  stopCounting,
  resetProgress,
} = usePointsCounter();
```

**Effects:**
- `useEffect` — when `isActive` changes, calls `startCounting` or `stopCounting`
- Cleanup on unmount

**UI:**
- GlassCard wrapper
- Current points display (large animated number)
- Progress bar (0-100%) based on `progress`
- "Points earned: X / Y" text
- Optional: completion message when `pointsEarned === totalPoints`

**Memoization:**
- Wrap all callbacks in `useCallback`
- Memoize static styles with `useMemo`

---

## **5. `src/components/ErrorBoundary.tsx`**

### **Purpose:**
Catch rendering errors and show fallback UI (required by CODE_RULES.md Error Boundaries rule)

### **Dependencies:**
- `React` from 'react' (class component required for error boundaries)
- `View`, `Text`, `StyleSheet`, `TouchableOpacity` from 'react-native'
- `GlassCard` from './GlassCard'
- `THEME` from '../../constants/theme'

### **Implementation Details:**

**Class Component (required for error boundaries):**
```typescript
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  onRetry?: () => void;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: undefined };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: undefined });
    this.props.onRetry?.();
  };

  render(): React.ReactNode {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} onRetry={this.handleRetry} />;
    }
    return this.props.children;
  }
}

export { ErrorBoundary };
```

**Fallback UI Component:**
```typescript
const ErrorFallback: React.FC<{ error?: Error; onRetry: () => void }> = ({ error, onRetry }) => (
  <GlassCard style={styles.fallbackCard}>
    <Text style={styles.errorEmoji}>⚠️</Text>
    <Text style={styles.errorTitle}>Something went wrong</Text>
    <Text style={styles.errorMessage}>{error?.message || 'An unexpected error occurred'}</Text>
    <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
      <Text style={styles.retryText}>Try Again</Text>
    </TouchableOpacity>
  </GlassCard>
);
```

**Styles:**
- `fallbackCard` — centered, padded
- `errorEmoji` — large emoji
- `errorTitle` — bold, primary color
- `errorMessage` — secondary color, italic
- `retryButton` — primary background, rounded

---

## **Execution Order:**

1. ✅ Create `FIX_LOG.md` (this file)
2. [ ] Create `src/hooks/usePointsCounter.ts` — no dependencies
3. [ ] Create `src/hooks/useChallenges.ts` — no dependencies
4. [ ] Create `src/components/challenge/ChallengeList.tsx` — depends on ChallengeCard (exists)
5. [ ] Create `src/components/ui/PointsCounter.tsx` — depends on usePointsCounter
6. [ ] Create `src/components/ErrorBoundary.tsx` — no dependencies
7. [ ] Update `src/app/(tabs)/index.tsx` — use `ChallengeList` component
8. [ ] Update `src/app/(tabs)/profile.tsx` — use `PointsCounter` component (optional)
9. [ ] Wrap root layout with `ErrorBoundary`
10. [ ] Update `FIXES_PROGRESS.md` — check off completed items
11. [ ] Commit all changes

---

## **Post-Creation Tasks:**

### **Update `src/app/(tabs)/index.tsx`:**
- Remove inline `renderChallenge` function
- Remove `FlatList` import (moved to ChallengeList)
- Import and use `<ChallengeList>` component
- Pass props: `challenges`, `currentTrack`, `isPlaying`, `handlePlayChallenge`

### **Update `src/app/(tabs)/profile.tsx` (optional):**
- Import `PointsCounter` component
- Replace manual points display with `<PointsCounter>`

### **Wrap with ErrorBoundary:**
- Edit `src/app/_layout.tsx` or root layout
- Wrap `<Stack>` or main content with `<ErrorBoundary>`
- Add `onRetry` handler to reload app or reset navigation

---

## **Testing Checklist:**

After creating each file:
- [ ] TypeScript compiles without errors (`npx tsc --noEmit`)
- [ ] Component renders without errors
- [ ] Memoization works (check with React DevTools)
- [ ] Error boundary catches errors and shows fallback
- [ ] Points counter calculates correctly based on progress

---

## **Progress Tracking:**

- [ ] `src/hooks/usePointsCounter.ts` — 0%
- [ ] `src/hooks/useChallenges.ts` — 0%
- [ ] `src/components/challenge/ChallengeList.tsx` — 0%
- [ ] `src/components/ui/PointsCounter.tsx` — 0%
- [ ] `src/components/ErrorBoundary.tsx` — 0%

**Overall: 0/5 files created (0%)**

---

## **Next Steps:**

1. Start implementing files in order (1 → 5)
2. Test each file after creation
3. Update parent components to use new files
4. Commit with descriptive message
5. Update `FIXES_PROGRESS.md` checklist

---

**End of Plan**
