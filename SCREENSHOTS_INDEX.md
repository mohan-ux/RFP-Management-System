# Screenshots Index

Quick reference guide to all screenshots in the README documentation.

## 📸 Screenshot Directory Structure

```
screenshots/
├── 01-dashboard.png              (1400x900px)
├── 02-step1-describe.png         (1400x900px)
├── 03-step2-review.png           (1400x1000px)
├── 04-step3-vendors.png          (1400x900px)
├── 05-step4-compare.png          (1400x1200px)
├── 06-email-template.png         (800x1000px)
└── 07-email-inbox.png            (1400x900px)
```

---

## 🖼️ Screenshot Details

### 1. Dashboard - RFP List View
**File:** `01-dashboard.png`  
**Dimensions:** 1400x900px  
**Shows:**
- Header navigation bar
- "Create RFP" button
- RFP list with columns: Title, Status, Date, Actions
- Status badges (New, Review RFP, Vendors Choosed, etc.)
- Action buttons: View, Edit, Delete
- Responsive grid layout

**Purpose:** Shows overall system state and RFP management interface

**See in README:** Under "📸 Screenshots" section

---

### 2. Step 1: Describe - Natural Language Input
**File:** `02-step1-describe.png`  
**Dimensions:** 1400x900px  
**Shows:**
- Step indicator: "1 / 4"
- Large text textarea for natural language input
- Placeholder text showing example
- "Generate RFP" button
- "Back" and "Next" navigation buttons
- Form title and description

**Purpose:** First step of 4-step wizard - user inputs procurement needs

**See in README:** Under "📸 Screenshots" section

**Example Input:**
```
I need 20 laptops with 16GB RAM for office.
Budget: $50,000-60,000. Delivery: 30 days.
Requirements: Fast processor, SSD, good warranty.
```

---

### 3. Step 2: Review - AI Generated RFP Form
**File:** `03-step2-review.png`  
**Dimensions:** 1400x1000px  
**Shows:**
- Step indicator: "2 / 4"
- RFP Title field (populated by AI)
- Description textarea (AI-generated)
- Budget section: Min, Max, Currency
- Deadline date picker
- Items list with specifications
- Evaluation criteria with weights
- Payment terms field
- Save & Continue button

**Purpose:** User reviews and customizes AI-generated RFP structure

**See in README:** Under "📸 Screenshots" section

---

### 4. Step 3: Vendor Selection
**File:** `04-step3-vendors.png`  
**Dimensions:** 1400x900px  
**Shows:**
- Step indicator: "3 / 4"
- "Add New Vendor" button
- Vendor cards displaying:
  - Vendor name
  - Email address
  - Company name
  - Category
  - Checkbox for selection
- Multiple vendors with mixed selection states
- "Send RFP to Selected Vendors" button

**Purpose:** Select which vendors to send RFP to and trigger email sending

**See in README:** Under "📸 Screenshots" section

**Sample Vendors in Screenshot:**
- Tech Solutions Inc (contact@techsolutions.com)
- Premium Tech Ltd (sales@premiumtech.com)
- QuickSupply Co (info@quicksupply.com)

---

### 5. Step 4: AI-Powered Comparison
**File:** `05-step4-compare.png`  
**Dimensions:** 1400x1200px  
**Shows:**
- Step indicator: "4 / 4"
- "Fetch Latest Emails" button
- Vendor responses section with list
- "Get AI Recommendations" button
- AI Recommendations display:
  - **Best Price** card (vendor name, amount)
  - **Best Warranty** card (vendor name, warranty details)
  - **Best Overall** card (vendor name, score 0-100)
- Comparison Table:
  - Vendor columns
  - Features rows
  - Pros/Cons for each vendor
- Executive Summary text

**Purpose:** Review vendor responses and AI-generated comparison/recommendations

**See in README:** Under "📸 Screenshots" section

**Sample Data:**
```
BEST PRICE: TechStore Inc - $45,000
BEST WARRANTY: Premium Tech Ltd - 3-year full coverage  
BEST OVERALL: TechStore Inc (Score: 85/100)
```

---

### 6. Email Template Example
**File:** `06-email-template.png`  
**Dimensions:** 800x1000px  
**Shows:**
- Email from RFP System
- Email subject with Reference ID: `[REF: <rfp_id>]`
- Professional HTML email template
- RFP Header section
- RFP Title
- Description
- Budget Information
- Items List with specifications
- Evaluation Criteria table
- Payment Terms
- Professional footer
- Company branding (if applicable)

**Purpose:** Shows how RFP is communicated to vendors via email

**See in README:** Under "📸 Screenshots" section

**Email Subject Example:**
```
[REF: 674a1234567890abcdef1234] RFP Request: Office IT Equipment Procurement
```

---

### 7. Email Inbox Integration
**File:** `07-email-inbox.png`  
**Dimensions:** 1400x900px  
**Shows:**
- Email fetch interface
- List of fetched vendor emails
- Each email showing:
  - Vendor name/email
  - Timestamp of receipt
  - Quote amount extracted
  - Email preview/content
  - Status: Parsed/Pending
- Parsed quote information
- Email parsing results
- Add more responses option

**Purpose:** Shows automated email fetching and parsing of vendor responses

**See in README:** Under "📸 Screenshots" section

---

## 📋 How Screenshots Are Referenced in README

### In Features Section
```
### 1. Create RFPs (Step 1: Describe)
...
![Describe Step](./screenshots/02-step1-describe.png)
```

### In Key Features Table
```
Dashboard with RFP management interface showing status, dates, and actions
See: 01-dashboard.png
```

### In Step-by-Step Workflow
```
#### Phase 1: RFP Creation (Steps 1-2)
Referenced images: 02-step1-describe.png, 03-step2-review.png
```

---

## 🎨 Visual Design Elements in Screenshots

### Color Scheme
- **Primary Color:** Purple/Violet (#7C3AED)
- **Status Badges:**
  - New: Blue
  - Review RFP: Yellow
  - Vendors Choosed: Orange
  - Vendors Responded: Purple
  - View Quotes: Cyan
  - Completed: Green

### UI Components Visible
- Buttons: Primary (purple), Secondary (gray), Danger (red)
- Forms: Input fields, TextArea, DatePicker, Select
- Cards: Vendor cards, Status cards, Recommendation cards
- Modals: Confirmation dialogs
- Badges: Status indicators
- Tables: Comparison table
- Lists: RFP list, vendor list, email list

### Layout Patterns
- Header with navigation
- Sidebar navigation (if applicable)
- Multi-step form with progress indicator
- Card-based layouts
- Grid layouts for lists
- Modal overlays

---

## 📐 Screenshot Capture Specifications

### Recommended Resolution
- **Width:** 1400px minimum
- **Height:** Varies by content (900-1200px)
- **Scale:** 1x (100% zoom)
- **Format:** PNG (lossless)

### Browser Settings for Capture
- **Browser:** Chrome/Firefox recommended
- **Zoom:** 100% (Ctrl+0)
- **Window Width:** 1440px
- **Window Height:** 900px minimum
- **DevTools:** Closed
- **Theme:** Light mode (if applicable)

### File Size Guidelines
- **Individual Screenshot:** 500-800 KB
- **Compressed PNG:** 300-500 KB
- **Total Screenshots:** ~3-4 MB

---

## ✅ Screenshot Verification Checklist

Each screenshot should be verified for:

- [ ] Correct file name (01-dashboard.png, etc.)
- [ ] PNG format
- [ ] Minimum 1400px width
- [ ] Clear, readable text
- [ ] No sensitive data visible
- [ ] Good contrast
- [ ] Professional appearance
- [ ] Relevant content visible
- [ ] No browser artifacts
- [ ] Proper aspect ratio

---

## 🔄 Updating Screenshots

When UI changes:

1. **Capture** new screenshot of changed component
2. **Name** with existing filename (replace old version)
3. **Update** README if feature description changed
4. **Commit** with message: "Update screenshot: <feature_name>"
5. **Push** to repository

### Example Commit Messages
```
Update screenshot: Step 1 - new form layout
Update screenshot: Dashboard - added new status badge
Update screenshot: Vendor selection - improved UI
```

---

## 🔗 Cross-References

### Screenshots by Feature
| Feature | Screenshots |
|---------|------------|
| RFP Creation | 02, 03 |
| Vendor Management | 04, 06 |
| Email Integration | 06, 07 |
| AI Comparison | 05 |
| Dashboard | 01 |
| Complete Workflow | 01-07 (all) |

### Screenshots by Step
| Step | File | Feature |
|------|------|---------|
| 1 | 02-step1-describe.png | Natural language input |
| 2 | 03-step2-review.png | RFP review & customize |
| 3 | 04-step3-vendors.png | Vendor selection |
| 4 | 05-step4-compare.png | AI comparison |
| - | 01-dashboard.png | Overall dashboard |
| - | 06-email-template.png | Email communication |
| - | 07-email-inbox.png | Email responses |

---

## 📱 Responsive Design Notes

### Desktop View (1400px+)
- Full layout with all columns visible
- All controls accessible
- Optimal reading experience

### Tablet View (768-1399px)
- Stacked layout
- Mobile-optimized navigation
- Touch-friendly buttons

### Mobile View (<768px)
- Single column layout
- Full-width inputs
- Bottom navigation

---

## 🎓 Using Screenshots in Documentation

### For README
```markdown
### Feature Title
![Alt Text](./screenshots/XX-name.png)

**Description:**
Brief explanation of what's shown
```

### For Wiki
```markdown
## Workflow Step
[Embed image here]

1. First step
2. Second step
3. Third step

See screenshot above for reference.
```

### For Presentations
- Use full-resolution screenshots
- Highlight important areas with arrows/boxes
- Add speaker notes

---

## 🆘 Troubleshooting Screenshot Issues

### Image Not Displaying
- Check file path (should be `./screenshots/XX-name.png`)
- Verify PNG format
- Check filename spelling
- Ensure file exists in directory

### Low Quality
- Recapture at higher resolution
- Use PNG format (not JPEG)
- Ensure zoom is at 100%
- Check browser rendering

### Missing Content
- Scroll to show all relevant content
- Reduce zoom if needed to fit more
- Take multiple screenshots if very long
- Ensure responsive breakpoint for content type

---

## 📞 Support

For screenshot-related questions, see:
- [`SCREENSHOTS_GUIDE.md`](./SCREENSHOTS_GUIDE.md) - Detailed capture guide
- [README.md](./README.md) - Main documentation
- [API_DOCUMENTATION.md](./backend/API_DOCUMENTATION.md) - API reference

---

## 📝 File Manifest

| File | Size | Purpose |
|------|------|---------|
| 01-dashboard.png | ~600KB | Dashboard view |
| 02-step1-describe.png | ~550KB | Step 1 UI |
| 03-step2-review.png | ~650KB | Step 2 form |
| 04-step3-vendors.png | ~600KB | Vendor selection |
| 05-step4-compare.png | ~750KB | Comparison view |
| 06-email-template.png | ~400KB | Email template |
| 07-email-inbox.png | ~600KB | Email inbox |
| **Total** | **~4.2MB** | All screenshots |

---

**Last Updated:** December 4, 2025  
**Version:** 1.0.0  
**README Version:** 1.0.0

---

[Back to Main README](./README.md)
