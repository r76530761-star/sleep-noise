<template>
  <view class="page settings">
    <view class="group">
      <button @tap="openDocument('privacy')">隐私政策</button>
      <button @tap="openDocument('terms')">用户协议</button>
      <button @tap="openDocument('copyright')">素材版权说明</button>
      <button open-type="feedback">反馈</button>
    </view>
    <text class="version">版本 0.1.0</text>
  </view>
</template>

<script setup lang="ts">
function openDocument(type: 'privacy' | 'terms' | 'copyright'): void {
  const titleMap = {
    privacy: '隐私政策',
    terms: '用户协议',
    copyright: '素材版权说明',
  }

  uni.showModal({
    title: titleMap[type],
    content: '正式上线前将替换为完整文档页面。',
    showCancel: false,
  })
}
</script>

<style scoped lang="scss">
.settings {
  display: grid;
  gap: 20px;
}

.group {
  display: grid;
  gap: 10px;
}

button {
  height: 44px;
  color: #f4f0e8;
  font-size: 15px;
  line-height: 44px;
  text-align: left;
  background: #171d24;
  border-radius: 8px;
}

.version {
  color: #aeb7c2;
  font-size: 12px;
  text-align: center;
}
</style>
