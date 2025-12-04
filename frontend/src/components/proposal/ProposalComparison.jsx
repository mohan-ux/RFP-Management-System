import { motion } from 'framer-motion'
import { 
  DollarSign, 
  Calendar, 
  Shield, 
  TrendingUp,
  CheckCircle2,
  XCircle,
  Trophy,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react'

const ProposalComparison = ({ proposals = [], rfp }) => {
  if (!proposals.length) {
    return (
      <div className="text-center py-12 text-dark-500">
        No proposals to compare
      </div>
    )
  }

  const formatCurrency = (amount, currency = 'USD') => {
    if (!amount && amount !== 0) return '-'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100'
    if (score >= 60) return 'text-amber-600 bg-amber-100'
    return 'text-red-600 bg-red-100'
  }

  const getBestValue = (proposals, key) => {
    const values = proposals.map(p => {
      if (key === 'price') return p.parsedData?.pricing?.totalPrice
      if (key === 'delivery') return p.parsedData?.deliveryDays
      if (key === 'overall') return p.scores?.overall
      return null
    }).filter(v => v !== null && v !== undefined)
    
    if (key === 'price' || key === 'delivery') {
      return Math.min(...values)
    }
    return Math.max(...values)
  }

  const lowestPrice = getBestValue(proposals, 'price')
  const fastestDelivery = getBestValue(proposals, 'delivery')
  const highestScore = getBestValue(proposals, 'overall')

  const criteria = [
    { 
      key: 'totalPrice', 
      label: 'Total Price',
      icon: DollarSign,
      getValue: (p) => p.parsedData?.pricing?.totalPrice,
      format: (v) => formatCurrency(v),
      isBest: (v) => v === lowestPrice,
      lowerIsBetter: true
    },
    { 
      key: 'delivery', 
      label: 'Delivery Time',
      icon: Calendar,
      getValue: (p) => p.parsedData?.deliveryDays,
      format: (v) => v ? `${v} days` : '-',
      isBest: (v) => v === fastestDelivery,
      lowerIsBetter: true
    },
    { 
      key: 'warranty', 
      label: 'Warranty',
      icon: Shield,
      getValue: (p) => p.parsedData?.warranty?.duration,
      format: (v) => v || '-',
      isBest: () => false
    },
    { 
      key: 'payment', 
      label: 'Payment Terms',
      getValue: (p) => p.parsedData?.paymentTerms,
      format: (v) => v || '-',
      isBest: () => false
    }
  ]

  const scores = [
    { key: 'overall', label: 'Overall', isBest: (p) => p.scores?.overall === highestScore },
    { key: 'price', label: 'Price Score' },
    { key: 'compliance', label: 'Compliance' },
    { key: 'delivery', label: 'Delivery' },
    { key: 'warranty', label: 'Warranty' }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Comparison Table */}
      <div className="bg-white rounded-2xl shadow-lg shadow-dark-900/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-primary-500 to-accent-500">
                <th className="px-6 py-4 text-left text-white font-semibold sticky left-0 bg-gradient-to-r from-primary-500 to-primary-600">
                  Criteria
                </th>
                {proposals.map((proposal, index) => {
                  const vendor = proposal.vendorId
                  const isWinner = proposal.scores?.overall === highestScore
                  
                  return (
                    <th key={proposal._id} className="px-6 py-4 text-center min-w-[200px]">
                      <div className="flex flex-col items-center gap-2">
                        {isWinner && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-400 text-yellow-900 rounded-full text-xs font-bold">
                            <Trophy className="w-3 h-3" />
                            Best
                          </span>
                        )}
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">
                          {vendor?.name?.charAt(0) || 'V'}
                        </div>
                        <span className="text-white font-semibold">{vendor?.name}</span>
                        <span className="text-white/80 text-sm">{vendor?.company}</span>
                      </div>
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {/* Key Metrics */}
              {criteria.map((criterion, rowIndex) => {
                const Icon = criterion.icon
                return (
                  <tr key={criterion.key} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-dark-50/50'}>
                    <td className={`px-6 py-4 font-medium text-dark-700 sticky left-0 ${rowIndex % 2 === 0 ? 'bg-white' : 'bg-dark-50'}`}>
                      <div className="flex items-center gap-2">
                        {Icon && <Icon className="w-4 h-4 text-dark-400" />}
                        {criterion.label}
                      </div>
                    </td>
                    {proposals.map((proposal) => {
                      const value = criterion.getValue(proposal)
                      const isBest = criterion.isBest(value)
                      
                      return (
                        <td key={proposal._id} className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center gap-1 ${isBest ? 'text-green-600 font-semibold' : 'text-dark-700'}`}>
                            {criterion.format(value)}
                            {isBest && <CheckCircle2 className="w-4 h-4" />}
                          </span>
                        </td>
                      )
                    })}
                  </tr>
                )
              })}

              {/* Divider */}
              <tr>
                <td colSpan={proposals.length + 1} className="px-6 py-2 bg-dark-100">
                  <span className="text-xs font-semibold text-dark-500 uppercase tracking-wider">
                    Scores (0-100)
                  </span>
                </td>
              </tr>

              {/* Scores */}
              {scores.map((score, rowIndex) => (
                <tr key={score.key} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-dark-50/50'}>
                  <td className={`px-6 py-4 font-medium text-dark-700 sticky left-0 ${rowIndex % 2 === 0 ? 'bg-white' : 'bg-dark-50'}`}>
                    {score.label}
                  </td>
                  {proposals.map((proposal) => {
                    const scoreValue = proposal.scores?.[score.key]
                    const isBest = score.isBest?.(proposal)
                    
                    return (
                      <td key={proposal._id} className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center justify-center w-12 h-12 rounded-full text-sm font-bold ${getScoreColor(scoreValue)} ${isBest ? 'ring-2 ring-green-400 ring-offset-2' : ''}`}>
                          {scoreValue || '-'}
                        </span>
                      </td>
                    )
                  })}
                </tr>
              ))}

              {/* Budget Comparison */}
              {rfp?.budget?.amount && (
                <tr className="bg-primary-50">
                  <td className="px-6 py-4 font-medium text-primary-700 sticky left-0 bg-primary-50">
                    vs Budget ({formatCurrency(rfp.budget.amount)})
                  </td>
                  {proposals.map((proposal) => {
                    const price = proposal.parsedData?.pricing?.totalPrice
                    if (!price) return <td key={proposal._id} className="px-6 py-4 text-center text-dark-400">-</td>
                    
                    const diff = price - rfp.budget.amount
                    const percentage = ((diff / rfp.budget.amount) * 100).toFixed(1)
                    const isUnder = diff < 0
                    
                    return (
                      <td key={proposal._id} className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center gap-1 font-medium ${isUnder ? 'text-green-600' : 'text-red-600'}`}>
                          {isUnder ? <ArrowDown className="w-4 h-4" /> : <ArrowUp className="w-4 h-4" />}
                          {Math.abs(percentage)}%
                          <span className="text-xs text-dark-500">
                            ({formatCurrency(Math.abs(diff))})
                          </span>
                        </span>
                      </td>
                    )
                  })}
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 rounded-xl p-4 border border-green-100">
          <div className="flex items-center gap-2 text-green-700 mb-2">
            <DollarSign className="w-5 h-5" />
            <span className="font-semibold">Lowest Price</span>
          </div>
          <p className="text-2xl font-bold text-green-800">
            {formatCurrency(lowestPrice)}
          </p>
          <p className="text-sm text-green-600 mt-1">
            {proposals.find(p => p.parsedData?.pricing?.totalPrice === lowestPrice)?.vendorId?.name}
          </p>
        </div>
        
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
          <div className="flex items-center gap-2 text-blue-700 mb-2">
            <Calendar className="w-5 h-5" />
            <span className="font-semibold">Fastest Delivery</span>
          </div>
          <p className="text-2xl font-bold text-blue-800">
            {fastestDelivery ? `${fastestDelivery} days` : '-'}
          </p>
          <p className="text-sm text-blue-600 mt-1">
            {proposals.find(p => p.parsedData?.deliveryDays === fastestDelivery)?.vendorId?.name}
          </p>
        </div>
        
        <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
          <div className="flex items-center gap-2 text-purple-700 mb-2">
            <TrendingUp className="w-5 h-5" />
            <span className="font-semibold">Highest Score</span>
          </div>
          <p className="text-2xl font-bold text-purple-800">
            {highestScore || '-'}/100
          </p>
          <p className="text-sm text-purple-600 mt-1">
            {proposals.find(p => p.scores?.overall === highestScore)?.vendorId?.name}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export default ProposalComparison