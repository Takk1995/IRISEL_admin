import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import 'primereact/resources/themes/lara-light-indigo/theme.css';  // 主題樣式
import 'primereact/resources/primereact.min.css';                  // 核心樣式
import 'primeicons/primeicons.css';                                // Icons
import 'primeflex/primeflex.css';                                  // Flex 布局


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
