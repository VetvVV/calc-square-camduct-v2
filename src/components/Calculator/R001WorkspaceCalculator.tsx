import { type KeyboardEvent, type ReactNode, useMemo, useState } from 'react'
import { useAppStore } from '../../store/appStore'
import { useProjectStore } from '../../store/projectStore'
import type { ModuleCalculationOutput } from '../../types'
import { calculateRoundDuct } from '../../domain/calculators'
import { addItem } from '../../domain/specification/specificationManager'
import { createSpecificationItem } from '../../domain/specification/itemFactory'
import { camductChecks } from '../../domain/verification/camductChecks'
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
type ServiceTab = 'product' | 'unfold' | 'worklist' | 'verification'
type EndConnection = 'none' | 'flange' | 'bandage'

interface R001Hole {
  id: number
  shape: HoleShape
  side: HoleSide
  size1: number
  size2?: number
  position: number
  quantity: number
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

function formatNumber(value: number, digits = 3) {
  return value.toFixed(digits)
}

function formatMaybeNumber(value: unknown, digits = 3) {
  return typeof value === 'number' ? formatNumber(value, digits) : 'нет данных'
}

function connectionLabel(value: EndConnection) {
  if (value === 'flange') return 'Фланец'
  if (value === 'bandage') return 'Бандаж'
  return 'Нет'
}

function toleranceLabel(abs?: number, pct?: number) {
  const parts = []
  if (typeof abs === 'number') parts.push(`abs ${abs}`)
  if (typeof pct === 'number') parts.push(`${pct}%`)
  return parts.length ? parts.join(' / ') : 'не задан'
}

function statusLabel(status: string) {
  if (status === 'baseline') return 'engine baseline'
  if (status === 'pending') return 'ожидает CAMduct-эталон'
  if (status === 'confirmed') return 'confirmed CAMduct'
  if (status === 'mismatch') return 'mismatch'
  return status
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

function ServiceViewPanel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="r001-view-panel">
      <h3>{title}</h3>
      <div>{children}</div>
    </section>
  )
}

function ServiceSideView({ length, seamType, c1, c2 }: { length: number; seamType: string; c1: string; c2: string }) {
  return (
    <svg viewBox="0 0 320 180" role="img" aria-label="Вид 1 - боковой">
      <rect x="40" y="62" width="230" height="58" fill="#ffffff" stroke="#2457b8" strokeWidth="2" />
      <line x1="40" y1="70" x2="270" y2="70" stroke="#d22d2d" strokeWidth="3" />
      <text x="118" y="52" fill="#8a6d00" fontSize="13" fontWeight="800">S1 {seamType}</text>
      <line x1="40" y1="140" x2="270" y2="140" stroke="#a6a6a6" strokeWidth="1" />
      <text x="148" y="156" fill="#111" fontSize="13" fontWeight="700">B {length}</text>
      <text x="14" y="86" fill="#111" fontSize="12" fontWeight="700">C1</text>
      <text x="278" y="86" fill="#111" fontSize="12" fontWeight="700">C2</text>
      <text x="8" y="102" fill="#555" fontSize="10">{c1}</text>
      <text x="274" y="102" fill="#555" fontSize="10">{c2}</text>
    </svg>
  )
}

function ServiceEndView({ diameter, seamAngle }: { diameter: number; seamAngle: number }) {
  const angle = ((seamAngle - 90) * Math.PI) / 180
  const cx = 160
  const cy = 90
  const radius = 56

  return (
    <svg viewBox="0 0 320 180" role="img" aria-label="Вид 2 - торец">
      <circle cx={cx} cy={cy} r={radius} fill="#ffffff" stroke="#2457b8" strokeWidth="2" />
      <circle cx={cx} cy={cy} r={radius - 9} fill="none" stroke="#a6a6a6" strokeWidth="1" />
      <line x1={cx} y1={cy} x2={cx + radius * Math.cos(angle)} y2={cy + radius * Math.sin(angle)} stroke="#d22d2d" strokeWidth="3" />
      <text x={cx - 8} y={cy + 5} fill="#111" fontSize="13" fontWeight="700">A</text>
      <text x="16" y="24" fill="#555" fontSize="11">шов: {seamAngle}°</text>
      <text x="16" y="164" fill="#555" fontSize="11">A {diameter}</text>
    </svg>
  )
}

function ServiceBottomView({ length }: { length: number }) {
  return (
    <svg viewBox="0 0 320 180" role="img" aria-label="Вид 3 - нижний">
      <rect x="40" y="70" width="230" height="44" fill="#ffffff" stroke="#2457b8" strokeWidth="2" />
      <line x1="40" y1="92" x2="270" y2="92" stroke="#a6a6a6" strokeDasharray="5 4" strokeWidth="1" />
      <text x="140" y="146" fill="#111" fontSize="13" fontWeight="700">B {length}</text>
    </svg>
  )
}

function ServiceIsoView({ seamType, c1, c2 }: { seamType: string; c1: string; c2: string }) {
  return (
    <svg viewBox="0 0 320 180" role="img" aria-label="Изометрия">
      <path d="M78 66 L222 50 A15 32 0 0 1 222 114 L78 130 Z" fill="#ffffff" stroke="#2457b8" strokeWidth="2" />
      <ellipse cx="78" cy="98" rx="15" ry="32" fill="#dbe6ff" stroke="#2457b8" strokeWidth="2" />
      <line x1="84" y1="68" x2="219" y2="52" stroke="#d22d2d" strokeWidth="3" />
      <text x="128" y="40" fill="#8a6d00" fontSize="13" fontWeight="800">S1 {seamType}</text>
      <text x="142" y="160" fill="#111" fontSize="12" fontWeight="700">B</text>
      <text x="40" y="98" fill="#111" fontSize="12" fontWeight="700">C1</text>
      <text x="248" y="80" fill="#111" fontSize="12" fontWeight="700">C2</text>
      <text x="34" y="112" fill="#555" fontSize="10">{c1}</text>
      <text x="244" y="94" fill="#555" fontSize="10">{c2}</text>
    </svg>
  )
}

function ServiceVisualWorkspace({
  diameter,
  length,
  seamAngle,
  seamType,
  c1,
  c2,
}: {
  diameter: number
  length: number
  seamAngle: number
  seamType: string
  c1: string
  c2: string
}) {
  return (
    <div className="r001-visual-workspace">
      <ServiceViewPanel title="Вид сбоку"><ServiceSideView length={length} seamType={seamType} c1={c1} c2={c2} /></ServiceViewPanel>
      <ServiceViewPanel title="Торец"><ServiceEndView diameter={diameter} seamAngle={seamAngle} /></ServiceViewPanel>
      <ServiceViewPanel title="План"><ServiceBottomView length={length} /></ServiceViewPanel>
      <ServiceViewPanel title="Изометрия"><ServiceIsoView seamType={seamType} c1={c1} c2={c2} /></ServiceViewPanel>
    </div>
  )
}

function RoundUnfoldPanel({
  diameter,
  length,
  quantity,
  output,
}: {
  diameter: number
  length: number
  quantity: number
  output: ModuleCalculationOutput
}) {
  const roundMeta = output.moduleMetadata
  const circumference = Math.PI * diameter
  const allowance = roundMeta.lockAllowance
  const calculatedLength = roundMeta.calculatedLength
  const unfoldWidth = typeof allowance === 'number' ? circumference + allowance : null

  return (
    <section className="r001-camduct-unfold" aria-label="Развёртка листа">
      <div className="r001-unfold-sheet" aria-hidden="true">
        <div className="r001-unfold-seam" />
        <span className="r001-unfold-x">X / L {formatMaybeNumber(calculatedLength, 0)} мм</span>
        <span className="r001-unfold-y">Y / πD + S1 {unfoldWidth !== null ? formatNumber(unfoldWidth, 1) : 'нет данных'} мм</span>
      </div>
      <dl className="r001-camduct-metrics">
        <div><dt>πD</dt><dd>{formatNumber(circumference, 1)} мм</dd></div>
        <div><dt>S1</dt><dd>{formatMaybeNumber(allowance, 0)} мм</dd></div>
        <div><dt>L</dt><dd>{length} мм</dd></div>
        <div><dt>Lрасч</dt><dd>{formatMaybeNumber(calculatedLength, 0)} мм</dd></div>
        <div><dt>Sчистовая</dt><dd>{formatNumber((circumference * length * quantity) / 1_000_000)} м²</dd></div>
        <div><dt>Sполная</dt><dd>{formatNumber(output.calculated.areaDisplay)} м²</dd></div>
      </dl>
    </section>
  )
}

function RoundWorkListPanel({
  diameter,
  length,
  quantity,
  materialLabel,
  thickness,
  c1,
  c2,
  output,
}: {
  diameter: number
  length: number
  quantity: number
  materialLabel: string
  thickness: number
  c1: EndConnection
  c2: EndConnection
  output: ModuleCalculationOutput
}) {
  return (
    <div className="r001-camduct-worklist">
      <table>
        <thead>
          <tr>
            <th>Код</th>
            <th>Изделие</th>
            <th>Кол-во</th>
            <th>Материал</th>
            <th>Толщина</th>
            <th>A/D</th>
            <th>B/L</th>
            <th>C1/C2</th>
            <th>Площадь</th>
            <th>Статус</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>KRG-001</td>
            <td>Воздуховод круглый / труба прямошовная</td>
            <td>{quantity}</td>
            <td>{materialLabel}</td>
            <td>{thickness} мм</td>
            <td>{diameter} мм</td>
            <td>{length} мм</td>
            <td>{connectionLabel(c1)} / {connectionLabel(c2)}</td>
            <td>{formatNumber(output.calculated.areaDisplay)} м²</td>
            <td>рассчитано engine</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

function RoundVerificationPanel() {
  const checks = camductChecks.filter((check) => check.calculatorKey === 'round-duct' || check.productCode === 'KRG-001')

  if (!checks.length) {
    return (
      <div className="r001-camduct-empty">
        CAMduct-сверка будет доступна после подключения базы эталонов.
      </div>
    )
  }

  return (
    <div className="r001-camduct-checks" aria-label="CAMduct verification checks">
      {checks.map((check) => (
        <article key={check.id} className={`r001-camduct-check is-${check.status}`}>
          <header>
            <strong>{check.id}</strong>
            <span>{statusLabel(check.status)}</span>
          </header>
          <dl>
            <div><dt>expectedSource</dt><dd>{check.expectedSource ?? 'нет'}</dd></div>
            <div><dt>expectedResult</dt><dd>{check.expectedResult ?? 'нет CAMduct-эталона'}</dd></div>
            <div><dt>tolerance</dt><dd>{toleranceLabel(check.toleranceAbs, check.tolerancePct)}</dd></div>
            <div><dt>testRef</dt><dd>{check.testRef ?? 'нет'}</dd></div>
            <div><dt>evidence</dt><dd>{check.screenshotRef ?? check.evidenceRef ?? 'нет'}</dd></div>
          </dl>
          {check.comment ? <p>{check.comment}</p> : null}
        </article>
      ))}
    </div>
  )
}

function R001ServicePanel({
  diameter,
  setDiameter,
  length,
  setLength,
  thickness,
  setThickness,
  quantity,
  setQuantity,
  materialLabel,
  material,
  setMaterial,
  c1,
  setC1,
  c2,
  setC2,
  output,
}: {
  diameter: number
  setDiameter: (value: number) => void
  length: number
  setLength: (value: number) => void
  thickness: number
  setThickness: (value: number) => void
  quantity: number
  setQuantity: (value: number) => void
  materialLabel: string
  material: string
  setMaterial: (value: string) => void
  c1: EndConnection
  setC1: (value: EndConnection) => void
  c2: EndConnection
  setC2: (value: EndConnection) => void
  output: ModuleCalculationOutput
}) {
  const [tab, setTab] = useState<ServiceTab>('product')
  const [seamAngle] = useState(90)
  const roundMeta = output.moduleMetadata
  const allowance = typeof roundMeta.lockAllowance === 'number' ? roundMeta.lockAllowance : null
  const seamType = roundMeta.welded ? 'сварка / 8 мм' : allowance === 28 ? '14/14' : allowance === 25 ? '12.5/12.5' : 'нет данных'

  const tabs: Array<[ServiceTab, string]> = [
    ['product', 'Изделие'],
    ['unfold', 'Развёртка'],
    ['worklist', 'Список работы'],
    ['verification', 'CAMduct-сверка'],
  ]

  return (
    <div className="r001-service-shell" aria-label="KRG-001 CAMduct-style service view">
      <header className="r001-service-header">
        <div>
          <span>CAMduct-style engineering panel</span>
          <h3>KRG-001 / Воздуховод круглый / труба прямошовная</h3>
        </div>
        <div className="r001-service-badges">
          <span>Service ON</span>
          <span>расчёт engine</span>
        </div>
      </header>

      <div className="r001-service-tabs" role="tablist" aria-label="CAMduct-style tabs">
        {tabs.map(([key, label]) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={tab === key}
            className={tab === key ? 'is-active' : ''}
            onClick={() => setTab(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'product' ? (
      <div className="r001-service-main">
        <ServiceVisualWorkspace diameter={diameter} length={length} seamAngle={seamAngle} seamType={seamType} c1={connectionLabel(c1)} c2={connectionLabel(c2)} />

        <aside className="r001-service-panel">
          <div className="r001-service-fields">
            <label>A / D / Диаметр, мм<input type="number" value={diameter} onChange={(event) => setDiameter(Number(event.target.value || 0))} /></label>
            <label>B / L / Длина, мм<input type="number" value={length} onChange={(event) => setLength(Number(event.target.value || 0))} /></label>
            <label>C1<select value={c1} onChange={(event) => setC1(event.target.value as EndConnection)}><option value="none">Нет</option><option value="flange">Фланец</option><option value="bandage">Бандаж</option></select></label>
            <label>C2<select value={c2} onChange={(event) => setC2(event.target.value as EndConnection)}><option value="none">Нет</option><option value="flange">Фланец</option><option value="bandage">Бандаж</option></select></label>
            <label>Материал<select value={material} onChange={(event) => setMaterial(event.target.value)}>{MATERIALS.map((option) => <option key={option.key} value={option.key}>{option.label}</option>)}</select></label>
            <label>Толщина<select value={thickness} onChange={(event) => setThickness(Number(event.target.value))}><option value={0.5}>0.5</option><option value={0.7}>0.7</option><option value={0.9}>0.9</option></select></label>
            <label>Количество<input type="number" min={1} value={quantity} onChange={(event) => setQuantity(Math.max(1, Number(event.target.value || 1)))} /></label>
            <label>S1 / припуск / замок<input value={`${seamType} / ${allowance ?? 'нет данных'} мм`} readOnly /></label>
          </div>
          <div className="r001-service-result">
            <span>Площадь</span>
            <strong>{formatNumber(output.calculated.areaDisplay)} м²</strong>
            <small>trace: {output.trace?.formulaKey ?? 'доступно в runtime diagnostics'}</small>
          </div>
        </aside>
      </div>
      ) : null}

      {tab === 'unfold' ? (
        <RoundUnfoldPanel diameter={diameter} length={length} quantity={quantity} output={output} />
      ) : null}

      {tab === 'worklist' ? (
        <RoundWorkListPanel diameter={diameter} length={length} quantity={quantity} materialLabel={materialLabel} thickness={thickness} c1={c1} c2={c2} output={output} />
      ) : null}

      {tab === 'verification' ? <RoundVerificationPanel /> : null}

      <div className="r001-service-diagnostics" aria-label="Service diagnostics">
        <span>S1 = {seamType}</span>
        <span>allowance = {allowance ?? 'нет данных'} мм</span>
        <span>Lрасч = {formatMaybeNumber(roundMeta.calculatedLength, 0)} мм</span>
        <span>area = {formatNumber(output.calculated.areaDisplay)} м²</span>
      </div>
    </div>
  )
}

export function R001WorkspaceCalculator() {
  const role = useAppStore((state) => state.role)
  const camductMode = useAppStore((state) => state.camductMode)
  const project = useProjectStore((state) => state.project)
  const setProject = useProjectStore((state) => state.setProject)
  const [diameter, setDiameter] = useState(125)
  const [length, setLength] = useState(1000)
  const [quantity, setQuantity] = useState(1)
  const [material, setMaterial] = useState(MATERIALS[0].key)
  const [thickness, setThickness] = useState(0.5)
  const [c1, setC1] = useState<EndConnection>('none')
  const [c2, setC2] = useState<EndConnection>('none')
  const [comment, setComment] = useState('')
  const [optionsOpen, setOptionsOpen] = useState(false)
  const [holeOpen, setHoleOpen] = useState(false)
  const [holes, setHoles] = useState<R001Hole[]>([])
  const [added, setAdded] = useState(false)
  const [invitationOpen, setInvitationOpen] = useState(false)
  const result = useMemo(
    () => calculateRoundDuct({ A: diameter, B: length, quantity, C1: c1, C2: c2, thickness }),
    [c1, c2, diameter, length, quantity, thickness],
  )
  const materialLabel = MATERIALS.find((option) => option.key === material)?.label ?? MATERIALS[0].label
  const canAdd = canAddSpecItem(role)
  const areaTotal = result.calculated.areaDisplay
  const massRaw = typeof result.calculated.massRaw === 'number' ? result.calculated.massRaw : 0
  const description = `Воздуховод круглый / труба прямошовная · D ${diameter} мм · L ${length} мм · ${quantity} шт · ${materialLabel} · ${thickness} мм`
  const holesText = holesDescription(holes)
  const showEngineering = canViewDebugPanel(role) && camductMode

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
      areaRaw: result.calculated.areaRaw,
      areaDisplay: areaTotal,
      massRaw,
      massDisplay: round2(massRaw),
    }
    item.moduleMetadata = {
      prototype: 'r001-public-service',
      holes,
      holesCount,
      holesDescription: holesText,
      endConnections: { C1: c1, C2: c2 },
      roundDuct: result.moduleMetadata.roundSections,
      seamType: result.moduleMetadata.welded ? 'welded' : 'lock',
      allowance: result.moduleMetadata.lockAllowance,
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
        <h3>KRG-001 / Воздуховод круглый / труба прямошовная</h3>
      </div>

      <div className="r001-status-bar">
        <div className="r001-status-left">
          <span className="r001-spec-indicator">Спецификация · {project.items.length} позиций</span>
        </div>
      </div>

      {showEngineering ? (
        <R001ServicePanel
          diameter={diameter}
          setDiameter={setDiameter}
          length={length}
          setLength={setLength}
          thickness={thickness}
          setThickness={setThickness}
          quantity={quantity}
          setQuantity={setQuantity}
          materialLabel={materialLabel}
          material={material}
          setMaterial={setMaterial}
          c1={c1}
          setC1={setC1}
          c2={c2}
          setC2={setC2}
          output={result}
        />
      ) : (
      <section className="r001-public-form" aria-label="KRG-001 рабочий калькулятор">
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
      )}

      {holeOpen ? <R001HoleModal onClose={() => setHoleOpen(false)} onAdd={(hole) => { addHole(hole); setHoleOpen(false) }} /> : null}
      <AccessInvitationDialog open={invitationOpen} onClose={() => setInvitationOpen(false)} />
    </div>
  )
}
