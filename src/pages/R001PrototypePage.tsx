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

function PublicSpecification({ holes, area, quantity, diameter, length }: { holes: Hole[]; area: number; quantity: number; diameter: number; length: number }) {
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
            <th>Отверстия</th>
            <th>Площадь</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Труба прямошовная</td>
            <td>{diameter}</td>
            <td>{length}</td>
            <td>{quantity}</td>
            <td>GALVANISED</td>
            <td>Отверстий: {holes.length}</td>
            <td>{formatNumber(area)} м²</td>
          </tr>
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
  holes,
  addHole,
  result,
}: {
  diameter: number
  setDiameter: (value: number) => void
  length: number
  setLength: (value: number) => void
  quantity: number
  setQuantity: (value: number) => void
  holes: Hole[]
  addHole: (hole: Omit<Hole, 'id'>) => void
  result: R001DemoResult
}) {
  const [holeOpen, setHoleOpen] = useState(false)
  const [specVisible, setSpecVisible] = useState(false)

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
            <button type="button" className="r001-primary" onClick={() => setSpecVisible(true)}>
              Добавить в спецификацию
            </button>
            <button type="button" onClick={() => setSpecVisible(true)}>
              Список позиций
            </button>
          </div>
        </section>
      </div>
      {specVisible ? <PublicSpecification holes={holes} area={result.area} quantity={quantity} diameter={diameter} length={length} /> : null}
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

function ServiceSketch({ diameter, length, seamAngle }: { diameter: number; length: number; seamAngle: number }) {
  const seamX = 72 + (seamAngle / 270) * 56
  return (
    <svg viewBox="0 0 320 180" role="img" aria-label="CAMduct-like виды R-001">
      <rect x="38" y="72" width="210" height="44" fill="#fffce8" stroke="#2457b8" strokeWidth="2" />
      <ellipse cx="248" cy="94" rx="30" ry="22" fill="#eaf1ff" stroke="#2457b8" strokeWidth="2" />
      <line x1="58" y1="72" x2="224" y2="72" stroke="#d22d2d" strokeWidth="3" />
      <text x="116" y="62" fill="#111" fontSize="14" fontWeight="700">B {length}</text>
      <text x="58" y="132" fill="#111" fontSize="13" fontWeight="700">C1</text>
      <text x="220" y="132" fill="#111" fontSize="13" fontWeight="700">C2</text>
      <circle cx="93" cy="94" r="34" fill="none" stroke="#2457b8" strokeWidth="2" />
      <line x1={seamX} y1="60" x2={seamX} y2="128" stroke="#d22d2d" strokeWidth="3" />
      <text x="102" y="99" fill="#111" fontSize="13" fontWeight="700">A {diameter}</text>
      <text x="188" y="88" fill="#ffe600" stroke="#333" strokeWidth="0.25" fontSize="13" fontWeight="800">S1</text>
    </svg>
  )
}

function VisualWorkspace({ diameter, length, seamAngle }: { diameter: number; length: number; seamAngle: number }) {
  return (
    <div className="r001-visual-workspace">
      <ViewPanel title="Вид 1"><ServiceSketch diameter={diameter} length={length} seamAngle={seamAngle} /></ViewPanel>
      <ViewPanel title="Вид 2"><ServiceSketch diameter={diameter} length={length} seamAngle={seamAngle} /></ViewPanel>
      <ViewPanel title="Вид 3"><ServiceSketch diameter={diameter} length={length} seamAngle={seamAngle} /></ViewPanel>
      <ViewPanel title="Изометрия"><ServiceSketch diameter={diameter} length={length} seamAngle={seamAngle} /></ViewPanel>
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
          <label>C1<select defaultValue="Нет"><option>Нет</option><option>Фланец</option><option>Бандаж</option><option>Рейка</option></select></label>
          <label>C2<select defaultValue="Нет"><option>Нет</option><option>Фланец</option><option>Бандаж</option><option>Рейка</option></select></label>
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
              <rect x="92" y="84" width="420" height="232" fill="#e5e7eb" stroke="#2457b8" strokeWidth="3" />
              <text x="120" y="126" fill="#111" fontSize="18" fontWeight="800">S1 {result.seamType}</text>
              <text x="120" y="166" fill="#111" fontSize="16">π×A + припуск</text>
              <text x="120" y="206" fill="#111" fontSize="16">Y {formatNumber(result.unfoldWidth)} мм</text>
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

function ServiceWorkListModal({ items, diameter, length, thickness, onClose }: { items: WorkItem[]; diameter: number; length: number; thickness: number; onClose: () => void }) {
  return (
    <div className="r001-modal-backdrop">
      <section className="r001-work-modal" aria-modal="true" role="dialog" aria-labelledby="work-list-title">
        <header><h3 id="work-list-title">Список работы</h3><button type="button" onClick={onClose}>×</button></header>
        <table>
          <thead><tr><th>№</th><th>Изделие</th><th>Кол-во</th><th>Материал</th><th>Толщина</th><th>A</th><th>B</th><th>S1</th><th>C1</th><th>C2</th><th>Площадь</th><th>Статус</th></tr></thead>
          <tbody>
            {(items.length ? items : [{ id: 1, quantity: 1, area: calculateR001PrototypeDemo({ diameter, length, thickness }).area, seamType: calculateR001PrototypeDemo({ diameter, length, thickness }).seamType }]).map((item) => (
              <tr key={item.id}><td>{item.id}</td><td>труба 14</td><td>{item.quantity}</td><td>GALVANISED</td><td>{thickness}</td><td>{diameter}</td><td>{length}</td><td>{item.seamType}</td><td>Нет</td><td>Нет</td><td>{formatNumber(item.area, length > 425 ? 1 : 3)}</td><td>готово</td></tr>
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
        <VisualWorkspace diameter={diameter} length={length} seamAngle={seamAngle} />
        <RightPropertyPanel tab={tab} setTab={setTab} diameter={diameter} setDiameter={setDiameter} length={length} setLength={setLength} thickness={thickness} setThickness={setThickness} quantity={quantity} setQuantity={setQuantity} seamAngle={seamAngle} setSeamAngle={setSeamAngle} result={result} />
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
      {workOpen ? <ServiceWorkListModal items={workItems} diameter={diameter} length={length} thickness={thickness} onClose={() => setWorkOpen(false)} /> : null}
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
  const result = useMemo(() => calculateR001PrototypeDemo({ diameter, length, thickness }), [diameter, length, thickness])

  const addHole = (hole: Omit<Hole, 'id'>) => {
    setHoles((current) => [...current, { ...hole, id: current.length + 1 }])
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
        <PublicR001Calculator diameter={diameter} setDiameter={setDiameter} length={length} setLength={setLength} quantity={quantity} setQuantity={setQuantity} holes={holes} addHole={addHole} result={result} />
      ) : (
        <ServiceR001Calculator diameter={diameter} setDiameter={setDiameter} length={length} setLength={setLength} quantity={quantity} setQuantity={setQuantity} thickness={thickness} setThickness={setThickness} result={result} />
      )}
    </div>
  )
}
