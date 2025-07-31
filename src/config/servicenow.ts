import type { ServiceNowConfig } from '../services/realApiService';

// ServiceNow API Configuration
// Update these values with your actual ServiceNow instance details
export const serviceNowConfig: ServiceNowConfig = {
  // Your ServiceNow instance URL (e.g., https://yourcompany.service-now.com)
  baseUrl: process.env.REACT_APP_SERVICENOW_BASE_URL || 'https://yourcompany.service-now.com',
  
  // Authentication credentials
  username: process.env.REACT_APP_SERVICENOW_USERNAME || 'your-username',
  password: process.env.REACT_APP_SERVICENOW_PASSWORD || 'your-password',
  
  // OAuth credentials (if using OAuth instead of Basic Auth)
  clientId: process.env.REACT_APP_SERVICENOW_CLIENT_ID || '',
  clientSecret: process.env.REACT_APP_SERVICENOW_CLIENT_SECRET || '',
  
  // Set to true if using OAuth, false for Basic Auth
  useOAuth: process.env.REACT_APP_SERVICENOW_USE_OAUTH === 'true' || false,
};

// API Endpoints configuration
export const serviceNowEndpoints = {
  // Catalog Items
  catalogItems: '/api/servicenow/api/sn_sc/servicecatalog/items',
  catalogItemDetails: (id: string) => `/api/servicenow/api/sn_sc/servicecatalog/items/${id}`,
  catalogItemForm: (id: string) => `/api/servicenow/api/sn_sc/servicecatalog/items/${id}`,
  submitCatalogRequest: (id: string) => `/api/servicenow/api/sn_sc/servicecatalog/items/${id}/order`,
  
  // Knowledge Base
  knowledgeArticles: '/api/sn_kmd/knowledge',
  knowledgeArticleDetails: (id: string) => `/api/sn_kmd/knowledge/${id}`,
  
  // User Requests
  userRequests: '/api/sn_sc/order_guide',
  requestDetails: (id: string) => `/api/sn_sc/order_guide/${id}`,
  
  // Reference Data
  referenceData: (tableName: string) => `/api/now/table/${tableName}`,
  
  // OAuth
  oauthToken: '/oauth_token.do',
};

// Common query parameters
export const serviceNowQueryParams = {
  // Pagination
  limit: (value: number) => `sysparm_limit=${value}`,
  offset: (value: number) => `sysparm_offset=${value}`,
  
  // Search
  search: (field: string, value: string) => `sysparm_query=${field}LIKE${value}`,
  exactMatch: (field: string, value: string) => `sysparm_query=${field}=${value}`,
  
  // Fields to return
  fields: (fields: string[]) => `sysparm_fields=${fields.join(',')}`,
  
  // Display values
  displayValue: (value: boolean = true) => `sysparm_display_value=${value}`,
  
  // Exclude reference link
  excludeReferenceLink: (value: boolean = true) => `sysparm_exclude_reference_link=${value}`,
};

// Common field mappings for different ServiceNow tables
export const serviceNowFieldMappings = {
  // Catalog Items table
  catalogItems: {
    sys_id: 'sys_id',
    name: 'name',
    short_description: 'short_description',
    description: 'description',
    category: 'category',
    subcategory: 'subcategory',
    active: 'active',
    picture: 'picture',
    price: 'price',
    order: 'order',
  },
  
  // Knowledge Articles table
  knowledgeArticles: {
    sys_id: 'sys_id',
    title: 'title',
    short_description: 'short_description',
    description: 'description',
    category: 'category',
    subcategory: 'subcategory',
    author: 'author',
    published: 'published',
    view_count: 'view_count',
    helpful_count: 'helpful_count',
  },
  
  // Requests table
  requests: {
    sys_id: 'sys_id',
    number: 'number',
    short_description: 'short_description',
    description: 'description',
    state: 'state',
    priority: 'priority',
    category: 'category',
    subcategory: 'subcategory',
    assigned_to: 'assigned_to',
    requested_by: 'requested_by',
  },
};

// Environment configuration helper
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';

// Logging configuration
export const loggingConfig = {
  enabled: isDevelopment || process.env.REACT_APP_ENABLE_LOGGING === 'true',
  level: process.env.REACT_APP_LOG_LEVEL || 'info',
};