export interface CountryInfo {
  coordinates: [number, number]; // [longitude, latitude]
  flag: string;
  region: string;
}

export const COUNTRY_MAPPING: Record<string, CountryInfo> = {
  // Middle East
  'Egypt': { coordinates: [30.8025, 26.8206], flag: '🇪🇬', region: 'middle_east' },
  'Saudi Arabia': { coordinates: [45.0792, 23.8859], flag: '🇸🇦', region: 'middle_east' },
  'UAE': { coordinates: [53.8478, 23.4241], flag: '🇦🇪', region: 'middle_east' },
  'United Arab Emirates': { coordinates: [53.8478, 23.4241], flag: '🇦🇪', region: 'middle_east' },
  'Kuwait': { coordinates: [47.4818, 29.3117], flag: '🇰🇼', region: 'middle_east' },
  'Qatar': { coordinates: [51.1839, 25.3548], flag: '🇶🇦', region: 'middle_east' },
  'Bahrain': { coordinates: [50.5577, 26.0667], flag: '🇧🇭', region: 'middle_east' },
  'Oman': { coordinates: [55.9233, 21.4735], flag: '🇴🇲', region: 'middle_east' },
  'Jordan': { coordinates: [36.2384, 30.5852], flag: '🇯🇴', region: 'middle_east' },
  'Lebanon': { coordinates: [35.8623, 33.8547], flag: '🇱🇧', region: 'middle_east' },
  'Palestine': { coordinates: [35.2332, 31.9522], flag: '🇵🇸', region: 'middle_east' },
  'Iraq': { coordinates: [43.6793, 33.2232], flag: '🇮🇶', region: 'middle_east' },
  'Syria': { coordinates: [38.9968, 34.8021], flag: '🇸🇾', region: 'middle_east' },
  'Yemen': { coordinates: [48.5164, 15.5527], flag: '🇾🇪', region: 'middle_east' },

  // North Africa
  'Libya': { coordinates: [17.2283, 26.3351], flag: '🇱🇾', region: 'africa' },
  'Tunisia': { coordinates: [9.5375, 33.8869], flag: '🇹🇳', region: 'africa' },
  'Algeria': { coordinates: [1.6596, 28.0339], flag: '🇩🇿', region: 'africa' },
  'Morocco': { coordinates: [-7.0926, 31.7917], flag: '🇲🇦', region: 'africa' },
  'Sudan': { coordinates: [30.2176, 12.8628], flag: '🇸🇩', region: 'africa' },
  'Somalia': { coordinates: [46.1996, 5.1521], flag: '🇸🇴', region: 'africa' },
  'Mauritania': { coordinates: [-10.9408, 21.0079], flag: '🇲🇷', region: 'africa' },

  // Europe
  'United Kingdom': { coordinates: [-3.4360, 55.3781], flag: '🇬🇧', region: 'europe' },
  'France': { coordinates: [2.2137, 46.2276], flag: '🇫🇷', region: 'europe' },
  'Germany': { coordinates: [10.4515, 51.1657], flag: '🇩🇪', region: 'europe' },
  'Italy': { coordinates: [12.5674, 41.8719], flag: '🇮🇹', region: 'europe' },
  'Spain': { coordinates: [-3.7492, 40.4637], flag: '🇪🇸', region: 'europe' },
  'Netherlands': { coordinates: [5.2913, 52.1326], flag: '🇳🇱', region: 'europe' },
  'Belgium': { coordinates: [4.4699, 50.5039], flag: '🇧🇪', region: 'europe' },
  'Sweden': { coordinates: [18.6435, 60.1282], flag: '🇸🇪', region: 'europe' },
  'Turkey': { coordinates: [35.2433, 38.9637], flag: '🇹🇷', region: 'europe' },

  // Asia
  'Pakistan': { coordinates: [69.3451, 30.3753], flag: '🇵🇰', region: 'asia' },
  'Bangladesh': { coordinates: [90.3563, 23.6850], flag: '🇧🇩', region: 'asia' },
  'Indonesia': { coordinates: [113.9213, -0.7893], flag: '🇮🇩', region: 'asia' },
  'Malaysia': { coordinates: [101.9758, 4.2105], flag: '🇲🇾', region: 'asia' },
  'India': { coordinates: [78.9629, 20.5937], flag: '🇮🇳', region: 'asia' },

  // Americas
  'United States': { coordinates: [-95.7129, 37.0902], flag: '🇺🇸', region: 'americas' },
  'Canada': { coordinates: [-106.3468, 56.1304], flag: '🇨🇦', region: 'americas' },
  'USA': { coordinates: [-95.7129, 37.0902], flag: '🇺🇸', region: 'americas' },
};

export function getCountryInfo(countryName: string): CountryInfo {
  // Try exact match first
  if (COUNTRY_MAPPING[countryName]) {
    return COUNTRY_MAPPING[countryName];
  }

  // Try case-insensitive match
  const normalizedName = Object.keys(COUNTRY_MAPPING).find(
    key => key.toLowerCase() === countryName.toLowerCase()
  );

  if (normalizedName) {
    return COUNTRY_MAPPING[normalizedName];
  }

  // Return default if not found
  return {
    coordinates: [0, 0],
    flag: '🏳️',
    region: 'other',
  };
}

export function getCountryColor(userCount: number, maxCount: number): string {
  const percentage = (userCount / maxCount) * 100;

  if (percentage >= 60) return '#EF4444';  // Red - high
  if (percentage >= 30) return '#EAB308';  // Yellow/Amber - medium
  if (percentage >= 10) return '#22C55E';  // Green - low
  return '#6366F1';  // Indigo - very low
}

export function formatUserCount(count: number): string {
  return `${count.toLocaleString()} User${count !== 1 ? 's' : ''}`;
}
