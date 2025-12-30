import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase, Crown } from "lucide-react"
import { useEffect, useState } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { auth, db } from "@/lib/firebase"
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore"

export default function UpgradePage() {
  const [user, setUser] = useState<any>(null)
  const [userData, setUserData] = useState<any>(null)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u)
        const snap = await getDoc(doc(db, "users", u.uid))
        setUserData(snap.data())
      }
    })
    return () => unsub()
  }, [])

  const handleSuccess = async (plan: string) => {
    const user = auth.currentUser
    if (!user) return

    const userRef = doc(db, "users", user.uid)

    if (plan === "10") {
      await updateDoc(userRef, {
        postingCredits: (userData?.postingCredits || 0) + 10,
        plan: "pro"
      })
    }

    if (plan === "unlimited") {
      await updateDoc(userRef, {
        plan: "unlimited",
        unlimited: true,
        unlimitedUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
        updatedAt: serverTimestamp(),
      })
    }

    alert("Upgrade successful! 🎉")
  }

  const startPayment = async (amount: number, plan: string) => {
    const res = await fetch("/.netlify/functions/createOrder", {
      method: "POST",
      body: JSON.stringify({ amount })
    })

    const order = await res.json()

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY,
      amount: order.amount,
      currency: "INR",
      name: "Job Seeker",
      description: plan,
      order_id: order.id,
      handler: function () {
        handleSuccess(plan)
      }
    }

    const razor = new (window as any).Razorpay(options)
    razor.open()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-950 p-10 text-white">
      <h1 className="text-4xl font-bold text-center mb-3">
        Upgrade Your Account 🚀
      </h1>

      <p className="text-center text-gray-300 mb-10">
        Post more jobs and hire faster
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">

        {/* 10 Jobs Plan */}
        <Card className="bg-white/10 border border-white/20 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Briefcase /> 10 Job Posts
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-3xl font-bold mb-4">₹199</p>

            <ul className="space-y-2 text-gray-300 mb-6">
              <li>✔ Post 10 jobs</li>
              <li>✔ Valid forever</li>
              <li>✔ Chat with applicants</li>
              <li>✔ View applicant profiles</li>
            </ul>

            <Button
              onClick={() => startPayment(199, "10")}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Buy 10 Job Posts
            </Button>
          </CardContent>
        </Card>

        {/* Unlimited Plan */}
        <Card className="bg-yellow-500/10 border border-yellow-400 text-white relative">
          <div className="absolute -top-3 right-4 bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-bold">
            BEST VALUE
          </div>

          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Crown /> Unlimited Jobs
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-3xl font-bold mb-4">₹499 / month</p>

            <ul className="space-y-2 text-gray-300 mb-6">
              <li>✔ Unlimited job posts</li>
              <li>✔ Priority listing</li>
              <li>✔ Full chat access</li>
              <li>✔ Profile boost</li>
            </ul>

            <Button
              onClick={() => startPayment(499, "unlimited")}
              className="w-full bg-yellow-400 text-black hover:bg-yellow-500"
            >
              Go Unlimited
            </Button>
          </CardContent>
        </Card>

      </div>

      <p className="text-center mt-10 text-gray-400">
        Current Plan: <span className="text-white font-semibold">
          {userData?.plan || "Free"}
        </span>
      </p>
    </div>
  )
}
