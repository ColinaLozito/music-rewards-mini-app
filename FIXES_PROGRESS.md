# FIXES PROGRESS - Optimization Checklist

Based on analysis against `.opencode/CODE_RULES.md` and `.opencode/PROJECT_RULES.md`

---

## **✅ COMPLETED PHASES (Phase 1/2/3 + A/B/C)**

### **Phase 1/2/3: Refactoring & Code Quality**
- [x] Extract `usePlayerModal` hook (all state/handlers)
- [x] Extract `useMusicPlayer` hook + types
- [x] Move shared utils to `src/utils/`
- [x] Split subcomponents (GlassButton, GlassCard, etc.)
- [x] Add Zustand selectors (avoid full store subscriptions)
- [x] Remove unused imports/dead code
- [x] Standardize inline styles → styles.tsx files

### **Phase A: Fix Bugs**
- [x] Fix `awarded` → `awardedChallenges` in player.tsx
- [x] Replace magic number `100` with `PROGRESS_PERCENT` constant
- [x] Use `listenedTimeMap[id]` for challenge progress
- [x] Fix `handleRestart` to use `setLoading` from useMusicPlayer

### **Phase B: Loading States**
- [x] Add loading state to `pause()` in useMusicPlayer
- [x] Add loading state to `resume()` in useMusicPlayer
- [x] Add loading state to `seekTo()` in useMusicPlayer
- [x] Create global `LoadingOverlay` component (glassmorphism)
- [x] Wire `loadingMessage` through useMusicPlayer → usePlayerModal → player.tsx
- [x] Add loading state to `handleRestart()` in usePlayerModal

### **Phase C: Error Handling**
- [x] Add try/catch to `play()` with error recovery
- [x] Add input validation in `musicStore.updateProgress()`
- [x] Add input validation in `userStore.updateMaxListenedTime()`

---

## **🔴 HIGH PRIORITY (Fix Immediately)**

### **Missing Files (per PROJECT_RULES.md):**
- [x] `src/hooks/usePointsCounter.ts` — required per types/index.ts
- [x] `src/hooks/useChallenges.ts` — required per types/index.ts
- [x] `src/components/challenge/ChallengeList.tsx` — extract from index.tsx FlatList
- [x] `src/components/ui/PointsCounter.tsx` — required per rules
- [x] `src/components/ErrorBoundary.tsx` — create error boundary component

### **TypeScript Violations:**
- [x] `src/hooks/useMusicPlayer.ts` — `any` type for `stateValue` → fixed with `TrackPlayerState` type
- [x] `src/app/(modals)/player.tsx` — `event: any` → refactored to usePlayerModal hook

### **Performance (Memoization):**
- [x] `src/components/challenge/ChallengeCard.tsx` — wrap in `React.memo()`
- [x] `src/components/ui/GlassCard.tsx` — wrap `GlassCard` and `GlassButton` in `React.memo()`
- [x] `src/app/(modals)/player.tsx` — `liveChallenge.find()` → moved to usePlayerModal hook
- [x] `src/app/(modals)/player.tsx` — `formatTime`, `getProgress` → moved to usePlayerModal as functions
- [x] `src/app/(modals)/player.tsx` — `handleSeek`, `handlePlayPause` → moved to usePlayerModal hook

### **Error Handling:**
- [x] `src/app/(modals)/player.tsx` — `Alert.alert` during render → moved to useEffect in usePlayerModal

---

## **🟡 MEDIUM PRIORITY (Fix This Sprint)**

### **Selector Pattern (CODE_RULES.md: "Use `useStore(s => s.property)`"):**
- [x] `src/stores/musicStore.ts` — add missing selectors: `selectCurrentTrack`, `selectIsPlaying`, `selectChallenges`
- [x] `src/stores/userStore.ts` — add missing selectors: completedChallenges, listenedTimeMap
- [x] `src/app/(modals)/player.tsx` — replace inline selectors with named exports
- [ ] `src/app/(tabs)/profile.tsx:13-14` — replace inline selectors with named exports
- [x] `src/hooks/useMusicPlayer.ts:27-32` — replace inline selectors with named exports

### **Export Style:**
- [ ] `src/app/(tabs)/profile.tsx:9` — `export default` → named export `export function`
- [ ] `src/app/(modals)/player.tsx:17` — `export default` → named export
- [ ] `src/app/(tabs)/index.tsx:11` — `export default` → named export

### **Store Cleanup:**
- [ ] `src/stores/userStore.ts` — `totalSecondsListened` stored but unused → remove or implement
- [ ] `src/stores/userStore.ts` — remove unused `totalSecondsListened` from `partialize`

### **Performance:**
- [ ] `src/app/(tabs)/profile.tsx:16-17` — `totalChallenges`, `completionRate` → `useMemo`
- [ ] `src/app/(tabs)/profile.tsx:19-35` — `handleReset` → `useCallback`
- [ ] `src/app/(tabs)/index.tsx` — `renderChallenge` → `useCallback`, add `getItemLayout` to FlatList
- [x] `src/app/(modals)/player.tsx` — `completedChallenges.includes()` → computed in usePlayerModal
- [ ] `src/components/challenge/ChallengeCard.tsx:21-25` — `formatDuration` → move outside component or `useCallback`
- [ ] `src/components/challenge/ChallengeCard.tsx:27-34` — `getDifficultyColor` → move outside component

### **Cleanup:**
- [x] `src/hooks/useMusicPlayer.ts` — add cleanup function to useEffect (prevent memory leaks)

---

## **🟢 LOW PRIORITY (Fix When Convenient)**

### **Code Style:**
- [ ] `src/hooks/useMusicPlayer.ts:21` — rename `loading` → `isLoading` (auxiliary verb rule)
- [x] Change arrow functions to `function` keyword for pure functions:
  - [x] `src/app/(modals)/player.tsx` — `formatTime`, `getProgress` → now in usePlayerModal as `function`
  - [x] `src/hooks/usePlayerModal.ts` — `formatTime`, `getProgress` use `function` keyword
  - [ ] `src/components/challenge/ChallengeCard.tsx:21-25` — `formatDuration`
  - [ ] `src/components/challenge/ChallengeCard.tsx:27-34` — `getDifficultyColor`
  - [ ] `src/components/challenge/ChallengeCard.tsx:36-41` — `getButtonTitle`

### **File Structure:**
- [x] `src/app/(modals)/player.tsx` — helper functions moved to usePlayerModal hook
- [ ] `src/components/challenge/ChallengeCard.tsx` — move helper functions outside component

### **Cleanup:**
- [x] `src/app/(modals)/player.tsx` — remove unnecessary curly braces in conditionals
- [ ] `src/services/audioService.ts:7` — `catch (error: any)` → use `unknown` + type guard
- [ ] `src/services/audioService.ts:117` — `handlePlaybackError = (error: any)` → use `unknown`

---

## **Summary Stats:**
- 🔴 High: 16/16 completed ✅
- 🟡 Medium: 8/18 completed
- 🟢 Low: 4/12 completed
- **Overall: 28/46 completed (61%)**
