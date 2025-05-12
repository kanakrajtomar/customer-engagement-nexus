
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
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
app.get('/api/customers', async (req, res) => {
  try {
    const customers = await prisma.customer.findMany();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

app.get('/api/customers/:id', async (req, res) => {
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

app.post('/api/customers', async (req, res) => {
  try {
    const customer = await prisma.customer.create({
      data: {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        total_spend: req.body.total_spend || 0,
        last_purchase_date: req.body.last_purchase_date || new Date(),
        visit_count: req.body.visit_count || 0
      }
    });
    res.status(201).json(customer);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create customer' });
  }
});

app.put('/api/customers/:id', async (req, res) => {
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

app.delete('/api/customers/:id', async (req, res) => {
  try {
    await prisma.customer.delete({
      where: { id: req.params.id }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete customer' });
  }
});

// Campaign routes
app.get('/api/campaigns', async (req, res) => {
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

app.get('/api/campaigns/:id', async (req, res) => {
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

app.post('/api/campaigns', async (req, res) => {
  try {
    const { name, description, rules, audience_size } = req.body;
    
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

app.post('/api/campaigns/preview', async (req, res) => {
  try {
    const { rules } = req.body;
    // This would be a complex query in a real app
    // For now, we'll return a mock size based on rule count
    const size = Math.floor(20 + Math.random() * 480);
    res.json({ size });
  } catch (error) {
    res.status(500).json({ error: 'Failed to preview audience' });
  }
});

app.post('/api/campaigns/:id/execute', async (req, res) => {
  try {
    const campaign = await prisma.campaign.update({
      where: { id: req.params.id },
      data: { status: 'sending' }
    });
    
    // In a real app, this would trigger a background job
    // For now, we'll simulate it with a timeout
    setTimeout(async () => {
      try {
        const sentCount = Math.floor(campaign.audience_size * 0.9);
        const failedCount = campaign.audience_size - sentCount;
        
        await prisma.campaign.update({
          where: { id: req.params.id },
          data: { 
            status: 'completed',
            sent_count: sentCount,
            failed_count: failedCount
          }
        });
      } catch (err) {
        console.error('Error updating campaign status:', err);
      }
    }, 5000);
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to execute campaign' });
  }
});

// AI endpoints
app.post('/api/ai/segment', (req, res) => {
  const { prompt } = req.body;
  
  // For demonstration purposes, we'll return mock AI-generated rules
  let rules = [];
  
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
        value: 5000
      }
    ];
  } else if (prompt.toLowerCase().includes("high value") || prompt.toLowerCase().includes("spent over")) {
    rules = [
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
    ];
  } else {
    rules = [
      {
        id: crypto.randomUUID(),
        type: 'condition',
        field: 'visit_count',
        operator: '>',
        value: 3
      }
    ];
  }
  
  res.json({
    rules,
    explanation: `Generated rules based on: "${prompt}"`
  });
});

app.post('/api/ai/message', (req, res) => {
  const { prompt, campaignObjective } = req.body;
  const objective = (campaignObjective || prompt || '').toLowerCase();
  
  let messages = [];
  
  if (objective.includes('inactive')) {
    messages = [
      "Hi {name}, we've missed you! Come back and enjoy 15% off your next purchase with code WELCOME15.",
      "Hello {name}! It's been a while. Ready to explore our latest collection? Use code COMEBACK20 for an exclusive discount.",
      "{name}, we noticed you've been away. Return today and receive free shipping on orders over ₹1000!"
    ];
  } else if (objective.includes('high value') || objective.includes('loyal')) {
    messages = [
      "Thank you for your loyalty, {name}! Here's a VIP discount of 20% on your next premium purchase.",
      "{name}, as one of our most valued customers, enjoy early access to our new exclusive collection!",
      "We appreciate your business, {name}! Enjoy a complimentary gift with your next purchase over ₹5000."
    ];
  } else {
    messages = [
      "Hi {name}, enjoy 10% off on your next order with code SAVE10!",
      "Hello {name}! Check out our latest arrivals perfect for you.",
      "Special offer just for you, {name}! Free shipping on your next purchase."
    ];
  }
  
  res.json({ messages });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.on('beforeExit', async () => {
  await prisma.$disconnect();
});
