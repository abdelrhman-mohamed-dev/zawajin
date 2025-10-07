export interface IMatchRecommendation {
  userId: string;
  fullName: string;
  age: number;
  gender: string;
  location: {
    city: string;
    country: string;
  };
  bio: string;
  religiousPractice: string;
  sect: string;
  prayerLevel: string;
  maritalStatus: string;
  profession: string;
  compatibilityScore: number;
  scoreBreakdown: {
    ageScore: number;
    locationScore: number;
    religiousScore: number;
    maritalStatusScore: number;
    professionScore: number;
  };
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
  };
}
