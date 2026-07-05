import { type KeyboardEvent, useEffect, useMemo, useState } from 'react'
import { useAppStore } from '../../store/appStore'
import { useProjectStore } from '../../store/projectStore'
import { addItem } from '../../domain/specification/specificationManager'
import { createSpecificationItem } from '../../domain/specification/itemFactory'
import { calculateR001PrototypeDemo } from '../../prototypes/r001DemoEngine'
import { canAddSpecItem, canViewDebugPanel } from '../../roles/permissions'
import type { UserRole } from '../../types'
import { AccessInvitationDialog } from '../Common/AccessInvitationDialog'

type PrototypeAccessState = 'guest' | 'user' | 'client' | 'admin'

const ACCESS_STATUS: Record<PrototypeAccessState, string> = {
  guest: 'Ознакомительный расчёт',
  user: 'Ознакомительный доступ',
  client: 'Рабочий кабинет подключён',
  admin: 'Администрирование',
}

const MATERIALS = [
  { key: 'galvanized', label: 'Оцинкованная сталь' },
  { key: 'ss430', label: 'Нержавеющая 430 техническая' },
  { key: 'ss304', label: 'Нержавеющая 304 пищевая' },
]

function accessFromRole(role: UserRole): PrototypeAccessState {
  if (role === 'admin' || role === 'service') return 'admin'
  if (role === 'client') return 'client'
  if (role === 'user') return 'user'
  return 'guest'
}

function round3(value: number) {
  return Number(value.toFixed(3))
}

function round2(value: number) {
  return Number(value.toFixed(2))
}

export function R001WorkspaceCalculator() {
  const role = useAppStore((state) => state.role)
  const project = useProjectStore((state) => state.project)
  const setProject = useProjectStore((state) => state.setProject)
  const [access, setAccess] = useState<PrototypeAccessState>(() => accessFromRole(role))
  const [engineeringOn, setEngineeringOn] = useState(false)
  const [diameter, setDiameter] = useState(125)
  const [length, setLength] = useState(1000)
  const [quantity, setQuantity] = useState(1)
  const [material, setMaterial] = useState(MATERIALS[0].key)
  const [thickness, setThickness] = useState(0.5)
  const [comment, setComment] = useState('')
  const [optionsOpen, setOptionsOpen] = useState(false)
  const [holesCount, setHolesCount] = useState(0)
  const [added, setAdded] = useState(false)
  const [invitationOpen, setInvitationOpen] = useState(false)
  const result = useMemo(() => calculateR001PrototypeDemo({ diameter, length, thickness }), [diameter, length, thickness])
  const materialLabel = MATERIALS.find((option) => option.key === material)?.label ?? MATERIALS[0].label
  const canAdd = canAddSpecItem(role) && access !== 'guest'
  const areaTotal = round3(result.area * quantity)
  const massRaw = result.area * quantity * (thickness / 1000) * 7850
  const description = `Труба прямошовная · D ${diameter} мм · L ${length} мм · ${quantity} шт · ${materialLabel} · ${thickness} мм`
  const showEngineering = canViewDebugPanel(role) && access === 'admin' && engineeringOn

  useEffect(() => {
    setAccess(accessFromRole(role))
    if (!canViewDebugPanel(role)) setEngineeringOn(false)
  }, [role])

  const handleNumberKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return
    event.preventDefault()
    event.currentTarget.blur()
  }

  const handleAdd = () => {
    if (!canAdd) {
      setInvitationOpen(true)
      return
    }

    const item = createSpecificationItem('round-duct')
    item.quantity = quantity
    item.comment = comment
    item.parameters = { A: diameter, B: length, holes: holesCount }
    item.options = { material, thickness, prototypeFlow: true }
    item.calculated = {
      areaRaw: result.area * quantity,
      areaDisplay: areaTotal,
      massRaw,
      massDisplay: round2(massRaw),
    }
    item.moduleMetadata = {
      prototype: 'r001-public-service',
      holesCount,
      seamType: result.seamType,
      allowance: result.allowance,
    }

    setProject(addItem(project, item))
    setAdded(true)
    window.setTimeout(() => setAdded(false), 2400)
  }

  return (
    <div className="r001-split-panel r001-prototype-page">
      <div className="r001-watermark" aria-hidden="true"><span>ОПЫТНЫЙ ОБРАЗЕЦ</span></div>

      <div className="r001-workspace-title">
        <span>Опытный UI-прототип</span>
        <h3>R-001 / Труба прямошовная</h3>
      </div>

      <div className="r001-testmode" aria-label="Тестовый режим прототипа">
        <span className="r001-testmode-label">Тестовый режим прототипа</span>
        <div className="r001-testmode-buttons">
          {(['guest', 'user', 'client', 'admin'] as PrototypeAccessState[]).map((state) => (
            <button key={state} type="button" className={access === state ? 'is-active' : ''} onClick={() => setAccess(state)}>
              {ACCESS_STATUS[state]}
            </button>
          ))}
        </div>
      </div>

      <div className="r001-status-bar">
        <div className="r001-status-left">
          <span className="r001-status-chip">{ACCESS_STATUS[access]}</span>
          <span className="r001-spec-indicator">Спецификация · {project.items.length} позиций</span>
        </div>
        {canViewDebugPanel(role) ? (
          <button
            type="button"
            className={`r001-eng-toggle${engineeringOn ? ' is-on' : ''}`}
            onClick={() => setEngineeringOn((value) => !value)}
            aria-label={engineeringOn ? 'Инженерный режим включён' : 'Инженерный режим выключен'}
          >
            {engineeringOn ? '⚙ ON' : '⚙ OFF'}
          </button>
        ) : null}
      </div>

      <section className="r001-public-form" aria-label="R-001 рабочий калькулятор">
        <label className="r001-field-d">
          D / Диаметр, мм
          <input type="number" value={diameter} onKeyDown={handleNumberKeyDown} onChange={(event) => setDiameter(Number(event.target.value || 0))} />
        </label>
        <label className="r001-field-l">
          L / Длина, мм
          <input type="number" value={length} onKeyDown={handleNumberKeyDown} onChange={(event) => setLength(Number(event.target.value || 0))} />
        </label>
        <label>
          Количество
          <input type="number" min={1} value={quantity} onKeyDown={handleNumberKeyDown} onChange={(event) => setQuantity(Math.max(1, Number(event.target.value || 1)))} />
        </label>
        <label>
          Материал
          <select value={material} onChange={(event) => setMaterial(event.target.value)}>
            {MATERIALS.map((option) => (
              <option key={option.key} value={option.key}>{option.label}</option>
            ))}
          </select>
        </label>
        <label>
          Толщина, мм
          <select value={thickness} onChange={(event) => setThickness(Number(event.target.value))}>
            <option value={0.5}>0.5</option>
            <option value={0.7}>0.7</option>
            <option value={0.9}>0.9</option>
          </select>
        </label>

        <div className="r001-options">
          <button type="button" className="r001-options-head" aria-expanded={optionsOpen} onClick={() => setOptionsOpen((value) => !value)}>
            Опции {optionsOpen ? '▾' : '▸'}
          </button>
          {optionsOpen ? (
            <div className="r001-options-body">
              <div className="r001-options-section">
                <span>Отверстия</span>
                <button type="button" onClick={() => setHolesCount((value) => value + 1)}>Добавить отверстие</button>
                {holesCount ? <span className="r001-options-count">Отверстий: {holesCount}</span> : null}
              </div>
            </div>
          ) : null}
        </div>

        <div className="r001-spec-block">
          <div className="r001-spec-area">Площадь: <strong>{areaTotal.toFixed(3)} м²</strong></div>
          {showEngineering ? <div className="r001-spec-area">Масса: <strong>{round2(massRaw).toFixed(2)} кг</strong></div> : null}
          <div className="r001-spec-description">{description}</div>
          <label className="r001-comment-field">
            Комментарий
            <textarea value={comment} onChange={(event) => setComment(event.target.value)} />
          </label>
          <button type="button" className={`r001-add-project${canAdd ? ' r001-primary' : ' is-muted'}${added ? ' is-added' : ''}`} onClick={handleAdd}>
            {added ? 'Добавлено в проект' : 'Добавить в проект'}
          </button>
        </div>
      </section>

      <AccessInvitationDialog open={invitationOpen} onClose={() => setInvitationOpen(false)} />
    </div>
  )
}
