import { beforeEach, describe, expect, it, vi } from 'vitest'
import { SleepTimer } from '../../src/services/timer-service'
import { formatDuration } from '../../src/utils/time'

describe('timer-service', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  it('calls completion when duration elapses', () => {
    const onComplete = vi.fn()
    const timer = new SleepTimer(onComplete)

    timer.start(15)
    vi.advanceTimersByTime(15 * 60 * 1000)

    expect(onComplete).toHaveBeenCalledTimes(1)
  })

  it('cancels active timer', () => {
    const onComplete = vi.fn()
    const timer = new SleepTimer(onComplete)

    timer.start(15)
    timer.cancel()
    vi.advanceTimersByTime(15 * 60 * 1000)

    expect(onComplete).not.toHaveBeenCalled()
  })

  it('uses newest timer when restarted', () => {
    const onComplete = vi.fn()
    const timer = new SleepTimer(onComplete)

    timer.start(15)
    timer.start(30)
    vi.advanceTimersByTime(15 * 60 * 1000)
    expect(onComplete).not.toHaveBeenCalled()

    vi.advanceTimersByTime(15 * 60 * 1000)
    expect(onComplete).toHaveBeenCalledTimes(1)
  })
})

describe('formatDuration', () => {
  it('formats seconds as minutes and seconds', () => {
    expect(formatDuration(65)).toBe('01:05')
  })
})
