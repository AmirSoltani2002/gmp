import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
    @ApiProperty({
        description: 'JWT access token for subsequent API calls',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJqb2huX2RvZSIsImZpcnN0TmFtZSI6IkpvaG4iLCJsYXN0TmFtZSI6IkRvZSIsImVtYWlsIjoiam9obi5kb2VAZXhhbXBsZS5jb20iLCJyb2xlIjoiaWZkYVVzZXIiLCJjb21wYW55SWQiOjEsImlhdCI6MTY5ODY3MjAwMCwiZXhwIjoxNjk4NzU4NDAwfQ.signature_here',
    })
    token: string;
}

export class TokenInfoDto {
    @ApiProperty({
        description: 'Username from the token',
        example: 'john_doe',
    })
    username: string;
}

export class AuthErrorDto {
    @ApiProperty({
        description: 'Error message describing what went wrong',
        examples: {
            'invalid_credentials': {
                value: 'Wrong Username or Password',
                description: 'When credentials are incorrect'
            },
            'user_not_found': {
                value: 'User not found',
                description: 'When username does not exist'
            },
            'validation_error': {
                value: ['username should not be empty', 'password should not be empty'],
                description: 'When input validation fails'
            }
        }
    })
    message: string | string[];

    @ApiProperty({
        description: 'HTTP status code',
        enum: [400, 401, 404, 422, 429],
        example: 400,
    })
    statusCode: number;

    @ApiProperty({
        description: 'Error type description',
        examples: {
            400: 'Bad Request',
            401: 'Unauthorized',
            404: 'Not Found',
            422: 'Unprocessable Entity',
            429: 'Too Many Requests'
        },
        example: 'Bad Request',
    })
    error: string;
}