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

export function FormulaCardsPage() {
  const role = useAppStore((state) => state.role)
  const canView = canViewFormulaDetails(role)

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
                <th>Источник</th>
              </tr>
            </thead>
            <tbody>
              {formulaRegistry.map((item) => (
                <tr key={item.code}>
                  <td>{item.code}</td>
                  <td>{item.title}</td>
                  <td>{item.category}</td>
                  <td>{item.cleanArea}</td>
                  <td>{item.fullArea}</td>
                  <td>
                    <span className={`formula-status-v1 formula-status-v1--${item.status.replace(/\s+/g, '-').toLowerCase()}`}>
                      {item.status}
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
          <h2 id="formula-details-title">Карточки с формулами</h2>
          <p>{formulaDetailCards.length} карточек</p>
        </div>

        <div className="formula-cards-grid-v1">
          {formulaDetailCards.map((card) => (
            <article className="formula-card-v1" key={card.code}>
              <header>
                <span>{card.code}</span>
                <h2>{card.title}</h2>
                <p>{card.category}</p>
              </header>

              <FormulaList title="Параметры" lines={card.parameters} />
              <FormulaList title="Sчистовая" lines={card.cleanAreaLines} />
              <FormulaList title="Sполная" lines={card.fullAreaLines} />
              <FormulaList title="Статус" lines={card.statusLines} />
              <FormulaList title="Источник" lines={card.sourceLines} />
            </article>
          ))}
        </div>
      </section>
    </section>
  )
}
