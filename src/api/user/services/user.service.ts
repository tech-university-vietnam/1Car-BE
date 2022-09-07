import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from '../models/user.dto';
import { User, UserRole } from '../models/user.entity';
import { getUserNameFromEmail } from '../../../utils/helpers';

@Injectable()
export class UserService {
  @InjectRepository(User)
  private repository: Repository<User>;

  public getAllUser(): Promise<User[]> {
    return this.repository.find();
  }

  public getUser(id: string): Promise<User> {
    return this.repository.findOneBy({ id: id });
  }

  public createUser(body: CreateUserDto): Promise<User> {
    const user: User = new User();
    user.email = body.email;
    user.name = body.name;
    return this.repository.save(user);
  }

  public createAdmin(email: string): Promise<User> {
    const admin: User = new User();
    admin.email = email;
    admin.name = getUserNameFromEmail(email);
    admin.userRole = UserRole.ADMIN;
    return this.repository.save(admin);
  }

  public getUserByEmail(email: string): Promise<User | undefined> {
    return this.repository.findOne({
      where: {
        email: email,
        isDeleted: false,
      },
    });
  }

  public async updateUser(
    body: UpdateUserDto,
    email: string,
  ): Promise<User | undefined> {
    const user: User = await this.getUserByEmail(email);
    if (!user) {
      // If there is no record of this user
      // Create new record and add information
      const newUser = new User();
      newUser.email = email;
      newUser.dateOfBirth = body.dateOfBirth;
      newUser.phoneNumber = body.phoneNumber;
      newUser.name = body.name;
      return this.repository.create(newUser);
    } else {
      user.phoneNumber = body.phoneNumber;
      user.name = body.name;
      user.dateOfBirth = body.dateOfBirth;
      return await this.repository.save(user);
    }
  }
}
