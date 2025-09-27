import { IsNumber } from "class-validator";

export class CreateLineDosageDto {
    @IsNumber()
    dosageId: number;

    @IsNumber()
    lineId: number;
}
