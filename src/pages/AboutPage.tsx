import { Link } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center gap-2">
          <Briefcase className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
          <Link to="/" className="text-lg sm:text-2xl font-bold text-foreground">JOB SEEKER</Link>
        </div>
      </header>

      <main className="container mx-auto px-3 sm:px-4 py-8 sm:py-12 max-w-4xl space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">About Us</h1>
          <p className="text-muted-foreground">Connecting local talent with flexible opportunities.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Our Mission</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-muted-foreground">
            <p>
              We help people discover nearby part-time jobs that fit their lifestyle, and make it easy for small businesses
              to find reliable help quickly.
            </p>
            <p>
              From cafes to stores and local services, JOB SEEKER bridges the gap between employers and job seekers with a
              simple, mobile-friendly experience.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>What We Value</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-muted-foreground">
            <ul className="list-disc pl-5 space-y-1">
              <li>Local impact and fair opportunities</li>
              <li>Simple, transparent hiring</li>
              <li>Trust, safety, and clear communication</li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
