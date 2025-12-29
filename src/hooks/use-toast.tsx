import * as React from "react"

export type ToastProps = {
  title?: string
  description?: string
}

const ToastContext = React.createContext<{
  toast: (props: ToastProps) => void
}>({
  toast: () => {},
})

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = React.useState<ToastProps | null>(null)

  return (
    <ToastContext.Provider value={{ toast: setToast }}>
      {children}
      {toast && (
        <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded shadow-lg">
          <strong>{toast.title}</strong>
          <p>{toast.description}</p>
        </div>
      )}
    </ToastContext.Provider>
  )
}

export function useToast() {
  return React.useContext(ToastContext)
}
