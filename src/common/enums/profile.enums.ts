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
  // For men
  TRIBAL = 'tribal',
  NON_TRIBAL = 'non_tribal',
  OTHER = 'other',
  // For women
  F_TRIBAL = 'f_tribal',
  F_NON_TRIBAL = 'f_non_tribal',
  F_OTHER = 'f_other',
}

export enum MaritalStatus {
  // For men
  MARRIED = 'married',
  SINGLE = 'single',
  DIVORCED = 'divorced',
  WIDOWED = 'widowed',
  // For women
  VIRGIN = 'virgin',
  F_DIVORCED = 'f_divorced',
  F_WIDOWED = 'f_widowed',
}

export enum EducationLevel {
  // For men
  SECONDARY = 'secondary',
  DIPLOMA = 'diploma',
  UNIVERSITY = 'university',
  HIGHER_EDUCATION = 'higher_education',
  // For women
  F_SECONDARY = 'f_secondary',
  F_DIPLOMA = 'f_diploma',
  F_UNIVERSITY = 'f_university',
  F_HIGHER_EDUCATION = 'f_higher_education',
}

export enum EmploymentType {
  // For men
  UNEMPLOYED = 'unemployed',
  EMPLOYED = 'employed',
  SELF_EMPLOYED = 'self_employed',
  // For women (with f_ prefix from frontend)
  F_UNEMPLOYED = 'f_unemployed',
  F_EMPLOYED = 'f_employed',
  F_HOUSEWIFE = 'f_housewife',
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
  // For men
  WHITE = 'white',
  BROWN = 'brown',
  BLACK = 'black',
  // For women
  F_WHITE = 'f_white',
  F_BROWN = 'f_brown',
  F_BLACK = 'f_black',
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

export enum HijabStyle {
  HIJAB = 'hijab',
  NIQAB = 'niqab',
  NO_HIJAB = 'no_hijab',
}
