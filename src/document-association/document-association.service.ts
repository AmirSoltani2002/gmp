import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateDocumentAssociationDto } from './dto/create-document-association.dto';
import { FindAllDocumentAssociationDto } from './dto/find-all-document-association.dto';
import { AssociationType } from './entities/document-association.entity';
import { DocumentService} from '../document/document.service';

@Injectable()
export class DocumentAssociationService {
  constructor(
    private readonly db: DatabaseService,
    private readonly documentService: DocumentService
  ) {}

  // Create association with one-to-one constraint handling
  async createAssociation(type: AssociationType, data: CreateDocumentAssociationDto) {
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
      throw error;
    }
  }

  // Find all associations with pagination
  async findAllAssociations(type: AssociationType, query: FindAllDocumentAssociationDto) {
    const { page = 1, pageSize = 20, documentId, entityId } = query;
    const skip = (page - 1) * pageSize;

    let where: any = {};
    if (documentId) where.documentId = documentId;

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
        return {
          data: siteData,
          totalItems: siteTotal,
          totalPages: Math.ceil(siteTotal / pageSize),
          currentPage: page,
          pageSize
        };

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
        return {
          data: lineData,
          totalItems: lineTotal,
          totalPages: Math.ceil(lineTotal / pageSize),
          currentPage: page,
          pageSize
        };

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
        return {
          data: companyData,
          totalItems: companyTotal,
          totalPages: Math.ceil(companyTotal / pageSize),
          currentPage: page,
          pageSize
        };

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
        return {
          data: requestData,
          totalItems: requestTotal,
          totalPages: Math.ceil(requestTotal / pageSize),
          currentPage: page,
          pageSize
        };
    }
  }

  // Remove association with error handling
  async removeAssociation(type: AssociationType, id: number) {
    try {
      let association;
      switch (type) {
        case 'site':
          association = await this.db.siteDocument.findUniqueOrThrow({ where: { id } });
          break;
        case 'line':
          association = await this.db.lineDocument.findUniqueOrThrow({ where: { id } });
          break;
        case 'company':
          association = await this.db.companyDocument.findUniqueOrThrow({ where: { id } });
          break;
        case 'request126':
          association = await this.db.request126Document.findUniqueOrThrow({ where: { id } });
          break;
      }

      const documentId = association.documentId;
      
      switch (type) {
        case 'site':
          await this.db.siteDocument.delete({ where: { id } });
          break;
        case 'line':
          await this.db.lineDocument.delete({ where: { id } });
          break;
        case 'company':
          await this.db.companyDocument.delete({ where: { id } });
          break;
        case 'request126':
          await this.db.request126Document.delete({ where: { id } });
          break;
      }

      await this.documentService.remove(documentId);

      return { message: 'Association and document removed successfully' };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`${type} association with id ${id} not found`);
      }
      throw error;
    }
  }

  // Get documents for a specific entity
  async getDocumentsForEntity(type: AssociationType, entityId: number) {
    switch (type) {
      case 'site':
        return this.db.siteDocument.findMany({
          where: { siteId: entityId },
          include: { document: true }
        });
      case 'line':
        return this.db.lineDocument.findMany({
          where: { lineId: entityId },
          include: { document: true }
        });
      case 'company':
        return this.db.companyDocument.findMany({
          where: { companyId: entityId },
          include: { document: true }
        });
      case 'request126':
        return this.db.request126Document.findMany({
          where: { requestId: entityId },
          include: { document: true }
        });
    }
  }

  // Get entities that have a specific document (one-to-one relationship)
  async getEntityForDocument(type: AssociationType, documentId: number) {
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