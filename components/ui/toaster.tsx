import { useEffect, useState } from "react"

export function Toaster() {
  const [toasts, setToasts] = useState<string[]>([])

  useEffect(() => {
    const handler = (e:any) => {
      setToasts(t => [...t, e.detail])
      setTimeout(() => {
        setToasts(t => t.slice(1))
      }, 3000)
    }
    window.addEventListener("toast", handler)
    return () => window.removeEventListener("toast", handler)
  }, [])

  return (
    <div className="fixed bottom-5 right-5 z-50 space-y-2">
      {toasts.map((t, i) => (
        <div key={i} className="bg-black text-white px-4 py-2 rounded">
          {t}
        </div>
      ))}
    </div>
  )
}
