// Register the playback service for react-native-track-player
import { AppRegistry } from 'react-native';
import TrackPlayer from 'react-native-track-player';
import playbackService from './src/services/playbackService';

// Import your main app component
import App from './App';

// Register the main application
AppRegistry.registerComponent('main', () => App);

// Register the playback service
TrackPlayer.registerPlaybackService(() => playbackService);