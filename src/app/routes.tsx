import { createHashRouter } from 'react-router-dom'
import { App } from './App'
import { AtlasPage } from '../pages/AtlasPage'
import { CalculatorPage } from '../pages/CalculatorPage'
import { FormulaCardsPage } from '../pages/FormulaCardsPage'
import { HomePage } from '../pages/HomePage'
import { R001PrototypePage } from '../pages/R001PrototypePage'
import { SpecificationPage } from '../pages/SpecificationPage'
import { SplitPage } from '../pages/SplitPage'

export const AppRouter = createHashRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'atlas', element: <AtlasPage /> },
      { path: 'calculator', element: <CalculatorPage /> },
      { path: 'formulas', element: <FormulaCardsPage /> },
      { path: 'split', element: <SplitPage /> },
      { path: 'specification', element: <SpecificationPage /> },
      { path: 'prototype/r001', element: <R001PrototypePage /> },
    ],
  },
])
