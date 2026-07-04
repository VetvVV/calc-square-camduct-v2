import { type ReactNode, useMemo, useState } from 'react'
import { calculateR001PrototypeDemo, type R001DemoResult } from '../prototypes/r001DemoEngine'

type PrototypeMode = 'public' | 'service'
type HoleShape = 'round' | 'rectangular'
type HoleSide = 'top' | 'bottom' | 'left' | 'right'
type ServiceTab = 'dimensions' | 'options' | 'detail' | 'connectors'

interface Hole {
  id: number
  shape: HoleShape
  side: HoleSide
  size1: number
  size2?: number
  position: number
}

interface WorkItem {
  id: number
  quantity: number
  area: number
  seamType: string
}

interface SpecPosition {
  id: number
  diameter: number
  length: number
  thickness: number
  quantity: number
  holes: number
  area: number
}

function formatNumber(value: number, digits = 3) {
  return value.toFixed(digits)
}

function ModeSwitcher({ mode, setMode }: { mode: PrototypeMode; setMode: (mode: PrototypeMode) => void }) {
  return (
    <div className="r001-mode-switch" aria-label="Режим прототипа R-001">
      <button type="button" className={mode === 'public' ? 'is-active' : ''} onClick={() => setMode('public')}>
        Public v2
      </button>
      <button type="button" className={mode === 'service' ? 'is-active' : ''} onClick={() => setMode('service')}>
        Service ON
      </button>
    </div>
  )
}

function PublicProductVisual({ diameter, length, holes }: { diameter: number; length: number; holes: Hole[] }) {
  return (
    <div className="r001-public-visual" aria-label="Схема трубы прямошовной">
      <svg viewBox="0 0 520 300" role="img" aria-label={`Труба прямошовная ØD ${diameter}, L ${length}`}>
        <defs>
          <linearGradient id="r001-public-body" x1="0" x2="1">
            <stop offset="0" stopColor="#eef3f8" />
            <stop offset="1" stopColor="#d9e1ea" />
          </linearGradient>
        </defs>
        <ellipse cx="142" cy="150" rx="62" ry="82" fill="#f8fafc" stroke="#4d5b69" strokeWidth="3" />
        <path d="M142 68 H382 C418 68 444 105 444 150 C444 195 418 232 382 232 H142" fill="url(#r001-public-body)" stroke="#4d5b69" strokeWidth="3" />
        <path d="M142 68 C178 70 202 106 202 150 C202 194 178 230 142 232" fill="none" stroke="#748294" strokeWidth="2" />
        <path d="M176 88 H392" stroke="#df7a12" strokeWidth="4" strokeLinecap="round" />
        <line x1="142" y1="54" x2="142" y2="246" stroke="#1455ff" strokeWidth="2" />
        <line x1="126" y1="68" x2="158" y2="68" stroke="#1455ff" strokeWidth="2" />
        <line x1="126" y1="232" x2="158" y2="232" stroke="#1455ff" strokeWidth="2" />
        <text x="70" y="154" fill="#1455ff" fontSize="18" fontWeight="800">
          ØD {diameter}
        </text>
        <line x1="176" y1="258" x2="444" y2="258" stroke="#0a8a22" strokeWidth="2" />
        <line x1="176" y1="246" x2="176" y2="270" stroke="#0a8a22" strokeWidth="2" />
        <line x1="444" y1="246" x2="444" y2="270" stroke="#0a8a22" strokeWidth="2" />
        <text x="288" y="286" fill="#0a8a22" fontSize="18" fontWeight="800">
          L {length}
        </text>
        {holes.map((hole, index) => {
          const x = 230 + index * 42
          const y = hole.side === 'bottom' ? 188 : hole.side === 'left' ? 138 : hole.side === 'right' ? 160 : 112
          return hole.shape === 'rectangular' ? (
            <rect key={hole.id} x={x} y={y} width="32" height="18" rx="3" fill="#fff8ec" stroke="#df7a12" strokeWidth="3" />
          ) : (
            <circle key={hole.id} cx={x + 16} cy={y + 9} r="12" fill="#fff8ec" stroke="#df7a12" strokeWidth="3" />
          )
        })}
      </svg>
      <div className="r001-public-visual-note">{holes.length ? `Отверстий: ${holes.length}` : 'Отверстия пока не добавлены'}</div>
    </div>
  )
}

function PublicHoleModal({ onClose, onAdd }: { onClose: () => void; onAdd: (hole: Omit<Hole, 'id'>) => void }) {
  const [shape, setShape] = useState<HoleShape>('rectangular')
  const [side, setSide] = useState<HoleSide>('top')
  const [size1, setSize1] = useState(200)
  const [size2, setSize2] = useState(100)
  const [position, setPosition] = useState(500)

  return (
    <div className="r001-modal-backdrop">
      <section className="r001-modal" aria-modal="true" role="dialog" aria-labelledby="public-hole-title">
        <h3 id="public-hole-title">Отверстие</h3>
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
          Размер 1, мм
          <input type="number" value={size1} onChange={(event) => setSize1(Number(event.target.value || 0))} />
        </label>
        {shape === 'rectangular' ? (
          <label>
            Размер 2, мм
            <input type="number" value={size2} onChange={(event) => setSize2(Number(event.target.value || 0))} />
          </label>
        ) : null}
        <label>
          Положение по длине, мм
          <input type="number" value={position} onChange={(event) => setPosition(Number(event.target.value || 0))} />
        </label>
        <div className="r001-modal-actions">
          <button type="button" onClick={onClose}>
            Отменить
          </button>
          <button type="button" className="r001-primary" onClick={() => onAdd({ shape, side, size1, size2: shape === 'rectangular' ? size2 : undefined, position })}>
            Добавить
          </button>
        </div>
      </section>
    </div>
  )
}

function PublicSpecification({ positions, holes, area, quantity, diameter, length, thickness }: { positions: SpecPosition[]; holes: Hole[]; area: number; quantity: number; diameter: number; length: number; thickness: number }) {
  const rows: SpecPosition[] = positions.length
    ? positions
    : [{ id: 1, diameter, length, thickness, quantity, holes: holes.length, area }]

  return (
    <section className="r001-public-spec">
      <h3>Список позиций</h3>
      <table>
        <thead>
          <tr>
            <th>№</th>
            <th>Изделие</th>
            <th>Диаметр ØD</th>
            <th>Длина L</th>
            <th>Количество</th>
            <th>Материал</th>
            <th>Толщина, мм</th>
            <th>Отверстия</th>
            <th>Площадь</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row.id}>
              <td>{index + 1}</td>
              <td>Труба прямошовная</td>
              <td>{row.diameter}</td>
              <td>{row.length}</td>
              <td>{row.quantity}</td>
              <td>GALVANISED</td>
              <td>{row.thickness}</td>
              <td>{row.holes ? `Отверстий: ${row.holes}` : '—'}</td>
              <td>{formatNumber(row.area * row.quantity)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

function PublicR001Calculator({
  diameter,
  setDiameter,
  length,
  setLength,
  quantity,
  setQuantity,
  thickness,
  setThickness,
  holes,
  addHole,
  positions,
  addPosition,
  result,
}: {
  diameter: number
  setDiameter: (value: number) => void
  length: number
  setLength: (value: number) => void
  quantity: number
  setQuantity: (value: number) => void
  thickness: number
  setThickness: (value: number) => void
  holes: Hole[]
  addHole: (hole: Omit<Hole, 'id'>) => void
  positions: SpecPosition[]
  addPosition: () => void
  result: R001DemoResult
}) {
  const [holeOpen, setHoleOpen] = useState(false)
  const [specVisible, setSpecVisible] = useState(false)
  const [toast, setToast] = useState('')

  const showToast = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 1500)
  }

  return (
    <div className="r001-public-shell">
      <header className="r001-public-head">
        <span>Круглые изделия</span>
        <h1>Труба прямошовная</h1>
        <p>Введите диаметр и длину. Отверстия добавляются простой пользовательской формой.</p>
      </header>
      <div className="r001-public-grid">
        <PublicProductVisual diameter={diameter} length={length} holes={holes} />
        <section className="r001-public-form">
          <label>
            ØD / Диаметр, мм
            <input type="number" value={diameter} onChange={(event) => setDiameter(Number(event.target.value || 0))} />
          </label>
          <label>
            L / Длина, мм
            <input type="number" value={length} onChange={(event) => setLength(Number(event.target.value || 0))} />
          </label>
          <label>
            Количество
            <input type="number" value={quantity} onChange={(event) => setQuantity(Number(event.target.value || 1))} />
          </label>
          <label>
            Материал
            <select value="GALVANISED" onChange={() => undefined}>
              <option>GALVANISED</option>
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
          <div className="r001-public-result">
            <strong>Итог по позиции</strong>
            <span>
              ØD {diameter} × L {length} мм
            </span>
            <span>Площадь: {formatNumber(result.area)} м²</span>
          </div>
          <div className="r001-public-actions">
            <button type="button" onClick={() => setHoleOpen(true)}>
              Добавить отверстие
            </button>
            <button
              type="button"
              className="r001-primary"
              onClick={() => {
                addPosition()
                setSpecVisible(true)
                showToast('Позиция добавлена в спецификацию.')
              }}
            >
              Добавить в спецификацию
            </button>
            <button type="button" onClick={() => setSpecVisible(true)}>
              Список позиций{positions.length ? ` (${positions.length})` : ''}
            </button>
          </div>
        </section>
      </div>
      {specVisible ? <PublicSpecification positions={positions} holes={holes} area={result.area} quantity={quantity} diameter={diameter} length={length} thickness={thickness} /> : null}
      {toast ? <div className="r001-toast">{toast}</div> : null}
      {holeOpen ? <PublicHoleModal onClose={() => setHoleOpen(false)} onAdd={(hole) => { addHole(hole); setHoleOpen(false); setSpecVisible(true) }} /> : null}
    </div>
  )
}

function TopToolbar({ openWorkList, showToast }: { openWorkList: () => void; showToast: (message: string) => void }) {
  const tools = ['Быстрый запуск', 'Инфо работы', 'Создать новую работу', 'Открыть работу', 'Сохранить работу', 'Список работы', 'Папки деталей', 'Автоматический раскрой']
  return (
    <div className="r001-service-toolbar">
      {tools.map((tool) => (
        <button key={tool} type="button" onClick={tool === 'Список работы' ? openWorkList : () => showToast(tool === 'Сохранить работу' ? 'Работа сохранена в service-прототипе.' : 'Функция зарезервирована для service-прототипа.')}>
          <span aria-hidden="true">▣</span>
          {tool}
        </button>
      ))}
    </div>
  )
}

function ViewPanel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="r001-view-panel">
      <h3>{title}</h3>
      <div>{children}</div>
    </section>
  )
}

function View1Side({ length, seamType, c1, c2 }: { length: number; seamType: string; c1: string; c2: string }) {
  return (
    <svg viewBox="0 0 320 180" role="img" aria-label="Вид 1 — боковой">
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

function View2End({ diameter, seamAngle }: { diameter: number; seamAngle: number }) {
  const angle = ((seamAngle - 90) * Math.PI) / 180
  const cx = 160
  const cy = 90
  const radius = 56
  return (
    <svg viewBox="0 0 320 180" role="img" aria-label="Вид 2 — торец">
      <circle cx={cx} cy={cy} r={radius} fill="#ffffff" stroke="#2457b8" strokeWidth="2" />
      <circle cx={cx} cy={cy} r={radius - 9} fill="none" stroke="#a6a6a6" strokeWidth="1" />
      <line x1={cx} y1={cy} x2={cx + radius * Math.cos(angle)} y2={cy + radius * Math.sin(angle)} stroke="#d22d2d" strokeWidth="3" />
      <text x={cx - 8} y={cy + 5} fill="#111" fontSize="13" fontWeight="700">A</text>
      <text x="16" y="24" fill="#555" fontSize="11">шов: {seamAngle}°</text>
      <text x="16" y="164" fill="#555" fontSize="11">Ø{diameter}</text>
    </svg>
  )
}

function View3Bottom({ length }: { length: number }) {
  return (
    <svg viewBox="0 0 320 180" role="img" aria-label="Вид 3 — нижний">
      <rect x="40" y="70" width="230" height="44" fill="#ffffff" stroke="#2457b8" strokeWidth="2" />
      <line x1="40" y1="92" x2="270" y2="92" stroke="#a6a6a6" strokeDasharray="5 4" strokeWidth="1" />
      <text x="140" y="146" fill="#111" fontSize="13" fontWeight="700">B {length}</text>
    </svg>
  )
}

function ViewIsometric({ seamType, c1, c2 }: { seamType: string; c1: string; c2: string }) {
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

function VisualWorkspace({ diameter, length, seamAngle, seamType, c1, c2 }: { diameter: number; length: number; seamAngle: number; seamType: string; c1: string; c2: string }) {
  return (
    <div className="r001-visual-workspace">
      <ViewPanel title="Вид 1"><View1Side length={length} seamType={seamType} c1={c1} c2={c2} /></ViewPanel>
      <ViewPanel title="Вид 2"><View2End diameter={diameter} seamAngle={seamAngle} /></ViewPanel>
      <ViewPanel title="Вид 3"><View3Bottom length={length} /></ViewPanel>
      <ViewPanel title="Изометрия"><ViewIsometric seamType={seamType} c1={c1} c2={c2} /></ViewPanel>
    </div>
  )
}

function RightPropertyPanel({
  tab,
  setTab,
  diameter,
  setDiameter,
  length,
  setLength,
  thickness,
  setThickness,
  quantity,
  setQuantity,
  seamAngle,
  setSeamAngle,
  c1,
  setC1,
  c2,
  setC2,
  result,
}: {
  tab: ServiceTab
  setTab: (tab: ServiceTab) => void
  diameter: number
  setDiameter: (value: number) => void
  length: number
  setLength: (value: number) => void
  thickness: number
  setThickness: (value: number) => void
  quantity: number
  setQuantity: (value: number) => void
  seamAngle: number
  setSeamAngle: (value: number) => void
  c1: string
  setC1: (value: string) => void
  c2: string
  setC2: (value: string) => void
  result: R001DemoResult
}) {
  return (
    <aside className="r001-service-panel">
      <div className="r001-tabs">
        {[
          ['dimensions', 'Размеры'],
          ['options', 'Опции'],
          ['detail', 'Деталь'],
          ['connectors', 'Соединители'],
        ].map(([key, label]) => (
          <button key={key} type="button" className={tab === key ? 'is-active' : ''} onClick={() => setTab(key as ServiceTab)}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'dimensions' ? (
        <div className="r001-service-table">
          <label><span>A</span><span>Диаметр</span><input type="number" value={diameter} onChange={(event) => setDiameter(Number(event.target.value || 0))} /></label>
          <label><span>B</span><span>Длина</span><input type="number" value={length} onChange={(event) => setLength(Number(event.target.value || 0))} /></label>
          <label><span>C</span><span>Левое удлинение</span><input type="number" value={0} disabled readOnly /></label>
          <label><span>D</span><span>Правое удлинение</span><input type="number" value={0} disabled readOnly /></label>
        </div>
      ) : null}

      {tab === 'options' ? (
        <div className="r001-service-fields">
          <label>Расположение шва<select value={seamAngle} onChange={(event) => setSeamAngle(Number(event.target.value))}><option value={0}>0</option><option value={90}>90</option><option value={180}>180</option><option value={270}>270</option></select></label>
          <label>Тип диаметра<select defaultValue="nominal"><option value="nominal">номинальный</option><option value="inside">внутренний</option><option value="outside">внешний</option></select></label>
        </div>
      ) : null}

      {tab === 'detail' ? (
        <div className="r001-service-fields">
          <label>Изделие<input value="труба 14" readOnly /></label>
          <label>Код<input value="R-001" readOnly /></label>
          <label>Материал<input value="GALVANISED" readOnly /></label>
          <label>Толщина<select value={thickness} onChange={(event) => setThickness(Number(event.target.value))}><option value={0.5}>0.5</option><option value={0.7}>0.7</option><option value={0.9}>0.9</option></select></label>
          <label>Количество<input type="number" value={quantity} onChange={(event) => setQuantity(Number(event.target.value || 1))} /></label>
          <label>Спецификация<input value="DW144-LV" readOnly /></label>
        </div>
      ) : null}

      {tab === 'connectors' ? (
        <div className="r001-service-fields">
          <label>C1<select value={c1} onChange={(event) => setC1(event.target.value)}><option>Нет</option><option>Фланец</option><option>Бандаж</option><option>Рейка</option></select></label>
          <label>C2<select value={c2} onChange={(event) => setC2(event.target.value)}><option>Нет</option><option>Фланец</option><option>Бандаж</option><option>Рейка</option></select></label>
          <label>S1<input value={result.seamType} readOnly /></label>
          <label>D1<input value="Нет" readOnly /></label>
          <label>D2<input value="Нет" readOnly /></label>
        </div>
      ) : null}
    </aside>
  )
}

function BottomActionBar({ openHole, openUnfold, update, addWork }: { openHole: () => void; openUnfold: () => void; update: () => void; addWork: () => void }) {
  return (
    <div className="r001-bottom-bar">
      <button type="button" onClick={openHole}>Отверстие</button>
      <button type="button" onClick={openUnfold}>Развертка</button>
      <button type="button" onClick={update}>Обновить</button>
      <button type="button">Отменить</button>
      <button type="button" className="r001-primary" onClick={addWork}>В работу</button>
    </div>
  )
}

function ServiceHoleModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="r001-modal-backdrop">
      <section className="r001-modal r001-service-dialog" aria-modal="true" role="dialog" aria-labelledby="service-hole-title">
        <h3 id="service-hole-title">Отверстие</h3>
        <label>Выбор стороны<select defaultValue="Верх"><option>Верх</option><option>Низ</option><option>Лево</option><option>Право</option></select></label>
        <div className="r001-modal-actions">
          <button type="button" onClick={onClose}>Отменить</button>
          <button type="button" className="r001-primary" onClick={onClose}>Да</button>
        </div>
      </section>
    </div>
  )
}

function UnfoldViewer({ result, length, thickness, onClose }: { result: R001DemoResult; length: number; thickness: number; onClose: () => void }) {
  return (
    <div className="r001-modal-backdrop">
      <section className="r001-unfold-modal" aria-modal="true" role="dialog" aria-labelledby="unfold-title">
        <header><h3 id="unfold-title">Развертка</h3><button type="button" onClick={onClose}>×</button></header>
        <div className="r001-unfold-body">
          <div className="r001-unfold-canvas">
            <svg viewBox="0 0 620 420">
              <pattern id="r001-grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" fill="none" stroke="#c9c9c9" strokeWidth="1" /></pattern>
              <rect width="620" height="420" fill="url(#r001-grid)" />
              {(() => {
                const scale = Math.min(500 / length, 300 / result.unfoldWidth)
                const rectWidth = length * scale
                const rectHeight = result.unfoldWidth * scale
                const rectX = (620 - rectWidth) / 2
                const rectY = (400 - rectHeight) / 2
                return (
                  <g>
                    <rect x={rectX} y={rectY} width={rectWidth} height={rectHeight} fill="#dbe6ff" stroke="#2457b8" strokeWidth="3" />
                    <g fontSize="13" fontWeight="800">
                      <rect x={rectX} y={rectY - 24} width="132" height="18" fill="#ffe600" />
                      <text x={rectX + 4} y={rectY - 10} fill="#111">S1 {result.seamType}</text>
                      <rect x={rectX + rectWidth - 150} y={rectY + rectHeight + 8} width="150" height="18" fill="#ffe600" />
                      <text x={rectX + rectWidth - 146} y={rectY + rectHeight + 22} fill="#111">π×A = {formatNumber(result.circumference)}</text>
                      <rect x={rectX} y={rectY + rectHeight + 8} width="128" height="18" fill="#ffe600" />
                      <text x={rectX + 4} y={rectY + rectHeight + 22} fill="#111">припуск {result.allowance} мм</text>
                      <rect x={rectX + rectWidth / 2 - 34} y={rectY + rectHeight / 2 - 10} width="68" height="18" fill="#ffe600" />
                      <text x={rectX + rectWidth / 2 - 30} y={rectY + rectHeight / 2 + 4} fill="#111">A {formatNumber(result.unfoldWidth - result.allowance, 0)}</text>
                    </g>
                  </g>
                )
              })()}
            </svg>
          </div>
          <aside>
            <strong>Параметры</strong>
            <span>Размер X = {length}</span>
            <span>Размер Y = {formatNumber(result.unfoldWidth)}</span>
            <span>Площадь = {formatNumber(result.area)}</span>
            <span>Часть = 1/1</span>
            <span>Материал = GALVANISED</span>
            <span>Толщина = {thickness}</span>
          </aside>
        </div>
      </section>
    </div>
  )
}

function ServiceWorkListModal({ items, diameter, length, thickness, c1, c2, onClose }: { items: WorkItem[]; diameter: number; length: number; thickness: number; c1: string; c2: string; onClose: () => void }) {
  return (
    <div className="r001-modal-backdrop">
      <section className="r001-work-modal" aria-modal="true" role="dialog" aria-labelledby="work-list-title">
        <header><h3 id="work-list-title">Список работы</h3><button type="button" onClick={onClose}>×</button></header>
        <table>
          <thead><tr><th>№</th><th>Изделие</th><th>Кол-во</th><th>Материал</th><th>Толщина</th><th>A</th><th>B</th><th>S1</th><th>C1</th><th>C2</th><th>Площадь</th><th>Статус</th></tr></thead>
          <tbody>
            {(items.length ? items : [{ id: 1, quantity: 1, area: calculateR001PrototypeDemo({ diameter, length, thickness }).area, seamType: calculateR001PrototypeDemo({ diameter, length, thickness }).seamType }]).map((item) => (
              <tr key={item.id}><td>{item.id}</td><td>труба 14</td><td>{item.quantity}</td><td>GALVANISED</td><td>{thickness}</td><td>{diameter}</td><td>{length}</td><td>{item.seamType}</td><td>{c1}</td><td>{c2}</td><td>{formatNumber(item.area, length > 425 ? 1 : 3)}</td><td>готово</td></tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}

function ServiceR001Calculator({
  diameter,
  setDiameter,
  length,
  setLength,
  quantity,
  setQuantity,
  thickness,
  setThickness,
  result,
}: {
  diameter: number
  setDiameter: (value: number) => void
  length: number
  setLength: (value: number) => void
  quantity: number
  setQuantity: (value: number) => void
  thickness: number
  setThickness: (value: number) => void
  result: R001DemoResult
}) {
  const [tab, setTab] = useState<ServiceTab>('dimensions')
  const [seamAngle, setSeamAngle] = useState(90)
  const [c1, setC1] = useState('Нет')
  const [c2, setC2] = useState('Нет')
  const [toast, setToast] = useState('')
  const [holeOpen, setHoleOpen] = useState(false)
  const [unfoldOpen, setUnfoldOpen] = useState(false)
  const [workOpen, setWorkOpen] = useState(false)
  const [workItems, setWorkItems] = useState<WorkItem[]>([])

  const showToast = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 1500)
  }

  const addWork = () => {
    setWorkItems([{ id: 1, quantity, area: result.area, seamType: result.seamType }])
    showToast('R-001 добавлен в список работы.')
  }

  return (
    <div className="r001-service-shell">
      <TopToolbar openWorkList={() => setWorkOpen(true)} showToast={showToast} />
      <div className="r001-service-main">
        <VisualWorkspace diameter={diameter} length={length} seamAngle={seamAngle} seamType={result.seamType} c1={c1} c2={c2} />
        <RightPropertyPanel tab={tab} setTab={setTab} diameter={diameter} setDiameter={setDiameter} length={length} setLength={setLength} thickness={thickness} setThickness={setThickness} quantity={quantity} setQuantity={setQuantity} seamAngle={seamAngle} setSeamAngle={setSeamAngle} c1={c1} setC1={setC1} c2={c2} setC2={setC2} result={result} />
      </div>
      <div className="r001-service-diagnostics" aria-label="Service diagnostics">
        <span>S1 = {result.seamType}</span>
        <span>allowance = {result.allowance} мм</span>
        <span>unfoldWidth = {formatNumber(result.unfoldWidth)} мм</span>
        <span>area = {formatNumber(result.area)} м²</span>
      </div>
      <BottomActionBar openHole={() => setHoleOpen(true)} openUnfold={() => setUnfoldOpen(true)} update={() => showToast('R-001 обновлён.')} addWork={addWork} />
      {toast ? <div className="r001-toast">{toast}</div> : null}
      {holeOpen ? <ServiceHoleModal onClose={() => setHoleOpen(false)} /> : null}
      {unfoldOpen ? <UnfoldViewer result={result} length={length} thickness={thickness} onClose={() => setUnfoldOpen(false)} /> : null}
      {workOpen ? <ServiceWorkListModal items={workItems} diameter={diameter} length={length} thickness={thickness} c1={c1} c2={c2} onClose={() => setWorkOpen(false)} /> : null}
    </div>
  )
}

export function R001PrototypePage() {
  const [mode, setMode] = useState<PrototypeMode>('public')
  const [diameter, setDiameter] = useState(125)
  const [length, setLength] = useState(1000)
  const [quantity, setQuantity] = useState(1)
  const [thickness, setThickness] = useState(0.5)
  const [holes, setHoles] = useState<Hole[]>([])
  const [positions, setPositions] = useState<SpecPosition[]>([])
  const result = useMemo(() => calculateR001PrototypeDemo({ diameter, length, thickness }), [diameter, length, thickness])

  const addHole = (hole: Omit<Hole, 'id'>) => {
    setHoles((current) => [...current, { ...hole, id: current.length + 1 }])
  }

  const addPosition = () => {
    setPositions((current) => [
      ...current,
      { id: current.length + 1, diameter, length, thickness, quantity, holes: holes.length, area: result.area },
    ])
  }

  return (
    <div className="r001-prototype-page">
      <div className="r001-prototype-top">
        <div>
          <span>Опытный UI-прототип</span>
          <h1>R-001 / Труба прямошовная</h1>
        </div>
        <ModeSwitcher mode={mode} setMode={setMode} />
      </div>
      {mode === 'public' ? (
        <PublicR001Calculator diameter={diameter} setDiameter={setDiameter} length={length} setLength={setLength} quantity={quantity} setQuantity={setQuantity} thickness={thickness} setThickness={setThickness} holes={holes} addHole={addHole} positions={positions} addPosition={addPosition} result={result} />
      ) : (
        <ServiceR001Calculator diameter={diameter} setDiameter={setDiameter} length={length} setLength={setLength} quantity={quantity} setQuantity={setQuantity} thickness={thickness} setThickness={setThickness} result={result} />
      )}
    </div>
  )
}
