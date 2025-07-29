export interface EmailRequest {
  to: string;
  subject: string;
  body: string;
  attachments?: Array<{
    filename: string;
    content: string;
    contentType: string;
  }>;
}

class EmailService {
  private serviceNowEmail: string;
  private fromEmail: string;

  constructor() {
    // ServiceNow email integration settings
    this.serviceNowEmail = 'servicenow@tanivdynamicsltddemo4.service-now.com'; // This would be the ServiceNow email address
    this.fromEmail = 'portal@yourcompany.com'; // This would be your portal's email
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
      const { catalogItem, formData, requestNumber, submittedBy } = requestData;

      // Create email subject
      const subject = `[CATALOG REQUEST] ${requestNumber} - ${catalogItem.name}`;

      // Create email body
      const body = this.createEmailBody(requestData);

      // Create email request
      const emailRequest: EmailRequest = {
        to: this.serviceNowEmail,
        subject,
        body,
        attachments: []
      };

      console.log('📧 Sending catalog request via email...');
      console.log('📧 To:', this.serviceNowEmail);
      console.log('📧 Subject:', subject);
      console.log('📧 Request Number:', requestNumber);

      // In a real implementation, you would use an email service like:
      // - SendGrid
      // - AWS SES
      // - Nodemailer
      // - EmailJS (for frontend)
      
      // For now, we'll simulate the email sending
      const emailResult = await this.simulateEmailSend(emailRequest);

      if (emailResult.success) {
        console.log('✅ Email sent successfully');
        console.log('📧 Email ID:', emailResult.emailId);
        
        return {
          success: true,
          message: `Request submitted successfully! Request Number: ${requestNumber}. Email sent to ServiceNow for processing.`,
          requestNumber
        };
      } else {
        throw new Error(emailResult.error);
      }

    } catch (error) {
      console.error('❌ Failed to send email:', error);
      return {
        success: false,
        message: `Failed to send request: ${error instanceof Error ? error.message : 'Unknown error'}`,
        requestNumber: requestData.requestNumber
      };
    }
  }

  private createEmailBody(requestData: {
    catalogItem: {
      name: string;
      sys_id: string;
      category: string;
    };
    formData: any;
    requestNumber: string;
    submittedBy: string;
  }): string {
    const { catalogItem, formData, requestNumber, submittedBy } = requestData;

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

    return body;
  }

  private async simulateEmailSend(emailRequest: EmailRequest): Promise<{ success: boolean; emailId?: string; error?: string }> {
    // Simulate email sending with a delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simulate success (in real implementation, this would be actual email sending)
    const emailId = `email_${Date.now()}`;
    
    console.log('📧 Email content:');
    console.log('📧 Subject:', emailRequest.subject);
    console.log('📧 Body:', emailRequest.body);

    return {
      success: true,
      emailId
    };
  }

  // Method to configure email settings
  configureEmailSettings(serviceNowEmail: string, fromEmail: string) {
    this.serviceNowEmail = serviceNowEmail;
    this.fromEmail = fromEmail;
    console.log('📧 Email settings configured:', { serviceNowEmail, fromEmail });
  }
}

export const emailService = new EmailService(); 