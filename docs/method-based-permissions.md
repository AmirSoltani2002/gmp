# HTTP Method Permissions Implementation Guide

> **A comprehensive guide to implementing fine-grained HTTP method-based permissions in NestJS applications**

## 📋 Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Architecture](#architecture)
- [Implementation](#implementation)
- [Usage Examples](#usage-examples)
- [Best Practices](#best-practices)
- [API Documentation](#api-documentation)
- [Troubleshooting](#troubleshooting)
- [Migration Guide](#migration-guide)

---

## Overview

This system enables **different permissions for different HTTP methods** (GET, POST, PATCH, DELETE) on a per-controller basis, providing fine-grained access control for REST APIs in NestJS applications.

### 🎯 Key Benefits

- **Method-specific permissions**: Different roles per HTTP method
- **Backward compatibility**: Existing `@Roles` decorators continue working
- **Type safety**: Full TypeScript support with IntelliSense
- **Granular control**: Fine-grained access control per operation
- **Standard NestJS**: Uses standard NestJS patterns and decorators
- **CRUD integration**: Works seamlessly with `@nestjsx/crud`

### 🏗️ Permission Hierarchy

```typescript
@MethodPermissions({
  'GET':    [SYSTEM, QRP, IFDAUSER, IFDAMANAGER, COMPANYOTHER], // Most permissive
  'POST':   [SYSTEM, IFDAMANAGER, QRP],                         // Moderate
  'PATCH':  [SYSTEM, IFDAMANAGER, QRP],                         // Moderate  
  'DELETE': [SYSTEM, IFDAMANAGER]                               // Most restrictive
})
```

---

## Quick Start

### 1. Basic Controller Setup

```typescript
import { Controller } from '@nestjs/common';
import { MethodPermissions } from '../auth/roles.decorator';
import { ROLES } from '../common/interface';

@MethodPermissions({
  'GET': [ROLES.SYSTEM, ROLES.IFDAUSER, ROLES.IFDAMANAGER],
  'POST': [ROLES.SYSTEM, ROLES.IFDAMANAGER],
  'PATCH': [ROLES.SYSTEM, ROLES.IFDAMANAGER],
  'DELETE': [ROLES.SYSTEM]
})
@Controller('example')
export class ExampleController {
  @Get()
  findAll() {
    // Accessible by: SYSTEM, IFDAUSER, IFDAMANAGER
    return this.exampleService.findAll();
  }

  @Post()
  create(@Body() dto: CreateDto) {
    // Accessible by: SYSTEM, IFDAMANAGER
    return this.exampleService.create(dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    // Accessible by: SYSTEM only
    return this.exampleService.remove(+id);
  }
}
```

### 2. CRUD Controller Setup

```typescript
@Crud({
  model: { type: Entity },
  dto: { create: CreateDto, update: UpdateDto },
  query: {
    limit: 20,
    alwaysPaginate: true,
    join: { relation: { eager: true } }
  }
})
@MethodPermissions({
  'GET': [ROLES.SYSTEM, ROLES.IFDAUSER],
  'POST': [ROLES.SYSTEM],
  'PATCH': [ROLES.SYSTEM],
  'DELETE': [ROLES.SYSTEM]
})
@Controller('example')
export class ExampleController {
  constructor(public service: ExampleService) {}
}
```

---

## Architecture

### System Flow

```mermaid
graph LR
    A[Request] --> B[AuthGuard]
    B --> C[EnhancedRolesGuard]
    C --> D{MethodPermissions?}
    D -->|Yes| E[Check Method Role]
    D -->|No| F[Fallback to @Roles]
    E --> G[Controller]
    F --> G
```

### Core Components

#### 1. MethodPermissions Decorator
**File**: `src/auth/roles.decorator.ts`

```typescript
export const MethodPermissions = Reflector.createDecorator<{
  [key: string]: ROLES[]
}>();
```

#### 2. EnhancedRolesGuard
**File**: `src/auth/auth.guard.ts`

```typescript
@Injectable()
export class EnhancedRolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const methodPermissions = this.reflector.getAllAndOverride(MethodPermissions, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const { user } = request;

    // Check method-specific permissions first
    if (methodPermissions && methodPermissions[method]) {
      return methodPermissions[method].includes(user?.role);
    }

    // Fallback to regular @Roles decorator
    const requiredRoles = this.reflector.getAllAndOverride(Roles, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true;
    return requiredRoles.includes(user?.role);
  }
}
```

#### 3. Updated GlobalGuard
**File**: `src/auth/auth.module.ts`

```typescript
@Injectable()
export class GlobalGuard implements CanActivate {
  constructor(
    private readonly authGuard: AuthGuard,
    private readonly enhancedRolesGuard: EnhancedRolesGuard,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authResult = await this.authGuard.canActivate(context);
    if (!authResult) return false;

    return this.enhancedRolesGuard.canActivate(context);
  }
}
```

---

## Implementation

### Available Roles
**File**: `src/common/interface.ts`

```typescript
export enum ROLES {
  SYSTEM = 'system',
  QRP = 'QRP',
  IFDAUSER = 'idfaUser',
  IFDAMANAGER = 'idfaManager',
  COMPANYOTHER = 'companyOther'
}
```

### HTTP Method Mapping

| Operation | HTTP Method | Typical Permission Level | Use Case |
|-----------|-------------|-------------------------|----------|
| List/Read | GET | More permissive (read access) | Data viewing, reports |
| Create | POST | Moderate restrictions | Data entry |
| Update | PATCH | Moderate restrictions | Data modification |
| Delete | DELETE | Highest restrictions | Data removal |

---

## Usage Examples

### 1. Standard REST Controller

```typescript
@MethodPermissions({
  'GET': [ROLES.SYSTEM, ROLES.QRP, ROLES.IFDAUSER, ROLES.IFDAMANAGER, ROLES.COMPANYOTHER],
  'POST': [ROLES.SYSTEM, ROLES.IFDAMANAGER, ROLES.QRP],
  'PATCH': [ROLES.SYSTEM, ROLES.IFDAMANAGER, ROLES.QRP],
  'DELETE': [ROLES.SYSTEM, ROLES.IFDAMANAGER]
})
@ApiTags('companies')
@ApiBearerAuth('bearer-key')
@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get()
  @ApiOperation({ summary: 'List all companies' })
  findAll() {
    return this.companyService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Create new company' })
  create(@Body() dto: CreateCompanyDto) {
    return this.companyService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update company' })
  update(@Param('id') id: string, @Body() dto: UpdateCompanyDto) {
    return this.companyService.update(+id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete company' })
  remove(@Param('id') id: string) {
    return this.companyService.remove(+id);
  }
}
```

### 2. CRUD with Custom Overrides

```typescript
@Crud({
  model: { type: Request126 },
  dto: { create: CreateRequest126Dto, update: UpdateRequest126Dto },
  query: {
    limit: 20,
    maxLimit: 100,
    alwaysPaginate: true,
    filter: { closedAt: { $isnull: true } },
    join: {
      company: { eager: true },
      line: { eager: true },
      drug: { eager: true }
    },
    sort: [{ field: 'createdAt', order: 'DESC' }]
  }
})
@MethodPermissions({
  'GET': [ROLES.SYSTEM, ROLES.QRP, ROLES.IFDAUSER, ROLES.IFDAMANAGER, ROLES.COMPANYOTHER],
  'POST': [ROLES.SYSTEM, ROLES.IFDAMANAGER, ROLES.QRP],
  'PATCH': [ROLES.SYSTEM, ROLES.IFDAMANAGER, ROLES.QRP],
  'DELETE': [ROLES.SYSTEM, ROLES.IFDAMANAGER]
})
@ApiTags('request126')
@ApiBearerAuth('bearer-key')
@Controller('request126')
export class Request126Controller {
  constructor(public service: Request126Service) {}

  // Custom endpoint with specific permissions
  @Get('closed')
  @Roles([ROLES.SYSTEM]) // Override: Only SYSTEM can view closed requests
  @ApiOperation({ summary: 'Get closed requests (admin only)' })
  getClosedRequests() {
    return this.service.findClosedRequests();
  }
}
```

### 3. Mixed Approach

```typescript
@MethodPermissions({
  'GET': [ROLES.SYSTEM, ROLES.IFDAUSER],
  'POST': [ROLES.SYSTEM]
})
@Controller('mixed')
export class MixedController {
  @Get()
  // Uses MethodPermissions: SYSTEM, IFDAUSER
  findAll() {
    return this.service.findAll();
  }

  @Get('public')
  @Roles([]) // Override: Public access
  getPublicData() {
    return this.service.getPublicData();
  }

  @Post('admin-only')
  @Roles([ROLES.SYSTEM]) // Override: Only SYSTEM
  adminOperation(@Body() data: any) {
    return this.service.adminOperation(data);
  }
}
```

---

## Best Practices

### 1. Permission Design Template

```typescript
@MethodPermissions({
  // Read operations - most permissive
  'GET': [
    ROLES.SYSTEM,           // System admin
    ROLES.IFDAMANAGER,      // IFDA manager  
    ROLES.IFDAUSER,         // IFDA user
    ROLES.QRP,              // Quality responsible person
    ROLES.COMPANYOTHER      // Company users (if applicable)
  ],
  
  // Write operations - moderate restrictions
  'POST': [
    ROLES.SYSTEM,           // System admin
    ROLES.IFDAMANAGER,      // IFDA manager
    ROLES.QRP               // Quality responsible person
  ],
  'PATCH': [
    ROLES.SYSTEM,           // System admin
    ROLES.IFDAMANAGER,      // IFDA manager  
    ROLES.QRP               // Quality responsible person
  ],
  
  // Delete operations - most restrictive
  'DELETE': [
    ROLES.SYSTEM,           // System admin
    ROLES.IFDAMANAGER       // IFDA manager only
  ]
})
```

### 2. Service Structure for CRUD

```typescript
@Injectable()
export class ExampleService {
  constructor(private prisma: DatabaseService) {}
  
  // @nestjsx/crud compatible methods
  async findMany(query?: any) {
    return this.prisma.example.findMany({
      ...query,
      include: { company: true }
    });
  }

  async findOne(id: number) {
    return this.prisma.example.findUnique({
      where: { id },
      include: { company: true }
    });
  }

  async create(data: CreateExampleDto) {
    return this.prisma.example.create({
      data,
      include: { company: true }
    });
  }

  async update(id: number, data: UpdateExampleDto) {
    return this.prisma.example.update({
      where: { id },
      data,
      include: { company: true }
    });
  }

  async remove(id: number) {
    return this.prisma.example.delete({ 
      where: { id },
      include: { company: true }
    });
  }
}
```

### 3. Entity Configuration

```typescript
export class ExampleEntity {
  id: number;
  name: string;
  companyId: number;
  
  // Relations for @nestjsx/crud joins
  company?: Company;
  relatedItems?: RelatedItem[];
}
```

### 4. DTO Best Practices

```typescript
export class CreateExampleDto {
  @ApiProperty({
    description: 'Name of the example',
    example: 'Example Name',
    minLength: 1
  })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiProperty({
    description: 'Company ID',
    example: 1,
    minimum: 1
  })
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value))
  companyId: number;
}
```

---

## API Documentation

### Swagger Configuration

**File**: `src/config/swagger.config.ts`

```typescript
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export class SwaggerConfig {
  static createDocumentConfig() {
    return new DocumentBuilder()
      .setTitle('GMP Backend API')
      .setDescription('Good Manufacturing Practice (GMP) Backend Service API Documentation')
      .setVersion('1.0.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'JWT Authorization using the Bearer scheme',
          in: 'header',
        },
        'bearer-key'
      )
      .addTag('request126', 'Request 126 Management')
      .addTag('company', 'Company Management')
      .build();
  }

  static setup(app: INestApplication, path: string = 'api-docs') {
    const config = this.createDocumentConfig();
    const document = SwaggerModule.createDocument(app, config);
    
    SwaggerModule.setup(path, app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        displayOperationId: false,
        filter: true,
        tryItOutEnabled: true,
      },
      customSiteTitle: 'GMP Backend API Documentation',
    });
    
    return document;
  }
}
```

### Controller Documentation

```typescript
@ApiTags('request126')
@ApiBearerAuth('bearer-key')
@Controller('request126')
export class Request126Controller {
  @Get()
  @ApiOperation({ 
    summary: 'List all requests',
    description: 'Get paginated list of non-closed requests with filtering capabilities'
  })
  @ApiResponse({ status: 200, description: 'Requests retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  findAll() {
    return this.service.findAll();
  }
}
```

### Documentation Features

- **JWT Authentication**: Built-in Bearer token support
- **Interactive Testing**: Try It Out functionality
- **Persistent Auth**: Authentication persists across page refreshes
- **Advanced Filtering**: Search and filter in UI
- **Permission Display**: Clear indication of required permissions

Access documentation at: `http://localhost:8000/api-docs`

---

## Troubleshooting

### Common Issues

#### ❌ Access Denied for Valid Users

**Problem**: Method permissions don't match actual HTTP methods

```typescript
// Wrong: @nestjsx/crud uses PATCH, not PUT
@MethodPermissions({
  'PUT': [ROLES.SYSTEM]
})

// Correct:
@MethodPermissions({
  'PATCH': [ROLES.SYSTEM]
})
```

#### ❌ Invalid CRUD Configuration

**Problem**: Incorrect @nestjsx/crud filter syntax

```typescript
// Wrong:
@Crud({
  query: {
    filter: { closedAt: { $isNull: true } }, // Invalid syntax
  }
})

// Correct:
@Crud({
  query: {
    filter: { closedAt: { $isnull: true } }, // Correct syntax
  }
})
```

#### ❌ Missing Entity Relations

**Problem**: Entity missing relation properties

```typescript
// Wrong:
export class Example {
  id: number;
  companyId: number;
}

// Correct:
export class Example {
  id: number;
  companyId: number;
  company?: Company; // Add relation property
}
```

### Debugging Steps

1. **Check Route Generation**
   ```bash
   npm run start:dev
   # Check console logs for generated routes
   ```

2. **Test with curl**
   ```bash
   # Test GET endpoint
   curl -H "Authorization: Bearer <token>" \
        http://localhost:8000/api/request126

   # Test POST endpoint
   curl -X POST \
        -H "Authorization: Bearer <token>" \
        -H "Content-Type: application/json" \
        -d '{"type":"test"}' \
        http://localhost:8000/api/request126
   ```

3. **Add Guard Logging**
   ```typescript
   canActivate(context: ExecutionContext): boolean {
     console.log('Method permissions:', methodPermissions);
     console.log('HTTP method:', request.method);
     console.log('User role:', request.user?.role);
     // ... rest of method
   }
   ```

---

## Migration Guide

### Step 1: Identify Controllers

Find controllers needing different permissions per operation:

```bash
grep -r "@Roles" src/ --include="*.controller.ts"
```

### Step 2: Analyze Current Permissions

Document existing permission patterns:

```typescript
// Before
class ExampleController {
  @Roles([ROLES.SYSTEM, ROLES.IFDAUSER])
  @Get()
  findAll() {}

  @Roles([ROLES.SYSTEM])
  @Post()
  create() {}
}
```

### Step 3: Convert to Method Permissions

```typescript
// After
@MethodPermissions({
  'GET': [ROLES.SYSTEM, ROLES.IFDAUSER],
  'POST': [ROLES.SYSTEM]
})
class ExampleController {
  @Get()
  findAll() {} // No decorator needed

  @Post()
  create() {} // No decorator needed
}
```

### Step 4: Test Migration

1. **Unit Tests**: Verify guard behavior
2. **Integration Tests**: Test actual endpoints  
3. **Manual Testing**: Use different user roles

---

## 🏭 Request126 Implementation - Complete Example

The Request126 module demonstrates a full implementation of HTTP method permissions with enhanced features inspired by modern REST API patterns.

### **📁 Project Structure**
```
src/request126/
├── dto/
│   ├── create-request126.dto.ts
│   ├── update-request126.dto.ts
│   └── find-all-request126.dto.ts
├── entities/
│   └── request126.entity.ts
├── request126.controller.ts
├── request126.service.ts
├── request126.module.ts
└── request126.swagger.config.ts
```

### **🎯 Enhanced DTO with Multiple Parameter Support**

```typescript
// dto/find-all-request126.dto.ts
export class FindAllRequest126Dto {
  @ApiPropertyOptional({ description: 'Page number', example: 1 })
  @IsOptional() @IsInt() @Transform(({ value }) => parseInt(value))
  page?: number;

  @ApiPropertyOptional({ description: 'Items per page (alias for limit)', example: 20 })
  @IsOptional() @IsInt() @Transform(({ value }) => parseInt(value))
  pageSize?: number;

  @ApiPropertyOptional({ description: 'Items per page', example: 20 })
  @IsOptional() @IsInt() @Transform(({ value }) => parseInt(value))
  limit?: number;

  @ApiPropertyOptional({ description: 'Filter by company ID', example: 1 })
  @IsOptional() @IsInt() @Transform(({ value }) => parseInt(value))
  companyId?: number;

  @ApiPropertyOptional({ description: 'Filter by request type', example: 'safety-assessment' })
  @IsOptional() @IsString()
  type?: string;

  @ApiPropertyOptional({ description: 'Search across multiple fields', example: 'assessment' })
  @IsOptional() @IsString()
  q?: string; // Primary search parameter

  @ApiPropertyOptional({ description: 'Legacy search parameter', example: 'assessment' })
  @IsOptional() @IsString()
  search?: string; // Backward compatibility
}
```

### **⚡ Enhanced Service with Advanced Features**

```typescript
// request126.service.ts
@Injectable()
export class Request126Service {
  constructor(private prisma: DatabaseService) {}

  // @nestjsx/crud compatible methods
  async findMany(query?: any) {
    return this.prisma.request126.findMany({
      ...query,
      include: { company: true, line: true, drug: true },
    });
  }

  async findOne(id: number) {
    return this.prisma.request126.findUnique({
      where: { id },
      include: { company: true, line: true, drug: true },
    });
  }

  async create(data: CreateRequest126Dto) {
    return this.prisma.request126.create({
      data,
      include: { company: true, line: true, drug: true },
    });
  }

  async update(id: number, data: UpdateRequest126Dto) {
    return this.prisma.request126.update({
      where: { id },
      data,
      include: { company: true, line: true, drug: true },
    });
  }

  async remove(id: number) {
    return this.prisma.request126.delete({ 
      where: { id },
      include: { company: true, line: true, drug: true },
    });
  }

  // 🚀 Enhanced findAll with advanced search capabilities
  async findAll(query: FindAllRequest126Dto) {
    const { page = 1, pageSize = 20, limit, type, companyId, q, search } = query;
    
    // Support both pageSize and limit parameters
    const actualLimit = pageSize || limit || 20;
    const skip = (page - 1) * actualLimit;

    const where: any = {};
    
    // Multi-field search (q or search parameter)
    const searchTerm = q || search;
    if (searchTerm) {
      where.OR = [
        { type: { contains: searchTerm, mode: 'insensitive' } },
        { company: { nameFa: { contains: searchTerm, mode: 'insensitive' } } },
        { company: { nameEn: { contains: searchTerm, mode: 'insensitive' } } },
        { drug: { name: { contains: searchTerm, mode: 'insensitive' } } },
        { line: { name: { contains: searchTerm, mode: 'insensitive' } } }
      ];
    }
    
    // Specific filters (override search if both provided)
    if (type && !searchTerm) where.type = { contains: type, mode: 'insensitive' };
    if (companyId) where.companyId = companyId;
    
    // Default filter: only non-closed requests
    where.closedAt = null;

    // Performance optimization: conditional includes based on page size
    const include = actualLimit < 50 
      ? {
          company: true,
          line: true,
          drug: true,
          history: true  // Include history for smaller requests
        }
      : {
          company: true,
          line: true,
          drug: true     // Skip history for larger requests
        };

    // Use transaction for consistency
    const [items, totalItems] = await this.prisma.$transaction([
      this.prisma.request126.findMany({
        where,
        include,
        skip,
        take: +actualLimit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.request126.count({ where }),
    ]);

    const totalPages = Math.ceil(totalItems / actualLimit);

    return {
      data: items,
      totalItems,
      totalPages,
      currentPage: +page,
      pageSize: +actualLimit
    };
  }

  // 🛠️ Additional utility methods
  async findOneWithHistory(id: number) {
    return this.prisma.request126.findUniqueOrThrow({
      where: { id },
      include: { 
        company: true, 
        line: true, 
        drug: true,
        history: true
      },
    });
  }

  async findByCompany(companyId: number) {
    return this.prisma.request126.findMany({
      where: { 
        companyId,
        closedAt: null 
      },
      include: { 
        company: true, 
        line: true, 
        drug: true 
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByType(type: string) {
    return this.prisma.request126.findMany({
      where: { 
        type: { contains: type, mode: 'insensitive' },
        closedAt: null 
      },
      include: { 
        company: true, 
        line: true, 
        drug: true 
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findClosed() {
    return this.prisma.request126.findMany({
      where: { 
        closedAt: { not: null }
      },
      include: { 
        company: true, 
        line: true, 
        drug: true,
        history: true
      },
      orderBy: { closedAt: 'desc' },
    });
  }

  async closeRequest(id: number) {
    return this.prisma.request126.update({
      where: { id },
      data: { closedAt: new Date() },
      include: { company: true, line: true, drug: true },
    });
  }

  async reopenRequest(id: number) {
    return this.prisma.request126.update({
      where: { id },
      data: { closedAt: null },
      include: { company: true, line: true, drug: true },
    });
  }
}
```

### **🎮 Enhanced Controller with HTTP Method Permissions**

```typescript
// request126.controller.ts
@Crud({
  model: { type: Request126 },
  dto: {
    create: CreateRequest126Dto,
    update: UpdateRequest126Dto,
  },
  query: {
    limit: 20,
    maxLimit: 100,
    alwaysPaginate: true,
    filter: {
      closedAt: { $isnull: true }, // Default: only non-closed requests
    },
    join: {
      company: { eager: true },
      line: { eager: true },
      drug: { eager: true },
    },
    sort: [{ field: 'createdAt', order: 'DESC' }],
  },
  params: {
    id: {
      field: 'id',
      type: 'number',
      primary: true,
    },
  },
  routes: {
    only: ['getManyBase', 'getOneBase', 'createOneBase', 'updateOneBase', 'deleteOneBase'],
  },
})
@MethodPermissions({
  'GET': [ROLES.SYSTEM, ROLES.QRP, ROLES.IFDAUSER, ROLES.IFDAMANAGER, ROLES.COMPANYOTHER],
  'POST': [ROLES.SYSTEM, ROLES.IFDAMANAGER, ROLES.QRP],
  'PATCH': [ROLES.SYSTEM, ROLES.IFDAMANAGER, ROLES.QRP],
  'DELETE': [ROLES.SYSTEM, ROLES.IFDAMANAGER]
})
@ApiTags('request126')
@ApiBearerAuth('bearer-key')
@Controller('request126')
export class Request126Controller {
  constructor(public service: Request126Service) {}

  // Custom endpoints with specific permissions
  @Get('closed')
  @Roles([ROLES.SYSTEM]) // Override: Only SYSTEM can view closed requests
  @ApiOperation({ summary: 'Get closed requests (admin only)' })
  getClosedRequests() {
    return this.service.findClosed();
  }

  @Get('company/:companyId')
  @ApiOperation({ summary: 'Get requests by company' })
  getByCompany(@Param('companyId') companyId: string) {
    return this.service.findByCompany(+companyId);
  }

  @Patch(':id/close')
  @Roles([ROLES.SYSTEM, ROLES.IFDAMANAGER])
  @ApiOperation({ summary: 'Close a request' })
  closeRequest(@Param('id') id: string) {
    return this.service.closeRequest(+id);
  }

  @Patch(':id/reopen')
  @Roles([ROLES.SYSTEM, ROLES.IFDAMANAGER])
  @ApiOperation({ summary: 'Reopen a closed request' })
  reopenRequest(@Param('id') id: string) {
    return this.service.reopenRequest(+id);
  }
}
```

### **📊 API Usage Examples**

```bash
# Basic listing (automatically filters closedAt IS NULL)
GET /api/request126

# Pagination with different parameter names
GET /api/request126?page=2&pageSize=10
GET /api/request126?page=2&limit=10

# Multi-field search
GET /api/request126?q=safety
GET /api/request126?search=assessment  # Legacy parameter

# Specific filters
GET /api/request126?companyId=5
GET /api/request126?type=safety-assessment

# Combined filters
GET /api/request126?companyId=5&q=assessment&pageSize=25

# Custom endpoints
GET /api/request126/closed           # Admin only
GET /api/request126/company/5        # Company-specific requests
PATCH /api/request126/1/close        # Close request
PATCH /api/request126/1/reopen       # Reopen request
```

### **🔧 Performance Features**

1. **Conditional Includes**: Includes `history` only for requests with `pageSize < 50`
2. **Transaction-based Queries**: Uses Prisma transactions for consistency
3. **Optimized Search**: Multi-field OR search with proper indexing
4. **Parameter Flexibility**: Supports both `pageSize`/`limit` and `q`/`search`
5. **Default Filtering**: Automatically excludes closed requests unless specifically requested

### **📈 Response Format**

```json
{
  "data": [
    {
      "id": 1,
      "type": "safety-assessment",
      "companyId": 1,
      "lineId": 2,
      "drugId": 3,
      "drugOEB_declared": 4,
      "drugOEL_declared": 0.5,
      "closedAt": null,
      "createdAt": "2025-10-19T10:30:00Z",
      "updatedAt": "2025-10-19T10:30:00Z",
      "company": {
        "id": 1,
        "nameFa": "شرکت نمونه",
        "nameEn": "Example Company"
      },
      "line": {
        "id": 2,
        "name": "Production Line A"
      },
      "drug": {
        "id": 3,
        "name": "Example Drug",
        "atc": "A01AA01"
      }
    }
  ],
  "totalItems": 25,
  "totalPages": 2,
  "currentPage": 1,
  "pageSize": 20
}
```

This implementation demonstrates:
- **🎯 HTTP Method Permissions** in action
- **⚡ Performance optimizations** with conditional includes
- **🔍 Advanced search capabilities** across multiple fields
- **📊 Consistent API patterns** following company service structure
- **🛠️ Utility methods** for common operations
- **📚 Comprehensive documentation** with Swagger integration

---

## Module Creation Checklist

When creating a new module with HTTP method permissions:

### ✅ 1. Define Entity
```typescript
export class Example {
  id: number;
  name: string;
  companyId: number;
  company?: Company; // For joins
}
```

### ✅ 2. Create DTOs
```typescript
export class CreateExampleDto {
  @IsString() @MinLength(1)
  name: string;
  
  @IsInt() @Min(1)
  companyId: number;
}
```

### ✅ 3. Implement Service
```typescript
@Injectable()
export class ExampleService {
  // Implement: findMany, findOne, create, update, remove
}
```

### ✅ 4. Create Controller
```typescript
@MethodPermissions({
  'GET': [ROLES.SYSTEM, ROLES.IFDAUSER],
  'POST': [ROLES.SYSTEM],
  'PATCH': [ROLES.SYSTEM],
  'DELETE': [ROLES.SYSTEM]
})
@Controller('example')
export class ExampleController {
  constructor(public service: ExampleService) {}
}
```

### ✅ 5. Configure Module
```typescript
@Module({
  controllers: [ExampleController],
  providers: [ExampleService],
  exports: [ExampleService]
})
export class ExampleModule {}
```

---

## Conclusion

The HTTP Method Permissions system with the enhanced Request126 implementation provides:

- **🎯 Fine-grained access control** per HTTP method with role-based permissions
- **🔄 Backward compatibility** with existing `@Roles` decorators and legacy parameters
- **🛡️ Type safety** with full TypeScript support and comprehensive validation
- **📈 Scalable architecture** that grows with your application needs
- **📚 Comprehensive documentation** with enhanced Swagger integration
- **⚡ Performance optimizations** with conditional includes and transaction-based queries
- **🔍 Advanced search capabilities** across multiple fields with flexible parameter support
- **🛠️ Rich utility methods** for common operations (close, reopen, filter by company/type)
- **📊 Consistent API patterns** following modern REST API best practices

### 🚀 **Recent Enhancements (October 2025)**

✅ **Enhanced Request126 Service**:
- Multi-field search with OR conditions
- Performance-optimized conditional includes
- Transaction-based data retrieval
- Support for both `pageSize`/`limit` and `q`/`search` parameters
- Utility methods for request lifecycle management

✅ **Improved DTO Validation**:
- Comprehensive API documentation with examples
- Transform decorators for proper type conversion
- Backward compatibility with legacy parameters

✅ **Updated NestJS CLI**:
- Resolved deprecation warnings (DEP0190)
- Clean application startup with no compilation errors

✅ **Enhanced Documentation**:
- Complete implementation examples
- Performance optimization guidelines
- Advanced usage patterns and best practices

This approach ensures clear, auditable permission boundaries while maintaining NestJS best practices and providing excellent developer experience.

### 📊 **System Status**

- **✅ Application Health**: No compilation errors, all routes properly mapped
- **✅ Security**: HTTP method permissions active with enhanced guards
- **✅ Documentation**: Swagger available at `/api-docs` with comprehensive examples
- **✅ Performance**: Optimized queries with conditional includes
- **✅ Compatibility**: Works with @nestjsx/crud and standard NestJS patterns

**For support or improvements**, refer to:
- **Core Implementation**: `src/auth/` (guards, decorators, permissions)
- **Enhanced Example**: `src/request126/` (complete CRUD with advanced features)
- **API Documentation**: `http://localhost:8000/api-docs` (interactive Swagger UI)
- **Configuration**: `src/config/swagger.config.ts` (enhanced API documentation setup)