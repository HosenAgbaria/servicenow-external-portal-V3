import { create } from 'zustand';
import type { ServiceNowRequest, RequestFilters, PaginatedResponse } from '../types';

interface RequestsState {
  requests: ServiceNowRequest[];
  loading: boolean;
  error: string | null;
  filters: RequestFilters;
  pagination: {
    page: number;
    limit: number;
    count: number;
    hasMore: boolean;
  };
  selectedRequest: ServiceNowRequest | null;
  
  // Actions
  setRequests: (requests: ServiceNowRequest[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFilters: (filters: Partial<RequestFilters>) => void;
  setPagination: (pagination: Partial<PaginatedResponse<ServiceNowRequest>>) => void;
  setSelectedRequest: (request: ServiceNowRequest | null) => void;
  resetFilters: () => void;
  searchRequests: (query: string) => void;
  filterByStatus: (status: string) => void;
  filterByCategory: (category: string) => void;
  filterByDateRange: (start: string, end: string) => void;
  addRequest: (request: ServiceNowRequest) => void;
  updateRequest: (sysId: string, updates: Partial<ServiceNowRequest>) => void;
  deleteRequest: (sysId: string) => void;
}

const initialState = {
  requests: [],
  loading: false,
  error: null,
  filters: {
    status: undefined,
    priority: undefined,
    category: undefined,
    dateRange: undefined,
    search: '',
  },
  pagination: {
    page: 1,
    limit: 10,
    count: 0,
    hasMore: false,
  },
  selectedRequest: null,
};

export const useRequestsStore = create<RequestsState>((set) => ({
  ...initialState,

  setRequests: (requests) => set({ requests }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setSelectedRequest: (request) => set({ selectedRequest: request }),
  
  setFilters: (filters) => set((state) => ({
    filters: { ...state.filters, ...filters },
    pagination: { ...state.pagination, page: 1 },
  })),
  
  setPagination: (pagination) => set((state) => ({
    pagination: { ...state.pagination, ...pagination },
  })),
  
  resetFilters: () => set((state) => ({
    filters: {
      status: undefined,
      priority: undefined,
      category: undefined,
      dateRange: undefined,
      search: '',
    },
    pagination: { ...state.pagination, page: 1 },
  })),
  
  searchRequests: (query) => set((state) => ({
    filters: { ...state.filters, search: query },
    pagination: { ...state.pagination, page: 1 },
  })),
  
  filterByStatus: (status) => set((state) => ({
    filters: { ...state.filters, status },
    pagination: { ...state.pagination, page: 1 },
  })),
  
  filterByCategory: (category) => set((state) => ({
    filters: { ...state.filters, category },
    pagination: { ...state.pagination, page: 1 },
  })),
  
  filterByDateRange: (start, end) => set((state) => ({
    filters: { ...state.filters, dateRange: { start, end } },
    pagination: { ...state.pagination, page: 1 },
  })),
  
  addRequest: (request) => set((state) => ({
    requests: [request, ...state.requests],
  })),
  
  updateRequest: (sysId, updates) => set((state) => ({
    requests: state.requests.map((req) =>
      req.sys_id === sysId ? { ...req, ...updates } : req
    ),
    selectedRequest: state.selectedRequest?.sys_id === sysId
      ? { ...state.selectedRequest, ...updates }
      : state.selectedRequest,
  })),
  
  deleteRequest: (sysId) => set((state) => ({
    requests: state.requests.filter((req) => req.sys_id !== sysId),
    selectedRequest: state.selectedRequest?.sys_id === sysId
      ? null
      : state.selectedRequest,
  })),
}));