import { motion } from 'framer-motion'

const LoadingSpinner = ({ 
  size = 'md', 
  variant = 'primary',
  fullScreen = false,
  text = ''
}) => {
  const sizes = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }

  const variants = {
    primary: 'border-primary-500',
    white: 'border-white',
    dark: 'border-dark-600'
  }

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative">
        {/* Outer glow */}
        <div className={`absolute inset-0 ${sizes[size]} rounded-full bg-primary-500/20 blur-xl animate-pulse`} />
        
        {/* Spinner */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className={`${sizes[size]} rounded-full border-4 border-dark-200 ${variants[variant]} border-t-transparent`}
        />
      </div>
      
      {text && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-dark-500 font-medium"
        >
          {text}
        </motion.p>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        {spinner}
      </div>
    )
  }

  return spinner
}

// Skeleton Loader
export const Skeleton = ({ className = '', variant = 'text' }) => {
  const variants = {
    text: 'h-4 w-full',
    title: 'h-6 w-3/4',
    avatar: 'h-12 w-12 rounded-full',
    thumbnail: 'h-32 w-full rounded-xl',
    card: 'h-48 w-full rounded-2xl'
  }

  return (
    <div 
      className={`bg-dark-200 animate-pulse rounded ${variants[variant]} ${className}`}
    />
  )
}

// Skeleton Card
export const SkeletonCard = () => (
  <div className="bg-white rounded-2xl p-6 shadow-lg shadow-dark-900/5">
    <div className="flex items-start justify-between mb-4">
      <div className="space-y-2 flex-1">
        <Skeleton variant="title" />
        <Skeleton className="w-1/2" />
      </div>
      <Skeleton variant="avatar" className="ml-4" />
    </div>
    <div className="space-y-3">
      <Skeleton />
      <Skeleton />
      <Skeleton className="w-4/5" />
    </div>
  </div>
)

// Dots Loader
export const DotsLoader = ({ size = 'md' }) => {
  const dotSizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-3 h-3'
  }

  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={`${dotSizes[size]} rounded-full bg-primary-500`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.15
          }}
        />
      ))}
    </div>
  )
}

// AI Thinking Animation
export const AIThinking = ({ text = 'AI is thinking...' }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex items-center gap-3 px-4 py-3 bg-primary-50 rounded-xl"
  >
    <div className="relative">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
        />
      </div>
      <div className="absolute inset-0 rounded-full bg-primary-500/30 animate-ping" />
    </div>
    <span className="text-primary-700 font-medium">{text}</span>
    <DotsLoader size="sm" />
  </motion.div>
)

export default LoadingSpinner