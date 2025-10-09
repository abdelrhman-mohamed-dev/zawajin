import { BodyColor, HairColor, HairType, EyeColor, MarriageType } from '../../../common/enums/profile.enums';
declare class LocationDto {
    city: string;
    country: string;
}
export declare class UpdateProfileDto {
    dateOfBirth?: string;
    age?: number;
    location?: LocationDto;
    origin?: string;
    maritalStatus?: string;
    profession?: string;
    weight?: number;
    height?: number;
    bodyColor?: BodyColor;
    hairColor?: HairColor;
    hairType?: HairType;
    eyeColor?: EyeColor;
    houseAvailable?: boolean;
    natureOfWork?: string;
    bio?: string;
    preferredMinWeight?: number;
    preferredMaxWeight?: number;
    preferredMinHeight?: number;
    preferredMaxHeight?: number;
    preferredBodyColors?: BodyColor[];
    preferredHairColors?: HairColor[];
    preferredEyeColors?: EyeColor[];
    partnerPreferencesBio?: string;
    marriageType?: MarriageType;
    acceptPolygamy?: boolean;
    gender?: string;
    religiousPractice?: string;
    sect?: string;
    prayerLevel?: string;
}
export {};
