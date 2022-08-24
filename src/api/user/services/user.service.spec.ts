import { UserService } from './user.service';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { TestUtils } from '../../../utils/testUtils';
import { UserController } from '../controllers/user.controller';
import { User } from '../models/user.entity';
import { CreateUserDto } from '../models/user.dto';

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
      controllers: [UserController],
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

  describe('getUser', () => {
    it('should return an with corresponding id', async () => {
      expect(
        await userService.getUser('6ca40044-3f91-4805-bbf9-3efb97c7fe3c'),
      ).toHaveProperty('name', 'Kiskadee, great');
    });
    it('handles case with no user found', async () => {
      const result = await userService.getUser(
        '6ca40044-3f91-4805-bbf9-3efb97c7fe3a',
      );
      expect(result).toBeNull();
    });
  });

  describe('createUser', () => {
    it('should return created user', async () => {
      const testUser = new CreateUserDto();
      testUser.name = 'Testy McTest';
      testUser.email = 'test@example.com';
      const result = await userService.createUser(testUser);
      expect(result).toEqual(
        expect.objectContaining({
          name: 'Testy McTest',
          email: 'test@example.com',
        }),
      );
    });
  });
});
