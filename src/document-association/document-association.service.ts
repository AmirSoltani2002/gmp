import { Injectable, ConflictException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateDocumentAssociationDto } from './dto/create-document-association.dto';
import { FindAllDocumentAssociationDto } from './dto/find-all-document-association.dto';
import { AssociationType } from './entities/document-association.entity';
import { DocumentService} from '../document/document.service';
import { ROLES } from '../common/interface';
import { DocumentPermission } from '../document/document.permissions';

@Injectable()
export class DocumentAssociationService {
  constructor(
    private readonly db: DatabaseService,
    private readonly documentService: DocumentService
  ) {}

  // Create association with one-to-one constraint handling
  async createAssociation(type: AssociationType, data: CreateDocumentAssociationDto, userId?: number, userRole?: string) {
    const { documentId, entityId } = data;
    
    try {
      switch (type) {
        case 'site':
          return await this.db.siteDocument.create({
            data: { siteId: entityId, documentId },
            include: { site: true, document: true }
          });
        case 'line':
          return await this.db.lineDocument.create({
            data: { lineId: entityId, documentId },
            include: { line: true, document: true }
          });
        case 'company':
          return await this.db.companyDocument.create({
            data: { companyId: entityId, documentId },
            include: { company: true, document: true }
          });
        case 'request126':
          return await this.db.request126Document.create({
            data: { requestId: entityId, documentId },
            include: { request: true, document: true }
          });
      }
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(`Document ${documentId} is already associated with another ${type}`);
      }
      if (error.code === 'P2003') {
        throw new NotFoundException(`${type} with id ${entityId} or document ${documentId} not found`);
      }
      throw error;
    }
  }

  // Find all associations with pagination
  async findAllAssociations(type: AssociationType, query: FindAllDocumentAssociationDto, person: any) {
    const { page = 1, pageSize = 20, documentId, entityId } = query;
    const skip = (page - 1) * pageSize;
    const companyId = person.companies?.[0]?.company?.id;
    let result: any;
    let where: any = {};
   
    const accessResult = await DocumentPermission.canAccessRestrictedEntity(person, companyId);
    if (!accessResult.canAccess) {
      throw new ForbiddenException(accessResult.message || 'Access denied');
    }
    
    switch (type) {
      case 'site':
        if (entityId) where.siteId = entityId;
        const [siteData, siteTotal] = await Promise.all([
          this.db.siteDocument.findMany({
            where,
            include: { site: true, document: true },
            skip,
            take: pageSize,
            orderBy: { id: 'desc' }
          }),
          this.db.siteDocument.count({ where })
        ]);
        result = {
          data: siteData,
          totalItems: siteTotal,
          totalPages: Math.ceil(siteTotal / pageSize),
          currentPage: page,
          pageSize: pageSize
        };
        break;

      case 'line':
        if (entityId) where.lineId = entityId;
        const [lineData, lineTotal] = await Promise.all([
          this.db.lineDocument.findMany({
            where,
            include: { line: true, document: true },
            skip,
            take: pageSize,
            orderBy: { id: 'desc' }
          }),
          this.db.lineDocument.count({ where })
        ]);
        result = {
          data: lineData,
          totalItems: lineTotal,
          totalPages: Math.ceil(lineTotal / pageSize),
          currentPage: page,
          pageSize
        };
        break;

      case 'company':
        if (entityId) where.companyId = entityId;
        const [companyData, companyTotal] = await Promise.all([
          this.db.companyDocument.findMany({
            where,
            include: { company: true, document: true },
            skip,
            take: pageSize,
            orderBy: { id: 'desc' }
          }),
          this.db.companyDocument.count({ where })
        ]);
        result = {
          data: companyData,
          totalItems: companyTotal,
          totalPages: Math.ceil(companyTotal / pageSize),
          currentPage: page,
          pageSize
        };
        break;

      case 'request126':
        if (entityId) where.requestId = entityId;
        const [requestData, requestTotal] = await Promise.all([
          this.db.request126Document.findMany({
            where,
            include: { request: true, document: true },
            skip,
            take: pageSize,
            orderBy: { id: 'desc' }
          }),
          this.db.request126Document.count({ where })
        ]);
        result = {
          data: requestData,
          totalItems: requestTotal,
          totalPages: Math.ceil(requestTotal / pageSize),
          currentPage: page,
          pageSize
        };
        break;
      default:
        result = {
          data: [],
          totalItems: 0,
          totalPages: 0,
          currentPage: page,
          pageSize
        };
        break;
    }
    if (accessResult.isRestricted) {
      switch (type) {
        case 'site':
          result.data = result.data.map(item => ({
            site: item.site,
            document: {
              title: item.document.title
            }
          }));
          break;
        case 'line':
          result.data = result.data.map(item => ({
            line: item.line,
            document: {
              title: item.document.title
            }
          }));
          break;
        case 'company':
          result.data = result.data.map(item => ({
            company: item.company,
            document: {
              title: item.document.title
            }
          }));
          break;
        case 'request126':
          result.data = result.data.map(item => ({
            request126: item.request126,
            document: {
              title: item.document.title
            }
          }));
          break;
      }
    }
    return result;
  }

  async findOneAssociation(type: AssociationType, id: number, person: any) {
    const accessResult = await DocumentPermission.canAccessRestrictedEntity(person, id);
    if (!accessResult.canAccess) {
      throw new ForbiddenException(accessResult.message || 'Access denied');
    }

    let result: any;

    switch (type) {
      case 'site':
        result = await this.db.siteDocument.findUniqueOrThrow({ 
          where: { id },
          include: { document: true }
        });
        break;
      case 'line':
        result = await this.db.lineDocument.findUniqueOrThrow({ 
          where: { id },
          include: { document: true }
        });
        break;
      case 'company':
        result = await this.db.companyDocument.findUniqueOrThrow({ 
          where: { id },
          include: { document: true }
        });
        break;
      case 'request126':
        result = await this.db.request126Document.findUniqueOrThrow({ 
          where: { id },
          include: { document: true }
        });
        break;
    }

    if (accessResult.isRestricted) {
      result.document = {
        title: result.document.title
      };
    }

    return result;

  }

  // Remove association with error handling
  async removeAssociation(type: AssociationType, id: number, person: any) {
    const document = await this.findOneAssociation(type, id, person);
    if (!document) throw new NotFoundException('Document not found or you dont have access.');
    if (!('fileKey' in document.document)) throw new NotFoundException('Document not found or you dont have access.');
    let where = { documentId: document.document.id }

    try {
      switch (type) {
        case 'site':
          await this.db.siteDocument.delete({ 
            where,
          });
          break;
        case 'line':
          await this.db.lineDocument.delete({ 
            where,
          });
          break;
        case 'company':
          await this.db.companyDocument.delete({ 
            where,
          });
          break;
        case 'request126':
          await this.db.request126Document.delete({ 
            where,
          });
          break;
      }
      
      await this.documentService.remove(document.document.id, person.companies?.[0]?.company?.id, person);

      return { message: 'Association and document removed successfully' };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`${type} association with id ${id} not found`);
      }
      throw error;
    }
  }

  // Get documents for a specific entity
  async getDocumentsForEntity(type: AssociationType, entityId: number, person: any) {
    let where: any = {};
    const accessResult = await DocumentPermission.canAccessRestrictedEntity(person, entityId);
    if (!accessResult.canAccess) {
      throw new ForbiddenException(accessResult.message || 'Access denied');
    }
    let result: any;
    switch (type) {
      case 'site':
        where.siteId = entityId;
        result = await this.db.siteDocument.findMany({
          where,
          include: { document: true }
        });
      case 'line':
        where.lineId = entityId;
        result = await this.db.lineDocument.findMany({
          where,
          include: { document: true }
        });
      case 'company':
        where.companyId = entityId;
        result = await this.db.companyDocument.findMany({
          where,
          include: { document: true }
        });
      case 'request126':
        where.requestId = entityId;
        result = await this.db.request126Document.findMany({
          where,
          include: { document: true }
        });
    }
    if (accessResult.isRestricted) {
      switch (type) {
        case 'site':
          result = result.map(item => ({
            site: item.site,
            document: {
              title: item.document.title
            }
          }));
          break;
        case 'line':
          result = result.map(item => ({
            line: item.line,
            document: {
              title: item.document.title
            }
          }));
          break;
        case 'company':
          result = result.map(item => ({
            company: item.company,
            document: {
              title: item.document.title
            }
          }));
          break;
        case 'request126':
          result = result.map(item => ({
            request126: item.request126,
            document: {
              title: item.document.title
            }
          }));
          break;
      }
    }
    return result;
  }

  // Get entities that have a specific document (one-to-one relationship)
  async getEntityForDocument(type: AssociationType, documentId: number, person: any) {
    const accessResult = await DocumentPermission.canAccessRestrictedEntity(person, documentId);
    if (!accessResult.canAccess) {
      throw new ForbiddenException(accessResult.message || 'Access denied');
    }

    try {
      switch (type) {
        case 'site':
          return await this.db.siteDocument.findUniqueOrThrow({
            where: { documentId },
            include: { site: true }
          });
        case 'line':
          return await this.db.lineDocument.findUniqueOrThrow({
            where: { documentId },
            include: { line: true }
          });
        case 'company':
          return await this.db.companyDocument.findUniqueOrThrow({
            where: { documentId },
            include: { company: true }
          });
        case 'request126':
          return await this.db.request126Document.findUniqueOrThrow({
            where: { documentId },
            include: { request: true }
          });
      }
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`No ${type} association found for document ${documentId}`);
      }
      throw error;
    }
  }

}