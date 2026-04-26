<template>
  <view class="page home">
    <view class="hero">
      <text class="eyebrow">睡前安静一点</text>
      <text class="title">睡眠白噪音</text>
    </view>

    <view class="section">
      <text class="section-title">推荐入眠</text>
      <AudioCard
        v-for="track in library.recommendedTracks"
        :key="track.id"
        :track="track"
        :favorite="library.isFavorite(track.id)"
        @play="playTrack"
        @favorite="library.toggleFavorite"
      />
    </view>

    <view v-if="library.recentTracks.length > 0" class="section">
      <text class="section-title">最近播放</text>
      <AudioCard
        v-for="track in library.recentTracks"
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
.hero {
  margin-bottom: 24px;
}

.eyebrow,
.title,
.section-title {
  display: block;
}

.eyebrow {
  color: #aeb7c2;
  font-size: 14px;
}

.title {
  margin-top: 8px;
  color: #f4f0e8;
  font-size: 28px;
  font-weight: 700;
}

.section {
  display: grid;
  gap: 10px;
  margin-top: 24px;
}

.section-title {
  color: #f4f0e8;
  font-size: 18px;
  font-weight: 600;
}
</style>
