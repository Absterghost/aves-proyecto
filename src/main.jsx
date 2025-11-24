import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// 🆕 VERIFICACIÓN DE CARGA
console.log('🚀 main.jsx ejecutándose...')
console.log('React:', typeof React)
console.log('ReactDOM:', typeof ReactDOM)

try {
  const rootElement = document.getElementById('root')
  console.log('Root element:', rootElement)
  
  if (!rootElement) {
    throw new Error('No se encontró el elemento con id "root"')
  }

  const root = ReactDOM.createRoot(rootElement)
  
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
  
  console.log('✅ React aplicado correctamente al DOM')
} catch (error) {
  console.error('❌ Error al inicializar React:', error)
  document.body.innerHTML = `
    <div style="padding: 20px; color: red; font-family: Arial;">
      <h1>Error al cargar la aplicación</h1>
      <p>${error.message}</p>
      <button onclick="window.location.reload()">Recargar</button>
    </div>
  `
}