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
 * Request126History Swagger Documentation Configuration
 * Provides detailed API documentation for Request126History endpoints
 */
export class Request126HistorySwaggerConfig {
  
  /**
   * Controller-level decorators
   */
  static getControllerDecorators() {
    return applyDecorators(
      ApiTags('request126-history'),
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
   * GET Many - List history entries with filtering and pagination
   */
  static getListDecorators() {
    return applyDecorators(
      ApiOperation({
        summary: '📋 List Request126 History Entries',
        description: `
          Retrieve a paginated list of Request126 history entries with advanced filtering capabilities.
          
          **Default Behavior:**
          - Includes related request, actor, and assignee information
          - Sorted by creation date (newest first)
          - Paginated (20 items per page by default)
          
          **Permissions:** ${[ROLES.SYSTEM, ROLES.QRP, ROLES.IFDAUSER, ROLES.IFDAMANAGER, ROLES.COMPANYOTHER].join(', ')}
        `,
        operationId: 'getRequest126HistoryList'
      }),
      ApiQuery({
        name: 'page',
        required: false,
        type: Number,
        description: 'Page number (starts from 1)',
        example: 1
      }),
      ApiQuery({
        name: 'pageSize',
        required: false,
        type: Number,
        description: 'Number of items per page (1-100)',
        example: 20
      }),
      ApiQuery({
        name: 'requestId',
        required: false,
        type: Number,
        description: 'Filter by request ID',
        example: 1
      }),
      ApiQuery({
        name: 'actorId',
        required: false,
        type: Number,
        description: 'Filter by actor (person who performed action)',
        example: 1
      }),
      ApiQuery({
        name: 'action',
        required: false,
        type: String,
        description: 'Filter by action type',
        example: 'assigned'
      }),
      ApiQuery({
        name: 'q',
        required: false,
        type: String,
        description: 'Search across action, status, and message fields',
        example: 'approved'
      }),
      ApiResponse({
        status: 200,
        description: '✅ Successfully retrieved history entries',
        schema: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'number', example: 1 },
                  requestId: { type: 'number', example: 1 },
                  actorId: { type: 'number', example: 1 },
                  action: { type: 'string', example: 'assigned' },
                  fromStatus: { type: 'string', example: 'pending' },
                  toStatus: { type: 'string', example: 'assigned' },
                  toAssigneeId: { type: 'number', example: 2 },
                  message: { type: 'string', example: 'Request assigned to quality team' },
                  endedAt: { type: 'string', nullable: true, example: null },
                  createdAt: { type: 'string', format: 'date-time' },
                  updatedAt: { type: 'string', format: 'date-time' },
                  request: {
                    type: 'object',
                    properties: {
                      id: { type: 'number' },
                      type: { type: 'string' },
                      company: {
                        type: 'object',
                        properties: {
                          id: { type: 'number' },
                          nameFa: { type: 'string' },
                          nameEn: { type: 'string' }
                        }
                      }
                    }
                  },
                  actor: {
                    type: 'object',
                    properties: {
                      id: { type: 'number' },
                      name: { type: 'string' },
                      familyName: { type: 'string' },
                      username: { type: 'string' }
                    }
                  },
                  toAssignee: {
                    type: 'object',
                    properties: {
                      id: { type: 'number' },
                      name: { type: 'string' },
                      familyName: { type: 'string' },
                      username: { type: 'string' }
                    }
                  }
                }
              }
            },
            totalItems: { type: 'number', example: 25 },
            totalPages: { type: 'number', example: 2 },
            currentPage: { type: 'number', example: 1 },
            pageSize: { type: 'number', example: 20 }
          }
        }
      }),
      ApiResponse({ status: 401, description: '🔑 Unauthorized' }),
      ApiResponse({ status: 403, description: '⛔ Forbidden' })
    );
  }

  /**
   * GET One - Get single history entry by ID
   */
  static getOneDecorators() {
    return applyDecorators(
      ApiOperation({
        summary: '🔍 Get Request126 History Entry by ID',
        description: `
          Retrieve a specific Request126 history entry by its ID.
          
          **Includes:** Request details, actor, and assignee information
          
          **Permissions:** ${[ROLES.SYSTEM, ROLES.QRP, ROLES.IFDAUSER, ROLES.IFDAMANAGER, ROLES.COMPANYOTHER].join(', ')}
        `,
        operationId: 'getRequest126HistoryById'
      }),
      ApiParam({
        name: 'id',
        type: Number,
        description: 'Request126History ID',
        example: 1
      }),
      ApiResponse({
        status: 200,
        description: '✅ Successfully retrieved history entry',
      }),
      ApiResponse({ status: 401, description: '🔑 Unauthorized' }),
      ApiResponse({ status: 403, description: '⛔ Forbidden' }),
      ApiResponse({ status: 404, description: '🔍 History entry not found' })
    );
  }

  /**
   * POST - Create new history entry
   */
  static getCreateDecorators() {
    return applyDecorators(
      ApiOperation({
        summary: '🎉 Create new Request126 History Entry',
        description: `
          Create a new Request126 history entry to track status changes and actions.
          
          **Required fields:** requestId, actorId, action, fromStatus, toStatus, toAssigneeId
          
          **Permissions:** ${[ROLES.SYSTEM, ROLES.IFDAMANAGER, ROLES.QRP].join(', ')}
        `,
        operationId: 'createRequest126History'
      }),
      ApiBody({
        description: 'Request126 History data',
        schema: {
          type: 'object',
          required: ['requestId', 'actorId', 'action', 'fromStatus', 'toStatus', 'toAssigneeId'],
          properties: {
            requestId: {
              type: 'number',
              example: 1,
              description: 'ID of the related Request126'
            },
            actorId: {
              type: 'number',
              example: 1,
              description: 'ID of the person performing the action'
            },
            action: {
              type: 'string',
              example: 'assigned',
              description: 'Action performed (e.g., created, assigned, approved, rejected)'
            },
            fromStatus: {
              type: 'string',
              example: 'pending',
              description: 'Status before the action'
            },
            toStatus: {
              type: 'string',
              example: 'assigned',
              description: 'Status after the action'
            },
            toAssigneeId: {
              type: 'number',
              example: 2,
              description: 'ID of the person assigned after the action'
            },
            message: {
              type: 'string',
              example: 'Request assigned to quality team for review',
              description: 'Optional message or comment'
            },
            endedAt: {
              type: 'string',
              format: 'date-time',
              example: '2025-10-19T10:30:00Z',
              description: 'Date when the action was completed (optional)'
            }
          }
        }
      }),
      ApiResponse({
        status: 201,
        description: '✅ History entry created successfully'
      }),
      ApiResponse({ status: 400, description: '❌ Bad Request - Invalid data' }),
      ApiResponse({ status: 401, description: '🔑 Unauthorized' }),
      ApiResponse({ status: 403, description: '⛔ Forbidden - Insufficient permissions' })
    );
  }

  /**
   * PATCH - Update history entry
   */
  static getUpdateDecorators() {
    return applyDecorators(
      ApiOperation({
        summary: '✏️ Update Request126 History Entry',
        description: `
          Update an existing Request126 history entry.
          
          **Note:** History entries should generally not be modified after creation for audit purposes.
          
          **Permissions:** ${[ROLES.SYSTEM, ROLES.IFDAMANAGER, ROLES.QRP].join(', ')}
        `,
        operationId: 'updateRequest126History'
      }),
      ApiParam({
        name: 'id',
        type: Number,
        description: 'Request126History ID to update',
        example: 1
      }),
      ApiResponse({
        status: 200,
        description: '✅ History entry updated successfully'
      }),
      ApiResponse({ status: 400, description: '❌ Bad Request - Invalid data' }),
      ApiResponse({ status: 401, description: '🔑 Unauthorized' }),
      ApiResponse({ status: 403, description: '⛔ Forbidden - Insufficient permissions' }),
      ApiResponse({ status: 404, description: '🔍 History entry not found' })
    );
  }

  /**
   * DELETE - Remove history entry
   */
  static getDeleteDecorators() {
    return applyDecorators(
      ApiOperation({
        summary: '🗑️ Delete Request126 History Entry',
        description: `
          Delete a Request126 history entry.
          
          **Warning:** Deleting history entries should be done with extreme caution as it affects audit trails.
          
          **Permissions:** ${[ROLES.SYSTEM, ROLES.IFDAMANAGER].join(', ')} (Admin only)
        `,
        operationId: 'deleteRequest126History'
      }),
      ApiParam({
        name: 'id',
        type: Number,
        description: 'Request126History ID to delete',
        example: 1
      }),
      ApiResponse({
        status: 200,
        description: '✅ History entry deleted successfully'
      }),
      ApiResponse({ status: 401, description: '🔑 Unauthorized' }),
      ApiResponse({ status: 403, description: '⛔ Forbidden - Admin permissions required' }),
      ApiResponse({ status: 404, description: '🔍 History entry not found' })
    );
  }

  /**
   * Get all decorators for the controller (standard CRUD only)
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