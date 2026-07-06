import { useMemo, useState } from 'react'
import { formulaDetailCards, formulaRegistry } from '../data/formulaCards'
import { useAppStore } from '../store/appStore'
import { canViewFormulaDetails } from '../roles/permissions'

function FormulaList({ title, lines }: { title: string; lines: string[] }) {
  return (
    <section>
      <h3>{title}</h3>
      <ul>
        {lines.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    </section>
  )
}

const statusClassByName = {
  Проверена: 'checked',
  Условная: 'conditional',
  'Только Sчистовая': 'clean-only',
  'Требует уточнения': 'needs-check',
}

const formulaStateClassByName = {
  Проверена: 'checked',
  Условная: 'conditional',
  'Только Sчистовая': 'clean-only',
  'Не найдена в источниках': 'not-found',
  'Нужен вывод формулы': 'derive',
  'Нужна сверка с CAMduct': 'camduct-check',
}

export function FormulaCardsPage() {
  const role = useAppStore((state) => state.role)
  const canView = canViewFormulaDetails(role)
  const [selectedCode, setSelectedCode] = useState('KRG-001')
  const detailByCode = useMemo(() => new Map(formulaDetailCards.map((card) => [card.code, card])), [])
  const selectedCard = detailByCode.get(selectedCode) ?? formulaDetailCards[0]

  if (!canView) {
    return (
      <section className="formula-cards-page-v1">
        <div className="formula-cards-denied-v1" role="status">
          Этот раздел доступен только для административного или сервисного режима.
        </div>
      </section>
    )
  }

  return (
    <section className="formula-cards-page-v1" aria-labelledby="formula-cards-title">
      <header className="formula-cards-head-v1">
        <p>Инженерная справка</p>
        <h1 id="formula-cards-title">Формулы / инженерная справка</h1>
        <span>Главный показатель для расхода материала — Sполная. Масса и количество здесь не считаются.</span>
      </header>

      <section className="formula-registry-v1" aria-labelledby="formula-registry-title">
        <div className="formula-registry-head-v1">
          <h2 id="formula-registry-title">Контрольный реестр каталога</h2>
          <p>{formulaRegistry.length} изделий</p>
        </div>
        <p className="formula-registry-hint-v1">Нажмите на строку изделия, чтобы открыть карточку формулы ниже.</p>

        <div className="formula-registry-table-wrap-v1">
          <table className="formula-registry-table-v1">
            <thead>
              <tr>
                <th>Код</th>
                <th>Изделие</th>
                <th>Категория</th>
                <th>Sчистовая</th>
                <th>Sполная</th>
                <th>Статус</th>
                <th>Состояние формулы</th>
                <th>Источник</th>
              </tr>
            </thead>
            <tbody>
              {formulaRegistry.map((item) => (
                <tr
                  aria-selected={item.code === selectedCode}
                  className={item.code === selectedCode ? 'is-selected' : undefined}
                  key={item.code}
                  onClick={() => setSelectedCode(item.code)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      setSelectedCode(item.code)
                    }
                  }}
                  tabIndex={0}
                >
                  <td>{item.code}</td>
                  <td>{item.title}</td>
                  <td>{item.category}</td>
                  <td>{item.cleanArea}</td>
                  <td>{item.fullArea}</td>
                  <td>
                    <span className={`formula-status-v1 formula-status-v1--${statusClassByName[item.status]}`}>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <span className={`formula-status-v1 formula-state-v1--${formulaStateClassByName[item.formulaState]}`}>
                      {item.formulaState}
                    </span>
                  </td>
                  <td>{item.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="formula-details-v1" aria-labelledby="formula-details-title">
        <div className="formula-registry-head-v1">
          <h2 id="formula-details-title">Карточка выбранного изделия</h2>
          <p>{selectedCard.code}</p>
        </div>

        <article className="formula-card-v1 formula-card-v1--selected" key={selectedCard.code}>
          <header>
            <span>{selectedCard.code}</span>
            <h2>{selectedCard.title}</h2>
            <p>{selectedCard.category}</p>
          </header>

          <FormulaList title="Параметры" lines={selectedCard.parameters} />
          <FormulaList title="Sчистовая" lines={selectedCard.cleanAreaLines} />
          <FormulaList title="Sполная" lines={selectedCard.fullAreaLines} />
          <FormulaList title="Статус" lines={selectedCard.statusLines} />
          <FormulaList title="Состояние формулы" lines={[selectedCard.formulaState]} />
          <FormulaList title="Источник" lines={selectedCard.sourceLines} />
          <FormulaList title="Следующее действие" lines={[selectedCard.nextAction]} />
          {selectedCard.notes ? <FormulaList title="Что проверить / примечание" lines={selectedCard.notes} /> : null}
        </article>
      </section>
    </section>
  )
}
