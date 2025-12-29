import { Link } from "react-router-dom"
import {
  Briefcase,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Twitter,
  Linkedin,
} from "lucide-react"

export default function Footer() {
  return (
    <footer className="mt-12 bg-primary/5 border-t border-border">
      <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col gap-10">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Briefcase className="h-7 w-7 text-primary" />
              <span className="text-xl font-bold text-foreground">Job Seeker</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              A dedicated platform for job seekers and employers to connect quickly.
              Discover roles, track applications, and hire faster with a smooth experience.
            </p>
            <div className="flex items-center gap-3 text-muted-foreground">
              <a aria-label="Facebook" className="hover:text-foreground" href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                <Facebook className="h-5 w-5" />
              </a>
              <a aria-label="Twitter" className="hover:text-foreground" href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
                <Twitter className="h-5 w-5" />
              </a>
              <a aria-label="Instagram" className="hover:text-foreground" href="https://www.instagram.com/_mr_jeethu/" target="_blank" rel="noopener noreferrer">
                <Instagram className="h-5 w-5" />
              </a>
              <a aria-label="LinkedIn" className="hover:text-foreground" href="https://www.linkedin.com/in/jeethukumarganchi-" target="_blank" rel="noopener noreferrer">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-base font-semibold text-foreground">Quick Links</p>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link to="/about" className="hover:text-foreground">About Us</Link>
              <Link to="/contact" className="hover:text-foreground">Contact</Link>
              <Link to="/help" className="hover:text-foreground">Help Center</Link>
              <Link to="/jobs/search" className="hover:text-foreground">Search Jobs</Link>
              <Link to="/applications" className="hover:text-foreground">Applications</Link>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-base font-semibold text-foreground">Customer Service</p>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link to="/profile" className="hover:text-foreground">Profile</Link>
              <Link to="/dashboard" className="hover:text-foreground">Dashboard</Link>
              <Link to="/jobs/post" className="hover:text-foreground">Post a Job</Link>
              <Link to="/terms" className="hover:text-foreground">Terms of Service</Link>
              <Link to="/privacy" className="hover:text-foreground">Privacy Policy</Link>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-base font-semibold text-foreground">Stay Updated</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Get new roles, hiring tips, and product updates straight to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
              <button className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90">
                Subscribe
              </button>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <span>+91 9949888573</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <span>jeethukumar573@gmail.com</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 text-primary" />
                <span>India, Andhra Pradesh, Tenali 522201</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-border pt-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <span>© 2024 Job Seeker. All rights reserved.</span>
          <div className="flex flex-wrap items-center gap-4">
            <Link to="/privacy" className="hover:text-foreground">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-foreground">Terms of Service</Link>
            <Link to="/cookies" className="hover:text-foreground">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
