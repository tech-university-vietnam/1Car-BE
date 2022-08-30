import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestUtils } from '../../../utils/testUtils';
import { DataSource } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from '../models/user.dto';
import { User } from '../models/user.entity';
import { UserService } from './user.service';

describe('UserService', () => {
  let moduleRef: TestingModule;
  let userService: UserService;
  let testUtils: TestUtils;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env.test' }),
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.DATABASE_HOST,
          port: Number(process.env.DATABASE_PORT),
          username: process.env.DATABASE_USER,
          password: process.env.DATABASE_PASSWORD,
          database: process.env.DATABASE_NAME,
          autoLoadEntities: true,
          synchronize: true,
          dropSchema: true,
        }),
        TypeOrmModule.forFeature([User]),
      ],
      providers: [UserService],
    }).compile();

    userService = moduleRef.get(UserService);
    testUtils = new TestUtils(moduleRef.get(DataSource));
    try {
      await testUtils.cleanAll(['user']);
    } catch (err) {
    } finally {
      await testUtils.loadAll(['user']);
    }
  });

  afterEach(async () => {
    await moduleRef.close();
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
    const email = 'test@mail.com';
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
});
