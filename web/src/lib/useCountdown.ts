import { useEffect, useRef, useState } from 'react'

/**
 * A live, ticking countdown. Starts at `seconds` and decrements once per second
 * down to 0. Re-seeds whenever `seconds` changes. Used to mirror the charge.
 */
export function useCountdown(seconds: number | null): number {
  const [remaining, setRemaining] = useState(seconds ?? 0)
  const ref = useRef<number | null>(null)

  useEffect(() => {
    if (seconds == null) return
    setRemaining(seconds)
    const id = window.setInterval(() => {
      setRemaining((r) => (r <= 0 ? 0 : r - 1))
    }, 1000)
    ref.current = id
    return () => window.clearInterval(id)
  }, [seconds])

  return remaining
}

/** Format seconds as m:ss. */
export function fmtClock(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}
