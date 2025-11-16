import { IsEmail, IsNotEmpty, IsString, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendEmailDto {
  @ApiProperty({
    example: 'test@example.com',
    description: 'The email address of the recipient',
  })
  @IsEmail()
  @IsNotEmpty()
  recipient: string;

  @ApiProperty({ example: 'Welcome!', description: 'The subject of the email' })
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty({
    example: 'welcome_template',
    description: 'The name of the email template to use (snake_case)',
  })
  @IsString()
  @IsNotEmpty()
  template_name: string;

  @ApiProperty({
    example: { name: 'John Doe' },
    description: 'Variables to substitute into the template',
  })
  @IsObject()
  template_variables: Record<string, any>;
}
