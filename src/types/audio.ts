export type AudioCategory =
  | 'rain'
  | 'ocean'
  | 'forest'
  | 'wind'
  | 'fire'
  | 'stream'
  | 'city'
  | 'meditation'

export type AudioScene = 'sleep' | 'relax' | 'nap' | 'focus'

export type AudioSourceType = 'licensed-free' | 'ai-generated' | 'self-produced'

export interface AudioTrack {
  id: string
  title: string
  category: AudioCategory
  scene: AudioScene[]
  duration: number
  audioUrl: string
  coverUrl: string
  tags: string[]
  isPremium: boolean
  sourceType: AudioSourceType
  copyrightRef: string
}

export interface AudioCategoryGroup {
  id: AudioCategory
  title: string
  description: string
  tracks: AudioTrack[]
}
