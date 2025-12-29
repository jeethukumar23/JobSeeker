"use client"

import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase, Search, User, Loader2, AlertCircle, MapPin, ChevronRight } from "lucide-react"
import { onAuthStateChanged } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { auth, db, isConfigValid } from "@/lib/firebase"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [userData, setUserData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!isConfigValid) {
      setError("Firebase is not configured. Please add your Firebase credentials.")
      setLoading(false)
      return
    }

    if (!auth || !db) {
      setError("Firebase services failed to initialize. Please check your configuration.")
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser)
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid))
          if (userDoc.exists()) {
            setUserData(userDoc.data())
          }
          setError(null)
        } catch (err: any) {
          console.error("[v0] Error fetching user data:", err.message)
          if (err.code === "unavailable") {
            setError("Unable to connect to Firebase. Please check your internet connection and Firebase configuration.")
          } else {
            setError("Failed to load user data. Please refresh the page.")
          }
        }
      } else {
        navigate("/login")
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [navigate])

  // Removed logout from dashboard header; profile button provided instead

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-1.5 sm:gap-2">
              <Briefcase className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              <span className="text-lg sm:text-2xl font-bold text-foreground">JOB SEEKER</span>
            </Link>
          </div>
        </header>
        <div className="container mx-auto px-3 sm:px-4 py-8 sm:py-12 max-w-2xl">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Configuration Error</AlertTitle>
            <AlertDescription className="mt-2">{error}</AlertDescription>
          </Alert>
          <div className="mt-4">
            <Button onClick={() => window.location.reload()} variant="outline">
              Retry
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-1.5 sm:gap-2">
            <Briefcase className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            <span className="text-lg sm:text-2xl font-bold text-foreground">JOB SEEKER</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/applications">
              <Button variant="ghost" size="sm" className="text-sm">
                Applications
              </Button>
            </Link>
            <Link to="/profile">
              <Button variant="ghost" size="sm" className="text-sm">
                <User className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Profile</span>
                <span className="sm:hidden">Profile</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-3 sm:px-4 py-8 sm:py-12 max-w-6xl">
        <div className="mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">
            Welcome back{userData?.fullName ? `, ${userData.fullName}` : ""}!
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">What would you like to do today?</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12">
          <Link to="/jobs/post">
            <Card className="hover:shadow-lg transition-all hover:border-primary cursor-pointer h-full">
              <CardHeader className="space-y-2 sm:space-y-3 p-4 sm:p-6">
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-2 sm:mb-4">
                  <Briefcase className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <CardTitle className="text-xl sm:text-2xl">Post a Job</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Looking to hire? Post your part-time job vacancy and reach local job seekers.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
                <Button className="w-full text-sm sm:text-base">Create Job Posting</Button>
              </CardContent>
            </Card>
          </Link>

          <Link to="/jobs/search">
            <Card className="hover:shadow-lg transition-all hover:border-primary cursor-pointer h-full">
              <CardHeader className="space-y-2 sm:space-y-3 p-4 sm:p-6">
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-2 sm:mb-4">
                  <Search className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <CardTitle className="text-xl sm:text-2xl">Find a Job</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Browse part-time opportunities near your location and apply instantly.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
                <Button variant="outline" className="w-full bg-transparent text-sm sm:text-base">
                  Search Jobs
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* How It Works */}
        <Card className="mb-6 sm:mb-8">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">How It Works</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Quick steps for job seekers and employers</CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-3">
                <h3 className="text-base sm:text-lg font-semibold">For Job Seekers</h3>
                <div className="text-sm sm:text-base text-muted-foreground divide-y">
                  <Link
                    to="/profile"
                    className="group flex items-center justify-between gap-2 hover:text-foreground hover:underline transition-colors py-2 sm:py-3"
                  >
                    <span className="flex items-center gap-2">
                      <User className="h-4 w-4 text-primary" /> Complete your profile
                    </span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                  </Link>
                  <Link
                    to="/jobs/search"
                    className="group flex items-center justify-between gap-2 hover:text-foreground hover:underline transition-colors py-2 sm:py-3"
                  >
                    <span className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" /> Search jobs near your location
                    </span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                  </Link>
                  <div className="flex items-center gap-2 py-2 sm:py-3"><Search className="h-4 w-4 text-primary" /> Apply instantly with one click</div>
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-base sm:text-lg font-semibold">For Employers</h3>
                <div className="text-sm sm:text-base text-muted-foreground divide-y">
                  <Link
                    to="/jobs/post"
                    className="group flex items-center justify-between gap-2 hover:text-foreground hover:underline transition-colors py-2 sm:py-3"
                  >
                    <span className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-primary" /> Post a job in minutes
                    </span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                  </Link>
                  <Link
                    to="/applications"
                    className="group flex items-center justify-between gap-2 hover:text-foreground hover:underline transition-colors py-2 sm:py-3"
                  >
                    <span className="flex items-center gap-2">
                      <User className="h-4 w-4 text-primary" /> Review applications as they arrive
                    </span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                  </Link>
                  <div className="flex items-center gap-2 py-2 sm:py-3"><Search className="h-4 w-4 text-primary" /> Contact candidates directly</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Helpful Tips */}
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">Tips to Get Started</CardTitle>
            <CardDescription className="text-xs sm:text-sm">A few suggestions to improve your experience</CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
            <ul className="text-sm sm:text-base text-muted-foreground divide-y">
              <li className="py-2 sm:py-3">
                <Link
                  to="/profile"
                  className="group flex items-center justify-between gap-2 hover:text-foreground hover:underline transition-colors"
                >
                  <span>Fill out your profile completely for better matches.</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                </Link>
              </li>
              <li className="py-2 sm:py-3">
                <Link
                  to="/profile"
                  className="group flex items-center justify-between gap-2 hover:text-foreground hover:underline transition-colors"
                >
                  <span>Set your city correctly to see nearby jobs first.</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                </Link>
              </li>
              <li className="py-2 sm:py-3">
                <Link
                  to="/profile"
                  className="group flex items-center justify-between gap-2 hover:text-foreground hover:underline transition-colors"
                >
                  <span>Keep your contact number up to date for quick replies.</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                </Link>
              </li>
              <li className="py-2 sm:py-3">
                <Link
                  to="/jobs/post"
                  className="group flex items-center justify-between gap-2 hover:text-foreground hover:underline transition-colors"
                >
                  <span>Employers: write clear job descriptions and include working hours.</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                </Link>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
