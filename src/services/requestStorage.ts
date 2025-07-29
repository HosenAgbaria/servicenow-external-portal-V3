export interface StoredRequest {
  number: string;
  sys_id: string;
  catalog_item: {
    sys_id: string;
    name: string;
    category: string;
  };
  form_data: any;
  submitted_at: string;
  submitted_by: string;
  status: string;
  priority: string;
  impact: string;
}

class RequestStorage {
  private storageKey = 'servicenow_requests';

  saveRequest(request: StoredRequest): void {
    try {
      const existingRequests = this.getAllRequests();
      existingRequests.push(request);
      
      // Keep only the last 50 requests
      if (existingRequests.length > 50) {
        existingRequests.splice(0, existingRequests.length - 50);
      }
      
      localStorage.setItem(this.storageKey, JSON.stringify(existingRequests));
      console.log('💾 Request saved to local storage:', request.number);
    } catch (error) {
      console.error('❌ Failed to save request to storage:', error);
    }
  }

  getAllRequests(): StoredRequest[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('❌ Failed to load requests from storage:', error);
      return [];
    }
  }

  getRequestByNumber(number: string): StoredRequest | null {
    const requests = this.getAllRequests();
    return requests.find(req => req.number === number) || null;
  }

  getRequestBySysId(sysId: string): StoredRequest | null {
    const requests = this.getAllRequests();
    return requests.find(req => req.sys_id === sysId) || null;
  }

  updateRequestStatus(number: string, status: string): void {
    try {
      const requests = this.getAllRequests();
      const requestIndex = requests.findIndex(req => req.number === number);
      
      if (requestIndex !== -1) {
        requests[requestIndex].status = status;
        localStorage.setItem(this.storageKey, JSON.stringify(requests));
        console.log('✅ Request status updated:', number, status);
      }
    } catch (error) {
      console.error('❌ Failed to update request status:', error);
    }
  }

  clearAllRequests(): void {
    try {
      localStorage.removeItem(this.storageKey);
      console.log('🗑️ All requests cleared from storage');
    } catch (error) {
      console.error('❌ Failed to clear requests:', error);
    }
  }
}

export const requestStorage = new RequestStorage(); 