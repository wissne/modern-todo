import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import RootRouter from './RootRouter'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RootRouter />
  </StrictMode>,
)
