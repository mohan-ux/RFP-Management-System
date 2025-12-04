import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Building2, 
  Mail, 
  Phone, 
  User, 
  MapPin, 
  Tag, 
  FileText,
  Save,
  X
} from 'lucide-react'
import Button from '../common/Button'

const categories = [
  'IT Equipment',
  'Office Supplies', 
  'Furniture',
  'Services',
  'Other'
]

const VendorForm = ({ initialData, onSubmit, onCancel, loading = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    category: 'Other',
    contactPerson: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      country: '',
      zipCode: ''
    },
    notes: ''
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        email: initialData.email || '',
        company: initialData.company || '',
        category: initialData.category || 'Other',
        contactPerson: initialData.contactPerson || '',
        phone: initialData.phone || '',
        address: {
          street: initialData.address?.street || '',
          city: initialData.address?.city || '',
          state: initialData.address?.state || '',
          country: initialData.address?.country || '',
          zipCode: initialData.address?.zipCode || ''
        },
        notes: initialData.notes || ''
      })
    }
  }, [initialData])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }))
    }
  }

  const handleAddressChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      address: { ...prev.address, [name]: value }
    }))
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Vendor name is required'
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }
    if (!formData.company.trim()) newErrors.company = 'Company name is required'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validate()) {
      onSubmit(formData)
    }
  }

  const InputField = ({ 
    label, 
    name, 
    type = 'text', 
    icon: Icon, 
    placeholder,
    required = false,
    error,
    value,
    onChange,
    ...props 
  }) => (
    <div>
      <label className="block text-sm font-medium text-dark-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`input ${Icon ? 'pl-10' : ''} ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : ''}`}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  )

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* Basic Information */}
      <div>
        <h3 className="text-lg font-display font-semibold text-dark-800 mb-4 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-primary-500" />
          Basic Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Vendor Name"
            name="name"
            icon={Building2}
            placeholder="Enter vendor name"
            required
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
          />
          <InputField
            label="Company"
            name="company"
            icon={Building2}
            placeholder="Enter company name"
            required
            value={formData.company}
            onChange={handleChange}
            error={errors.company}
          />
          <InputField
            label="Email"
            name="email"
            type="email"
            icon={Mail}
            placeholder="vendor@company.com"
            required
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
          />
          <InputField
            label="Phone"
            name="phone"
            type="tel"
            icon={Phone}
            placeholder="+1 (555) 000-0000"
            value={formData.phone}
            onChange={handleChange}
          />
          <InputField
            label="Contact Person"
            name="contactPerson"
            icon={User}
            placeholder="Primary contact name"
            value={formData.contactPerson}
            onChange={handleChange}
          />
          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1.5">
              Category
            </label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="select pl-10"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Address */}
      <div>
        <h3 className="text-lg font-display font-semibold text-dark-800 mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary-500" />
          Address
        </h3>
        <div className="space-y-4">
          <InputField
            label="Street Address"
            name="street"
            icon={MapPin}
            placeholder="123 Business Street"
            value={formData.address.street}
            onChange={handleAddressChange}
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <InputField
              label="City"
              name="city"
              placeholder="City"
              value={formData.address.city}
              onChange={handleAddressChange}
            />
            <InputField
              label="State/Province"
              name="state"
              placeholder="State"
              value={formData.address.state}
              onChange={handleAddressChange}
            />
            <InputField
              label="Country"
              name="country"
              placeholder="Country"
              value={formData.address.country}
              onChange={handleAddressChange}
            />
            <InputField
              label="Zip Code"
              name="zipCode"
              placeholder="12345"
              value={formData.address.zipCode}
              onChange={handleAddressChange}
            />
          </div>
        </div>
      </div>

      {/* Notes */}
      <div>
        <h3 className="text-lg font-display font-semibold text-dark-800 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary-500" />
          Additional Notes
        </h3>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Any additional notes about this vendor..."
          rows={4}
          className="textarea"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-dark-100">
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            icon={X}
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          loading={loading}
          icon={Save}
        >
          {initialData ? 'Update Vendor' : 'Add Vendor'}
        </Button>
      </div>
    </motion.form>
  )
}

export default VendorForm