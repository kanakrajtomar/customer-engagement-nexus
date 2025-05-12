
const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.communicationLog.deleteMany();
  await prisma.rule.deleteMany();
  await prisma.order.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.user.deleteMany();

  // Seed users
  const user = await prisma.user.create({
    data: {
      email: 'user@example.com',
      name: 'Demo User',
      picture: 'https://ui-avatars.com/api/?name=Demo+User&background=0D8ABC&color=fff'
    }
  });

  console.log('Created user:', user.id);

  // Seed customers
  const customers = [];
  for (let i = 0; i < 100; i++) {
    const customer = await prisma.customer.create({
      data: {
        name: `Customer ${i + 1}`,
        email: `customer${i + 1}@example.com`,
        phone: `+91${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        total_spend: Math.floor(1000 + Math.random() * 20000),
        last_purchase_date: new Date(Date.now() - Math.floor(Math.random() * 180) * 24 * 60 * 60 * 1000),
        visit_count: Math.floor(1 + Math.random() * 20)
      }
    });
    customers.push(customer);
    console.log(`Created customer ${i + 1}`);
  }

  // Add orders for customers
  for (const customer of customers) {
    const orderCount = Math.floor(1 + Math.random() * 5);
    for (let i = 0; i < orderCount; i++) {
      await prisma.order.create({
        data: {
          customer_id: customer.id,
          order_date: new Date(Date.now() - Math.floor(Math.random() * 180) * 24 * 60 * 60 * 1000),
          amount: Math.floor(200 + Math.random() * 2000)
        }
      });
    }
  }
  console.log('Created orders');

  // Create campaigns
  const campaigns = [
    {
      name: 'Re-engage inactive customers',
      description: 'Target customers who haven\'t made a purchase in the last 90 days',
      rules: [
        {
          type: 'condition',
          field: 'last_purchase_date',
          operator: '<',
          value: '90'
        },
        {
          type: 'condition',
          field: 'total_spend',
          operator: '>',
          value: '5000'
        }
      ],
      audience_size: 234,
      sent_count: 210,
      failed_count: 24,
      status: 'completed'
    },
    {
      name: 'High-value customer offers',
      description: 'Special discounts for customers who spent over ₹10,000',
      rules: [
        {
          type: 'condition',
          field: 'total_spend',
          operator: '>',
          value: '10000'
        }
      ],
      audience_size: 87,
      sent_count: 82,
      failed_count: 5,
      status: 'completed'
    },
    {
      name: 'New product announcement',
      description: 'Inform all customers about our new product line',
      rules: [
        {
          type: 'condition',
          field: 'visit_count',
          operator: '>',
          value: '0'
        }
      ],
      audience_size: 500,
      sent_count: 450,
      failed_count: 50,
      status: 'completed'
    }
  ];

  for (const campaignData of campaigns) {
    const { rules, ...rest } = campaignData;
    
    const campaign = await prisma.campaign.create({
      data: {
        ...rest,
        created_at: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
        rules: {
          create: rules
        }
      }
    });
    
    console.log(`Created campaign: ${campaign.name}`);
    
    // Add communication logs
    const logsCount = campaign.sent_count + campaign.failed_count;
    let customerIndex = 0;
    
    for (let i = 0; i < logsCount; i++) {
      const status = i < campaign.sent_count ? 'SENT' : 'FAILED';
      
      if (customerIndex >= customers.length) {
        customerIndex = 0;
      }
      
      await prisma.communicationLog.create({
        data: {
          campaign_id: campaign.id,
          customer_id: customers[customerIndex].id,
          message: `Hi ${customers[customerIndex].name}, check out our latest offers!`,
          status,
          timestamp: new Date(Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000)
        }
      });
      
      customerIndex++;
    }
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
