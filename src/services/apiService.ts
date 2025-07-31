import type { 
  ServiceNowCatalogItem, 
  ServiceNowKnowledgeArticle, 
  ServiceNowRequest,
  ServiceNowRequestCreationResponse,
  ApiResponse,
  PaginatedResponse,
  FormField,
  FormData
} from '../types';

// Import the real API service
import { getRealApiService, initializeRealApiService } from './realApiService';
import type { ServiceNowConfig } from './realApiService';

// Service type enum
export enum ApiServiceType {
  MOCK = 'mock',
  REAL = 'real'
}

// Global service type setting - automatically detect environment
let currentServiceType: ApiServiceType = detectServiceType();

// Function to detect which service type to use
function detectServiceType(): ApiServiceType {
  // Check if we're in GitHub Pages environment
  const isGitHubPages = window.location.hostname.includes('github.io');
  
  // Check if required environment variables are missing
  const hasRequiredEnvVars = import.meta.env.VITE_SERVICENOW_BASE_URL && 
                            import.meta.env.VITE_SERVICENOW_USERNAME && 
                            import.meta.env.VITE_SERVICENOW_PASSWORD;
  
  // Use MOCK if in GitHub Pages or missing required env vars
  if (isGitHubPages || !hasRequiredEnvVars) {
    console.log('🔄 Auto-detected environment: Using MOCK service');
    return ApiServiceType.MOCK;
  }
  
  console.log('🔄 Auto-detected environment: Using REAL service');
  return ApiServiceType.REAL;
}

// Mock data (existing implementation)
const mockCatalogItems: ServiceNowCatalogItem[] = [
  {
    sys_id: '1',
    name: 'Software Installation Request',
    short_description: 'Request installation of new software on your workstation',
    description: 'Submit a request to install new software applications on your workstation. This service includes software licensing, installation, and basic configuration.',
    category: 'Software',
    subcategory: 'Installation',
    availability: 'available',
    picture: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400',
    price: 0,
    order: 1,
    active: true,
    fields: [],
    variables: [],
    rating: 4.5,
    reviews_count: 10,
    sys_created_on: '2024-01-15T10:00:00Z',
    sys_updated_on: '2024-01-15T10:00:00Z',
  },
  {
    sys_id: '2',
    name: 'Hardware Replacement',
    short_description: 'Request replacement of faulty hardware components',
    description: 'Submit a request to replace faulty hardware components such as monitors, keyboards, mice, or other peripherals.',
    category: 'Hardware',
    subcategory: 'Replacement',
    availability: 'available',
    picture: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400',
    price: 0,
    order: 2,
    active: true,
    fields: [],
    variables: [],
    rating: 4.2,
    reviews_count: 8,
    sys_created_on: '2024-01-15T10:00:00Z',
    sys_updated_on: '2024-01-15T10:00:00Z',
  },
  {
    sys_id: '3',
    name: 'VPN Access Request',
    short_description: 'Request VPN access for remote work',
    description: 'Submit a request to get VPN access for remote work. This includes account setup and configuration.',
    category: 'Access',
    subcategory: 'VPN',
    availability: 'available',
    picture: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400',
    price: 0,
    order: 3,
    active: true,
    fields: [],
    variables: [],
    rating: 4.7,
    reviews_count: 15,
    sys_created_on: '2024-01-15T10:00:00Z',
    sys_updated_on: '2024-01-15T10:00:00Z',
  },
  {
    sys_id: '4',
    name: 'Password Reset',
    short_description: 'Reset your account password',
    description: 'Submit a request to reset your account password. This service is available 24/7 for urgent access issues.',
    category: 'Access',
    subcategory: 'Password',
    availability: 'available',
    picture: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400',
    price: 0,
    order: 4,
    active: true,
    fields: [],
    variables: [],
    rating: 4.8,
    reviews_count: 25,
    sys_created_on: '2024-01-15T10:00:00Z',
    sys_updated_on: '2024-01-15T10:00:00Z',
  },
  {
    sys_id: '5',
    name: 'Email Account Setup',
    short_description: 'Set up new email account or configure existing one',
    description: 'Submit a request to set up a new email account or configure an existing one with proper settings.',
    category: 'Software',
    subcategory: 'Email',
    availability: 'available',
    picture: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400',
    price: 0,
    order: 5,
    active: true,
    fields: [],
    variables: [],
    rating: 4.3,
    reviews_count: 12,
    sys_created_on: '2024-01-15T10:00:00Z',
    sys_updated_on: '2024-01-15T10:00:00Z',
  },
  {
    sys_id: '6',
    name: 'Network Printer Access',
    short_description: 'Request access to network printers',
    description: 'Submit a request to get access to network printers in your office or department.',
    category: 'Hardware',
    subcategory: 'Printer',
    availability: 'unavailable',
    picture: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    price: 0,
    order: 6,
    active: false,
    fields: [],
    variables: [],
    rating: 3.9,
    reviews_count: 5,
    sys_created_on: '2024-01-15T10:00:00Z',
    sys_updated_on: '2024-01-15T10:00:00Z',
  }
];

const mockKnowledgeArticles: ServiceNowKnowledgeArticle[] = [
  {
    sys_id: 'kb1',
    title: 'How to Reset Your Password',
    short_description: 'Step-by-step guide to reset your account password',
    description: 'Complete guide on how to reset your password using the self-service portal or by contacting IT support.',
    category: 'Technical Support',
    subcategory: 'Password',
    author: {
      sys_id: 'user1',
      name: 'IT Support Team'
    },
    published_date: '2024-01-10T09:00:00Z',
    view_count: 1250,
    helpful_count: 89,
    sys_created_on: '2024-01-10T09:00:00Z',
    sys_updated_on: '2024-01-10T09:00:00Z',
  },
  {
    sys_id: 'kb2',
    title: 'VPN Connection Guide',
    short_description: 'Complete guide to connecting to the corporate VPN',
    description: 'Detailed instructions for connecting to the corporate VPN from home or remote locations.',
    category: 'Access',
    subcategory: 'VPN',
    author: {
      sys_id: 'user2',
      name: 'Network Team'
    },
    published_date: '2024-01-12T14:30:00Z',
    view_count: 890,
    helpful_count: 67,
    sys_created_on: '2024-01-12T14:30:00Z',
    sys_updated_on: '2024-01-12T14:30:00Z',
  },
  {
    sys_id: 'kb3',
    title: 'Software Installation Process',
    short_description: 'Understanding the software installation approval process',
    description: 'Learn about the approval process for software installation requests and what to expect.',
    category: 'User Guide',
    subcategory: 'Software',
    author: {
      sys_id: 'user3',
      name: 'Software Management Team'
    },
    published_date: '2024-01-08T11:15:00Z',
    view_count: 567,
    helpful_count: 34,
    sys_created_on: '2024-01-08T11:15:00Z',
    sys_updated_on: '2024-01-08T11:15:00Z',
  }
];

const mockRequests: ServiceNowRequest[] = [
  {
    sys_id: 'req1',
    number: 'REQ001',
    short_description: 'Software Installation Request - Adobe Creative Suite',
    description: 'Request for installation of Adobe Creative Suite on workstation',
    status: 'In Progress',
    priority: 'Medium',
    category: 'Software',
    subcategory: 'Installation',
    assigned_to: {
      sys_id: 'tech1',
      name: 'John Smith',
      email: 'john.smith@company.com'
    },
    requested_by: {
      sys_id: 'user1',
      name: 'Jane Doe',
      email: 'jane.doe@company.com'
    },
    sys_created_on: '2024-01-15T08:00:00Z',
    sys_updated_on: '2024-01-15T10:30:00Z',
  },
  {
    sys_id: 'req2',
    number: 'REQ002',
    short_description: 'Hardware Replacement - Monitor',
    description: 'Request for replacement of faulty monitor',
    status: 'New',
    priority: 'High',
    category: 'Hardware',
    subcategory: 'Replacement',
    assigned_to: {
      sys_id: 'tech2',
      name: 'Mike Johnson',
      email: 'mike.johnson@company.com'
    },
    requested_by: {
      sys_id: 'user2',
      name: 'Bob Wilson',
      email: 'bob.wilson@company.com'
    },
    sys_created_on: '2024-01-15T09:15:00Z',
    sys_updated_on: '2024-01-15T09:15:00Z',
  }
];

// Mock API service class
class MockApiService {
  async getCatalogItems(params: {
    search?: string;
    category?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<ApiResponse<PaginatedResponse<ServiceNowCatalogItem>>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    let filteredItems = [...mockCatalogItems];

    // Apply search filter
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      filteredItems = filteredItems.filter(item =>
        item.name.toLowerCase().includes(searchLower) ||
        item.short_description.toLowerCase().includes(searchLower)
      );
    }

    // Apply category filter
    if (params.category && params.category !== 'all') {
      filteredItems = filteredItems.filter(item => item.category === params.category);
    }

    // Apply pagination
    const offset = params.offset || 0;
    const limit = params.limit || 10;
    const paginatedItems = filteredItems.slice(offset, offset + limit);

    return {
      success: true,
      data: {
        data: paginatedItems,
        count: filteredItems.length,
        limit,
        offset,
      },
    };
  }

  async getCatalogItemDetails(itemId: string): Promise<ApiResponse<ServiceNowCatalogItem>> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const item = mockCatalogItems.find(item => item.sys_id === itemId);
    
    if (!item) {
      return {
        success: false,
        error: 'Catalog item not found',
      };
    }

    return {
      success: true,
      data: item,
    };
  }

  async getCatalogItemForm(itemId: string): Promise<ApiResponse<{ fields: FormField[] }>> {
    await new Promise(resolve => setTimeout(resolve, 400));

    // Mock form fields based on item type
    const mockFields: FormField[] = [
      {
        name: 'requested_for',
        label: 'Requested For',
        type: 'text',
        mandatory: true,
        required: true,
        placeholder: 'Enter your name',
        helpText: 'The person requesting this service',
      },
      {
        name: 'business_justification',
        label: 'Business Justification',
        type: 'textarea',
        mandatory: true,
        required: true,
        placeholder: 'Please provide a business justification for this request',
        helpText: 'Explain why this service is needed',
      },
      {
        name: 'priority',
        label: 'Priority',
        type: 'select',
        mandatory: true,
        required: true,
        options: [
          { value: 'low', label: 'Low' },
          { value: 'medium', label: 'Medium' },
          { value: 'high', label: 'High' },
          { value: 'critical', label: 'Critical' },
        ],
      },
      {
        name: 'due_date',
        label: 'Due Date',
        type: 'date',
        mandatory: false,
        required: false,
        helpText: 'When do you need this completed by?',
      },
    ];

    return {
      success: true,
      data: { fields: mockFields },
    };
  }

  async submitCatalogRequest(
    itemId: string, 
    formData: FormData
  ): Promise<ApiResponse<ServiceNowRequestCreationResponse>> {
    await new Promise(resolve => setTimeout(resolve, 800));

    // Simulate successful submission with proper structure
    const requestNumber = `REQ${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    const requestItemNumber = `RITM${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    
    return {
      success: true,
      data: {
        sys_id: `req_${Date.now()}`,
        number: requestNumber,
        table: 'sc_request',
        created_at: new Date().toISOString(),
        record_type: 'request_with_items',
        req_item: {
          sys_id: `ritm_${Date.now()}`,
          number: requestItemNumber,
          request: `req_${Date.now()}`,
          cat_item: itemId,
          short_description: 'Mock Request Item',
          description: 'This is a mock request item created for testing',
          requested_for: 'mock.user',
          quantity: 1,
          table: 'sc_req_item',
          created_at: new Date().toISOString()
        }
      },
    };
  }

  async getKnowledgeArticles(params: {
    search?: string;
    category?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<ApiResponse<PaginatedResponse<ServiceNowKnowledgeArticle>>> {
    await new Promise(resolve => setTimeout(resolve, 500));

    let filteredArticles = [...mockKnowledgeArticles];

    if (params.search) {
      const searchLower = params.search.toLowerCase();
      filteredArticles = filteredArticles.filter(article =>
        article.title.toLowerCase().includes(searchLower) ||
        article.short_description.toLowerCase().includes(searchLower)
      );
    }

    if (params.category && params.category !== 'all') {
      filteredArticles = filteredArticles.filter(article => article.category === params.category);
    }

    const offset = params.offset || 0;
    const limit = params.limit || 10;
    const paginatedArticles = filteredArticles.slice(offset, offset + limit);

    return {
      success: true,
      data: {
        data: paginatedArticles,
        count: filteredArticles.length,
        limit,
        offset,
      },
    };
  }

  async getKnowledgeArticle(sysId: string): Promise<ApiResponse<ServiceNowKnowledgeArticle>> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const article = mockKnowledgeArticles.find(art => art.sys_id === sysId);
    
    if (!article) {
      return {
        success: false,
        message: 'Knowledge article not found'
      };
    }

    return {
      success: true,
      data: article
    };
  }

  async getUserRequests(params: {
    limit?: number;
    offset?: number;
  } = {}): Promise<ApiResponse<PaginatedResponse<ServiceNowRequest>>> {
    await new Promise(resolve => setTimeout(resolve, 400));

    const offset = params.offset || 0;
    const limit = params.limit || 10;
    const paginatedRequests = mockRequests.slice(offset, offset + limit);

    return {
      success: true,
      data: {
        data: paginatedRequests,
        count: mockRequests.length,
        limit,
        offset,
      },
    };
  }

  async getReferenceData(tableName: string, query?: string): Promise<ApiResponse<any[]>> {
    await new Promise(resolve => setTimeout(resolve, 300));

    // Mock reference data
    const mockData: Record<string, any[]> = {
      'sys_user': [
        { sys_id: 'user1', name: 'John Doe', email: 'john.doe@company.com' },
        { sys_id: 'user2', name: 'Jane Smith', email: 'jane.smith@company.com' },
      ],
      'cmn_location': [
        { sys_id: 'loc1', name: 'Headquarters', address: '123 Main St' },
        { sys_id: 'loc2', name: 'Branch Office', address: '456 Oak Ave' },
      ],
    };

    return {
      success: true,
      data: mockData[tableName] || [],
    };
  }

  async getCatalogCategories(): Promise<ApiResponse<any[]>> {
    await new Promise(resolve => setTimeout(resolve, 300));

    // Mock catalog categories
    const mockCategories = [
      { sys_id: 'cat1', title: 'Software', description: 'Software related requests' },
      { sys_id: 'cat2', title: 'Hardware', description: 'Hardware related requests' },
      { sys_id: 'cat3', title: 'Access', description: 'Access and permissions requests' }
    ];

    return {
      success: true,
      data: mockCategories,
    };
  }
}

// Service switcher
export const setApiServiceType = (type: ApiServiceType): void => {
  currentServiceType = type;
  console.log(`API Service switched to: ${type}`);
};

export const getApiServiceType = (): ApiServiceType => {
  return currentServiceType;
};

// Initialize real API service
export const initializeRealServiceNowApi = (config: ServiceNowConfig): void => {
  initializeRealApiService(config);
  setApiServiceType(ApiServiceType.REAL);
};

// Main API service class that switches between mock and real
class ApiService {
  private mockService = new MockApiService();

  private getService() {
    console.log(`🔍 getService() called, currentServiceType: ${currentServiceType}`);
    
    if (currentServiceType === ApiServiceType.REAL) {
      try {
        console.log('🔄 Attempting to get real API service...');
        const realService = getRealApiService();
        console.log('✅ Real API service retrieved successfully');
        return realService;
      } catch (error) {
        console.warn('⚠️ Real API service not initialized, falling back to mock service:', error);
        return this.mockService;
      }
    }
    
    console.log('📋 Using mock service');
    return this.mockService;
  }

  // Catalog Items API
  async getCatalogItems(params: {
    search?: string;
    category?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<ApiResponse<PaginatedResponse<ServiceNowCatalogItem>>> {
    return this.getService().getCatalogItems(params);
  }

  async getCatalogItemDetails(itemId: string): Promise<ApiResponse<ServiceNowCatalogItem>> {
    return this.getService().getCatalogItemDetails(itemId);
  }

  async getCatalogItemForm(itemId: string): Promise<ApiResponse<{ fields: FormField[] }>> {
    return this.getService().getCatalogItemForm(itemId);
  }

  async submitCatalogRequest(
    itemId: string, 
    formData: FormData
  ): Promise<ApiResponse<ServiceNowRequestCreationResponse>> {
    return this.getService().submitCatalogRequest(itemId, formData);
  }

  // Knowledge Base API
  async getKnowledgeArticles(params: {
    search?: string;
    category?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<ApiResponse<PaginatedResponse<ServiceNowKnowledgeArticle>>> {
    return this.getService().getKnowledgeArticles(params);
  }

  async getKnowledgeArticle(sysId: string): Promise<ApiResponse<ServiceNowKnowledgeArticle>> {
    return this.getService().getKnowledgeArticle(sysId);
  }

  // User Requests API
  async getUserRequests(params: {
    limit?: number;
    offset?: number;
  } = {}): Promise<ApiResponse<PaginatedResponse<ServiceNowRequest>>> {
    return this.getService().getUserRequests(params);
  }

  // Reference Data API
  async getReferenceData(tableName: string, query?: string): Promise<ApiResponse<any[]>> {
    return this.getService().getReferenceData(tableName, query);
  }

  async getCatalogCategories(): Promise<ApiResponse<any[]>> {
    return this.getService().getCatalogCategories();
  }
}

// Export singleton instance
export const apiService = new ApiService();