import { useState } from 'react'

// ─────────────────────────────────────────────────────────────────────────────
// VERSION SIN ENGRAM
// Lo que un dev implementaría sin contexto del backend ni del UX.
// Parece razonable. No lo es.
// ─────────────────────────────────────────────────────────────────────────────

export function DeleteAccountModalNaive({ onConfirm, onCancel }) {
  return (
    <div className="modal">
      <h2>¿Eliminar cuenta?</h2>
      <p>Esta acción no se puede deshacer.</p>
      <button onClick={onCancel}>Cancelar</button>
      <button onClick={onConfirm}>Confirmar</button>
    </div>
  )
}

// Problemas:
// - No menciona los 90 días de retención (requisito legal de los T&C)
// - No hay confirmación por email — el usuario no reconoce el período
// - Un solo paso: no cumple el flujo de 3 pasos definido por UX/legal
// - El frontend da a entender que los datos se borran YA — falso

// ─────────────────────────────────────────────────────────────────────────────
// VERSION CON ENGRAM
// El dev consultó memoria antes de escribir código.
// Encontró: decisión del backend (soft delete / retención 90 días / P2)
//           decisión del UX (3 pasos, reconocimiento explícito, requisito legal)
// ─────────────────────────────────────────────────────────────────────────────

const STEPS = ['warning', 'acknowledge', 'confirm']

export function DeleteAccountModal({ onConfirm, onCancel }) {
  const [step, setStep] = useState(0)
  const [acknowledged, setAcknowledged] = useState(false)

  // Paso 1 — advertencia con el período de retención
  if (step === 0) {
    return (
      <div className="modal">
        <h2>Antes de continuar</h2>
        <p>
          Si eliminás tu cuenta, tus datos personales se conservarán por{' '}
          <strong>90 días</strong> según nuestros Términos y Condiciones.
          Pasado ese período serán eliminados de forma permanente.
        </p>
        <button onClick={onCancel}>Volver</button>
        <button onClick={() => setStep(1)}>Entendido, continuar</button>
      </div>
    )
  }

  // Paso 2 — reconocimiento explícito (requisito legal)
  if (step === 1) {
    return (
      <div className="modal">
        <h2>Confirmá que entendiste</h2>
        <label>
          <input
            type="checkbox"
            checked={acknowledged}
            onChange={e => setAcknowledged(e.target.checked)}
          />
          {' '}Entiendo que mis datos se retendrán 90 días y luego serán eliminados permanentemente.
        </label>
        <button onClick={onCancel}>Cancelar</button>
        <button disabled={!acknowledged} onClick={() => setStep(2)}>
          Continuar
        </button>
      </div>
    )
  }

  // Paso 3 — acción irreversible final
  return (
    <div className="modal">
      <h2>Eliminar cuenta definitivamente</h2>
      <p>
        Esta acción es irreversible. Recibirás un email de confirmación
        y recordatorios durante el período de retención.
      </p>
      <button onClick={onCancel}>Cancelar</button>
      <button className="danger" onClick={onConfirm}>
        Sí, eliminar mi cuenta
      </button>
    </div>
  )
}
