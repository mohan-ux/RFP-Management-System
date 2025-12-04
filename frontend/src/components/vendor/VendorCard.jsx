import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  User,
  Edit2, 
  Trash2,
  MoreVertical,
  ExternalLink
} from 'lucide-react'

const categoryColors = {
  'IT Equipment': 'bg-blue-100 text-blue-700',
  'Office Supplies': 'bg-green-100 text-green-700',
  'Furniture': 'bg-amber-100 text-amber-700',
  'Services': 'bg-purple-100 text-purple-700',
  'Other': 'bg-dark-100 text-dark-600'
}

const VendorCard = ({ vendor, onEdit, onDelete, selectable = false, selected = false, onSelect }) => {
  const categoryClass = categoryColors[vendor.category] || categoryColors['Other']

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      onClick={selectable ? () => onSelect?.(vendor) : undefined}
      className={`
        bg-white rounded-2xl p-6 shadow-lg shadow-dark-900/5 
        hover:shadow-xl transition-all duration-300 
        border-2 ${selected ? 'border-primary-500 bg-primary-50/30' : 'border-transparent'}
        ${selectable ? 'cursor-pointer' : ''}
      `}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-lg">
            {vendor.name?.charAt(0)?.toUpperCase() || 'V'}
          </div>
          <div>
            <h3 className="font-display font-semibold text-dark-800">
              {vendor.name}
            </h3>
            <div className="flex items-center gap-1 text-sm text-dark-500">
              <Building2 className="w-3.5 h-3.5" />
              <span>{vendor.company}</span>
            </div>
          </div>
        </div>
        
        {!selectable && (
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => { e.stopPropagation(); onEdit?.(vendor._id) }}
              className="p-2 rounded-lg text-dark-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete?.(vendor._id) }}
              className="p-2 rounded-lg text-dark-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
        
        {selectable && selected && (
          <div className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>

      {/* Category Badge */}
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium mb-4 ${categoryClass}`}>
        {vendor.category}
      </span>

      {/* Contact Info */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-dark-600">
          <Mail className="w-4 h-4 text-dark-400" />
          <a href={`mailto:${vendor.email}`} className="hover:text-primary-600 transition-colors">
            {vendor.email}
          </a>
        </div>
        
        {vendor.phone && (
          <div className="flex items-center gap-2 text-sm text-dark-600">
            <Phone className="w-4 h-4 text-dark-400" />
            <span>{vendor.phone}</span>
          </div>
        )}
        
        {vendor.contactPerson && (
          <div className="flex items-center gap-2 text-sm text-dark-600">
            <User className="w-4 h-4 text-dark-400" />
            <span>{vendor.contactPerson}</span>
          </div>
        )}
        
        {vendor.address?.city && (
          <div className="flex items-center gap-2 text-sm text-dark-600">
            <MapPin className="w-4 h-4 text-dark-400" />
            <span>
              {[vendor.address.city, vendor.address.state, vendor.address.country]
                .filter(Boolean)
                .join(', ')}
            </span>
          </div>
        )}
      </div>

      {/* Status Indicator */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-dark-100">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${vendor.status === 'active' ? 'bg-green-500' : 'bg-dark-300'}`} />
          <span className="text-sm text-dark-500 capitalize">{vendor.status || 'active'}</span>
        </div>
        
        {!selectable && (
          <Link 
            to={`/vendors/${vendor._id}/edit`}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
          >
            View Details
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>
    </motion.div>
  )
}

export default VendorCard