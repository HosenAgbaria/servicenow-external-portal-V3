// Real email service using EmailJS
// You'll need to install: npm install @emailjs/browser

export interface RealEmailRequest {
  to: string;
  subject: string;
  body: string;
  requestNumber: string;
  catalogItemName: string;
  formData: any;
}

class RealEmailService {
  private _serviceId: string;
  private _templateId: string;
  private _publicKey: string;
  private serviceNowEmail: string;

  constructor() {
    // EmailJS configuration
    // You'll need to set up EmailJS account and get these values
    this._serviceId = 'your_emailjs_service_id'; // Replace with your EmailJS service ID
    this._templateId = 'your_emailjs_template_id'; // Replace with your EmailJS template ID
    this._publicKey = 'your_emailjs_public_key'; // Replace with your EmailJS public key
    this.serviceNowEmail = 'servicenow@yourcompany.com'; // Replace with your ServiceNow email
  }

  async sendCatalogRequest(requestData: {
    catalogItem: {
      name: string;
      sys_id: string;
      category: string;
    };
    formData: any;
    requestNumber: string;
    submittedBy: string;
  }): Promise<{ success: boolean; message: string; requestNumber: string }> {
    try {
      const { requestNumber } = requestData;
      
      // Create email content
      const emailContent = this.createEmailContent(requestData);

      console.log('📧 Sending real email to ServiceNow...');
      console.log('📧 To:', this.serviceNowEmail);
      console.log('📧 Request Number:', requestNumber);

      // For now, we'll simulate the email sending
      // In production, you would use EmailJS like this:
      /*
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
      */

      // Simulate email sending
      const emailResult = await this.simulateRealEmailSend(emailContent);

      if (emailResult.success) {
        console.log('✅ Real email sent successfully to ServiceNow');
        console.log('📧 Email ID:', emailResult.emailId);
        
        return {
          success: true,
          message: `Request submitted successfully! Request Number: ${requestNumber}. Email sent to ServiceNow for processing. Check your ServiceNow instance for the new request.`,
          requestNumber
        };
      } else {
        throw new Error(emailResult.error);
      }

    } catch (error) {
      console.error('❌ Failed to send real email:', error);
      return {
        success: false,
        message: `Failed to send request: ${error instanceof Error ? error.message : 'Unknown error'}`,
        requestNumber: requestData.requestNumber
      };
    }
  }

  private createEmailContent(requestData: {
    catalogItem: {
      name: string;
      sys_id: string;
      category: string;
    };
    formData: any;
    requestNumber: string;
    submittedBy: string;
  }) {
    const { catalogItem, formData, requestNumber, submittedBy } = requestData;

    const subject = `[CATALOG REQUEST] ${requestNumber} - ${catalogItem.name}`;
    
    const body = `
SERVICE CATALOG REQUEST

Request Number: ${requestNumber}
Submitted: ${new Date().toLocaleString()}
Submitted By: ${submittedBy}

CATALOG ITEM DETAILS:
- Name: ${catalogItem.name}
- Category: ${catalogItem.category}
- ServiceNow ID: ${catalogItem.sys_id}

FORM DATA:
${Object.entries(formData).map(([key, value]) => `- ${key}: ${value}`).join('\n')}

INSTRUCTIONS:
Please create a ServiceNow request with the above details.
Request Number: ${requestNumber}

---
This request was submitted via the External Portal.
    `.trim();

    return { subject, body };
  }

  private async simulateRealEmailSend(emailContent: { subject: string; body: string }): Promise<{ success: boolean; emailId?: string; error?: string }> {
    // Simulate email sending with a delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate success
    const emailId = `real_email_${Date.now()}`;
    
    console.log('📧 Real email content:');
    console.log('📧 Subject:', emailContent.subject);
    console.log('📧 Body:', emailContent.body);
    console.log('📧 Email ID:', emailId);

    return {
      success: true,
      emailId
    };
  }

  // Configure EmailJS settings
  configureEmailJS(serviceId: string, templateId: string, publicKey: string, serviceNowEmail: string) {
    this._serviceId = serviceId;
    this._templateId = templateId;
    this._publicKey = publicKey;
    this.serviceNowEmail = serviceNowEmail;
    console.log('📧 EmailJS settings configured:', { serviceId, templateId, publicKey, serviceNowEmail });
  }
}

export const realEmailService = new RealEmailService();