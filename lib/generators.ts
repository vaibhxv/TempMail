
// Phone number generators
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

export function generateTempPhone(countryCode: string = 'US'): string {
  const config = phoneFormats[countryCode] || phoneFormats.US;
  let phone = config.format;
  
  phone = phone.replace(/#/g, () => Math.floor(Math.random() * 10).toString());
  
  // Ensure first digit is not 0 for US/CA numbers
  if (countryCode === 'US' || countryCode === 'CA') {
    phone = phone.replace(/^\(0/, '(2');
  }
  
  return `${config.prefix} ${phone}`;
}

// Address generators
const addressData: { [key: string]: any } = {
  US: {
    streets: ['Main St', 'Oak Ave', 'Elm St', 'Park Rd', 'First Ave', 'Second St', 'Broadway', 'Church St'],
    cities: ['Springfield', 'Madison', 'Georgetown', 'Franklin', 'Clinton', 'Washington', 'Arlington', 'Salem'],
    states: ['CA', 'NY', 'TX', 'FL', 'IL', 'PA', 'OH', 'GA', 'NC', 'MI'],
    zipFormat: '#####'
  },
  CA: {
    streets: ['Main St', 'King St', 'Queen St', 'Yonge St', 'Bay St', 'Church St', 'Front St', 'College St'],
    cities: ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa', 'Edmonton', 'Mississauga', 'Winnipeg'],
    states: ['ON', 'BC', 'QC', 'AB', 'MB', 'SK', 'NS', 'NB'],
    zipFormat: '### ###'
  },
  GB: {
    streets: ['High St', 'Victoria Rd', 'Station Rd', 'Church Lane', 'Mill Lane', 'Park Ave', 'Queens Rd', 'Kings St'],
    cities: ['London', 'Birmingham', 'Manchester', 'Glasgow', 'Liverpool', 'Leeds', 'Sheffield', 'Edinburgh'],
    states: ['England', 'Scotland', 'Wales', 'Northern Ireland'],
    zipFormat: '## ###'
  },
  DE: {
    streets: ['Hauptstraße', 'Bahnhofstraße', 'Dorfstraße', 'Schulstraße', 'Gartenstraße', 'Berliner Straße'],
    cities: ['Berlin', 'Hamburg', 'München', 'Köln', 'Frankfurt', 'Stuttgart', 'Düsseldorf', 'Dortmund'],
    states: ['Bayern', 'Baden-Württemberg', 'Nordrhein-Westfalen', 'Hessen', 'Sachsen'],
    zipFormat: '#####'
  },
  FR: {
    streets: ['Rue de la Paix', 'Avenue des Champs', 'Rue Victor Hugo', 'Boulevard Saint-Michel', 'Rue de Rivoli'],
    cities: ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Montpellier'],
    states: ['Île-de-France', 'Provence-Alpes-Côte d\'Azur', 'Auvergne-Rhône-Alpes', 'Occitanie'],
    zipFormat: '#####'
  }
};

export function generateTempAddress(countryCode: string = 'US'): string {
  const data = addressData[countryCode] || addressData.US;
  
  const streetNumber = Math.floor(Math.random() * 9999) + 1;
  const street = data.streets[Math.floor(Math.random() * data.streets.length)];
  const city = data.cities[Math.floor(Math.random() * data.cities.length)];
  const state = data.states[Math.floor(Math.random() * data.states.length)];
  
  let zip = data.zipFormat;
  zip = zip.replace(/#/g, () => Math.floor(Math.random() * 10).toString());
  
  return `${streetNumber} ${street}\n${city}, ${state} ${zip}`;
}

// Credit card generators
const cardTypes = [
  { name: 'Visa', prefix: '4', length: 16 },
  { name: 'Mastercard', prefix: '5', length: 16 },
  { name: 'American Express', prefix: '34', length: 15 },
  { name: 'Discover', prefix: '6', length: 16 }
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

export function generateTempCreditCard(): string {
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
  const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Lisa', 'Robert', 'Emily'];
  const lastNames = ['Smith', 'Johnson', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor'];
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const cardholderName = `${firstName} ${lastName}`;
  
  return `Card Type: ${cardType.name}
Number: ${formattedNumber}
Expiry: ${expiry}
CVV: ${cvv}
Cardholder: ${cardholderName}

⚠️ For testing purposes only`;
}