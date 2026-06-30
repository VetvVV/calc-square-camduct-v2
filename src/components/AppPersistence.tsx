import { useEffect } from 'react'
import { loadProjectFromStorage, saveProjectToStorage } from '../data/storage'
import { useProjectStore } from '../store/projectStore'

export function AppPersistence() {
  const project = useProjectStore((state) => state.project)
  const setProject = useProjectStore((state) => state.setProject)

  useEffect(() => {
    setProject(loadProjectFromStorage())
  }, [setProject])

  useEffect(() => {
    saveProjectToStorage(project)
  }, [project])

  return null
}
