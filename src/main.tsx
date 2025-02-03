import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { BlueprintProvider  } from '@blueprintjs/core'
import { RecoilRoot } from 'recoil'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RecoilRoot>
      <BlueprintProvider>
        <App />
      </BlueprintProvider>
    </RecoilRoot>
  </StrictMode>,
)
