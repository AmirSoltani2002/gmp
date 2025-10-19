import { IsString, MinLength, MaxLength } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateAuthDto {
    @ApiProperty({
        description: 'User\'s unique username for authentication',
        example: 'admin',
        minLength: 1,
        maxLength: 50,
    })
    @IsString({ message: 'Username must be a string' })
    @MinLength(1, { message: 'Username cannot be empty' })
    @MaxLength(50, { message: 'Username cannot be longer than 50 characters' })
    username: string;

    @ApiProperty({
        description: 'User\'s password for authentication',
        example: 'admin123',
        minLength: 1,
        format: 'password',
    })
    @IsString({ message: 'Password must be a string' })
    @MinLength(1, { message: 'Password cannot be empty' })
    password: string;
}
