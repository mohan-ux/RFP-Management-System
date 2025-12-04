import { motion } from 'framer-motion'
import { 
  Sparkles, 
  Trophy, 
  ThumbsUp, 
  AlertTriangle, 
  TrendingUp,
  CheckCircle2,
  XCircle,
  Info,
  ArrowRight,
  Zap
} from 'lucide-react'

const AIRecommendation = ({ comparison, rfp, proposals }) => {
  if (!comparison) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-lg shadow-dark-900/5 text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary-100 flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-8 h-8 text-primary-500" />
        </div>
        <h3 className="text-lg font-display font-semibold text-dark-800 mb-2">
          AI Analysis Pending
        </h3>
        <p className="text-dark-500">
          Click "Compare Proposals" to get AI-powered recommendations
        </p>
      </div>
    )
  }

  const { recommendation, vendorScores, comparisonSummary } = comparison
  const winner = proposals?.find(p => p.vendorId?._id === recommendation?.selectedVendorId)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Winner Card */}
      {recommendation && (
        <div className="relative overflow-hidden bg-gradient-to-br from-primary-500 via-primary-600 to-accent-500 rounded-2xl p-6 text-white">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white" />
            <div className="absolute -left-10 -bottom-10 w-32 h-32 rounded-full bg-white" />
          </div>
          
          <div className="relative">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-white/20 rounded-xl">
                  <Trophy className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-white/80 text-sm">AI Recommendation</span>
                  <h3 className="text-xl font-display font-bold">
                    {recommendation.selectedVendorName}
                  </h3>
                </div>
              </div>
              
              <div className="flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full">
                <Zap className="w-4 h-4" />
                <span className="text-sm font-medium">Best Match</span>
              </div>
            </div>

            <p className="text-white/90 mb-4 leading-relaxed">
              {recommendation.reasoning}
            </p>

            {recommendation.alternativeConsiderations && (
              <div className="p-4 bg-white/10 rounded-xl">
                <div className="flex items-center gap-2 text-white/80 text-sm mb-1">
                  <Info className="w-4 h-4" />
                  Alternative Consideration
                </div>
                <p className="text-white/90 text-sm">
                  {recommendation.alternativeConsiderations}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Summary Card */}
      {comparisonSummary && (
        <div className="bg-white rounded-2xl p-6 shadow-lg shadow-dark-900/5">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-primary-500" />
            <h3 className="font-display font-semibold text-dark-800">Executive Summary</h3>
          </div>
          <p className="text-dark-600 leading-relaxed">
            {comparisonSummary}
          </p>
        </div>
      )}

      {/* Vendor Analysis Cards */}
      {vendorScores && vendorScores.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-display font-semibold text-dark-800 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary-500" />
            Detailed Vendor Analysis
          </h3>
          
          <div className="grid gap-4">
            {vendorScores.map((vendorScore, index) => {
              const isWinner = vendorScore.vendorId === recommendation?.selectedVendorId
              
              return (
                <motion.div
                  key={vendorScore.vendorId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-white rounded-xl p-5 border-2 transition-all ${
                    isWinner ? 'border-primary-500 shadow-lg shadow-primary-500/10' : 'border-dark-100'
                  }`}
                >
                  {/* Vendor Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold ${
                        isWinner 
                          ? 'bg-gradient-to-br from-primary-500 to-accent-500' 
                          : 'bg-dark-300'
                      }`}>
                        {vendorScore.vendorName?.charAt(0) || 'V'}
                      </div>
                      <div>
                        <h4 className="font-semibold text-dark-800 flex items-center gap-2">
                          {vendorScore.vendorName}
                          {isWinner && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary-100 text-primary-700 rounded-full text-xs font-bold">
                              <Trophy className="w-3 h-3" />
                              Recommended
                            </span>
                          )}
                        </h4>
                      </div>
                    </div>
                    
                    <div className={`text-2xl font-bold ${
                      vendorScore.scores.overall >= 80 ? 'text-green-600' :
                      vendorScore.scores.overall >= 60 ? 'text-amber-600' :
                      'text-red-600'
                    }`}>
                      {vendorScore.scores.overall}/100
                    </div>
                  </div>

                  {/* Score Breakdown */}
                  <div className="grid grid-cols-4 gap-3 mb-4">
                    {['price', 'compliance', 'delivery', 'warranty'].map(key => (
                      <div key={key} className="text-center p-2 bg-dark-50 rounded-lg">
                        <div className="text-xs text-dark-500 capitalize mb-1">{key}</div>
                        <div className={`font-semibold ${
                          vendorScore.scores[key] >= 80 ? 'text-green-600' :
                          vendorScore.scores[key] >= 60 ? 'text-amber-600' :
                          'text-red-600'
                        }`}>
                          {vendorScore.scores[key]}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Strengths & Weaknesses */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {vendorScore.strengths?.length > 0 && (
                      <div>
                        <h5 className="text-sm font-medium text-green-700 flex items-center gap-1 mb-2">
                          <CheckCircle2 className="w-4 h-4" />
                          Strengths
                        </h5>
                        <ul className="space-y-1">
                          {vendorScore.strengths.slice(0, 3).map((strength, i) => (
                            <li key={i} className="text-sm text-dark-600 flex items-start gap-2">
                              <ThumbsUp className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" />
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {vendorScore.weaknesses?.length > 0 && (
                      <div>
                        <h5 className="text-sm font-medium text-amber-700 flex items-center gap-1 mb-2">
                          <AlertTriangle className="w-4 h-4" />
                          Considerations
                        </h5>
                        <ul className="space-y-1">
                          {vendorScore.weaknesses.slice(0, 3).map((weakness, i) => (
                            <li key={i} className="text-sm text-dark-600 flex items-start gap-2">
                              <XCircle className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
                              {weakness}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Risks */}
                  {vendorScore.risks?.length > 0 && (
                    <div className="mt-4 p-3 bg-red-50 rounded-lg">
                      <h5 className="text-sm font-medium text-red-700 flex items-center gap-1 mb-1">
                        <AlertTriangle className="w-4 h-4" />
                        Risk Factors
                      </h5>
                      <ul className="text-sm text-red-600 space-y-1">
                        {vendorScore.risks.map((risk, i) => (
                          <li key={i}>{risk}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>
      )}

      {/* Action Button */}
      {recommendation && (
        <div className="flex justify-center pt-4">
          <button className="btn-success inline-flex items-center gap-2">
            Award to {recommendation.selectedVendorName}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </motion.div>
  )
}

export default AIRecommendation