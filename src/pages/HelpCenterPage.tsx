import { Link } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase, HelpCircle } from "lucide-react"

export default function HelpCenterPage() {
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
          <h1 className="text-3xl font-bold">Help Center</h1>
          <p className="text-muted-foreground">Find quick answers and guidance.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><HelpCircle className="h-5 w-5 text-primary" /> FAQs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-muted-foreground">
            <div>
              <p className="font-semibold text-foreground">How do I post a job?</p>
              <p>Sign in, go to Dashboard, then click Post a Job. Fill in details and publish.</p>
            </div>
            <div>
              <p className="font-semibold text-foreground">How do I apply?</p>
              <p>Search jobs, open a listing, and click Apply. Make sure your profile is completed.</p>
            </div>
            <div>
              <p className="font-semibold text-foreground">How do I contact support?</p>
              <p>Email us at jeethukumar573@gmail.com or call +91 9949888573.</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
