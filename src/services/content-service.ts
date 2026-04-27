import type { AudioCategory, AudioCategoryGroup, AudioTrack } from '../types/audio'
import { invariant } from '../utils/assert'

const CATEGORY_META: Record<AudioCategory, { title: string; description: string }> = {
  rain: { title: '雨声', description: '适合睡前和夜间放松' },
  ocean: { title: '海浪', description: '轻柔规律的海边环境声' },
  forest: { title: '森林', description: '自然、安静、低刺激' },
  wind: { title: '风声', description: '柔和风声与空间感' },
  fire: { title: '火焰', description: '温暖的火焰与壁炉声' },
  stream: { title: '溪流', description: '连续水流声，适合午休' },
  city: { title: '城市环境', description: '轻背景氛围，适合放松' },
  meditation: { title: '冥想放松', description: '低干扰冥想与呼吸场景' },
}

function isSupportedCoverUrl(value: string): boolean {
  return value.startsWith('https://') || value.startsWith('/static/')
}

function getPriorityScore(track: AudioTrack): number {
  if (track.id === 'fireplace-001') {
    return 0
  }

  return track.scene.includes('sleep') ? 1 : 2
}

export function validateAudioManifest(tracks: AudioTrack[]): void {
  const ids = new Set<string>()

  for (const track of tracks) {
    invariant(track.id.trim().length > 0, 'Audio id is required')
    invariant(!ids.has(track.id), `Duplicate audio id: ${track.id}`)
    invariant(track.title.trim().length > 0, `Audio title is required: ${track.id}`)
    invariant(track.duration > 0, `Audio duration must be positive: ${track.id}`)
    invariant(track.audioUrl.startsWith('https://'), `Audio URL must use HTTPS: ${track.id}`)
    invariant(isSupportedCoverUrl(track.coverUrl), `Cover URL must use HTTPS or /static path: ${track.id}`)
    invariant(track.scene.length > 0, `At least one scene is required: ${track.id}`)
    invariant(track.copyrightRef.trim().length > 0, `Copyright ref is required: ${track.id}`)
    ids.add(track.id)
  }
}

export function groupTracksByCategory(tracks: AudioTrack[]): AudioCategoryGroup[] {
  return Object.entries(CATEGORY_META).map(([id, meta]) => ({
    id: id as AudioCategory,
    title: meta.title,
    description: meta.description,
    tracks: tracks.filter((track) => track.category === id),
  }))
}

export function getRecommendedTracks(tracks: AudioTrack[], limit = 6): AudioTrack[] {
  return [...tracks]
    .sort((left, right) => getPriorityScore(left) - getPriorityScore(right))
    .slice(0, limit)
}
