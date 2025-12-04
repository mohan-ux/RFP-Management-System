import { motion } from 'framer-motion'

const Card = ({
  children,
  variant = 'default',
  hover = true,
  padding = 'default',
  className = '',
  onClick,
  ...props
}) => {
  const variantClasses = {
    default: 'bg-white border border-gray-200',
    glass: 'bg-white/80 backdrop-blur-sm border border-gray-100',
    gradient: 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white',
    bordered: 'bg-white border-2 border-gray-200'
  }

  const paddingClasses = {
    none: 'p-0',
    sm: 'p-4',
    default: 'p-5',
    lg: 'p-6'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hover ? { y: -2, boxShadow: '0 10px 25px rgba(0,0,0,0.08)' } : {}}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className={`
        rounded-xl
        ${variantClasses[variant]}
        ${paddingClasses[padding]}
        ${hover ? 'cursor-pointer' : ''}
        shadow-sm
        transition-all duration-200
        overflow-hidden
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Card Header Component
Card.Header = ({ children, className = '' }) => (
  <div className={`flex items-center justify-between mb-4 ${className}`}>
    {children}
  </div>
)

// Card Title Component
Card.Title = ({ children, className = '' }) => (
  <h3 className={`text-lg font-display font-semibold text-dark-800 ${className}`}>
    {children}
  </h3>
)

// Card Description Component
Card.Description = ({ children, className = '' }) => (
  <p className={`text-dark-500 text-sm mt-1 ${className}`}>
    {children}
  </p>
)

// Card Content Component
Card.Content = ({ children, className = '' }) => (
  <div className={`${className}`}>
    {children}
  </div>
)

// Card Footer Component
Card.Footer = ({ children, className = '' }) => (
  <div className={`flex items-center justify-between mt-6 pt-4 border-t border-dark-100 ${className}`}>
    {children}
  </div>
)

// Stat Card Component
export const StatCard = ({ 
  title, 
  value, 
  change, 
  changeType = 'neutral',
  icon: Icon,
  iconBg = 'bg-primary-100',
  iconColor = 'text-primary-600'
}) => {
  const changeColors = {
    positive: 'text-green-600 bg-green-50',
    negative: 'text-red-600 bg-red-50',
    neutral: 'text-dark-500 bg-dark-50'
  }

  return (
    <Card hover={false} className="relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-dark-500">{title}</p>
          <p className="text-3xl font-display font-bold text-dark-800 mt-2">{value}</p>
          {change && (
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 ${changeColors[changeType]}`}>
              {change}
            </span>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl ${iconBg}`}>
            <Icon className={`w-6 h-6 ${iconColor}`} />
          </div>
        )}
      </div>
      
      {/* Decorative gradient */}
      <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-gradient-to-br from-primary-100 to-accent-100 opacity-50 blur-2xl" />
    </Card>
  )
}

export default Card