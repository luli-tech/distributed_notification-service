import { IsNotEmpty, IsString, IsOptional, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendPushDto {
  @ApiProperty({
    example: 'user123',
    description: 'The ID of the recipient user',
  })
  @IsString()
  @IsNotEmpty()
  recipient_user_id: string;

  @ApiProperty({
    example: 'New Message!',
    description: 'The title of the push notification',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'You have a new message from John Doe.',
    description: 'The body of the push notification',
  })
  @IsString()
  @IsNotEmpty()
  body: string;

  @ApiProperty({
    example: 'https://example.com/image.jpg',
    description: 'Optional image URL for rich notifications',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  image?: string;

  @ApiProperty({
    example: 'https://example.com/view-message',
    description: 'Optional link for the push notification',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  link?: string;
}
