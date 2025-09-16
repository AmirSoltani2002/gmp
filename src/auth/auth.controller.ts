import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  signUpWithUsername(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.signUpWithUsername(createAuthDto);
  }
}
