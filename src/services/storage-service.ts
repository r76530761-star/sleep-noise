import {
  calculateNextSessionSummary,
  toLocalDateKey,
} from './protocol-service'
import type { SessionSummary } from '../types/protocol'

const FAVORITES_KEY = 'sleep-noise:favorites'
const RECENT_PLAYS_KEY = 'sleep-noise:recent-plays'
const SESSION_SUMMARY_KEY = 'drift:session-summary'
const MAX_RECENT_PLAYS = 20

function readStringArray(key: string): string[] {
  const value = uni.getStorageSync(key)
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []
}

function writeStringArray(key: string, value: string[]): void {
  uni.setStorageSync(key, value)
}

export function getFavorites(): string[] {
  return readStringArray(FAVORITES_KEY)
}

export function addFavorite(trackId: string): void {
  const favorites = getFavorites()
  if (!favorites.includes(trackId)) {
    writeStringArray(FAVORITES_KEY, [...favorites, trackId])
  }
}

export function removeFavorite(trackId: string): void {
  writeStringArray(
    FAVORITES_KEY,
    getFavorites().filter((id) => id !== trackId),
  )
}

export function getRecentPlays(): string[] {
  return readStringArray(RECENT_PLAYS_KEY)
}

export function addRecentPlay(trackId: string): void {
  const next = [trackId, ...getRecentPlays().filter((id) => id !== trackId)].slice(0, MAX_RECENT_PLAYS)
  writeStringArray(RECENT_PLAYS_KEY, next)
}

export function getSessionSummary(): SessionSummary {
  const value = uni.getStorageSync(SESSION_SUMMARY_KEY)
  if (!isSessionSummary(value)) {
    return {
      consecutiveNights: 0,
      sessionCount: 0,
      lastSessionDate: undefined,
    }
  }

  return value
}

export function recordSleepSession(date = new Date()): SessionSummary {
  const next = calculateNextSessionSummary(getSessionSummary(), toLocalDateKey(date))
  uni.setStorageSync(SESSION_SUMMARY_KEY, next)
  return next
}

function isSessionSummary(value: unknown): value is SessionSummary {
  if (!value || typeof value !== 'object') {
    return false
  }

  const candidate = value as Partial<SessionSummary>
  return (
    typeof candidate.consecutiveNights === 'number'
    && typeof candidate.sessionCount === 'number'
    && (
      candidate.lastSessionDate === undefined
      || typeof candidate.lastSessionDate === 'string'
    )
  )
}
