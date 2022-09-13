import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { TestUtils } from '../../../utils/testUtils';
import { DataSource, Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from '../models/user.dto';
import { User, UserRole } from '../models/user.entity';
import { UserService } from './user.service';
import utils from '../../../utils/utils';

describe('UserService', () => {
  let userService: UserService;
  let testUtils: TestUtils;
  let userRepository: Repository<User>;
  beforeEach(async () => {
    const users: User[] = utils.loadJson('user') as User[];
    const user: User = users.find((user) => user.email === 'test@mail.com');
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOneBy: jest.fn(() => Promise.resolve(user)),
            findOne: jest.fn(() => Promise.resolve([user])),
            find: jest.fn(() => Promise.resolve(users)),
            create: jest.fn(() => Promise.resolve(user)),
            save: jest.fn(() => Promise.resolve(user)),
          },
        },
      ],
    }).compile();

    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    userService = module.get(UserService);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('should create a user', async () => {
    const user = await userService.createUser(
      new CreateUserDto('test@mail.com', 'test'),
    );
    expect(await userService.getUser(user.id)).toBeDefined();
  });
  it('should return an array of user', async () => {
    expect(await userService.getAllUser()).toHaveLength(10);
  });
  it('should return user by inputting email', async () => {
    await userService.createUser(new CreateUserDto('test@mail.com', 'test'));
    expect(await userService.getUserByEmail('test@mail.com')).toBeDefined();
  });
  it('should return user by inputting id', async () => {
    await userService.createUser(new CreateUserDto('test@mail.com', 'test'));
    const user = await userService.getUserByEmail('test@mail.com');
    expect(await userService.getUser(user.id)).toBeDefined();
  });

  it('should update exist user', async () => {
    const email = 'test1@mail.com';
    const user = await userService.createUser(new CreateUserDto(email, 'test'));
    const body = new UpdateUserDto(
      'test name',
      new Date().getUTCDate().toString(),
      '0xxxxxx',
    );
    await userService.updateUser(body, email);
    const userInfo = await userService.getUser(user.id);
    expect(userInfo.name).not.toBeNull();
    expect(userInfo.dateOfBirth).not.toBeNull();
    expect(userInfo.phoneNumber).not.toBeNull();
  });

  it('test create admin with email', async () => {
    const mockedAdmin = new User();
    const email = 'admin@email.com';
    mockedAdmin.userRole = UserRole.ADMIN;
    mockedAdmin.email = email;
    jest.spyOn(userRepository, 'save').mockImplementation(() => {
      return Promise.resolve(mockedAdmin);
    });
    const admin: User = await userService.createAdmin(email);
    expect(admin).toBeInstanceOf(User);
    expect(admin.userRole).toBe(UserRole.ADMIN);
  });

  it('test update while no user', async () => {
    const mockedUser = new User();
    mockedUser.name = 'name';
    mockedUser.dateOfBirth = '1990-01-01';
    mockedUser.phoneNumber = '32902xxxx';
    jest.spyOn(userService, 'getUserByEmail').mockImplementation(() => {
      return Promise.resolve(null);
    });
    jest.spyOn(userRepository, 'create').mockImplementation(() => {
      return mockedUser;
    });
    const user = await userService.updateUser(
      expect.anything(),
      expect.anything(),
    );
    expect(user).toBeInstanceOf(User);
    expect(user.dateOfBirth).toBeDefined();
    expect(user.phoneNumber).toBeDefined();
    expect(user.name).toBe('name');
  });
});
