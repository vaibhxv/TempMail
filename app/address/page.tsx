'use client';

import { useState, useEffect } from 'react';
import { MapPin, Copy, RefreshCw, MapIcon, Building } from 'lucide-react';
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

const addressData: { [key: string]: any } = {
  US: {
    streets: ['Main St', 'Oak Ave', 'Elm St', 'Park Rd', 'First Ave', 'Second St', 'Broadway', 'Church St', 'Washington St', 'Lincoln Ave'],
    cities: ['Springfield', 'Madison', 'Georgetown', 'Franklin', 'Clinton', 'Washington', 'Arlington', 'Salem', 'Auburn', 'Riverside'],
    states: ['CA', 'NY', 'TX', 'FL', 'IL', 'PA', 'OH', 'GA', 'NC', 'MI', 'AZ', 'VA', 'WA', 'MA', 'CO'],
    zipFormat: '#####'
  },
  CA: {
    streets: ['Main St', 'King St', 'Queen St', 'Yonge St', 'Bay St', 'Church St', 'Front St', 'College St', 'Dundas St', 'Bloor St'],
    cities: ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa', 'Edmonton', 'Mississauga', 'Winnipeg', 'Quebec City', 'Hamilton'],
    states: ['ON', 'BC', 'QC', 'AB', 'MB', 'SK', 'NS', 'NB', 'NL', 'PE'],
    zipFormat: '### ###'
  },
  GB: {
    streets: ['High St', 'Victoria Rd', 'Station Rd', 'Church Lane', 'Mill Lane', 'Park Ave', 'Queens Rd', 'Kings St', 'London Rd', 'Manor Way'],
    cities: ['London', 'Birmingham', 'Manchester', 'Glasgow', 'Liverpool', 'Leeds', 'Sheffield', 'Edinburgh', 'Bristol', 'Cardiff'],
    states: ['England', 'Scotland', 'Wales', 'Northern Ireland'],
    zipFormat: '## ###'
  },
  DE: {
    streets: ['Hauptstraße', 'Bahnhofstraße', 'Dorfstraße', 'Schulstraße', 'Gartenstraße', 'Berliner Straße', 'Kirchgasse', 'Poststraße'],
    cities: ['Berlin', 'Hamburg', 'München', 'Köln', 'Frankfurt', 'Stuttgart', 'Düsseldorf', 'Dortmund', 'Essen', 'Leipzig'],
    states: ['Bayern', 'Baden-Württemberg', 'Nordrhein-Westfalen', 'Hessen', 'Sachsen', 'Berlin', 'Hamburg', 'Bremen'],
    zipFormat: '#####'
  },
  FR: {
    streets: ['Rue de la Paix', 'Avenue des Champs', 'Rue Victor Hugo', 'Boulevard Saint-Michel', 'Rue de Rivoli', 'Place de la République', 'Rue du Commerce'],
    cities: ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Montpellier', 'Bordeaux', 'Lille'],
    states: ['Île-de-France', 'Provence-Alpes-Côte d\'Azur', 'Auvergne-Rhône-Alpes', 'Occitanie', 'Nouvelle-Aquitaine', 'Grand Est'],
    zipFormat: '#####'
  },
  IN: {
    streets: ['MG Road', 'Gandhi Street', 'Station Road', 'Main Road', 'Market Street', 'Park Street', 'Commercial Street', 'Ring Road'],
    cities: ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow'],
    states: ['Maharashtra', 'Delhi', 'Karnataka', 'Telangana', 'Tamil Nadu', 'West Bengal', 'Gujarat', 'Rajasthan', 'Uttar Pradesh'],
    zipFormat: '######'
  },
  AU: {
    streets: ['Collins St', 'George St', 'Queen St', 'King St', 'Elizabeth St', 'Pitt St', 'Bourke St', 'Flinders St'],
    cities: ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Gold Coast', 'Canberra', 'Newcastle', 'Darwin', 'Hobart'],
    states: ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'],
    zipFormat: '####'
  }
};

function generateTempAddress(countryCode: string = 'US'): string {
  const data = addressData[countryCode] || addressData.US;
  
  const streetNumber = Math.floor(Math.random() * 9999) + 1;
  const street = data.streets[Math.floor(Math.random() * data.streets.length)];
  const city = data.cities[Math.floor(Math.random() * data.cities.length)];
  const state = data.states[Math.floor(Math.random() * data.states.length)];
  
  let zip = data.zipFormat;
  zip = zip.replace(/#/g, () => Math.floor(Math.random() * 10).toString());
  
  return `${streetNumber} ${street}\n${city}, ${state} ${zip}`;
}

interface TempAddressGeneratorProps {
  defaultCountry?: string;
  onAddressGenerated?: (address: string, country: string) => void;
}

export default function TempAddressGenerator({ 
  defaultCountry = 'US', 
  onAddressGenerated 
}: TempAddressGeneratorProps) {
  const [selectedCountry, setSelectedCountry] = useState(defaultCountry);
  const [generatedAddress, setGeneratedAddress] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    // Add slight delay for better UX
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const newAddress = generateTempAddress(selectedCountry);
    setGeneratedAddress(newAddress);
    
    if (onAddressGenerated) {
      onAddressGenerated(newAddress, selectedCountry);
    }
    
    toast.success('New temporary address generated!');
    setIsGenerating(false);
  };

  const handleCopy = () => {
    if (generatedAddress) {
      navigator.clipboard.writeText(generatedAddress);
      toast.success('Address copied to clipboard!');
    }
  };

  const handleCountryChange = (newCountry: string) => {
    setSelectedCountry(newCountry);
    // Auto-generate new address when country changes if one already exists
    if (generatedAddress) {
      const newAddress = generateTempAddress(newCountry);
      setGeneratedAddress(newAddress);
      if (onAddressGenerated) {
        onAddressGenerated(newAddress, newCountry);
      }
    }
  };

  // Generate initial address on mount
  useEffect(() => {
    handleGenerate();
  }, []);

  const selectedCountryInfo = countries.find(c => c.code === selectedCountry);
  const addressLines = generatedAddress.split('\n');

  return (
    <Card className="w-full max-w-md mx-auto bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <MapPin className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-lg font-semibold">Temporary Address</span>
          </div>
          {generatedAddress && (
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

        {/* Generated Address Display */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Generated Address
          </label>
          <div className="bg-gray-50 rounded-lg p-4 min-h-[80px] border-2 border-dashed border-gray-200 relative">
            {generatedAddress ? (
              <div className="flex justify-between items-start">
                <pre className="text-sm font-mono text-gray-800 whitespace-pre-wrap leading-relaxed flex-1">
                  {generatedAddress}
                </pre>
                <Button 
                  onClick={handleCopy} 
                  variant="ghost" 
                  size="sm"
                  className="ml-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 flex-shrink-0"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <Building className="w-8 h-8 opacity-50 mr-2" />
                <span>Click generate to create address</span>
              </div>
            )}
          </div>
        </div>

        {/* Address Breakdown */}
        {generatedAddress && addressLines.length >= 2 && (
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
            <div className="text-sm text-blue-800">
              <div className="font-medium mb-2">Address Components:</div>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-blue-600">Street:</span>
                  <span className="font-mono">{addressLines[0]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-600">City/State/Zip:</span>
                  <span className="font-mono">{addressLines[1]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-600">Country:</span>
                  <span>{selectedCountryInfo?.flag} {selectedCountryInfo?.name}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Generate Button */}
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
              Generate New Address
            </>
          )}
        </Button>

        {/* Disclaimer */}
        <div className="text-xs text-gray-500 text-center bg-yellow-50 rounded p-2 border border-yellow-200">
          ⚠️ This is a randomly generated address for testing purposes only. 
          It may not correspond to a real location.
        </div>
      </CardContent>
    </Card>
  );
}