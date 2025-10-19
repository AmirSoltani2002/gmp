import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { Public } from './roles.decorator';
import { AuthSwaggerConfig } from './auth.swagger.config';

@AuthSwaggerConfig.getControllerDecorators()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post()
  signUpWithUsername(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.signUpWithUsername(createAuthDto);
  }
}
