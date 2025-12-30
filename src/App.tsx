import { Routes, Route, useLocation } from "react-router-dom"
import { useEffect } from "react"
import { Toaster } from "@/components/ui/toaster.tsx"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import SignupPage from "./pages/SignupPage"
import DashboardPage from "./pages/DashboardPage"
import ProfilePage from "./pages/ProfilePage"
import PostJobPage from "./pages/PostJobPage"
import SearchJobsPage from "./pages/SearchJobsPage"
import ApplicationsPage from "./pages/ApplicationsPage"
import AboutPage from "./pages/AboutPage"
import ContactPage from "./pages/ContactPage"
import HelpCenterPage from "./pages/HelpCenterPage"
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage"
import TermsPage from "./pages/TermsPage"
import CookiePolicyPage from "./pages/CookiePolicyPage"
import UpgradePage from "@/pages/UpgradePage"
import Footer from "./components/Footer"
import ChatPage from "./pages/ChatPage"

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  // Disable browser's automatic scroll restoration
  useEffect(() => {
    window.history.scrollRestoration = 'manual'
  }, [])

  return null
}

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/upgrade" element={<UpgradePage />} />
        <Route path="/jobs/post" element={<PostJobPage />} />
        <Route path="/jobs/search" element={<SearchJobsPage />} />
        <Route path="/applications" element={<ApplicationsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/help" element={<HelpCenterPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/cookies" element={<CookiePolicyPage />} />
        <Route path="/chat/:appId" element={<ChatPage />} />
      </Routes>
      <Footer />
      <Toaster />
    </>
  )
}

export default App
