<template>
  <view class="audio-card" @tap="$emit('play', track)">
    <image class="cover" :src="track.coverUrl" mode="aspectFill" />
    <view class="content">
      <text class="title">{{ track.title }}</text>
      <text class="meta">{{ track.tags.join(' · ') }}</text>
    </view>
    <button class="favorite" @tap.stop="$emit('favorite', track.id)">
      {{ favorite ? '已收藏' : '收藏' }}
    </button>
  </view>
</template>

<script setup lang="ts">
import type { AudioTrack } from '../types/audio'

defineProps<{
  track: AudioTrack
  favorite: boolean
}>()

defineEmits<{
  play: [track: AudioTrack]
  favorite: [trackId: string]
}>()
</script>

<style scoped lang="scss">
.audio-card {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 76px;
  padding: 10px;
  border-radius: 8px;
  background: #171d24;
}

.cover {
  width: 56px;
  height: 56px;
  border-radius: 8px;
}

.content {
  flex: 1;
  min-width: 0;
}

.title,
.meta {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.title {
  color: #f4f0e8;
  font-size: 16px;
}

.meta {
  margin-top: 4px;
  color: #aeb7c2;
  font-size: 12px;
}

.favorite {
  width: 64px;
  height: 32px;
  padding: 0;
  color: #101419;
  font-size: 12px;
  line-height: 32px;
  background: #d6ad75;
  border-radius: 8px;
}
</style>
