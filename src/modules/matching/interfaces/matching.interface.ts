export interface IMatchRecommendation {
  userId: string;
  fullName: string;
  age: number;
  gender: string;
  location: {
    city: string;
    country: string;
  };
  origin: string;
  bio: string;
  religiousPractice: string;
  sect: string;
  prayerLevel: string;
  maritalStatus: string;
  profession: string;
  // Physical attributes
  weight: number;
  height: number;
  bodyColor: string;
  hairColor: string;
  hairType: string;
  eyeColor: string;
  // Work and housing
  houseAvailable: boolean;
  natureOfWork: string;
  // Marriage preferences
  marriageType: string;
  acceptPolygamy: boolean;
  compatibilityScore: number;
  scoreBreakdown: {
    ageScore: number;
    locationScore: number;
    religiousScore: number;
    maritalStatusScore: number;
    professionScore: number;
    physicalAttributesScore: number;
    marriageTypeScore: number;
  };
  hasLiked: boolean;
}

export interface IRecommendationsResponse {
  data: IMatchRecommendation[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ICompatibilityScore {
  totalScore: number;
  breakdown: {
    ageScore: number;
    locationScore: number;
    religiousScore: number;
    maritalStatusScore: number;
    professionScore: number;
    physicalAttributesScore: number;
    marriageTypeScore: number;
  };
}
