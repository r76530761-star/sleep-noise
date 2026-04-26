<template>
  <view class="page category">
    <view v-for="group in library.categories" :key="group.id" class="section">
      <view class="heading">
        <text class="title">{{ group.title }}</text>
        <text class="description">{{ group.description }}</text>
      </view>
      <AudioCard
        v-for="track in group.tracks"
        :key="track.id"
        :track="track"
        :favorite="library.isFavorite(track.id)"
        @play="playTrack"
        @favorite="library.toggleFavorite"
      />
    </view>
  </view>
</template>

<script setup lang="ts">
import AudioCard from '../../components/AudioCard.vue'
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
.section {
  display: grid;
  gap: 10px;
  margin-bottom: 24px;
}

.heading {
  display: grid;
  gap: 4px;
}

.title {
  color: #f4f0e8;
  font-size: 18px;
  font-weight: 600;
}

.description {
  color: #aeb7c2;
  font-size: 13px;
}
</style>
