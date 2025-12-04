import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Mail, 
  Menu, 
  X,
  Sparkles,
  Bell,
  RefreshCw
} from 'lucide-react'
import { useApp } from '../../context/AppContext'

const navLinks = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/rfp/create', label: 'Create RFP', icon: FileText },
  { path: '/vendors', label: 'Vendors', icon: Users },
]

const Navbar = () => {
  const location = useLocation()
  const { checkEmails, loading } = useApp()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleCheckEmails = async () => {
    await checkEmails()
  }

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/80 backdrop-blur-xl shadow-lg shadow-dark-900/5' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/25 group-hover:shadow-primary-500/40 transition-shadow">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 blur-lg opacity-30 group-hover:opacity-50 transition-opacity" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-display font-bold gradient-text">
                  RFP Manager
                </span>
                <span className="text-xs text-dark-400 font-medium -mt-1">
                  AI-Powered Procurement
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path
                const Icon = link.icon
                
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`relative flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                      isActive 
                        ? 'text-primary-600' 
                        : 'text-dark-600 hover:text-primary-600 hover:bg-primary-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute inset-0 bg-primary-100 rounded-xl -z-10"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </Link>
                )
              })}
            </div>

            {/* Right Actions */}
            <div className="hidden md:flex items-center gap-3">
              {/* Check Emails Button */}
              <button
                onClick={handleCheckEmails}
                disabled={loading.email}
                className="relative flex items-center gap-2 px-4 py-2 rounded-xl text-dark-600 hover:text-primary-600 hover:bg-primary-50 font-medium transition-all duration-200 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading.email ? 'animate-spin' : ''}`} />
                <span>Check Inbox</span>
              </button>

              {/* Notifications */}
              <button className="relative p-2 rounded-xl text-dark-600 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>

              {/* Create RFP CTA */}
              <Link
                to="/rfp/create"
                className="btn-primary flex items-center gap-2 !py-2.5 !px-5"
              >
                <Sparkles className="w-4 h-4" />
                <span>New RFP</span>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-dark-600 hover:bg-dark-100 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-20 z-40 md:hidden"
          >
            <div className="bg-white/95 backdrop-blur-xl shadow-xl mx-4 rounded-2xl border border-dark-100 overflow-hidden">
              <div className="p-4 space-y-2">
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.path
                  const Icon = link.icon
                  
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                        isActive 
                          ? 'bg-primary-100 text-primary-600' 
                          : 'text-dark-600 hover:bg-dark-50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{link.label}</span>
                    </Link>
                  )
                })}
                
                <div className="pt-2 border-t border-dark-100">
                  <button
                    onClick={() => {
                      handleCheckEmails()
                      setIsMobileMenuOpen(false)
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-dark-600 hover:bg-dark-50 font-medium transition-all duration-200"
                  >
                    <Mail className="w-5 h-5" />
                    <span>Check Inbox</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar