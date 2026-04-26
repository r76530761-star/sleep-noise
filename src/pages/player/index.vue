<template>
  <view class="page player">
    <image v-if="track" class="cover" :src="track.coverUrl" mode="aspectFill" />
    <view class="info">
      <text class="title">{{ track?.title ?? '选择一个声音' }}</text>
      <text class="meta">{{ track?.tags.join(' · ') ?? '从首页开始播放' }}</text>
    </view>

    <PlayerControls
      :is-playing="player.isPlaying"
      @play="resumeCurrent"
      @pause="player.pause"
      @previous="playOffset(-1)"
      @next="playOffset(1)"
    />

    <SleepTimerSheet
      class="timer"
      @select="player.startSleepTimer"
      @cancel="player.cancelSleepTimer"
    />

    <text v-if="player.snapshot.timerActive" class="status">定时关闭已开启</text>
    <text v-if="player.snapshot.errorMessage" class="error">{{ player.snapshot.errorMessage }}</text>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import PlayerControls from '../../components/PlayerControls.vue'
import SleepTimerSheet from '../../components/SleepTimerSheet.vue'
import { useLibraryStore } from '../../store/library-store'
import { usePlayerStore } from '../../store/player-store'

const library = useLibraryStore()
const player = usePlayerStore()

const track = computed(() => player.currentTrack ?? library.recommendedTracks[0])

async function resumeCurrent(): Promise<void> {
  if (track.value) {
    await player.play(track.value)
    library.refreshRecentPlays()
  }
}

async function playOffset(offset: number): Promise<void> {
  const tracks = library.allTracks
  if (!track.value || tracks.length === 0) {
    return
  }
  const currentIndex = tracks.findIndex((item) => item.id === track.value?.id)
  const nextIndex = (currentIndex + offset + tracks.length) % tracks.length
  await player.play(tracks[nextIndex])
  library.refreshRecentPlays()
}
</script>

<style scoped lang="scss">
.player {
  display: grid;
  gap: 20px;
}

.cover {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 8px;
}

.info {
  display: grid;
  gap: 6px;
  text-align: center;
}

.title {
  color: #f4f0e8;
  font-size: 22px;
  font-weight: 700;
}

.meta,
.status {
  color: #aeb7c2;
  font-size: 13px;
}

.error {
  color: #d6ad75;
  font-size: 13px;
  text-align: center;
}
</style>
