<template>
  <view class="controls">
    <button class="secondary" @tap="$emit('previous')">上一首</button>
    <button class="primary" @tap="$emit(isPlaying ? 'pause' : 'play')">
      {{ isPlaying ? '暂停' : '播放' }}
    </button>
    <button class="secondary" @tap="$emit('next')">下一首</button>
  </view>
</template>

<script setup lang="ts">
defineProps<{
  isPlaying: boolean
}>()

defineEmits<{
  play: []
  pause: []
  previous: []
  next: []
}>()
</script>

<style scoped lang="scss">
.controls {
  display: grid;
  grid-template-columns: 1fr 1.4fr 1fr;
  gap: 10px;
}

button {
  height: 44px;
  padding: 0;
  border-radius: 8px;
  font-size: 14px;
  line-height: 44px;
}

.primary {
  color: #101419;
  background: #d6ad75;
}

.secondary {
  color: #f4f0e8;
  background: #202833;
}
</style>
