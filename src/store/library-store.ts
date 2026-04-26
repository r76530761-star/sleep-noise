import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import manifest from '../../content/audio-manifest.json'
import { getRecommendedTracks, groupTracksByCategory, validateAudioManifest } from '../services/content-service'
import {
  addFavorite,
  getFavorites,
  getRecentPlays,
  removeFavorite,
} from '../services/storage-service'
import type { AudioTrack } from '../types/audio'

const tracks = manifest as AudioTrack[]
validateAudioManifest(tracks)

export const useLibraryStore = defineStore('library', () => {
  const favoriteIds = ref<string[]>(getFavorites())
  const recentPlayIds = ref<string[]>(getRecentPlays())

  const allTracks = computed(() => tracks)
  const categories = computed(() => groupTracksByCategory(tracks))
  const recommendedTracks = computed(() => getRecommendedTracks(tracks))

  const favoriteTracks = computed(() =>
    favoriteIds.value
      .map((id) => tracks.find((track) => track.id === id))
      .filter((track): track is AudioTrack => Boolean(track)),
  )

  const recentTracks = computed(() =>
    recentPlayIds.value
      .map((id) => tracks.find((track) => track.id === id))
      .filter((track): track is AudioTrack => Boolean(track)),
  )

  function isFavorite(trackId: string): boolean {
    return favoriteIds.value.includes(trackId)
  }

  function toggleFavorite(trackId: string): void {
    if (isFavorite(trackId)) {
      removeFavorite(trackId)
    } else {
      addFavorite(trackId)
    }
    favoriteIds.value = getFavorites()
  }

  function refreshRecentPlays(): void {
    recentPlayIds.value = getRecentPlays()
  }

  return {
    allTracks,
    categories,
    recommendedTracks,
    favoriteTracks,
    recentTracks,
    isFavorite,
    toggleFavorite,
    refreshRecentPlays,
  }
})
