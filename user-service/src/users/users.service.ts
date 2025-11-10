import { Injectable, NotFoundException } from '@nestjs/common';

export interface User {
  id: string;
  name: string;
  email: string;
  push_token?: string;
  preferences?: {
    email: boolean;
    push: boolean;
  };
  password?: string;
}

@Injectable()
export class UsersService {
  private users: User[] = [];

  create(user: Omit<User, 'id'>): User {
    const newUser: User = { id: (this.users.length + 1).toString(), ...user };
    this.users.push(newUser);
    return newUser;
  }

  findAll(): User[] {
    return this.users;
  }

  findOne(id: string): User {
    const user = this.users.find(u => u.id === id);
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return user;
  }

  update(id: string, updatedData: Partial<User>): User {
    const user = this.findOne(id);
    Object.assign(user, updatedData);
    return user;
  }
}

