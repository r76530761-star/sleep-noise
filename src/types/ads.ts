export type AdPlacement =
  | 'home-banner'
  | 'player-banner'
  | 'category-banner'
  | 'reward-unlock'
  | 'low-frequency-interstitial'

export interface AdAdapter {
  showBanner(placement: AdPlacement): Promise<void>
  showRewardedVideo(placement: AdPlacement): Promise<boolean>
  showInterstitial(placement: AdPlacement): Promise<void>
}
