import { SetMetadata } from '@nestjs/common';

// We use @AdminEndpoint() decorator for endpoint that is needed admin privileges

export const IS_ADMIN_ENDPOINT_KEY = 'isAdmin';
export const AdminEndpoint = () => SetMetadata(IS_ADMIN_ENDPOINT_KEY, true);
