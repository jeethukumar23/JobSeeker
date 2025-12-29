import { Link } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase, Cookie } from "lucide-react"

export default function CookiePolicyPage() {
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
          <h1 className="text-3xl font-bold">Cookie Policy</h1>
          <p className="text-muted-foreground">How and why we use cookies.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Cookie className="h-5 w-5 text-primary" /> Cookies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-muted-foreground">
            <ul className="list-disc pl-5 space-y-1">
              <li>We use cookies to keep you signed in and improve experience.</li>
              <li>You can clear cookies in your browser settings at any time.</li>
              <li>Disabling cookies may limit some features.</li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
