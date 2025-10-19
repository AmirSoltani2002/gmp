import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateDocumentAssociationDto } from './dto/create-document-association.dto';
import { FindAllDocumentAssociationDto } from './dto/find-all-document-association.dto';
import { AssociationType } from './entities/document-association.entity';

@Injectable()
export class DocumentAssociationService {
  constructor(private readonly db: DatabaseService) {}

  // Generic method to create association for any type
  async createAssociation(type: AssociationType, data: CreateDocumentAssociationDto) {
    const { documentId, entityId } = data;
    
    switch (type) {
      case 'site':
        return this.db.siteDocument.create({
          data: { siteId: entityId, documentId },
          include: { site: true, document: true }
        });
      case 'line':
        return this.db.lineDocument.create({
          data: { lineId: entityId, documentId },
          include: { line: true, document: true }
        });
      case 'company':
        return this.db.companyDocument.create({
          data: { companyId: entityId, documentId },
          include: { company: true, document: true }
        });
      case 'request126':
        return this.db.request126Document.create({
          data: { requestId: entityId, documentId },
          include: { request: true, document: true }
        });
    }
  }

  // Generic method to find all associations for any type
  async findAllAssociations(type: AssociationType, query: FindAllDocumentAssociationDto) {
    const { page = 1, pageSize = 20, documentId, entityId } = query;
    const skip = (page - 1) * pageSize;

    let where: any = {};
    if (documentId) where.documentId = documentId;

    let data: any[];
    let totalItems: number;

    switch (type) {
      case 'site':
        if (entityId) where.siteId = entityId;
        [data, totalItems] = await Promise.all([
          this.db.siteDocument.findMany({
            where,
            include: { site: true, document: true },
            skip,
            take: pageSize,
            orderBy: { id: 'desc' }
          }),
          this.db.siteDocument.count({ where })
        ]);
        break;
      case 'line':
        if (entityId) where.lineId = entityId;
        [data, totalItems] = await Promise.all([
          this.db.lineDocument.findMany({
            where,
            include: { line: true, document: true },
            skip,
            take: pageSize,
            orderBy: { id: 'desc' }
          }),
          this.db.lineDocument.count({ where })
        ]);
        break;
      case 'company':
        if (entityId) where.companyId = entityId;
        [data, totalItems] = await Promise.all([
          this.db.companyDocument.findMany({
            where,
            include: { company: true, document: true },
            skip,
            take: pageSize,
            orderBy: { id: 'desc' }
          }),
          this.db.companyDocument.count({ where })
        ]);
        break;
      case 'request126':
        if (entityId) where.requestId = entityId;
        [data, totalItems] = await Promise.all([
          this.db.request126Document.findMany({
            where,
            include: { request: true, document: true },
            skip,
            take: pageSize,
            orderBy: { id: 'desc' }
          }),
          this.db.request126Document.count({ where })
        ]);
        break;
    }

    return {
      data,
      totalItems,
      totalPages: Math.ceil(totalItems / pageSize),
      currentPage: page,
      pageSize
    };
  }

  // Generic method to remove association
  async removeAssociation(type: AssociationType, id: number) {
    switch (type) {
      case 'site':
        return this.db.siteDocument.delete({ where: { id } });
      case 'line':
        return this.db.lineDocument.delete({ where: { id } });
      case 'company':
        return this.db.companyDocument.delete({ where: { id } });
      case 'request126':
        return this.db.request126Document.delete({ where: { id } });
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

  // Get entities that have a specific document
  async getEntitiesForDocument(type: AssociationType, documentId: number) {
    switch (type) {
      case 'site':
        return this.db.siteDocument.findMany({
          where: { documentId },
          include: { site: true }
        });
      case 'line':
        return this.db.lineDocument.findMany({
          where: { documentId },
          include: { line: true }
        });
      case 'company':
        return this.db.companyDocument.findMany({
          where: { documentId },
          include: { company: true }
        });
      case 'request126':
        return this.db.request126Document.findMany({
          where: { documentId },
          include: { request: true }
        });
    }
  }


}