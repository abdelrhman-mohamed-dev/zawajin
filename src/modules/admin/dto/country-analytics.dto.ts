import { ApiProperty } from '@nestjs/swagger';

export class CityData {
  @ApiProperty({ example: 'Cairo' })
  name: string;

  @ApiProperty({ example: '15,000 User' })
  users: string;
}

export class CountryData {
  @ApiProperty({ example: 'Egypt' })
  name: string;

  @ApiProperty({ example: '27,360 User' })
  users: string;

  @ApiProperty({ example: [30.8025, 26.8206], description: '[longitude, latitude]' })
  coordinates: [number, number];

  @ApiProperty({ example: '#EF4444' })
  color: string;

  @ApiProperty({ example: '🇪🇬' })
  flag: string;

  @ApiProperty({ type: [CityData] })
  cities: CityData[];
}

export class VisitorsByCountryData {
  @ApiProperty({ type: [CountryData] })
  countries: CountryData[];
}

export class VisitorsByCountryResponse {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ type: VisitorsByCountryData })
  data: VisitorsByCountryData;
}

export class CountryStats {
  @ApiProperty({ example: 1 })
  rank: number;

  @ApiProperty({ example: 'Saudi Arabia' })
  country: string;

  @ApiProperty({ example: '🇸🇦' })
  flag: string;

  @ApiProperty({ example: 15240 })
  users: number;

  @ApiProperty({ example: 35.8, description: 'Share of total users in percentage' })
  percentage: number;

  @ApiProperty({ example: 12.5, description: 'Growth percentage, can be negative' })
  growth: number;

  @ApiProperty({ example: 48500, description: 'Revenue in dollars' })
  revenue: number;
}

export class TopCountriesData {
  @ApiProperty({ type: [CountryStats] })
  countries: CountryStats[];

  @ApiProperty({ example: 42500 })
  totalUsers: number;

  @ApiProperty({ example: 128750.50 })
  totalRevenue: number;
}

export class TopCountriesResponse {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ type: TopCountriesData })
  data: TopCountriesData;
}
