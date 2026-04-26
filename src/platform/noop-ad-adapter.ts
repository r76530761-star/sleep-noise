import type { AdAdapter, AdPlacement } from '../types/ads'

export class NoopAdAdapter implements AdAdapter {
  async showBanner(_placement: AdPlacement): Promise<void> {
    return Promise.resolve()
  }

  async showRewardedVideo(_placement: AdPlacement): Promise<boolean> {
    return Promise.resolve(false)
  }

  async showInterstitial(_placement: AdPlacement): Promise<void> {
    return Promise.resolve()
  }
}
