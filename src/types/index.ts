// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  limit: number;
  offset: number;
}

// ServiceNow Catalog Types
export interface ServiceNowCatalogItem {
  sys_id: string;
  name: string;
  short_description: string;
  description: string;
  category: string;
  subcategory?: string;
  availability: 'available' | 'unavailable';
  picture?: string;
  price: number;
  order: number;
  active: boolean;
  fields: FormField[];
  variables: any[];
  rating: number;
  reviews_count: number;
  sys_created_on?: string;
  sys_updated_on?: string;
}

// ServiceNow Knowledge Types
export interface ServiceNowKnowledgeArticle {
  sys_id: string;
  number?: string;
  title: string;
  short_description: string;
  description?: string;
  content?: string;
  category: string;
  subcategory?: string;
  author: {
    sys_id: string;
    name: string;
  };
  published_date: string;
  updated_date?: string;
  view_count: number;
  helpful_count: number;
  tags?: string[];
  sys_created_on?: string;
  sys_updated_on?: string;
}

// ServiceNow Request Types
export interface ServiceNowRequest {
  sys_id: string;
  number: string;
  short_description: string;
  description: string;
  status?: string;
  state?: string;
  priority: string;
  category: string;
  subcategory?: string;
  assigned_to?: {
    sys_id: string;
    name: string;
    email: string;
  };
  requested_by: {
    sys_id: string;
    name: string;
    email: string;
  };
  requested_date?: string;
  due_date?: string;
  closed_date?: string;
  comments?: Array<{
    sys_id: string;
    comment: string;
    user: {
      sys_id: string;
      name: string;
    };
    date: string;
  }>;
  attachments?: any[];
  variables?: any;
  sys_created_on?: string;
  sys_updated_on?: string;
}

// ServiceNow Request Item Types
export interface ServiceNowRequestItem {
  sys_id: string;
  number: string;
  request: string;
  cat_item: string;
  short_description: string;
  description: string;
  requested_for: string;
  quantity: number;
  table: string;
  created_at?: string;
}

// ServiceNow Request Creation Response Types
export interface ServiceNowRequestCreationResponse {
  sys_id: string;
  number: string;
  table: string;
  created_at?: string;
  record_type?: string;
  req_item?: ServiceNowRequestItem;
}

// Form Types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'password' | 'email' | 'url' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date' | 'datetime' | 'file' | 'reference' | 'string' | 'choice' | 'boolean' | 'glide_date';
  mandatory: boolean;
  required?: boolean;
  placeholder?: string;
  helpText?: string;
  choices?: Array<{
    value: string;
    label: string;
  }>;
  options?: Array<{
    value: string;
    label: string;
  }>;
  accept?: string;
  multiple?: boolean;
  max_length?: number;
  reference?: string;
  validation?: {
    type: 'required' | 'email' | 'min' | 'max' | 'pattern';
    value?: string | number;
    message: string;
  };
  show_when?: {
    field: string;
    value: any;
  };
  showWhen?: {
    field: string;
    value: any;
  };
}

export interface FormData {
  [key: string]: any;
}

// Filter Types
export interface SearchFilters {
  search: string;
  category: string | 'all' | undefined;
  availability: 'all' | 'available' | 'unavailable';
  priceRange?: {
    min: number;
    max: number;
  } | undefined;
  rating?: number | undefined;
}

export interface RequestFilters {
  status: string | 'all' | undefined;
  priority: string | 'all' | undefined;
  category: string | 'all' | undefined;
  dateRange?: {
    start: string;
    end: string;
  } | undefined;
  search: string;
}

// UI State Types
export interface UIState {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  loading: boolean;
  error: string | null;
  success: string | null;
}

// Catalog State Types
export interface CatalogState {
  items: ServiceNowCatalogItem[];
  categories: string[];
  loading: boolean;
  error: string | null;
  filters: SearchFilters;
}

// Requests State Types
export interface RequestsState {
  requests: ServiceNowRequest[];
  loading: boolean;
  error: string | null;
  filters: RequestFilters;
}