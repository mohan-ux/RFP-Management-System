# RFP Management System - API Documentation

**Version:** 1.0.0  
**Base URL:** `http://localhost:5000/api`  
**Content-Type:** `application/json`

---

## Table of Contents

1. [Overview](#overview)
2. [RFP Management APIs](#rfp-management-apis)
3. [Vendor Management APIs](#vendor-management-apis)
4. [Error Responses](#error-responses)
5. [Environment Configuration](#environment-configuration)

---

## Overview

The RFP Management System API provides endpoints for creating, managing, and processing Request for Proposals (RFPs) with AI-powered features including:

- Natural language RFP generation using Gemini AI
- Email-based vendor communication
- Automated email response processing
- AI-powered vendor quote comparison

---

## RFP Management APIs

### 1. Get All RFPs

Retrieves all RFPs with populated vendor information, sorted by creation date.

**Endpoint:** `GET /api/rfp`

**Request:**
```http
GET http://localhost:5000/api/rfp
```

**Response:** `200 OK`
```json
{
  "success": true,
  "count": 2,
  "rfps": [
    {
      "_id": "674a1234567890abcdef1234",
      "user_text": "Need 20 laptops with 16GB RAM for office",
      "llm_response": {
        "title": "Office IT Equipment Procurement",
        "description": "Procurement of laptops for new office setup",
        "deadline": "2025-01-15",
        "budget": {
          "min": 40000,
          "max": 50000,
          "currency": "USD"
        },
        "items": [
          {
            "name": "Laptop",
            "quantity": 20,
            "unit": "pcs",
            "specifications": "16GB RAM, SSD storage"
          }
        ],
        "evaluation_criteria": [
          { "criterion": "Price", "weight": 40 },
          { "criterion": "Quality", "weight": 35 },
          { "criterion": "Delivery Time", "weight": 25 }
        ],
        "terms": "Payment terms: Net 30 days"
      },
      "choosed_vendors": [
        {
          "_id": "674b5678901234abcdef5678",
          "name": "Tech Solutions Inc",
          "email": "contact@techsolutions.com",
          "company": "Tech Solutions Inc"
        }
      ],
      "mail_content": [],
      "status": "Review RFP",
      "createdAt": "2025-12-01T10:30:00.000Z",
      "updatedAt": "2025-12-01T10:45:00.000Z"
    }
  ]
}
```

---

### 2. Get Single RFP

Retrieves a single RFP by ID with all populated relationships.

**Endpoint:** `GET /api/rfp/:id`

**URL Parameters:**
- `id` (required) - MongoDB ObjectId of the RFP

**Request:**
```http
GET http://localhost:5000/api/rfp/674a1234567890abcdef1234
```

**Response:** `200 OK`
```json
{
  "success": true,
  "rfp": {
    "_id": "674a1234567890abcdef1234",
    "user_text": "Need 20 laptops with 16GB RAM for office",
    "llm_response": { ... },
    "choosed_vendors": [ ... ],
    "mail_content": [ ... ],
    "status": "Review RFP",
    "createdAt": "2025-12-01T10:30:00.000Z",
    "updatedAt": "2025-12-01T10:45:00.000Z"
  }
}
```

**Error Response:** `404 Not Found`
```json
{
  "success": false,
  "message": "RFP not found"
}
```

---

### 3. Create New RFP

Creates a new empty RFP with initial status "New".

**Endpoint:** `POST /api/rfp`

**Request:**
```http
POST http://localhost:5000/api/rfp
Content-Type: application/json

{}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "RFP created successfully",
  "rfp": {
    "_id": "674a1234567890abcdef1234",
    "user_text": "",
    "llm_response": {},
    "choosed_vendors": [],
    "mail_content": [],
    "status": "New",
    "createdAt": "2025-12-04T10:30:00.000Z",
    "updatedAt": "2025-12-04T10:30:00.000Z"
  }
}
```

---

### 4. Generate RFP from Text (AI)

Converts natural language text into a structured RFP using Gemini AI. The system tries multiple Gemini models (2.5-flash, 2.5-pro, 1.5-flash, 1.5-pro, gemini-pro) in fallback order.

**Endpoint:** `POST /api/rfp/generate-from-text`

**Request:**
```http
POST http://localhost:5000/api/rfp/generate-from-text
Content-Type: application/json

{
  "user_text": "I need to procure 20 laptops with 16GB RAM and 15 monitors (27-inch) for our new office. Budget is around $50,000. Need delivery within 30 days. Payment terms should be net 30."
}
```

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| user_text | string | Yes | Natural language description of RFP requirements |

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "RFP generated successfully",
  "llm_response": {
    "title": "Office IT Equipment Procurement",
    "description": "Procurement of laptops and monitors for new office setup",
    "deadline": "2025-01-03",
    "budget": {
      "min": 40000,
      "max": 50000,
      "currency": "USD"
    },
    "items": [
      {
        "name": "Laptop",
        "quantity": 20,
        "unit": "pcs",
        "specifications": "16GB RAM, SSD storage"
      },
      {
        "name": "Monitor",
        "quantity": 15,
        "unit": "pcs",
        "specifications": "27-inch display"
      }
    ],
    "evaluation_criteria": [
      { "criterion": "Price", "weight": 40 },
      { "criterion": "Quality", "weight": 35 },
      { "criterion": "Delivery Time", "weight": 25 }
    ],
    "terms": "Payment terms: Net 30 days. Delivery within 30 days."
  }
}
```

**Error Responses:**

`400 Bad Request`
```json
{
  "success": false,
  "message": "User text is required"
}
```

`503 Service Unavailable`
```json
{
  "success": false,
  "message": "Failed to generate RFP. All Gemini models are unavailable. Please check your API key and try again."
}
```

---

### 5. Update RFP - Describe Step

Updates RFP with user text and AI-generated response. Sets status to "Review RFP".

**Endpoint:** `PUT /api/rfp/:id/describe`

**URL Parameters:**
- `id` (required) - MongoDB ObjectId of the RFP

**Request:**
```http
PUT http://localhost:5000/api/rfp/674a1234567890abcdef1234/describe
Content-Type: application/json

{
  "user_text": "Need 20 laptops with 16GB RAM for office",
  "llm_response": {
    "title": "Office IT Equipment Procurement",
    "description": "Procurement of laptops",
    "deadline": "2025-01-15",
    "budget": { "min": 40000, "max": 50000, "currency": "USD" },
    "items": [ ... ],
    "evaluation_criteria": [ ... ],
    "terms": "Net 30 days"
  }
}
```

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| user_text | string | Yes | Original user input text |
| llm_response | object | Yes | AI-generated structured RFP |

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "RFP updated successfully. Status: Review RFP",
  "rfp": {
    "_id": "674a1234567890abcdef1234",
    "user_text": "Need 20 laptops with 16GB RAM for office",
    "llm_response": { ... },
    "status": "Review RFP",
    "updatedAt": "2025-12-04T10:35:00.000Z"
  }
}
```

---

### 6. Update RFP - Review Step

Updates RFP with user-customized data after reviewing AI-generated content.

**Endpoint:** `PUT /api/rfp/:id/review`

**URL Parameters:**
- `id` (required) - MongoDB ObjectId of the RFP

**Request:**
```http
PUT http://localhost:5000/api/rfp/674a1234567890abcdef1234/review
Content-Type: application/json

{
  "llm_response": {
    "title": "Updated Office IT Equipment Procurement",
    "description": "Modified description with additional requirements",
    "deadline": "2025-01-20",
    "budget": { "min": 45000, "max": 55000, "currency": "USD" },
    "items": [ ... ],
    "evaluation_criteria": [ ... ],
    "terms": "Updated payment terms"
  }
}
```

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| llm_response | object | Yes | User-modified RFP structure |

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "RFP customization saved successfully",
  "rfp": {
    "_id": "674a1234567890abcdef1234",
    "llm_response": { ... },
    "updatedAt": "2025-12-04T10:40:00.000Z"
  }
}
```

---

### 7. Send RFP to Vendors

Sends RFP via email to selected vendors using SMTP. Updates RFP status to "Vendors Choosed".

**Endpoint:** `POST /api/rfp/:id/send-to-vendors`

**URL Parameters:**
- `id` (required) - MongoDB ObjectId of the RFP

**Request:**
```http
POST http://localhost:5000/api/rfp/674a1234567890abcdef1234/send-to-vendors
Content-Type: application/json

{
  "vendor_ids": [
    "674b5678901234abcdef5678",
    "674b5678901234abcdef5679"
  ]
}
```

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| vendor_ids | array[string] | Yes | Array of vendor MongoDB ObjectIds |

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "RFP sent to 2 vendors",
  "emailResults": [
    {
      "success": true,
      "messageId": "<abc123@mail.server>",
      "vendorEmail": "contact@techsolutions.com",
      "vendorName": "Tech Solutions Inc",
      "sentAt": "2025-12-04T10:30:00.000Z"
    },
    {
      "success": true,
      "messageId": "<def456@mail.server>",
      "vendorEmail": "sales@globalsuppliers.com",
      "vendorName": "Global Suppliers Co",
      "sentAt": "2025-12-04T10:30:01.000Z"
    }
  ],
  "status": "Vendors Choosed"
}
```

**Error Responses:**

`400 Bad Request`
```json
{
  "success": false,
  "message": "At least one vendor must be selected"
}
```

`404 Not Found`
```json
{
  "success": false,
  "message": "No vendors found with provided IDs"
}
```

---

### 8. Get Inbox Emails

Fetches RFP-related emails from inbox via IMAP. Filters emails by RFP reference or keywords.

**Endpoint:** `GET /api/rfp/emails/inbox`

**Query Parameters:**
- `limit` (optional) - Maximum emails to fetch (default: 20)
- `rfpOnly` (optional) - Filter only RFP-related emails (default: true)

**Request:**
```http
GET http://localhost:5000/api/rfp/emails/inbox?limit=20&rfpOnly=true
```

**Response:** `200 OK`
```json
{
  "success": true,
  "count": 2,
  "emails": [
    {
      "id": "email-001",
      "uid": 123,
      "from": "vendor@techsolutions.com",
      "subject": "RE: RFP Request - Quote Submission [REF: 674a1234567890abcdef1234]",
      "date": "2025-12-04T09:15:00.000Z",
      "body": "Thank you for the RFP. Our quote: $45,000 with 2 year warranty. Delivery in 3 weeks.",
      "html": "<p>Thank you...</p>",
      "isRFPResponse": true,
      "rfpId": "674a1234567890abcdef1234"
    }
  ]
}
```

**Error Response:** `503 Service Unavailable`
```json
{
  "success": false,
  "message": "Email inbox is not configured. Please set IMAP_HOST, IMAP_USER, and IMAP_PASSWORD in environment variables."
}
```

---

### 9. Process Received Email

Uses Gemini AI to identify which RFP an email belongs to and extract vendor quote details.

**Endpoint:** `POST /api/rfp/emails/process`

**Request:**
```http
POST http://localhost:5000/api/rfp/emails/process
Content-Type: application/json

{
  "email_content": "Thank you for the RFP. Our quote: $45,000 with 2 year warranty. Delivery in 3 weeks.",
  "email_subject": "RE: RFP Request - Quote Submission",
  "from_email": "vendor@techsolutions.com"
}
```

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email_content | string | Yes | Email body content |
| email_subject | string | No | Email subject line |
| from_email | string | No | Sender email address |

**Response:** `200 OK`
```json
{
  "success": true,
  "identification": {
    "rfp_id": "674a1234567890abcdef1234",
    "vendor_name": "Tech Solutions Inc",
    "vendor_email": "vendor@techsolutions.com",
    "quote_details": {
      "price": 45000,
      "currency": "USD",
      "delivery_time": "3 weeks",
      "warranty": "2 years"
    },
    "confidence": 95,
    "reasoning": "Email contains RFP reference and vendor details match database"
  },
  "vendor": {
    "id": "674b5678901234abcdef5678",
    "name": "Tech Solutions Inc",
    "email": "contact@techsolutions.com"
  }
}
```

**Error Response:** `503 Service Unavailable`
```json
{
  "success": false,
  "message": "Failed to identify RFP from email: All Gemini models are unavailable. Please check your API key and try again."
}
```

---

### 10. Add Vendor Mail Response

Adds a vendor's email response to the RFP. Updates status to "Vendors Responded".

**Endpoint:** `PUT /api/rfp/:id/add-mail-response`

**URL Parameters:**
- `id` (required) - MongoDB ObjectId of the RFP

**Request:**
```http
PUT http://localhost:5000/api/rfp/674a1234567890abcdef1234/add-mail-response
Content-Type: application/json

{
  "vendor_id": "674b5678901234abcdef5678",
  "mail_body": {
    "price": 45000,
    "delivery_time": "3 weeks",
    "warranty": "2 years",
    "additional_notes": "Free installation included"
  },
  "mail_subject": "RE: RFP Request - Quote Submission",
  "from_email": "vendor@techsolutions.com"
}
```

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| vendor_id | string | No | MongoDB ObjectId of vendor (auto-detected if missing) |
| mail_body | object | Yes | Parsed email content with quote details |
| mail_subject | string | No | Email subject line |
| from_email | string | No | Sender email (used to find vendor if ID missing) |

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Vendor response added successfully",
  "rfp": {
    "_id": "674a1234567890abcdef1234",
    "mail_content": [
      {
        "vendor_id": {
          "_id": "674b5678901234abcdef5678",
          "name": "Tech Solutions Inc",
          "email": "contact@techsolutions.com",
          "company": "Tech Solutions Inc"
        },
        "time_mail_received": "2025-12-04T09:15:00.000Z",
        "mail_body": {
          "price": 45000,
          "delivery_time": "3 weeks",
          "warranty": "2 years",
          "additional_notes": "Free installation included"
        },
        "mail_subject": "RE: RFP Request - Quote Submission"
      }
    ],
    "status": "Vendors Responded"
  }
}
```

---

### 11. Get Vendor Responses

Retrieves all vendor email responses for a specific RFP.

**Endpoint:** `GET /api/rfp/:id/vendor-responses`

**URL Parameters:**
- `id` (required) - MongoDB ObjectId of the RFP

**Request:**
```http
GET http://localhost:5000/api/rfp/674a1234567890abcdef1234/vendor-responses
```

**Response:** `200 OK`
```json
{
  "success": true,
  "rfp_id": "674a1234567890abcdef1234",
  "mail_content": [
    {
      "vendor_id": {
        "_id": "674b5678901234abcdef5678",
        "name": "Tech Solutions Inc",
        "email": "contact@techsolutions.com",
        "company": "Tech Solutions Inc",
        "category": "IT Equipment"
      },
      "time_mail_received": "2025-12-04T09:15:00.000Z",
      "mail_body": {
        "price": 45000,
        "delivery_time": "3 weeks",
        "warranty": "2 years"
      },
      "mail_subject": "RE: RFP Request - Quote Submission"
    }
  ],
  "choosed_vendors": [
    {
      "_id": "674b5678901234abcdef5678",
      "name": "Tech Solutions Inc",
      "email": "contact@techsolutions.com",
      "company": "Tech Solutions Inc",
      "category": "IT Equipment"
    }
  ]
}
```

---

### 12. Compare Vendor Quotes (AI)

Uses Gemini AI to analyze and compare all vendor quotes. Provides recommendations for best price, warranty, and overall value.

**Endpoint:** `POST /api/rfp/:id/compare-quotes`

**URL Parameters:**
- `id` (required) - MongoDB ObjectId of the RFP

**Request:**
```http
POST http://localhost:5000/api/rfp/674a1234567890abcdef1234/compare-quotes
Content-Type: application/json

{}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Quote comparison completed",
  "comparison": {
    "best_price": {
      "vendor_id": "674b5678901234abcdef5678",
      "vendor_name": "Tech Solutions Inc",
      "price": 45000,
      "reasoning": "Lowest quoted price among all vendors"
    },
    "best_warranty": {
      "vendor_id": "674b5678901234abcdef5679",
      "vendor_name": "Global Suppliers Co",
      "warranty": "3 years",
      "reasoning": "Longest warranty period offered"
    },
    "best_overall": {
      "vendor_id": "674b5678901234abcdef5678",
      "vendor_name": "Tech Solutions Inc",
      "score": 92,
      "reasoning": "Best combination of price, warranty, and delivery time"
    },
    "comparison_table": [
      {
        "vendor_id": "674b5678901234abcdef5678",
        "vendor_name": "Tech Solutions Inc",
        "price": 45000,
        "warranty": "2 years",
        "delivery_time": "3 weeks",
        "score": 92,
        "pros": ["Competitive pricing", "Fast delivery", "Free installation"],
        "cons": ["Standard warranty only"]
      }
    ],
    "summary": "Tech Solutions Inc offers the best overall value with competitive pricing and reliable delivery timeline."
  },
  "status": "View Quotes"
}
```

**Error Responses:**

`400 Bad Request`
```json
{
  "success": false,
  "message": "No vendor responses to compare"
}
```

`503 Service Unavailable`
```json
{
  "success": false,
  "message": "Failed to compare vendor quotes. All Gemini models are unavailable. Please check your API key and try again."
}
```

---

### 13. Update RFP Status

Updates the workflow status of an RFP.

**Endpoint:** `PUT /api/rfp/:id/status`

**URL Parameters:**
- `id` (required) - MongoDB ObjectId of the RFP

**Request:**
```http
PUT http://localhost:5000/api/rfp/674a1234567890abcdef1234/status
Content-Type: application/json

{
  "status": "Completed"
}
```

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| status | string | Yes | New status value |

**Valid Status Values:**
- `New` - Initial state
- `Review RFP` - After AI generation
- `Vendors Choosed` - After sending to vendors
- `Vendors Responded` - After receiving responses
- `View Quotes` - After AI comparison
- `Completed` - Final state

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Status updated to: Completed",
  "rfp": {
    "_id": "674a1234567890abcdef1234",
    "status": "Completed",
    "updatedAt": "2025-12-04T11:00:00.000Z"
  }
}
```

---

### 14. Update RFP (General)

General purpose update endpoint for backward compatibility.

**Endpoint:** `PUT /api/rfp/:id`

**URL Parameters:**
- `id` (required) - MongoDB ObjectId of the RFP

**Request:**
```http
PUT http://localhost:5000/api/rfp/674a1234567890abcdef1234
Content-Type: application/json

{
  "status": "Completed",
  "notes": "Project completed successfully"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "rfp": {
    "_id": "674a1234567890abcdef1234",
    "status": "Completed",
    "notes": "Project completed successfully",
    "updatedAt": "2025-12-04T11:00:00.000Z"
  }
}
```

---

### 15. Delete RFP

Permanently deletes an RFP from the database.

**Endpoint:** `DELETE /api/rfp/:id`

**URL Parameters:**
- `id` (required) - MongoDB ObjectId of the RFP

**Request:**
```http
DELETE http://localhost:5000/api/rfp/674a1234567890abcdef1234
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "RFP deleted successfully",
  "deletedId": "674a1234567890abcdef1234"
}
```

**Error Response:** `404 Not Found`
```json
{
  "success": false,
  "message": "RFP not found"
}
```

---

## Vendor Management APIs

### 1. Get All Vendors

Retrieves all vendors from the database, sorted by creation date.

**Endpoint:** `GET /api/vendors`

**Request:**
```http
GET http://localhost:5000/api/vendors
```

**Response:** `200 OK`
```json
{
  "success": true,
  "vendors": [
    {
      "_id": "674b5678901234abcdef5678",
      "name": "Tech Solutions Inc",
      "company": "Tech Solutions Inc",
      "email": "contact@techsolutions.com",
      "phone": "+1-555-0101",
      "category": "IT Equipment",
      "address": "123 Tech Street, Silicon Valley, CA",
      "createdAt": "2025-11-15T10:00:00.000Z",
      "updatedAt": "2025-11-15T10:00:00.000Z"
    }
  ]
}
```

---

### 2. Get Single Vendor

Retrieves a specific vendor by ID.

**Endpoint:** `GET /api/vendors/:id`

**URL Parameters:**
- `id` (required) - MongoDB ObjectId of the vendor

**Request:**
```http
GET http://localhost:5000/api/vendors/674b5678901234abcdef5678
```

**Response:** `200 OK`
```json
{
  "success": true,
  "vendor": {
    "_id": "674b5678901234abcdef5678",
    "name": "Tech Solutions Inc",
    "company": "Tech Solutions Inc",
    "email": "contact@techsolutions.com",
    "phone": "+1-555-0101",
    "category": "IT Equipment",
    "address": "123 Tech Street, Silicon Valley, CA",
    "createdAt": "2025-11-15T10:00:00.000Z",
    "updatedAt": "2025-11-15T10:00:00.000Z"
  }
}
```

**Error Response:** `404 Not Found`
```json
{
  "success": false,
  "message": "Vendor not found"
}
```

---

### 3. Create Vendor

Creates a new vendor in the database.

**Endpoint:** `POST /api/vendors`

**Request:**
```http
POST http://localhost:5000/api/vendors
Content-Type: application/json

{
  "name": "Tech Solutions Inc",
  "company": "Tech Solutions Inc",
  "email": "contact@techsolutions.com",
  "phone": "+1-555-0101",
  "category": "IT Equipment",
  "address": "123 Tech Street, Silicon Valley, CA"
}
```

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | Yes | Vendor contact name |
| email | string | Yes | Vendor email (must be unique) |
| company | string | No | Company name |
| phone | string | No | Contact phone number |
| category | string | No | Vendor category/specialty |
| address | string | No | Physical address |

**Response:** `201 Created`
```json
{
  "success": true,
  "vendor": {
    "_id": "674b5678901234abcdef5678",
    "name": "Tech Solutions Inc",
    "company": "Tech Solutions Inc",
    "email": "contact@techsolutions.com",
    "phone": "+1-555-0101",
    "category": "IT Equipment",
    "address": "123 Tech Street, Silicon Valley, CA",
    "createdAt": "2025-12-04T10:30:00.000Z",
    "updatedAt": "2025-12-04T10:30:00.000Z"
  }
}
```

**Error Response:** `400 Bad Request`
```json
{
  "success": false,
  "message": "Vendor with this email already exists"
}
```

---

### 4. Update Vendor

Updates an existing vendor's information.

**Endpoint:** `PUT /api/vendors/:id`

**URL Parameters:**
- `id` (required) - MongoDB ObjectId of the vendor

**Request:**
```http
PUT http://localhost:5000/api/vendors/674b5678901234abcdef5678
Content-Type: application/json

{
  "name": "Tech Solutions Inc - Updated",
  "phone": "+1-555-0199",
  "category": "IT Services & Equipment"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "vendor": {
    "_id": "674b5678901234abcdef5678",
    "name": "Tech Solutions Inc - Updated",
    "company": "Tech Solutions Inc",
    "email": "contact@techsolutions.com",
    "phone": "+1-555-0199",
    "category": "IT Services & Equipment",
    "address": "123 Tech Street, Silicon Valley, CA",
    "createdAt": "2025-11-15T10:00:00.000Z",
    "updatedAt": "2025-12-04T11:00:00.000Z"
  }
}
```

---

### 5. Delete Vendor

Permanently deletes a vendor from the database.

**Endpoint:** `DELETE /api/vendors/:id`

**URL Parameters:**
- `id` (required) - MongoDB ObjectId of the vendor

**Request:**
```http
DELETE http://localhost:5000/api/vendors/674b5678901234abcdef5678
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Vendor deleted successfully"
}
```

**Error Response:** `404 Not Found`
```json
{
  "success": false,
  "message": "Vendor not found"
}
```

---

## Error Responses

### Standard Error Format

All error responses follow this consistent format:

```json
{
  "success": false,
  "message": "Error description"
}
```

In development mode (`NODE_ENV=development`), a stack trace is included:

```json
{
  "success": false,
  "message": "Error description",
  "stack": "Error: ...\n    at ..."
}
```

---

### HTTP Status Codes

| Status Code | Description | Common Causes |
|-------------|-------------|---------------|
| `200` | OK | Successful GET/PUT/DELETE request |
| `201` | Created | Successful POST request |
| `400` | Bad Request | Invalid input, missing required fields, invalid ObjectId |
| `404` | Not Found | Resource not found in database |
| `503` | Service Unavailable | AI service down, email service not configured |
| `500` | Internal Server Error | Unexpected server error |

---

### Common Error Messages

#### Validation Errors (400)
```json
{ "success": false, "message": "Invalid RFP ID" }
{ "success": false, "message": "Invalid Vendor ID" }
{ "success": false, "message": "User text is required" }
{ "success": false, "message": "At least one vendor must be selected" }
{ "success": false, "message": "Mail body is required" }
{ "success": false, "message": "Email content is required" }
```

#### Not Found Errors (404)
```json
{ "success": false, "message": "RFP not found" }
{ "success": false, "message": "Vendor not found" }
{ "success": false, "message": "No vendors found with provided IDs" }
{ "success": false, "message": "No vendor responses to compare" }
```

#### Service Errors (503)
```json
{
  "success": false,
  "message": "Failed to generate RFP. All Gemini models are unavailable. Please check your API key and try again."
}
```

```json
{
  "success": false,
  "message": "Failed to identify RFP from email: All Gemini models are unavailable. Please check your API key and try again."
}
```

```json
{
  "success": false,
  "message": "Failed to compare vendor quotes. All Gemini models are unavailable. Please check your API key and try again."
}
```

```json
{
  "success": false,
  "message": "Email inbox is not configured. Please set IMAP_HOST, IMAP_USER, and IMAP_PASSWORD in environment variables."
}
```

---

## Environment Configuration

### Required Environment Variables

Create a `.env` file in the backend root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=production

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/rfp-management

# Gemini AI Configuration (Required for AI features)
GEMINI_API_KEY=your_gemini_api_key_here

# Email Configuration - SMTP (Required for sending emails)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_specific_password

# Email Configuration - IMAP (Required for receiving emails)
IMAP_HOST=imap.gmail.com
IMAP_PORT=993
IMAP_USER=your_email@gmail.com
IMAP_PASSWORD=your_app_specific_password
```

### Configuration Notes

1. **Gemini API Key**: Obtain from [Google AI Studio](https://makersuite.google.com/app/apikey)

2. **Gmail Configuration**:
   - Enable 2-Factor Authentication
   - Generate App-Specific Password
   - Use the same credentials for both SMTP and IMAP

3. **MongoDB**: Ensure MongoDB is running on the specified URI

4. **Port**: Default is 5000, can be changed via PORT variable

---

## API Workflow

### RFP Creation Workflow

The typical workflow follows these steps:

```
1. Create RFP (POST /api/rfp)
   ↓
2. Generate from Text (POST /api/rfp/generate-from-text)
   ↓
3. Update Describe (PUT /api/rfp/:id/describe)
   ↓ Status: "Review RFP"
4. Update Review (PUT /api/rfp/:id/review)
   ↓
5. Send to Vendors (POST /api/rfp/:id/send-to-vendors)
   ↓ Status: "Vendors Choosed"
6. Check Inbox (GET /api/rfp/emails/inbox)
   ↓
7. Process Email (POST /api/rfp/emails/process)
   ↓
8. Add Vendor Response (PUT /api/rfp/:id/add-mail-response)
   ↓ Status: "Vendors Responded"
9. Get Vendor Responses (GET /api/rfp/:id/vendor-responses)
   ↓
10. Compare Quotes (POST /api/rfp/:id/compare-quotes)
   ↓ Status: "View Quotes"
11. Update Status (PUT /api/rfp/:id/status) → "Completed"
```

---

## Additional Notes

### AI Features

The system uses **Google Gemini AI** with a fallback mechanism:
1. Tries Gemini 2.5 Flash (fastest)
2. Falls back to Gemini 2.5 Pro
3. Falls back to Gemini 1.5 Flash
4. Falls back to Gemini 1.5 Pro
5. Falls back to Gemini Pro (legacy)

### Email Integration

- **Sending**: Uses Nodemailer with SMTP
- **Receiving**: Uses IMAP with `mailparser`
- **Features**: 
  - HTML email templates
  - RFP reference tracking
  - Automatic vendor matching
  - Quote extraction

### Security Considerations

⚠️ **Important**: This API currently has no authentication or authorization. For production deployment:

1. Implement JWT or OAuth authentication
2. Add rate limiting
3. Configure proper CORS settings
4. Use HTTPS
5. Secure environment variables
6. Implement request validation middleware

---

**Last Updated:** December 4, 2025  
**Version:** 1.0.0  
**Maintained By:** RFP Management Team
