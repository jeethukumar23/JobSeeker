import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { auth, db } from "../lib/firebase"
import { collection, query, where, onSnapshot, updateDoc, doc, getDoc } from "firebase/firestore"

// Component to fetch and display applicant info
function ApplicantCard({ app, isRecipient, updating, onStatusChange, chatData }: any) {
  const [applicantData, setApplicantData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchApplicantData = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", app.seekerId))
        if (userDoc.exists()) {
          setApplicantData(userDoc.data())
        }
      } catch (error) {
        console.error("Error fetching applicant data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchApplicantData()
  }, [app.seekerId])

  const name = app.seekerName || "N/A"
  const email = app.seekerEmail || applicantData?.email || "Not provided"
  const mobile = app.seekerPhone || applicantData?.mobile || "Not provided"
  const location = app.seekerLocation || applicantData?.city || "Not provided"

  if (!isRecipient) {
    // Sent applications view
    return (
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border-l-4 border-blue-500">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-gray-800">{app.jobTitle}</h3>
            <p className="text-gray-600 text-sm mt-1">Applied on {new Date(app.createdAt?.toDate?.() || app.createdAt).toLocaleDateString()}</p>
          </div>
          <div className="text-right">
            {app.status === "pending" && (
              <span className="inline-block bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-semibold">
                ⏳ Waiting
              </span>
            )}
            {app.status === "accepted" && (
              <>
                <span className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold">
                  ✅ Accepted
                </span>
                {chatData[app.id]?.lastSenderId &&
                  chatData[app.id].lastSenderId !== auth.currentUser?.uid && (
                  <span className="text-red-500 ml-2">🔔</span>
                  )}
                <button
                  onClick={() => navigate(`/chat/${app.id}`)}
                  className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
                >
                  Chat
                </button>
              </>
            )}
            {app.status === "rejected" && (
              <span className="inline-block bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-semibold">
                ❌ Rejected
              </span>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Received applications view
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border-l-4 border-purple-500">
      <div className="flex justify-between items-center">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-800">
            {app.jobTitle}
            {chatData[app.id]?.lastSenderId &&
              chatData[app.id].lastSenderId !== auth.currentUser?.uid && (
                <span className="text-red-500 ml-2">🔔</span>
              )}
          </h3>
          <div className="mt-3 space-y-2">
            <p className="text-gray-700 font-semibold">👤 {name}</p>
            <p className="text-gray-600 text-sm">📧 {email}</p>
            <p className="text-gray-600 text-sm">📞 {mobile}</p>
            <p className="text-gray-600 text-sm">📍 {location}</p>
          </div>
          <p className="text-gray-500 text-sm mt-2">Applied on {new Date(app.createdAt?.toDate?.() || app.createdAt).toLocaleDateString()}</p>
        </div>

        <div className="flex gap-3 ml-4">
          <button
            onClick={() => onStatusChange(app.id, "accepted")}
            disabled={updating === app.id || app.status === "accepted"}
            className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Accept
          </button>

          <button
            onClick={() => onStatusChange(app.id, "rejected")}
            disabled={updating === app.id || app.status === "rejected"}
            className="bg-red-500 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Ignore
          </button>

          {app.status === "accepted" && (
            <button
              onClick={() => navigate(`/chat/${app.id}`)}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Chat
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ApplicationsPage() {
  const [tab, setTab] = useState<"sent" | "received">("sent")
  const [sent, setSent] = useState<any[]>([])
  const [received, setReceived] = useState<any[]>([])
  const [updating, setUpdating] = useState<string | null>(null)
  const [chatData, setChatData] = useState<any>({})

  const user = auth.currentUser

  useEffect(() => {
    if (!user) return

    const sentQuery = query(collection(db,"applications"), where("seekerId","==",user.uid))
    const receivedQuery = query(collection(db,"applications"), where("posterId","==",user.uid))

    const unsub1 = onSnapshot(sentQuery,(snap)=>{
      setSent(snap.docs.map(d=>({id:d.id,...d.data()})))
    })

    const unsub2 = onSnapshot(receivedQuery,(snap)=>{
      setReceived(snap.docs.map(d=>({id:d.id,...d.data()})))
    })

    const chatListener = onSnapshot(collection(db,"chats"),(snap)=>{
      const map:any = {}
      snap.docs.forEach(d=> map[d.id] = d.data())
      setChatData(map)
    })

    return ()=>{unsub1(); unsub2(); chatListener();}
  }, [user])

  const updateStatus = async(id:string,status:"accepted"|"rejected") => {
    setUpdating(id)
    try {
      await updateDoc(doc(db,"applications",id),{ status })
    } finally {
      setUpdating(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Applications</h1>
          <p className="text-gray-600 mt-2">Manage your job applications</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-8 border-b border-gray-200 mb-8">
          <button
            className={`pb-4 font-semibold text-lg transition-all ${
              tab === "sent"
                ? "border-b-4 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setTab("sent")}
          >
            Applications Sent
          </button>

          <button
            className={`pb-4 font-semibold text-lg transition-all ${
              tab === "received"
                ? "border-b-4 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setTab("received")}
          >
            Applications Received
          </button>
        </div>

        {/* SENT */}
        {tab === "sent" && (
          <div className="space-y-4">
            {sent.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No applications sent yet</p>
              </div>
            ) : (
              sent.map(app => (
                <ApplicantCard
                  key={app.id}
                  app={app}
                  isRecipient={false}
                  updating={updating}
                  onStatusChange={updateStatus}
                  chatData={chatData}
                />
              ))
            )}
          </div>
        )}

        {/* RECEIVED */}
        {tab === "received" && (
          <div className="space-y-4">
            {received.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No applications received yet</p>
              </div>
            ) : (
              received.map(app => (
                <ApplicantCard
                  key={app.id}
                  app={app}
                  isRecipient={true}
                  updating={updating}
                  onStatusChange={updateStatus}
                  chatData={chatData}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}
