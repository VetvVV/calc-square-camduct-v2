import type { UserRole } from '../types'
import { getCalculationLimit } from '../roles/permissions'

export const guestCalculationLimitPerDay = 5

export const privilegedRoles: UserRole[] = ['user', 'client', 'admin', 'service']

export function isGuestRole(role: UserRole) {
  return role === 'guest'
}

export function bypassesGuestLimit(role: UserRole) {
  return role !== 'guest'
}

export function calculationLimitForRole(role: UserRole) {
  return getCalculationLimit(role)
}
