
import { Customer, Order, Campaign, Rule, AIRequest, AISegmentResponse, AIMessageResponse } from '../types';
import { toast } from "@/components/ui/sonner";

const API_URL = 'http://localhost:3001/api';

// Helper function for API requests
async function fetchApi<T>(
  endpoint: string, 
  method: string = 'GET', 
  body: any = null, 
  headers: Record<string, string> = {}
): Promise<T> {
  try {
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    // Add token if available
    const token = localStorage.getItem('crm_token');
    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_URL}${endpoint}`, options);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || errorData.error || 'API request failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('API error:', error);
    toast.error('API request failed: ' + (error as Error).message);
    throw error;
  }
}

// Customer API
export const customerApi = {
  getCustomers: () => fetchApi<Customer[]>('/customers'),
  getCustomer: (id: string) => fetchApi<Customer>(`/customers/${id}`),
  createCustomer: (customer: Omit<Customer, 'id' | 'created_at' | 'updated_at'>) => 
    fetchApi<Customer>('/customers', 'POST', customer),
  updateCustomer: (id: string, customer: Partial<Customer>) => 
    fetchApi<Customer>(`/customers/${id}`, 'PUT', customer),
  deleteCustomer: (id: string) => 
    fetchApi<{ success: boolean }>(`/customers/${id}`, 'DELETE')
};

// Order API
export const orderApi = {
  getOrders: () => fetchApi<Order[]>('/orders'),
  getCustomerOrders: (customerId: string) => 
    fetchApi<Order[]>(`/customers/${customerId}/orders`),
  createOrder: (order: Omit<Order, 'created_at' | 'updated_at'>) => 
    fetchApi<Order>('/orders', 'POST', order),
  updateOrder: (id: string, order: Partial<Order>) => 
    fetchApi<Order>(`/orders/${id}`, 'PUT', order),
  deleteOrder: (id: string) => 
    fetchApi<{ success: boolean }>(`/orders/${id}`, 'DELETE')
};

// Campaign API
export const campaignApi = {
  getCampaigns: () => fetchApi<Campaign[]>('/campaigns'),
  getCampaign: (id: string) => fetchApi<Campaign>(`/campaigns/${id}`),
  createCampaign: (campaign: Omit<Campaign, 'id' | 'created_at' | 'updated_at' | 'sent_count' | 'failed_count' | 'status'>) => 
    fetchApi<Campaign>('/campaigns', 'POST', campaign),
  updateCampaign: (id: string, campaign: Partial<Campaign>) => 
    fetchApi<Campaign>(`/campaigns/${id}`, 'PUT', campaign),
  deleteCampaign: (id: string) => 
    fetchApi<{ success: boolean }>(`/campaigns/${id}`, 'DELETE'),
  previewAudience: (rules: Rule[]) => 
    fetchApi<{ size: number }>('/campaigns/preview', 'POST', { rules }),
  executeCampaign: (id: string) => 
    fetchApi<{ success: boolean }>(`/campaigns/${id}/execute`, 'POST')
};

// AI API
export const aiApi = {
  generateSegmentRules: (request: AIRequest) => 
    fetchApi<AISegmentResponse>('/ai/segment', 'POST', request),
  generateMessageSuggestions: (request: AIRequest) => 
    fetchApi<AIMessageResponse>('/ai/message', 'POST', request)
};

// Auth API
export const authApi = {
  login: (credentials: { email: string, password: string }) => 
    fetchApi<{ user: any, token: string }>('/auth/login', 'POST', credentials),
};

// Export mockApi for development purposes (can be removed in production)
export { mockApi };

// Mock data API for preview and testing
export const mockApi = {
  getCampaigns: (): Promise<Campaign[]> => {
    return Promise.resolve([
      {
        id: '1',
        name: 'Re-engage inactive customers',
        description: 'Target customers who haven\'t made a purchase in the last 90 days',
        rules: [
          {
            id: '101',
            type: 'condition',
            field: 'last_purchase_date',
            operator: '<',
            value: '90'
          },
          {
            id: '102',
            type: 'condition',
            field: 'total_spend',
            operator: '>',
            value: 5000
          }
        ],
        audience_size: 234,
        created_at: '2025-05-01T10:30:00Z',
        updated_at: '2025-05-01T10:30:00Z',
        sent_count: 210,
        failed_count: 24,
        status: 'completed'
      },
      {
        id: '2',
        name: 'High-value customer offers',
        description: 'Special discounts for customers who spent over ₹10,000',
        rules: [
          {
            id: '201',
            type: 'condition',
            field: 'total_spend',
            operator: '>',
            value: 10000
          }
        ],
        audience_size: 87,
        created_at: '2025-05-05T14:15:00Z',
        updated_at: '2025-05-05T14:15:00Z',
        sent_count: 82,
        failed_count: 5,
        status: 'completed'
      },
      {
        id: '3',
        name: 'New product announcement',
        description: 'Inform all customers about our new product line',
        rules: [
          {
            id: '301',
            type: 'condition',
            field: 'visit_count',
            operator: '>',
            value: 0
          }
        ],
        audience_size: 500,
        created_at: '2025-05-10T09:00:00Z',
        updated_at: '2025-05-10T09:00:00Z',
        sent_count: 450,
        failed_count: 50,
        status: 'completed'
      }
    ]);
  },
  
  getCustomers: (): Promise<Customer[]> => {
    return Promise.resolve(Array(100).fill(0).map((_, index) => ({
      id: `cust_${index + 1}`,
      name: `Customer ${index + 1}`,
      email: `customer${index + 1}@example.com`,
      phone: `+91${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      total_spend: Math.floor(1000 + Math.random() * 20000),
      last_purchase_date: new Date(Date.now() - Math.floor(Math.random() * 180) * 24 * 60 * 60 * 1000).toISOString(),
      visit_count: Math.floor(1 + Math.random() * 20),
      created_at: new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString()
    })));
  },
  
  previewAudience: (rules: Rule[]): Promise<{ size: number }> => {
    // This is a mock implementation - in a real app, this would evaluate the rules against the database
    let size = Math.floor(20 + Math.random() * 480);
    
    // Adjust size based on rule complexity
    if (rules.length > 3) size = Math.floor(size * 0.7);
    if (rules.some(r => r.type === 'group')) size = Math.floor(size * 0.8);
    
    return Promise.resolve({ size });
  },
  
  generateSegmentRules: (request: AIRequest): Promise<AISegmentResponse> => {
    const prompt = request.prompt.toLowerCase();
    
    // Simple pattern matching for different prompts
    if (prompt.includes("haven't shopped") || prompt.includes("inactive")) {
      return Promise.resolve({
        rules: [
          {
            id: crypto.randomUUID(),
            type: 'condition',
            field: 'last_purchase_date',
            operator: '<',
            value: '180' // 6 months
          },
          {
            id: crypto.randomUUID(),
            type: 'condition',
            field: 'total_spend',
            operator: '>',
            value: 5000
          }
        ],
        explanation: "These rules target customers who haven't made a purchase in the last 6 months and have spent over ₹5,000 in total."
      });
    } else if (prompt.includes("high value") || prompt.includes("spent over")) {
      return Promise.resolve({
        rules: [
          {
            id: crypto.randomUUID(),
            type: 'condition',
            field: 'total_spend',
            operator: '>',
            value: 10000
          },
          {
            id: crypto.randomUUID(),
            type: 'condition',
            field: 'visit_count',
            operator: '>',
            value: 5
          }
        ],
        explanation: "These rules target high-value customers who have spent over ₹10,000 and visited more than 5 times."
      });
    } else {
      // Default rules
      return Promise.resolve({
        rules: [
          {
            id: crypto.randomUUID(),
            type: 'condition',
            field: 'visit_count',
            operator: '>',
            value: 3
          }
        ],
        explanation: "These rules target customers who have visited more than 3 times."
      });
    }
  },
  
  generateMessageSuggestions: (request: AIRequest): Promise<AIMessageResponse> => {
    const objective = (request.campaignObjective || '').toLowerCase();
    
    if (objective.includes('inactive')) {
      return Promise.resolve({
        messages: [
          "Hi {name}, we've missed you! Come back and enjoy 15% off your next purchase with code WELCOME15.",
          "Hello {name}! It's been a while. Ready to explore our latest collection? Use code COMEBACK20 for an exclusive discount.",
          "{name}, we noticed you've been away. Return today and receive free shipping on orders over ₹1000!"
        ],
        imageRecommendations: [
          "nostalgic-welcome-back.jpg",
          "exclusive-new-collection.jpg",
          "special-offer-banner.jpg"
        ]
      });
    } else if (objective.includes('high value') || objective.includes('loyal')) {
      return Promise.resolve({
        messages: [
          "Thank you for your loyalty, {name}! Here's a VIP discount of 20% on your next premium purchase.",
          "{name}, as one of our most valued customers, enjoy early access to our new exclusive collection!",
          "We appreciate your business, {name}! Enjoy a complimentary gift with your next purchase over ₹5000."
        ],
        imageRecommendations: [
          "luxury-vip-treatment.jpg",
          "exclusive-preview-access.jpg",
          "premium-gift-offering.jpg"
        ]
      });
    } else {
      return Promise.resolve({
        messages: [
          "Hi {name}, enjoy 10% off on your next order with code SAVE10!",
          "Hello {name}! Check out our latest arrivals perfect for you.",
          "Special offer just for you, {name}! Free shipping on your next purchase."
        ],
        imageRecommendations: [
          "seasonal-discount-offer.jpg",
          "new-arrivals-showcase.jpg",
          "free-shipping-promotion.jpg"
        ]
      });
    }
  }
};
