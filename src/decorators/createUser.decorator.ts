import { SetMetadata } from '@nestjs/common';

// This decorator allow user with token to bypass check have enough information or not
export const IS_CREATE_USER_KEY = 'isCreateUSer';
export const CreateUser = () => SetMetadata(IS_CREATE_USER_KEY, true);
