import React from 'react'

// Score Bar Component
const ScoreBar = ({ score, maxScore = 100, color = 'purple' }) => {
  const percentage = Math.min((score / maxScore) * 100, 100)
  const colorClasses = {
    purple: 'bg-purple-500',
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    yellow: 'bg-yellow-500'
  }
  
  return (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div 
        className={`h-2 rounded-full transition-all duration-500 ${colorClasses[color] || colorClasses.purple}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  )
}

// Helper to format price - handles numbers, strings, and invalid values
const formatPrice = (price) => {
  if (!price) return null
  const num = typeof price === 'string' ? parseFloat(price.replace(/[^0-9.-]/g, '')) : Number(price)
  if (isNaN(num) || num <= 0) return null
  return `$${num.toLocaleString()}`
}

// Helper to format delivery - extract days number or return clean string
const formatDelivery = (delivery) => {
  if (!delivery) return null
  // If it's just a number, add "days"
  const num = parseInt(delivery)
  if (!isNaN(num) && num > 0 && num < 365) return `${num} days`
  // If it contains "not applicable" or similar, return null
  const lowerDelivery = String(delivery).toLowerCase()
  if (lowerDelivery.includes('not applicable') || lowerDelivery.includes('n/a')) return null
  // Return cleaned string if it's reasonable length
  if (String(delivery).length < 30) return String(delivery)
  return null
}

// Helper to format warranty
const formatWarranty = (warranty) => {
  if (!warranty) return null
  const lowerWarranty = String(warranty).toLowerCase()
  if (lowerWarranty.includes('not addressed') || lowerWarranty.includes('n/a') || lowerWarranty.includes('not applicable')) return null
  if (String(warranty).length < 50) return String(warranty)
  return null
}

// Vendor Quote Card
const VendorQuoteCard = ({ vendor, isWinner = false, rank = 0 }) => {
  const score = vendor.score || 75
  
  // Format values with helpers
  const priceDisplay = formatPrice(vendor.quote?.price) || formatPrice(vendor.price)
  const deliveryDisplay = formatDelivery(vendor.quote?.delivery) || formatDelivery(vendor.delivery)
  const warrantyDisplay = formatWarranty(vendor.quote?.warranty) || formatWarranty(vendor.warranty)
  const termsDisplay = vendor.quote?.terms || vendor.terms
  
  return (
    <div className={`relative p-5 border-2 rounded-2xl bg-white transition-all ${
      isWinner 
        ? 'border-green-400 shadow-lg shadow-green-100' 
        : 'border-gray-200 hover:border-purple-200'
    }`}>
      {/* Winner Badge */}
      {isWinner && (
        <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-white text-lg">👑</span>
        </div>
      )}
      
      {/* Rank Badge */}
      {rank > 0 && (
        <div className={`absolute -top-2 -left-2 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
          rank === 1 ? 'bg-yellow-400 text-yellow-900' :
          rank === 2 ? 'bg-gray-300 text-gray-700' :
          rank === 3 ? 'bg-orange-300 text-orange-800' :
          'bg-gray-100 text-gray-600'
        }`}>
          #{rank}
        </div>
      )}

      {/* Vendor Info */}
      <div className="mb-4">
        <h4 className="font-bold text-lg text-gray-900">{vendor.name || vendor.company || 'Unknown Vendor'}</h4>
        <p className="text-sm text-gray-500">{vendor.company || vendor.email || ''}</p>
      </div>

      {/* Score */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-gray-600">Score</span>
          <span className="text-lg font-bold text-purple-600">{score}/100</span>
        </div>
        <ScoreBar score={score} color={isWinner ? 'green' : 'purple'} />
      </div>

      {/* Quote Details - Only show fields that have valid values */}
      <div className="space-y-3">
        <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
          <span className="text-sm text-gray-600 flex items-center gap-2">
            <span>💰</span> Price
          </span>
          <span className="font-bold text-gray-900">
            {priceDisplay || <span className="text-gray-400">Not quoted</span>}
          </span>
        </div>
        
        <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
          <span className="text-sm text-gray-600 flex items-center gap-2">
            <span>🚚</span> Delivery
          </span>
          <span className="font-semibold text-gray-800">
            {deliveryDisplay || <span className="text-gray-400">Not specified</span>}
          </span>
        </div>
        
        <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
          <span className="text-sm text-gray-600 flex items-center gap-2">
            <span>🛡️</span> Warranty
          </span>
          <span className="font-semibold text-gray-800">
            {warrantyDisplay || <span className="text-gray-400">Not specified</span>}
          </span>
        </div>

        {termsDisplay && termsDisplay !== 'Standard' && (
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600 flex items-center gap-2">
              <span>📋</span> Terms
            </span>
            <span className="font-semibold text-gray-800 text-xs">
              {termsDisplay}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

// AI Recommendation Box
const AIRecommendationBox = ({ recommendation, comparison }) => {
  if (!recommendation && !comparison) return null
  
  const bestVendor = recommendation?.best_vendor || comparison?.best_vendor || recommendation
  const reasons = recommendation?.reasons || comparison?.reasons || []
  const summary = recommendation?.summary || comparison?.summary || ''

  return (
    <div className="mt-6 p-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl border border-purple-200">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
          <span className="text-2xl">🤖</span>
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-lg text-gray-900 mb-2">AI Recommendation</h4>
          
          {bestVendor && (
            <div className="mb-3 p-3 bg-white rounded-xl border border-green-200">
              <div className="flex items-center gap-2">
                <span className="text-green-600 font-bold">🏆 Best Choice:</span>
                <span className="font-semibold text-gray-900">
                  {typeof bestVendor === 'object' ? bestVendor.name || bestVendor.company : bestVendor}
                </span>
              </div>
            </div>
          )}

          {summary && (
            <p className="text-gray-700 mb-3">{summary}</p>
          )}

          {reasons && reasons.length > 0 && (
            <div className="space-y-2">
              <p className="font-medium text-gray-800">Key Factors:</p>
              <ul className="space-y-1">
                {(Array.isArray(reasons) ? reasons : [reasons]).map((reason, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>{typeof reason === 'object' ? reason.text || JSON.stringify(reason) : reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const ComparisonPreview = ({ data = [], comparison = null, recommendation = null }) => {
  if (!data || data.length === 0) {
    return (
      <div className="p-8 bg-gray-50 rounded-2xl border border-gray-200 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-gray-500">No vendor quotes available yet</p>
        <p className="text-sm text-gray-400 mt-1">Vendor responses will appear here once received</p>
      </div>
    )
  }

  // Get comparison_table from comparison result (this has the parsed vendor data)
  const comparisonTable = comparison?.comparison_table || []
  
  // Transform mail_content data to vendor format, merging with comparison data
  const transformedData = data.map((item, index) => {
    // Get vendor info from mail_content
    const vendorInfo = item.vendor_id || {}
    const vendorName = vendorInfo.name || vendorInfo.company || `Vendor ${index + 1}`
    
    // Find matching comparison data by vendor name or index
    const compData = comparisonTable.find(ct => 
      ct.vendor_name?.toLowerCase() === vendorName.toLowerCase() ||
      ct.vendor_name?.toLowerCase().includes(vendorName.toLowerCase()) ||
      vendorName.toLowerCase().includes(ct.vendor_name?.toLowerCase() || '')
    ) || comparisonTable[index] || {}
    
    return {
      _id: item._id || index,
      name: compData.vendor_name || vendorName,
      company: vendorInfo.company || vendorInfo.name || '',
      email: vendorInfo.email || '',
      score: compData.score || 75,
      quote: {
        price: compData.price || null,
        delivery: compData.delivery_time || compData.delivery || null,
        warranty: compData.warranty || null,
        terms: compData.payment_terms || compData.terms || 'Standard'
      },
      pros: compData.pros || [],
      cons: compData.cons || [],
      mail_subject: item.mail_subject,
      mail_body: item.mail_body
    }
  })

  // Sort by score (highest first) and determine winner
  const sortedData = [...transformedData].sort((a, b) => {
    const scoreA = Number(a.score || 0)
    const scoreB = Number(b.score || 0)
    return scoreB - scoreA
  })
  
  // Calculate lowest price from comparison data
  const prices = sortedData.map(v => v.quote?.price).filter(p => p && !isNaN(p))
  const lowestPrice = prices.length > 0 ? Math.min(...prices) : null

  return (
    <div className="space-y-6">
      {/* Comparison Header */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-xl">
        <div>
          <h4 className="font-bold text-gray-900">Vendor Comparison</h4>
          <p className="text-sm text-gray-600">{transformedData.length} vendor{transformedData.length !== 1 ? 's' : ''} compared</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Lowest Price</p>
          <p className="text-xl font-bold text-green-600">
            {lowestPrice ? `$${Number(lowestPrice).toLocaleString()}` : 'N/A'}
          </p>
        </div>
      </div>

      {/* Vendor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedData.map((vendor, i) => {
          const isWinner = i === 0
          return (
            <VendorQuoteCard 
              key={vendor._id || i} 
              vendor={vendor} 
              isWinner={isWinner}
              rank={i + 1}
            />
          )
        })}
      </div>

      {/* AI Recommendation */}
      <AIRecommendationBox recommendation={recommendation} comparison={comparison} />

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-blue-50 rounded-xl text-center">
          <p className="text-2xl font-bold text-blue-600">{transformedData.length}</p>
          <p className="text-sm text-blue-700">Total Vendors</p>
        </div>
        <div className="p-4 bg-green-50 rounded-xl text-center">
          <p className="text-2xl font-bold text-green-600">
            {formatPrice(lowestPrice) || 'N/A'}
          </p>
          <p className="text-sm text-green-700">Best Price</p>
        </div>
        <div className="p-4 bg-purple-50 rounded-xl text-center">
          <p className="text-2xl font-bold text-purple-600">
            {(() => {
              const deliveries = sortedData
                .map(v => parseInt(v.quote?.delivery))
                .filter(d => !isNaN(d) && d > 0 && d < 365)
              if (deliveries.length === 0) return 'N/A'
              return `${Math.min(...deliveries)} days`
            })()}
          </p>
          <p className="text-sm text-purple-700">Fastest Delivery</p>
        </div>
        <div className="p-4 bg-orange-50 rounded-xl text-center">
          <p className="text-2xl font-bold text-orange-600">
            {Math.round(sortedData.reduce((acc, v) => acc + (v.score || 75), 0) / sortedData.length)}
          </p>
          <p className="text-sm text-orange-700">Avg Score</p>
        </div>
      </div>
    </div>
  )
}

export default ComparisonPreview
