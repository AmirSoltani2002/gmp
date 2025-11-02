import { applyDecorators } from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth, 
  ApiQuery,
  ApiParam,
  ApiBody,
  ApiSecurity,
  ApiHeader
} from '@nestjs/swagger';
import { ROLES } from '../common/interface';

/**
 * Request126 Swagger Documentation Configuration
 * Provides detailed API documentation for Request126 endpoints
 */
export class Request126SwaggerConfig {
  
  /**
   * Controller-level decorators
   */
  static getControllerDecorators() {
    return applyDecorators(
      ApiTags('request126'),
      ApiBearerAuth('bearer-key'),
      ApiSecurity('bearer-key'),
      ApiHeader({
        name: 'Authorization',
        description: 'Bearer token for authentication',
        required: true,
        example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
      })
    );
  }

  /**
   * GET Many - List requests with filtering and pagination
   */
  static getListDecorators() {
    return applyDecorators(
      ApiOperation({
        summary: '📋 List Request126 entries',
        description: `
          Retrieve a paginated list of Request126 entries with advanced filtering capabilities.
          
          **Default Behavior:**
          - Only returns non-closed requests (closedAt IS NULL)
          - Includes related company, line, and drug information
          - Sorted by creation date (newest first)
          - Paginated (20 items per page by default)
          
          **Permissions:** ${[ROLES.SYSTEM, ROLES.QRP, ROLES.IFDAUSER, ROLES.IFDAMANAGER, ROLES.COMPANYOTHER].join(', ')}
        `,
        operationId: 'getRequest126List'
      }),
      ApiQuery({
        name: 'page',
        required: false,
        type: Number,
        description: 'Page number (starts from 1)',
        example: 1
      }),
      ApiQuery({
        name: 'limit',
        required: false,
        type: Number,
        description: 'Number of items per page (max 100)',
        example: 20
      }),
      ApiQuery({
        name: 'filter',
        required: false,
        type: String,
        description: 'Filter format: field||operator||value. Multiple filters supported.',
        examples: {
          'Company Filter': {
            value: 'companyId||$eq||5',
            description: 'Filter by specific company ID'
          },
          'Type Filter': {
            value: 'type||$cont||safety',
            description: 'Filter by type containing "safety"'
          },
          'Multiple Filters': {
            value: ['companyId||$eq||5', 'type||$cont||assessment'],
            description: 'Multiple filters can be applied'
          }
        }
      }),
      ApiQuery({
        name: 'sort',
        required: false,
        type: String,
        description: 'Sort format: field,direction',
        examples: {
          'Default': { value: 'createdAt,DESC', description: 'Sort by creation date (newest first)' },
          'By Type': { value: 'type,ASC', description: 'Sort by type alphabetically' },
          'By Company': { value: 'companyId,ASC', description: 'Sort by company ID' }
        }
      }),
      ApiQuery({
        name: 'join',
        required: false,
        type: String,
        description: 'Relations to include (already includes company, line, drug by default)',
        example: 'company'
      }),
      ApiResponse({
        status: 200,
        description: '✅ Successfully retrieved request list',
        schema: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'number', example: 1 },
                  type: { type: 'string', example: 'safety-assessment' },
                  companyId: { type: 'number', example: 1 },
                  lineId: { type: 'number', example: 2 },
                  drugId: { type: 'number', example: 3 },
                  drugOEB_declared: { type: 'number', example: 4 },
                  drugOEL_declared: { type: 'number', example: 0.5 },
                  closedAt: { type: 'string', nullable: true, example: null },
                  createdAt: { type: 'string', format: 'date-time' },
                  updatedAt: { type: 'string', format: 'date-time' },
                  company: {
                    type: 'object',
                    properties: {
                      id: { type: 'number' },
                      nameFa: { type: 'string' },
                      nameEn: { type: 'string' }
                    }
                  },
                  line: {
                    type: 'object',
                    properties: {
                      id: { type: 'number' },
                      name: { type: 'string' }
                    }
                  },
                  drug: {
                    type: 'object',
                    properties: {
                      id: { type: 'number' },
                      name: { type: 'string' },
                      atc: { type: 'string' }
                    }
                  }
                }
              }
            },
            count: { type: 'number', example: 1 },
            total: { type: 'number', example: 25 },
            page: { type: 'number', example: 1 },
            pageCount: { type: 'number', example: 2 }
          }
        }
      }),
      ApiResponse({ status: 401, description: '🔑 Unauthorized - Missing or invalid token' }),
      ApiResponse({ status: 403, description: '⛔ Forbidden - Insufficient permissions' })
    );
  }

  /**
   * GET One - Get single request by ID
   */
  static getOneDecorators() {
    return applyDecorators(
      ApiOperation({
        summary: '🔍 Get Request126 by ID',
        description: `
          Retrieve a specific Request126 entry by its ID.
          
          **Includes:** Company, line, and drug information
          
          **Permissions:** ${[ROLES.SYSTEM, ROLES.QRP, ROLES.IFDAUSER, ROLES.IFDAMANAGER, ROLES.COMPANYOTHER].join(', ')}
        `,
        operationId: 'getRequest126ById'
      }),
      ApiParam({
        name: 'id',
        type: Number,
        description: 'Request126 ID',
        example: 1
      }),
      ApiResponse({
        status: 200,
        description: '✅ Successfully retrieved request',
      }),
      ApiResponse({ status: 401, description: '🔑 Unauthorized' }),
      ApiResponse({ status: 403, description: '⛔ Forbidden' }),
      ApiResponse({ status: 404, description: '🔍 Request not found' })
    );
  }

  /**
   * POST - Create new request
   */
  static getCreateDecorators() {
    return applyDecorators(
      ApiOperation({
        summary: '🎉 Create new Request126',
        description: `
          Create a new Request126 entry.
          
          **Required fields:** type, companyId, lineId, drugId
          
          **Optional fields:** drugOEB_declared, drugOEL_declared, closedAt
          
          **Permissions:** ${[ROLES.SYSTEM, ROLES.IFDAMANAGER, ROLES.QRP].join(', ')}
        `,
        operationId: 'createRequest126'
      }),
      ApiBody({
        description: 'Request126 data',
        schema: {
          type: 'object',
          required: ['type', 'companyId', 'lineId', 'drugId'],
          properties: {
            type: {
              type: 'string',
              description: 'Type of request',
              example: 'safety-assessment',
              minLength: 1
            },
            companyId: {
              type: 'number',
              description: 'ID of the company',
              example: 1,
              minimum: 1
            },
            lineId: {
              type: 'number',
              description: 'ID of the production line',
              example: 2,
              minimum: 1
            },
            drugId: {
              type: 'number',
              description: 'ID of the drug',
              example: 3,
              minimum: 1
            },
            drugOEB_declared: {
              type: 'number',
              description: 'Declared OEB value (optional)',
              example: 4,
              minimum: 0,
              nullable: true
            },
            drugOEL_declared: {
              type: 'number',
              description: 'Declared OEL value (optional)',
              example: 0.5,
              minimum: 0,
              nullable: true
            },
            closedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Closure date (optional)',
              nullable: true
            }
          }
        },
        examples: {
          'Safety Assessment': {
            value: {
              type: 'safety-assessment',
              companyId: 1,
              lineId: 2,
              drugId: 3,
              drugOEB_declared: 4,
              drugOEL_declared: 0.5
            }
          },
          'Quality Check': {
            value: {
              type: 'quality-check',
              companyId: 2,
              lineId: 3,
              drugId: 4,
              drugOEB_declared: 3,
              drugOEL_declared: 0.3
            }
          }
        }
      }),
      ApiResponse({
        status: 201,
        description: '🎉 Successfully created request',
      }),
      ApiResponse({ status: 400, description: '❌ Bad Request - Validation failed' }),
      ApiResponse({ status: 401, description: '🔑 Unauthorized' }),
      ApiResponse({ status: 403, description: '⛔ Forbidden - Insufficient permissions' }),
      ApiResponse({ status: 422, description: '📝 Validation Error' })
    );
  }

  /**
   * PATCH - Update request
   */
  static getUpdateDecorators() {
    return applyDecorators(
      ApiOperation({
        summary: '✏️ Update Request126',
        description: `
          Update an existing Request126 entry (partial update).
          
          **Permissions:** ${[ROLES.SYSTEM, ROLES.IFDAMANAGER, ROLES.QRP].join(', ')}
        `,
        operationId: 'updateRequest126'
      }),
      ApiParam({
        name: 'id',
        type: Number,
        description: 'Request126 ID to update',
        example: 1
      }),
      ApiBody({
        description: 'Updated request data (partial)',
        schema: {
          type: 'object',
          properties: {
            type: { type: 'string', example: 'updated-assessment' },
            drugOEB_declared: { type: 'number', example: 5 },
            drugOEL_declared: { type: 'number', example: 0.8 },
            closedAt: { type: 'string', format: 'date-time', nullable: true }
          }
        },
        examples: {
          'Update Type': {
            value: { type: 'updated-safety-assessment' }
          },
          'Update Values': {
            value: { 
              drugOEB_declared: 5,
              drugOEL_declared: 0.8 
            }
          },
          'Close Request': {
            value: { closedAt: '2025-10-19T10:30:00Z' }
          }
        }
      }),
      ApiResponse({ status: 200, description: '✅ Successfully updated request' }),
      ApiResponse({ status: 400, description: '❌ Bad Request - Validation failed' }),
      ApiResponse({ status: 401, description: '🔑 Unauthorized' }),
      ApiResponse({ status: 403, description: '⛔ Forbidden - Insufficient permissions' }),
      ApiResponse({ status: 404, description: '🔍 Request not found' })
    );
  }

  /**
   * DELETE - Remove request
   */
  static getDeleteDecorators() {
    return applyDecorators(
      ApiOperation({
        summary: '🗑️ Delete Request126',
        description: `
          Permanently delete a Request126 entry.
          
          **⚠️ Warning:** This action cannot be undone!
          
          **Permissions:** ${[ROLES.SYSTEM, ROLES.IFDAMANAGER].join(', ')} (Admin only)
        `,
        operationId: 'deleteRequest126'
      }),
      ApiParam({
        name: 'id',
        type: Number,
        description: 'Request126 ID to delete',
        example: 1
      }),
      ApiResponse({ status: 200, description: '✅ Successfully deleted request' }),
      ApiResponse({ status: 401, description: '🔑 Unauthorized' }),
      ApiResponse({ status: 403, description: '⛔ Forbidden - Admin permissions required' }),
      ApiResponse({ status: 404, description: '🔍 Request not found' })
    );
  }

  /**
   * Get all decorators for the entire controller
   */
  static getAllDecorators() {
    return {
      controller: this.getControllerDecorators(),
      list: this.getListDecorators(),
      getOne: this.getOneDecorators(),
      create: this.getCreateDecorators(),
      update: this.getUpdateDecorators(),
      delete: this.getDeleteDecorators()
    };
  }
}