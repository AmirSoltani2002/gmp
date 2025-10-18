import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { PersonService } from 'src/person/person.service';
import { PasswordService } from './config';

@Injectable()
export class AuthService {
  constructor(private readonly jwt: JwtService, private readonly personService: PersonService){}

  async signUpWithUsername(createAuthDto: CreateAuthDto) {
    const user = await this.personService.findOneByUsername(createAuthDto.username);
    if(! await PasswordService.compare(user.passwordHash, createAuthDto.password))
      throw new BadRequestException('Wrong Username or Password');
    const {passwordHash, ...rest} = user;
    
    console.log('=== AUTH SERVICE DEBUG ===');
    console.log('Original user:', user);
    console.log('User id type:', typeof user.id);
    console.log('Rest object:', rest);
    console.log('Rest id type:', typeof rest.id);
    console.log('==========================');
    
    return {token: await this.jwt.signAsync(rest)};
  }
}
