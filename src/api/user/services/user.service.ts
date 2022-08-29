import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from '../models/user.dto';
import { User } from '../models/user.entity';

@Injectable()
export class UserService {
  @InjectRepository(User)
  private repository: Repository<User>;

  public getUser(id: string): Promise<User> {
    return this.repository.findOneBy({ id: id });
  }

  public createUser(body: CreateUserDto): Promise<User> {
    const user: User = new User();
    user.email = body.email;
    user.name = body.name;
    return this.repository.save(user);
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
    const user = this.getUserByEmail(email);
    if (!user) {
      // If there is no record of this user
      // Create new record and add information
      const newUser = new User();
      newUser.email = email;
      return await this.repository.save(newUser);
    } else {
      const newUser = { ...user, ...body };
      return await this.repository.save(newUser);
    }
  }

  public async isUserFirstTime(email: string): Promise<boolean> {
    const user = await this.getUserByEmail(email);
    if (!user) {
      return true;
    } else {
      return false;
    }
  }
}
