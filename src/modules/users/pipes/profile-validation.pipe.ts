import {
  PipeTransform,
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { UpdateProfileDto } from '../dto/update-profile.dto';

@Injectable()
export class ProfileValidationPipe implements PipeTransform {
  transform(value: UpdateProfileDto & { gender?: string }): UpdateProfileDto {
    if (!value.gender) {
      // If gender is not provided in the update, we can't validate
      // The gender should come from the authenticated user's existing profile
      return value;
    }

    const gender = value.gender.toLowerCase();

    // Define gender-specific enum values
    const maleMaritalStatuses = ['single', 'divorced', 'widowed', 'married'];
    const femaleMaritalStatuses = [
      'f_single',
      'f_divorced',
      'f_widowed',
      'virgin',
      'widow',
    ];

    const maleHealthStatuses = ['healthy', 'chronically_ill', 'disabled'];
    const femaleHealthStatuses = [
      'f_healthy',
      'f_chronically_ill',
      'f_disabled',
    ];

    const maleReligiosityLevels = ['normal', 'conservative', 'committed'];
    const femaleReligiosityLevels = [
      'f_normal',
      'f_conservative',
      'f_committed',
    ];

    const maleEmploymentTypes = ['unemployed', 'employed', 'self_employed'];
    const femaleEmploymentTypes = [
      'f_unemployed',
      'f_employed',
      'self_employed',
    ];

    const maleBeautyValues = ['acceptable', 'average', 'handsome'];
    const femaleBeautyValues = [
      'f_acceptable',
      'f_average',
      'f_beautiful',
      'f_very_beautiful',
      'beautiful',
      'very_beautiful',
    ];

    // Validation for males
    if (gender === 'male') {
      // Males should NOT have acceptPolygamy field
      if (value.acceptPolygamy !== undefined && value.acceptPolygamy !== null) {
        throw new BadRequestException(
          'Male users cannot have acceptPolygamy field. Use polygamyStatus instead.',
        );
      }

      // Validate marital status for males
      if (
        value.maritalStatus &&
        !maleMaritalStatuses.includes(value.maritalStatus)
      ) {
        throw new BadRequestException(
          `Invalid marital status for male users. Must be one of: ${maleMaritalStatuses.join(', ')}`,
        );
      }

      // Validate health status for males
      if (
        value.healthStatus &&
        !maleHealthStatuses.includes(value.healthStatus)
      ) {
        throw new BadRequestException(
          `Invalid health status for male users. Must be one of: ${maleHealthStatuses.join(', ')}`,
        );
      }

      // Validate religiosity level for males
      if (
        value.religiosityLevel &&
        !maleReligiosityLevels.includes(value.religiosityLevel)
      ) {
        throw new BadRequestException(
          `Invalid religiosity level for male users. Must be one of: ${maleReligiosityLevels.join(', ')}`,
        );
      }

      // Validate employment type for males
      if (
        value.natureOfWork &&
        !maleEmploymentTypes.includes(value.natureOfWork as string)
      ) {
        throw new BadRequestException(
          `Invalid employment type for male users. Must be one of: ${maleEmploymentTypes.join(', ')}`,
        );
      }

      // Validate beauty for males
      if (value.beauty && !maleBeautyValues.includes(value.beauty as string)) {
        throw new BadRequestException(
          `Invalid beauty value for male users. Must be one of: ${maleBeautyValues.join(', ')}`,
        );
      }
    }

    // Validation for females
    if (gender === 'female') {
      // Females should NOT have polygamyStatus field (string enum)
      // They can only have acceptPolygamy (boolean)
      if (
        value.polygamyStatus !== undefined &&
        value.polygamyStatus !== null &&
        typeof value.polygamyStatus === 'string'
      ) {
        throw new BadRequestException(
          'Female users cannot have polygamyStatus field. Use acceptPolygamy (boolean) instead.',
        );
      }

      // Validate marital status for females
      if (
        value.maritalStatus &&
        !femaleMaritalStatuses.includes(value.maritalStatus)
      ) {
        throw new BadRequestException(
          `Invalid marital status for female users. Must be one of: ${femaleMaritalStatuses.join(', ')}`,
        );
      }

      // Validate health status for females
      if (
        value.healthStatus &&
        !femaleHealthStatuses.includes(value.healthStatus)
      ) {
        throw new BadRequestException(
          `Invalid health status for female users. Must be one of: ${femaleHealthStatuses.join(', ')}`,
        );
      }

      // Validate religiosity level for females
      if (
        value.religiosityLevel &&
        !femaleReligiosityLevels.includes(value.religiosityLevel)
      ) {
        throw new BadRequestException(
          `Invalid religiosity level for female users. Must be one of: ${femaleReligiosityLevels.join(', ')}`,
        );
      }

      // Validate employment type for females
      if (
        value.natureOfWork &&
        !femaleEmploymentTypes.includes(value.natureOfWork as string)
      ) {
        throw new BadRequestException(
          `Invalid employment type for female users. Must be one of: ${femaleEmploymentTypes.join(', ')}`,
        );
      }

      // Validate beauty for females
      if (
        value.beauty &&
        !femaleBeautyValues.includes(value.beauty as string)
      ) {
        throw new BadRequestException(
          `Invalid beauty value for female users. Must be one of: ${femaleBeautyValues.join(', ')}`,
        );
      }
    }

    return value;
  }
}
