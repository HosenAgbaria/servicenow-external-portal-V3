import { create } from 'zustand';
import type { ServiceNowCatalogItem, SearchFilters, PaginatedResponse } from '../types';

interface CatalogState {
  items: ServiceNowCatalogItem[];
  categories: string[];
  loading: boolean;
  error: string | null;
  filters: SearchFilters;
  pagination: {
    page: number;
    limit: number;
    count: number;
    hasMore: boolean;
  };
  
  // Actions
  setItems: (items: ServiceNowCatalogItem[]) => void;
  setCategories: (categories: string[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFilters: (filters: Partial<SearchFilters>) => void;
  setPagination: (pagination: Partial<PaginatedResponse<ServiceNowCatalogItem>>) => void;
  resetFilters: () => void;
  searchItems: (query: string) => void;
  filterByCategory: (category: string) => void;
  filterByPriceRange: (min: number, max: number) => void;
  filterByAvailability: (availability: 'all' | 'available' | 'unavailable') => void;
  filterByRating: (rating: number) => void;
}

const initialState = {
  items: [],
  categories: [],
  loading: false,
  error: null,
  filters: {
    category: undefined,
    priceRange: undefined,
    availability: 'all' as const,
    rating: undefined,
    search: '',
  },
  pagination: {
    page: 1,
    limit: 10,
    count: 0,
    hasMore: false,
  },
};

export const useCatalogStore = create<CatalogState>((set) => ({
  ...initialState,

  setItems: (items) => set({ items }),
  setCategories: (categories) => set({ categories }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  
  setFilters: (filters) => set((state) => ({
    filters: { ...state.filters, ...filters },
    pagination: { ...state.pagination, page: 1 }, // Reset to first page when filters change
  })),
  
  setPagination: (pagination) => set((state) => ({
    pagination: { ...state.pagination, ...pagination },
  })),
  
  resetFilters: () => set((state) => ({
    filters: {
      category: undefined,
      priceRange: undefined,
      availability: 'all' as const,
      rating: undefined,
      search: '',
    },
    pagination: { ...state.pagination, page: 1 },
  })),
  
  searchItems: (query) => set((state) => ({
    filters: { ...state.filters, search: query },
    pagination: { ...state.pagination, page: 1 },
  })),
  
  filterByCategory: (category) => set((state) => ({
    filters: { ...state.filters, category },
    pagination: { ...state.pagination, page: 1 },
  })),
  
  filterByPriceRange: (min, max) => set((state) => ({
    filters: { ...state.filters, priceRange: { min, max } },
    pagination: { ...state.pagination, page: 1 },
  })),
  
  filterByAvailability: (availability) => set((state) => ({
    filters: { ...state.filters, availability },
    pagination: { ...state.pagination, page: 1 },
  })),
  
  filterByRating: (rating) => set((state) => ({
    filters: { ...state.filters, rating },
    pagination: { ...state.pagination, page: 1 },
  })),
}));