import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signUpWithUsername(createAuthDto: CreateAuthDto): Promise<{
        token: string;
    }>;
}
