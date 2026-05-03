import { StyleSheet } from 'react-native';
import { THEME } from '../../constants/theme';

export const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 16,
    right: 16,
    zIndex: 100,
  },
  card: {
    padding: 12,
    flexWrap: 'wrap',
  },
  topSection: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    width: '100%'
  },
  info: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    color: THEME.colors.text.primary,
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  artist: {
    color: THEME.colors.text.secondary,
    fontSize: 12,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playPauseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: THEME.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  progressTrack: {
    width: '100%',
    marginTop: 8,
    marginBottom: 4,
  },
  progressBackground: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: THEME.colors.accent,
    borderRadius: 4,
  },
  progressDisabled: {
    opacity: 0.5,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  timeText: {
    fontSize: 10,
    color: THEME.colors.text.secondary,
  },
});

