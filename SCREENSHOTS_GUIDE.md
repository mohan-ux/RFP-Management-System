# Screenshots Guide

This document explains where to place screenshots and how to capture them for the README.

## Screenshot Locations

All screenshots should be placed in the `/screenshots` directory with the following naming convention:

```
screenshots/
├── 01-dashboard.png              # RFP List View
├── 02-step1-describe.png         # Step 1: Natural Language Input
├── 03-step2-review.png           # Step 2: Review & Edit RFP
├── 04-step3-vendors.png          # Step 3: Vendor Selection
├── 05-step4-compare.png          # Step 4: AI Comparison
├── 06-email-template.png         # Email Template Example
├── 07-email-inbox.png            # Email Inbox Integration
└── README.md                      # This file
```

## How to Capture Screenshots

### 1. Dashboard - RFP List View (01-dashboard.png)

**Steps:**
1. Start both backend and frontend servers
2. Navigate to the main dashboard page
3. Ensure you have at least 2-3 RFPs visible
4. Take a full-page screenshot showing:
   - Header with navigation
   - Create RFP button
   - List of RFPs with status badges
   - Action buttons (View, Edit, Delete)

**Optimal Size:** 1400x900px minimum

**Suggested Tools:**
- Windows: Snipping Tool or ShareX
- Mac: Command + Shift + 4
- Cross-platform: Screenshot Studio

---

### 2. Step 1: Describe - Natural Language Input (02-step1-describe.png)

**Steps:**
1. Click "Create RFP" button
2. You'll be on Step 1
3. Fill in the text area with example text:
   ```
   I need to procure 20 laptops with 16GB RAM for our office.
   Budget is $50,000 total. Need delivery within 30 days.
   Requirements: Fast processor, SSD storage, good warranty.
   ```
4. Take screenshot showing:
   - Step indicator (1/4)
   - Text input area
   - Generate RFP button
   - Previous/Next navigation

**Optimal Size:** 1400x900px minimum

---

### 3. Step 2: Review & Edit RFP (03-step2-review.png)

**Steps:**
1. After generating from Step 1, you'll see Step 2
2. Screenshot should show:
   - Generated RFP fields populated
   - Title field (editable)
   - Description field
   - Budget min/max input fields
   - Deadline date picker
   - Items list with specifications
   - Evaluation criteria with weights
3. Scroll down to capture more fields if needed

**Optimal Size:** 1400x1000px minimum (may need scrolling)

---

### 4. Step 3: Vendor Selection (04-step3-vendors.png)

**Steps:**
1. Click "Next" or "Continue" from Step 2
2. On Step 3, you should see:
   - Available vendors listed as cards
   - Vendor information (Name, Email, Company, Category)
   - Checkboxes for vendor selection
   - "Add New Vendor" button
   - Selected vendors highlighted
   - Send RFP button

**Optimal Size:** 1400x900px minimum

**Tips:**
- Create at least 3-4 vendors beforehand
- Show some selected and some unselected

---

### 5. Step 4: AI Comparison (05-step4-compare.png)

**Steps:**
1. Navigate to Step 4 or Click on an existing RFP with responses
2. Scroll through to show:
   - Vendor email responses section
   - "Fetch Latest Emails" button
   - List of vendor responses with timestamps
   - "Get AI Recommendations" button
3. After AI generates comparison:
   - Best Price recommendation box
   - Best Warranty recommendation box
   - Best Overall recommendation with score
   - Comparison table (pros/cons for each vendor)
   - Executive summary text

**Optimal Size:** 1400x1200px+ (tall page)

---

### 6. Email Template (06-email-template.png)

**Steps:**
1. Open your Gmail account
2. Check emails received from the system
3. Open a sent email with RFP details
4. Take screenshot showing:
   - Email subject with `[REF: <rfp_id>]`
   - Professional HTML email template
   - RFP title and description
   - Budget information
   - Items list
   - Evaluation criteria
   - Professional footer

**Optimal Size:** 800x1000px

**Alternative:** Take screenshot from browser's email view

---

### 7. Email Inbox Integration (07-email-inbox.png)

**Steps:**
1. In the app, go to Step 4 - Compare
2. Click "Fetch Latest Emails" button
3. Take screenshot showing:
   - Email fetch results
   - List of vendor responses
   - Each response showing:
     - Vendor name/email
     - Response timestamp
     - Quote amount extracted
     - Full email content
   - Any parsing results

**Optimal Size:** 1400x900px

---

## Screenshot Best Practices

### Visual Quality
- Use high resolution (1400px+ width)
- Ensure good contrast and readability
- Capture at 1x zoom (not zoomed in or out)
- Include window headers for context
- Avoid sensitive data (redact personal emails if needed)

### Content Guidelines
- Show realistic, sample data
- Use descriptive vendor names (TechStore Inc, etc.)
- Include typical RFP amounts ($40,000-$60,000)
- Show 2-5 evaluation criteria
- Display 3-5 vendors in selection view

### File Format & Size
- Use PNG format (lossless, good for UI)
- Compress with tools like TinyPNG if over 1MB
- Optimal size: 600-800 KB per image
- Maintain consistent dimensions

### Naming Consistency
Follow the naming convention exactly:
```
01-dashboard.png          (001, 002, etc.)
02-step1-describe.png     (use hyphens, not underscores)
03-step2-review.png
04-step3-vendors.png
05-step4-compare.png
06-email-template.png
07-email-inbox.png
```

---

## Updating Screenshots

When UI changes occur:

1. **Take new screenshot** of updated component
2. **Save with same filename** (overwrite old)
3. **Update README** if needed to reflect UI changes
4. **Commit changes** with message: "Update screenshots"

---

## Tools Recommendation

### Windows
- **Snipping Tool**: Built-in, simple
- **ShareX**: Advanced, free
- **Greenshot**: Lightweight, powerful

### Mac
- **Screenshot**: Built-in (Cmd+Shift+4)
- **CleanMyMac X**: Includes screenshot tool
- **Skitch**: Annotate screenshots

### Cross-Platform
- **Flameshot**: Open source, excellent
- **Lightshot**: Quick and easy
- **Gyroflow Toolbox**: Video to screenshot

---

## Optional: Annotated Screenshots

For complex flows, consider adding annotations:

1. **Arrows**: Show user flow direction
2. **Numbers**: Highlight key steps
3. **Boxes**: Emphasize important areas
4. **Callouts**: Explain features

Tools for annotations:
- Greenshot (screenshot tool with editor)
- Paint.NET
- Figma (web-based)
- Photoshop (if available)

---

## Checklist for Screenshots

- [ ] 01-dashboard.png - Shows RFP list with 2-3 items
- [ ] 02-step1-describe.png - Shows text input area
- [ ] 03-step2-review.png - Shows generated RFP fields
- [ ] 04-step3-vendors.png - Shows vendor selection
- [ ] 05-step4-compare.png - Shows AI comparison results
- [ ] 06-email-template.png - Shows email example
- [ ] 07-email-inbox.png - Shows email integration
- [ ] All images are PNG format
- [ ] All images are 1400px+ width
- [ ] All filenames match convention
- [ ] All images compressed to <1MB

---

## Troubleshooting

### If you don't see Step 2 immediately...
- Create a new RFP
- Fill in description with realistic data
- Click "Generate RFP"
- Wait 5-10 seconds for AI to process
- Step 2 form will appear with populated fields

### If you don't see vendor responses...
- Make sure RFP was sent to at least one vendor
- Manually add test responses using "Add Manual Response"
- Or wait for real vendor emails to arrive

### If Step 4 appears empty...
- Ensure RFP has status "Vendors Choosed" or later
- Click "Fetch Latest Emails" to load responses
- Add manual vendor responses for testing

---

## Sample Data for Testing

### Sample RFP Description
```
We need to purchase office equipment for our new branch office.
Specifically, we need 15 desktop computers with the following specs:
- Processor: Intel i7 or equivalent
- RAM: 16GB minimum
- Storage: 512GB SSD
- Budget: $30,000 total
- Delivery deadline: January 31, 2025

We also need 10 office chairs, ergonomic, with lumbar support.
Budget for chairs: $5,000 total.

Important: Need reliable vendor with good after-sales support.
```

### Sample Vendor Names
- TechStore Inc (contact@techstore.com)
- Premium Solutions Ltd (sales@premiumsolutions.com)
- QuickSupply Co (support@quicksupply.com)
- Enterprise IT Services (info@enterpriseit.com)

### Sample Budget Range
- Minimum: $30,000
- Maximum: $50,000
- Currency: USD

---

## Need Help?

If you have questions about:
- **Screenshot capture**: See "Tools Recommendation" section
- **Content**: Use "Sample Data for Testing" section
- **File format**: See "File Format & Size" section
- **Naming**: See "Naming Consistency" section

---

Last Updated: December 4, 2025
