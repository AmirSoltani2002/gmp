export declare const jwtConstants: {
    secret: string;
};
export declare class PasswordService {
    private static readonly saltRounds;
    static hashPassword(password: string): Promise<string>;
    static compare(userPassword: any, inputPassword: any): Promise<any>;
}
