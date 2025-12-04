import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import fetch, { Headers } from 'node-fetch';

// Polyfill fetch for Node.js < 18
if (!globalThis.fetch) {
  globalThis.fetch = fetch;
  globalThis.Headers = Headers;
}

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const GEMINI_MODELS = [
  'gemini-2.5-flash-preview-04-17',
  'gemini-2.5-pro-preview-05-06',
  'gemini-2.5-flash',
  'gemini-2.5-pro',
  'gemini-1.5-flash',
  'gemini-1.5-pro', 
  'gemini-pro'
];

/**
 * Generate structured RFP from user's natural language text
 * @param {string} userText - User's natural language description
 * @returns {Object} - Structured RFP JSON
 */
export const generateRFPFromText = async (userText) => {
  // Try Gemini API first
  for (const modelName of GEMINI_MODELS) {
    try {
      console.log(`Trying Gemini model: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });

      const prompt = `You are an RFP (Request for Proposal) expert. Convert the following user description into a structured RFP JSON format.
      User Input: "${userText}"

      CRITICAL RULES:
      1. Only include fields and data that can be directly extracted or reasonably inferred from the user input
      2. If information is missing or unclear, OMIT that field entirely from the JSON
      3. Do not generate placeholder values, assumptions, or default data
      4. Return a valid JSON structure containing ONLY the fields you can populate from the given input

      Available structure (include only applicable fields):
      {
        "title": "Brief title for the RFP",
        "description": "Detailed description of requirements",
        "deadline": "YYYY-MM-DD format (only if date info provided or 30 days mentioned)",
        "budget": {
          "min": number,
          "max": number,
          "currency": "USD"
        },
        "items": [
          {
            "name": "Item name",
            "quantity": number,
            "unit": "pcs/lot/units",
            "specifications": "Detailed specs"
          }
        ],
        "evaluation_criteria": [
          { "criterion": "Price", "weight": 40 },
          { "criterion": "Quality", "weight": 35 },
          { "criterion": "Delivery Time", "weight": 25 }
        ],
        "terms": "Payment and delivery terms"
      }

IMPORTANT: Return ONLY valid JSON with fields that have actual data from input. No markdown, no code blocks, no explanations, no placeholder values.`;

      const result = await model.generateContent(prompt);
      const response = result.response.text();
      
      // Clean up the response (remove markdown code blocks if present)
      let cleanJson = response
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      
      console.log(`Gemini API success with model: ${modelName}`);
      console.log(`Response: ${cleanJson}`);
      return JSON.parse(cleanJson);
    } catch (error) {
      console.log(`Model ${modelName} failed: ${error.message}`);
      continue;
    }
  }
  
  // All models failed
  throw new Error('Failed to generate RFP. All Gemini models are unavailable. Please check your API key and try again.');
};

/**
 * Identify which RFP an email response belongs to
 * @param {string} mailContent - Email content received
 * @param {Array} rfpList - List of active RFPs
 * @returns {Object} - Identified RFP ID and vendor info
 */
export const identifyEmailRFP = async (mailContent, rfpList) => {
  const prompt = `You are an email analyzer for RFP management. Analyze the following email and identify which RFP it belongs to.

Email Content: "${mailContent}"

Available RFPs:
${JSON.stringify(rfpList.map(r => ({ id: r._id, title: r.llm_response?.title || r.title, description: r.llm_response?.description || r.description })), null, 2)}

Return a JSON response:
{
  "rfp_id": "The matching RFP ID or null if no match",
  "vendor_name": "Extracted vendor/sender name",
  "vendor_email": "Extracted email address if available",
  "quote_details": {
    "price": number or null,
    "currency": "USD",
    "delivery_time": "string or null",
    "warranty": "string or null"
  },
  "confidence": number between 0-100,
  "reasoning": "Brief explanation"
}

IMPORTANT: Return ONLY valid JSON, no markdown, no code blocks.`;

  // Try each model until one works
  for (const modelName of GEMINI_MODELS) {
    try {
      console.log(`Trying Gemini model for email ID: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const response = result.response.text();
      
      let cleanJson = response
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      
      console.log(`Success with model: ${modelName}`);
      return JSON.parse(cleanJson);
    } catch (error) {
      console.log(`Model ${modelName} failed: ${error.message}`);
      continue;
    }
  }

  // All models failed
  throw new Error('Failed to identify email RFP. All Gemini models are unavailable. Please check your API key and try again.');
};

/**
 * Compare vendor quotes and recommend the best option
 * @param {Array} vendorQuotes - Array of vendor quotes
 * @param {Object} rfpRequirements - Original RFP requirements
 * @returns {Object} - Comparison analysis and recommendation
 */
export const compareVendorQuotes = async (vendorQuotes, rfpRequirements) => {
  const prompt = `You are a procurement expert. Compare the following vendor quotes for an RFP and recommend the best option.

RFP Requirements:
${JSON.stringify(rfpRequirements, null, 2)}

Vendor Quotes:
${JSON.stringify(vendorQuotes, null, 2)}

Analyze and return a JSON response:
{
  "best_price": {
    "vendor_id": "vendor with best price",
    "vendor_name": "name",
    "price": number,
    "reasoning": "why this is best price"
  },
  "best_warranty": {
    "vendor_id": "vendor with best warranty",
    "vendor_name": "name",
    "warranty": "warranty details",
    "reasoning": "why this is best warranty"
  },
  "best_overall": {
    "vendor_id": "recommended vendor",
    "vendor_name": "name",
    "score": number out of 100,
    "reasoning": "detailed reasoning for recommendation"
  },
  "comparison_table": [
    {
      "vendor_id": "id",
      "vendor_name": "name",
      "price": number,
      "warranty": "string",
      "delivery_time": "string",
      "score": number,
      "pros": ["list of pros"],
      "cons": ["list of cons"]
    }
  ],
  "summary": "Brief executive summary of the comparison"
}

IMPORTANT: Return ONLY valid JSON, no markdown, no code blocks.`;

  // Try each model until one works
  for (const modelName of GEMINI_MODELS) {
    try {
      console.log(`Trying Gemini model for compare: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const response = result.response.text();
      
      let cleanJson = response
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      
      console.log(`Success with model: ${modelName}`);
      return JSON.parse(cleanJson);
    } catch (error) {
      console.log(`Model ${modelName} failed: ${error.message}`);
      continue;
    }
  }

  // All models failed
  throw new Error('Failed to compare vendor quotes. All Gemini models are unavailable. Please check your API key and try again.');
};

export default {
  generateRFPFromText,
  identifyEmailRFP,
  compareVendorQuotes
};
