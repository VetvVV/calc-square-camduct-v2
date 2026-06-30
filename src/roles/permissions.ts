import type { UserRole } from '../types'

export type LockedFeature =
  | 'specification'
  | 'addSpecItem'
  | 'editSpecItem'
  | 'removeSpecItem'
  | 'projectFiles'
  | 'exportProject'
  | 'importProject'
  | 'printProject'
  | 'internalLogic'
  | 'formulaDetails'
  | 'camductMode'
  | 'debugPanel'

export interface RolePermissions {
  canViewHome: boolean
  canViewAtlas: boolean
  canViewCalculator: boolean
  canUseCalculator: boolean
  canViewSpecification: boolean
  canAddSpecItem: boolean
  canEditSpecItem: boolean
  canRemoveSpecItem: boolean
  canUseProjectFiles: boolean
  canExportProject: boolean
  canImportProject: boolean
  canPrintProject: boolean
  canViewInternalLogic: boolean
  canViewFormulaDetails: boolean
  canViewCamductMode: boolean
  canViewDebugPanel: boolean
  calculationLimit: number | null
}

export const rolePermissions: Record<UserRole, RolePermissions> = {
  guest: {
    canViewHome: true,
    canViewAtlas: true,
    canViewCalculator: true,
    canUseCalculator: true,
    canViewSpecification: false,
    canAddSpecItem: false,
    canEditSpecItem: false,
    canRemoveSpecItem: false,
    canUseProjectFiles: false,
    canExportProject: false,
    canImportProject: false,
    canPrintProject: false,
    canViewInternalLogic: false,
    canViewFormulaDetails: false,
    canViewCamductMode: false,
    canViewDebugPanel: false,
    calculationLimit: 5,
  },
  user: {
    canViewHome: true,
    canViewAtlas: true,
    canViewCalculator: true,
    canUseCalculator: true,
    canViewSpecification: true,
    canAddSpecItem: true,
    canEditSpecItem: false,
    canRemoveSpecItem: false,
    canUseProjectFiles: false,
    canExportProject: false,
    canImportProject: false,
    canPrintProject: false,
    canViewInternalLogic: false,
    canViewFormulaDetails: false,
    canViewCamductMode: false,
    canViewDebugPanel: false,
    calculationLimit: 20,
  },
  client: {
    canViewHome: true,
    canViewAtlas: true,
    canViewCalculator: true,
    canUseCalculator: true,
    canViewSpecification: true,
    canAddSpecItem: true,
    canEditSpecItem: true,
    canRemoveSpecItem: true,
    canUseProjectFiles: true,
    canExportProject: true,
    canImportProject: true,
    canPrintProject: false,
    canViewInternalLogic: false,
    canViewFormulaDetails: false,
    canViewCamductMode: false,
    canViewDebugPanel: false,
    calculationLimit: null,
  },
  service: {
    canViewHome: true,
    canViewAtlas: true,
    canViewCalculator: true,
    canUseCalculator: true,
    canViewSpecification: true,
    canAddSpecItem: true,
    canEditSpecItem: true,
    canRemoveSpecItem: true,
    canUseProjectFiles: true,
    canExportProject: true,
    canImportProject: true,
    canPrintProject: true,
    canViewInternalLogic: true,
    canViewFormulaDetails: true,
    canViewCamductMode: true,
    canViewDebugPanel: true,
    calculationLimit: null,
  },
  admin: {
    canViewHome: true,
    canViewAtlas: true,
    canViewCalculator: true,
    canUseCalculator: true,
    canViewSpecification: true,
    canAddSpecItem: true,
    canEditSpecItem: true,
    canRemoveSpecItem: true,
    canUseProjectFiles: true,
    canExportProject: true,
    canImportProject: true,
    canPrintProject: true,
    canViewInternalLogic: true,
    canViewFormulaDetails: true,
    canViewCamductMode: true,
    canViewDebugPanel: true,
    calculationLimit: null,
  },
}

export function getRolePermissions(role: UserRole) {
  return rolePermissions[role]
}

export const canViewAtlas = (role: UserRole) => getRolePermissions(role).canViewAtlas
export const canViewCalculator = (role: UserRole) => getRolePermissions(role).canViewCalculator
export const canUseCalculator = (role: UserRole) => getRolePermissions(role).canUseCalculator
export const canViewSpecification = (role: UserRole) => getRolePermissions(role).canViewSpecification
export const canAddSpecItem = (role: UserRole) => getRolePermissions(role).canAddSpecItem
export const canEditSpecItem = (role: UserRole) => getRolePermissions(role).canEditSpecItem
export const canRemoveSpecItem = (role: UserRole) => getRolePermissions(role).canRemoveSpecItem
export const canUseProjectFiles = (role: UserRole) => getRolePermissions(role).canUseProjectFiles
export const canExportProject = (role: UserRole) => getRolePermissions(role).canExportProject
export const canImportProject = (role: UserRole) => getRolePermissions(role).canImportProject
export const canPrintProject = (role: UserRole) => getRolePermissions(role).canPrintProject
export const canViewInternalLogic = (role: UserRole) => getRolePermissions(role).canViewInternalLogic
export const canViewFormulaDetails = (role: UserRole) => getRolePermissions(role).canViewFormulaDetails
export const canViewCamductMode = (role: UserRole) => getRolePermissions(role).canViewCamductMode
export const canViewDebugPanel = (role: UserRole) => getRolePermissions(role).canViewDebugPanel
export const getCalculationLimit = (role: UserRole) => getRolePermissions(role).calculationLimit

export function getLockedFeatureMessage(_role: UserRole, feature: LockedFeature) {
  if (feature === 'camductMode' || feature === 'debugPanel' || feature === 'internalLogic' || feature === 'formulaDetails') {
    return 'access.serviceOnlyFeature'
  }
  if (feature === 'exportProject' || feature === 'importProject' || feature === 'printProject' || feature === 'projectFiles') {
    return 'access.clientOnlyFeature'
  }
  return 'access.lockedDescription'
}
