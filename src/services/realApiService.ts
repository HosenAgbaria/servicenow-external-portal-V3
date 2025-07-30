import type { 
  ApiResponse, 
  PaginatedResponse, 
  ServiceNowCatalogItem, 
  ServiceNowKnowledgeArticle, 
  ServiceNowRequest,
  ServiceNowRequestCreationResponse,
  FormField, 
  FormData 
} from '../types';
import { requestStorage, type StoredRequest } from './requestStorage';
import { realEmailService } from './realEmailService';

export interface ServiceNowConfig {
  baseUrl: string;
  username: string;
  password: string;
  clientId?: string;
  clientSecret?: string;
  useOAuth: boolean;
}

class RealServiceNowApiService {
  private config: ServiceNowConfig;
  private accessToken: string | null = null;
  private tokenExpiry: number | null = null;
  constructor(config: ServiceNowConfig) {
    this.config = config;
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    // Use proxy server instead of direct ServiceNow API calls
    const proxyBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
    const url = `${proxyBaseUrl}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Proxy API Error: ${response.status} ${response.statusText}`, errorText);
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        console.error('Unable to connect to proxy server - make sure the server is running');
        throw new Error('Unable to connect to the API server. Please ensure the server is running.');
      }
      throw error;
    }
  }

  async getCatalogItems(params: {
    search?: string;
    category?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<ApiResponse<PaginatedResponse<ServiceNowCatalogItem>>> {
    try {
      const queryParams = new URLSearchParams();
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.offset) queryParams.append('offset', params.offset.toString());
      if (params.search) queryParams.append('search', params.search);
      if (params.category) queryParams.append('category', params.category);

      const endpoint = `/api/servicenow/catalog/items?${queryParams.toString()}`;
      const response = await this.makeRequest<any>(endpoint);

      return {
        success: true,
        data: {
          data: response.result.map((item: any) => this.mapServiceNowCatalogItem(item)),
          count: response.result.length,
          limit: params.limit || 10,
          offset: params.offset || 0,
        },
        message: 'Catalog items retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: { data: [], count: 0, limit: 10, offset: 0 },
        message: `Failed to retrieve catalog items: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  async getCatalogCategories(): Promise<ApiResponse<{ sys_id: string; title: string; description?: string }[]>> {
    try {
      const endpoint = '/api/servicenow/catalog/categories';
      const response = await this.makeRequest<any>(endpoint);

      return {
        success: true,
        data: response.result.map((category: any) => ({
          sys_id: category.sys_id,
          title: category.title,
          description: category.description
        })),
        message: 'Catalog categories retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: `Failed to retrieve catalog categories: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  async getCatalogItemDetails(itemId: string): Promise<ApiResponse<ServiceNowCatalogItem>> {
    try {
      const endpoint = `/api/sn_sc/servicecatalog/items/${itemId}`;
      const response = await this.makeRequest<any>(endpoint);

      return {
        success: true,
        data: this.mapServiceNowCatalogItem(response.result),
        message: 'Catalog item details retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: {} as ServiceNowCatalogItem,
        message: `Failed to retrieve catalog item details: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  async getCatalogItemForm(itemId: string): Promise<ApiResponse<{ fields: FormField[] }>> {
    try {
      // Since the separate form endpoint returns 400, we'll get the form fields from the item details
      const endpoint = `/api/sn_sc/servicecatalog/items/${itemId}`;
      const response = await this.makeRequest<any>(endpoint);

      // Extract form fields from the variables array in the item details
      const fields = await Promise.all(response.result?.variables?.map((field: any) => this.mapServiceNowField(field)));

      return {
        success: true,
        data: { fields },
        message: 'Catalog item form retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: { fields: [] },
        message: `Failed to retrieve catalog item form: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  async submitCatalogRequest(
    itemId: string, 
    formData: FormData
  ): Promise<ApiResponse<ServiceNowRequestCreationResponse>> {
    try {
      console.log('🔍 Submitting catalog request for item:', itemId);
      console.log('📤 Form data:', formData);
      
      // Get the catalog item details first
      const itemResponse = await this.makeRequest<any>(`/api/sn_sc/servicecatalog/items/${itemId}`);
      if (!itemResponse.result) {
        throw new Error('Failed to get catalog item details');
      }
      
      const item = itemResponse.result;
      console.log('📋 Catalog item:', item.name);
      console.log('📋 Category:', item.category?.title || 'N/A');
      
      // Generate a request number
      const timestamp = Date.now();
      const requestNumber = `REQ${timestamp.toString().slice(-6)}`;
      
      console.log('📝 Attempting to create real ServiceNow request...');
      console.log('📝 Generated Request Number:', requestNumber);
      
      // Use the proxy endpoint to create real ServiceNow request
      const endpoint = '/api/servicenow/requests/submit';
      const createRequestResult = await this.makeRequest<any>(endpoint, {
        method: 'POST',
        body: JSON.stringify({
          catalogItemId: itemId,
          formData: formData,
          requestNumber: requestNumber
        })
      });
      
      if (createRequestResult.success) {
        console.log('✅ Successfully created real ServiceNow request!');
        console.log('📋 ServiceNow Record:', createRequestResult.data);
        
        // Store request details locally for reference
        const requestDetails = {
          number: createRequestResult.data.number,
          sys_id: createRequestResult.data.sys_id,
          catalog_item: {
            sys_id: itemId,
            name: item.name,
            category: item.category?.title || 'N/A'
          },
          form_data: formData,
          submitted_at: new Date().toISOString(),
          submitted_by: 'ext.portal.v2',
          status: 'created_in_servicenow',
          priority: 'medium',
          impact: 'medium',
          servicenow_table: createRequestResult.data.table,
          servicenow_created_at: createRequestResult.data.created_at
        };
        
        // Save to local storage
        requestStorage.saveRequest(requestDetails as StoredRequest);
        
        console.log('💾 Request details saved to local storage');
        console.log('📋 Real ServiceNow sys_id:', createRequestResult.data.sys_id);
        console.log('📋 Real ServiceNow number:', createRequestResult.data.number);
        console.log('📋 ServiceNow table:', createRequestResult.data.table);
        
        return {
          success: true,
          data: createRequestResult.data,
          message: `Request created successfully in ServiceNow! Request Number: ${createRequestResult.data.number}. Check your ServiceNow instance for the new request.`
        };
      } else {
        throw new Error(createRequestResult.message || 'Failed to create ServiceNow request');
      }
      
    } catch (error) {
      console.error('❌ Failed to submit catalog request:', error);
      return {
        success: false,
        data: { sys_id: '', number: '', table: 'unknown' },
        message: `Failed to submit catalog request: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  async getKnowledgeArticles(params: {
    search?: string;
    category?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<ApiResponse<PaginatedResponse<ServiceNowKnowledgeArticle>>> {
    try {
      const queryParams = new URLSearchParams();
      
      // Set default limit if not provided
      const limit = params.limit || 20;
      const offset = params.offset || 0;
      
      if (params.search) queryParams.append('search', params.search);
      if (params.category) queryParams.append('category', params.category);
      queryParams.append('limit', limit.toString());
      queryParams.append('offset', offset.toString());

      const endpoint = `/api/servicenow/knowledge/articles?${queryParams.toString()}`;
      console.log('Knowledge API endpoint:', endpoint);
      
      const response = await this.makeRequest<any>(endpoint);
      console.log('Knowledge API response:', response);

      if (!response.result) {
        throw new Error('Invalid response format from ServiceNow API');
      }

      return {
        success: true,
        data: {
          data: response.result.map((article: any) => this.mapServiceNowKnowledgeArticle(article)),
          count: response.result.length,
          limit: limit,
          offset: offset,
        },
        message: 'Knowledge articles retrieved successfully'
      };
    } catch (error) {
      console.error('Error fetching knowledge articles:', error);
      return {
        success: false,
        data: { data: [], count: 0, limit: 10, offset: 0 },
        message: `Failed to retrieve knowledge articles: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  async getKnowledgeArticle(sysId: string): Promise<ApiResponse<ServiceNowKnowledgeArticle>> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('sysparm_fields', 'sys_id,number,short_description,text,title,category,subcategory,author.name,author.sys_id,published,view_count,helpful_count,sys_created_on,sys_updated_on,workflow_state,valid_to,active');
      queryParams.append('sysparm_display_value', 'author');
      
      const endpoint = `/api/now/table/kb_knowledge/${sysId}?${queryParams.toString()}`;
      console.log('Knowledge Article API endpoint:', endpoint);
      
      const response = await this.makeRequest<any>(endpoint);
      console.log('Knowledge Article API response:', response);

      if (!response.result) {
        throw new Error('Article not found');
      }

      return {
        success: true,
        data: this.mapServiceNowKnowledgeArticle(response.result),
        message: 'Knowledge article retrieved successfully'
      };
    } catch (error) {
      console.error('Error fetching knowledge article:', error);
      return {
        success: false,
        data: {} as ServiceNowKnowledgeArticle,
        message: `Failed to retrieve knowledge article: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  async getUserRequests(params: {
    limit?: number;
    offset?: number;
  } = {}): Promise<ApiResponse<PaginatedResponse<ServiceNowRequest>>> {
    try {
      const queryParams = new URLSearchParams();
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.offset) queryParams.append('offset', params.offset.toString());

      const endpoint = `/api/servicenow/requests?${queryParams.toString()}`;
      const response = await this.makeRequest<any>(endpoint);

      return {
        success: true,
        data: {
          data: response.result.map((request: any) => this.mapServiceNowRequest(request)),
          count: response.result.length,
          limit: params.limit || 10,
          offset: params.offset || 0,
        },
        message: 'User requests retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: { data: [], count: 0, limit: 10, offset: 0 },
        message: `Failed to retrieve user requests: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  async getReferenceData(tableName: string, query?: string): Promise<ApiResponse<any[]>> {
    try {
      const queryParams = new URLSearchParams();
      if (query) queryParams.append('sysparm_query', query);

      const endpoint = `/api/now/table/${tableName}?${queryParams.toString()}`;
      const response = await this.makeRequest<any>(endpoint);

      return {
        success: true,
        data: response.result,
        message: 'Reference data retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: `Failed to retrieve reference data: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  private mapServiceNowCatalogItem(item: any): ServiceNowCatalogItem {
    // Helper function to safely extract string values from ServiceNow reference fields
    const extractStringValue = (field: any): string => {
      if (typeof field === 'string') return field;
      if (field && typeof field === 'object') {
        return field.display_value || field.value || field.title || field.name || '';
      }
      return '';
    };

    return {
      sys_id: item.sys_id,
      name: item.name,
      short_description: item.short_description || '',
      description: item.description || '',
      category: extractStringValue(item.category),
      subcategory: extractStringValue(item.subcategory),
      availability: item.availability === 'on_desktop' ? 'available' : 'unavailable',
      picture: item.picture || item.icon || '',
      price: 0, // ServiceNow doesn't always provide price in the same format
      order: item.order || 0,
      active: item.active !== 'false',
      fields: [],
      variables: [],
      rating: 0,
      reviews_count: 0,
      sys_created_on: item.sys_created_on,
      sys_updated_on: item.sys_updated_on,
    };
  }

  private mapServiceNowKnowledgeArticle(article: any): ServiceNowKnowledgeArticle {
    // Helper function to safely extract string values from ServiceNow reference fields
    const extractStringValue = (field: any): string => {
      if (typeof field === 'string') return field;
      if (field && typeof field === 'object') {
        return field.display_value || field.value || field.name || '';
      }
      return '';
    };

    // Extract category and subcategory safely
    const category = extractStringValue(article.category) || 'General';
    const subcategory = extractStringValue(article.subcategory) || 'General';
    
    // Extract author information safely
    let authorName = 'System';
    let authorSysId = '';
    
    if (article.author) {
      if (typeof article.author === 'string') {
        // If author is just a string (sys_id), use it as both name and sys_id
        authorName = article.author;
        authorSysId = article.author;
      } else if (typeof article.author === 'object') {
        // If author is an object, extract display_value and value/sys_id
        authorName = article.author.display_value || article.author.name || article.author.value || 'System';
        authorSysId = article.author.value || article.author.sys_id || '';
      }
    }
    
    return {
      sys_id: article.sys_id || '',
      title: article.title || article.short_description || 'Untitled Article',
      short_description: article.short_description || '',
      description: article.text || article.description || '',
      category: category,
      subcategory: subcategory,
      author: {
        sys_id: authorSysId,
        name: authorName,
      },
      published_date: article.published || article.sys_created_on || new Date().toISOString(),
      view_count: parseInt(article.view_count) || 0,
      helpful_count: parseInt(article.helpful_count) || 0,
      sys_created_on: article.sys_created_on || new Date().toISOString(),
      sys_updated_on: article.sys_updated_on || new Date().toISOString(),
    };
  }

  private mapServiceNowRequest(request: any): ServiceNowRequest {
    return {
      sys_id: request.sys_id,
      number: request.number,
      short_description: request.short_description || '',
      description: request.description || '',
      status: request.state || '',
      priority: request.priority || '',
      category: request.category?.title || '',
      subcategory: request.subcategory?.title || '',
      assigned_to: {
        sys_id: request.assigned_to?.sys_id || '',
        name: request.assigned_to?.name || '',
        email: request.assigned_to?.email || '',
      },
      requested_by: {
        sys_id: request.requested_by?.sys_id || '',
        name: request.requested_by?.name || '',
        email: request.requested_by?.email || '',
      },
      sys_created_on: request.sys_created_on,
      sys_updated_on: request.sys_updated_on,
    };
  }

  private async mapServiceNowField(field: any): Promise<FormField> {
    let options: Array<{ value: string; label: string }> = [];
    
    // Handle reference fields by fetching options
    if (field.reference && field.friendly_type === 'reference') {
      try {
        console.log(`🔍 Fetching reference data for ${field.reference}...`);
        const refResponse = await this.getReferenceData(field.reference);
        if (refResponse.success && refResponse.data) {
          options = refResponse.data.map((item: any) => ({
            value: item.sys_id,
            label: item.name || item.short_description || item.title || item.sys_id
          }));
          console.log(`✅ Found ${options.length} options for ${field.reference}`);
        }
      } catch (error) {
        console.warn(`⚠️ Failed to fetch reference data for ${field.reference}:`, error);
      }
    }
    
    // Handle choice fields
    if (field.choices && field.choices.length > 0) {
      options = field.choices.map((choice: any) => ({
        value: choice.value,
        label: choice.label
      }));
    }

    return {
      name: field.name,
      label: field.label || field.name,
      type: this.mapServiceNowFieldType(field.friendly_type || field.type),
      mandatory: field.mandatory || false,
      required: field.mandatory || false,
      placeholder: field.placeholder || '',
      helpText: field.help_text || '',
      options,
      accept: field.accept,
      multiple: field.multiple,
      validation: field.validation,
      showWhen: field.show_when,
    };
  }

  private mapServiceNowFieldType(serviceNowType: string): FormField['type'] {
    const typeMap: Record<string, FormField['type']> = {
      'string': 'text',
      'number': 'number',
      'boolean': 'checkbox',
      'choice': 'select',
      'reference': 'reference',
      'glide_date': 'date',
      'glide_date_time': 'datetime',
      'email': 'email',
      'url': 'url',
      'textarea': 'textarea',
      'multi_line_text': 'textarea',
      'file': 'file',
    };
    return typeMap[serviceNowType] || 'text';
  }

  private convertFormDataToVariables(formData: FormData): any[] {
    return Object.entries(formData).map(([name, value]) => ({
      name,
      value: Array.isArray(value) ? value.join(',') : value,
    }));
  }

  private formatFormDataAsDescription(formData: FormData): string {
    const lines: string[] = [];
    lines.push('Catalog Request Details:');
    lines.push('');
    
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        lines.push(`${key}: ${value}`);
      }
    });
    
    return lines.join('\n');
  }
}

// Export singleton instance
export const getRealApiService = () => new RealServiceNowApiService({
  baseUrl: import.meta.env.VITE_SERVICENOW_BASE_URL || 'https://tanivdynamicsltddemo4.service-now.com',
  username: import.meta.env.VITE_SERVICENOW_USERNAME || 'ext.portal.v2',
  password: import.meta.env.VITE_SERVICENOW_PASSWORD || '*]<D7sP^KX+zW1Nn.VJ6P,(w=-$5QJ',
  clientId: import.meta.env.VITE_SERVICENOW_CLIENT_ID || '1fcct8c927c54abbeb2ba990f6149043',
  clientSecret: import.meta.env.VITE_SERVICENOW_CLIENT_SECRET || 'Jfjwy4o$eg',
  useOAuth: false, // Using Basic Auth since it works
});

export const initializeRealApiService = (_config: ServiceNowConfig): void => {
  // Configuration is handled by the proxy server
  console.log('✅ Real ServiceNow API service initialized with proxy');
};