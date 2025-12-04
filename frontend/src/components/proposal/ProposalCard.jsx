import { motion } from 'framer-motion'
import { 
  DollarSign, 
  Calendar, 
  Shield, 
  TrendingUp,
  Mail,
  Clock,
  Eye,
  RefreshCw,
  Building2,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertCircle,
  FileText
} from 'lucide-react'
import { useState } from 'react'

const ProposalCard = ({ proposal, onView, onReparse, expanded = false }) => {
  const [isExpanded, setIsExpanded] = useState(expanded)
  const vendor = proposal.vendorId

  const formatCurrency = (amount, currency = 'USD') => {
    if (!amount && amount !== 0) return 'Not specified'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (date) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100'
    if (score >= 60) return 'text-amber-600 bg-amber-100'
    return 'text-red-600 bg-red-100'
  }

  const ScoreCircle = ({ score, label }) => (
    <div className="flex flex-col items-center">
      <div className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold ${getScoreColor(score)}`}>
        {score || '-'}
      </div>
      <span className="text-xs text-dark-500 mt-1">{label}</span>
    </div>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg shadow-dark-900/5 overflow-hidden border border-dark-100/50"
    >
      {/* Header */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-lg">
              {vendor?.name?.charAt(0)?.toUpperCase() || 'V'}
            </div>
            <div>
              <h3 className="font-display font-semibold text-dark-800">
                {vendor?.name || 'Unknown Vendor'}
              </h3>
              <div className="flex items-center gap-1 text-sm text-dark-500">
                <Building2 className="w-3.5 h-3.5" />
                <span>{vendor?.company || 'Company'}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
              proposal.status === 'evaluated' ? 'bg-green-100 text-green-700' :
              proposal.status === 'parsed' ? 'bg-blue-100 text-blue-700' :
              'bg-amber-100 text-amber-700'
            }`}>
              {proposal.status || 'Received'}
            </span>
            {proposal.parsingConfidence && (
              <span className="text-xs text-dark-500">
                {proposal.parsingConfidence}% confident
              </span>
            )}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="p-3 bg-dark-50 rounded-xl">
            <div className="flex items-center gap-2 text-dark-500 text-xs mb-1">
              <DollarSign className="w-3.5 h-3.5" />
              Total Price
            </div>
            <p className="font-semibold text-dark-800">
              {formatCurrency(proposal.parsedData?.pricing?.totalPrice)}
            </p>
          </div>
          
          <div className="p-3 bg-dark-50 rounded-xl">
            <div className="flex items-center gap-2 text-dark-500 text-xs mb-1">
              <Calendar className="w-3.5 h-3.5" />
              Delivery
            </div>
            <p className="font-semibold text-dark-800">
              {proposal.parsedData?.deliveryDays 
                ? `${proposal.parsedData.deliveryDays} days` 
                : proposal.parsedData?.deliveryTerms || 'Not specified'}
            </p>
          </div>
          
          <div className="p-3 bg-dark-50 rounded-xl">
            <div className="flex items-center gap-2 text-dark-500 text-xs mb-1">
              <Shield className="w-3.5 h-3.5" />
              Warranty
            </div>
            <p className="font-semibold text-dark-800">
              {proposal.parsedData?.warranty?.duration || 'Not specified'}
            </p>
          </div>
          
          <div className="p-3 bg-dark-50 rounded-xl">
            <div className="flex items-center gap-2 text-dark-500 text-xs mb-1">
              <Clock className="w-3.5 h-3.5" />
              Received
            </div>
            <p className="font-semibold text-dark-800">
              {formatDate(proposal.receivedAt)}
            </p>
          </div>
        </div>

        {/* Scores */}
        {proposal.scores && (
          <div className="flex items-center justify-around py-4 border-y border-dark-100">
            <ScoreCircle score={proposal.scores.overall} label="Overall" />
            <ScoreCircle score={proposal.scores.price} label="Price" />
            <ScoreCircle score={proposal.scores.compliance} label="Compliance" />
            <ScoreCircle score={proposal.scores.delivery} label="Delivery" />
            <ScoreCircle score={proposal.scores.warranty} label="Warranty" />
          </div>
        )}

        {/* Expand Toggle */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-center gap-2 py-3 text-sm text-dark-500 hover:text-primary-600 transition-colors"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-4 h-4" />
              Show Less
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              Show Details
            </>
          )}
        </button>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="px-6 pb-6 space-y-4 border-t border-dark-100 pt-4"
        >
          {/* Line Items */}
          {proposal.parsedData?.pricing?.lineItems?.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-dark-700 mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Price Breakdown
              </h4>
              <div className="overflow-hidden rounded-xl border border-dark-100">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-dark-50">
                      <th className="px-4 py-2 text-left text-dark-600 font-medium">Item</th>
                      <th className="px-4 py-2 text-right text-dark-600 font-medium">Qty</th>
                      <th className="px-4 py-2 text-right text-dark-600 font-medium">Unit Price</th>
                      <th className="px-4 py-2 text-right text-dark-600 font-medium">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {proposal.parsedData.pricing.lineItems.map((item, index) => (
                      <tr key={index} className="border-t border-dark-100">
                        <td className="px-4 py-2 text-dark-800">{item.item}</td>
                        <td className="px-4 py-2 text-right text-dark-600">{item.quantity}</td>
                        <td className="px-4 py-2 text-right text-dark-600">
                          {formatCurrency(item.unitPrice)}
                        </td>
                        <td className="px-4 py-2 text-right font-medium text-dark-800">
                          {formatCurrency(item.total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* AI Analysis */}
          {proposal.aiAnalysis && (
            <div className="space-y-3">
              {proposal.aiAnalysis.summary && (
                <div className="p-4 bg-primary-50 rounded-xl">
                  <h4 className="text-sm font-semibold text-primary-700 mb-1">AI Summary</h4>
                  <p className="text-sm text-primary-900">{proposal.aiAnalysis.summary}</p>
                </div>
              )}

              {proposal.aiAnalysis.strengths?.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-green-700 mb-2 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    Strengths
                  </h4>
                  <ul className="space-y-1">
                    {proposal.aiAnalysis.strengths.map((strength, i) => (
                      <li key={i} className="text-sm text-dark-600 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {proposal.aiAnalysis.weaknesses?.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-amber-700 mb-2 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    Areas of Concern
                  </h4>
                  <ul className="space-y-1">
                    {proposal.aiAnalysis.weaknesses.map((weakness, i) => (
                      <li key={i} className="text-sm text-dark-600 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                        {weakness}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Original Email */}
          {proposal.rawEmail?.body && (
            <div>
              <h4 className="text-sm font-semibold text-dark-700 mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Original Email
              </h4>
              <div className="p-4 bg-dark-50 rounded-xl max-h-48 overflow-y-auto">
                <p className="text-xs text-dark-500 mb-2">
                  Subject: {proposal.rawEmail.subject}
                </p>
                <p className="text-sm text-dark-600 whitespace-pre-wrap">
                  {proposal.rawEmail.body}
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={() => onView?.(proposal._id)}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-dark-600 hover:bg-dark-50 font-medium transition-colors text-sm"
            >
              <Eye className="w-4 h-4" />
              Full Details
            </button>
            <button
              onClick={() => onReparse?.(proposal._id)}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-primary-600 hover:bg-primary-50 font-medium transition-colors text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              Re-parse with AI
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default ProposalCard