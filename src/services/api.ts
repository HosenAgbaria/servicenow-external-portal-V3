import type { 
  ServiceNowCatalogItem, 
  ServiceNowRequest, 
  ServiceNowKnowledgeArticle,
  ApiResponse, 
  PaginatedResponse,
  FormField 
} from '../types';

// Mock data for catalog items with comprehensive field types
const mockCatalogItems: ServiceNowCatalogItem[] = [
  {
    sys_id: 'cat-001',
    name: 'Laptop Request',
    short_description: 'Request a new laptop for your work needs.',
    description: 'Complete laptop request form with various field types to demonstrate dynamic form rendering capabilities.',
    category: 'Hardware',
    price: 0,
    picture: '/api/images/laptop-request.jpg',
    active: true,
    fields: [
      {
        name: 'request_type',
        label: 'Request Type',
        type: 'choice',
        mandatory: true,
        choices: [
          { value: 'new', label: 'New Laptop' },
          { value: 'replacement', label: 'Replacement Laptop' },
          { value: 'upgrade', label: 'Hardware Upgrade' }
        ]
      },
      {
        name: 'laptop_model',
        label: 'Laptop Model',
        type: 'choice',
        mandatory: true,
        choices: [
          { value: 'dell_latitude', label: 'Dell Latitude' },
          { value: 'hp_elitebook', label: 'HP EliteBook' },
          { value: 'lenovo_thinkpad', label: 'Lenovo ThinkPad' }
        ]
      },
      {
        name: 'ram_size',
        label: 'RAM Size',
        type: 'choice',
        mandatory: true,
        choices: [
          { value: '8', label: '8GB' },
          { value: '16', label: '16GB' },
          { value: '32', label: '32GB' }
        ]
      },
      {
        name: 'storage_size',
        label: 'Storage Size',
        type: 'choice',
        mandatory: true,
        choices: [
          { value: '256', label: '256GB SSD' },
          { value: '512', label: '512GB SSD' },
          { value: '1tb', label: '1TB SSD' }
        ]
      },
      {
        name: 'urgent_request',
        label: 'Urgent Request',
        type: 'boolean',
        mandatory: false
      },
      {
        name: 'justification',
        label: 'Justification',
        type: 'textarea',
        mandatory: true,
        max_length: 1000
      },
      {
        name: 'preferred_delivery_date',
        label: 'Preferred Delivery Date',
        type: 'glide_date',
        mandatory: false
      },
      {
        name: 'contact_email',
        label: 'Contact Email',
        type: 'email',
        mandatory: true
      },
      {
        name: 'phone_number',
        label: 'Phone Number',
        type: 'string',
        mandatory: false,
        max_length: 20
      },
      {
        name: 'department',
        label: 'Department',
        type: 'reference',
        mandatory: true,
        reference: 'cmn_department'
      },
      {
        name: 'attachments',
        label: 'Supporting Documents',
        type: 'file',
        mandatory: false
      }
    ],
    variables: [],
    order: 1,
    availability: 'available',
    rating: 4.5,
    reviews_count: 12
  },
  {
    sys_id: 'cat-002',
    name: 'Software License Request',
    short_description: 'Request software licenses for your projects.',
    description: 'Software license request form with conditional fields and validation.',
    category: 'Software',
    price: 0,
    picture: '/api/images/software-request.jpg',
    active: true,
    fields: [
      {
        name: 'software_type',
        label: 'Software Type',
        type: 'choice',
        mandatory: true,
        choices: [
          { value: 'development', label: 'Development Tools' },
          { value: 'design', label: 'Design Software' },
          { value: 'productivity', label: 'Productivity Suite' },
          { value: 'other', label: 'Other' }
        ]
      },
      {
        name: 'software_name',
        label: 'Software Name',
        type: 'string',
        mandatory: true,
        max_length: 100
      },
      {
        name: 'license_type',
        label: 'License Type',
        type: 'choice',
        mandatory: true,
        choices: [
          { value: 'individual', label: 'Individual License' },
          { value: 'team', label: 'Team License' },
          { value: 'enterprise', label: 'Enterprise License' }
        ]
      },
      {
        name: 'number_of_users',
        label: 'Number of Users',
        type: 'number',
        mandatory: false,
        show_when: { field: 'license_type', value: 'team' }
      },
      {
        name: 'project_code',
        label: 'Project Code',
        type: 'string',
        mandatory: false,
        max_length: 20
      },
      {
        name: 'cost_center',
        label: 'Cost Center',
        type: 'reference',
        mandatory: true,
        reference: 'cmn_cost_center'
      },
      {
        name: 'justification',
        label: 'Business Justification',
        type: 'textarea',
        mandatory: true,
        max_length: 500
      },
      {
        name: 'requested_by',
        label: 'Requested By',
        type: 'reference',
        mandatory: true,
        reference: 'sys_user'
      }
    ],
    variables: [],
    order: 2,
    availability: 'available',
    rating: 4.2,
    reviews_count: 8
  },
  {
    sys_id: 'cat-003',
    name: 'Access Request',
    short_description: 'Request access to systems and applications.',
    description: 'Access request form with role-based field dependencies.',
    category: 'Access',
    price: 0,
    picture: '/api/images/access-request.jpg',
    active: true,
    fields: [
      {
        name: 'access_type',
        label: 'Access Type',
        type: 'choice',
        mandatory: true,
        choices: [
          { value: 'system', label: 'System Access' },
          { value: 'application', label: 'Application Access' },
          { value: 'database', label: 'Database Access' },
          { value: 'network', label: 'Network Access' }
        ]
      },
      {
        name: 'system_name',
        label: 'System Name',
        type: 'string',
        mandatory: true,
        show_when: { field: 'access_type', value: 'system' }
      },
      {
        name: 'application_name',
        label: 'Application Name',
        type: 'string',
        mandatory: true,
        show_when: { field: 'access_type', value: 'application' }
      },
      {
        name: 'database_name',
        label: 'Database Name',
        type: 'string',
        mandatory: true,
        show_when: { field: 'access_type', value: 'database' }
      },
      {
        name: 'network_location',
        label: 'Network Location',
        type: 'string',
        mandatory: true,
        show_when: { field: 'access_type', value: 'network' }
      },
      {
        name: 'access_level',
        label: 'Access Level',
        type: 'choice',
        mandatory: true,
        choices: [
          { value: 'read', label: 'Read Only' },
          { value: 'write', label: 'Read/Write' },
          { value: 'admin', label: 'Administrator' }
        ]
      },
      {
        name: 'duration',
        label: 'Access Duration',
        type: 'choice',
        mandatory: true,
        choices: [
          { value: 'temporary', label: 'Temporary' },
          { value: 'permanent', label: 'Permanent' }
        ]
      },
      {
        name: 'end_date',
        label: 'End Date',
        type: 'glide_date',
        mandatory: true,
        show_when: { field: 'duration', value: 'temporary' }
      },
      {
        name: 'manager_approval',
        label: 'Manager Approval Required',
        type: 'boolean',
        mandatory: false
      },
      {
        name: 'justification',
        label: 'Business Justification',
        type: 'textarea',
        mandatory: true,
        max_length: 300
      }
    ],
    variables: [],
    order: 3,
    availability: 'available',
    rating: 4.0,
    reviews_count: 15
  }
];

// Mock data for requests
const mockRequests: ServiceNowRequest[] = [
  {
    sys_id: 'req-001',
    number: 'REQ-2023-001',
    short_description: 'Laptop Request - Dell Latitude',
    description: 'Request for a new Dell Latitude laptop with 16GB RAM and 512GB SSD for development work.',
    category: 'Hardware',
    subcategory: 'Laptops',
    priority: '3',
    state: 'in_progress',
    assigned_to: {
      sys_id: 'user-001',
      name: 'John Smith',
      email: 'john.smith@company.com'
    },
    requested_by: {
      sys_id: 'user-002',
      name: 'Jane Doe',
      email: 'jane.doe@company.com'
    },
    requested_date: '2023-12-01T10:00:00Z',
    due_date: '2023-12-15T17:00:00Z',
    closed_date: undefined,
    comments: [
      {
        sys_id: 'comment-001',
        comment: 'Request approved by manager. Ordering laptop.',
        user: {
          sys_id: 'user-001',
          name: 'John Smith'
        },
        date: '2023-12-02T14:30:00Z'
      }
    ],
    attachments: [],
    variables: {
      request_type: 'new',
      laptop_model: 'dell_latitude',
      ram_size: '16',
      storage_size: '512',
      urgent_request: false,
      justification: 'Need for development work and testing.',
      contact_email: 'jane.doe@company.com'
    }
  },
  {
    sys_id: 'req-002',
    number: 'REQ-2023-002',
    short_description: 'Software License - Adobe Creative Suite',
    description: 'Request for Adobe Creative Suite license for design team.',
    category: 'Software',
    subcategory: 'Design Software',
    priority: '2',
    state: 'new',
    assigned_to: undefined,
    requested_by: {
      sys_id: 'user-003',
      name: 'Mike Johnson',
      email: 'mike.johnson@company.com'
    },
    requested_date: '2023-12-03T09:15:00Z',
    due_date: '2023-12-10T17:00:00Z',
    closed_date: undefined,
    comments: [],
    attachments: [],
    variables: {
      software_type: 'design',
      software_name: 'Adobe Creative Suite',
      license_type: 'team',
      number_of_users: 5,
      justification: 'Required for design team projects.'
    }
  }
];

// Mock data for knowledge articles
const mockKnowledgeArticles: ServiceNowKnowledgeArticle[] = [
  {
    sys_id: 'kb-001',
    number: 'KB-2023-001',
    title: 'How to Request a New Laptop',
    short_description: 'Step-by-step guide for requesting a new laptop through the service portal.',
    content: 'This article provides detailed instructions on how to request a new laptop...',
    category: 'Hardware',
    subcategory: 'Laptops',
    author: {
      sys_id: 'user-001',
      name: 'John Smith'
    },
    published_date: '2023-11-15T10:00:00Z',
    updated_date: '2023-11-20T14:30:00Z',
    view_count: 45,
    helpful_count: 12,
    tags: ['laptop', 'hardware', 'request', 'guide']
  },
  {
    sys_id: 'kb-002',
    number: 'KB-2023-002',
    title: 'Software License Request Process',
    short_description: 'Understanding the software license request process and approval workflow.',
    content: 'This article explains the complete process for requesting software licenses...',
    category: 'Software',
    subcategory: 'Licenses',
    author: {
      sys_id: 'user-004',
      name: 'Sarah Wilson'
    },
    published_date: '2023-11-10T09:00:00Z',
    updated_date: '2023-11-25T16:45:00Z',
    view_count: 32,
    helpful_count: 8,
    tags: ['software', 'license', 'process', 'approval']
  }
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class ApiService {
  private realApiService: any;
  private useRealApi: boolean;

  constructor() {
    // Use real API in production or when environment variables are set
    this.useRealApi = import.meta.env.PROD || !!import.meta.env.VITE_SERVICENOW_BASE_URL;
    
    if (this.useRealApi) {
      // Dynamically import and initialize real API service
      this.initializeRealApiService();
    }
  }

  private async initializeRealApiService() {
    try {
      const { getRealApiService } = await import('./realApiService');
      this.realApiService = getRealApiService();
    } catch (error) {
      console.warn('Failed to initialize real API service, falling back to mock data:', error);
      this.useRealApi = false;
    }
  }

  // ServiceNow field type to FormField type mapping
  private mapServiceNowFieldType(serviceNowType: string): FormField['type'] {
    switch (serviceNowType) {
      case 'string':
        return 'text';
      case 'number':
        return 'number';
      case 'boolean':
        return 'checkbox';
      case 'choice':
        return 'select';
      case 'reference':
        return 'reference';
      case 'glide_date':
        return 'date';
      case 'glide_date_time':
        return 'datetime';
      case 'email':
        return 'email';
      case 'url':
        return 'text';
      case 'textarea':
        return 'textarea';
      case 'file':
        return 'file';
      default:
        return 'text';
    }
  }

  // Convert ServiceNow field to FormField
  private convertServiceNowField(field: any): FormField {
    return {
      name: field.name,
      label: field.label,
      type: this.mapServiceNowFieldType(field.type),
      mandatory: field.mandatory || false,
      required: field.mandatory,
      placeholder: field.placeholder,
      helpText: field.help_text,
      options: field.choices?.map((choice: any) => ({
        value: choice.value,
        label: choice.label
      })),
      accept: field.accept,
      multiple: field.multiple,
             validation: field.validation ? {
         type: field.validation.type as 'required' | 'email' | 'min' | 'max' | 'pattern',
         value: field.validation.value,
         message: field.validation.message
       } : undefined,
      showWhen: field.show_when ? {
        field: field.show_when.field,
        value: field.show_when.value
      } : undefined
    };
  }

  async getCatalogItems(params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    priceRange?: { min: number; max: number };
    availability?: string;
    rating?: number;
  }): Promise<ApiResponse<PaginatedResponse<ServiceNowCatalogItem>>> {
    if (this.useRealApi && this.realApiService) {
      try {
        return await this.realApiService.getCatalogItems({
          search: params?.search,
          category: params?.category,
          limit: params?.limit || 10,
          offset: params?.page ? (params.page - 1) * (params.limit || 10) : 0
        });
      } catch (error) {
        console.warn('ServiceNow API not accessible, using demo data:', error);
        // Show user-friendly message about demo mode
        if (error.message?.includes('CORS') || error.message?.includes('Failed to fetch')) {
          console.info('📋 Running in demo mode - ServiceNow API requires server-side proxy for production use');
        }
      }
    }

    await delay(500);

    let filteredItems = [...mockCatalogItems];

    // Apply filters
    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      filteredItems = filteredItems.filter(item =>
        item.name.toLowerCase().includes(searchLower) ||
        item.short_description.toLowerCase().includes(searchLower)
      );
    }

    if (params?.category && params.category !== 'all') {
      filteredItems = filteredItems.filter(item => item.category === params.category);
    }

    if (params?.availability && params.availability !== 'all') {
      filteredItems = filteredItems.filter(item => item.availability === params.availability);
    }

    if (params?.rating) {
      filteredItems = filteredItems.filter(item => (item.rating || 0) >= params.rating!);
    }

    // Pagination
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedItems = filteredItems.slice(startIndex, endIndex);

    return {
      success: true,
      data: {
        data: paginatedItems,
        count: filteredItems.length,
        offset: page,
        limit
      }
    };
  }

  async getCatalogItem(sysId: string): Promise<ApiResponse<ServiceNowCatalogItem>> {
    await delay(300);

    const item = mockCatalogItems.find(item => item.sys_id === sysId);
    
    if (!item) {
      return {
        success: false,
        error: 'Catalog item not found'
      };
    }

    return {
      success: true,
      data: item
    };
  }

  async getCategories(): Promise<ApiResponse<string[]>> {
    await delay(200);

    const categories = [...new Set(mockCatalogItems.map(item => item.category))];
    
    return {
      success: true,
      data: categories
    };
  }

  async getRequests(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    category?: string;
    dateRange?: { start: string; end: string };
  }): Promise<ApiResponse<PaginatedResponse<ServiceNowRequest>>> {
    await delay(500);

    let filteredRequests = [...mockRequests];

    // Apply filters
    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      filteredRequests = filteredRequests.filter(request =>
        request.number.toLowerCase().includes(searchLower) ||
        request.short_description.toLowerCase().includes(searchLower)
      );
    }

    if (params?.status) {
      filteredRequests = filteredRequests.filter(request => request.state === params.status);
    }

    if (params?.category) {
      filteredRequests = filteredRequests.filter(request => request.category === params.category);
    }

    // Pagination
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedRequests = filteredRequests.slice(startIndex, endIndex);

    return {
      success: true,
      data: {
        data: paginatedRequests,
        count: filteredRequests.length,
        offset: page,
        limit
      }
    };
  }

  async getRequest(sysId: string): Promise<ApiResponse<ServiceNowRequest>> {
    await delay(300);

    const request = mockRequests.find(req => req.sys_id === sysId);
    
    if (!request) {
      return {
        success: false,
        error: 'Request not found'
      };
    }

    return {
      success: true,
      data: request
    };
  }

  async createRequest(data: any): Promise<ApiResponse<ServiceNowRequest>> {
    await delay(1000);

    const newRequest: ServiceNowRequest = {
      sys_id: `req-${Date.now()}`,
      number: `REQ-2023-${String(mockRequests.length + 1).padStart(3, '0')}`,
      short_description: data.short_description || 'New Request',
      description: data.description || '',
      category: data.category || 'General',
      subcategory: data.subcategory || '',
      priority: data.priority || '3',
      state: 'new',
      requested_by: {
        sys_id: 'user-current',
        name: 'Current User',
        email: 'user@company.com'
      },
      requested_date: new Date().toISOString(),
      comments: [],
      attachments: [],
      variables: data
    };

    mockRequests.push(newRequest);

    return {
      success: true,
      data: newRequest
    };
  }

  async updateRequest(sysId: string, data: Partial<ServiceNowRequest>): Promise<ApiResponse<ServiceNowRequest>> {
    await delay(500);

    const requestIndex = mockRequests.findIndex(req => req.sys_id === sysId);
    
    if (requestIndex === -1) {
      return {
        success: false,
        error: 'Request not found'
      };
    }

    mockRequests[requestIndex] = { ...mockRequests[requestIndex], ...data };

    return {
      success: true,
      data: mockRequests[requestIndex]
    };
  }

  async getKnowledgeArticles(params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
  }): Promise<ApiResponse<PaginatedResponse<ServiceNowKnowledgeArticle>>> {
    if (this.useRealApi && this.realApiService) {
      try {
        return await this.realApiService.getKnowledgeArticles({
          search: params?.search,
          category: params?.category,
          limit: params?.limit || 10,
          offset: params?.page ? (params.page - 1) * (params.limit || 10) : 0
        });
      } catch (error) {
        console.warn('ServiceNow API not accessible, using demo data:', error);
        // Show user-friendly message about demo mode
        if (error.message?.includes('CORS') || error.message?.includes('Failed to fetch')) {
          console.info('📚 Running in demo mode - ServiceNow API requires server-side proxy for production use');
        }
      }
    }

    await delay(400);

    let filteredArticles = [...mockKnowledgeArticles];

    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      filteredArticles = filteredArticles.filter(article =>
        article.title.toLowerCase().includes(searchLower) ||
        article.short_description.toLowerCase().includes(searchLower)
      );
    }

    if (params?.category) {
      filteredArticles = filteredArticles.filter(article => article.category === params.category);
    }

    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedArticles = filteredArticles.slice(startIndex, endIndex);

    return {
      success: true,
      data: {
        data: paginatedArticles,
        count: filteredArticles.length,
        limit,
        offset: (page - 1) * limit
      }
    };
  }

  async getKnowledgeArticle(sysId: string): Promise<ApiResponse<ServiceNowKnowledgeArticle>> {
    await delay(300);

    const article = mockKnowledgeArticles.find(art => art.sys_id === sysId);
    
    if (!article) {
      return {
        success: false,
        error: 'Knowledge article not found'
      };
    }

    return {
      success: true,
      data: article
    };
  }

  async getFormMetadata(catalogItemId: string): Promise<ApiResponse<FormField[]>> {
    await delay(400);

    const catalogItem = mockCatalogItems.find(item => item.sys_id === catalogItemId);
    
    if (!catalogItem) {
      return {
        success: false,
        error: 'Catalog item not found'
      };
    }

    // Convert ServiceNow fields to FormFields
    const formFields = catalogItem.fields.map(field => this.convertServiceNowField(field));

    return {
      success: true,
      data: formFields
    };
  }

  // ServiceNow API specific methods for real integration
  async getServiceNowTable(table: string, query?: string): Promise<any> {
    // This would be replaced with actual ServiceNow REST API calls
    const endpoint = `${this.baseUrl}/now/table/${table}`;
    const params = query ? `?sysparm_query=${encodeURIComponent(query)}` : '';
    
    try {
      const response = await fetch(`${endpoint}${params}`, {
        headers: {
          'Authorization': 'Basic ' + btoa('username:password'), // Replace with actual auth
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`ServiceNow API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('ServiceNow API error:', error);
      throw error;
    }
  }

  async createServiceNowRecord(table: string, data: any): Promise<any> {
    const endpoint = `${this.baseUrl}/now/table/${table}`;
    
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + btoa('username:password'), // Replace with actual auth
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error(`ServiceNow API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('ServiceNow API error:', error);
      throw error;
    }
  }
}

export const apiService = new ApiService();