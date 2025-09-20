import { IsNumber, IsOptional, IsString, IsStrongPassword, Length } from "class-validator";

export class CreatePersonDto {
  @IsString()
  username: string;
  @IsString()
  @IsStrongPassword()
  passwordHash: string;
  @IsString()
  name: string;
  @IsString()
  familyName: string;
  @IsNumber()
  currentCompanyId: number;
  @IsString()
  role: string;
  @IsString()
  @Length(11)
  phone: string;
  @IsString()
  @IsOptional()
  nezamCode?: string;
}
