
import { TOAST_REMOVE_DELAY } from "./toast-types"

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()
const autoDismissTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

export const addToRemoveQueue = (toastId: string, dispatchFn: any) => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatchFn({
      type: "REMOVE_TOAST",
      toastId: toastId,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

export const clearTimeouts = (toastId: string) => {
  // Limpiar timeout de auto-dismiss
  const autoDismissTimeout = autoDismissTimeouts.get(toastId)
  if (autoDismissTimeout) {
    clearTimeout(autoDismissTimeout)
    autoDismissTimeouts.delete(toastId)
  }
  
  // Limpiar timeout de remove
  const removeTimeout = toastTimeouts.get(toastId)
  if (removeTimeout) {
    clearTimeout(removeTimeout)
    toastTimeouts.delete(toastId)
  }
}

export const setAutoDismissTimeout = (toastId: string, duration: number, dismissFn: () => void) => {
  if (duration > 0) {
    const autoDismissTimeout = setTimeout(() => {
      autoDismissTimeouts.delete(toastId)
      dismissFn()
    }, duration)
    
    autoDismissTimeouts.set(toastId, autoDismissTimeout)
  }
}
