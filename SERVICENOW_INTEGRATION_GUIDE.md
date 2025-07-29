# ServiceNow Integration Guide

## 🎯 **Goal: Real ServiceNow Request Creation**

This guide explains how to set up real ServiceNow integration so that catalog requests are actually created in your ServiceNow instance.

## 📋 **Current Status**

- ✅ **Frontend Portal**: Working and functional
- ✅ **ServiceNow API Read Access**: Working (can read catalog items)
- ❌ **ServiceNow API Write Access**: Restricted (cannot create records)
- ✅ **Email Integration**: Implemented as fallback solution

## 🔧 **Integration Options**

### **Option 1: ServiceNow API Configuration (Recommended)**

#### **Step 1: ServiceNow Admin Configuration**
1. **Login to ServiceNow** as an administrator
2. **Navigate to**: System Definition → Tables
3. **Find these tables** and enable REST API access:
   - `sc_req_item` (Service Catalog Request Items)
   - `sc_request` (Service Catalog Requests)
   - `incident` (Incidents)

#### **Step 2: Enable REST API Write Access**
1. **Navigate to**: System Definition → REST API
2. **Enable write access** for the required tables
3. **Configure permissions** for the API user (`ext.portal.v2`)

#### **Step 3: Test API Write Access**
Run this command to test:
```bash
node test-servicenow-write-access.js
```

### **Option 2: Email Integration (Current Implementation)**

#### **Step 1: Configure EmailJS**
1. **Sign up for EmailJS**: https://www.emailjs.com/
2. **Create an email service** (Gmail, Outlook, etc.)
3. **Create an email template** for ServiceNow requests
4. **Get your credentials**:
   - Service ID
   - Template ID
   - Public Key

#### **Step 2: Update Email Configuration**
In `src/services/realEmailService.ts`:
```typescript
this.serviceId = 'your_emailjs_service_id';
this.templateId = 'your_emailjs_template_id';
this.publicKey = 'your_emailjs_public_key';
this.serviceNowEmail = 'servicenow@yourcompany.com';
```

#### **Step 3: Install EmailJS**
```bash
npm install @emailjs/browser
```

#### **Step 4: Enable Real Email Sending**
Uncomment the EmailJS code in `src/services/realEmailService.ts`:
```typescript
const emailjs = await import('@emailjs/browser');

const result = await emailjs.send(
  this.serviceId,
  this.templateId,
  {
    to_email: this.serviceNowEmail,
    subject: emailContent.subject,
    message: emailContent.body,
    request_number: requestNumber,
    catalog_item: catalogItem.name,
    form_data: JSON.stringify(formData),
    submitted_by: submittedBy
  },
  this.publicKey
);
```

### **Option 3: ServiceNow Webhook Integration**

#### **Step 1: Create ServiceNow Webhook**
1. **Navigate to**: System Web Services → Outbound → REST Message
2. **Create new REST Message** for catalog requests
3. **Configure endpoint** to receive requests from your portal

#### **Step 2: Implement Webhook in Portal**
Create a webhook service that sends requests to ServiceNow.

### **Option 4: Direct Database Integration**

#### **Step 1: Database Access**
1. **Get database credentials** for ServiceNow
2. **Configure direct database connection**
3. **Create records directly** in ServiceNow tables

## 🚀 **Quick Setup for Real Integration**

### **For Email Integration (Easiest):**

1. **Install EmailJS**:
   ```bash
   npm install @emailjs/browser
   ```

2. **Configure EmailJS** in `src/services/realEmailService.ts`:
   ```typescript
   configureEmailJS(
     'your_service_id',
     'your_template_id', 
     'your_public_key',
     'servicenow@yourcompany.com'
   );
   ```

3. **Enable real email sending** by uncommenting the EmailJS code

4. **Test the integration**:
   - Submit a catalog request
   - Check your email for the ServiceNow request
   - Verify the request appears in ServiceNow

### **For API Integration (Most Robust):**

1. **Contact ServiceNow Administrator** to:
   - Enable REST API write access
   - Configure proper permissions
   - Set up catalog ordering endpoints

2. **Update the API service** to use real endpoints

3. **Test the integration** with real ServiceNow API calls

## 📧 **Email Template for ServiceNow**

Create this email template in EmailJS:

**Subject**: `[CATALOG REQUEST] {{request_number}} - {{catalog_item}}`

**Body**:
```
SERVICE CATALOG REQUEST

Request Number: {{request_number}}
Submitted: {{submitted_date}}
Submitted By: {{submitted_by}}

CATALOG ITEM DETAILS:
- Name: {{catalog_item}}
- Category: {{category}}
- ServiceNow ID: {{servicenow_id}}

FORM DATA:
{{form_data}}

INSTRUCTIONS:
Please create a ServiceNow request with the above details.
Request Number: {{request_number}}

---
This request was submitted via the External Portal.
```

## 🔍 **Testing Real Integration**

### **Test Email Integration:**
1. Submit a catalog request
2. Check browser console for email details
3. Verify email was "sent" (in simulation mode)
4. Check your email inbox for the request

### **Test API Integration:**
1. Run: `node test-servicenow-write-access.js`
2. Look for successful POST responses
3. Check ServiceNow for new records

## 📞 **Support**

If you need help with ServiceNow configuration:
1. **Contact your ServiceNow administrator**
2. **Check ServiceNow documentation** for REST API setup
3. **Review EmailJS documentation** for email integration

## 🎯 **Next Steps**

1. **Choose an integration method** (Email or API)
2. **Configure the chosen method**
3. **Test the integration**
4. **Deploy to production**

The portal is ready for real ServiceNow integration - you just need to configure one of the methods above! 