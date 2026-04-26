<template>
  <view class="page favorites">
    <EmptyState v-if="library.favoriteTracks.length === 0" text="还没有收藏的声音" />
    <template v-else>
      <AudioCard
        v-for="track in library.favoriteTracks"
        :key="track.id"
        :track="track"
        :favorite="true"
        @play="playTrack"
        @favorite="library.toggleFavorite"
      />
    </template>
  </view>
</template>

<script setup lang="ts">
import AudioCard from '../../components/AudioCard.vue'
import EmptyState from '../../components/EmptyState.vue'
import { useLibraryStore } from '../../store/library-store'
import { usePlayerStore } from '../../store/player-store'
import type { AudioTrack } from '../../types/audio'

const library = useLibraryStore()
const player = usePlayerStore()

async function playTrack(track: AudioTrack): Promise<void> {
  await player.play(track)
  library.refreshRecentPlays()
  uni.navigateTo({ url: `/pages/player/index?id=${track.id}` })
}
</script>

<style scoped lang="scss">
.favorites {
  display: grid;
  gap: 10px;
}
</style>
