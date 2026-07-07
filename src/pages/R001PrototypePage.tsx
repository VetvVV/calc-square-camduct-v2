import { type ReactNode, useEffect, useMemo, useState } from 'react'
import { calculateR001PrototypeDemo, type R001DemoResult } from '../prototypes/r001DemoEngine'
import { R001ProductDiagram } from '../components/Calculator/R001ProductDiagram'

type AccessState = 'guest' | 'user' | 'client' | 'admin'

const ACCESS_STATUS: Record<AccessState, string> = {
  guest: 'Ознакомительный расчёт',
  user: 'Ознакомительный доступ',
  client: 'Рабочий кабинет подключён',
  admin: 'Администрирование',
}
const CALC_LIMIT: Record<AccessState, number> = {
  guest: 5,
  user: 20,
  client: Infinity,
  admin: Infinity,
}
const MATERIALS = [
  'Оцинкованная сталь',
  'Нержавеющая 430 техническая',
  'Нержавеющая 304 пищевая',
]
const COMPANY = { phone: '+38 (044) 000-00-00', email: 'info@spetsmontazh.example', site: 'spetsmontazh.example' }
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

const STANDARD_SIZES = [100, 125, 140, 160, 180, 200, 224, 250, 280, 315, 355, 400, 450, 500, 560, 630, 710, 800, 900, 1000, 1120, 1250]

interface SpecPosition {
  id: number
  diameter: number
  length: number
  thickness: number
  material: string
  quantity: number
  holes: number
  area: number
}

function formatNumber(value: number, digits = 3) {
  return value.toFixed(digits)
}

function PrototypeWatermark() {
  return (
    <div className="r001-watermark" aria-hidden="true">
      <span>ОПЫТНЫЙ ОБРАЗЕЦ</span>
    </div>
  )
}

function TestModeSwitcher({ access, setAccess }: { access: AccessState; setAccess: (value: AccessState) => void }) {
  const states: AccessState[] = ['guest', 'user', 'client', 'admin']
  return (
    <div className="r001-testmode" aria-label="Тестовый режим прототипа">
      <span className="r001-testmode-label">Тестовый режим прототипа</span>
      <div className="r001-testmode-buttons">
        {states.map((state) => (
          <button key={state} type="button" className={access === state ? 'is-active' : ''} onClick={() => setAccess(state)}>
            {ACCESS_STATUS[state]}
          </button>
        ))}
      </div>
    </div>
  )
}

function AccessStatusBar({
  access,
  specCount,
  engineeringOn,
  toggleEngineering,
  openSpec,
}: {
  access: AccessState
  specCount: number
  engineeringOn: boolean
  toggleEngineering: () => void
  openSpec: () => void
}) {
  const specLabel = specCount === 1 ? '1 позиция' : `${specCount} позиции`
  return (
    <div className="r001-status-bar">
      <div className="r001-status-left">
        <span className="r001-status-chip">{ACCESS_STATUS[access]}</span>
        <button type="button" className="r001-spec-indicator" onClick={openSpec}>
          Спецификация · {specLabel}
        </button>
      </div>
      <div className="r001-status-right">
        {access === 'admin' ? (
          <button
            type="button"
            className={`r001-eng-toggle${engineeringOn ? ' is-on' : ''}`}
            onClick={toggleEngineering}
            aria-label={engineeringOn ? 'Инженерный режим включён' : 'Инженерный режим выключен'}
            title={engineeringOn ? 'Инженерный режим включён' : 'Инженерный режим выключен'}
          >
            {engineeringOn ? '⚙ ON' : '⚙ OFF'}
          </button>
        ) : (
          <>
            <button type="button" className="r001-soft-action">Войти</button>
            <button type="button" className="r001-soft-action">Зарегистрироваться</button>
          </>
        )}
      </div>
    </div>
  )
}

function NavStrip() {
  return (
    <nav className="r001-nav-strip" aria-label="Навигация по атласу">
      <button type="button">← Атлас</button>
      <span>Воздуховод круглый</span>
      <button type="button">Круглые →</button>
    </nav>
  )
}

function QuantityStepper({ quantity, setQuantity }: { quantity: number; setQuantity: (value: number) => void }) {
  const clamp = (value: number) => Math.max(1, Math.floor(Number.isFinite(value) ? value : 1))
  return (
    <div className="r001-quantity">
      <span>Количество</span>
      <div className="r001-quantity-control">
        <button type="button" aria-label="Уменьшить количество" onClick={() => setQuantity(clamp(quantity - 1))}>−</button>
        <input
          type="number"
          min={1}
          step={1}
          value={quantity}
          aria-label="Количество"
          onChange={(event) => setQuantity(clamp(Number(event.target.value)))}
        />
        <button type="button" aria-label="Увеличить количество" onClick={() => setQuantity(clamp(quantity + 1))}>+</button>
        <span className="r001-quantity-unit">шт.</span>
      </div>
    </div>
  )
}

function AccessInvitationDialog({ onClose, onConnect }: { onClose: () => void; onConnect: () => void }) {
  const [confirmed, setConfirmed] = useState(false)
  const variants = [
    { title: 'Получить коммерческое предложение', text: 'Для заказа, проекта или регулярных расчётов.', button: 'Запросить КП' },
    { title: 'Получить пробный доступ', text: 'Временный доступ для проверки сервиса на одном проекте или на ограниченный срок.', button: 'Запросить пробный доступ' },
    { title: 'Подключить рабочий кабинет', text: 'Доступ по договору, подписке или решению менеджера.', button: 'Подключить кабинет' },
  ]
  const choose = () => setConfirmed(true)
  return (
    <div className="r001-modal-backdrop" onClick={onClose}>
      <section className="r001-access-dialog" role="dialog" aria-modal="true" aria-labelledby="access-dialog-title" onClick={(event) => event.stopPropagation()}>
        <header>
          <h3 id="access-dialog-title">Выберите формат сотрудничества</h3>
          <button type="button" aria-label="Закрыть" onClick={onClose}>×</button>
        </header>
        {confirmed ? (
          <div className="r001-access-confirm">
            <p>Запрос принят. Менеджер свяжется с вами для подключения доступа.</p>
            <button type="button" className="r001-primary" onClick={onConnect}>Продолжить</button>
          </div>
        ) : (
          <>
            <p className="r001-access-intro">
              Вы уже можете выполнять ознакомительные расчёты. Чтобы работать с проектами, спецификациями, сохранением, печатью и экспортом, подключите рабочий доступ. Выберите удобный вариант — менеджер поможет оформить подключение.
            </p>
            <div className="r001-access-variants">
              {variants.map((variant) => (
                <div key={variant.title} className="r001-access-card">
                  <strong>{variant.title}</strong>
                  <span>{variant.text}</span>
                  <button type="button" onClick={choose}>{variant.button}</button>
                </div>
              ))}
            </div>
            <div className="r001-access-contact">
              <div>
                <strong>Представитель компании / менеджер</strong>
                <span>Телефон: {COMPANY.phone}</span>
                <span>Email: {COMPANY.email}</span>
                <span>Сайт: {COMPANY.site}</span>
              </div>
              <div className="r001-access-qr">
                <div className="r001-access-qr-code" aria-hidden="true" />
                <span>Отсканируйте QR-код, чтобы перейти к регистрации или открыть кабинет.</span>
                <span className="r001-access-qr-fallback">Если QR не открылся, используйте кнопку «Открыть сайт компании».</span>
                <button type="button">Открыть сайт компании</button>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  )
}

function AccessComment({ access, remaining, limit, comment, setComment }: { access: AccessState; remaining: number; limit: number; comment: string; setComment: (value: string) => void }) {
  if (access === 'guest') {
    return (
      <div className="r001-access-comment is-guest">
        Ознакомительный расчёт: доступно {remaining} из {limit} расчётов. Добавление в проект доступно после подключения рабочего кабинета.
      </div>
    )
  }
  if (access === 'user') {
    return (
      <div className="r001-access-comment is-user">
        Ознакомительный доступ: доступно {remaining} из {limit} расчётов. Спецификация доступна для просмотра; сохранение, печать и экспорт доступны после подключения рабочего кабинета.
      </div>
    )
  }
  return (
    <label className="r001-comment-field">
      Комментарий
      <textarea value={comment} rows={2} placeholder="Комментарий к позиции" onChange={(event) => setComment(event.target.value)} />
    </label>
  )
}

function PublicProductVisual({ diameter, length, holes, area, positionsCount }: { diameter: number; length: number; holes: Hole[]; area: number; positionsCount: number }) {
  return (
    <div className="r001-public-visual" aria-label="Схема трубы прямошовной">
      <R001ProductDiagram diameter={diameter} length={length} holes={holes} />
      <div className="r001-public-metrics">
        <div>
          <span>Площадь</span>
          <strong>{formatNumber(area)} м²</strong>
        </div>
        <div>
          <span>Позиции</span>
          <strong>{positionsCount}</strong>
        </div>
        {holes.length ? (
          <div>
            <span>Отверстия</span>
            <strong>{holes.length}</strong>
          </div>
        ) : null}
      </div>
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

function PublicSpecification({ positions, holes, area, quantity, diameter, length, thickness, material, readOnly = false, onClose, onLockedAction }: { positions: SpecPosition[]; holes: Hole[]; area: number; quantity: number; diameter: number; length: number; thickness: number; material: string; readOnly?: boolean; onClose?: () => void; onLockedAction?: () => void }) {
  const rows: SpecPosition[] = positions.length
    ? positions
    : [{ id: 1, diameter, length, thickness, material, quantity, holes: holes.length, area }]

  return (
    <section className="r001-public-spec">
      <header className="r001-public-spec-head">
        <h3>Список позиций{readOnly ? ' · только просмотр' : ''}</h3>
        {onClose ? <button type="button" aria-label="Закрыть" onClick={onClose}>×</button> : null}
      </header>
      <div className="r001-public-spec-actions">
        <button type="button" onClick={() => (readOnly ? onLockedAction?.() : undefined)}>Сохранить</button>
        <button type="button" onClick={() => (readOnly ? onLockedAction?.() : undefined)}>Печать</button>
        <button type="button" onClick={() => (readOnly ? onLockedAction?.() : undefined)}>Экспорт</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>№</th>
            <th>Изделие</th>
            <th>Диаметр D</th>
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
              <td>Воздуховод круглый / труба прямошовная</td>
              <td>{row.diameter}</td>
              <td>{row.length}</td>
              <td>{row.quantity}</td>
              <td>{row.material}</td>
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
  access,
  diameter,
  setDiameter,
  length,
  setLength,
  quantity,
  setQuantity,
  thickness,
  setThickness,
  material,
  setMaterial,
  holes,
  addHole,
  positions,
  addPosition,
  result,
  remaining,
  limit,
  requestAccess,
}: {
  access: AccessState
  diameter: number
  setDiameter: (value: number) => void
  length: number
  setLength: (value: number) => void
  quantity: number
  setQuantity: (value: number) => void
  thickness: number
  setThickness: (value: number) => void
  material: string
  setMaterial: (value: string) => void
  holes: Hole[]
  addHole: (hole: Omit<Hole, 'id'>) => void
  positions: SpecPosition[]
  addPosition: () => void
  result: R001DemoResult
  remaining: number
  limit: number
  requestAccess: () => void
}) {
  const [holeOpen, setHoleOpen] = useState(false)
  const [optionsOpen, setOptionsOpen] = useState(false)
  const [comment, setComment] = useState('')
  const [added, setAdded] = useState(false)

  const canAdd = access !== 'guest'
  const description = `Воздуховод круглый / труба прямошовная · D ${diameter} мм · L ${length} мм · ${quantity} шт · ${material} · ${thickness} мм`

  const handleAdd = () => {
    if (!canAdd) {
      requestAccess()
      return
    }
    addPosition()
    setAdded(true)
    window.setTimeout(() => setAdded(false), 2400)
  }

  return (
    <div className="r001-public-shell">
      <NavStrip />
      <div className="r001-public-grid">
        <div className="r001-public-left">
          <PublicProductVisual diameter={diameter} length={length} holes={holes} area={result.area} positionsCount={positions.length} />
          <div className="r001-spec-block">
            <div className="r001-spec-area">
              Площадь: <strong>{formatNumber(result.area * quantity)} м²</strong>
            </div>
            <div className="r001-spec-description">{description}</div>
            <AccessComment access={access} remaining={remaining} limit={limit} comment={comment} setComment={setComment} />
            <button
              type="button"
              className={`r001-add-project${canAdd ? ' r001-primary' : ' is-muted'}${added ? ' is-added' : ''}`}
              onClick={handleAdd}
            >
              {added ? 'Добавлено в проект' : 'Добавить в проект'}
            </button>
          </div>
        </div>
        <section className="r001-public-form">
          <label className="r001-field-d">
            D / Диаметр, мм
            <input type="number" list="r001-standard-sizes" value={diameter} onChange={(event) => setDiameter(Number(event.target.value || 0))} />
          </label>
          <label className="r001-field-l">
            L / Длина, мм
            <input type="number" list="r001-standard-sizes" value={length} onChange={(event) => setLength(Number(event.target.value || 0))} />
          </label>
          <datalist id="r001-standard-sizes">
            {STANDARD_SIZES.map((size) => (
              <option key={size} value={size} />
            ))}
          </datalist>
          <QuantityStepper quantity={quantity} setQuantity={setQuantity} />
          <label>
            Материал
            <select value={material} onChange={(event) => setMaterial(event.target.value)}>
              {MATERIALS.map((name) => (
                <option key={name} value={name}>{name}</option>
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
                  {holes.length ? <span className="r001-options-count">Отверстий: {holes.length}</span> : null}
                </div>
              </div>
            ) : null}
          </div>
        </section>
      </div>
      {holeOpen ? <PublicHoleModal onClose={() => setHoleOpen(false)} onAdd={(hole) => { addHole(hole); setHoleOpen(false) }} /> : null}
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
  material,
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
  material: string
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
          <label>Код<input value="KRG-001" readOnly /></label>
          <label>Материал<input value={material} readOnly /></label>
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

function UnfoldViewer({ result, length, thickness, material, onClose }: { result: R001DemoResult; length: number; thickness: number; material: string; onClose: () => void }) {
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
            <span>Материал = {material}</span>
            <span>Толщина = {thickness}</span>
          </aside>
        </div>
      </section>
    </div>
  )
}

function ServiceDebugPanel({ payload }: { payload: Record<string, unknown> }) {
  const [open, setOpen] = useState(false)
  return (
    <section className="r001-debug-panel" aria-label="Service debug">
      <header>
        <span className="r001-debug-badge">СЕРВИС</span>
        <strong>Отладка</strong>
        <span className="r001-debug-visibility">Visibility: Admin-Service</span>
        <button type="button" onClick={() => setOpen((value) => !value)}>
          {open ? 'Скрыть debug' : 'Показать debug'}
        </button>
      </header>
      {open ? <pre>{JSON.stringify(payload, null, 2)}</pre> : null}
    </section>
  )
}

function ServiceWorkListModal({ items, diameter, length, thickness, material, c1, c2, onClose }: { items: WorkItem[]; diameter: number; length: number; thickness: number; material: string; c1: string; c2: string; onClose: () => void }) {
  return (
    <div className="r001-modal-backdrop">
      <section className="r001-work-modal" aria-modal="true" role="dialog" aria-labelledby="work-list-title">
        <header><h3 id="work-list-title">Список работы</h3><button type="button" onClick={onClose}>×</button></header>
        <table>
          <thead><tr><th>№</th><th>Изделие</th><th>Кол-во</th><th>Материал</th><th>Толщина</th><th>A</th><th>B</th><th>S1</th><th>C1</th><th>C2</th><th>Площадь</th><th>Статус</th></tr></thead>
          <tbody>
            {(items.length ? items : [{ id: 1, quantity: 1, area: calculateR001PrototypeDemo({ diameter, length, thickness }).area, seamType: calculateR001PrototypeDemo({ diameter, length, thickness }).seamType }]).map((item) => (
              <tr key={item.id}><td>{item.id}</td><td>труба 14</td><td>{item.quantity}</td><td>{material}</td><td>{thickness}</td><td>{diameter}</td><td>{length}</td><td>{item.seamType}</td><td>{c1}</td><td>{c2}</td><td>{formatNumber(item.area, length > 425 ? 1 : 3)}</td><td>готово</td></tr>
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
  material,
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
  material: string
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
    showToast('KRG-001 добавлен в список работы.')
  }

  return (
    <div className="r001-service-shell">
      <TopToolbar openWorkList={() => setWorkOpen(true)} showToast={showToast} />
      <div className="r001-service-main">
        <VisualWorkspace diameter={diameter} length={length} seamAngle={seamAngle} seamType={result.seamType} c1={c1} c2={c2} />
        <RightPropertyPanel tab={tab} setTab={setTab} material={material} diameter={diameter} setDiameter={setDiameter} length={length} setLength={setLength} thickness={thickness} setThickness={setThickness} quantity={quantity} setQuantity={setQuantity} seamAngle={seamAngle} setSeamAngle={setSeamAngle} c1={c1} setC1={setC1} c2={c2} setC2={setC2} result={result} />
      </div>
      <div className="r001-service-diagnostics" aria-label="Service diagnostics">
        <span>S1 = {result.seamType}</span>
        <span>allowance = {result.allowance} мм</span>
        <span>unfoldWidth = {formatNumber(result.unfoldWidth)} мм</span>
        <span>area = {formatNumber(result.area)} м²</span>
        <span>mass = {formatNumber(result.area * (thickness / 1000) * 7850)} кг</span>
      </div>
      <ServiceDebugPanel
        payload={{
          mode: 'service',
          visibility: 'Admin-Service',
          input: { A: diameter, B: length, C: 0, D: 0, T: thickness, quantity, material, C1: c1, C2: c2, seamAngle },
          trace: {
            circumference: Number(result.circumference.toFixed(3)),
            seamType: result.seamType,
            allowance: result.allowance,
            unfoldWidth: Number(result.unfoldWidth.toFixed(3)),
            area: Number(result.area.toFixed(3)),
          },
        }}
      />
      <BottomActionBar openHole={() => setHoleOpen(true)} openUnfold={() => setUnfoldOpen(true)} update={() => showToast('KRG-001 обновлён.')} addWork={addWork} />
      {toast ? <div className="r001-toast">{toast}</div> : null}
      {holeOpen ? <ServiceHoleModal onClose={() => setHoleOpen(false)} /> : null}
      {unfoldOpen ? <UnfoldViewer result={result} length={length} thickness={thickness} material={material} onClose={() => setUnfoldOpen(false)} /> : null}
      {workOpen ? <ServiceWorkListModal items={workItems} diameter={diameter} length={length} thickness={thickness} material={material} c1={c1} c2={c2} onClose={() => setWorkOpen(false)} /> : null}
    </div>
  )
}

export function R001PrototypePage() {
  const [access, setAccess] = useState<AccessState>('guest')
  const [engineeringOn, setEngineeringOn] = useState(false)
  const [diameter, setDiameter] = useState(125)
  const [length, setLength] = useState(1000)
  const [quantity, setQuantity] = useState(1)
  const [thickness, setThickness] = useState(0.5)
  const [material, setMaterial] = useState('Оцинкованная сталь')
  const [holes, setHoles] = useState<Hole[]>([])
  const [positions, setPositions] = useState<SpecPosition[]>([])
  const [used, setUsed] = useState(0)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [specOpen, setSpecOpen] = useState(false)

  const limit = CALC_LIMIT[access]
  const remaining = Number.isFinite(limit) ? Math.max(0, limit - used) : Infinity
  const overLimit = used >= limit

  const liveResult = useMemo(() => calculateR001PrototypeDemo({ diameter, length, thickness }), [diameter, length, thickness])
  const [frozenResult, setFrozenResult] = useState(liveResult)
  useEffect(() => {
    if (!overLimit) setFrozenResult(liveResult)
  }, [liveResult, overLimit])
  const result = overLimit ? frozenResult : liveResult

  // engineering режим доступен только admin; при выходе из admin — сброс
  useEffect(() => {
    if (access !== 'admin' && engineeringOn) setEngineeringOn(false)
  }, [access, engineeringOn])

  const requestAccess = () => setDialogOpen(true)

  const changeCalcInput = (setter: (value: number) => void) => (value: number) => {
    if (overLimit) {
      setDialogOpen(true)
      return
    }
    setter(value)
    setUsed((current) => current + 1)
  }

  const addHole = (hole: Omit<Hole, 'id'>) => {
    setHoles((current) => [...current, { ...hole, id: current.length + 1 }])
  }

  const addPosition = () => {
    setPositions((current) => [
      ...current,
      { id: current.length + 1, diameter, length, thickness, material, quantity, holes: holes.length, area: result.area },
    ])
  }

  const openSpec = () => {
    if (access === 'guest') {
      setDialogOpen(true)
      return
    }
    setSpecOpen(true)
  }

  const engineeringView = access === 'admin' && engineeringOn

  return (
    <div className="r001-prototype-page">
      <PrototypeWatermark />
      <TestModeSwitcher access={access} setAccess={setAccess} />
      <AccessStatusBar
        access={access}
        specCount={positions.length}
        engineeringOn={engineeringOn}
        toggleEngineering={() => setEngineeringOn((value) => !value)}
        openSpec={openSpec}
      />
      {engineeringView ? (
        <ServiceR001Calculator
          diameter={diameter}
          setDiameter={setDiameter}
          length={length}
          setLength={setLength}
          quantity={quantity}
          setQuantity={setQuantity}
          thickness={thickness}
          setThickness={setThickness}
          material={material}
          result={result}
        />
      ) : (
        <PublicR001Calculator
          access={access}
          diameter={diameter}
          setDiameter={changeCalcInput(setDiameter)}
          length={length}
          setLength={changeCalcInput(setLength)}
          quantity={quantity}
          setQuantity={setQuantity}
          thickness={thickness}
          setThickness={changeCalcInput(setThickness)}
          material={material}
          setMaterial={setMaterial}
          holes={holes}
          addHole={addHole}
          positions={positions}
          addPosition={addPosition}
          result={result}
          remaining={Number.isFinite(remaining) ? remaining : limit}
          limit={limit}
          requestAccess={requestAccess}
        />
      )}
      {specOpen ? (
        <div className="r001-modal-backdrop" onClick={() => setSpecOpen(false)}>
          <div onClick={(event) => event.stopPropagation()}>
            <PublicSpecification
              positions={positions}
              holes={holes}
              area={result.area}
              quantity={quantity}
              diameter={diameter}
              length={length}
              thickness={thickness}
              material={material}
              readOnly={access === 'user'}
              onClose={() => setSpecOpen(false)}
              onLockedAction={() => { setSpecOpen(false); setDialogOpen(true) }}
            />
          </div>
        </div>
      ) : null}
      {dialogOpen ? (
        <AccessInvitationDialog
          onClose={() => setDialogOpen(false)}
          onConnect={() => { setAccess('client'); setUsed(0); setDialogOpen(false) }}
        />
      ) : null}
    </div>
  )
}
