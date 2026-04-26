import type { AdAdapter, AdPlacement } from '../types/ads'

const INTERSTITIAL_LAST_SHOWN_KEY = 'sleep-noise:interstitial-last-shown'
const INTERSTITIAL_INTERVAL_MS = 6 * 60 * 60 * 1000

export class AdService {
  constructor(private readonly adapter: AdAdapter) {}

  showBanner(placement: AdPlacement): Promise<void> {
    return this.adapter.showBanner(placement)
  }

  showRewardedVideo(placement: AdPlacement): Promise<boolean> {
    return this.adapter.showRewardedVideo(placement)
  }

  async showLowFrequencyInterstitial(): Promise<void> {
    const now = Date.now()
    const lastShown = Number(uni.getStorageSync(INTERSTITIAL_LAST_SHOWN_KEY) || 0)

    if (now - lastShown < INTERSTITIAL_INTERVAL_MS) {
      return
    }

    await this.adapter.showInterstitial('low-frequency-interstitial')
    uni.setStorageSync(INTERSTITIAL_LAST_SHOWN_KEY, now)
  }
}
