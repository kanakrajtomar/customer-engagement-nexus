
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access denied' });

  jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret', (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Mock message queue (In a production app, use a real message broker like RabbitMQ or Kafka)
const messageQueue = {
  publishCustomer: (customerData) => {
    console.log('Publishing customer to queue:', customerData);
    // Simulate async processing
    setTimeout(async () => {
      try {
        await prisma.customer.create({ data: customerData });
        console.log('Customer processed from queue:', customerData.email);
      } catch (error) {
        console.error('Error processing customer from queue:', error);
      }
    }, 100);
  },
  
  publishOrder: (orderData) => {
    console.log('Publishing order to queue:', orderData);
    // Simulate async processing
    setTimeout(async () => {
      try {
        await prisma.order.create({ data: orderData });
        
        // Update customer total spend
        const order = await prisma.order.findUnique({
          where: { id: orderData.id },
          include: { customer: true }
        });
        
        if (order && order.customer) {
          const customerOrders = await prisma.order.findMany({
            where: { customer_id: order.customer_id }
          });
          
          const totalSpend = customerOrders.reduce((sum, order) => sum + order.amount, 0);
          
          await prisma.customer.update({
            where: { id: order.customer_id },
            data: { 
              total_spend: totalSpend,
              last_purchase_date: orderData.order_date
            }
          });
        }
        
        console.log('Order processed from queue:', orderData.id);
      } catch (error) {
        console.error('Error processing order from queue:', error);
      }
    }, 100);
  },
  
  publishDeliveryReceipt: (deliveryData) => {
    console.log('Publishing delivery receipt to queue:', deliveryData);
    // Simulate batched processing
    setTimeout(async () => {
      try {
        await prisma.communicationLog.update({
          where: { id: deliveryData.log_id },
          data: { status: deliveryData.status }
        });
        
        // Update campaign stats
        const log = await prisma.communicationLog.findUnique({
          where: { id: deliveryData.log_id },
          include: { campaign: true }
        });
        
        if (log && log.campaign) {
          const campaignLogs = await prisma.communicationLog.findMany({
            where: { campaign_id: log.campaign_id }
          });
          
          const sentCount = campaignLogs.filter(l => l.status === 'SENT').length;
          const failedCount = campaignLogs.filter(l => l.status === 'FAILED').length;
          
          await prisma.campaign.update({
            where: { id: log.campaign_id },
            data: { 
              sent_count: sentCount,
              failed_count: failedCount,
              status: 'completed'
            }
          });
        }
        
        console.log('Delivery receipt processed:', deliveryData.log_id);
      } catch (error) {
        console.error('Error processing delivery receipt:', error);
      }
    }, 300); // Simulate batched processing
  }
};

// Auth routes
app.post('/api/auth/login', async (req, res) => {
  try {
    // For demo purposes, we're returning a mock user and token
    // In a real app, you would validate credentials against the database
    const token = jwt.sign({ id: 'user_123456', email: 'user@example.com' }, 
                           process.env.JWT_SECRET || 'your_jwt_secret', 
                           { expiresIn: '24h' });
    
    res.json({
      user: {
        id: 'user_123456',
        email: 'user@example.com',
        name: 'Demo User',
        picture: 'https://ui-avatars.com/api/?name=Demo+User&background=0D8ABC&color=fff'
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

// Customer routes
app.get('/api/customers', authenticateToken, async (req, res) => {
  try {
    const customers = await prisma.customer.findMany();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

app.get('/api/customers/:id', authenticateToken, async (req, res) => {
  try {
    const customer = await prisma.customer.findUnique({
      where: { id: req.params.id }
    });
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customer' });
  }
});

app.post('/api/customers', authenticateToken, async (req, res) => {
  try {
    // Validate data
    const { name, email, phone } = req.body;
    if (!name || !email || !phone) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const customerData = {
      id: req.body.id || crypto.randomUUID(),
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      total_spend: req.body.total_spend || 0,
      last_purchase_date: req.body.last_purchase_date || new Date(),
      visit_count: req.body.visit_count || 0
    };
    
    // Publish to queue instead of direct persistence
    messageQueue.publishCustomer(customerData);
    
    // Return immediately with 202 Accepted
    res.status(202).json({ 
      message: 'Customer creation request accepted', 
      customer: customerData 
    });
  } catch (error) {
    console.error('Customer creation error:', error);
    res.status(500).json({ error: 'Failed to create customer' });
  }
});

app.put('/api/customers/:id', authenticateToken, async (req, res) => {
  try {
    const customer = await prisma.customer.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update customer' });
  }
});

app.delete('/api/customers/:id', authenticateToken, async (req, res) => {
  try {
    await prisma.customer.delete({
      where: { id: req.params.id }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete customer' });
  }
});

// Order routes
app.get('/api/orders', authenticateToken, async (req, res) => {
  try {
    const orders = await prisma.order.findMany();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

app.get('/api/customers/:id/orders', authenticateToken, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { customer_id: req.params.id }
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customer orders' });
  }
});

app.post('/api/orders', authenticateToken, async (req, res) => {
  try {
    const { customer_id, amount } = req.body;
    if (!customer_id || amount === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const orderData = {
      id: req.body.order_id || crypto.randomUUID(),
      customer_id: req.body.customer_id,
      order_date: req.body.order_date || new Date(),
      amount: req.body.amount
    };
    
    // Publish to queue instead of direct persistence
    messageQueue.publishOrder(orderData);
    
    // Return immediately with 202 Accepted
    res.status(202).json({ 
      message: 'Order creation request accepted', 
      order: orderData 
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

app.put('/api/orders/:id', authenticateToken, async (req, res) => {
  try {
    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order' });
  }
});

// Campaign routes
app.get('/api/campaigns', authenticateToken, async (req, res) => {
  try {
    const campaigns = await prisma.campaign.findMany({
      include: {
        rules: true
      }
    });
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch campaigns' });
  }
});

app.get('/api/campaigns/:id', authenticateToken, async (req, res) => {
  try {
    const campaign = await prisma.campaign.findUnique({
      where: { id: req.params.id },
      include: {
        rules: true
      }
    });
    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }
    res.json(campaign);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch campaign' });
  }
});

app.post('/api/campaigns', authenticateToken, async (req, res) => {
  try {
    const { name, description, rules, audience_size } = req.body;
    
    if (!name || !rules) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const campaign = await prisma.campaign.create({
      data: {
        name,
        description,
        audience_size: audience_size || 0,
        sent_count: 0,
        failed_count: 0,
        status: 'draft',
        rules: {
          create: rules.map(rule => ({
            type: rule.type,
            field: rule.field,
            operator: rule.operator,
            value: rule.value,
            combinator: rule.combinator
          }))
        }
      },
      include: {
        rules: true
      }
    });
    
    res.status(201).json(campaign);
  } catch (error) {
    console.error('Campaign creation error:', error);
    res.status(500).json({ error: 'Failed to create campaign' });
  }
});

app.post('/api/campaigns/preview', authenticateToken, async (req, res) => {
  try {
    const { rules } = req.body;
    
    if (!rules || !Array.isArray(rules)) {
      return res.status(400).json({ error: 'Invalid rules format' });
    }
    
    // In a real implementation, this would be a complex DB query
    // For now, we'll build a simple version that checks basic conditions
    let customers = await prisma.customer.findMany();
    
    // Apply rule filtering
    rules.forEach(rule => {
      if (rule.type === 'condition') {
        customers = customers.filter(customer => {
          const value = customer[rule.field];
          const compareValue = Number(rule.value);
          
          switch(rule.operator) {
            case '>':
              return typeof value === 'number' ? value > compareValue : false;
            case '<':
              if (rule.field === 'last_purchase_date') {
                // Special case for date comparison - days ago
                const daysAgo = new Date();
                daysAgo.setDate(daysAgo.getDate() - compareValue);
                return new Date(customer.last_purchase_date) < daysAgo;
              }
              return typeof value === 'number' ? value < compareValue : false;
            case '=':
              return value == compareValue;
            default:
              return true;
          }
        });
      }
    });
    
    res.json({ size: customers.length });
  } catch (error) {
    console.error('Audience preview error:', error);
    res.status(500).json({ error: 'Failed to preview audience' });
  }
});

// Delivery Receipt API
app.post('/api/delivery/receipt', async (req, res) => {
  try {
    const { log_id, status } = req.body;
    
    if (!log_id || !status) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Validate status
    if (!['SENT', 'FAILED', 'PENDING'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }
    
    // Process receipt asynchronously via queue
    messageQueue.publishDeliveryReceipt({ log_id, status });
    
    // Return immediately
    res.status(202).json({ message: 'Receipt processing' });
  } catch (error) {
    console.error('Delivery receipt error:', error);
    res.status(500).json({ error: 'Failed to process delivery receipt' });
  }
});

app.post('/api/campaigns/:id/execute', authenticateToken, async (req, res) => {
  try {
    const campaign = await prisma.campaign.update({
      where: { id: req.params.id },
      data: { status: 'sending' },
      include: { rules: true }
    });
    
    // Find matching customers for this campaign
    let customers = await prisma.customer.findMany();
    
    // Apply rule filtering (simplified version)
    campaign.rules.forEach(rule => {
      if (rule.type === 'condition') {
        customers = customers.filter(customer => {
          const value = customer[rule.field];
          const compareValue = Number(rule.value);
          
          switch(rule.operator) {
            case '>':
              return typeof value === 'number' ? value > compareValue : false;
            case '<':
              if (rule.field === 'last_purchase_date') {
                const daysAgo = new Date();
                daysAgo.setDate(daysAgo.getDate() - compareValue);
                return new Date(customer.last_purchase_date) < daysAgo;
              }
              return typeof value === 'number' ? value < compareValue : false;
            case '=':
              return value == compareValue;
            default:
              return true;
          }
        });
      }
    });
    
    // Send messages to each customer (in real app, this would be done by a background job)
    // For demo, we'll do it in the request but return immediately
    
    // Update audience size based on actual matches
    await prisma.campaign.update({
      where: { id: campaign.id },
      data: { audience_size: customers.length }
    });
    
    // Mock message for campaign (in real app this might come from the request)
    const message = `Hi {name}, here's 10% off on your next order! Use code CAMPAIGN${campaign.id.substring(0, 4)}`;
    
    // Process each customer
    setTimeout(async () => {
      try {
        // Create communication logs for each customer
        for (const customer of customers) {
          // Create personalized message
          const personalizedMessage = message.replace('{name}', customer.name);
          
          // Create communication log entry
          const logEntry = await prisma.communicationLog.create({
            data: {
              campaign_id: campaign.id,
              customer_id: customer.id,
              message: personalizedMessage,
              status: 'PENDING'
            }
          });
          
          // Simulate sending message to vendor API
          simulateVendorApiSend(logEntry);
        }
      } catch (error) {
        console.error('Error in campaign execution:', error);
      }
    }, 100);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Campaign execution error:', error);
    res.status(500).json({ error: 'Failed to execute campaign' });
  }
});

// AI endpoints 
app.post('/api/ai/segment', authenticateToken, (req, res) => {
  const { prompt } = req.body;
  
  if (!prompt) {
    return res.status(400).json({ error: 'Missing prompt' });
  }
  
  // For demonstration purposes, we'll return mock AI-generated rules
  let rules = [];
  let explanation = '';
  
  if (prompt.toLowerCase().includes("inactive") || prompt.toLowerCase().includes("haven't shopped")) {
    rules = [
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
        value: '5000'
      }
    ];
    explanation = "These rules target customers who haven't made a purchase in the last 6 months and have spent over ₹5,000 in total.";
  } else if (prompt.toLowerCase().includes("high value") || prompt.toLowerCase().includes("spent over")) {
    rules = [
      {
        id: crypto.randomUUID(),
        type: 'condition',
        field: 'total_spend',
        operator: '>',
        value: '10000'
      },
      {
        id: crypto.randomUUID(),
        type: 'condition',
        field: 'visit_count',
        operator: '>',
        value: '5'
      }
    ];
    explanation = "These rules target high-value customers who have spent over ₹10,000 and visited more than 5 times.";
  } else {
    rules = [
      {
        id: crypto.randomUUID(),
        type: 'condition',
        field: 'visit_count',
        operator: '>',
        value: '3'
      }
    ];
    explanation = "These rules target customers who have visited more than 3 times.";
  }
  
  res.json({ rules, explanation });
});

app.post('/api/ai/message', authenticateToken, (req, res) => {
  const { prompt, campaignObjective } = req.body;
  const objective = (campaignObjective || prompt || '').toLowerCase();
  
  if (!objective) {
    return res.status(400).json({ error: 'Missing prompt or campaign objective' });
  }
  
  let messages = [];
  let imageRecommendations = [];
  
  if (objective.includes('inactive')) {
    messages = [
      "Hi {name}, we've missed you! Come back and enjoy 15% off your next purchase with code WELCOME15.",
      "Hello {name}! It's been a while. Ready to explore our latest collection? Use code COMEBACK20 for an exclusive discount.",
      "{name}, we noticed you've been away. Return today and receive free shipping on orders over ₹1000!"
    ];
    imageRecommendations = [
      "nostalgic-welcome-back.jpg",
      "exclusive-new-collection.jpg",
      "special-offer-banner.jpg"
    ];
  } else if (objective.includes('high value') || objective.includes('loyal')) {
    messages = [
      "Thank you for your loyalty, {name}! Here's a VIP discount of 20% on your next premium purchase.",
      "{name}, as one of our most valued customers, enjoy early access to our new exclusive collection!",
      "We appreciate your business, {name}! Enjoy a complimentary gift with your next purchase over ₹5000."
    ];
    imageRecommendations = [
      "luxury-vip-treatment.jpg",
      "exclusive-preview-access.jpg",
      "premium-gift-offering.jpg"
    ];
  } else {
    messages = [
      "Hi {name}, enjoy 10% off on your next order with code SAVE10!",
      "Hello {name}! Check out our latest arrivals perfect for you.",
      "Special offer just for you, {name}! Free shipping on your next purchase."
    ];
    imageRecommendations = [
      "seasonal-discount-offer.jpg",
      "new-arrivals-showcase.jpg",
      "free-shipping-promotion.jpg"
    ];
  }
  
  res.json({ messages, imageRecommendations });
});

// Helper function to simulate vendor API sending messages
function simulateVendorApiSend(logEntry) {
  setTimeout(async () => {
    try {
      // Simulate 90% success, 10% failure
      const isSuccess = Math.random() < 0.9;
      const status = isSuccess ? 'SENT' : 'FAILED';
      
      // Call our own delivery receipt API (in a real app this would be done by the vendor)
      await fetch(`http://localhost:${PORT}/api/delivery/receipt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ log_id: logEntry.id, status })
      });
      
    } catch (error) {
      console.error('Error simulating vendor API:', error);
    }
  }, Math.floor(Math.random() * 2000) + 500); // Random delay between 500-2500ms
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.on('beforeExit', async () => {
  await prisma.$disconnect();
});
