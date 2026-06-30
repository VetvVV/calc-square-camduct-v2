import { createHashRouter } from 'react-router-dom'
import { App } from './App'
import { AtlasPage } from '../pages/AtlasPage'
import { HomePage } from '../pages/HomePage'
import { SpecificationPage } from '../pages/SpecificationPage'
import { SplitPage } from '../pages/SplitPage'

export const AppRouter = createHashRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'atlas', element: <AtlasPage /> },
      { path: 'split', element: <SplitPage /> },
      { path: 'specification', element: <SpecificationPage /> },
    ],
  },
])
