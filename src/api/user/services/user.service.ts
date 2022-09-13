import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateUserDto,
  UpdateUserByAdminDto,
  UpdateUserDto,
  UpdateUserToAdminDto,
} from '../models/user.dto';
import { User, UserRole } from '../models/user.entity';
import { getUserNameFromEmail } from '../../../utils/helpers';

@Injectable()
export class UserService {
  @InjectRepository(User)
  private repository: Repository<User>;

  public getAllUser(): Promise<User[]> {
    return this.repository.find({
      where: {
        isDeleted: false,
      },
    });
  }

  public getUser(id: string): Promise<User> {
    return this.repository.findOneBy({ id: id, isDeleted: false });
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

  public async updateUserInfoUsingAdmin(
    body: UpdateUserByAdminDto | UpdateUserToAdminDto,
  ): Promise<User> {
    const updateUser = await this.getUser(body.id);
    for (const [key, value] of Object.entries(body)) {
      if (key !== 'id') {
        updateUser[key] = value;
      }
    }
    await this.repository.save(updateUser);
    return updateUser;
  }

  public async deleteUser(id: string) {
    const updateUser = await this.getUser(id);
    updateUser.isDeleted = true;
    await this.repository.save(updateUser);
    return updateUser;
  }
}
