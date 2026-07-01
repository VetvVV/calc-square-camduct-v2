import { useMemo, useRef, useState } from 'react'
import { deserializeProject, serializeProject } from '../../data/serialization'
import { clearProjectFromStorage, loadProjectFromStorage, saveProjectToStorage } from '../../data/storage'
import { migrateImportedProject } from '../../data/migrations'
import { validateImportedProject } from '../../data/importValidation'
import { validateProjectForExport } from '../../data/exportValidation'
import { withRecalculatedTotals } from '../../domain/specification/specificationManager'
import type { SpecificationProject } from '../../types'
import { useProjectStore } from '../../store/projectStore'
import { useAppStore } from '../../store/appStore'
import { canExportProject, canImportProject, canUseProjectFiles } from '../../roles/permissions'
import { downloadTextFile } from '../../utils/download'
import { Alert } from '../Common/Alert'
import { AccessInvitationDialog } from '../Common/AccessInvitationDialog'
import { StatusBanner } from '../Common/StatusBanner'
import { useTranslation } from 'react-i18next'

interface ActionState {
  tone: 'info' | 'warning' | 'error' | 'success'
  title: string
  description: string
  issues?: string[]
}

interface SpecActionsProps {
  locked?: boolean
}

export function SpecActions({ locked = false }: SpecActionsProps) {
  const { t } = useTranslation()
  const role = useAppStore((state) => state.role)
  const project = useProjectStore((state) => state.project)
  const setProject = useProjectStore((state) => state.setProject)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [actionState, setActionState] = useState<ActionState | null>(null)
  const [lockedDialogOpen, setLockedDialogOpen] = useState(false)
  const filesAllowed = !locked && canUseProjectFiles(role)
  const exportAllowed = !locked && canExportProject(role)
  const importAllowed = !locked && canImportProject(role)

  const projectStats = useMemo(
    () => ({
      items: project.items.length,
      area: project.metadata?.totals?.areaTotal ?? 0,
      mass: project.metadata?.totals?.massTotal ?? 0,
    }),
    [project],
  )

  const showLocked = () => {
    setLockedDialogOpen(true)
  }

  const handleSaveLocal = () => {
    if (!filesAllowed) return showLocked()
    saveProjectToStorage(project)
    setActionState({
      tone: 'success',
      title: t('action.saveLocalSuccessTitle'),
      description: t('action.saveLocalSuccessDescription', { name: project.name || t('project.untitled') }),
    })
  }

  const handleOpenLocal = () => {
    if (!filesAllowed) return showLocked()
    const loaded = loadProjectFromStorage()
    setProject(loaded)
    setActionState({
      tone: 'success',
      title: t('action.openLocalSuccessTitle'),
      description: t('action.openLocalSuccessDescription', { name: loaded.name || t('project.untitled') }),
    })
  }

  const handleClearLocal = () => {
    if (!filesAllowed) return showLocked()
    clearProjectFromStorage()
    setActionState({
      tone: 'warning',
      title: t('action.clearLocalSuccessTitle'),
      description: t('action.clearLocalSuccessDescription'),
    })
  }

  const handleExportJson = () => {
    if (!exportAllowed) return showLocked()
    const validation = validateProjectForExport(project)
    if (!validation.valid) {
      setActionState({
        tone: 'error',
        title: t('action.exportErrorTitle'),
        description: t('action.exportErrorDescription'),
        issues: validation.issues,
      })
      return
    }

    downloadTextFile('calc-square-project.json', serializeProject(project))
    setActionState({
      tone: 'success',
      title: t('action.exportSuccessTitle'),
      description: t('action.exportSuccessDescription', { items: project.items.length }),
    })
  }

  const handlePickFile = () => {
    if (!importAllowed) return showLocked()
    fileInputRef.current?.click()
  }

  const handleImportJson = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!importAllowed) return showLocked()
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const raw = await file.text()
      const parsed = deserializeProject(raw)
      const validation = validateImportedProject(parsed)

      if (!validation.valid) {
        setActionState({
          tone: 'error',
          title: t('action.importErrorTitle'),
          description: t('action.importErrorDescription', { fileName: file.name }),
          issues: validation.issues,
        })
        event.target.value = ''
        return
      }

      const migrated = migrateImportedProject(parsed as SpecificationProject)
      const normalized = withRecalculatedTotals(migrated)
      setProject(normalized)
      setActionState({
        tone: 'success',
        title: t('action.importSuccessTitle'),
        description: t('action.importSuccessDescription', {
          fileName: file.name,
          items: normalized.items.length,
        }),
      })
    } catch {
      setActionState({
        tone: 'error',
        title: t('action.importErrorTitle'),
        description: t('action.importParseErrorDescription', { fileName: file.name }),
      })
    } finally {
      event.target.value = ''
    }
  }

  return (
    <div className="brand-section p-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{t('action.projectActionsTitle')}</h3>
          <p className="mt-1 max-w-2xl text-sm text-slate-600">{t('action.projectActionsDescription')}</p>
        </div>
        <div className="grid grid-cols-3 gap-2 rounded-lg border border-[#d1d5db] bg-[#f6f7f8] p-2 text-center text-xs text-slate-600 lg:min-w-[360px]">
          <div className="rounded-md bg-white px-3 py-2">
            <div className="font-semibold text-slate-900">{projectStats.items}</div>
            <div>{t('action.statsItems')}</div>
          </div>
          <div className="rounded-md bg-white px-3 py-2">
            <div className="font-semibold text-slate-900">{projectStats.area.toFixed(3)}</div>
            <div>{t('common.area')}</div>
          </div>
          <div className="rounded-md bg-white px-3 py-2">
            <div className="font-semibold text-slate-900">{projectStats.mass.toFixed(2)}</div>
            <div>{t('common.mass')}</div>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
        <button type="button" onClick={handleSaveLocal} aria-disabled={!filesAllowed} className="brand-action-button px-4 py-2 text-sm">
          {t('action.saveLocal')}
        </button>
        <button type="button" onClick={handleOpenLocal} aria-disabled={!filesAllowed} className="brand-action-button px-4 py-2 text-sm">
          {t('action.openLocal')}
        </button>
        <button type="button" onClick={handleExportJson} aria-disabled={!exportAllowed} className="brand-action-button px-4 py-2 text-sm">
          {t('action.exportJson')}
        </button>
        <button type="button" onClick={handlePickFile} aria-disabled={!importAllowed} className="brand-action-button px-4 py-2 text-sm">
          {t('action.importJson')}
        </button>
        <button type="button" onClick={handleClearLocal} aria-disabled={!filesAllowed} className="rounded-lg border border-[#ead4b5] bg-[#fff7ed] px-4 py-2 text-sm font-extrabold text-[#9a5800] transition hover:bg-[#ffedd5]">
          {t('action.clearLocal')}
        </button>
      </div>

      {actionState ? (
        <div className="mt-5 space-y-3">
          <StatusBanner tone={actionState.tone} title={actionState.title} description={actionState.description} />
          {actionState.issues?.length ? (
            <Alert tone="error" title={t('action.issueListTitle')}>
              <ul className="list-disc space-y-1 pl-5">
                {actionState.issues.map((issue) => (
                  <li key={issue}>{issue}</li>
                ))}
              </ul>
            </Alert>
          ) : null}
        </div>
      ) : null}

      <AccessInvitationDialog open={lockedDialogOpen} onClose={() => setLockedDialogOpen(false)} />

      <input ref={fileInputRef} type="file" accept="application/json,.json" className="hidden" onChange={handleImportJson} />
    </div>
  )
}



