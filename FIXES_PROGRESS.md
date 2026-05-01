# FIXES PROGRESS - Optimization Checklist

Based on analysis against `.opencode/CODE_RULES.md` and `.opencode/PROJECT_RULES.md`

---

## **🔴 HIGH PRIORITY (Fix Immediately)**

### **Missing Files (per PROJECT_RULES.md):**
- [ ] `src/hooks/usePointsCounter.ts` — required per types/index.ts
- [ ] `src/hooks/useChallenges.ts` — required per types/index.ts
- [ ] `src/components/challenge/ChallengeList.tsx` — extract from index.tsx FlatList
- [ ] `src/components/ui/PointsCounter.tsx` — required per rules
- [ ] `src/components/ErrorBoundary.tsx` — create error boundary component

### **TypeScript Violations:**
- [ ] `src/hooks/useMusicPlayer.ts:37,159` — `any` type for `stateValue` → create proper type helper
- [ ] `src/app/(modals)/player.tsx:54` — `event: any` → type as `NativeTouchEvent`

### **Performance (Memoization):**
- [ ] `src/components/challenge/ChallengeCard.tsx` — wrap in `React.memo()`
- [ ] `src/components/ui/GlassCard.tsx` — wrap `GlassCard` and `GlassButton` in `React.memo()`
- [ ] `src/app/(modals)/player.tsx:35` — `liveChallenge.find()` runs every render → `useMemo`
- [ ] `src/app/(modals)/player.tsx:37-41` — `formatTime` not memoized → `useCallback`
- [ ] `src/app/(modals)/player.tsx:47-52` — `handleSeek` not memoized → `useCallback`
- [ ] `src/app/(modals)/player.tsx:65-69` — `getProgress` not memoized → `useCallback`
- [ ] `src/app/(modals)/player.tsx:78-86` — `handlePlayPause` not memoized → `useCallback`

### **Error Handling:**
- [ ] `src/app/(modals)/player.tsx:91-93` — `Alert.alert` during render → move to `useEffect`

---

## **🟡 MEDIUM PRIORITY (Fix This Sprint)**

### **Selector Pattern (CODE_RULES.md: "Use `useStore(s => s.property)`"):**
- [ ] `src/stores/musicStore.ts` — add missing selectors: `selectSetCurrentPosition`, `selectSetIsPlaying`, `selectUpdateProgress`, `selectMarkChallengeComplete`
- [ ] `src/stores/userStore.ts` — add missing selectors: `selectResetProgress`, `selectCompleteChallenge`, `selectRecordAward`
- [ ] `src/app/(modals)/player.tsx:30-31` — replace inline selectors with named exports
- [ ] `src/app/(tabs)/profile.tsx:13-14` — replace inline selectors with named exports
- [ ] `src/hooks/useMusicPlayer.ts:27-32` — replace inline selectors with named exports

### **Export Style:**
- [ ] `src/app/(tabs)/profile.tsx:9` — `export default` → named export `export function`
- [ ] `src/app/(modals)/player.tsx:17` — `export default` → named export
- [ ] `src/app/(tabs)/index.tsx:11` — `export default` → named export

### **Store Cleanup:**
- [ ] `src/stores/userStore.ts:9` — `totalSecondsListened` stored but unused → remove or implement
- [ ] `src/stores/userStore.ts:53-57` — remove unused `totalSecondsListened` from `partialize`

### **Performance:**
- [ ] `src/app/(tabs)/profile.tsx:16-17` — `totalChallenges`, `completionRate` → `useMemo`
- [ ] `src/app/(tabs)/profile.tsx:19-35` — `handleReset` → `useCallback`
- [ ] `src/app/(tabs)/index.tsx` — `renderChallenge` → `useCallback`, add `getItemLayout` to FlatList
- [ ] `src/app/(modals)/player.tsx:135,142,148` — `completedChallenges.includes()` called repeatedly → compute once with `useMemo`
- [ ] `src/components/challenge/ChallengeCard.tsx:21-25` — `formatDuration` → move outside component or `useCallback`
- [ ] `src/components/challenge/ChallengeCard.tsx:27-34` — `getDifficultyColor` → move outside component

### **Cleanup:**
- [ ] `src/hooks/useMusicPlayer.ts:50-70` — add cleanup function to useEffect (prevent memory leaks)

---

## **🟢 LOW PRIORITY (Fix When Convenient)**

### **Code Style:**
- [ ] `src/hooks/useMusicPlayer.ts:21` — rename `loading` → `isLoading` (auxiliary verb rule)
- [ ] Change arrow functions to `function` keyword for pure functions:
  - [ ] `src/app/(modals)/player.tsx:37-41` — `formatTime`
  - [ ] `src/app/(modals)/player.tsx:65-69` — `getProgress`
  - [ ] `src/components/challenge/ChallengeCard.tsx:21-25` — `formatDuration`
  - [ ] `src/components/challenge/ChallengeCard.tsx:27-34` — `getDifficultyColor`
  - [ ] `src/components/challenge/ChallengeCard.tsx:36-41` — `getButtonTitle`

### **File Structure:**
- [ ] `src/app/(modals)/player.tsx` — move helper functions (`formatTime`, `getProgress`) before component
- [ ] `src/components/challenge/ChallengeCard.tsx` — move helper functions outside component

### **Cleanup:**
- [ ] `src/app/(modals)/player.tsx:91-93` — remove unnecessary curly braces in conditionals
- [ ] `src/services/audioService.ts:7` — `catch (error: any)` → use `unknown` + type guard
- [ ] `src/services/audioService.ts:117` — `handlePlaybackError = (error: any)` → use `unknown`

---

## **Summary Stats:**
- 🔴 High: 16 items
- 🟡 Medium: 18 items
- 🟢 Low: 12 items
- **Total: 46 items**

---

## **Progress Tracking:**
- High Priority: 0/16 completed
- Medium Priority: 0/18 completed
- Low Priority: 0/12 completed
- **Overall: 0/46 completed (0%)**
