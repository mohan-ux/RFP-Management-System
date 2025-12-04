import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  FileText, 
  Calendar, 
  DollarSign, 
  Send, 
  Eye, 
  MoreVertical,
  Clock,
  CheckCircle2,
  AlertCircle,
  Users
} from 'lucide-react'

const statusConfig = {
  draft: {
    label: 'Draft',
    color: 'bg-dark-100 text-dark-600',
    icon: FileText
  },
  sent: {
    label: 'Sent',
    color: 'bg-blue-100 text-blue-700',
    icon: Send
  },
  evaluating: {
    label: 'Evaluating',
    color: 'bg-amber-100 text-amber-700',
    icon: Clock
  },
  awarded: {
    label: 'Awarded',
    color: 'bg-green-100 text-green-700',
    icon: CheckCircle2
  },
  closed: {
    label: 'Closed',
    color: 'bg-dark-100 text-dark-500',
    icon: CheckCircle2
  },
  cancelled: {
    label: 'Cancelled',
    color: 'bg-red-100 text-red-700',
    icon: AlertCircle
  }
}

const RFPCard = ({ rfp, onSend, onDelete }) => {
  const status = statusConfig[rfp.status] || statusConfig.draft
  const StatusIcon = status.icon

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (date) => {
    if (!date) return 'Not set'
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl p-6 shadow-lg shadow-dark-900/5 hover:shadow-xl transition-all duration-300 border border-dark-100/50"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>
              <StatusIcon className="w-3 h-3" />
              {status.label}
            </span>
            <span className="text-xs text-dark-400">#{rfp.rfpNumber}</span>
          </div>
          <h3 className="text-lg font-display font-semibold text-dark-800 truncate">
            {rfp.title}
          </h3>
        </div>
        
        <button className="p-2 rounded-lg text-dark-400 hover:text-dark-600 hover:bg-dark-50 transition-colors">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      {/* Description */}
      <p className="text-dark-500 text-sm line-clamp-2 mb-4">
        {rfp.description || 'No description provided'}
      </p>

      {/* Meta Info */}
      <div className="flex flex-wrap gap-4 mb-4">
        {rfp.budget?.amount && (
          <div className="flex items-center gap-2 text-sm text-dark-600">
            <DollarSign className="w-4 h-4 text-green-500" />
            <span>{formatCurrency(rfp.budget.amount, rfp.budget.currency)}</span>
          </div>
        )}
        
        {rfp.deliveryDeadline && (
          <div className="flex items-center gap-2 text-sm text-dark-600">
            <Calendar className="w-4 h-4 text-primary-500" />
            <span>{formatDate(rfp.deliveryDeadline)}</span>
          </div>
        )}
        
        {rfp.sentToVendors?.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-dark-600">
            <Users className="w-4 h-4 text-blue-500" />
            <span>{rfp.sentToVendors.length} vendor(s)</span>
          </div>
        )}
      </div>

      {/* Items Preview */}
      {rfp.items?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {rfp.items.slice(0, 3).map((item, index) => (
            <span 
              key={index}
              className="inline-flex items-center px-2.5 py-1 bg-dark-50 rounded-lg text-xs text-dark-600"
            >
              {item.name} × {item.quantity}
            </span>
          ))}
          {rfp.items.length > 3 && (
            <span className="inline-flex items-center px-2.5 py-1 bg-dark-50 rounded-lg text-xs text-dark-500">
              +{rfp.items.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 pt-4 border-t border-dark-100">
        <Link
          to={`/rfp/${rfp._id}`}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-dark-600 hover:bg-dark-50 font-medium transition-colors text-sm"
        >
          <Eye className="w-4 h-4" />
          View Details
        </Link>
        
        {rfp.status === 'draft' && (
          <Link
            to={`/rfp/${rfp._id}/send`}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary-500 text-white hover:bg-primary-600 font-medium transition-colors text-sm"
          >
            <Send className="w-4 h-4" />
            Send RFP
          </Link>
        )}
        
        {(rfp.status === 'sent' || rfp.status === 'evaluating') && (
          <Link
            to={`/rfp/${rfp._id}/proposals`}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary-500 text-white hover:bg-primary-600 font-medium transition-colors text-sm"
          >
            <FileText className="w-4 h-4" />
            View Proposals
          </Link>
        )}
      </div>
    </motion.div>
  )
}

export default RFPCard