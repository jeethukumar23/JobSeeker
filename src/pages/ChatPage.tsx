import { useParams } from "react-router-dom"
import { useEffect, useState, useRef } from "react"
import { Send } from "lucide-react"
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore"
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore"
import { db, auth } from "../lib/firebase"

export default function ChatPage() {
  const { appId } = useParams()
  const [messages, setMessages] = useState<any[]>([])
  const [text, setText] = useState("")
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const [userMap, setUserMap] = useState<Record<string, { name?: string; email?: string; avatarUrl?: string }>>({})
  const [currentDateLabel, setCurrentDateLabel] = useState<string>("")
  const [isAtBottom, setIsAtBottom] = useState(true)
  const [typingUsers, setTypingUsers] = useState<string[]>([])
  const [showLatest, setShowLatest] = useState(false)
  const latestHideTimer = useRef<NodeJS.Timeout | null>(null)
  const typingTimer = useRef<NodeJS.Timeout | null>(null)

  const scrollToBottom = (smooth = false) => {
    const el = messagesContainerRef.current
    if (!el) return
    if (smooth) {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" })
    } else {
      el.scrollTop = el.scrollHeight
    }
  }

  useEffect(() => {
    scrollToBottom(true)
    updateDateHeader()
  }, [messages])

  // Listen to typing presence from others
  useEffect(() => {
    if (!appId) return
    const typingRef = collection(db, "chats", appId, "typing")
    return onSnapshot(typingRef, (snap) => {
      const now = Date.now()
      const others: string[] = []
      snap.docs.forEach((d) => {
        const data: any = d.data()
        if (!data?.typing) return
        if (d.id === auth.currentUser?.uid) return
        const ts = data.updatedAt?.toDate ? data.updatedAt.toDate().getTime() : now
        if (now - ts < 7000) {
          others.push(d.id)
        }
      })
      setTypingUsers(others)
    })
  }, [appId])

  // Prefetch minimal user profiles for avatars/names
  useEffect(() => {
    const uniqueSenderIds = Array.from(new Set(messages.map((m) => m.senderId).filter(Boolean)))
    uniqueSenderIds.forEach(async (uid) => {
      if (!uid || userMap[uid]) return
      try {
        const snap = await getDoc(doc(db, "users", uid))
        if (snap.exists()) {
          const d: any = snap.data()
          setUserMap((prev) => ({
            ...prev,
            [uid]: { name: d.fullName || d.displayName || "", email: d.email || "", avatarUrl: d.photoURL || "" },
          }))
        } else {
          setUserMap((prev) => ({ ...prev, [uid]: { name: "", email: "" } }))
        }
      } catch {
        // ignore fetch errors; fallback to initials from uid
      }
    })
  }, [messages])

  const formatTime = (ts: any) => {
    try {
      const d = ts?.toDate ? ts.toDate() : ts ? new Date(ts) : new Date()
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } catch {
      return ""
    }
  }

  const formatDate = (ts: any) => {
    const d = ts?.toDate ? ts.toDate() : ts ? new Date(ts) : new Date()
    return d.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })
  }

  const humanDate = (ts: any) => {
    const d = ts?.toDate ? ts.toDate() : ts ? new Date(ts) : new Date()
    const today = new Date()
    const yest = new Date()
    yest.setDate(today.getDate() - 1)
    const same = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
    if (same(d, today)) return "Today"
    if (same(d, yest)) return "Yesterday"
    return d.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })
  }

  const dateKey = (ts: any) => {
    const d = ts?.toDate ? ts.toDate() : ts ? new Date(ts) : new Date()
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
  }

  const getUserInfo = (uid?: string) => {
    if (!uid) return { name: "", email: "", avatarUrl: "" }
    if (uid === auth.currentUser?.uid) {
      return {
        name: auth.currentUser?.displayName || "",
        email: auth.currentUser?.email || "",
        avatarUrl: (auth.currentUser as any)?.photoURL || "",
      }
    }
    return userMap[uid] || { name: "", email: "", avatarUrl: "" }
  }

  const initialsFor = (name?: string, email?: string) => {
    const source = (name || "").trim() || (email || "").split("@")[0]
    if (!source) return "?"
    const parts = source.split(/\s+/).filter(Boolean)
    const letters = (parts[0]?.[0] || "") + (parts[1]?.[0] || "")
    return letters.toUpperCase() || source.slice(0, 2).toUpperCase()
  }

  const updateDateHeader = () => {
    const el = messagesContainerRef.current
    if (!el) return
    const markers = Array.from(el.querySelectorAll("[data-date-key]")) as HTMLElement[]
    const scrollTop = el.scrollTop
    let active = markers[0]?.dataset.label || ""
    markers.forEach((node) => {
      if (node.offsetTop - 8 <= scrollTop) {
        active = node.dataset.label || active
      }
    })
    setCurrentDateLabel(active)

    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 12
    setIsAtBottom(atBottom)

    if (atBottom) {
      setShowLatest(false)
      if (latestHideTimer.current) {
        clearTimeout(latestHideTimer.current)
        latestHideTimer.current = null
      }
    } else {
      setShowLatest(true)
      if (latestHideTimer.current) clearTimeout(latestHideTimer.current)
      latestHideTimer.current = setTimeout(() => setShowLatest(false), 4000)
    }
  }

  useEffect(() => {
    const el = messagesContainerRef.current
    if (!el) return
    const handler = () => updateDateHeader()
    el.addEventListener("scroll", handler)
    // Initial compute
    updateDateHeader()
    return () => el.removeEventListener("scroll", handler)
  }, [])

  useEffect(() => {
    return () => {
      if (typingTimer.current) {
        clearTimeout(typingTimer.current)
        typingTimer.current = null
      }
      setTyping(false)
    }
  }, [])

  useEffect(() => {
    if (!appId) return
    
    const chatRef = doc(db, "chats", appId!)

    const initChat = async () => {
      const snap = await getDoc(chatRef)
      if (!snap.exists()) {
        await setDoc(chatRef, {
          createdAt: new Date(),
          lastMessageAt: null,
          lastSenderId: null,
        })
      }
    }
    initChat()

    const q = query(
      collection(db, "chats", appId!, "messages"),
      orderBy("timestamp", "asc")
    )

    return onSnapshot(q, (snap) => {
      setMessages(snap.docs.map((d) => d.data()))
    })
  }, [appId])

  const sendMessage = async () => {
    if (!text.trim()) return

    const user = auth.currentUser
    if (!user) return

    const messageText = text
    setText("") // Clear immediately after capturing the text

    try {
      // Save message
      await addDoc(collection(db, "chats", appId!, "messages"), {
        senderId: user.uid,
        text: messageText,
        timestamp: serverTimestamp(),
      })

      // Update chat notification data
      await updateDoc(doc(db, "chats", appId!), {
        lastMessageAt: serverTimestamp(),
        lastSenderId: auth.currentUser?.uid,
      })
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setTyping(false)
    }
  }

  const setTyping = async (active: boolean) => {
    if (!auth.currentUser || !appId) return
    try {
      await setDoc(doc(db, "chats", appId, "typing", auth.currentUser.uid), {
        userId: auth.currentUser.uid,
        typing: active,
        updatedAt: serverTimestamp(),
      }, { merge: true })
    } catch {
      // fail silently
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value)
    if (typingTimer.current) clearTimeout(typingTimer.current)
    setTyping(true)
    typingTimer.current = setTimeout(() => {
      setTyping(false)
    }, 3000)
  }

  const handleBlur = () => {
    if (typingTimer.current) {
      clearTimeout(typingTimer.current)
      typingTimer.current = null
    }
    setTyping(false)
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="relative flex flex-col h-[70vh] rounded-lg border bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
          <h2 className="text-sm sm:text-base font-semibold">Conversation</h2>
          <span className="text-xs text-gray-500">{messages.length} messages</span>
        </div>

        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-slate-50"
        >
          <div className="pointer-events-none sticky top-0 left-0 right-0 h-6 -mt-4 bg-gradient-to-b from-white/90 via-white/60 to-transparent z-10" />
          {currentDateLabel && (
            <div className="sticky top-0 z-10 -mt-2 pb-2">
              <div className="w-fit mx-auto px-3 py-1 rounded-full bg-white/90 border shadow-sm text-xs text-gray-600">
                {currentDateLabel}
              </div>
            </div>
          )}
          {typingUsers.length > 0 && (
            <div className="sticky top-9 z-10 flex justify-start">
              <div className="inline-flex items-center gap-2 px-3 py-2 text-xs text-gray-600 bg-white/90 border rounded-full shadow-sm">
                <span className="flex -space-x-2">
                  {typingUsers.slice(0, 3).map((uid) => {
                    const info = getUserInfo(uid)
                    const initials = initialsFor(info.name, info.email)
                    return (
                      <span
                        key={uid}
                        className="h-6 w-6 rounded-full border bg-blue-100 text-blue-800 text-[10px] font-semibold flex items-center justify-center shadow-sm"
                      >
                        {info.avatarUrl ? (
                          <img src={info.avatarUrl} alt={info.name || info.email || "User"} className="h-full w-full object-cover rounded-full" />
                        ) : (
                          initials
                        )}
                      </span>
                    )
                  })}
                </span>
                <span>typing…</span>
              </div>
            </div>
          )}
          {/* Group by date and render separators */}
          {(() => {
            const items: any[] = []
            let lastKey = ""
            messages.forEach((m, idx) => {
              const key = dateKey(m.timestamp)
              if (key !== lastKey) {
                lastKey = key
                items.push({ type: "date", ts: m.timestamp })
              }
              items.push({ type: "msg", m, idx })
            })
            return items.map((it, idx) => {
              if (it.type === "date") {
                return (
                  <div
                    key={`d-${idx}`}
                    data-date-key={dateKey(it.ts)}
                    data-label={humanDate(it.ts)}
                    className="flex items-center gap-3 text-xs text-gray-500"
                  >
                    <div className="flex-1 h-px bg-gray-200" />
                    <div className="px-3 py-1 rounded-full bg-white border shadow-sm">{humanDate(it.ts)}</div>
                    <div className="flex-1 h-px bg-gray-200" />
                  </div>
                )
              }
              const m = it.m
              const mine = m.senderId === auth.currentUser?.uid
              const time = formatTime(m.timestamp)
              const info = getUserInfo(m.senderId)
              const initials = initialsFor(info.name, info.email)
              const originalIndex = it.idx
              const prev = originalIndex > 0 ? messages[originalIndex - 1] : null
              const next = originalIndex < messages.length - 1 ? messages[originalIndex + 1] : null
              const prevSame = prev && prev.senderId === m.senderId && dateKey(prev.timestamp) === dateKey(m.timestamp)
              const nextSame = next && next.senderId === m.senderId && dateKey(next.timestamp) === dateKey(m.timestamp)
              const showLeftAvatar = !mine && !nextSame
              const showRightAvatar = mine && !nextSame
              return (
                <div key={`m-${idx}`} className={`flex ${mine ? "justify-end" : "justify-start"} items-end gap-2`}>
                  {!mine && showLeftAvatar && (
                    <div className="h-8 w-8 rounded-full overflow-hidden bg-blue-200 text-blue-900 flex items-center justify-center text-xs font-semibold">
                      {info.avatarUrl ? (
                        <img src={info.avatarUrl} alt={info.name || info.email || "User"} className="h-full w-full object-cover" />
                      ) : (
                        <span>{initials}</span>
                      )}
                    </div>
                  )}
                  <div
                    className={`max-w-[70%] px-3 py-2 text-sm shadow ${
                      mine ? "bg-blue-600 text-white" : "bg-white text-gray-900 border"
                    } rounded-2xl ${
                      mine
                        ? `${prevSame ? 'rounded-tr-md' : ''} ${nextSame ? 'rounded-br-md' : ''}`
                        : `${prevSame ? 'rounded-tl-md' : ''} ${nextSame ? 'rounded-bl-md' : ''}`
                    }`}
                  >
                    <div>{m.text}</div>
                    <div className={`mt-1 text-[11px] ${mine ? "text-white/80" : "text-gray-500"}`}>{time}</div>
                  </div>
                  {mine && showRightAvatar && (
                    <div className="h-8 w-8 rounded-full overflow-hidden bg-blue-200 text-blue-900 flex items-center justify-center text-xs font-semibold">
                      {(auth.currentUser as any)?.photoURL ? (
                        <img src={(auth.currentUser as any)?.photoURL} alt={auth.currentUser?.displayName || auth.currentUser?.email || "Me"} className="h-full w-full object-cover" />
                      ) : (
                        <span>{initialsFor(auth.currentUser?.displayName || "", auth.currentUser?.email || "")}</span>
                      )}
                    </div>
                  )}
                </div>
              )
            })
          })()}
        </div>

        <div className="px-4 py-3 border-t bg-white">
          <div className="flex gap-2">
            <input
              value={text}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              className="flex-1 h-10 rounded-full border px-4 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type a message..."
            />
            <button
              onClick={sendMessage}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full"
            >
              <Send className="h-4 w-4" />
              Send
            </button>
          </div>
        </div>

        {showLatest && (
          <button
            onClick={() => scrollToBottom(true)}
            className="absolute right-4 bottom-28 inline-flex items-center gap-1 rounded-full bg-blue-600 text-white px-3 py-2 shadow-lg hover:bg-blue-700"
          >
            <span className="text-xs font-semibold">Latest</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}
