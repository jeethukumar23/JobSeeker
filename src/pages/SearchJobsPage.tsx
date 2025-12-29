"use client"

import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Briefcase, Loader2, MapPin, DollarSign, Clock, Search, Building } from "lucide-react"
import { onAuthStateChanged } from "firebase/auth"
import { collection, getDocs, doc, getDoc, updateDoc, arrayUnion, serverTimestamp, addDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { useToast } from "@/hooks/use-toast"

const JOB_CATEGORIES = [
  "all",
  "supermarket",
  "store",
  "delivery",
  "cleaning",
  "cafe",
  "restaurant",
  "retail",
  "warehouse",
  "office",
  "other",
]

const applyForJob = async (job:any) => {
  const user = auth.currentUser
  if (!user) {
    alert("Please login")
    return
  }

  const recruiterId = job.userId;

  if (!job.userId) {
    alert("Job data broken. Please repost this job.")
    return;
  }

  // Fetch user profile to get complete details
  const profileSnap = await getDoc(doc(db, "users", user.uid))
  const profile = profileSnap.data()

  await addDoc(collection(db, "applications"), {
    jobId: job.id,
    jobTitle: job.title,
    posterId: recruiterId,
    seekerId: user.uid,
    seekerName: profile?.fullName || user.displayName || "User",
    seekerEmail: profile?.email || user.email || "Not provided",
    seekerPhone: profile?.mobile || "Not provided",
    seekerLocation: profile?.city || "Not provided",
    status: "pending",
    createdAt: serverTimestamp()
  })

  alert("Application sent")
}

export default function SearchJobsPage() {
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [userData, setUserData] = useState<any>(null)
  const [jobs, setJobs] = useState<any[]>([])
  const [filteredJobs, setFilteredJobs] = useState<any[]>([])
  const [searchLocation, setSearchLocation] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser)
        const userDoc = await getDoc(doc(db, "users", currentUser.uid))
        if (userDoc.exists()) {
          const data = userDoc.data()
          setUserData(data)
          setSearchLocation(data.city || "")
        }
      } else {
        navigate("/login")
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [navigate])

  const handleSearch = async () => {
    setSearching(true)
    try {
      const jobsSnapshot = await getDocs(collection(db, "jobs"))
      const jobsList = jobsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))

      let filtered = jobsList

      if (selectedCategory !== "all") {
        filtered = filtered.filter((job) => job.category === selectedCategory)
      }

      if (searchLocation) {
        filtered = filtered.filter((job) => job.location.toLowerCase().includes(searchLocation.toLowerCase()))
      }

      setJobs(jobsList)
      setFilteredJobs(filtered)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch jobs.",
      })
    } finally {
      setSearching(false)
    }
  }

  const handleApply = async (jobId: string, jobTitle: string) => {
    const currentUser = auth.currentUser
    
    if (!currentUser) {
      toast({
        variant: "destructive",
        title: "Not Authenticated",
        description: "Please log in to apply for jobs.",
      })
      navigate("/login")
      return
    }

    if (!userData?.fullName || !userData?.mobile) {
      toast({
        variant: "destructive",
        title: "Complete Your Profile",
        description: "Please complete your profile before applying for jobs.",
      })
      navigate("/profile")
      return
    }

    try {
      await updateDoc(doc(db, "jobs", jobId), {
        applications: arrayUnion({
          userId: currentUser.uid,
          name: userData.fullName,
          email: currentUser.email || "",
          phone: userData.mobile,
          location: userData.city || "",
          status: "pending",
          appliedAt: new Date().toISOString(),
        }),
      })

      toast({
        title: "Application Submitted!",
        description: `Your application for ${jobTitle} has been sent to the employer.`,
      })
    } catch (error: any) {
      console.error("Application error:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.message || "Failed to submit application.",
      })
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
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <Link to="/" className="flex items-center gap-1.5 sm:gap-2 w-fit">
            <Briefcase className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            <span className="text-lg sm:text-2xl font-bold text-foreground">JOB SEEKER</span>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-3 sm:px-4 py-8 sm:py-12 max-w-6xl">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">Find Part-Time Jobs</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Search for opportunities near you</p>
        </div>

        <Card className="mb-6 sm:mb-8">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">Search Filters</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Find jobs that match your preferences</CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="location" className="text-sm">
                  Location
                </Label>
                <Input
                  id="location"
                  placeholder="Enter city"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="text-sm"
                />
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="category" className="text-sm">
                  Category
                </Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {JOB_CATEGORIES.slice(1).map((category) => (
                      <SelectItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end sm:col-span-2 md:col-span-1">
                <Button onClick={handleSearch} disabled={searching} className="w-full text-sm">
                  {searching ? (
                    <>
                      <Loader2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                      Search Jobs
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {filteredJobs.length > 0 ? (
          <div className="space-y-3 sm:space-y-4">
            <h2 className="text-lg sm:text-xl font-semibold">
              {filteredJobs.length} {filteredJobs.length === 1 ? "Job" : "Jobs"} Found
            </h2>
            <div className="grid gap-3 sm:gap-4">
              {filteredJobs.map((job) => (
                <Card key={job.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="p-4 sm:p-6 pb-3 sm:pb-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <CardTitle className="text-base sm:text-xl leading-tight">{job.title}</CardTitle>
                        <div className="flex items-center gap-1.5 sm:gap-2 text-muted-foreground text-xs sm:text-sm">
                          <Building className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                          <span className="truncate">{job.companyName}</span>
                        </div>
                      </div>
                      <Badge className="text-xs flex-shrink-0">{job.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0 space-y-3 sm:space-y-4">
                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{job.description}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 text-xs sm:text-sm">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
                        <span className="truncate">{job.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
                        <span className="truncate">{job.salary}</span>
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
                        <span className="truncate">{job.hours}</span>
                      </div>
                    </div>
                    <Button onClick={() => applyForJob(job)} className="w-full text-sm">
                      Apply
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : jobs.length > 0 ? (
          <Card>
            <CardContent className="py-8 sm:py-12 text-center">
              <Search className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">No jobs found</h3>
              <p className="text-sm sm:text-base text-muted-foreground">Try adjusting your search filters</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="py-8 sm:py-12 text-center">
              <Search className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">Start Your Search</h3>
              <p className="text-sm sm:text-base text-muted-foreground">Use the filters above to find jobs near you</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
