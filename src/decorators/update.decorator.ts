import { SetMetadata } from '@nestjs/common';

// This decorator allow user with token to bypass check have enough information or not
export const IS_UPDATE_KEY = 'isUpdate';
export const Update = () => SetMetadata(IS_UPDATE_KEY, true);
