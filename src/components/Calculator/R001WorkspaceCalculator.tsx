import { type KeyboardEvent, useEffect, useMemo, useState } from 'react'
import { useAppStore } from '../../store/appStore'
import { useProjectStore } from '../../store/projectStore'
import { addItem } from '../../domain/specification/specificationManager'
import { createSpecificationItem } from '../../domain/specification/itemFactory'
import { calculateR001PrototypeDemo } from '../../prototypes/r001DemoEngine'
import { canAddSpecItem, canViewDebugPanel } from '../../roles/permissions'
import { AccessInvitationDialog } from '../Common/AccessInvitationDialog'
import { R001ProductDiagram } from './R001ProductDiagram'

const MATERIALS = [
  { key: 'galvanized', label: 'Оцинкованная сталь' },
  { key: 'ss430', label: 'Нержавеющая 430 техническая' },
  { key: 'ss304', label: 'Нержавеющая 304 пищевая' },
]

type HoleShape = 'round' | 'rectangular'
type HoleSide = 'top' | 'bottom' | 'left' | 'right'

interface R001Hole {
  id: number
  shape: HoleShape
  side: HoleSide
  size1: number
  size2?: number
  position: number
  quantity: number
}

function round3(value: number) {
  return Number(value.toFixed(3))
}

function round2(value: number) {
  return Number(value.toFixed(2))
}

function holeLabel(hole: R001Hole) {
  const size = hole.shape === 'round'
    ? `круглое D ${hole.size1} мм`
    : `прямоугольное ${hole.size1}×${hole.size2 ?? hole.size1} мм`
  return `${size} × ${hole.quantity}`
}

function holesDescription(holes: R001Hole[]) {
  return holes.length ? `Отверстия: ${holes.map(holeLabel).join('; ')}` : ''
}

function R001HoleModal({ onClose, onAdd }: { onClose: () => void; onAdd: (hole: Omit<R001Hole, 'id'>) => void }) {
  const [shape, setShape] = useState<HoleShape>('rectangular')
  const [side, setSide] = useState<HoleSide>('top')
  const [size1, setSize1] = useState(200)
  const [size2, setSize2] = useState(100)
  const [position, setPosition] = useState(500)
  const [quantity, setQuantity] = useState(1)

  return (
    <div className="r001-modal-backdrop">
      <section className="r001-modal" aria-modal="true" role="dialog" aria-labelledby="r001-workspace-hole-title">
        <h3 id="r001-workspace-hole-title">Отверстие</h3>
        <label>
          Форма отверстия
          <select value={shape} onChange={(event) => setShape(event.target.value as HoleShape)}>
            <option value="round">Круглое</option>
            <option value="rectangular">Прямоугольное</option>
          </select>
        </label>
        <label>
          Сторона
          <select value={side} onChange={(event) => setSide(event.target.value as HoleSide)}>
            <option value="top">Верх</option>
            <option value="bottom">Низ</option>
            <option value="left">Левая</option>
            <option value="right">Правая</option>
          </select>
        </label>
        <label>
          {shape === 'round' ? 'Диаметр, мм' : 'Ширина, мм'}
          <input type="number" value={size1} onChange={(event) => setSize1(Number(event.target.value || 0))} />
        </label>
        {shape === 'rectangular' ? (
          <label>
            Высота, мм
            <input type="number" value={size2} onChange={(event) => setSize2(Number(event.target.value || 0))} />
          </label>
        ) : null}
        <label>
          Количество
          <input type="number" min={1} value={quantity} onChange={(event) => setQuantity(Math.max(1, Number(event.target.value || 1)))} />
        </label>
        <label>
          Положение по длине, мм
          <input type="number" value={position} onChange={(event) => setPosition(Number(event.target.value || 0))} />
        </label>
        <div className="r001-modal-actions">
          <button type="button" onClick={onClose}>Отменить</button>
          <button
            type="button"
            className="r001-primary"
            onClick={() => onAdd({ shape, side, size1, size2: shape === 'rectangular' ? size2 : undefined, position, quantity })}
          >
            Добавить
          </button>
        </div>
      </section>
    </div>
  )
}

export function R001WorkspaceCalculator() {
  const role = useAppStore((state) => state.role)
  const project = useProjectStore((state) => state.project)
  const setProject = useProjectStore((state) => state.setProject)
  const [engineeringOn, setEngineeringOn] = useState(false)
  const [diameter, setDiameter] = useState(125)
  const [length, setLength] = useState(1000)
  const [quantity, setQuantity] = useState(1)
  const [material, setMaterial] = useState(MATERIALS[0].key)
  const [thickness, setThickness] = useState(0.5)
  const [comment, setComment] = useState('')
  const [optionsOpen, setOptionsOpen] = useState(false)
  const [holeOpen, setHoleOpen] = useState(false)
  const [holes, setHoles] = useState<R001Hole[]>([])
  const [added, setAdded] = useState(false)
  const [invitationOpen, setInvitationOpen] = useState(false)
  const result = useMemo(() => calculateR001PrototypeDemo({ diameter, length, thickness }), [diameter, length, thickness])
  const materialLabel = MATERIALS.find((option) => option.key === material)?.label ?? MATERIALS[0].label
  const canAdd = canAddSpecItem(role)
  const areaTotal = round3(result.area * quantity)
  const massRaw = result.area * quantity * (thickness / 1000) * 7850
  const description = `Труба прямошовная · D ${diameter} мм · L ${length} мм · ${quantity} шт · ${materialLabel} · ${thickness} мм`
  const holesText = holesDescription(holes)
  const showEngineering = canViewDebugPanel(role) && engineeringOn

  useEffect(() => {
    if (!canViewDebugPanel(role)) setEngineeringOn(false)
  }, [role])

  const handleNumberKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return
    event.preventDefault()
    event.currentTarget.blur()
  }

  const addHole = (hole: Omit<R001Hole, 'id'>) => {
    setHoles((current) => [...current, { ...hole, id: current.length + 1 }])
  }

  const updateHole = (id: number, patch: Partial<R001Hole>) => {
    setHoles((current) => current.map((hole) => (hole.id === id ? { ...hole, ...patch } : hole)))
  }

  const removeHole = (id: number) => {
    setHoles((current) => current.filter((hole) => hole.id !== id))
  }

  const handleAdd = () => {
    if (!canAdd) {
      setInvitationOpen(true)
      return
    }

    const item = createSpecificationItem('round-duct')
    const holesCount = holes.reduce((total, hole) => total + hole.quantity, 0)
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
      holes,
      holesCount,
      holesDescription: holesText,
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
        <span>Расчётный модуль</span>
        <h3>R-001 / Труба прямошовная</h3>
      </div>

      <div className="r001-status-bar">
        <div className="r001-status-left">
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
        <div className="r001-split-input-row">
          <div className="r001-split-visual" aria-label="Схема трубы прямошовной">
            <R001ProductDiagram diameter={diameter} length={length} holes={holes} />
          </div>

          <div className="r001-split-fields">
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
                    <button type="button" onClick={() => setHoleOpen(true)}>Добавить отверстие</button>
                    {holes.length ? <span className="r001-options-count">Отверстий: {holes.reduce((total, hole) => total + hole.quantity, 0)}</span> : null}
                  </div>
                  {holes.length ? (
                    <div className="r001-hole-list">
                      {holes.map((hole, index) => (
                        <div key={hole.id} className="r001-hole-card">
                          <strong>Отверстие {index + 1}</strong>
                          <label>
                            Тип
                            <select value={hole.shape} onChange={(event) => updateHole(hole.id, { shape: event.target.value as HoleShape })}>
                              <option value="round">Круглое</option>
                              <option value="rectangular">Прямоугольное</option>
                            </select>
                          </label>
                          <label>
                            Сторона
                            <select value={hole.side} onChange={(event) => updateHole(hole.id, { side: event.target.value as HoleSide })}>
                              <option value="top">Верх</option>
                              <option value="bottom">Низ</option>
                              <option value="left">Левая</option>
                              <option value="right">Правая</option>
                            </select>
                          </label>
                          <label>
                            {hole.shape === 'round' ? 'Диаметр, мм' : 'Ширина, мм'}
                            <input type="number" value={hole.size1} onChange={(event) => updateHole(hole.id, { size1: Number(event.target.value || 0) })} />
                          </label>
                          {hole.shape === 'rectangular' ? (
                            <label>
                              Высота, мм
                              <input type="number" value={hole.size2 ?? hole.size1} onChange={(event) => updateHole(hole.id, { size2: Number(event.target.value || 0) })} />
                            </label>
                          ) : null}
                          <label>
                            Количество
                            <input type="number" min={1} value={hole.quantity} onChange={(event) => updateHole(hole.id, { quantity: Math.max(1, Number(event.target.value || 1)) })} />
                          </label>
                          <label>
                            Положение по длине, мм
                            <input type="number" value={hole.position} onChange={(event) => updateHole(hole.id, { position: Number(event.target.value || 0) })} />
                          </label>
                          <button type="button" className="r001-hole-remove" onClick={() => removeHole(hole.id)}>Удалить отверстие</button>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : null}
              </div>
          </div>
        </div>

        <div className="r001-spec-block">
          <div className="r001-spec-area">Площадь: <strong>{areaTotal.toFixed(3)} м²</strong></div>
          {showEngineering ? <div className="r001-spec-area">Масса: <strong>{round2(massRaw).toFixed(2)} кг</strong></div> : null}
          <div className="r001-spec-description">{description}</div>
          {holesText ? <div className="r001-spec-description">{holesText}</div> : null}
          <label className="r001-comment-field">
            Комментарий
            <textarea value={comment} onChange={(event) => setComment(event.target.value)} />
          </label>
          <button type="button" className={`r001-add-project${canAdd ? ' r001-primary' : ' is-muted'}${added ? ' is-added' : ''}`} onClick={handleAdd}>
            {added ? 'Добавлено в проект' : 'Добавить в проект'}
          </button>
        </div>
      </section>

      {holeOpen ? <R001HoleModal onClose={() => setHoleOpen(false)} onAdd={(hole) => { addHole(hole); setHoleOpen(false) }} /> : null}
      <AccessInvitationDialog open={invitationOpen} onClose={() => setInvitationOpen(false)} />
    </div>
  )
}
