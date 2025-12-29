import { Link } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase, Shield } from "lucide-react"

export default function PrivacyPolicyPage() {
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
          <h1 className="text-3xl font-bold">Privacy Policy</h1>
          <p className="text-muted-foreground">How we collect, use, and protect your data.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5 text-primary" /> Your data</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-muted-foreground">
            <p>We collect basic profile details to help employers and seekers connect. We never sell your data.</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Data is used to match jobs and applications.</li>
              <li>We store only what is necessary for hiring.</li>
              <li>You can request deletion by contacting support.</li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
