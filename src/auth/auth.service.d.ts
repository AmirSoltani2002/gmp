import { CreateAuthDto } from './dto/create-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { PersonService } from 'src/person/person.service';
export declare class AuthService {
    private readonly jwt;
    private readonly personService;
    constructor(jwt: JwtService, personService: PersonService);
    signUpWithUsername(createAuthDto: CreateAuthDto): Promise<{
        token: string;
    }>;
}
