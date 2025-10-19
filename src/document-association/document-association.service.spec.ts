import { Test, TestingModule } from '@nestjs/testing';
import { DocumentAssociationService } from './document-association.service';
import { DatabaseService } from '../database/database.service';

describe('DocumentAssociationService', () => {
  let service: DocumentAssociationService;
  let prisma: DatabaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentAssociationService,
        {
          provide: DatabaseService,
          useValue: {
            siteDocument: {
              create: jest.fn(),
              findMany: jest.fn(),
              delete: jest.fn(),
              count: jest.fn(),
            },
            lineDocument: {
              create: jest.fn(),
              findMany: jest.fn(),
              delete: jest.fn(),
              count: jest.fn(),
            },
            companyDocument: {
              create: jest.fn(),
              findMany: jest.fn(),
              delete: jest.fn(),
              count: jest.fn(),
            },
            request126Document: {
              create: jest.fn(),
              findMany: jest.fn(),
              delete: jest.fn(),
              count: jest.fn(),
            },
            $transaction: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<DocumentAssociationService>(DocumentAssociationService);
    prisma = module.get<DatabaseService>(DatabaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create site association', async () => {
    const mockAssociation = { id: 1, siteId: 1, documentId: 1 };
    prisma.siteDocument.create = jest.fn().mockResolvedValue(mockAssociation);

    const result = await service.createAssociation('site', {
      entityId: 1,
      documentId: 1,
    });

    expect(prisma.siteDocument.create).toHaveBeenCalledWith({
      data: { siteId: 1, documentId: 1 },
      include: { site: true, document: true }
    });
    expect(result).toEqual(mockAssociation);
  });
});