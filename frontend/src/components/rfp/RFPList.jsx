import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, SortAsc, Grid, List, FileText } from 'lucide-react'
import RFPCard from './RFPCard'
import { SkeletonCard } from '../common/LoadingSpinner'

const RFPList = ({ rfps = [], loading = false, onSend, onDelete }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [viewMode, setViewMode] = useState('grid')
  const [sortBy, setSortBy] = useState('newest')

  const statuses = [
    { value: 'all', label: 'All Status' },
    { value: 'draft', label: 'Draft' },
    { value: 'sent', label: 'Sent' },
    { value: 'evaluating', label: 'Evaluating' },
    { value: 'awarded', label: 'Awarded' },
    { value: 'closed', label: 'Closed' }
  ]

  // Filter and sort RFPs
  const filteredRfps = rfps
    .filter(rfp => {
      const matchesSearch = rfp.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           rfp.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           rfp.rfpNumber?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = filterStatus === 'all' || rfp.status === filterStatus
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt) - new Date(a.createdAt)
      } else if (sortBy === 'oldest') {
        return new Date(a.createdAt) - new Date(b.createdAt)
      } else if (sortBy === 'budget-high') {
        return (b.budget?.amount || 0) - (a.budget?.amount || 0)
      } else if (sortBy === 'budget-low') {
        return (a.budget?.amount || 0) - (b.budget?.amount || 0)
      }
      return 0
    })

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
            <input
              type="text"
              placeholder="Search RFPs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10 w-full sm:w-64"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="select pl-10 w-full sm:w-40"
            >
              {statuses.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="relative">
            <SortAsc className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="select pl-10 w-full sm:w-40"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="budget-high">Budget: High to Low</option>
              <option value="budget-low">Budget: Low to High</option>
            </select>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-dark-100 rounded-xl p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid' ? 'bg-white shadow text-primary-600' : 'text-dark-500 hover:text-dark-700'
            }`}
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'list' ? 'bg-white shadow text-primary-600' : 'text-dark-500 hover:text-dark-700'
            }`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-dark-500">
        Showing {filteredRfps.length} of {rfps.length} RFPs
      </div>

      {/* RFP Grid/List */}
      {filteredRfps.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <div className="w-20 h-20 rounded-full bg-dark-100 flex items-center justify-center mb-4">
            <FileText className="w-10 h-10 text-dark-400" />
          </div>
          <h3 className="text-xl font-display font-semibold text-dark-700 mb-2">
            No RFPs Found
          </h3>
          <p className="text-dark-500 max-w-sm">
            {searchQuery || filterStatus !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : 'Create your first RFP to get started'}
          </p>
        </motion.div>
      ) : (
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
          : 'space-y-4'
        }>
          {filteredRfps.map((rfp, index) => (
            <motion.div
              key={rfp._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <RFPCard rfp={rfp} onSend={onSend} onDelete={onDelete} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default RFPList