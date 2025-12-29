import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Briefcase, MapPin, Search, Users } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Briefcase className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            <span className="text-lg sm:text-2xl font-bold text-foreground">JOB SEEKER</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
              How it Works
            </Link>
            <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
          </nav>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-sm">
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="text-sm">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-3 sm:px-4 py-12 sm:py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-4 sm:space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-medium">
            <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
            Location-Based Job Matching
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold text-balance leading-tight">
            Find Part-Time Jobs <span className="text-primary">Near You</span>
          </h1>

          <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Connect with local employers and discover flexible part-time opportunities in your area. Whether you're
            hiring or job hunting, we make it simple.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2 sm:pt-4">
            <Link href="/signup" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6">
                <Search className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Find Jobs
              </Button>
            </Link>
            <Link href="/signup" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 bg-transparent"
              >
                <Briefcase className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Post a Job
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-muted/30 py-12 sm:py-20">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Why Choose JOB SEEKER?</h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
              A simple, efficient platform designed for local job matching
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8 max-w-5xl mx-auto">
            <div className="bg-card rounded-2xl p-6 sm:p-8 shadow-sm border border-border hover:shadow-md transition-shadow">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3 sm:mb-4">
                <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Location-Based</h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Find jobs sorted by distance. See opportunities in your neighborhood first.
              </p>
            </div>

            <div className="bg-card rounded-2xl p-6 sm:p-8 shadow-sm border border-border hover:shadow-md transition-shadow">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3 sm:mb-4">
                <Briefcase className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Easy Job Posting</h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Post your vacancy in minutes. Reach local job seekers instantly.
              </p>
            </div>

            <div className="bg-card rounded-2xl p-6 sm:p-8 shadow-sm border border-border hover:shadow-md transition-shadow">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3 sm:mb-4">
                <Users className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Direct Connection</h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Connect directly with employers or applicants. No middleman fees.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-12 sm:py-20">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">How It Works</h2>
          </div>

          <div className="max-w-4xl mx-auto grid sm:grid-cols-2 gap-8 sm:gap-12">
            <div className="space-y-4 sm:space-y-6">
              <h3 className="text-xl sm:text-2xl font-bold">For Job Seekers</h3>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex gap-3 sm:gap-4">
                  <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1 text-sm sm:text-base">Create Your Profile</h4>
                    <p className="text-muted-foreground text-xs sm:text-sm">
                      Set up your account with your location and skills
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 sm:gap-4">
                  <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1 text-sm sm:text-base">Search for Jobs</h4>
                    <p className="text-muted-foreground text-xs sm:text-sm">Browse part-time opportunities near you</p>
                  </div>
                </div>
                <div className="flex gap-3 sm:gap-4">
                  <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1 text-sm sm:text-base">Apply Instantly</h4>
                    <p className="text-muted-foreground text-xs sm:text-sm">
                      One-click apply to connect with employers
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <h3 className="text-xl sm:text-2xl font-bold">For Employers</h3>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex gap-3 sm:gap-4">
                  <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1 text-sm sm:text-base">Sign Up Free</h4>
                    <p className="text-muted-foreground text-xs sm:text-sm">Create your employer account in seconds</p>
                  </div>
                </div>
                <div className="flex gap-3 sm:gap-4">
                  <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1 text-sm sm:text-base">Post Your Vacancy</h4>
                    <p className="text-muted-foreground text-xs sm:text-sm">Fill out a simple form with job details</p>
                  </div>
                </div>
                <div className="flex gap-3 sm:gap-4">
                  <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1 text-sm sm:text-base">Review Applications</h4>
                    <p className="text-muted-foreground text-xs sm:text-sm">
                      Get applications from qualified local candidates
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-12 sm:py-20">
        <div className="container mx-auto px-3 sm:px-4 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Ready to Get Started?</h2>
          <p className="text-base sm:text-lg mb-6 sm:mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of job seekers and employers connecting every day
          </p>
          <Link href="/signup">
            <Button size="lg" variant="secondary" className="text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6">
              Create Free Account
            </Button>
          </Link>
        </div>
      </section>

    </div>
  )
}
