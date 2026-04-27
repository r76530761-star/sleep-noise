export type ProtocolStatus = 'active' | 'reserved'

export interface SleepProtocol {
  id: string
  title: string
  mixLabel: string
  durationMinutes: number
  fadeLabel: string
  status: ProtocolStatus
  audioTrackId: string
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
