export enum BodyColor {
  VERY_FAIR = 'very_fair',
  FAIR = 'fair',
  MEDIUM = 'medium',
  OLIVE = 'olive',
  BROWN = 'brown',
  DARK_BROWN = 'dark_brown',
}

export enum HairColor {
  BLACK = 'black',
  DARK_BROWN = 'dark_brown',
  BROWN = 'brown',
  LIGHT_BROWN = 'light_brown',
  BLONDE = 'blonde',
  RED = 'red',
  GRAY = 'gray',
  WHITE = 'white',
}

export enum HairType {
  STRAIGHT = 'straight',
  WAVY = 'wavy',
  CURLY = 'curly',
  COILY = 'coily',
  BALD = 'bald',
}

export enum EyeColor {
  BROWN = 'brown',
  DARK_BROWN = 'dark_brown',
  HAZEL = 'hazel',
  GREEN = 'green',
  BLUE = 'blue',
  GRAY = 'gray',
  AMBER = 'amber',
  BLACK = 'black',
}

export enum MarriageType {
  TRADITIONAL = 'traditional',
  MESYAR = 'mesyar',
  CIVIL = 'civil',
  RELIGIOUS = 'religious',
  BOTH = 'both',
}

export enum Tribe {
  TRIBAL = 'tribal',
  NON_TRIBAL = 'non_tribal',
  OTHER = 'other',
}

export enum MaritalStatus {
  // For men
  SINGLE = 'single',
  DIVORCED = 'divorced',
  WIDOWED = 'widowed',
  MARRIED = 'married',
  // For women (with f_ prefix from frontend)
  F_SINGLE = 'f_single',
  F_DIVORCED = 'f_divorced',
  F_WIDOWED = 'f_widowed',
  // Alternative naming (without prefix)
  VIRGIN = 'virgin',
  WIDOW = 'widow',
}

export enum EducationLevel {
  SECONDARY = 'secondary',
  DIPLOMA = 'diploma',
  UNIVERSITY = 'university',
  HIGHER_EDUCATION = 'higher_education',
}

export enum EmploymentType {
  // For men
  UNEMPLOYED = 'unemployed',
  EMPLOYED = 'employed',
  SELF_EMPLOYED = 'self_employed',
  // For women (with f_ prefix from frontend)
  F_UNEMPLOYED = 'f_unemployed',
  F_EMPLOYED = 'f_employed',
  // Note: self_employed is used for both genders
}

export enum FinancialStatus {
  EXCELLENT = 'excellent',
  GOOD = 'good',
  AVERAGE = 'average',
}

export enum HealthStatus {
  // For men
  HEALTHY = 'healthy',
  CHRONICALLY_ILL = 'chronically_ill',
  DISABLED = 'disabled',
  // For women (with f_ prefix from frontend)
  F_HEALTHY = 'f_healthy',
  F_CHRONICALLY_ILL = 'f_chronically_ill',
  F_DISABLED = 'f_disabled',
}

export enum ReligiosityLevel {
  // For men
  NORMAL = 'normal',
  CONSERVATIVE = 'conservative',
  COMMITTED = 'committed',
  // For women (with f_ prefix from frontend)
  F_NORMAL = 'f_normal',
  F_CONSERVATIVE = 'f_conservative',
  F_COMMITTED = 'f_committed',
}

export enum SkinColor {
  WHITE = 'white',
  BROWN = 'brown',
  BLACK = 'black',
}

export enum Beauty {
  // For men
  ACCEPTABLE = 'acceptable',
  AVERAGE = 'average',
  HANDSOME = 'handsome',
  // For women (with f_ prefix from frontend)
  F_ACCEPTABLE = 'f_acceptable',
  F_AVERAGE = 'f_average',
  F_BEAUTIFUL = 'f_beautiful',
  F_VERY_BEAUTIFUL = 'f_very_beautiful',
  // Alternative naming (without prefix)
  BEAUTIFUL = 'beautiful',
  VERY_BEAUTIFUL = 'very_beautiful',
  // Neutral/unified options
  ATTRACTIVE = 'attractive',
  VERY_ATTRACTIVE = 'very_attractive',
}

export enum PolygamyStatus {
  YES = 'yes',
  NO = 'no',
  THINKING = 'thinking',
}
