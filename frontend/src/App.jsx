import { useState, useRef, useEffect } from 'react';
import { Routes, Route, useNavigate, useParams, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useApp } from './context/AppContext';
import CreateRFP from './pages/CreateRFP'

// Status Badge Component with proper colors
const StatusBadge = ({ status }) => {
  const statusConfig = {
    'New': { bg: 'bg-blue-100', text: 'text-blue-700', label: 'New' },
    'Review RFP': { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Review RFP' },
    'Vendors Choosed': { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Vendors Selected' },
    'Vendors Responded': { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Responses Received' },
    'View Quotes': { bg: 'bg-cyan-100', text: 'text-cyan-700', label: 'View Quotes' },
    'Completed': { bg: 'bg-green-100', text: 'text-green-700', label: 'Completed' },
    'draft': { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Draft' },
    'pending': { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Pending' },
    'completed': { bg: 'bg-green-100', text: 'text-green-700', label: 'Completed' }
  };
  
  const config = statusConfig[status] || statusConfig['New'];
  return (
    <span className={`px-2.5 py-1 text-xs font-semibold rounded-md ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
};

// Delete Confirmation Modal
const DeleteModal = ({ isOpen, onClose, onConfirm, rfpTitle, isDeleting }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl"
      >
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Delete RFP?</h3>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete "<span className="font-medium">{rfpTitle}</span>"? This action cannot be undone.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="px-6 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="px-6 py-2.5 text-white bg-red-600 hover:bg-red-700 rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isDeleting ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Deleting...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Chat Message Component
const ChatMessage = ({ message, isUser, isTyping }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.2 }}
    className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
  >
    {/* Avatar */}
    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
      isUser ? 'bg-[#7C3AED]' : 'bg-gradient-to-br from-[#7C3AED] to-[#5B21B6]'
    }`}>
      {isUser ? (
        <span className="text-white text-xs font-medium">JD</span>
      ) : (
        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
        </svg>
      )}
    </div>

    {/* Message Bubble */}
    <div className={`max-w-[70%] ${isUser ? 'items-end' : 'items-start'}`}>
      <div className={`px-4 py-3 rounded-2xl ${
        isUser 
          ? 'bg-[#7C3AED] text-white rounded-tr-md' 
          : 'bg-white text-[#1F2937] rounded-tl-md shadow-sm border border-[#E5E7EB]'
      }`}>
        {isTyping ? (
          <div className="flex gap-1 py-1">
            <span className="w-2 h-2 bg-[#9CA3AF] rounded-full animate-bounce" style={{animationDelay: '0ms'}}></span>
            <span className="w-2 h-2 bg-[#9CA3AF] rounded-full animate-bounce" style={{animationDelay: '150ms'}}></span>
            <span className="w-2 h-2 bg-[#9CA3AF] rounded-full animate-bounce" style={{animationDelay: '300ms'}}></span>
          </div>
        ) : (
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        )}
      </div>
      <span className="text-[10px] text-[#9CA3AF] mt-1 px-1">
        {isUser ? 'Just now' : 'AI Assistant'}
      </span>
    </div>
  </motion.div>
);

// Prompt Suggestion Card
const PromptCard = ({ icon, title, subtitle, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-3 p-4 bg-white rounded-xl border border-[#E5E7EB] hover:border-[#7C3AED] hover:shadow-md transition-all duration-200 text-left group"
  >
    <div className="w-10 h-10 rounded-lg bg-[#F3F4F6] group-hover:bg-[#EDE9FE] flex items-center justify-center transition-colors">
      {icon}
    </div>
    <div className="flex-1">
      <h4 className="text-sm font-medium text-[#1F2937]">{title}</h4>
      <p className="text-xs text-[#6B7280]">{subtitle}</p>
    </div>
    <svg className="w-4 h-4 text-[#9CA3AF] group-hover:text-[#7C3AED] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  </button>
);

// RFP Card Component
const RFPCard = ({ rfp, onEdit, onSend }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden shadow-sm"
  >
    <div className="p-4 border-b border-[#E5E7EB] bg-[#F9FAFB]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#7C3AED] flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <span className="font-medium text-[#1F2937] text-sm">RFP Document</span>
        </div>
        <span className="px-2 py-1 bg-[#D1FAE5] text-[#065F46] text-xs font-medium rounded-md">Ready</span>
      </div>
    </div>
    
    <div className="p-4 space-y-3">
      <div>
        <p className="text-[10px] text-[#6B7280] uppercase tracking-wider font-medium">Title</p>
        <p className="text-sm text-[#1F2937] font-medium">{rfp.title}</p>
      </div>
      <div>
        <p className="text-[10px] text-[#6B7280] uppercase tracking-wider font-medium">Description</p>
        <p className="text-sm text-[#4B5563]">{rfp.description}</p>
      </div>
      <div className="flex gap-3">
        <div className="flex-1 p-2 bg-[#F9FAFB] rounded-lg">
          <p className="text-[10px] text-[#6B7280] uppercase tracking-wider font-medium">Budget</p>
          <p className="text-sm text-[#1F2937] font-semibold">{rfp.budget}</p>
        </div>
        <div className="flex-1 p-2 bg-[#F9FAFB] rounded-lg">
          <p className="text-[10px] text-[#6B7280] uppercase tracking-wider font-medium">Deadline</p>
          <p className="text-sm text-[#1F2937] font-semibold">{rfp.deadline}</p>
        </div>
      </div>
      {rfp.vendors?.length > 0 && (
        <div>
          <p className="text-[10px] text-[#6B7280] uppercase tracking-wider font-medium mb-2">Vendors</p>
          <div className="flex flex-wrap gap-1">
            {rfp.vendors.map((v, i) => (
              <span key={i} className="px-2 py-1 bg-[#EDE9FE] text-[#5B21B6] text-xs rounded-md">{v}</span>
            ))}
          </div>
        </div>
      )}
    </div>
    
    <div className="p-4 border-t border-[#E5E7EB] bg-[#F9FAFB] flex gap-2">
      <button onClick={onEdit} className="flex-1 px-3 py-2 text-sm font-medium text-[#374151] bg-white border border-[#D1D5DB] rounded-lg hover:bg-[#F9FAFB] transition-colors">
        Edit
      </button>
      <button onClick={onSend} className="flex-1 px-3 py-2 text-sm font-medium text-white bg-[#7C3AED] rounded-lg hover:bg-[#6D28D9] transition-colors">
        Send to Vendors
      </button>
    </div>
  </motion.div>
);

// Main App
function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { rfps, currentRfp, fetchRfps, deleteRfp } = useApp();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentRFP, setCurrentRFP] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, rfp: null });
  const [isDeleting, setIsDeleting] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Check if we're on create or edit page
  const isOnCreatePage = location.pathname === '/create' || location.pathname.startsWith('/rfp/');

  useEffect(() => {
    fetchRfps();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle delete RFP
  const handleDeleteClick = (e, rfp) => {
    e.stopPropagation(); // Prevent card click
    setDeleteModal({ isOpen: true, rfp });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.rfp) return;
    setIsDeleting(true);
    try {
      await deleteRfp(deleteModal.rfp._id);
      toast.success('RFP deleted successfully');
      setDeleteModal({ isOpen: false, rfp: null });
    } catch (error) {
      toast.error('Failed to delete RFP');
    } finally {
      setIsDeleting(false);
    }
  };

  // Get step from status
  const getStepFromStatus = (status) => {
    const statusStepMap = {
      'New': 1,
      'Review RFP': 2,
      'Vendors Choosed': 4,  // After sending to vendors, go to step 4 (Compare)
      'Vendors Responded': 4,
      'View Quotes': 4,
      'Completed': 4,
      'draft': 2,
      'pending': 3
    };
    return statusStepMap[status] || 1;
  };

  // Navigate to create page
  const handleCreateClick = () => {
    navigate('/create');
  };

  // Navigate to dashboard
  const handleBackToDashboard = () => {
    navigate('/');
  };

  // Navigate to edit RFP
  const handleEditRFP = (rfp) => {
    const step = getStepFromStatus(rfp.status || 'New');
    navigate(`/rfp/${rfp._id}?step=${step}`);
  };

  return (
    <div className="min-h-screen relative">
      {/* Animated Pastel Gradient Background */}
      <div className="app-background"></div>
      
      {/* Floating Orbs Animation */}
      <div className="floating-orbs">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>
      
      {/* Subtle Grid Pattern */}
      <div className="grid-pattern"></div>
      
      {/* Floating Particles */}
      <div className="particles-container">
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        {/* Sparkles */}
        <div className="sparkle"></div>
        <div className="sparkle"></div>
        <div className="sparkle"></div>
        <div className="sparkle"></div>
        <div className="sparkle"></div>
        <div className="sparkle"></div>
      </div>

      {/* Glass Header */}
      <header className="app-header h-20 px-8 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
            </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 leading-tight">RFP Manager</h1>
              <p className="text-xs text-gray-500 leading-tight">AI-Powered Procurement</p>
            </div>
          </motion.div>
          <div className="flex items-center gap-4">
            {!isOnCreatePage && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCreateClick}
                className="btn-primary flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                <span>Create New RFP</span>
              </motion.button>
            )}
          </div>
        </header>

        {/* Main Content Area with Routes - Add pt-24 to account for fixed header */}
        <div className="flex-1 overflow-y-auto pt-24">
          <div className="max-w-5xl mx-auto px-6 py-6">
            <Routes>
              {/* Create New RFP */}
              <Route path="/create" element={
                <CreateRFPWrapper onBack={handleBackToDashboard} />
              } />
              
              {/* Edit Existing RFP */}
              <Route path="/rfp/:id" element={
                <EditRFPWrapper onBack={handleBackToDashboard} rfps={rfps} />
              } />
              
              {/* Dashboard (Home) */}
              <Route path="/" element={
                <Dashboard 
                  rfps={rfps} 
                  messages={messages}
                  setMessages={setMessages}
                  input={input}
                  setInput={setInput}
                  isTyping={isTyping}
                  setIsTyping={setIsTyping}
                  currentRFP={currentRFP}
                  setCurrentRFP={setCurrentRFP}
                  handleDeleteClick={handleDeleteClick}
                  handleEditRFP={handleEditRFP}
                  handleCreateClick={handleCreateClick}
                  getStepFromStatus={getStepFromStatus}
                />
              } />
            </Routes>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          <DeleteModal
            isOpen={deleteModal.isOpen}
            onClose={() => setDeleteModal({ isOpen: false, rfp: null })}
            onConfirm={handleDeleteConfirm}
            rfpTitle={deleteModal.rfp?.title || deleteModal.rfp?.llm_response?.title || 'Untitled RFP'}
            isDeleting={isDeleting}
          />
        </AnimatePresence>
    </div>
  );
}

// Wrapper for Create RFP page
function CreateRFPWrapper({ onBack }) {
  const navigate = useNavigate();
  
  return (
    <div>
      <div className="mb-4">
        <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-xl transition-all">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </button>
      </div>
      <CreateRFP 
        setShowCreate={() => navigate('/')} 
        editingRFP={null}
        resumeStep={null}
        onClose={() => navigate('/')}
      />
    </div>
  );
}

// Wrapper for Edit RFP page
function EditRFPWrapper({ onBack, rfps }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  
  // Get step from URL query params
  const searchParams = new URLSearchParams(location.search);
  const resumeStep = parseInt(searchParams.get('step')) || 1;
  
  // Find the RFP being edited
  const editingRFP = rfps?.find(r => r._id === id) || null;
  
  if (!editingRFP && rfps?.length > 0) {
    // RFP not found, redirect to dashboard
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">RFP not found</p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-4">
        <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-xl transition-all">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </button>
      </div>
      <CreateRFP 
        setShowCreate={() => navigate('/')} 
        editingRFP={editingRFP}
        resumeStep={resumeStep}
        onClose={() => navigate('/')}
      />
    </div>
  );
}

// Dashboard Component
function Dashboard({ 
  rfps, 
  messages, 
  setMessages, 
  input, 
  setInput, 
  isTyping, 
  setIsTyping, 
  currentRFP, 
  setCurrentRFP,
  handleDeleteClick,
  handleEditRFP,
  handleCreateClick,
  getStepFromStatus
}) {
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = { id: Date.now(), content: input, isUser: true };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    await new Promise(r => setTimeout(r, 1200));
    
    let response = '';
    let rfp = null;
    const lower = input.toLowerCase();

    if (lower.includes('create') || lower.includes('rfp') || lower.includes('proposal')) {
      response = `I've created an RFP based on your requirements.\n\n✓ RFP scope defined\n✓ Budget range set\n✓ Timeline established\n✓ Vendors identified\n\nReview the document below:`;
      rfp = {
        title: 'Cloud Infrastructure Migration',
        description: 'Migrate on-premise servers to cloud infrastructure with zero downtime.',
        budget: '$50,000 - $100,000',
        deadline: 'March 15, 2024',
        vendors: ['AWS Partners', 'Azure Experts', 'GCP Specialists']
      };
    } else if (lower.includes('help')) {
      response = `I can help you with:\n\n• Create RFP - Generate new proposals\n• Send to Vendors - Email RFPs directly\n• Compare - Analyze vendor responses\n• Track - Monitor RFP status\n\nWhat would you like to do?`;
    } else {
      response = `To create an RFP, tell me:\n\n• What service do you need?\n• What's your budget?\n• When do you need it?\n\nExample: "Create an RFP for website development, budget $20k, deadline in 2 months"`;
    }

    setIsTyping(false);
    setMessages(prev => [...prev, { id: Date.now(), content: response, isUser: false }]);
    if (rfp) setCurrentRFP(rfp);
  };

  if (messages.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section with Animated Title */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="hero-title text-5xl md:text-6xl mb-4">
            My RFPs
          </h1>
          <p className="text-gray-500 text-lg max-w-lg mx-auto">
            Create, manage, and track your Request for Proposals with AI ✨
          </p>
        </motion.div>

        {/* RFP Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rfps && rfps.length > 0 ? rfps.map((rfp, i) => {
            const status = rfp.status || 'New';
            const title = rfp.title || rfp.llm_response?.title || 'Untitled RFP';
            const description = rfp.description || rfp.llm_response?.description || rfp.user_text || 'No description provided';
            return (
              <motion.div
                key={rfp._id || i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="rfp-card p-6 cursor-pointer group"
                onClick={() => handleEditRFP(rfp)}
              >
                {/* Delete Button */}
                <button
                  onClick={(e) => handleDeleteClick(e, rfp)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-gray-50 hover:bg-red-50 flex items-center justify-center text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10"
                  title="Delete RFP"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>

                {/* Card Content */}
                <div className="min-w-0 pt-2">
                  {/* Title */}
                  <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-1 pr-8">{title}</h3>
                  
                  {/* Description */}
                  <p className="text-gray-500 text-sm line-clamp-2 mb-5 leading-relaxed">{description}</p>
                  
                  {/* Budget & Deadline Tags */}
                  <div className="flex gap-2 mb-5 flex-wrap">
                    {(rfp.llm_response?.budget || rfp.budget) && (
                      <span className="badge badge-success">
                        💰 {(() => {
                          const budget = rfp.llm_response?.budget || rfp.budget;
                          if (typeof budget === 'object' && budget !== null) {
                            if (budget.min !== undefined || budget.max !== undefined) {
                              return `$${budget.min || 0} - $${budget.max || 0}`;
                            }
                            return JSON.stringify(budget);
                          }
                          return String(budget || 'N/A');
                        })()}
                      </span>
                    )}
                    {(rfp.llm_response?.deadline || rfp.deadline) && (
                      <span className="badge badge-info">
                        📅 {String(rfp.llm_response?.deadline || rfp.deadline || '')}
                      </span>
                    )}
                  </div>
                  
                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <StatusBadge status={status} />
                    <div className="flex items-center gap-4 text-xs text-gray-400 font-medium">
                      {rfp.choosed_vendors?.length > 0 && (
                        <span className="flex items-center gap-1.5">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          {rfp.choosed_vendors.length}
                        </span>
                      )}
                      {rfp.mail_content?.length > 0 && (
                        <span className="flex items-center gap-1.5">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          {rfp.mail_content.length}
                        </span>
                      )}
                      <span>{new Date(rfp.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          }) : (
            <div className="col-span-full">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20 content-card"
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center">
                  <svg className="w-10 h-10 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">No RFPs yet</h3>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">Create your first RFP using natural language and let AI structure it for you.</p>
                <button
                  onClick={handleCreateClick}
                  className="btn-primary"
                >
                  ✨ Create Your First RFP
                </button>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Chat mode
  return (
    <>
      <div className="space-y-6">
        {messages.map(msg => (
          <ChatMessage key={msg.id} message={msg} isUser={msg.isUser} />
        ))}
        {isTyping && <ChatMessage message={{}} isUser={false} isTyping />}
        {currentRFP && !isTyping && (
          <div className="ml-11">
            <RFPCard
              rfp={currentRFP}
              onEdit={() => setInput('Edit the RFP ')}
              onSend={() => {
                setMessages(p => [...p, { id: Date.now(), content: 'Send to vendors', isUser: true }]);
                setIsTyping(true);
                setTimeout(() => {
                  setIsTyping(false);
                  setMessages(p => [...p, {
                    id: Date.now(),
                    content: '✓ RFP sent successfully!\n\nRecipients:\n• AWS Partners\n• Azure Experts\n• GCP Specialists\n\nYou\'ll be notified when they respond.',
                    isUser: false
                  }]);
                  setCurrentRFP(null);
                }, 1200);
              }}
            />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Chat Input */}
      <div className="fixed bottom-0 left-0 right-0 px-6 py-4 bg-white border-t border-[#E5E7EB]">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-[#F3F4F6] rounded-lg transition-colors">
              <svg className="w-5 h-5 text-[#6B7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </button>
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Type your message..."
                className="w-full px-4 py-3 bg-[#F3F4F6] border border-transparent rounded-xl text-sm text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-colors"
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className={`p-3 rounded-xl transition-colors ${
                input.trim() ? 'bg-[#7C3AED] text-white hover:bg-[#6D28D9]' : 'bg-[#E5E7EB] text-[#9CA3AF]'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
          <p className="text-[10px] text-[#9CA3AF] text-center mt-2">
            Press Enter to send • RFP Manager AI
          </p>
        </div>
      </div>
    </>
  );
}

export default App;
