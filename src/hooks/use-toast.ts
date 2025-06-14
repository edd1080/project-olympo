
import * as React from "react"
import { 
  Toast, 
  DEFAULT_DURATIONS, 
  genId,
  type ToasterToast
} from "./toast-types"
import { dispatch, addListener, getMemoryState } from "./toast-state"
import { clearTimeouts, setAutoDismissTimeout } from "./toast-timeouts"

function toast({ variant = "default", duration, className, ...props }: Toast) {
  const id = genId()

  // Determinar la duración apropiada
  const finalDuration = duration ?? DEFAULT_DURATIONS[variant] ?? DEFAULT_DURATIONS.default

  // Add appropriate styling based on variant
  let finalClassName = className || "";
  
  if (!className) {
    if (variant === "success") {
      finalClassName = "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";
    } else if (variant === "destructive") {
      finalClassName = "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100";
    } else if (variant === "warning") {
      finalClassName = "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100";
    }
  }

  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    })
  
  const dismiss = () => {
    clearTimeouts(id)
    dispatch({ type: "DISMISS_TOAST", toastId: id })
  }

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      variant,
      className: finalClassName,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss()
      },
    },
  })

  // Configurar auto-dismiss
  setAutoDismissTimeout(id, finalDuration, dismiss)

  return {
    id: id,
    dismiss,
    update,
  }
}

function useToast() {
  const [state, setState] = React.useState(getMemoryState())

  React.useEffect(() => {
    const unsubscribe = addListener(setState)
    return unsubscribe
  }, [])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  }
}

export { useToast, toast }
