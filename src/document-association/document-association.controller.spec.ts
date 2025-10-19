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

  it('should create site association', async () => {
    const dto = { documentId: 1, entityId: 1 };
    const mockResult = { id: 1, siteId: 1, documentId: 1 };
    
    jest.spyOn(service, 'createAssociation').mockResolvedValue(mockResult);
    
    const result = await controller.createSiteAssociation(dto);
    
    expect(service.createAssociation).toHaveBeenCalledWith('site', dto);
    expect(result).toEqual(mockResult);
  });
});