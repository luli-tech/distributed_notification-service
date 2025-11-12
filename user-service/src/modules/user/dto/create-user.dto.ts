export class CreateUserDto {
  email: string;
  name: string;
  password: string;
  pushToken?: string;
  preferences: {
    email:boolean;
    push:boolean;
  }
}