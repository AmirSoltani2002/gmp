import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDrugDto {
  @IsString()
  @IsNotEmpty()
  drugIndexName: string;

  @IsString()
  @IsNotEmpty()
  genericName: string;

  @IsString()
  @IsNotEmpty()
  genericCode: string;

  @IsString()
  @IsNotEmpty()
  ATC: string;

}