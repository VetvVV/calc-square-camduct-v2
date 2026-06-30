import { guestCalculationLimitPerDay } from '../constants/roles'

const STORAGE_KEY = 'calc-square-camduct-v2.guest-usage'

interface GuestUsage {
  date: string
  count: number
}

function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

function safeUsage(value: unknown): GuestUsage {
  if (!value || typeof value !== 'object') {
    return { date: todayKey(), count: 0 }
  }

  const candidate = value as Partial<GuestUsage>
  const date = typeof candidate.date === 'string' ? candidate.date : todayKey()
  const count = typeof candidate.count === 'number' && Number.isFinite(candidate.count) ? candidate.count : 0
  return { date, count }
}

export function readGuestUsage(): GuestUsage {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return { date: todayKey(), count: 0 }

  try {
    const parsed = safeUsage(JSON.parse(raw))
    if (parsed.date !== todayKey()) return { date: todayKey(), count: 0 }
    return parsed
  } catch {
    return { date: todayKey(), count: 0 }
  }
}

export function writeGuestUsage(usage: GuestUsage) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(usage))
}

export function incrementGuestUsage() {
  const usage = readGuestUsage()
  const next = { date: todayKey(), count: usage.count + 1 }
  writeGuestUsage(next)
  return next
}

export function clearGuestUsage() {
  localStorage.removeItem(STORAGE_KEY)
}

export function getGuestUsageLimitState() {
  const usage = readGuestUsage()
  return {
    ...usage,
    limit: guestCalculationLimitPerDay,
    remaining: Math.max(guestCalculationLimitPerDay - usage.count, 0),
    exhausted: usage.count >= guestCalculationLimitPerDay,
  }
}
