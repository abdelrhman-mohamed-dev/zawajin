import { SetMetadata } from '@nestjs/common';

export const RequiresSubscription = (...features: string[]) =>
  SetMetadata('requiresSubscription', features);
