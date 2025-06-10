export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  publishedAt: string;
  readTime: number;
  tags: string[];
  author: {
    name: string;
    avatar: string;
    bio: string;
  };
  seo: {
    metaDescription: string;
    keywords: string[];
  };
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'ultimate-guide-temporary-email-testing',
    title: 'The Ultimate Guide to Temporary Email Testing in 2024',
    excerpt: 'Learn how to effectively use temporary email addresses for testing web applications, protecting your privacy, and improving your development workflow.',
    content: `# The Ultimate Guide to Temporary Email Testing in 2024

Testing web applications often requires email addresses, but using your personal email can lead to spam and privacy concerns. Temporary email addresses provide the perfect solution for developers and testers.

## Why Use Temporary Email Addresses?

Temporary email addresses offer several advantages:

- **Privacy Protection**: Keep your personal email clean and private
- **Spam Prevention**: Avoid unwanted marketing emails
- **Testing Efficiency**: Quickly test email functionality without setup
- **Multiple Scenarios**: Test different user types and edge cases

## Best Practices for Email Testing

### 1. Choose Reliable Providers
Select temporary email services that offer:
- Good uptime and reliability
- Various domain options
- Easy integration with testing tools

### 2. Test Different Scenarios
Use temporary emails to test:
- Registration flows
- Password reset functionality
- Email verification processes
- Newsletter subscriptions

### 3. Automate When Possible
Integrate temporary email generation into your automated testing pipeline for consistent and repeatable tests.

## Security Considerations

While temporary emails are great for testing, remember:
- Never use them for production accounts
- Be aware of data retention policies
- Consider the security implications for sensitive tests

## Conclusion

Temporary email addresses are an essential tool for modern web development. They provide privacy, prevent spam, and enable comprehensive testing without the overhead of managing multiple real email accounts.`,
    image: 'https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=800',
    publishedAt: '2024-01-15T10:00:00Z',
    readTime: 8,
    tags: ['email', 'testing', 'privacy', 'development'],
    author: {
      name: 'Alex Thompson',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
      bio: 'Senior Full Stack Developer with 8+ years of experience in web application testing and security.'
    },
    seo: {
      metaDescription: 'Complete guide to using temporary email addresses for testing web applications, protecting privacy, and improving development workflows in 2024.',
      keywords: ['temporary email', 'email testing', 'web development', 'privacy protection', 'testing tools']
    }
  },
  {
    slug: 'protecting-privacy-online-development',
    title: 'Protecting Your Privacy During Online Development',
    excerpt: 'Essential strategies and tools for maintaining privacy while developing and testing web applications in an increasingly connected world.',
    content: `# Protecting Your Privacy During Online Development

As developers, we often expose our personal information while testing and building applications. Here's how to maintain your privacy while staying productive.

## The Privacy Challenge

Modern development involves:
- Testing with real-looking data
- Signing up for various services
- Sharing code and configurations
- Using third-party APIs and tools

Each of these activities can compromise your privacy if not handled carefully.

## Essential Privacy Tools

### 1. Temporary Data Generators
Use tools that generate:
- Temporary email addresses
- Fake phone numbers
- Test addresses
- Sample credit card numbers

### 2. Virtual Private Networks (VPNs)
VPNs help by:
- Masking your real IP address
- Encrypting your internet traffic
- Allowing testing from different locations

### 3. Separate Development Environments
Create isolated environments for:
- Testing new tools and services
- Experimenting with code
- Trying potentially risky integrations

## Data Minimization Strategies

### Use Realistic but Fake Data
- Generate data that looks real but isn't
- Avoid using any actual personal information
- Use temporary services for all testing needs

### Compartmentalize Your Digital Life
- Keep development and personal accounts separate
- Use different browsers or profiles
- Maintain separate email addresses for different purposes

## Best Practices

1. **Never use real personal data for testing**
2. **Regularly clean up test accounts and data**
3. **Use temporary services whenever possible**
4. **Keep your development environment isolated**
5. **Be cautious with third-party integrations**

## Conclusion

Privacy protection in development isn't just about personal security—it's about professional responsibility and creating a sustainable development practice that protects both you and your users.`,
    image: 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=800',
    publishedAt: '2024-01-12T14:30:00Z',
    readTime: 6,
    tags: ['privacy', 'security', 'development', 'tools'],
    author: {
      name: 'Sarah Martinez',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
      bio: 'Cybersecurity expert and developer advocate focused on privacy-first development practices.'
    },
    seo: {
      metaDescription: 'Learn essential strategies and tools for protecting your privacy while developing and testing web applications online.',
      keywords: ['privacy protection', 'secure development', 'data privacy', 'development security', 'online privacy']
    }
  },
  {
    slug: 'credit-card-testing-best-practices',
    title: 'Credit Card Testing: Best Practices for E-commerce Development',
    excerpt: 'Complete guide to safely testing payment flows in e-commerce applications using test credit card numbers and sandbox environments.',
    content: `# Credit Card Testing: Best Practices for E-commerce Development

Testing payment functionality is crucial for e-commerce applications, but it requires careful attention to security and best practices.

## Understanding Test Credit Card Numbers

### What Are Test Credit Card Numbers?
Test credit card numbers are specifically designed for testing purposes:
- They follow the Luhn algorithm for validation
- They will never charge real money
- They work only in sandbox/test environments

### Common Test Card Types
- **Visa**: 4111 1111 1111 1111
- **Mastercard**: 5555 5555 5555 4444
- **American Express**: 3782 8224 6310 005

## Setting Up Test Environments

### 1. Use Payment Gateway Sandboxes
Major payment providers offer sandbox environments:
- Stripe Test Mode
- PayPal Sandbox
- Square Sandbox
- Authorize.net Test Environment

### 2. Configure Test Keys
Always use test API keys and never production keys during development:
- Keep test and production keys separate
- Use environment variables
- Never commit keys to version control

## Testing Scenarios

### Success Scenarios
Test various successful payment flows:
- Different card types
- Various amounts
- International cards
- Recurring payments

### Failure Scenarios
Test error handling for:
- Declined cards
- Insufficient funds
- Invalid card numbers
- Network timeouts

### Edge Cases
Don't forget to test:
- Very small amounts (under $1)
- Large amounts
- Multiple rapid transactions
- Partial refunds

## Security Considerations

### Never Use Real Card Data
- Always use designated test numbers
- Never test with real credit card information
- Educate your team about testing protocols

### Secure Your Test Environment
- Use HTTPS even in testing
- Secure test databases
- Limit access to test environments
- Regularly clean test data

## Compliance and Legal Aspects

### PCI DSS Compliance
Even in testing:
- Follow security standards
- Properly handle test data
- Document testing procedures
- Regular security assessments

### Data Retention
- Don't store test card data unnecessarily
- Regular cleanup of test transactions
- Clear data retention policies

## Automation and CI/CD

### Automated Payment Testing
- Include payment tests in your test suite
- Use test card numbers in automated tests
- Test different payment scenarios automatically

### Environment Management
- Separate test and production environments
- Automated deployment to test environments
- Consistent test data across environments

## Conclusion

Proper credit card testing is essential for e-commerce success. By following these best practices, you can ensure your payment flows work correctly while maintaining security and compliance standards.`,
    image: 'https://images.pexels.com/photos/164501/pexels-photo-164501.jpeg?auto=compress&cs=tinysrgb&w=800',
    publishedAt: '2024-01-08T09:15:00Z',
    readTime: 10,
    tags: ['payments', 'testing', 'e-commerce', 'security'],
    author: {
      name: 'Marcus Chen',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
      bio: 'E-commerce developer and payment systems specialist with expertise in secure transaction processing.'
    },
    seo: {
      metaDescription: 'Comprehensive guide to testing credit card payments in e-commerce applications using test card numbers and sandbox environments.',
      keywords: ['credit card testing', 'payment testing', 'e-commerce development', 'test credit cards', 'payment gateway testing']
    }
  }
];

export function getAllBlogSlugs(): string[] {
  return blogPosts.map(post => post.slug);
}

export function getBlogPost(slug: string): BlogPost | null {
  return blogPosts.find(post => post.slug === slug) || null;
}

export function getAllBlogPosts(): BlogPost[] {
  return blogPosts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export function getBlogPostsByTag(tag: string): BlogPost[] {
  return blogPosts.filter(post => post.tags.includes(tag.toLowerCase()));
}

export function getAllTags(): string[] {
  const tags = new Set<string>();
  blogPosts.forEach(post => {
    post.tags.forEach(tag => tags.add(tag));
  });
  return Array.from(tags).sort();
}