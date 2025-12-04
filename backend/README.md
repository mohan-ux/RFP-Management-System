# RFP Management System - Backend

Backend API server for the RFP Management System built with Node.js, Express, and MongoDB.

## Features

- RESTful API for RFP, Vendor, and Proposal management
- MongoDB database with Mongoose ODM
- Email integration support (Nodemailer)
- AI integration support (OpenAI)
- Error handling middleware
- CORS enabled
- Request logging with Morgan

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Email**: Nodemailer (configured for production)
- **AI**: OpenAI API (configured for production)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
Create a `.env` file in the root directory (see `.env` for template)

3. Start MongoDB:
Make sure MongoDB is running on `mongodb://localhost:27017`

4. Seed database (optional):
```bash
npm run seed
```

5. Start server:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### RFP Endpoints
- `GET /api/rfp` - Get all RFPs
- `GET /api/rfp/:id` - Get RFP by ID
- `POST /api/rfp` - Create new RFP
- `POST /api/rfp/create-from-text` - Create RFP from text
- `PUT /api/rfp/:id` - Update RFP
- `DELETE /api/rfp/:id` - Delete RFP
- `POST /api/rfp/:rfpId/send` - Send RFP to vendors
- `PUT /api/rfp/:id/status` - Update RFP status
- `POST /api/rfp/:rfpId/award` - Award RFP to vendor

### Vendor Endpoints
- `GET /api/vendors` - Get all vendors
- `GET /api/vendors/:id` - Get vendor by ID
- `POST /api/vendors` - Create new vendor
- `PUT /api/vendors/:id` - Update vendor
- `DELETE /api/vendors/:id` - Delete vendor

### Proposal Endpoints
- `GET /api/proposals` - Get all proposals
- `GET /api/proposals/rfp/:rfpId` - Get proposals by RFP
- `GET /api/proposals/:id` - Get proposal by ID
- `POST /api/proposals/manual` - Create manual proposal
- `PUT /api/proposals/:id` - Update proposal
- `PUT /api/proposals/:id/status` - Update proposal status
- `DELETE /api/proposals/:id` - Delete proposal
- `POST /api/proposals/:id/reparse` - Reparse proposal with AI
- `GET /api/proposals/rfp/:rfpId/compare` - Compare proposals

### Email Endpoints
- `POST /api/email/test-send` - Send test email
- `POST /api/email/check-inbox` - Check inbox for proposals
- `GET /api/email/status` - Get email service status
- `POST /api/email/send-rfp/:rfpId` - Send RFP via email

### AI Endpoints
- `POST /api/ai/analyze-proposals/:rfpId` - Analyze proposals with AI
- `POST /api/ai/generate-rfp` - Generate RFP from text
- `POST /api/ai/parse-rfp` - Parse RFP text
- `POST /api/ai/parse-proposal/:proposalId` - Parse proposal with AI

## Project Structure

```
backend/
├── config/
│   └── db.js                 # MongoDB connection
├── controllers/
│   ├── ai.controller.js      # AI endpoints logic
│   ├── email.controller.js   # Email endpoints logic
│   ├── proposal.controller.js # Proposal CRUD
│   ├── rfp.controller.js     # RFP CRUD
│   └── vendor.controller.js  # Vendor CRUD
├── middleware/
│   └── errorHandler.js       # Error handling
├── models/
│   ├── Proposal.js           # Proposal schema
│   ├── RFP.js                # RFP schema
│   └── Vendor.js             # Vendor schema
├── routes/
│   ├── ai.routes.js          # AI routes
│   ├── email.routes.js       # Email routes
│   ├── proposal.routes.js    # Proposal routes
│   ├── rfp.routes.js         # RFP routes
│   └── vendor.routes.js      # Vendor routes
├── .env                      # Environment variables
├── package.json              # Dependencies
├── seed.js                   # Database seeder
└── server.js                 # Entry point
```

## Environment Variables

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/rfp-management
ALLOWED_ORIGINS=http://localhost:5173

# Optional: For production features
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

OPENAI_API_KEY=your-openai-key
AI_MODEL=gpt-4
```

## Database Models

### RFP Schema
- title, description, status, deadline
- budget (min, max, currency)
- items, evaluationCriteria, terms
- vendors (array), awardedVendor
- timestamps

### Vendor Schema
- name, company, email (unique)
- phone, category, address
- timestamps

### Proposal Schema
- rfpId, vendorId
- price, deliveryTime, warranty, terms
- status, aiScore, aiAnalysis
- timestamps

## Development Notes

- The AI and Email features use mock implementations by default
- To enable real AI features, add your OpenAI API key to `.env`
- To enable email features, configure SMTP settings in `.env`
- All API responses follow the format: `{ data: {...}, success: true }`
- Errors are handled globally and return: `{ message: "...", success: false }`

## License

ISC
