import md5 from 'md5';

const RAPIDAPI_KEY = process.env.NEXT_PUBLIC_RAPIDAPI_KEY || '';
const RAPIDAPI_HOST = process.env.NEXT_PUBLIC_RAPIDAPI_HOST || '';

export interface TempEmail {
  mail: string;
  token: string;
}

// Updated interface to match the actual API response structure
export interface EmailMessage {
  mail_id: string;
  mail_address_id: string;
  mail_from: string;
  mail_subject: string;
  mail_preview: string;
  mail_text_only: string;
  mail_text: string;
  mail_html: string;
  mail_timestamp: number;
  mail_attachments_count: number;
  mail_attachments?: {
    attachment: any[];
  };
  _id?: {
    oid: string;
  };
  createdAt?: {
    milliseconds: number;
  };
}

export class TempMailAPI {
  private static baseURL = `https://${RAPIDAPI_HOST}`;

  private static getHeaders() {
    return {
      'x-rapidapi-key': RAPIDAPI_KEY,
      'x-rapidapi-host': RAPIDAPI_HOST,
      'Content-Type': 'application/json',
    };
  }

  private static isValidMD5(str: string): boolean {
    return /^[a-f0-9]{32}$/i.test(str);
  }

  private static generateMD5(text: string): string {
    return md5(text);
  }

  static async getDomains(): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseURL}/request/domains/`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const result = await response.text();
      const domains = JSON.parse(result);
      return Array.isArray(domains) ? domains : domains?.domains || [];
    } catch {
      return ['1secmail.com', '1secmail.org', '1secmail.net', 'guerrillamail.com', 'tempmail.org'];
    }
  }

  static async generateEmail(): Promise<TempEmail | null> {
    try {
      const domains = await this.getDomains();
      const domain = domains[Math.floor(Math.random() * domains.length)].replace(/^@/, '');
      const randomString = Math.random().toString(36).substring(2, 12);
      const emailAddress = `${randomString}@${domain}`;
      const token = this.generateMD5(emailAddress);

      return { mail: emailAddress, token };
    } catch {
      const fallbackEmail = `user${Date.now()}@1secmail.com`;
      const token = this.generateMD5(fallbackEmail);
      return { mail: fallbackEmail, token };
    }
  }

  static async getMessages(token: string): Promise<EmailMessage[]> {
    try {
      console.log('Fetching messages for token:', token);
      
      const response = await fetch(
        `${this.baseURL}/request/mail/id/${token}/`,
        {
          method: 'GET',
          headers: this.getHeaders(), // Use the consistent headers
        }
      );

      console.log('Response status:', response.status);

      if (!response.ok) {
        console.error('Failed to fetch messages:', response.status, response.statusText);
        throw new Error(`Failed to fetch messages: ${response.status}`);
      }

      const responseText = await response.text();
      console.log('Raw response:', responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        console.error('Response text:', responseText);
        return [];
      }

      console.log('Parsed data:', data);

      // Handle different response formats
      let messages: any[] = [];
      if (Array.isArray(data)) {
        messages = data;
      } else if (data && Array.isArray(data.messages)) {
        messages = data.messages;
      } else if (data && typeof data === 'object') {
        // If it's a single message object, wrap it in an array
        messages = [data];
      }

      console.log('Messages array:', messages);

      // Transform the messages to match our interface
      const transformedMessages: EmailMessage[] = messages.map((msg: any) => ({
        mail_id: msg.mail_id,
        mail_address_id: msg.mail_address_id,
        mail_from: msg.mail_from,
        mail_subject: msg.mail_subject || 'No Subject',
        mail_preview: msg.mail_preview || msg.mail_text_only?.substring(0, 100) + '...' || 'No preview',
        mail_text_only: msg.mail_text_only || msg.mail_text || '',
        mail_text: msg.mail_text || msg.mail_text_only || '',
        mail_html: msg.mail_html || '',
        mail_timestamp: msg.mail_timestamp || (msg.createdAt?.milliseconds ? msg.createdAt.milliseconds / 1000 : Date.now() / 1000),
        mail_attachments_count: msg.mail_attachments_count || 0,
        mail_attachments: msg.mail_attachments,
        _id: msg._id,
        createdAt: msg.createdAt,
      }));

      console.log('Transformed messages:', transformedMessages);
      return transformedMessages;

    } catch (error) {
      console.error('Error in getMessages:', error);
      throw error;
    }
  }

  static async deleteMessage(mailId: string): Promise<boolean> {
    if (!this.isValidMD5(mailId)) return false;

    try {
      const res = await fetch(`${this.baseURL}/request/delete/id/${mailId}/`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      return res.ok || res.status === 404;
    } catch {
      return false;
    }
  }

  static async getMessageAttachments(mailId: string): Promise<any[]> {
    if (!this.isValidMD5(mailId)) return [];

    try {
      const res = await fetch(`${this.baseURL}/request/attachments/id/${mailId}/`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      const text = await res.text();
      return JSON.parse(text) || [];
    } catch {
      return [];
    }
  }


  static async deleteAllMessages(token: string): Promise<boolean> {
    if (!this.isValidMD5(token)) return false;

    try {
      const messages = await this.getMessages(token);
      const results = await Promise.all(messages.map(msg => this.deleteMessage(msg.mail_id)));
      const deleted = results.filter(Boolean).length;
      return deleted >= Math.ceil(messages.length / 2);
    } catch {
      return false;
    }
  }

  static isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  static async generateCustomEmail(username: string): Promise<TempEmail | null> {
    try {
      const domains = await this.getDomains();
      const selectedDomain = domains[0].replace(/^@/, '');
      const cleanUsername = username.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
      if (cleanUsername.length < 3) throw new Error('Username too short');

      const emailAddress = `${cleanUsername}@${selectedDomain}`;
      const token = this.generateMD5(emailAddress);

      return { mail: emailAddress, token };
    } catch {
      return this.generateEmail();
    }
  }
}