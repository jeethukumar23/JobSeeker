import { Link } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase, FileText } from "lucide-react"

export default function TermsPage() {
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
          <h1 className="text-3xl font-bold">Terms of Service</h1>
          <p className="text-muted-foreground">Guidelines for using JOB SEEKER.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5 text-primary" /> Key terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-muted-foreground">
            <ul className="list-disc pl-5 space-y-1">
              <li>Use accurate information in profiles and job posts.</li>
              <li>Respect privacy and do not share sensitive data.</li>
              <li>We may remove content that violates these terms.</li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
