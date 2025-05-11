
// Customer data types
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  total_spend: number;
  last_purchase_date: string;
  visit_count: number;
  created_at: string;
  updated_at: string;
}

// Order data types
export interface Order {
  order_id: string;
  customer_id: string;
  order_date: string;
  amount: number;
  created_at: string;
  updated_at: string;
}

// Campaign data types
export interface Campaign {
  id: string;
  name: string;
  description: string;
  rules: Rule[];
  audience_size: number;
  created_at: string;
  updated_at: string;
  sent_count: number;
  failed_count: number;
  status: "draft" | "sending" | "completed" | "failed";
}

// Communication log types
export interface CommunicationLog {
  id: string;
  campaign_id: string;
  customer_id: string;
  message: string;
  status: "SENT" | "FAILED" | "PENDING";
  timestamp: string;
}

// Rule types for segmentation
export interface Rule {
  id: string;
  type: "condition" | "group";
  field?: string;
  operator?: string;
  value?: string | number;
  rules?: Rule[];
  combinator?: "AND" | "OR";
}

// Auth user type
export interface User {
  id: string;
  email: string;
  name: string;
  picture: string;
}

// AI types
export interface AIRequest {
  prompt: string;
  campaignObjective?: string;
}

export interface AISegmentResponse {
  rules: Rule[];
  explanation: string;
}

export interface AIMessageResponse {
  messages: string[];
  imageRecommendations?: string[];
}
