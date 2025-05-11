
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ApiDocs = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">API Documentation</h1>
        <p className="text-gray-500 mt-2">
          Comprehensive documentation for the Mini CRM Platform APIs
        </p>
      </div>

      <Tabs defaultValue="customers">
        <TabsList className="mb-4">
          <TabsTrigger value="customers">Customers API</TabsTrigger>
          <TabsTrigger value="orders">Orders API</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns API</TabsTrigger>
          <TabsTrigger value="ai">AI API</TabsTrigger>
        </TabsList>
        
        <TabsContent value="customers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>GET /api/customers</CardTitle>
              <CardDescription>Retrieve all customers</CardDescription>
            </CardHeader>
            <CardContent>
              <h4 className="font-medium mb-2">Response</h4>
              <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">
{`[
  {
    "id": "string",
    "name": "string",
    "email": "string",
    "phone": "string",
    "total_spend": "number",
    "last_purchase_date": "string (ISO date)",
    "visit_count": "number",
    "created_at": "string (ISO date)",
    "updated_at": "string (ISO date)"
  }
]`}
              </pre>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>POST /api/customers</CardTitle>
              <CardDescription>Create a new customer</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <h4 className="font-medium mb-2">Request Body</h4>
              <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">
{`{
  "name": "string (required)",
  "email": "string (required, valid email)",
  "phone": "string (required)",
  "total_spend": "number (default: 0)",
  "last_purchase_date": "string (ISO date, optional)",
  "visit_count": "number (default: 0)"
}`}
              </pre>
              
              <h4 className="font-medium mb-2">Response</h4>
              <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">
{`{
  "id": "string",
  "name": "string",
  "email": "string",
  "phone": "string",
  "total_spend": "number",
  "last_purchase_date": "string (ISO date)",
  "visit_count": "number",
  "created_at": "string (ISO date)",
  "updated_at": "string (ISO date)"
}`}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>GET /api/orders</CardTitle>
              <CardDescription>Retrieve all orders</CardDescription>
            </CardHeader>
            <CardContent>
              <h4 className="font-medium mb-2">Response</h4>
              <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">
{`[
  {
    "order_id": "string",
    "customer_id": "string",
    "order_date": "string (ISO date)",
    "amount": "number",
    "created_at": "string (ISO date)",
    "updated_at": "string (ISO date)"
  }
]`}
              </pre>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>POST /api/orders</CardTitle>
              <CardDescription>Create a new order</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <h4 className="font-medium mb-2">Request Body</h4>
              <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">
{`{
  "order_id": "string (required)",
  "customer_id": "string (required)",
  "order_date": "string (ISO date, required)",
  "amount": "number (required, > 0)"
}`}
              </pre>
              
              <h4 className="font-medium mb-2">Response</h4>
              <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">
{`{
  "order_id": "string",
  "customer_id": "string",
  "order_date": "string (ISO date)",
  "amount": "number",
  "created_at": "string (ISO date)",
  "updated_at": "string (ISO date)"
}`}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="campaigns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>POST /api/campaigns/preview</CardTitle>
              <CardDescription>Preview audience size for a set of rules</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <h4 className="font-medium mb-2">Request Body</h4>
              <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">
{`{
  "rules": [
    {
      "id": "string",
      "type": "condition | group",
      "field": "string (required for type=condition)",
      "operator": "string (required for type=condition)",
      "value": "string | number (required for type=condition)",
      "rules": "array (required for type=group)",
      "combinator": "AND | OR (required for type=group)"
    }
  ]
}`}
              </pre>
              
              <h4 className="font-medium mb-2">Response</h4>
              <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">
{`{
  "size": "number"
}`}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="ai" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>POST /api/ai/segment</CardTitle>
              <CardDescription>Generate segment rules from natural language</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <h4 className="font-medium mb-2">Request Body</h4>
              <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">
{`{
  "prompt": "string (required)"
}`}
              </pre>
              
              <h4 className="font-medium mb-2">Response</h4>
              <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">
{`{
  "rules": [
    {
      "id": "string",
      "type": "condition | group",
      "field": "string",
      "operator": "string",
      "value": "string | number",
      "rules": "array",
      "combinator": "AND | OR"
    }
  ],
  "explanation": "string"
}`}
              </pre>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>POST /api/ai/message</CardTitle>
              <CardDescription>Generate message suggestions for campaigns</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <h4 className="font-medium mb-2">Request Body</h4>
              <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">
{`{
  "campaignObjective": "string (required)"
}`}
              </pre>
              
              <h4 className="font-medium mb-2">Response</h4>
              <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">
{`{
  "messages": ["string", "string", "string"],
  "imageRecommendations": ["string", "string", "string"]
}`}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ApiDocs;
