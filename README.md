
# Xeno Mini CRM Platform

## Project Overview

This is a comprehensive Mini CRM Platform developed for the 2025 SDE Internship Assignment at Xeno. The platform provides a complete solution for managing customer data, creating audience segments with dynamic rules, and running personalized campaigns.

## Features

### 1. Data Ingestion APIs

- REST APIs for customer and order data
- JSON request/response payloads
- Input validation for email formats, amounts, etc.
- Complete API documentation

### 2. Campaign Creation UI

- Audience Segmentation with dynamic rule builder (AND/OR logic)
- Intuitive drag-and-drop rule building experience
- Real-time audience size preview
- Campaign history with detailed statistics

### 3. Campaign Delivery & Logging

- Personalized message templates
- Delivery status tracking (SENT/FAILED)
- Communication logs for each campaign

### 4. Authentication

- Google OAuth 2.0 integration
- Protected routes for authenticated users only

### 5. AI Integration

- Natural Language to Segment Rules conversion
- AI-driven message suggestions based on campaign objectives
- Product/offer image recommendations

## Tech Stack

- **Frontend**: React.js with TypeScript
- **UI Library**: Tailwind CSS + shadcn/ui components
- **State Management**: React Query
- **Routing**: React Router
- **Authentication**: Google OAuth 2.0
- **AI Integration**: OpenAI API

## Project Structure

```
src/
├── components/         # UI components
│   ├── campaigns/      # Campaign-related components
│   ├── customers/      # Customer-related components
│   ├── layout/         # Layout components (Sidebar, Navbar)
│   ├── segments/       # Segmentation components
│   └── ui/             # UI components from shadcn
├── contexts/           # React contexts
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── pages/              # Page components
├── services/           # API services
└── types/              # TypeScript type definitions
```

## Setup Instructions

### Prerequisites

- Node.js (v16+)
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/xeno-mini-crm.git
   cd xeno-mini-crm
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Open [http://localhost:8080](http://localhost:8080) to view the app in your browser.

## API Documentation

The project includes comprehensive API documentation for all endpoints. In the application, navigate to:

- `/api-docs` for the Swagger UI documentation
- See the API documentation in the README for detailed request/response examples

## Database Schema

### Customers Table

| Column | Type | Description |
|--------|------|-------------|
| id | string | Primary key |
| name | string | Customer name |
| email | string | Customer email |
| phone | string | Customer phone number |
| total_spend | number | Total amount spent |
| last_purchase_date | date | Date of last purchase |
| visit_count | number | Number of visits |
| created_at | datetime | Record creation timestamp |
| updated_at | datetime | Record update timestamp |

### Orders Table

| Column | Type | Description |
|--------|------|-------------|
| order_id | string | Primary key |
| customer_id | string | Foreign key to customers.id |
| order_date | date | Date of the order |
| amount | number | Order amount |
| created_at | datetime | Record creation timestamp |
| updated_at | datetime | Record update timestamp |

### Campaigns Table

| Column | Type | Description |
|--------|------|-------------|
| id | string | Primary key |
| name | string | Campaign name |
| description | string | Campaign description |
| rules | json | Segment rules |
| audience_size | number | Size of the target audience |
| sent_count | number | Number of messages sent |
| failed_count | number | Number of messages failed |
| status | enum | Campaign status (draft, sending, completed, failed) |
| created_at | datetime | Record creation timestamp |
| updated_at | datetime | Record update timestamp |

### Communication Logs Table

| Column | Type | Description |
|--------|------|-------------|
| id | string | Primary key |
| campaign_id | string | Foreign key to campaigns.id |
| customer_id | string | Foreign key to customers.id |
| message | string | The message sent |
| status | enum | Delivery status (SENT, FAILED, PENDING) |
| timestamp | datetime | Timestamp of the communication |

## AI Integration

This project uses OpenAI's GPT-4 API for two main features:

1. **Natural Language to Segment Rules**: Converts plain language descriptions of customer segments into structured rules that can be used by the platform.

2. **Message Generation**: Suggests personalized message templates based on campaign objectives and targeted segments.

The AI integration was chosen for its ability to process natural language efficiently and generate context-aware suggestions, which significantly improves the user experience by making complex segmentation accessible to non-technical users.

## Demo Script

1. **Introduction (30 seconds)**
   - Brief overview of the Mini CRM Platform
   - Highlight key features: data management, segmentation, campaigns, AI integration

2. **Login (15 seconds)**
   - Demonstrate Google OAuth login
   - Show the dashboard overview

3. **Customer Management (1 minute)**
   - Navigate to the Customers section
   - Show the list of customers
   - Demonstrate search and filtering capabilities
   - Show customer details view

4. **Segment Creation (2 minutes)**
   - Navigate to Segments section
   - Demonstrate the visual rule builder
     - Create a complex segment with AND/OR conditions
     - Show real-time audience size updates
   - Demonstrate natural language segment creation
     - Enter a prompt: "People who haven't shopped in 6 months and spent over ₹5K"
     - Show the AI-generated rules
     - Explain how the AI works behind the scenes

5. **Campaign Creation (2 minutes)**
   - Navigate to Campaigns section
   - Create a new campaign
   - Select the previously created segment
   - Show message creation with personalization tokens
   - Demonstrate AI message suggestions
     - Enter objective: "bring back inactive users"
     - Show the generated message variants
   - Save the campaign

6. **Campaign Execution and Monitoring (1 minute)**
   - Execute the campaign
   - Show the communication logs
   - Demonstrate the campaign statistics dashboard with delivery rates

7. **API Documentation (30 seconds)**
   - Briefly show the API documentation
   - Highlight the most important endpoints

8. **Conclusion (15 seconds)**
   - Recap the key features demonstrated
   - Q&A

## License

This project was created for the Xeno SDE Internship Assignment and is not licensed for public use.
