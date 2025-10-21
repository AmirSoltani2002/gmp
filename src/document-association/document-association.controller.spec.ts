import { Test, TestingModule } from '@nestjs/testing';
import { DocumentAssociationController } from './document-association.controller';
import { DocumentAssociationService } from './document-association.service';

describe('DocumentAssociationController', () => {
  let controller: DocumentAssociationController;
  let service: DocumentAssociationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentAssociationController],
      providers: [
        {
          provide: DocumentAssociationService,
          useValue: {
            createAssociation: jest.fn(),
            findAllAssociations: jest.fn(),
            removeAssociation: jest.fn(),
            getDocumentsForEntity: jest.fn(),
            getEntitiesForDocument: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<DocumentAssociationController>(DocumentAssociationController);
    service = module.get<DocumentAssociationService>(DocumentAssociationService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Site associations', () => {
    it('should create site association', async () => {
      const dto = { documentId: 1, entityId: 1 };
      const mockResult = { id: 1, siteId: 1, documentId: 1 };
      
      jest.spyOn(service, 'createAssociation').mockResolvedValue(mockResult);
      
      const result = await controller.createSiteAssociation(dto);
      
      expect(service.createAssociation).toHaveBeenCalledWith('site', dto);
      expect(result).toEqual(mockResult);
    });

    it('should get site for document', async () => {
      const mockResult = { id: 1, siteId: 1, documentId: 1, site: { id: 1, name: 'Test Site' } };
      
      jest.spyOn(service, 'getEntitiesForDocument').mockResolvedValue(mockResult);
      
      const result = await controller.getSiteEntities(1);
      
      expect(service.getEntitiesForDocument).toHaveBeenCalledWith('site', 1);
      expect(result).toEqual(mockResult);
    });

    it('should remove site association', async () => {
      const mockResult = { id: 1, siteId: 1, documentId: 1 };
      
      jest.spyOn(service, 'removeAssociation').mockResolvedValue(mockResult);
      
      const result = await controller.removeSiteAssociation(1);
      
      expect(service.removeAssociation).toHaveBeenCalledWith('site', 1);
      expect(result).toEqual(mockResult);
    });
  });

  describe('Line associations', () => {
    it('should create line association', async () => {
      const dto = { documentId: 1, entityId: 1 };
      const mockResult = { id: 1, lineId: 1, documentId: 1 };
      
      jest.spyOn(service, 'createAssociation').mockResolvedValue(mockResult);
      
      const result = await controller.createLineAssociation(dto);
      
      expect(service.createAssociation).toHaveBeenCalledWith('line', dto);
      expect(result).toEqual(mockResult);
    });
  });

  describe('Company associations', () => {
    it('should create company association', async () => {
      const dto = { documentId: 1, entityId: 1 };
      const mockResult = { id: 1, companyId: 1, documentId: 1 };
      
      jest.spyOn(service, 'createAssociation').mockResolvedValue(mockResult);
      
      const result = await controller.createCompanyAssociation(dto);
      
      expect(service.createAssociation).toHaveBeenCalledWith('company', dto);
      expect(result).toEqual(mockResult);
    });
  });

  describe('Request126 associations', () => {
    it('should create request126 association', async () => {
      const dto = { documentId: 1, entityId: 1 };
      const mockResult = { id: 1, requestId: 1, documentId: 1 };
      
      jest.spyOn(service, 'createAssociation').mockResolvedValue(mockResult);
      
      const result = await controller.createRequest126Association(dto);
      
      expect(service.createAssociation).toHaveBeenCalledWith('request126', dto);
      expect(result).toEqual(mockResult);
    });
  });
});