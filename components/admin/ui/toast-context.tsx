"use client"
 
import * as React from "react"
import { Toast, ToastViewport } from "./toast"
 
type ToastProps = {
  title?: string
  description?: string
  variant?: "default" | "destructive"
}
 
export const ToastContext = React.createContext<{
  toast: (props: ToastProps) => void
}>({
  toast: () => {},
})
 
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastProps[]>([])
 
  const toast = React.useCallback((props: ToastProps) => {
    setToasts((prev) => [...prev, props])
  }, [])
 
  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <ToastViewport>
        {toasts.map((props, index) => (
          <Toast key={index} {...props} />
        ))}
      </ToastViewport>
    </ToastContext.Provider>
  )
}