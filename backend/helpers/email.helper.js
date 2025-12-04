import nodemailer from 'nodemailer';
import Imap from 'imap';
import { simpleParser } from 'mailparser';
import dotenv from 'dotenv';

dotenv.config();

// Email transporter for sending emails
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

/**
 * Generate HTML template for RFP email
 * @param {Object} rfpData - RFP data to include in email
 * @returns {string} - HTML email template
 */
const generateRFPEmailTemplate = (rfpData) => {
  const { title, description, deadline, budget, items, evaluation_criteria, terms } = rfpData;
  
  // Helper to check if a value is valid (not empty, null, undefined, or zero)
  const hasValue = (val) => val !== null && val !== undefined && val !== '' && val !== 0;
  const hasBudget = budget && (hasValue(budget.min) || hasValue(budget.max));
  const hasItems = items && Array.isArray(items) && items.length > 0 && items.some(item => hasValue(item.name));
  const hasCriteria = evaluation_criteria && Array.isArray(evaluation_criteria) && evaluation_criteria.length > 0;
  
  // Build sections dynamically - only include sections with actual data
  let sectionsHtml = '';
  
  // Description section (always include if present)
  if (hasValue(description)) {
    sectionsHtml += `
      <div class="section">
        <div class="section-title">Description</div>
        <p>${description}</p>
      </div>`;
  }
  
  // Budget section (only if has valid values)
  if (hasBudget) {
    const currency = budget.currency || 'USD';
    let budgetText = '';
    if (hasValue(budget.min) && hasValue(budget.max)) {
      budgetText = `${currency} ${budget.min.toLocaleString()} - ${budget.max.toLocaleString()}`;
    } else if (hasValue(budget.min)) {
      budgetText = `${currency} ${budget.min.toLocaleString()} (minimum)`;
    } else if (hasValue(budget.max)) {
      budgetText = `${currency} ${budget.max.toLocaleString()} (maximum)`;
    }
    if (budgetText) {
      sectionsHtml += `
      <div class="section">
        <div class="section-title">Budget Range</div>
        <p>${budgetText}</p>
      </div>`;
    }
  }
  
  // Deadline section (only if present)
  if (hasValue(deadline)) {
    sectionsHtml += `
      <div class="section">
        <div class="section-title">Deadline</div>
        <p>${deadline}</p>
      </div>`;
  }
  
  // Items section (only if has valid items)
  if (hasItems) {
    const validItems = items.filter(item => hasValue(item.name));
    // Determine which columns to show based on data
    const showQuantity = validItems.some(item => hasValue(item.quantity));
    const showUnit = validItems.some(item => hasValue(item.unit));
    const showSpecs = validItems.some(item => hasValue(item.specifications));
    
    let tableHeaders = '<th>Item</th>';
    if (showQuantity) tableHeaders += '<th>Quantity</th>';
    if (showUnit) tableHeaders += '<th>Unit</th>';
    if (showSpecs) tableHeaders += '<th>Specifications</th>';
    
    const tableRows = validItems.map(item => {
      let row = `<td>${item.name}</td>`;
      if (showQuantity) row += `<td>${item.quantity || '-'}</td>`;
      if (showUnit) row += `<td>${item.unit || '-'}</td>`;
      if (showSpecs) row += `<td>${item.specifications || '-'}</td>`;
      return `<tr>${row}</tr>`;
    }).join('');
    
    sectionsHtml += `
      <div class="section">
        <div class="section-title">Required Items/Services</div>
        <table>
          <tr>${tableHeaders}</tr>
          ${tableRows}
        </table>
      </div>`;
  }
  
  // Evaluation criteria section (only if present)
  if (hasCriteria) {
    const validCriteria = evaluation_criteria.filter(ec => hasValue(ec.criterion));
    if (validCriteria.length > 0) {
      sectionsHtml += `
      <div class="section">
        <div class="section-title">Evaluation Criteria</div>
        <table>
          <tr>
            <th>Criterion</th>
            <th>Weight (%)</th>
          </tr>
          ${validCriteria.map(ec => `
          <tr>
            <td>${ec.criterion}</td>
            <td>${ec.weight || '-'}%</td>
          </tr>
          `).join('')}
        </table>
      </div>`;
    }
  }
  
  // Terms section (only if present)
  if (hasValue(terms)) {
    sectionsHtml += `
      <div class="section">
        <div class="section-title">Terms & Conditions</div>
        <p>${terms}</p>
      </div>`;
  }
  
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #7C3AED; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
    .section { margin-bottom: 20px; }
    .section-title { font-weight: bold; color: #7C3AED; margin-bottom: 10px; }
    table { width: 100%; border-collapse: collapse; margin: 10px 0; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background: #7C3AED; color: white; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    .cta { background: #7C3AED; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Request for Proposal</h1>
      ${hasValue(title) ? `<h2>${title}</h2>` : ''}
    </div>
    <div class="content">
      ${sectionsHtml || '<p>Please review and submit your proposal.</p>'}
      
      <p style="text-align: center;">
        <strong>Please reply to this email with your proposal.</strong>
      </p>
    </div>
    <div class="footer">
      <p>This is an automated RFP request. Please respond with your quote.</p>
    </div>
  </div>
</body>
</html>
  `;
};

/**
 * Send RFP email to vendor
 * @param {string} vendorEmail - Vendor's email address
 * @param {string} vendorName - Vendor's name
 * @param {Object} rfpData - RFP data
 * @param {string} rfpId - RFP ID for reference
 * @returns {Object} - Send result
 */
export const sendRFPToVendor = async (vendorEmail, vendorName, rfpData, rfpId) => {
  try {
    const htmlContent = generateRFPEmailTemplate(rfpData);
    
    const mailOptions = {
      from: `"RFP Management System" <${process.env.EMAIL_USER}>`,
      to: vendorEmail,
      subject: `RFP Request: ${rfpData.title} [REF: ${rfpId}]`,
      html: htmlContent,
      headers: {
        'X-RFP-ID': rfpId
      }
    };

    const result = await transporter.sendMail(mailOptions);
    
    return {
      success: true,
      messageId: result.messageId,
      vendorEmail,
      vendorName,
      sentAt: new Date()
    };
  } catch (error) {
    console.error('Email send error:', error.message);
    return {
      success: false,
      error: error.message,
      vendorEmail,
      vendorName
    };
  }
};

/**
 * Fetch emails from inbox (using IMAP) for a specific RFP
 * @param {string} rfpId - RFP ID to filter emails
 * @returns {Array} - List of emails for the specific RFP
 */
export const fetchInboxEmails = async (rfpId) => {
  return new Promise((resolve, reject) => {
    // If IMAP is not configured, reject with error
    if (!process.env.IMAP_HOST || !process.env.IMAP_USER) {
      reject(new Error('Email inbox is not configured. Please set IMAP_HOST, IMAP_USER, and IMAP_PASSWORD in environment variables.'));
      return;
    }

    const imap = new Imap({
      user: process.env.IMAP_USER,
      password: process.env.IMAP_PASSWORD,
      host: process.env.IMAP_HOST,
      port: process.env.IMAP_PORT || 993,
      tls: true,
      tlsOptions: { rejectUnauthorized: false }
    });

    const emails = [];
    let pendingParses = 0;
    let fetchEnded = false;

    const checkComplete = () => {
      if (fetchEnded && pendingParses === 0) {
        imap.end();
        
        // Filter emails for specific RFP ID and sent to EMAIL_USER
        const filteredEmails = emails.filter(email => {
          // Extract RFP ID from subject
          const rfpIdMatch = (email.subject || '').match(/\[REF:\s*([a-f0-9]{24})\]/i);
          const emailRfpId = rfpIdMatch ? rfpIdMatch[1] : null;
          
          // Check if the email contains the specific RFP ID
          const hasCorrectRfpId = emailRfpId === rfpId;
          
          // Check if the emaLil was sent to EMAI_USER
          const emailUser = process.env.EMAIL_USER;
          const toField = (email.to || '').toLowerCase();
          const isSentToUser = toField.includes(emailUser.toLowerCase());
          
          // Include only if it has the correct RFP ID and was sent to EMAIL_USER
          if (hasCorrectRfpId && isSentToUser) {
            email.rfpId = emailRfpId;
            email.isRFPResponse = true;
            return true;
          }
          
          return false;
        });
        
        // Sort by date, newest first
        filteredEmails.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        resolve(filteredEmails);
      }
    };

    imap.once('ready', () => {
      imap.openBox('INBOX', false, (err, box) => {
        if (err) {
          reject(err);
          return;
        }

        // Fetch recent emails to filter for specific RFP
        const fetchCount = Math.min(box.messages.total, 100);
        if (fetchCount === 0) {
          resolve([]);
          imap.end();
          return;
        }
        
        const startSeq = Math.max(1, box.messages.total - fetchCount + 1);
        const fetch = imap.seq.fetch(`${startSeq}:*`, {
          bodies: '',
          markSeen: false
        });

        fetch.on('message', (msg, seqno) => {
          pendingParses++;
          msg.on('body', (stream) => {
            simpleParser(stream, (err, parsed) => {
              if (!err) {
                const fromText = parsed.from?.text || '';
                const subject = parsed.subject || '';
                const toText = parsed.to?.text || '';
                
                // Include all emails - filter later by RFP content and To field
                emails.push({
                  id: parsed.messageId || `email-${seqno}`,
                  uid: seqno,
                  from: fromText,
                  to: toText,
                  subject: subject,
                  date: parsed.date,
                  body: parsed.text || '',
                  html: parsed.html || ''
                });
              }
              pendingParses--;
              checkComplete();
            });
          });
        });

        fetch.once('end', () => {
          fetchEnded = true;
          checkComplete();
        });
      });
    });

    imap.once('error', (err) => {
      console.error('IMAP Error:', err.message);
      reject(err);
    });

    imap.connect();
  });
};

/**
 * Verify email configuration
 * @returns {Object} - Verification result
 */
export const verifyEmailConfig = async () => {
  try {
    await transporter.verify();
    return { success: true, message: 'Email configuration is valid' };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export default {
  sendRFPToVendor,
  fetchInboxEmails,
  verifyEmailConfig,
  generateRFPEmailTemplate
};
