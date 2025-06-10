'use client';

import { useState, useEffect } from 'react';
import { Phone, Copy, RefreshCw, MapIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const countries = [
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷' },
  { code: 'CN', name: 'China', flag: '🇨🇳' },
  { code: 'RU', name: 'Russia', flag: '🇷🇺' }
];

const phoneFormats: { [key: string]: { format: string; prefix: string } } = {
  US: { format: '(###) ###-####', prefix: '+1' },
  CA: { format: '(###) ###-####', prefix: '+1' },
  GB: { format: '#### ### ####', prefix: '+44' },
  DE: { format: '### ### ####', prefix: '+49' },
  FR: { format: '## ## ## ## ##', prefix: '+33' },
  IT: { format: '### ### ####', prefix: '+39' },
  ES: { format: '### ### ###', prefix: '+34' },
  AU: { format: '#### ### ###', prefix: '+61' },
  IN: { format: '##### #####', prefix: '+91' },
  BR: { format: '(##) #####-####', prefix: '+55' },
  MX: { format: '### ### ####', prefix: '+52' },
  JP: { format: '###-####-####', prefix: '+81' },
  KR: { format: '###-####-####', prefix: '+82' },
  CN: { format: '### #### ####', prefix: '+86' },
  RU: { format: '### ###-##-##', prefix: '+7' }
};

function generateTempPhone(countryCode: string = 'US'): string {
  const config = phoneFormats[countryCode] || phoneFormats.US;
  let phone = config.format;
  
  phone = phone.replace(/#/g, () => Math.floor(Math.random() * 10).toString());
  
  // Ensure first digit is not 0 for US/CA numbers
  if (countryCode === 'US' || countryCode === 'CA') {
    phone = phone.replace(/^\(0/, '(2');
  }
  
  return `${config.prefix} ${phone}`;
}

interface TempPhoneGeneratorProps {
  defaultCountry?: string;
  onPhoneGenerated?: (phone: string, country: string) => void;
}

export default function TempPhoneGenerator({ 
  defaultCountry = 'US', 
  onPhoneGenerated 
}: TempPhoneGeneratorProps) {
  const [selectedCountry, setSelectedCountry] = useState(defaultCountry);
  const [generatedPhone, setGeneratedPhone] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    // Add slight delay for better UX
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const newPhone = generateTempPhone(selectedCountry);
    setGeneratedPhone(newPhone);
    
    if (onPhoneGenerated) {
      onPhoneGenerated(newPhone, selectedCountry);
    }
    
    toast.success('New temporary phone number generated!');
    setIsGenerating(false);
  };

  const handleCopy = () => {
    if (generatedPhone) {
      navigator.clipboard.writeText(generatedPhone);
      toast.success('Phone number copied to clipboard!');
    }
  };

  const handleCountryChange = (newCountry: string) => {
    setSelectedCountry(newCountry);
    // Auto-generate new number when country changes if one already exists
    if (generatedPhone) {
      const newPhone = generateTempPhone(newCountry);
      setGeneratedPhone(newPhone);
      if (onPhoneGenerated) {
        onPhoneGenerated(newPhone, newCountry);
      }
    }
  };

  // Generate initial phone number on mount
  useEffect(() => {
    handleGenerate();
  }, []);

  const selectedCountryInfo = countries.find(c => c.code === selectedCountry);

  return (
    <Card className="w-full max-w-md mx-auto bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Phone className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="text-lg font-semibold">Temporary Phone</span>
          </div>
          {generatedPhone && (
            <Badge variant="secondary" className="ml-2">
              <MapIcon className="w-3 h-3 mr-1" />
              {selectedCountryInfo?.flag}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Country Selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Select Country
          </label>
          <Select value={selectedCountry} onValueChange={handleCountryChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country.code} value={country.code}>
                  <div className="flex items-center space-x-2">
                    <span>{country.flag}</span>
                    <span>{country.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Generated Phone Display */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Generated Phone Number
          </label>
          <div className="bg-gray-50 rounded-lg p-4 min-h-[60px] flex items-center justify-between border-2 border-dashed border-gray-200">
            <code className="text-lg font-mono text-gray-800 font-semibold">
              {generatedPhone || 'Click generate to create phone number'}
            </code>
            {generatedPhone && (
              <Button 
                onClick={handleCopy} 
                variant="ghost" 
                size="sm"
                className="ml-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
              >
                <Copy className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Format Info */}
        {selectedCountryInfo && phoneFormats[selectedCountry] && (
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
            <div className="text-sm text-blue-800">
              <div className="font-medium mb-1">Format Information:</div>
              <div className="space-y-1">
                <div>Country: {selectedCountryInfo.flag} {selectedCountryInfo.name}</div>
                <div>Prefix: {phoneFormats[selectedCountry].prefix}</div>
                <div>Format: {phoneFormats[selectedCountry].format}</div>
              </div>
            </div>
          </div>
        )}

        {/* Generate Button */}
        <Button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4 mr-2" />
              Generate New Number
            </>
          )}
        </Button>

        {/* Disclaimer */}
        <div className="text-xs text-gray-500 text-center bg-yellow-50 rounded p-2 border border-yellow-200">
          ⚠️ This is a randomly generated number for testing purposes only. 
          It may not be a valid working phone number.
        </div>
      </CardContent>
    </Card>
  );
}