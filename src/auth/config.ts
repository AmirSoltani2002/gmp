import * as bcrypt from 'bcrypt';

export const jwtConstants = {
  secret: 'AGTA%#@FDFE&#*$%JEB!@!',
};

export class PasswordService {
  private static readonly saltRounds = 10; // The higher, the more secure but slower

  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  static async compare(userPassword, inputPassword) {
    return await bcrypt.compare(inputPassword, userPassword)
  }
}
