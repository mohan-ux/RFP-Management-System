import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, Users, Check, Building2, Mail, X } from 'lucide-react'

const VendorSelector = ({ 
  vendors = [], 
  selectedVendors = [], 
  onSelectionChange,
  maxSelection = Infinity 
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')

  const categories = ['all', 'IT Equipment', 'Office Supplies', 'Furniture', 'Services', 'Other']

  const filteredVendors = useMemo(() => {
    return vendors.filter(vendor => {
      const matchesSearch = 
        vendor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.email?.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesCategory = categoryFilter === 'all' || vendor.category === categoryFilter
      
      return matchesSearch && matchesCategory
    })
  }, [vendors, searchTerm, categoryFilter])

  const toggleVendor = (vendor) => {
    const isSelected = selectedVendors.some(v => v._id === vendor._id)
    
    if (isSelected) {
      onSelectionChange(selectedVendors.filter(v => v._id !== vendor._id))
    } else if (selectedVendors.length < maxSelection) {
      onSelectionChange([...selectedVendors, vendor])
    }
  }

  const selectAll = () => {
    const toSelect = filteredVendors.slice(0, maxSelection)
    onSelectionChange(toSelect)
  }

  const clearAll = () => {
    onSelectionChange([])
  }

  return (
    <div className="space-y-5">
      {/* Header with Selected Count */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="avatar">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              Select Vendors
            </h3>
            <p className="text-gray-500">
              <span className="badge-primary mr-2">{selectedVendors.length}</span>
              of {vendors.length} selected
              {maxSelection !== Infinity && ` (max ${maxSelection})`}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={selectAll}
            className="text-sm text-purple-600 hover:text-purple-700 font-semibold transition-colors"
          >
            Select All
          </button>
          <span className="text-gray-300">|</span>
          <button
            onClick={clearAll}
            className="text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search vendors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input pl-12"
          />
        </div>
        
        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="form-input pl-12 w-full sm:w-52 appearance-none"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Selected Vendors Pills */}
      <AnimatePresence>
        {selectedVendors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap gap-2 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl border border-purple-100"
          >
            {selectedVendors.map(vendor => (
              <motion.span
                key={vendor._id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm text-sm font-semibold text-gray-700 border border-purple-200"
              >
                {vendor.name}
                <button
                  onClick={() => toggleVendor(vendor)}
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400 hover:text-red-500" />
                </button>
              </motion.span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Vendor List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto pr-2">
        {filteredVendors.length === 0 ? (
          <div className="col-span-2 py-10 text-center text-gray-500 bg-gray-50 rounded-2xl">
            <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="font-medium">No vendors found matching your criteria</p>
          </div>
        ) : (
          filteredVendors.map((vendor) => {
            const isSelected = selectedVendors.some(v => v._id === vendor._id)
            const isDisabled = !isSelected && selectedVendors.length >= maxSelection

            return (
              <motion.div
                key={vendor._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => !isDisabled && toggleVendor(vendor)}
                className={`vendor-card ${isSelected ? 'selected' : ''} ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center gap-4">
                  {/* Checkbox */}
                  <div className={`
                    w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0
                    transition-all duration-200
                    ${isSelected 
                      ? 'border-purple-500 bg-purple-500' 
                      : 'border-gray-300'
                    }
                  `}>
                    {isSelected && <Check className="w-4 h-4 text-white" />}
                  </div>

                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-lg">
                    {vendor.name?.charAt(0)?.toUpperCase()}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{vendor.name}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Building2 className="w-4 h-4" />
                      <span className="truncate">{vendor.company}</span>
                    </div>
                  </div>

                  {/* Category Badge */}
                  <span className="hidden sm:inline-flex badge-info flex-shrink-0">
                    {vendor.category}
                  </span>
                </div>
              </motion.div>
            )
          })
        )}
      </div>

      {/* Footer Summary */}
      <div className="flex items-center justify-between pt-5 border-t border-gray-200">
        <p className="text-sm text-gray-500">
          Showing <span className="font-semibold text-gray-700">{filteredVendors.length}</span> vendor(s)
        </p>
        
        {selectedVendors.length > 0 && (
          <p className="text-sm font-semibold text-purple-600">
            ✓ {selectedVendors.length} vendor(s) will receive this RFP
          </p>
        )}
      </div>
    </div>
  )
}

export default VendorSelector