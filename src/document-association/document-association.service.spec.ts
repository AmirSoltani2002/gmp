import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
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
              findUniqueOrThrow: jest.fn(),
              delete: jest.fn(),
              count: jest.fn(),
            },
            lineDocument: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUniqueOrThrow: jest.fn(),
              delete: jest.fn(),
              count: jest.fn(),
            },
            companyDocument: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUniqueOrThrow: jest.fn(),
              delete: jest.fn(),
              count: jest.fn(),
            },
            request126Document: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUniqueOrThrow: jest.fn(),
              delete: jest.fn(),
              count: jest.fn(),
            },
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

  describe('createAssociation', () => {
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

    it('should throw ConflictException when document already associated', async () => {
      const error = { code: 'P2002' };
      prisma.siteDocument.create = jest.fn().mockRejectedValue(error);

      await expect(service.createAssociation('site', {
        entityId: 1,
        documentId: 1,
      })).rejects.toThrow(ConflictException);
    });
  });

  describe('getEntitiesForDocument', () => {
    it('should return single entity for document', async () => {
      const mockAssociation = { id: 1, siteId: 1, documentId: 1, site: { id: 1, name: 'Test Site' } };
      prisma.siteDocument.findUniqueOrThrow = jest.fn().mockResolvedValue(mockAssociation);

      const result = await service.getEntitiesForDocument('site', 1);

      expect(prisma.siteDocument.findUniqueOrThrow).toHaveBeenCalledWith({
        where: { documentId: 1 },
        include: { site: true }
      });
      expect(result).toEqual(mockAssociation);
    });

    it('should throw NotFoundException when no association found', async () => {
      const error = { code: 'P2025' };
      prisma.siteDocument.findUniqueOrThrow = jest.fn().mockRejectedValue(error);

      await expect(service.getEntitiesForDocument('site', 1))
        .rejects.toThrow(NotFoundException);
    });
  });

  describe('removeAssociation', () => {
    it('should remove association', async () => {
      const mockResult = { id: 1, siteId: 1, documentId: 1 };
      prisma.siteDocument.delete = jest.fn().mockResolvedValue(mockResult);

      const result = await service.removeAssociation('site', 1);

      expect(prisma.siteDocument.delete).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockResult);
    });

    it('should throw NotFoundException when association not found', async () => {
      const error = { code: 'P2025' };
      prisma.siteDocument.delete = jest.fn().mockRejectedValue(error);

      await expect(service.removeAssociation('site', 1))
        .rejects.toThrow(NotFoundException);
    });
  });
});