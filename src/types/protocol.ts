import type { SleepTimerMinutes } from '../services/timer-service'

export type ProtocolStatus = 'active' | 'reserved'

export interface SleepProtocol {
  id: string
  aliases: string[]
  title: string
  mixLabel: string
  localizedMixLabel: string
  durationMinutes: SleepTimerMinutes
  fadeLabel: string
  localizedFadeLabel: string
  status: ProtocolStatus
  audioTrackId: string
  visibleInSwitcher: boolean
}

export interface SleepShellState {
  connected: boolean
  label: string
}

export interface SessionSummary {
  consecutiveNights: number
  sessionCount: number
  lastSessionDate: string | undefined
}

export interface ProtocolResolution {
  protocol: SleepProtocol
  requestedProtocolId: string | undefined
  matched: boolean
  fallbackReason: 'matched' | 'default' | 'primary'
}
