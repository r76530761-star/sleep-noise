import { describe, expect, it } from 'vitest'
import type { AudioTrack } from '../../src/types/audio'
import {
  getRecommendedTracks,
  groupTracksByCategory,
  validateAudioManifest,
} from '../../src/services/content-service'

const tracks: AudioTrack[] = [
  {
    id: 'rain-night-001',
    title: '雨夜入眠',
    category: 'rain',
    scene: ['sleep'],
    duration: 1800,
    audioUrl: 'https://cdn.example.com/audio/rain.mp3',
    coverUrl: 'https://cdn.example.com/covers/rain.jpg',
    tags: ['雨声'],
    isPremium: false,
    sourceType: 'licensed-free',
    copyrightRef: 'copyright-ledger.csv#rain-night-001',
  },
  {
    id: 'city-cafe-001',
    title: '安静咖啡厅',
    category: 'city',
    scene: ['relax', 'focus'],
    duration: 1800,
    audioUrl: 'https://cdn.example.com/audio/city.mp3',
    coverUrl: 'https://cdn.example.com/covers/city.jpg',
    tags: ['城市'],
    isPremium: false,
    sourceType: 'licensed-free',
    copyrightRef: 'copyright-ledger.csv#city-cafe-001',
  },
]

describe('content-service', () => {
  it('validates a complete manifest', () => {
    expect(() => validateAudioManifest(tracks)).not.toThrow()
  })

  it('accepts local static covers', () => {
    expect(() =>
      validateAudioManifest([
        {
          ...tracks[0],
          coverUrl: '/static/covers/fireplace-001.png',
        },
      ]),
    ).not.toThrow()
  })

  it('rejects duplicate track ids', () => {
    expect(() => validateAudioManifest([tracks[0], tracks[0]])).toThrow('Duplicate audio id: rain-night-001')
  })

  it('groups tracks by category', () => {
    const groups = groupTracksByCategory(tracks)

    expect(groups.find((group) => group.id === 'rain')?.tracks).toHaveLength(1)
    expect(groups.find((group) => group.id === 'city')?.tracks).toHaveLength(1)
  })

  it('recommends sleep tracks before relax tracks', () => {
    const recommended = getRecommendedTracks(tracks)

    expect(recommended[0].id).toBe('rain-night-001')
  })
})
