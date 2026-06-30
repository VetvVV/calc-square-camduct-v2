import type { UserRole } from '../types'

export const guestCalculationLimitPerDay = 5

export const privilegedRoles: UserRole[] = ['user', 'client', 'admin', 'service']

export function isGuestRole(role: UserRole) {
  return role === 'guest'
}

export function bypassesGuestLimit(role: UserRole) {
  return privilegedRoles.includes(role)
}
