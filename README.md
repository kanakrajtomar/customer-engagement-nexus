
# Mini CRM Platform

A complete CRM solution for managing customer data, creating segments, and running personalized campaigns.

## Features

- Customer management with search and filtering
- Campaign creation with audience segmentation
- Rule-based segmentation with AND/OR logic
- Natural language to segment rules conversion using AI
- AI-powered message generation based on campaign objectives
- Campaign execution and tracking

## Tech Stack

### Frontend
- React + TypeScript
- Tailwind CSS
- Shadcn UI components
- React Query for data fetching
- React Router for navigation

### Backend
- Node.js + Express
- PostgreSQL database with Prisma ORM
- Authentication with JWT
- AI integration for natural language processing

## Setup Instructions

### Prerequisites
- Node.js (v14+)
- PostgreSQL database

### Backend Setup

1. Navigate to the server directory:
```
cd server
```

2. Install dependencies:
```
npm install
```

3. Create a .env file with your database connection string:
```
DATABASE_URL="postgresql://postgres:password@localhost:5432/crm_db"
JWT_SECRET="your_secure_jwt_secret_key"
PORT=3001
```

4. Run Prisma migrations:
```
npx prisma migrate dev --name init
```

5. Seed the database:
```
node prisma/seed.js
```

6. Start the server:
```
npm run dev
```

The backend API will be available at http://localhost:3001/api.

### Frontend Setup

1. Install dependencies from the root folder:
```
npm install
```

2. Start the development server:
```
npm run dev
```

The frontend app will be available at http://localhost:5173.

## API Documentation

### Authentication
- `POST /api/auth/login` - Authenticate user and get JWT token

### Customers
- `GET /api/customers` - Get all customers
- `GET /api/customers/:id` - Get customer by ID
- `POST /api/customers` - Create new customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Campaigns
- `GET /api/campaigns` - Get all campaigns
- `GET /api/campaigns/:id` - Get campaign by ID
- `POST /api/campaigns` - Create new campaign
- `POST /api/campaigns/preview` - Preview audience size for rules
- `POST /api/campaigns/:id/execute` - Execute campaign

### AI
- `POST /api/ai/segment` - Generate segment rules from natural language
- `POST /api/ai/message` - Generate message suggestions for campaign

## License

MIT
