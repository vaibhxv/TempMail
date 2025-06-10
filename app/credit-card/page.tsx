'use client';

import { useState, useEffect } from 'react';
import { CreditCard, Copy, RefreshCw, Shield, Eye, EyeOff, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const cardTypes = [
  { name: 'Visa', prefix: '4', length: 16, color: 'bg-blue-600', logo: '💳' },
  { name: 'Mastercard', prefix: '5', length: 16, color: 'bg-red-600', logo: '💳' },
  { name: 'American Express', prefix: '34', length: 15, color: 'bg-green-600', logo: '💳' },
  { name: 'Discover', prefix: '6', length: 16, color: 'bg-orange-600', logo: '💳' }
];

function generateLuhnValidNumber(prefix: string, length: number): string {
  const digits = prefix.split('').map(Number);
  
  // Fill remaining digits (except last one)
  while (digits.length < length - 1) {
    digits.push(Math.floor(Math.random() * 10));
  }
  
  // Calculate Luhn checksum
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let digit = digits[i];
    if ((digits.length - i) % 2 === 0) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }
  
  const checkDigit = (10 - (sum % 10)) % 10;
  digits.push(checkDigit);
  
  return digits.join('');
}

interface CreditCardData {
  type: string;
  number: string;
  formattedNumber: string;
  expiry: string;
  cvv: string;
  cardholderName: string;
  color: string;
  logo: string;
}

function generateTempCreditCard(): CreditCardData {
  const cardType = cardTypes[Math.floor(Math.random() * cardTypes.length)];
  const cardNumber = generateLuhnValidNumber(cardType.prefix, cardType.length);
  
  // Format card number with spaces
  const formattedNumber = cardNumber.replace(/(.{4})/g, '$1 ').trim();
  
  // Generate expiry date (1-5 years from now)
  const currentDate = new Date();
  const expiryYear = currentDate.getFullYear() + Math.floor(Math.random() * 5) + 1;
  const expiryMonth = Math.floor(Math.random() * 12) + 1;
  const expiry = `${expiryMonth.toString().padStart(2, '0')}/${expiryYear.toString().slice(-2)}`;
  
  // Generate CVV
  const cvvLength = cardType.name === 'American Express' ? 4 : 3;
  const cvv = Math.floor(Math.random() * Math.pow(10, cvvLength)).toString().padStart(cvvLength, '0');
  
  // Generate cardholder name
  const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Lisa', 'Robert', 'Emily', 'James', 'Maria'];
  const lastNames = ['Smith', 'Johnson', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor', 'Anderson', 'Thomas'];
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const cardholderName = `${firstName} ${lastName}`;
  
  return {
    type: cardType.name,
    number: cardNumber,
    formattedNumber,
    expiry,
    cvv,
    cardholderName,
    color: cardType.color,
    logo: cardType.logo
  };
}

interface TempCreditCardGeneratorProps {
  onCardGenerated?: (cardData: CreditCardData) => void;
}

export default function TempCreditCardGenerator({ onCardGenerated }: TempCreditCardGeneratorProps) {
  const [cardData, setCardData] = useState<CreditCardData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCardNumber, setShowCardNumber] = useState(true);
  const [showCvv, setShowCvv] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    // Add slight delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newCardData = generateTempCreditCard();
    setCardData(newCardData);
    
    if (onCardGenerated) {
      onCardGenerated(newCardData);
    }
    
    toast.success('New temporary credit card generated!');
    setIsGenerating(false);
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  const handleCopyAll = () => {
    if (cardData) {
      const allData = `Card Type: ${cardData.type}
Card Number: ${cardData.formattedNumber}
Expiry: ${cardData.expiry}
CVV: ${cardData.cvv}
Cardholder: ${cardData.cardholderName}`;
      navigator.clipboard.writeText(allData);
      toast.success('All card details copied to clipboard!');
    }
  };

  const maskCardNumber = (number: string) => {
    const parts = number.split(' ');
    return parts.map((part, index) => 
      index === parts.length - 1 ? part : '••••'
    ).join(' ');
  };

  // Generate initial card on mount
  useEffect(() => {
    handleGenerate();
  }, []);

  return (
    <Card className="w-full max-w-md mx-auto bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <CreditCard className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-lg font-semibold">Test Credit Card</span>
          </div>
          {cardData && (
            <Badge variant="secondary" className="ml-2">
              <Shield className="w-3 h-3 mr-1" />
              {cardData.type}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Credit Card Visual */}
        {cardData && (
          <div className={`${cardData.color} rounded-xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform duration-300`}>
            <div className="flex justify-between items-start mb-8">
              <div className="text-2xl">{cardData.logo}</div>
              <div className="text-right">
                <div className="text-xs opacity-75">VALID THRU</div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span className="text-sm font-mono">{cardData.expiry}</span>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <span className="font-mono text-lg tracking-wider">
                  {showCardNumber ? cardData.formattedNumber : maskCardNumber(cardData.formattedNumber)}
                </span>
                <Button
                  onClick={() => setShowCardNumber(!showCardNumber)}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 p-1"
                >
                  {showCardNumber ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            
            <div className="flex justify-between items-end">
              <div>
                <div className="text-xs opacity-75 mb-1">CARDHOLDER NAME</div>
                <div className="flex items-center space-x-2">
                  <User className="w-3 h-3" />
                  <span className="text-sm font-medium">{cardData.cardholderName}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs opacity-75 mb-1">CVV</div>
                <div className="flex items-center space-x-1">
                  <span className="font-mono text-sm">
                    {showCvv ? cardData.cvv : '•'.repeat(cardData.cvv.length)}
                  </span>
                  <Button
                    onClick={() => setShowCvv(!showCvv)}
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20 p-1"
                  >
                    {showCvv ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Card Details */}
        {cardData && (
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="text-xs text-gray-500">Card Number</div>
                <div className="font-mono text-sm">
                  {showCardNumber ? cardData.formattedNumber : maskCardNumber(cardData.formattedNumber)}
                </div>
              </div>
              <Button
                onClick={() => handleCopy(cardData.number, 'Card number')}
                variant="ghost"
                size="sm"
                className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="text-xs text-gray-500">Expiry</div>
                  <div className="font-mono text-sm">{cardData.expiry}</div>
                </div>
                <Button
                  onClick={() => handleCopy(cardData.expiry, 'Expiry date')}
                  variant="ghost"
                  size="sm"
                  className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="text-xs text-gray-500">CVV</div>
                  <div className="font-mono text-sm">
                    {showCvv ? cardData.cvv : '•'.repeat(cardData.cvv.length)}
                  </div>
                </div>
                <Button
                  onClick={() => handleCopy(cardData.cvv, 'CVV')}
                  variant="ghost"
                  size="sm"
                  className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="text-xs text-gray-500">Cardholder Name</div>
                <div className="text-sm">{cardData.cardholderName}</div>
              </div>
              <Button
                onClick={() => handleCopy(cardData.cardholderName, 'Cardholder name')}
                variant="ghost"
                size="sm"
                className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Generate New Card
              </>
            )}
          </Button>

          {cardData && (
            <Button
              onClick={handleCopyAll}
              variant="outline"
              className="w-full border-purple-200 text-purple-600 hover:bg-purple-50"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy All Details
            </Button>
          )}
        </div>

        {/* Disclaimer */}
        <div className="text-xs text-gray-500 text-center bg-yellow-50 rounded p-2 border border-yellow-200">
          ⚠️ This is a test credit card for development purposes only. 
          Numbers are generated using the Luhn algorithm but are not real accounts.
        </div>
      </CardContent>
    </Card>
  );
}