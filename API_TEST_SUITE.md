# RFP Management System - API Test Suite

Complete positive and negative test cases for all API endpoints.

**Test Date:** December 4, 2025  
**Environment:** Development (http://localhost:5000)  
**Database:** MongoDB

---

## 📋 Test Execution Summary

| Category | Total Tests | Passed | Failed | Status |
|----------|-------------|--------|--------|--------|
| Vendor APIs | 10 | - | - | ⏳ Ready |
| RFP APIs | 15 | - | - | ⏳ Ready |
| AI Features | 3 | - | - | ⏳ Ready |
| Email Features | 2 | - | - | ⏳ Ready |
| Error Handling | 10 | - | - | ⏳ Ready |
| **TOTAL** | **40** | - | - | ⏳ Ready |

---

## 🎯 Test Cases

### Category 1: Vendor Management APIs

#### Test 1.1: Create Vendor (Positive)
**Endpoint:** `POST /api/vendors`  
**Description:** Create a new vendor with all valid fields

**Request:**
```bash
curl -X POST http://localhost:5000/api/vendors \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Tech Solutions Inc",
    "email": "contact@techsolutions.com",
    "company": "Tech Solutions Inc",
    "phone": "+1-555-0100",
    "category": "IT Equipment"
  }'
```

**Expected Response:** `201 Created`
```json
{
  "success": true,
  "message": "Vendor created successfully",
  "vendor": {
    "_id": "unique-id",
    "name": "Tech Solutions Inc",
    "email": "contact@techsolutions.com",
    "company": "Tech Solutions Inc",
    "phone": "+1-555-0100",
    "category": "IT Equipment",
    "createdAt": "2025-12-04T...",
    "updatedAt": "2025-12-04T..."
  }
}
```

**Acceptance Criteria:**
- ✅ Vendor is created in database
- ✅ Response includes unique ObjectId
- ✅ All fields are preserved
- ✅ Timestamps are created

---

#### Test 1.2: Create Vendor (Negative - Missing Required Fields)
**Endpoint:** `POST /api/vendors`  
**Description:** Attempt to create vendor without required fields

**Request:**
```bash
curl -X POST http://localhost:5000/api/vendors \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Incomplete Vendor"
  }'
```

**Expected Response:** `400 Bad Request`
```json
{
  "success": false,
  "message": "Missing required fields: email, company"
}
```

**Acceptance Criteria:**
- ✅ Request is rejected
- ✅ Error message indicates missing fields
- ✅ No vendor is created

---

#### Test 1.3: Get All Vendors (Positive)
**Endpoint:** `GET /api/vendors`  
**Description:** Retrieve list of all vendors

**Request:**
```bash
curl -X GET http://localhost:5000/api/vendors
```

**Expected Response:** `200 OK`
```json
{
  "success": true,
  "count": 3,
  "vendors": [
    {
      "_id": "vendor-id-1",
      "name": "Tech Solutions Inc",
      "email": "contact@techsolutions.com",
      "company": "Tech Solutions Inc",
      "phone": "+1-555-0100",
      "category": "IT Equipment"
    },
    {
      "_id": "vendor-id-2",
      "name": "Office Supplies Co",
      "email": "sales@officesupplies.com",
      "company": "Office Supplies Co",
      "phone": "+1-555-0200",
      "category": "Office Supplies"
    }
  ]
}
```

**Acceptance Criteria:**
- ✅ Returns all vendors in database
- ✅ Count matches actual vendor count
- ✅ Each vendor has complete data

---

#### Test 1.4: Get Single Vendor (Positive)
**Endpoint:** `GET /api/vendors/:id`  
**Description:** Retrieve a specific vendor by ID

**Request:**
```bash
curl -X GET http://localhost:5000/api/vendors/674a1234567890abcdef1234
```

**Expected Response:** `200 OK`
```json
{
  "success": true,
  "vendor": {
    "_id": "674a1234567890abcdef1234",
    "name": "Tech Solutions Inc",
    "email": "contact@techsolutions.com",
    "company": "Tech Solutions Inc",
    "phone": "+1-555-0100",
    "category": "IT Equipment"
  }
}
```

**Acceptance Criteria:**
- ✅ Returns correct vendor
- ✅ All vendor details present
- ✅ Response includes timestamps

---

#### Test 1.5: Get Single Vendor (Negative - Invalid ID)
**Endpoint:** `GET /api/vendors/:id`  
**Description:** Attempt to fetch vendor with invalid ObjectId

**Request:**
```bash
curl -X GET http://localhost:5000/api/vendors/invalid-id-format
```

**Expected Response:** `400 Bad Request` or `404 Not Found`
```json
{
  "success": false,
  "message": "Invalid vendor ID format"
}
```

**Acceptance Criteria:**
- ✅ Request is rejected
- ✅ Appropriate error message
- ✅ No data is returned

---

#### Test 1.6: Update Vendor (Positive)
**Endpoint:** `PUT /api/vendors/:id`  
**Description:** Update vendor information

**Request:**
```bash
curl -X PUT http://localhost:5000/api/vendors/674a1234567890abcdef1234 \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+1-555-9999",
    "category": "Premium IT Services"
  }'
```

**Expected Response:** `200 OK`
```json
{
  "success": true,
  "message": "Vendor updated successfully",
  "vendor": {
    "_id": "674a1234567890abcdef1234",
    "name": "Tech Solutions Inc",
    "email": "contact@techsolutions.com",
    "company": "Tech Solutions Inc",
    "phone": "+1-555-9999",
    "category": "Premium IT Services",
    "updatedAt": "2025-12-04T..."
  }
}
```

**Acceptance Criteria:**
- ✅ Specified fields are updated
- ✅ Other fields remain unchanged
- ✅ UpdatedAt timestamp is updated
- ✅ Return updated vendor object

---

#### Test 1.7: Update Vendor (Negative - Non-existent ID)
**Endpoint:** `PUT /api/vendors/:id`  
**Description:** Attempt to update non-existent vendor

**Request:**
```bash
curl -X PUT http://localhost:5000/api/vendors/999a9999999999999999999 \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+1-555-9999"
  }'
```

**Expected Response:** `404 Not Found`
```json
{
  "success": false,
  "message": "Vendor not found"
}
```

**Acceptance Criteria:**
- ✅ Request fails gracefully
- ✅ No updates are made
- ✅ Clear error message

---

#### Test 1.8: Delete Vendor (Positive)
**Endpoint:** `DELETE /api/vendors/:id`  
**Description:** Delete a vendor

**Request:**
```bash
curl -X DELETE http://localhost:5000/api/vendors/674a1234567890abcdef1234
```

**Expected Response:** `200 OK`
```json
{
  "success": true,
  "message": "Vendor deleted successfully"
}
```

**Acceptance Criteria:**
- ✅ Vendor is removed from database
- ✅ Confirmation message returned
- ✅ Subsequent GET returns 404

---

#### Test 1.9: Delete Vendor (Negative - Non-existent ID)
**Endpoint:** `DELETE /api/vendors/:id`  
**Description:** Attempt to delete non-existent vendor

**Request:**
```bash
curl -X DELETE http://localhost:5000/api/vendors/999a9999999999999999999
```

**Expected Response:** `404 Not Found`
```json
{
  "success": false,
  "message": "Vendor not found"
}
```

**Acceptance Criteria:**
- ✅ Request fails gracefully
- ✅ Clear error message
- ✅ No side effects

---

#### Test 1.10: Duplicate Vendor Email (Negative)
**Endpoint:** `POST /api/vendors`  
**Description:** Attempt to create vendor with duplicate email

**Precondition:** Vendor with email "contact@techsolutions.com" exists

**Request:**
```bash
curl -X POST http://localhost:5000/api/vendors \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Another Tech Company",
    "email": "contact@techsolutions.com",
    "company": "Another Tech",
    "phone": "+1-555-0500"
  }'
```

**Expected Response:** `400 Bad Request` or `409 Conflict`
```json
{
  "success": false,
  "message": "Email already exists"
}
```

**Acceptance Criteria:**
- ✅ Duplicate is rejected
- ✅ Clear conflict message
- ✅ No duplicate record created

---

### Category 2: RFP Management APIs

#### Test 2.1: Create RFP (Positive)
**Endpoint:** `POST /api/rfp`  
**Description:** Create a new empty RFP

**Request:**
```bash
curl -X POST http://localhost:5000/api/rfp \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Expected Response:** `201 Created`
```json
{
  "success": true,
  "rfp": {
    "_id": "new-rfp-id",
    "user_text": null,
    "llm_response": null,
    "choosed_vendors": [],
    "mail_content": [],
    "status": "New",
    "createdAt": "2025-12-04T...",
    "updatedAt": "2025-12-04T..."
  }
}
```

**Acceptance Criteria:**
- ✅ RFP is created with unique ID
- ✅ Initial status is "New"
- ✅ Empty arrays and null fields
- ✅ Timestamps are set

---

#### Test 2.2: Get All RFPs (Positive)
**Endpoint:** `GET /api/rfp`  
**Description:** Retrieve all RFPs with vendor details populated

**Request:**
```bash
curl -X GET http://localhost:5000/api/rfp
```

**Expected Response:** `200 OK`
```json
{
  "success": true,
  "count": 2,
  "rfps": [
    {
      "_id": "rfp-id-1",
      "user_text": "Need laptops...",
      "llm_response": { ... },
      "choosed_vendors": [ { "_id": "...", "name": "..." } ],
      "mail_content": [],
      "status": "Review RFP"
    }
  ]
}
```

**Acceptance Criteria:**
- ✅ Returns all RFPs
- ✅ Count is accurate
- ✅ Vendors are populated
- ✅ Sorted by creation date

---

#### Test 2.3: Get Single RFP (Positive)
**Endpoint:** `GET /api/rfp/:id`  
**Description:** Retrieve a specific RFP with all details

**Request:**
```bash
curl -X GET http://localhost:5000/api/rfp/674a1234567890abcdef1234
```

**Expected Response:** `200 OK`
```json
{
  "success": true,
  "rfp": {
    "_id": "674a1234567890abcdef1234",
    "user_text": "Need 20 laptops with 16GB RAM for office",
    "llm_response": { ... },
    "choosed_vendors": [ ... ],
    "mail_content": [],
    "status": "Review RFP"
  }
}
```

**Acceptance Criteria:**
- ✅ Returns correct RFP
- ✅ All fields populated
- ✅ Vendors are included

---

#### Test 2.4: Get RFP (Negative - Invalid ID)
**Endpoint:** `GET /api/rfp/:id`  
**Description:** Attempt to fetch RFP with invalid ID

**Request:**
```bash
curl -X GET http://localhost:5000/api/rfp/invalid-id
```

**Expected Response:** `400 Bad Request` or `404 Not Found`
```json
{
  "success": false,
  "message": "Invalid RFP ID format"
}
```

**Acceptance Criteria:**
- ✅ Request is rejected
- ✅ Appropriate error response
- ✅ Clear error message

---

#### Test 2.5: Update RFP Step 1 (Describe) - Positive
**Endpoint:** `PUT /api/rfp/:id/describe`  
**Description:** Save natural language description

**Request:**
```bash
curl -X PUT http://localhost:5000/api/rfp/674a1234567890abcdef1234/describe \
  -H "Content-Type: application/json" \
  -d '{
    "user_text": "I need 20 laptops with 16GB RAM for our office. Budget is $50,000. Deadline: January 31, 2025."
  }'
```

**Expected Response:** `200 OK`
```json
{
  "success": true,
  "message": "RFP description updated",
  "rfp": {
    "_id": "674a1234567890abcdef1234",
    "user_text": "I need 20 laptops...",
    "status": "New"
  }
}
```

**Acceptance Criteria:**
- ✅ user_text is saved
- ✅ Status remains unchanged
- ✅ Updated timestamp reflects change

---

#### Test 2.6: Generate RFP from Text (Positive)
**Endpoint:** `POST /api/rfp/generate-from-text`  
**Description:** Use Gemini AI to generate structured RFP from natural language

**Request:**
```bash
curl -X POST http://localhost:5000/api/rfp/generate-from-text \
  -H "Content-Type: application/json" \
  -d '{
    "user_text": "I need 20 laptops with 16GB RAM for office. Budget $50,000-60,000. Deadline: end of January."
  }'
```

**Expected Response:** `200 OK`
```json
{
  "success": true,
  "llm_response": {
    "title": "Office IT Equipment Procurement",
    "description": "Procurement of laptops for office setup",
    "deadline": "2025-01-31",
    "budget": {
      "min": 50000,
      "max": 60000,
      "currency": "USD"
    },
    "items": [
      {
        "name": "Laptop",
        "quantity": 20,
        "specifications": "16GB RAM, SSD storage"
      }
    ],
    "evaluation_criteria": [
      { "criterion": "Price", "weight": 40 },
      { "criterion": "Quality", "weight": 35 },
      { "criterion": "Delivery Time", "weight": 25 }
    ]
  }
}
```

**Acceptance Criteria:**
- ✅ AI generates valid JSON
- ✅ All required fields present
- ✅ Budget and items are correct
- ✅ Weights sum correctly (100%)

---

#### Test 2.7: Generate RFP (Negative - Empty Input)
**Endpoint:** `POST /api/rfp/generate-from-text`  
**Description:** Attempt to generate RFP with empty text

**Request:**
```bash
curl -X POST http://localhost:5000/api/rfp/generate-from-text \
  -H "Content-Type: application/json" \
  -d '{
    "user_text": ""
  }'
```

**Expected Response:** `400 Bad Request`
```json
{
  "success": false,
  "message": "user_text cannot be empty"
}
```

**Acceptance Criteria:**
- ✅ Request is rejected
- ✅ Clear validation error
- ✅ No API call to Gemini

---

#### Test 2.8: Update RFP Step 2 (Review) - Positive
**Endpoint:** `PUT /api/rfp/:id/review`  
**Description:** Save reviewed and customized RFP details

**Request:**
```bash
curl -X PUT http://localhost:5000/api/rfp/674a1234567890abcdef1234/review \
  -H "Content-Type: application/json" \
  -d '{
    "llm_response": {
      "title": "Office IT Equipment Procurement",
      "description": "Updated description",
      "deadline": "2025-01-31",
      "budget": { "min": 50000, "max": 60000, "currency": "USD" },
      "items": [ { "name": "Laptop", "quantity": 20, "specifications": "16GB RAM" } ],
      "evaluation_criteria": [ { "criterion": "Price", "weight": 40 } ]
    },
    "status": "Review RFP"
  }'
```

**Expected Response:** `200 OK`
```json
{
  "success": true,
  "message": "RFP review saved",
  "rfp": {
    "_id": "674a1234567890abcdef1234",
    "llm_response": { ... },
    "status": "Review RFP"
  }
}
```

**Acceptance Criteria:**
- ✅ llm_response is saved
- ✅ Status is updated
- ✅ All fields are validated

---

#### Test 2.9: Send RFP to Vendors (Positive)
**Endpoint:** `POST /api/rfp/:id/send-to-vendors`  
**Description:** Send RFP to selected vendors via email

**Request:**
```bash
curl -X POST http://localhost:5000/api/rfp/674a1234567890abcdef1234/send-to-vendors \
  -H "Content-Type: application/json" \
  -d '{
    "vendorIds": ["vendor-id-1", "vendor-id-2", "vendor-id-3"]
  }'
```

**Expected Response:** `200 OK`
```json
{
  "success": true,
  "message": "RFP sent to 3 vendors",
  "sentTo": [
    {
      "vendorId": "vendor-id-1",
      "email": "contact@techsolutions.com",
      "status": "sent"
    }
  ],
  "rfp": {
    "_id": "674a1234567890abcdef1234",
    "choosed_vendors": ["vendor-id-1", "vendor-id-2", "vendor-id-3"],
    "status": "Vendors Choosed"
  }
}
```

**Acceptance Criteria:**
- ✅ Emails are sent to all vendors
- ✅ choosed_vendors array is populated
- ✅ Status changes to "Vendors Choosed"
- ✅ Response includes send confirmation

---

#### Test 2.10: Send RFP (Negative - No Vendors Selected)
**Endpoint:** `POST /api/rfp/:id/send-to-vendors`  
**Description:** Attempt to send RFP without selecting vendors

**Request:**
```bash
curl -X POST http://localhost:5000/api/rfp/674a1234567890abcdef1234/send-to-vendors \
  -H "Content-Type: application/json" \
  -d '{
    "vendorIds": []
  }'
```

**Expected Response:** `400 Bad Request`
```json
{
  "success": false,
  "message": "At least one vendor must be selected"
}
```

**Acceptance Criteria:**
- ✅ Request is rejected
- ✅ Clear validation error
- ✅ RFP is not modified

---

#### Test 2.11: Fetch Emails from Inbox (Positive)
**Endpoint:** `GET /api/rfp/:id/emails/inbox`  
**Description:** Fetch vendor responses from Gmail inbox

**Request:**
```bash
curl -X GET http://localhost:5000/api/rfp/674a1234567890abcdef1234/emails/inbox
```

**Expected Response:** `200 OK`
```json
{
  "success": true,
  "count": 2,
  "emails": [
    {
      "from": "contact@techsolutions.com",
      "subject": "[REF: 674a1234567890abcdef1234] RFP Response",
      "text": "We can provide 20 laptops at $45,000...",
      "date": "2025-12-04T10:30:00Z",
      "parsed": false
    }
  ]
}
```

**Acceptance Criteria:**
- ✅ Emails are retrieved from inbox
- ✅ RFP reference is used to filter
- ✅ Email content is readable
- ✅ Count is accurate

---

#### Test 2.12: Add Manual Response (Positive)
**Endpoint:** `PUT /api/rfp/:id/add-mail-response`  
**Description:** Manually add vendor response

**Request:**
```bash
curl -X PUT http://localhost:5000/api/rfp/674a1234567890abcdef1234/add-mail-response \
  -H "Content-Type: application/json" \
  -d '{
    "vendorEmail": "contact@techsolutions.com",
    "responseText": "We can provide 20 laptops with 16GB RAM at $45,000. Delivery in 15 days.",
    "timestamp": "2025-12-04T10:30:00Z"
  }'
```

**Expected Response:** `200 OK`
```json
{
  "success": true,
  "message": "Response added",
  "rfp": {
    "_id": "674a1234567890abcdef1234",
    "mail_content": [
      {
        "from": "contact@techsolutions.com",
        "text": "We can provide...",
        "timestamp": "2025-12-04T10:30:00Z"
      }
    ],
    "status": "Vendors Responded"
  }
}
```

**Acceptance Criteria:**
- ✅ Response is added to mail_content
- ✅ Status changes to "Vendors Responded"
- ✅ Deduplication works

---

#### Test 2.13: Add Duplicate Response (Negative)
**Endpoint:** `PUT /api/rfp/:id/add-mail-response`  
**Description:** Attempt to add duplicate vendor response

**Request:**
```bash
curl -X PUT http://localhost:5000/api/rfp/674a1234567890abcdef1234/add-mail-response \
  -H "Content-Type: application/json" \
  -d '{
    "vendorEmail": "contact@techsolutions.com",
    "responseText": "We can provide 20 laptops with 16GB RAM at $45,000. Delivery in 15 days.",
    "timestamp": "2025-12-04T10:30:00Z"
  }'
```

**Expected Response:** `400 Bad Request` or `200 OK` (with message about duplicate)
```json
{
  "success": true,
  "message": "Response already exists - skipped duplicate"
}
```

**Acceptance Criteria:**
- ✅ Duplicate is detected
- ✅ Response indicates duplicate
- ✅ No duplicate record created
- ✅ Graceful handling

---

#### Test 2.14: Compare Vendor Quotes (Positive)
**Endpoint:** `POST /api/rfp/:id/compare-quotes`  
**Description:** Use AI to compare vendor quotes and generate recommendation

**Request:**
```bash
curl -X POST http://localhost:5000/api/rfp/674a1234567890abcdef1234/compare-quotes
```

**Expected Response:** `200 OK`
```json
{
  "success": true,
  "comparison": {
    "best_price": {
      "vendor": "Tech Solutions Inc",
      "amount": 45000,
      "reasoning": "Lowest price among all vendors"
    },
    "best_warranty": {
      "vendor": "Premium Solutions Ltd",
      "warranty": "3-year full coverage",
      "reasoning": "Best warranty terms"
    },
    "best_overall": {
      "vendor": "Tech Solutions Inc",
      "score": 85,
      "reasoning": "Best value for money with good warranty"
    },
    "comparison_table": [
      {
        "vendor": "Tech Solutions Inc",
        "price": 45000,
        "warranty": "2-year",
        "delivery": "15 days",
        "pros": ["Lowest price", "Fast delivery"],
        "cons": ["Shorter warranty"]
      }
    ],
    "executive_summary": "Tech Solutions Inc offers the best overall value..."
  }
}
```

**Acceptance Criteria:**
- ✅ Best price vendor identified
- ✅ Best warranty vendor identified
- ✅ Best overall recommendation provided
- ✅ Score is between 0-100
- ✅ Comparison table includes pros/cons
- ✅ Executive summary is provided

---

#### Test 2.15: Compare Quotes (Negative - No Responses)
**Endpoint:** `POST /api/rfp/:id/compare-quotes`  
**Description:** Attempt to compare quotes when no vendor responses exist

**Request:**
```bash
curl -X POST http://localhost:5000/api/rfp/674a1234567890abcdef1234/compare-quotes
```

**Expected Response:** `400 Bad Request`
```json
{
  "success": false,
  "message": "No vendor responses found to compare"
}
```

**Acceptance Criteria:**
- ✅ Request is rejected
- ✅ Clear error message
- ✅ No API call to Gemini

---

### Category 3: Error Handling Tests

#### Test 3.1: Server Health Check
**Endpoint:** `GET /`  
**Description:** Verify server is running

**Request:**
```bash
curl -X GET http://localhost:5000/
```

**Expected Response:** `200 OK`
```json
{
  "message": "RFP Management API Server",
  "version": "1.0.0"
}
```

**Acceptance Criteria:**
- ✅ Server responds to health check
- ✅ Version is provided

---

#### Test 3.2: CORS Headers
**Endpoint:** `OPTIONS /api/rfp`  
**Description:** Verify CORS headers are present

**Request:**
```bash
curl -X OPTIONS http://localhost:5000/api/rfp \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: POST" \
  -v
```

**Expected Response:** `200 OK` with CORS headers
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

**Acceptance Criteria:**
- ✅ CORS headers present
- ✅ Allows frontend communication
- ✅ No errors

---

#### Test 3.3: Malformed JSON (Negative)
**Endpoint:** `POST /api/rfp`  
**Description:** Attempt to send malformed JSON

**Request:**
```bash
curl -X POST http://localhost:5000/api/rfp \
  -H "Content-Type: application/json" \
  -d '{invalid json}'
```

**Expected Response:** `400 Bad Request`
```json
{
  "success": false,
  "message": "Invalid JSON"
}
```

**Acceptance Criteria:**
- ✅ Malformed JSON is rejected
- ✅ Error message is clear
- ✅ Server doesn't crash

---

#### Test 3.4: Invalid Content-Type (Negative)
**Endpoint:** `POST /api/rfp`  
**Description:** Attempt to send request with wrong content-type

**Request:**
```bash
curl -X POST http://localhost:5000/api/rfp \
  -H "Content-Type: text/plain" \
  -d 'some text'
```

**Expected Response:** May vary, but should handle gracefully

**Acceptance Criteria:**
- ✅ Request is handled
- ✅ No server crash
- ✅ Error is meaningful

---

#### Test 3.5: 404 Not Found
**Endpoint:** `GET /api/nonexistent`  
**Description:** Request non-existent endpoint

**Request:**
```bash
curl -X GET http://localhost:5000/api/nonexistent
```

**Expected Response:** `404 Not Found`
```json
{
  "success": false,
  "message": "Endpoint not found"
}
```

**Acceptance Criteria:**
- ✅ Returns 404 status
- ✅ Clear error message

---

---

## 📊 Test Execution Instructions

### Using curl (Command Line)

1. **Start Backend Server:**
   ```bash
   cd backend
   npm run dev
   ```

2. **In another terminal, run tests:**
   ```bash
   # Example: Test create vendor
   curl -X POST http://localhost:5000/api/vendors \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Test Vendor",
       "email": "test@vendor.com",
       "company": "Test Company",
       "phone": "+1-555-0000",
       "category": "Test Category"
     }'
   ```

### Using Postman

1. **Import collection:**
   - Create new collection: "RFP Management System"
   - Add folders: Vendors, RFPs, Errors

2. **Create requests:**
   - Each test case becomes a request
   - Save responses for documentation

3. **Run tests:**
   - Use Postman's Test tab for assertions
   - Run entire collection to verify all tests

### Using Thunder Client

Similar process to Postman - create requests and organize by category.

---

## ✅ Test Results Template

For each test, record:

```
Test ID: 1.1
Test Name: Create Vendor (Positive)
Status: ✅ PASSED / ❌ FAILED / ⏳ SKIPPED
Response Time: XXXms
Notes: [Any issues or observations]
```

---

## 🎯 Success Criteria

All tests must pass to declare API ready:

- ✅ All 10 Vendor tests pass
- ✅ All 15 RFP tests pass
- ✅ All 5 Error handling tests pass
- ✅ Response times < 2000ms
- ✅ No server crashes
- ✅ Proper error messages
- ✅ CORS working correctly
- ✅ MongoDB operations working

---

## 📝 Test Execution Checklist

- [ ] Backend server is running
- [ ] MongoDB is connected
- [ ] Gemini API key is configured
- [ ] Email credentials are configured
- [ ] All environment variables are set
- [ ] Run vendor tests (1.1-1.10)
- [ ] Run RFP tests (2.1-2.15)
- [ ] Run error handling tests (3.1-3.5)
- [ ] Document all results
- [ ] Verify no data corruption
- [ ] Check server logs for errors

---

## 🆘 Troubleshooting

### If server won't start:
- Check if port 5000 is in use
- Verify MongoDB is running
- Check .env file configuration

### If Gemini API calls fail:
- Verify API key is correct
- Check internet connection
- Review API quota

### If email tests fail:
- Verify Gmail credentials
- Check 2FA and app password setup
- Verify IMAP/SMTP are enabled

### If CORS issues occur:
- Check Origin header
- Verify CORS middleware configuration
- Check frontend URL

---

**Last Updated:** December 4, 2025  
**Version:** 1.0.0
