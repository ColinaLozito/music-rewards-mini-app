// Styles for player.tsx
import { StyleSheet } from 'react-native';
import { THEME } from '../../theme/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: THEME.spacing.lg,
    // Remove justifyContent: 'space-between'
  },
  // Remove: trackInfoCard, trackTitle, trackArtist, trackDescription, pointsContainer
  artworkImage: { // NEW: artwork image (full visible, no GlassCard)
    width: '100%',
    aspectRatio: 1, // Square
    borderRadius: THEME.borderRadius.md,
    marginBottom: THEME.spacing.lg,
  },
  trackInfoRows: { // NEW: for progressCard header replacement
    marginBottom: THEME.spacing.md,
  },
  trackTitleSmall: { // NEW: sm title in progressCard
    fontSize: THEME.fonts.sizes.sm,
    fontWeight: 'bold',
    color: THEME.colors.text.primary,
  },
  trackArtistXs: { // NEW: xs artist in progressCard
    fontSize: THEME.fonts.sizes.xs,
    color: THEME.colors.text.secondary,
  },
  progressCard: {
    // Card styling handled by GlassCard
  },
  progressLabel: { // Keep for reference, but not used
    fontSize: THEME.fonts.sizes.md,
    fontWeight: '600',
    color: THEME.colors.text.primary,
    textAlign: 'center',
    marginBottom: THEME.spacing.md,
  },
  progressTrack: {
    marginBottom: THEME.spacing.md,
  },
  progressBackground: {
    height: THEME.spacing.xs,
    backgroundColor: THEME.colors.progressBackground,
    borderRadius: THEME.borderRadius.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: THEME.colors.accent,
    borderRadius: THEME.borderRadius.sm,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: THEME.spacing.sm,
  },
  timeText: {
    fontSize: THEME.fonts.sizes.sm,
    color: THEME.colors.text.secondary,
  },
  controlsCard: {
    // Card styling handled by GlassCard
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: THEME.spacing.md
  },
  progressDisabled: {
    opacity: 0.5,
  },
  controlButton: {
    flex: 0.25,
    marginHorizontal: THEME.spacing.xs,
  },
  iconButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlIcon: {
    width: 24,
    height: 24,
    tintColor: '#FFFFFF',
    resizeMode: 'contain',
  },
  mainControlButton: {
    flex: 0.4,
    marginHorizontal: THEME.spacing.xs,
  },
  errorText: {
    color: THEME.colors.error,
    fontSize: THEME.fonts.sizes.sm,
    textAlign: 'center',
    marginTop: THEME.spacing.md,
  },
  challengeCard: {
    // Card styling handled by GlassCard
  },
  challengeLabel: { // Not used anymore, keep for safety
    fontSize: THEME.fonts.sizes.lg,
    fontWeight: 'bold',
    color: THEME.colors.text.primary,
    marginBottom: THEME.spacing.md,
  },
  challengeInfo: {
    alignItems: 'center',
  },
  challengeStatus: { // Remove: "In Progress" text
    fontSize: THEME.fonts.sizes.lg,
    fontWeight: 'bold',
    marginBottom: THEME.spacing.xs,
  },
  challengeProgress: {
    fontSize: THEME.fonts.sizes.sm,
    color: THEME.colors.text.secondary,
  },
  pointsRow: { // NEW: like PointsCounter
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing.sm,
  },
  pointsLabelSm: { // NEW: sm label
    fontSize: THEME.fonts.sizes.sm,
    color: THEME.colors.text.secondary,
  },
  pointsValueXs: { // NEW: xs value
    fontSize: THEME.fonts.sizes.lg,
    fontWeight: 'bold',
    color: THEME.colors.accent,
  },
  bufferingCard: {
    alignItems: 'center',
    padding: THEME.spacing.md,
  },
  bufferingText: {
    fontSize: THEME.fonts.sizes.md,
    color: THEME.colors.text.secondary,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: THEME.spacing.md,
  },
  descriptionCard: { // NEW: bottom description
    marginTop: THEME.spacing.md,
  },
  descriptionText: { // NEW: full text, no truncation
    fontSize: THEME.fonts.sizes.sm,
    color: THEME.colors.text.tertiary,
  },
});
