import { SetMetadata } from '@nestjs/common';

// If we use AuthGuard as an app guard
// then we have to define @Public for public endpoint

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
