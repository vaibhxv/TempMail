'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Copy, Mail, Inbox, RefreshCw, Clock, Trash2, Eye, AlertCircle, CheckCircle, Globe, Paperclip, User } from 'lucide-react';
import { toast } from 'sonner';
import { TempMailAPI, type TempEmail, type EmailMessage } from '@/lib/tempmail-api';

export default function EmailPage() {
  const [currentEmail, setCurrentEmail] = useState<TempEmail | null>(null);
  const [messages, setMessages] = useState<EmailMessage[]>([]);
  const [domains, setDomains] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<EmailMessage | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  // Helper function to clean HTML content and extract text
  const cleanHtmlContent = (htmlString: string): string => {
    if (!htmlString) return '';
    
    // Remove HTML tags and decode entities
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlString;
    return tempDiv.textContent || tempDiv.innerText || '';
  };

  // Helper function to get clean preview text
  const getCleanPreview = (message: EmailMessage): string => {
    // Try different sources for preview text
    let previewText = '';
    
    if (message.mail_preview && message.mail_preview !== '...') {
      previewText = message.mail_preview;
    } else if (message.mail_text_only) {
      previewText = cleanHtmlContent(message.mail_text_only);
    } else if (message.mail_text) {
      previewText = message.mail_text;
    } else if (message.mail_html) {
      previewText = cleanHtmlContent(message.mail_html);
    }
    
    // Limit preview length and clean up
    return previewText.trim().substring(0, 120) + (previewText.length > 120 ? '...' : '');
  };

  // Helper function to get clean message content for display
  const getMessageContent = (message: EmailMessage): { text: string; html: string } => {
    let textContent = '';
    let htmlContent = '';
    
    if (message.mail_html) {
      htmlContent = message.mail_html;
      textContent = cleanHtmlContent(message.mail_html);
    } else if (message.mail_text_only) {
      const cleanText = cleanHtmlContent(message.mail_text_only);
      textContent = cleanText;
      htmlContent = message.mail_text_only;
    } else if (message.mail_text) {
      textContent = message.mail_text;
      htmlContent = message.mail_text.replace(/\n/g, '<br>');
    }
    
    return { text: textContent, html: htmlContent };
  };

  // Helper function to extract sender name and email
  const parseSender = (fromField: string): { name: string; email: string } => {
    // const match = fromField.match(/^(.*?)\s*<(.+)>$/);
    // if (match) {
    //   return {
    //     name: match[1].trim(),
    //     email: match[2].trim()
    //   };
    // }
    return {
      name: fromField,
      email: fromField
    };
  };

  const loadDomains = async () => {
    try {
      const availableDomains = await TempMailAPI.getDomains();
      setDomains(availableDomains);
    } catch (err) {
      console.error('Error loading domains:', err);
    }
  };

  const generateEmail = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const newEmail = await TempMailAPI.generateEmail();
      if (newEmail) {
        setCurrentEmail(newEmail);
        setMessages([]);
        toast.success('New temporary email generated!');
        
        // Start checking for messages after a short delay
        setTimeout(() => {
          refreshMessages();
        }, 3000);
      } else {
        setError('Failed to generate email. Please try again.');
        toast.error('Failed to generate email');
      }
    } catch (err) {
      setError('Service temporarily unavailable. Please try again later.');
      toast.error('Service error occurred');
      console.error('Generate email error:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshMessages = useCallback(async () => {
    if (!currentEmail?.token) return;
    
    setRefreshing(true);
    try {
      const newMessages = await TempMailAPI.getMessages(currentEmail.token);
      const previousCount = messages.length;
      console.log(newMessages);
      
      setMessages(newMessages);
      setLastRefresh(new Date());
      
      if (newMessages.length > previousCount) {
        const newCount = newMessages.length - previousCount;
        toast.success(`${newCount} new message(s) received!`);
      }
    } catch (err) {
      console.error('Error refreshing messages:', err);
      toast.error('Failed to refresh messages');
    } finally {
      setRefreshing(false);
    }
  }, [currentEmail?.token, messages.length]);

  const copyToClipboard = () => {
    if (currentEmail?.mail) {
      navigator.clipboard.writeText(currentEmail.mail);
      toast.success('Email address copied to clipboard!');
    }
  };

  const deleteMessage = async (mailId: string) => {
    try {
      const success = await TempMailAPI.deleteMessage(mailId);
      if (success) {
        setMessages(prev => prev.filter(msg => msg.mail_id !== mailId));
        toast.success('Message deleted');
        
        if (selectedMessage?.mail_id === mailId) {
          setSelectedMessage(null);
          setIsDialogOpen(false);
        }
      } else {
        toast.error('Failed to delete message');
      }
    } catch (err) {
      toast.error('Error deleting message');
      console.error('Delete message error:', err);
    }
  };

  const deleteAllMessages = async () => {
    if (!currentEmail?.token) return;
    
    try {
      const success = await TempMailAPI.deleteAllMessages(currentEmail.token);
      if (success) {
        setMessages([]);
        toast.success('All messages deleted');
        setSelectedMessage(null);
        setIsDialogOpen(false);
      } else {
        toast.error('Failed to delete messages');
      }
    } catch (err) {
      toast.error('Error deleting messages');
      console.error('Delete all messages error:', err);
    }
  };

  const viewMessage = async (message: EmailMessage) => {
    try {
      if (message) {
        setSelectedMessage(message);
        setIsDialogOpen(true);
      } else {
        // Fallback to the message we already have
        setSelectedMessage(message);
        setIsDialogOpen(true);
      }
    } catch (err) {
      toast.error('Error loading message');
      console.error('View message error:', err);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    
    if (diffSecs < 60) return `${diffSecs}s ago`;
    if (diffSecs < 3600) return `${Math.floor(diffSecs / 60)}m ago`;
    if (diffSecs < 86400) return `${Math.floor(diffSecs / 3600)}h ago`;
    return `${Math.floor(diffSecs / 86400)}d ago`;
  };

  // Auto-refresh messages every 30 seconds
  useEffect(() => {
    if (!currentEmail?.token) return;
    
    const interval = setInterval(refreshMessages, 30000);
    return () => clearInterval(interval);
  }, [currentEmail?.token, refreshMessages]);

  // Load domains and generate initial email on mount
  useEffect(() => {
    loadDomains();
    generateEmail();
  }, []);

  return (
    <div className="">
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Temporary Email Generator
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Generate real temporary email addresses instantly. Perfect for registrations, testing, and protecting your privacy.
          </p>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2 text-red-700"
          >
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Email Generator */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Card className="bg-white/50 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <span>Generate Email</span>
                  {currentEmail && (
                    <Badge variant="secondary" className="ml-auto">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Active
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex space-x-2">
                    <Input
                      value={currentEmail?.mail || ''}
                      readOnly
                      className="font-mono text-sm"
                      placeholder="Click generate to create email"
                    />
                    <Button
                      onClick={copyToClipboard}
                      variant="outline"
                      size="icon"
                      disabled={!currentEmail}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      onClick={generateEmail}
                      disabled={loading}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      {loading ? 'Generating...' : 'Generate New Email'}
                    </Button>
                    
                    {messages.length > 0 && (
                      <Button
                        onClick={deleteAllMessages}
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  {lastRefresh && (
                    <div className="text-xs text-gray-500 flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>Last checked: {formatRelativeTime(lastRefresh)}</span>
                    </div>
                  )}
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Features</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Real temporary email addresses</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Instant message delivery</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Auto-refresh every 30 seconds</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>No registration required</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Inbox */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Card className="bg-white/50 backdrop-blur-sm border-white/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Inbox className="w-5 h-5 text-blue-600" />
                    <span>Inbox</span>
                    {messages.length > 0 && (
                      <Badge variant="secondary">{messages.length}</Badge>
                    )}
                  </CardTitle>
                  <Button
                    onClick={refreshMessages}
                    variant="outline"
                    size="sm"
                    disabled={refreshing || !currentEmail}
                  >
                    <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {!currentEmail ? (
                  <div className="text-center py-8 text-gray-500">
                    <Mail className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Generate an email address to start receiving messages</p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Mail className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No emails yet. Waiting for incoming messages...</p>
                    <p className="text-xs mt-2">Messages auto-refresh every 30 seconds</p>
                    {lastRefresh && (
                      <p className="text-xs mt-1">Last checked: {formatRelativeTime(lastRefresh)}</p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {messages.map((message) => {
                      const sender = parseSender(message.mail_from);
                      const preview = getCleanPreview(message);
                      
                      return (
                        <motion.div
                          key={message.mail_id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="group p-4 border rounded-lg bg-white/40 hover:bg-white/60 transition-all duration-200 cursor-pointer hover:shadow-md"
                          onClick={() => viewMessage(message)}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-start space-x-3 flex-1 min-w-0">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <User className="w-5 h-5 text-blue-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2 mb-1">
                                  <p className="text-sm font-semibold text-gray-900 truncate">
                                    {sender.name}
                                  </p>
                                  <div className="flex items-center text-xs text-gray-500">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {formatDate(message.mail_timestamp)}
                                  </div>
                                </div>
                                <p className="text-xs text-gray-600 truncate mb-1">
                                  {sender.email}
                                </p>
                                <p className="text-sm font-medium text-gray-800 truncate">
                                  {message.mail_subject || 'No Subject'}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteMessage(message.mail_id);
                                }}
                                variant="ghost"
                                size="sm"
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="ml-13">
                            <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                              {preview || 'No preview available'}
                            </p>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                {message.mail_attachments_count > 0 && (
                                  <Badge variant="outline" className="text-xs">
                                    <Paperclip className="w-3 h-3 mr-1" />
                                    {message.mail_attachments_count}
                                  </Badge>
                                )}
                              </div>
                              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                                <Eye className="w-3 h-3 mr-1" />
                                View
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Message Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>Email Message</span>
                {selectedMessage && (
                  <Button
                    onClick={() => deleteMessage(selectedMessage.mail_id)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                )}
              </DialogTitle>
            </DialogHeader>
            
            {selectedMessage && (
              <div className="space-y-6">
                <div className="border-b pb-4">
                  <div className="grid grid-cols-1 gap-4 text-sm">
                    {(() => {
                      const sender = parseSender(selectedMessage.mail_from);
                      return (
                        <>
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                              <User className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{sender.name}</p>
                              <p className="text-gray-600 text-sm">{sender.email}</p>
                            </div>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Date:</span>
                            <p className="text-gray-900">{formatDate(selectedMessage.mail_timestamp)}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Subject:</span>
                            <p className="text-gray-900 font-medium">{selectedMessage.mail_subject || 'No Subject'}</p>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
                
                <div>
                  <span className="font-medium text-gray-700 block mb-3">Message:</span>
                  {(() => {
                    const { text, html } = getMessageContent(selectedMessage);
                    
                    return html && html !== text ? (
                      <div className="bg-gray-50 rounded-lg p-6 border">
                        <div 
                          className="prose max-w-none prose-sm"
                          dangerouslySetInnerHTML={{ __html: html }}
                        />
                      </div>
                    ) : (
                      <div className="bg-gray-50 rounded-lg p-6 border">
                        <p className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                          {text || 'No content available'}
                        </p>
                      </div>
                    );
                  })()}
                </div>
                
                {selectedMessage.mail_attachments_count > 0 && (
                  <div className="border-t pt-4">
                    <div className="flex items-center space-x-2 text-gray-700">
                      <Paperclip className="w-4 h-4" />
                      <span className="font-medium">Attachments:</span>
                      <Badge variant="outline">
                        {selectedMessage.mail_attachments_count} file{selectedMessage.mail_attachments_count > 1 ? 's' : ''}
                      </Badge>
                    </div>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-12"
        >
          <Card className="bg-white/30 backdrop-blur-sm border-white/20">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">How It Works</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Generate</h3>
                  <p className="text-gray-600 text-sm">Click generate to create a real temporary email address</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-purple-600 font-bold">2</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Use</h3>
                  <p className="text-gray-600 text-sm">Copy and use the email for registrations, verifications, or testing</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-green-600 font-bold">3</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Receive</h3>
                  <p className="text-gray-600 text-sm">Monitor your inbox for real incoming emails with auto-refresh</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}