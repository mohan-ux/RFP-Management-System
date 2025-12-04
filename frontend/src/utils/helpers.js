/**
 * Format a date string to a human-readable format
 * @param {string|Date} dateString - The date to format
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString, options = {}) => {
  if (!dateString) return 'N/A';
  
  const defaultOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  };
  
  try {
    return new Date(dateString).toLocaleDateString('en-US', { ...defaultOptions, ...options });
  } catch {
    return 'Invalid Date';
  }
};

/**
 * Format a date string to relative time (e.g., "2 hours ago")
 * @param {string|Date} dateString - The date to format
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (dateString) => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  
  if (seconds < 60) return 'Just now';
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (weeks < 4) return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  if (months < 12) return `${months} month${months > 1 ? 's' : ''} ago`;
  
  return formatDate(dateString);
};

/**
 * Format currency amount
 * @param {number} amount - The amount to format
 * @param {string} currency - Currency code (default: USD)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = 'USD') => {
  if (amount === null || amount === undefined) return 'N/A';
  
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  } catch {
    return `${currency} ${amount}`;
  }
};

/**
 * Format a number with commas
 * @param {number} num - The number to format
 * @returns {string} Formatted number string
 */
export const formatNumber = (num) => {
  if (num === null || num === undefined) return '0';
  return new Intl.NumberFormat('en-US').format(num);
};

/**
 * Validate email address
 * @param {string} email - Email address to validate
 * @returns {boolean} Whether the email is valid
 */
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

/**
 * Validate phone number
 * @param {string} phone - Phone number to validate
 * @returns {boolean} Whether the phone is valid
 */
export const validatePhone = (phone) => {
  const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  return re.test(String(phone));
};

/**
 * Capitalize first letter of a string
 * @param {string} string - String to capitalize
 * @returns {string} Capitalized string
 */
export const capitalizeFirstLetter = (string) => {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
};

/**
 * Convert string to title case
 * @param {string} string - String to convert
 * @returns {string} Title case string
 */
export const toTitleCase = (string) => {
  if (!string) return '';
  return string
    .toLowerCase()
    .split(' ')
    .map(word => capitalizeFirstLetter(word))
    .join(' ');
};

/**
 * Generate a random ID
 * @param {number} length - Length of the ID (default: 9)
 * @returns {string} Random ID
 */
export const generateRandomId = (length = 9) => {
  return '_' + Math.random().toString(36).substring(2, 2 + length);
};

/**
 * Generate a UUID v4
 * @returns {string} UUID
 */
export const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

/**
 * Truncate text to a specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length (default: 100)
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

/**
 * Get status color classes based on status
 * @param {string} status - Status string
 * @returns {string} Tailwind CSS classes
 */
export const getStatusColor = (status) => {
  const statusColors = {
    draft: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    sent: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'in-progress': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    submitted: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    accepted: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    completed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    inactive: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
  };
  
  return statusColors[status?.toLowerCase()] || statusColors.draft;
};

/**
 * Get status icon name based on status
 * @param {string} status - Status string
 * @returns {string} Icon name
 */
export const getStatusIcon = (status) => {
  const statusIcons = {
    draft: 'FileText',
    pending: 'Clock',
    sent: 'Send',
    'in-progress': 'Clock',
    submitted: 'FileCheck',
    active: 'CheckCircle',
    accepted: 'CheckCircle',
    completed: 'CheckCircle2',
    rejected: 'XCircle',
    cancelled: 'XCircle',
    inactive: 'MinusCircle'
  };
  
  return statusIcons[status?.toLowerCase()] || 'FileText';
};

/**
 * Calculate days until a deadline
 * @param {string|Date} deadline - Deadline date
 * @returns {number} Days until deadline (negative if passed)
 */
export const daysUntilDeadline = (deadline) => {
  if (!deadline) return null;
  
  const deadlineDate = new Date(deadline);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  deadlineDate.setHours(0, 0, 0, 0);
  
  const diff = deadlineDate - today;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

/**
 * Get deadline status (urgent, warning, normal, overdue)
 * @param {string|Date} deadline - Deadline date
 * @returns {object} Status object with type and label
 */
export const getDeadlineStatus = (deadline) => {
  const days = daysUntilDeadline(deadline);
  
  if (days === null) return { type: 'normal', label: 'No deadline' };
  if (days < 0) return { type: 'overdue', label: `${Math.abs(days)} days overdue` };
  if (days === 0) return { type: 'urgent', label: 'Due today' };
  if (days === 1) return { type: 'urgent', label: 'Due tomorrow' };
  if (days <= 3) return { type: 'warning', label: `${days} days left` };
  if (days <= 7) return { type: 'normal', label: `${days} days left` };
  return { type: 'normal', label: formatDate(deadline) };
};

/**
 * Debounce a function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle a function
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export const throttle = (func, limit = 300) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Deep clone an object
 * @param {object} obj - Object to clone
 * @returns {object} Cloned object
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Check if an object is empty
 * @param {object} obj - Object to check
 * @returns {boolean} Whether the object is empty
 */
export const isEmptyObject = (obj) => {
  return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
};

/**
 * Get initials from a name
 * @param {string} name - Full name
 * @returns {string} Initials (max 2 characters)
 */
export const getInitials = (name) => {
  if (!name) return '?';
  
  const words = name.trim().split(' ');
  if (words.length === 1) return words[0].charAt(0).toUpperCase();
  
  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
};

/**
 * Sort array of objects by a key
 * @param {Array} array - Array to sort
 * @param {string} key - Key to sort by
 * @param {string} order - Sort order ('asc' or 'desc')
 * @returns {Array} Sorted array
 */
export const sortBy = (array, key, order = 'asc') => {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
};

/**
 * Filter array by search term across multiple keys
 * @param {Array} array - Array to filter
 * @param {string} searchTerm - Search term
 * @param {Array} keys - Keys to search in
 * @returns {Array} Filtered array
 */
export const filterBySearch = (array, searchTerm, keys) => {
  if (!searchTerm) return array;
  
  const lowercasedTerm = searchTerm.toLowerCase();
  
  return array.filter(item => 
    keys.some(key => {
      const value = item[key];
      if (typeof value === 'string') {
        return value.toLowerCase().includes(lowercasedTerm);
      }
      return false;
    })
  );
};

/**
 * Calculate percentage
 * @param {number} value - Current value
 * @param {number} total - Total value
 * @returns {number} Percentage (0-100)
 */
export const calculatePercentage = (value, total) => {
  if (!total || total === 0) return 0;
  return Math.round((value / total) * 100);
};

/**
 * Get color for score/rating
 * @param {number} score - Score value (0-100)
 * @returns {string} Tailwind CSS color class
 */
export const getScoreColor = (score) => {
  if (score >= 90) return 'text-green-600';
  if (score >= 75) return 'text-emerald-600';
  if (score >= 60) return 'text-amber-600';
  if (score >= 40) return 'text-orange-600';
  return 'text-red-600';
};

/**
 * Get background color for score/rating
 * @param {number} score - Score value (0-100)
 * @returns {string} Tailwind CSS background color class
 */
export const getScoreBgColor = (score) => {
  if (score >= 90) return 'bg-green-500';
  if (score >= 75) return 'bg-emerald-500';
  if (score >= 60) return 'bg-amber-500';
  if (score >= 40) return 'bg-orange-500';
  return 'bg-red-500';
};

export default {
  formatDate,
  formatRelativeTime,
  formatCurrency,
  formatNumber,
  validateEmail,
  validatePhone,
  capitalizeFirstLetter,
  toTitleCase,
  generateRandomId,
  generateUUID,
  truncateText,
  getStatusColor,
  getStatusIcon,
  daysUntilDeadline,
  getDeadlineStatus,
  debounce,
  throttle,
  deepClone,
  isEmptyObject,
  getInitials,
  sortBy,
  filterBySearch,
  calculatePercentage,
  getScoreColor,
  getScoreBgColor
};