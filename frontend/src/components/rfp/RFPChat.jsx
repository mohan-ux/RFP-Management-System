import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Sparkles, User, Bot, Loader2, Lightbulb } from 'lucide-react'
import { AIThinking } from '../common/LoadingSpinner'

const examplePrompts = [
  "I need to procure 20 laptops with 16GB RAM and 15 monitors 27-inch. Budget is $50,000. Need delivery within 30 days.",
  "Looking for office furniture: 50 ergonomic chairs and 25 standing desks. Budget $30,000, delivery in 2 weeks.",
  "Need catering services for 200 people corporate event. Budget $15,000. Date: next month.",
  "Procure network equipment: 10 routers, 50 ethernet cables, 5 switches. Budget $8,000. Urgent delivery needed."
]

const RFPChat = ({ onSubmit, isLoading = false }) => {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [showExamples, setShowExamples] = useState(true)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    setShowExamples(false)

    // Add user message
    setMessages(prev => [...prev, { 
      type: 'user', 
      content: userMessage,
      timestamp: new Date()
    }])

    // Add AI thinking message
    setMessages(prev => [...prev, { 
      type: 'thinking',
      timestamp: new Date()
    }])

    // Call the parent's onSubmit handler
    if (onSubmit) {
      const result = await onSubmit(userMessage)
      
      // Remove thinking message and add AI response
      setMessages(prev => {
        const filtered = prev.filter(m => m.type !== 'thinking')
        return [...filtered, {
          type: 'ai',
          content: result,
          timestamp: new Date()
        }]
      })
    }
  }

  const handleExampleClick = (example) => {
    setInput(example)
    inputRef.current?.focus()
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {/* Welcome Message */}
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-8"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-display font-bold text-dark-800 mb-2">
              Create Your RFP with AI
            </h2>
            <p className="text-dark-500 max-w-md mx-auto">
              Describe what you need to procure in natural language. Our AI will transform it into a structured RFP.
            </p>
          </motion.div>
        )}

        {/* Example Prompts */}
        <AnimatePresence>
          {showExamples && messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-3"
            >
              <div className="flex items-center gap-2 text-dark-500 text-sm">
                <Lightbulb className="w-4 h-4" />
                <span>Try one of these examples:</span>
              </div>
              <div className="grid gap-2">
                {examplePrompts.map((prompt, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleExampleClick(prompt)}
                    className="text-left p-4 rounded-xl border-2 border-dark-100 hover:border-primary-300 hover:bg-primary-50/50 transition-all duration-200 text-sm text-dark-600"
                  >
                    {prompt}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat Messages */}
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.type === 'thinking' ? (
                <AIThinking text="Analyzing your requirements..." />
              ) : message.type === 'user' ? (
                <div className="flex items-start gap-3 max-w-[80%]">
                  <div className="chat-bubble-user">
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  </div>
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-dark-200 flex items-center justify-center">
                    <User className="w-4 h-4 text-dark-600" />
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3 max-w-[80%]">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="chat-bubble-ai">
                    {typeof message.content === 'string' ? (
                      <p className="text-sm leading-relaxed text-dark-700">{message.content}</p>
                    ) : (
                      <div className="text-sm text-dark-700">
                        <p className="font-medium text-green-600 mb-2">✓ RFP Created Successfully!</p>
                        <p>Your RFP has been structured and saved. You can now review and send it to vendors.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-dark-100 p-4 bg-white/50 backdrop-blur-sm">
        <div className="flex items-end gap-3">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Describe what you need to procure..."
              disabled={isLoading}
              rows={3}
              className="textarea resize-none pr-12"
            />
            <button
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
              className={`absolute right-3 bottom-3 p-2 rounded-xl transition-all duration-200 ${
                input.trim() && !isLoading
                  ? 'bg-primary-500 text-white hover:bg-primary-600'
                  : 'bg-dark-100 text-dark-400'
              }`}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
        <p className="text-xs text-dark-400 mt-2 text-center">
          Press Enter to send • Shift + Enter for new line
        </p>
      </div>
    </div>
  )
}

export default RFPChat