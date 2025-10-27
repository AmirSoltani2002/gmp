import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Query,
  Request,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MedicalReportService } from './medical-report.service';
import { CreateMedicalReportDto } from './dto/create-medical-report.dto';
import { UpdateMedicalReportDto } from './dto/update-medical-report.dto';
import { FindAllMedicalReportDto } from './dto/find-all-medical-report.dto';
import { MethodPermissions, Public } from '../auth/roles.decorator';
import { ROLES } from '../common/interface';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ApiConsumes, ApiBody } from '@nestjs/swagger';

@MethodPermissions({
  GET: [ROLES.SYSTEM],
  PATCH: [ROLES.SYSTEM],
  DELETE: [ROLES.SYSTEM],
})
@ApiTags('medical-report')
@ApiBearerAuth('bearer-key')
@Controller('medical-report')
export class MedicalReportController {
  constructor(private readonly service: MedicalReportService) {}

  @Public()
  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        drugBrandName: { type: 'string' },
        companyName: { type: 'string' },
        batchNumber: { type: 'string' },
        description: { type: 'string' },
        phoneNumber: { type: 'string' },
        email: { type: 'string', format: 'email' },
        ip: {type: 'string', format: 'ip'},
        userAgent: {type: 'string'},
        patientName: { type: 'string' },
        patientAge: { type: 'integer', format: 'int32' },
        patientGender: { type: 'string', enum: ['male', 'female'] },
        drugGenericName: { type: 'string' },
        dosageForm: { type: 'string' },
        dosageStrength: { type: 'string' },
        gtin: { type: 'string' },
        uid: { type: 'string' },
        productionDate: { type: 'string', format: 'date-time' },
        expirationDate: { type: 'string', format: 'date-time' },
        consumptionDate: { type: 'string', format: 'date-time' },
        purchaseLocation: { type: 'string' },
        storageDescription: { type: 'string' },
        defectTypes: { type: 'string' },
        defectDetails: { type: 'string' },
        metadata: { type: 'string' },
      },
      required: ['drugBrandName', 'companyName', 'batchNumber', 'description'],
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async create(@UploadedFile() file: Express.Multer.File, @Body() dto: CreateMedicalReportDto, @Request() req) {
    const userId = req?.user?.id;
    return this.service.create(file, dto, userId);
  }

  @Get()
  async findAll(@Query() query: FindAllMedicalReportDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Get(':id/download')
  async getDownloadUrl(@Param('id') id: string) {
    return this.service.getDownloadUrl(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateMedicalReportDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
