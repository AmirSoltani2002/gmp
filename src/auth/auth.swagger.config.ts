import { applyDecorators } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiOkResponse,
  ApiProperty,
  ApiExtraModels,
  getSchemaPath
} from '@nestjs/swagger';

// Response DTOs for Swagger documentation
export class AuthResponseDto {
  @ApiProperty({
    description: 'JWT access token for authentication',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  token: string;
}

export class AuthUserInfoDto {

  @ApiProperty({
    description: 'Username',
    example: 'john_doe',
  })
  username: string;
}

export class ErrorResponseDto {
  @ApiProperty({
    description: 'Error message',
    example: 'Wrong Username or Password',
  })
  message: string;

  @ApiProperty({
    description: 'HTTP status code',
    example: 400,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Error type',
    example: 'Bad Request',
  })
  error: string;
}

export class AuthSwaggerConfig {
  
  static getControllerDecorators() {
    return applyDecorators(
      ApiExtraModels(AuthResponseDto, AuthUserInfoDto, ErrorResponseDto)
    );
  }



  static getAllDecorators() {
    return {
      controller: this.getControllerDecorators(),
    };
  }
}