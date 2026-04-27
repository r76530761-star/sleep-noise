<template>
  <view class="page settings">
    <view class="header">
      <text class="brand">Drift</text>
      <text class="title">设置</text>
    </view>

    <view class="group">
      <text class="group-title">播放行为</text>

      <view class="row">
        <view class="row-copy">
          <text class="row-title">使用默认助眠</text>
          <text class="row-caption">每晚从已选择的助眠开始</text>
        </view>
        <text class="row-status">开启</text>
      </view>

      <view class="row">
        <view class="row-copy">
          <text class="row-title">继续上次助眠</text>
          <text class="row-caption">保留最近一次选择</text>
        </view>
        <text class="row-status">开启</text>
      </view>
    </view>

    <view class="group">
      <text class="group-title">预留</text>

      <view class="row">
        <view class="row-copy">
          <text class="row-title">管理 Tide Shell</text>
          <text class="row-caption">后续用于硬件入口和 NFC 设置</text>
        </view>
        <text class="row-status">future</text>
      </view>
    </view>

    <view class="group">
      <button class="link-row" @tap="openDocument('privacy')">隐私政策</button>
      <button class="link-row" @tap="openDocument('terms')">用户协议</button>
      <button class="link-row" open-type="feedback">反馈</button>
    </view>
  </view>
</template>

<script setup lang="ts">
function openDocument(type: 'privacy' | 'terms'): void {
  const titleMap = {
    privacy: '隐私政策',
    terms: '用户协议',
  }

  uni.showModal({
    title: titleMap[type],
    content: '正式上线前将替换为完整文档。',
    showCancel: false,
  })
}
</script>

<style scoped lang="scss">
.settings {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.header {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 34px;
}

.brand {
  color: #f4f0e8;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 28px;
}

.title {
  color: #aeb8d4;
  font-size: 15px;
}

.group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.group-title {
  color: #8f9bb8;
  font-size: 13px;
}

.row,
.link-row {
  border: 1px solid rgba(212, 224, 255, 0.14);
  border-radius: 8px;
  background: rgba(15, 25, 48, 0.68);
}

.row {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
}

.row-copy {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.row-title {
  color: #f5f1ea;
  font-size: 15px;
}

.row-caption {
  color: #8f9bb8;
  font-size: 12px;
}

.row-status {
  color: #c7b8ff;
  font-size: 12px;
}

.link-row {
  height: 46px;
  padding: 0 16px;
  color: #f5f1ea;
  font-size: 14px;
  line-height: 46px;
  text-align: left;
}
</style>
