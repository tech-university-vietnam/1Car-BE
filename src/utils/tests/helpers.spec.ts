import { User } from '../../api/user/models/user.entity';
import {
  checkUserHaveEnoughInfo,
  getAuthorizationFromCtx,
  getTokenFromAuthorizationString,
  getUserNameFromEmail,
} from '../helpers';
import { ExecutionContext } from '@nestjs/common';
import { createMock } from '@golevelup/ts-jest';

describe('Function check user have enough info', () => {
  let mockUserInfo: User;
  beforeEach(() => {
    mockUserInfo = new User();
  });
  it('should return true when there is enough info', () => {
    mockUserInfo.name = 'string';
    mockUserInfo.dateOfBirth = new Date().getTime().toString();
    mockUserInfo.phoneNumber = 'string';

    expect(checkUserHaveEnoughInfo(mockUserInfo)).toBe(true);
  });

  it('should return false when there is missing name', () => {
    mockUserInfo.dateOfBirth = new Date().getTime().toString();
    mockUserInfo.phoneNumber = 'string';

    expect(checkUserHaveEnoughInfo(mockUserInfo)).toBe(false);
  });

  it('should return false when there is missing phone number', () => {
    mockUserInfo.dateOfBirth = new Date().getTime().toString();
    mockUserInfo.name = 'string';

    expect(checkUserHaveEnoughInfo(mockUserInfo)).toBe(false);
  });

  it('should return false when there is missing date of birth', () => {
    mockUserInfo.name = 'string';
    mockUserInfo.phoneNumber = 'string';

    expect(checkUserHaveEnoughInfo(mockUserInfo)).toBe(false);
  });

  it('should return null if there is no user', () => {
    expect(checkUserHaveEnoughInfo(null)).toBe(false);
  });
});

describe('Test getting token related to ctx', () => {
  const authorizationString = 'Bearer token';
  const mockExecutionContext = createMock<ExecutionContext>({
    switchToHttp: () => ({
      getRequest: () => ({
        headers: {
          authorization: authorizationString,
        },
      }),
    }),
  });
  it('return authorization string if there is', () => {
    expect(getAuthorizationFromCtx(mockExecutionContext)).toEqual(
      authorizationString,
    );
  });
});

describe('test get token from string', () => {
  const token = 'testJwtToken';
  const authorizationString = `Bearer ${token}`;
  it('return token from correct authorization string', () => {
    expect(getTokenFromAuthorizationString(authorizationString)).toEqual(token);
  });

  it('return null if invalid authorization string', () => {
    expect(getTokenFromAuthorizationString(`invalid ${token}`)).toEqual(null);
  });
});

describe('test helper for getting from email', () => {
  it('return the front part of email if it is email', () => {
    const email = '1car@mail.com';
    expect(getUserNameFromEmail(email)).toBe('1car');
  });
  it('return name if name is inserted', () => {
    const name = '1car';
    expect(getUserNameFromEmail(name)).toBe(name);
  });
});
