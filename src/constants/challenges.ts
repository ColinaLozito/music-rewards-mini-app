// Challenge data with Belong tracks
import { MusicChallenge } from '../types';

export const SAMPLE_CHALLENGES: MusicChallenge[] = [
  {
    id: 'challenge-1',
    title: 'All Night',
    artist: 'Camo & Krooked',
    duration: 219, // 3:39
    points: 150,
    audioUrl: 'https://belong-dev-public2.s3.us-east-1.amazonaws.com/misc/Camo-Krooked-All-Night.mp3',
    description: 'Listen to this drum & bass classic to earn points. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labo',
    difficulty: 'easy',
    completed: false,
    progress: 0,
    artwork: 'https://img.freepik.com/free-photo/abstract-illustration-with-composition_23-2151103482.jpg'
  },
  {
    id: 'challenge-2',
    title: 'New Forms',
    artist: 'Roni Size',
    duration: 464, // 7:44
    points: 300,
    audioUrl: 'https://belong-dev-public2.s3.us-east-1.amazonaws.com/misc/New-Forms-Roni+Size.mp3',
    description: 'Complete this legendary track for bonus points. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labo',
    difficulty: 'medium',
    completed: false,
    progress: 0,
    artwork: 'https://mir-s3-cdn-cf.behance.net/projects/808/13c7d5220898915.Y3JvcCwxNzE0LDEzNDAsMTg1OCwxMDg2.png'
  },
  {
    id: 'challenge-3',
    title: 'Golden Waves',
    artist: 'Pink_Sound',
    duration: 61, // 3:39 (same track as challenge 1)
    points: 200,
    audioUrl: 'https://cdn.pixabay.com/audio/2026/04/17/audio_877760c3c1.mp3',
    description: 'Listen again for extra points - test repeat functionality. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labo',
    difficulty: 'medium',
    completed: false,
    progress: 0,
    artwork: 'https://www.citypng.com/public/uploads/preview/hd-music-graffiti-background-illustration-art-png-7358116962431080owzdlgomm.png'
  },
  {
    id: 'challenge-4',
    title: 'B1',
    artist: 'TWISTERiON',
    duration: 59,
    points: 100,
    audioUrl: 'https://cdn.pixabay.com/audio/2024/07/01/audio_7ca3b3e989.mp3',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labo',
    difficulty: 'easy',
    completed: false,
    progress: 0,
    artwork: 'https://cdn-images.dzcdn.net/images/cover/b6b6eeec88ab444e0e418e6b73b50b44/0x1900-000000-80-0-0.jpg'
  },
  {
    id: 'challenge-5',
    title: 'Golden Waves',
    artist: 'Pink_Sound',
    duration: 23,
    points: 50,
    audioUrl: 'https://cdn.pixabay.com/audio/2026/04/17/audio_b0ee3ce768.mp3',
    description: 'Background music for from calm meditation atmospheres to energetic house. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labo',
    difficulty: 'easy',
    completed: false,
    progress: 0,
    artwork: 'https://www.citypng.com/public/uploads/preview/hd-music-graffiti-background-illustration-art-png-7358116962431080owzdlgomm.png'
  },
  {
    id: 'challenge-6',
    title: 'BROKEN URL TEST',
    artist: 'Camo & Krooked',
    duration: 219, // 3:39 (same track as challenge 1)
    points: 250,
    audioUrl: 'https://belong-dev-public2.s3.us-east-1.amazonawsTEST.com/misc/Camo-Krooked-All-Night.mp3',
    description: 'Listen again for extra points - test repeat functionality. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labo',
    difficulty: 'hard',
    completed: false,
    progress: 0,
    artwork: 'https://img.freepik.com/free-photo/abstract-illustration-with-composition_23-2151103482.jpg'
  },
];
