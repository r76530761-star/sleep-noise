export const SLEEP_TIMER_OPTIONS = [15, 30, 45, 60, 90] as const

export type SleepTimerMinutes = (typeof SLEEP_TIMER_OPTIONS)[number]

export class SleepTimer {
  private timerId: ReturnType<typeof setTimeout> | undefined

  constructor(private readonly onComplete: () => void) {}

  start(minutes: SleepTimerMinutes): void {
    this.cancel()
    this.timerId = setTimeout(() => {
      this.timerId = undefined
      this.onComplete()
    }, minutes * 60 * 1000)
  }

  cancel(): void {
    if (this.timerId !== undefined) {
      clearTimeout(this.timerId)
      this.timerId = undefined
    }
  }

  isActive(): boolean {
    return this.timerId !== undefined
  }
}
