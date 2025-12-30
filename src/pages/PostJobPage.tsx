"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Briefcase, Loader2, ArrowLeft } from "lucide-react"
import { onAuthStateChanged } from "firebase/auth"
import { collection, addDoc, serverTimestamp, doc, getDoc, updateDoc, increment } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { useToast } from "@/hooks/use-toast"

const JOB_CATEGORIES = [
  "Supermarket",
  "Store",
  "Delivery",
  "Cleaning",
  "Cafe",
  "Restaurant",
  "Retail",
  "Warehouse",
  "Office",
  "Other",
]

export default function PostJobPage() {
  const [loading, setLoading] = useState(true)
  const [posting, setPosting] = useState(false)
  const [user, setUser] = useState<any>(null)
  const navigate = useNavigate()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    hours: "",
    salary: "",
    location: "",
    contact: "",
    companyName: "",
  })

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate("/login")
      } else {
        setUser(currentUser)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [navigate])

  const canPostJob = (userData: any) => {
    if (userData.unlimited && userData.unlimitedExpiry) {
      const expiry = new Date(userData.unlimitedExpiry.seconds * 1000)
      if (new Date() < expiry) return true
    }

    if (userData.postingCredits > 0) return true

    return false
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPosting(true)

    try {
      const userDoc = await getDoc(doc(db, "users", auth.currentUser!.uid))
      const userData = userDoc.data()

      if (!canPostJob(userData)) {
        toast({
          title: "Upgrade Required",
          description: "Your free posts are over or your plan expired. Upgrade to continue posting.",
          variant: "destructive",
        })
        navigate("/upgrade")
        return
      }

      // C. Allow posting + reduce credit
      await addDoc(collection(db, "jobs"), {
        title: formData.title,
        category: formData.category,
        description: formData.description,
        hours: formData.hours,
        salary: formData.salary,
        location: formData.location,
        contact: formData.contact,
        companyName: formData.companyName,
        userId: auth.currentUser!.uid,
        createdAt: serverTimestamp(),
        jobType: "Part-Time",
        applications: [],
      })

      if (!userData.unlimited) {
        await updateDoc(doc(db, "users", auth.currentUser!.uid), {
          postingCredits: userData.postingCredits - 1,
        })
      }

      toast({
        title: "Job Posted Successfully 🎉",
        description: "Your job is now live and visible to job seekers.",
      })

      navigate("/dashboard")
    } catch (error: any) {
      console.error(error)
      toast({
        variant: "destructive",
        title: "Posting Failed",
        description: error.message || "Unable to post job.",
      })
    } finally {
      setPosting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <Link to="/" className="flex items-center gap-2">
            <Briefcase className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">JOB SEEKER</span>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-10 max-w-3xl">
        <Link to="/dashboard" className="flex items-center text-sm text-muted-foreground mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>Post a Job</CardTitle>
            <CardDescription>Fill details to post a part-time job</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input placeholder="Company Name" value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })} required />

              <Input placeholder="Job Title" value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />

              <Select value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger>
                <SelectContent>
                  {JOB_CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c.toLowerCase()}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Textarea placeholder="Job Description" value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />

              <Input placeholder="Working Hours" value={formData.hours}
                onChange={(e) => setFormData({ ...formData, hours: e.target.value })} required />

              <Input placeholder="Salary" value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })} required />

              <Input placeholder="Location" value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })} required />

              <Input placeholder="Contact Number" value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })} required />

              <Button type="submit" className="w-full" disabled={posting}>
                {posting ? "Posting..." : "Post Job"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
