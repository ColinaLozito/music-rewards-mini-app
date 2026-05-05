// Challenge data with Belong tracks
import { MusicChallenge } from '../types';

export const SAMPLE_CHALLENGES: MusicChallenge[] = [
  {
    id: 'challenge-1',
    title: 'All Night',
    artist: 'Camo & Krooked',
    duration: 219, // 3:39
    points: 150,
    audioUrl: 'https://belong-dev-public2.s3.us-east-1.amazonaws2.com/misc/Camo-Krooked-All-Night.mp3',
    description: 'Listen to this drum & bass classic to earn points',
    difficulty: 'easy',
    completed: false,
    progress: 0,
  },
  {
    id: 'challenge-2',
    title: 'New Forms',
    artist: 'Roni Size',
    duration: 464, // 7:44
    points: 300,
    audioUrl: 'https://belong-dev-public2.s3.us-east-1.amazonaws.com/misc/New-Forms-Roni+Size.mp3',
    description: 'Complete this legendary track for bonus points',
    difficulty: 'medium',
    completed: false,
    progress: 0,
  },
  {
    id: 'challenge-3',
    title: 'Bonus Challenge',
    artist: 'Camo & Krooked',
    duration: 219, // 3:39 (same track as challenge 1)
    points: 250,
    audioUrl: 'https://belong-dev-public2.s3.us-east-1.amazonaws.com/misc/Camo-Krooked-All-Night.mp3',
    description: 'Listen again for extra points - test repeat functionality',
    difficulty: 'hard',
    completed: false,
    progress: 0,
  },
];
