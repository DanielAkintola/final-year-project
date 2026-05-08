import { useState, useCallback, useEffect } from 'react';
import { FilterOptions, PaginatedResponse } from '../types';

/**
 * Hook for loading and managing paginated lists
 * Provides data, loading state, error handling, and pagination controls
 */
export function usePaginatedList<T>(
  fetchFn: (page: number, limit: number) => Promise<PaginatedResponse<T>>,
  initialLimit: number = 20
) {
  const [data, setData] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(initialLimit);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async (pageNum: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchFn(pageNum, limit);
      setData(response.data);
      setTotal(response.total);
      setPage(pageNum);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  }, [fetchFn, limit]);

  useEffect(() => {
    fetch(1);
  }, [fetch]);

  return {
    data,
    total,
    page,
    limit,
    hasMore: page * limit < total,
    isLoading,
    error,
    goToPage: fetch,
    nextPage: () => fetch(page + 1),
    prevPage: () => fetch(Math.max(1, page - 1)),
    refetch: () => fetch(page),
  };
}

/**
 * Hook for managing filtered data with search
 */
export function useFilteredList<T>(
  fetchFn: (filters: FilterOptions) => Promise<T[]>,
  initialFilters?: Partial<FilterOptions>
) {
  const [data, setData] = useState<T[]>([]);
  const [filters, setFilters] = useState<FilterOptions>(initialFilters || {});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const applyFilters = useCallback(
    async (newFilters: Partial<FilterOptions>) => {
      const combined = { ...filters, ...newFilters };
      setFilters(combined);
      setIsLoading(true);
      setError(null);
      try {
        const result = await fetchFn(combined);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setIsLoading(false);
      }
    },
    [fetchFn, filters]
  );

  const search = useCallback(
    (searchTerm: string) => applyFilters({ search: searchTerm, page: 1 }),
    [applyFilters]
  );

  const sort = useCallback(
    (sortBy: string, sortOrder: 'asc' | 'desc') =>
      applyFilters({ sortBy, sortOrder }),
    [applyFilters]
  );

  const reset = useCallback(() => {
    setFilters({});
    applyFilters({});
  }, [applyFilters]);

  useEffect(() => {
    applyFilters({});
  }, []);

  return {
    data,
    filters,
    isLoading,
    error,
    applyFilters,
    search,
    sort,
    reset,
  };
}

/**
 * Hook for managing form state with validation
 */
export function useForm<T extends Record<string, unknown>>(
  initialValues: T,
  onSubmit: (values: T) => Promise<void>
) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;
      setValues((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
      }));
    },
    []
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name } = e.target;
      setTouched((prev) => ({ ...prev, [name]: true }));
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      try {
        await onSubmit(values);
        setValues(initialValues);
        setErrors({});
        setTouched({});
      } catch (err) {
        setErrors({
          submit: err instanceof Error ? err.message : 'Submission failed',
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, onSubmit, initialValues]
  );

  const setFieldError = useCallback((field: string, error: string) => {
    setErrors((prev) => ({ ...prev, [field]: error }));
  }, []);

  const setFieldValue = useCallback((field: string, value: unknown) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  }, []);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldError,
    setFieldValue,
    reset,
  };
}

/**
 * Hook for managing async operations with loading/error states
 */
export function useAsync<T, E = string>(
  asyncFn: () => Promise<T>,
  immediate = true
) {
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<E | null>(null);

  const execute = useCallback(async () => {
    setStatus('pending');
    setData(null);
    setError(null);
    try {
      const response = await asyncFn();
      setData(response);
      setStatus('success');
      return response;
    } catch (err) {
      setError(err as E);
      setStatus('error');
      throw err;
    }
  }, [asyncFn]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { status, data, error, execute };
}
