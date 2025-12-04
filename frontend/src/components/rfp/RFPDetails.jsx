import { motion } from 'framer-motion'
import { 
  Calendar, 
  DollarSign, 
  Package, 
  FileText, 
  Clock,
  Shield,
  CreditCard,
  MapPin,
  Edit2,
  Trash2,
  Send,
  Users
} from 'lucide-react'

const RFPDetails = ({ rfp, onEdit, onDelete, onSend }) => {
  const formatCurrency = (amount, currency = 'USD') => {
    if (!amount) return 'Not specified'
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
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const InfoCard = ({ icon: Icon, label, value, color = 'primary' }) => (
    <div className="flex items-start gap-3 p-4 bg-dark-50 rounded-xl">
      <div className={`p-2 rounded-lg bg-${color}-100`}>
        <Icon className={`w-5 h-5 text-${color}-600`} />
      </div>
      <div>
        <p className="text-sm text-dark-500">{label}</p>
        <p className="font-medium text-dark-800">{value}</p>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-lg shadow-dark-900/5"
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-dark-500">#{rfp.rfpNumber}</span>
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                rfp.status === 'draft' ? 'bg-dark-100 text-dark-600' :
                rfp.status === 'sent' ? 'bg-blue-100 text-blue-700' :
                rfp.status === 'evaluating' ? 'bg-amber-100 text-amber-700' :
                rfp.status === 'awarded' ? 'bg-green-100 text-green-700' :
                'bg-dark-100 text-dark-500'
              }`}>
                {rfp.status?.charAt(0).toUpperCase() + rfp.status?.slice(1)}
              </span>
            </div>
            <h1 className="text-2xl font-display font-bold text-dark-800">
              {rfp.title}
            </h1>
            <p className="text-dark-500 mt-2">{rfp.description}</p>
          </div>
          
          <div className="flex items-center gap-2">
            {rfp.status === 'draft' && (
              <>
                <button
                  onClick={onEdit}
                  className="p-2 rounded-xl text-dark-600 hover:bg-dark-100 transition-colors"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
                <button
                  onClick={onDelete}
                  className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Key Info Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <InfoCard 
            icon={DollarSign} 
            label="Budget" 
            value={formatCurrency(rfp.budget?.amount, rfp.budget?.currency)}
            color="green"
          />
          <InfoCard 
            icon={Calendar} 
            label="Delivery Deadline" 
            value={formatDate(rfp.deliveryDeadline)}
            color="blue"
          />
          <InfoCard 
            icon={CreditCard} 
            label="Payment Terms" 
            value={rfp.paymentTerms || 'Not specified'}
            color="purple"
          />
          <InfoCard 
            icon={Shield} 
            label="Warranty" 
            value={rfp.warrantyRequirements || 'Not specified'}
            color="amber"
          />
        </div>
      </motion.div>

      {/* Items */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl p-6 shadow-lg shadow-dark-900/5"
      >
        <h2 className="text-lg font-display font-semibold text-dark-800 mb-4 flex items-center gap-2">
          <Package className="w-5 h-5 text-primary-500" />
          Items Required
        </h2>
        
        <div className="overflow-hidden rounded-xl border border-dark-100">
          <table className="w-full">
            <thead>
              <tr className="bg-dark-50">
                <th className="table-header">Item</th>
                <th className="table-header">Quantity</th>
                <th className="table-header">Specifications</th>
                <th className="table-header text-right">Est. Price</th>
              </tr>
            </thead>
            <tbody>
              {rfp.items?.map((item, index) => (
                <tr key={index} className="table-row">
                  <td className="table-cell font-medium text-dark-800">{item.name}</td>
                  <td className="table-cell">{item.quantity} {item.unit}</td>
                  <td className="table-cell text-dark-500">{item.specifications || '-'}</td>
                  <td className="table-cell text-right">
                    {item.estimatedUnitPrice 
                      ? formatCurrency(item.estimatedUnitPrice * item.quantity)
                      : '-'
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Additional Requirements */}
      {rfp.additionalRequirements?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-lg shadow-dark-900/5"
        >
          <h2 className="text-lg font-display font-semibold text-dark-800 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary-500" />
            Additional Requirements
          </h2>
          <ul className="space-y-2">
            {rfp.additionalRequirements.map((req, index) => (
              <li key={index} className="flex items-start gap-2 text-dark-600">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 flex-shrink-0" />
                {req}
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Sent to Vendors */}
      {rfp.sentToVendors?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-lg shadow-dark-900/5"
        >
          <h2 className="text-lg font-display font-semibold text-dark-800 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-primary-500" />
            Sent to Vendors ({rfp.sentToVendors.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {rfp.sentToVendors.map((sent, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-dark-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-primary-600 font-semibold">
                      {sent.vendorId?.name?.charAt(0) || 'V'}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-dark-800">
                      {sent.vendorId?.name || 'Vendor'}
                    </p>
                    <p className="text-xs text-dark-500">
                      {sent.vendorId?.email}
                    </p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  sent.emailStatus === 'sent' ? 'bg-green-100 text-green-700' :
                  sent.emailStatus === 'failed' ? 'bg-red-100 text-red-700' :
                  'bg-amber-100 text-amber-700'
                }`}>
                  {sent.emailStatus}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Original Input */}
      {rfp.naturalLanguageInput && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl p-6"
        >
          <h2 className="text-lg font-display font-semibold text-dark-800 mb-3 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary-500" />
            Original Request
          </h2>
          <p className="text-dark-600 italic">"{rfp.naturalLanguageInput}"</p>
        </motion.div>
      )}
    </div>
  )
}

export default RFPDetails