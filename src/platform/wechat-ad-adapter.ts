import type { AdAdapter, AdPlacement } from '../types/ads'

interface RewardedVideoCloseResult {
  isEnded?: boolean
}

interface RewardedVideoAd {
  onClose(callback: (result?: RewardedVideoCloseResult) => void): void
  onError(callback: () => void): void
  show(): Promise<void>
}

interface InterstitialAd {
  onError(callback: () => void): void
  show(): Promise<void>
}

interface UniAdApi {
  createRewardedVideoAd?: (options: { adUnitId: string }) => RewardedVideoAd
  createInterstitialAd?: (options: { adUnitId: string }) => InterstitialAd
}

const AD_UNIT_IDS: Partial<Record<AdPlacement, string>> = {}

export class WechatAdAdapter implements AdAdapter {
  async showBanner(_placement: AdPlacement): Promise<void> {
    return Promise.resolve()
  }

  async showRewardedVideo(placement: AdPlacement): Promise<boolean> {
    const adUnitId = AD_UNIT_IDS[placement]
    const uniAdApi = uni as UniAdApi
    if (!adUnitId || !uniAdApi.createRewardedVideoAd) {
      return false
    }

    const ad = uniAdApi.createRewardedVideoAd({ adUnitId })
    return new Promise((resolve) => {
      ad.onClose((result) => {
        resolve(Boolean(result?.isEnded))
      })
      ad.onError(() => {
        resolve(false)
      })
      ad.show().catch(() => {
        resolve(false)
      })
    })
  }

  async showInterstitial(placement: AdPlacement): Promise<void> {
    const adUnitId = AD_UNIT_IDS[placement]
    const uniAdApi = uni as UniAdApi
    if (!adUnitId || !uniAdApi.createInterstitialAd) {
      return
    }

    const ad = uniAdApi.createInterstitialAd({ adUnitId })
    ad.onError(() => undefined)
    await ad.show().catch(() => undefined)
  }
}
