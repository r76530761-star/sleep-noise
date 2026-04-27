import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  addFavorite,
  addRecentPlay,
  getDefaultProtocolId,
  getFavorites,
  getRecentPlays,
  removeFavorite,
  setDefaultProtocolId,
} from '../../src/services/storage-service'

const memory = new Map<string, unknown>()

vi.stubGlobal('uni', {
  getStorageSync: (key: string) => memory.get(key),
  setStorageSync: (key: string, value: unknown) => memory.set(key, value),
})

describe('storage-service', () => {
  beforeEach(() => {
    memory.clear()
  })

  it('adds and removes favorites', () => {
    addFavorite('rain-night-001')
    expect(getFavorites()).toEqual(['rain-night-001'])

    removeFavorite('rain-night-001')
    expect(getFavorites()).toEqual([])
  })

  it('does not duplicate favorites', () => {
    addFavorite('rain-night-001')
    addFavorite('rain-night-001')

    expect(getFavorites()).toEqual(['rain-night-001'])
  })

  it('moves repeated recent play to front', () => {
    addRecentPlay('rain-night-001')
    addRecentPlay('ocean-soft-001')
    addRecentPlay('rain-night-001')

    expect(getRecentPlays()).toEqual(['rain-night-001', 'ocean-soft-001'])
  })

  it('keeps at most twenty recent plays', () => {
    for (let index = 0; index < 25; index += 1) {
      addRecentPlay(`track-${index}`)
    }

    expect(getRecentPlays()).toHaveLength(20)
    expect(getRecentPlays()[0]).toBe('track-24')
  })

  it('stores the user default protocol id', () => {
    expect(getDefaultProtocolId()).toBeUndefined()

    setDefaultProtocolId('rain_night')

    expect(getDefaultProtocolId()).toBe('rain_night')
  })
})
