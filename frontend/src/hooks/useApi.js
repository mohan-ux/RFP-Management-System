import { useState, useEffect, useCallback, useRef } from 'react';
import api from '../services/api';

/**
 * Custom hook for making API calls with loading, error, and data states
 * @param {string} endpoint - API endpoint
 * @param {object} options - Options for the API call
 * @returns {object} API state and methods
 */
const useApi = (endpoint, options = {}) => {
  const {
    method = 'GET',
    body = null,
    immediate = true,
    onSuccess = null,
    onError = null,
    transform = null
  } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  
  const mountedRef = useRef(true);
  const abortControllerRef = useRef(null);

  // Execute the API call
  const execute = useCallback(async (executeOptions = {}) => {
    const {
      endpoint: execEndpoint = endpoint,
      method: execMethod = method,
      body: execBody = body,
      params = null
    } = executeOptions;

    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    setLoading(true);
    setError(null);
    setStatus('loading');

    try {
      let response;
      const config = { signal: abortControllerRef.current.signal };

      switch (execMethod.toUpperCase()) {
        case 'GET':
          response = await api.get(execEndpoint, { ...config, params });
          break;
        case 'POST':
          response = await api.post(execEndpoint, execBody, config);
          break;
        case 'PUT':
          response = await api.put(execEndpoint, execBody, config);
          break;
        case 'PATCH':
          response = await api.patch(execEndpoint, execBody, config);
          break;
        case 'DELETE':
          response = await api.delete(execEndpoint, config);
          break;
        default:
          response = await api.get(execEndpoint, config);
      }

      if (mountedRef.current) {
        const responseData = transform ? transform(response.data) : response.data;
        setData(responseData);
        setStatus('success');
        
        if (onSuccess) {
          onSuccess(responseData);
        }
        
        return responseData;
      }
    } catch (err) {
      if (err.name === 'AbortError' || err.name === 'CanceledError') {
        return; // Request was cancelled, don't update state
      }

      if (mountedRef.current) {
        const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
        setError(errorMessage);
        setStatus('error');
        
        if (onError) {
          onError(err);
        }
        
        throw err;
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [endpoint, method, body, transform, onSuccess, onError]);

  // Reset state
  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
    setStatus('idle');
  }, []);

  // Set data manually
  const setDataManually = useCallback((newData) => {
    setData(newData);
    setStatus('success');
  }, []);

  // Execute on mount if immediate is true
  useEffect(() => {
    if (immediate && endpoint) {
      execute();
    }

    return () => {
      mountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []); // Only run on mount

  return {
    data,
    loading,
    error,
    status,
    execute,
    reset,
    setData: setDataManually,
    isIdle: status === 'idle',
    isLoading: status === 'loading',
    isSuccess: status === 'success',
    isError: status === 'error'
  };
};

/**
 * Hook for paginated API calls
 * @param {string} endpoint - API endpoint
 * @param {object} options - Options for the API call
 * @returns {object} Paginated API state and methods
 */
export const usePaginatedApi = (endpoint, options = {}) => {
  const {
    pageSize = 10,
    initialPage = 1,
    ...apiOptions
  } = options;

  const [page, setPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(true);
  const [allData, setAllData] = useState([]);

  const { data, loading, error, execute, reset: apiReset } = useApi(endpoint, {
    ...apiOptions,
    immediate: false,
    onSuccess: (response) => {
      const items = response.items || response.data || response;
      const total = response.total || response.totalCount;
      
      setAllData(prev => page === 1 ? items : [...prev, ...items]);
      setHasMore(total ? allData.length + items.length < total : items.length === pageSize);
      
      if (apiOptions.onSuccess) {
        apiOptions.onSuccess(response);
      }
    }
  });

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
      execute({ params: { page: page + 1, pageSize } });
    }
  }, [loading, hasMore, page, pageSize, execute]);

  const refresh = useCallback(() => {
    setPage(1);
    setAllData([]);
    setHasMore(true);
    execute({ params: { page: 1, pageSize } });
  }, [pageSize, execute]);

  const reset = useCallback(() => {
    setPage(initialPage);
    setAllData([]);
    setHasMore(true);
    apiReset();
  }, [initialPage, apiReset]);

  useEffect(() => {
    if (endpoint) {
      execute({ params: { page: initialPage, pageSize } });
    }
  }, [endpoint]);

  return {
    data: allData,
    loading,
    error,
    page,
    hasMore,
    loadMore,
    refresh,
    reset
  };
};

/**
 * Hook for mutation operations (POST, PUT, DELETE)
 * @param {string} endpoint - API endpoint
 * @param {string} method - HTTP method
 * @param {object} options - Options for the API call
 * @returns {object} Mutation state and methods
 */
export const useMutation = (endpoint, method = 'POST', options = {}) => {
  return useApi(endpoint, {
    ...options,
    method,
    immediate: false
  });
};

/**
 * Hook for GET requests with caching
 * @param {string} endpoint - API endpoint
 * @param {object} options - Options for the API call
 * @returns {object} Query state and methods
 */
export const useQuery = (endpoint, options = {}) => {
  return useApi(endpoint, {
    ...options,
    method: 'GET',
    immediate: true
  });
};

export default useApi;