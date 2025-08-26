
import * as React from "react"
import type {
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast"

export const TOAST_LIMIT = 1
export const TOAST_REMOVE_DELAY = 1000

// Duraciones por defecto según el tipo de toast (más cortas y exclusivas)
export const DEFAULT_DURATIONS = {
  success: 1500,    // 1.5 segundos
  default: 2000,    // 2 segundos  
  warning: 2500,    // 2.5 segundos
  destructive: 3000 // 3 segundos
} as const

export type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

export const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

export type ActionType = typeof actionTypes

export type Action =
  | {
      type: ActionType["ADD_TOAST"]
      toast: ToasterToast
    }
  | {
      type: ActionType["UPDATE_TOAST"]
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionType["DISMISS_TOAST"]
      toastId?: ToasterToast["id"]
    }
  | {
      type: ActionType["REMOVE_TOAST"]
      toastId?: ToasterToast["id"]
    }

export interface State {
  toasts: ToasterToast[]
}

export interface ToastOptions {
  variant?: "default" | "destructive" | "success" | "warning"
  description?: React.ReactNode
  action?: ToastActionElement
  duration?: number
  className?: string
}

export type Toast = Omit<ToasterToast, "id"> & ToastOptions

let count = 0

export function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}
