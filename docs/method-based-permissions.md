# HTTP Method Permissions Implementation Guide

## Overview

This document describes the HTTP method-based permissions system implemented in our NestJS application. This approach allows you to define different permissions for different HTTP methods (GET, POST, PATCH, DELETE) on a per-controller basis, providing fine-grained access control similar to method-specific permission patterns found in modern REST frameworks.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Core Components](#core-components)
3. [Implementation Details](#implementation-details)
4. [Usage Examples](#usage-examples)
5. [Best Practices](#best-practices)
6. [Migration Guide](#migration-guide)
7. [Troubleshooting](#troubleshooting)

## Architecture Overview

The system extends our existing role-based authentication with method-specific permissions:

```
Request → AuthGuard → EnhancedRolesGuard → Controller
                           ↓
                    MethodPermissions or Roles
```

### Key Benefits

- **HTTP method flexibility**: Different permissions per HTTP method
- **Backward compatibility**: Existing `@Roles` decorators continue working
- **Type safety**: Full TypeScript support
- **Granular control**: Fine-grained access control per operation

## Core Components

### 1. MethodPermissions Decorator

**File**: `src/auth/roles.decorator.ts`

```typescript
export const MethodPermissions = Reflector.createDecorator<{
  [key: string]: ROLES[]
}>();
```

### 2. EnhancedRolesGuard

**File**: `src/auth/auth.guard.ts`

```typescript
@Injectable()
export class EnhancedRolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Check for method-specific permissions first
    const methodPermissions = this.reflector.getAllAndOverride(MethodPermissions, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const { user } = request;

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

### 3. Updated GlobalGuard

The `GlobalGuard` now uses `EnhancedRolesGuard` instead of the basic `RolesGuard`:

```typescript
@Injectable()
export class GlobalGuard implements CanActivate {
  constructor(
    private readonly authGuard: AuthGuard,
    private readonly enhancedRolesGuard: EnhancedRolesGuard,
    private readonly rolesGuardNot: RolesGuardNot,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authResult = await this.authGuard.canActivate(context);
    if (!authResult) return false;

    return this.enhancedRolesGuard.canActivate(context) && 
           this.rolesGuardNot.canActivate(context);
  }
}
```

## Implementation Details

### Available Roles

**File**: `src/common/interface.ts`

```typescript
export enum ROLES {
    SYSTEM = 'system',
    QRP = 'QRP',
    IFDAUSER = 'idfaUser',
    CEO = 'ceo',
    IFDAMANAGER = 'idfaManager',
    COMPANYOTHER = 'companyOther'
}
```

### HTTP Method Mapping

Different endpoints typically use these HTTP methods:

| Operation | HTTP Method | Typical Permission Level |
|-----------|-------------|-------------------------|
| List/Read | GET | More permissive (read access) |
| Create | POST | Moderate restrictions |
| Update | PATCH | Moderate restrictions |
| Full Replace | PUT | High restrictions |
| Delete | DELETE | Highest restrictions |

## Usage Examples

### Example 1: Basic CRUD Controller

```typescript
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MethodPermissions } from '../auth/roles.decorator';
import { ROLES } from '../common/interface';

@MethodPermissions({
  'GET': [ROLES.SYSTEM, ROLES.QRP, ROLES.IFDAUSER, ROLES.IFDAMANAGER, ROLES.COMPANYOTHER],
  'POST': [ROLES.SYSTEM, ROLES.IFDAMANAGER, ROLES.QRP],
  'PATCH': [ROLES.SYSTEM, ROLES.IFDAMANAGER, ROLES.QRP],
  'DELETE': [ROLES.SYSTEM, ROLES.IFDAMANAGER]
})
@Controller('example')
export class ExampleController {
  constructor(private readonly exampleService: ExampleService) {}

  @Get()
  findAll() {
    // Accessible by: SYSTEM, QRP, IFDAUSER, IFDAMANAGER, COMPANYOTHER
    return this.exampleService.findAll();
  }

  @Post()
  create(@Body() createDto: CreateExampleDto) {
    // Accessible by: SYSTEM, IFDAMANAGER, QRP
    return this.exampleService.create(createDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateExampleDto) {
    // Accessible by: SYSTEM, IFDAMANAGER, QRP
    return this.exampleService.update(+id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    // Accessible by: SYSTEM, IFDAMANAGER
    return this.exampleService.remove(+id);
  }
}
```

### Example 2: @nestjsx/crud Controller

For CRUD controllers using `@nestjsx/crud`:

```typescript
import { Controller } from '@nestjs/common';
import { Crud, CrudController } from '@nestjsx/crud';
import { MethodPermissions } from '../auth/roles.decorator';
import { ROLES } from '../common/interface';
import { ExampleService } from './example.service';
import { Example } from './entities/example.entity';
import { CreateExampleDto } from './dto/create-example.dto';
import { UpdateExampleDto } from './dto/update-example.dto';

@Crud({
  model: { type: Example }, // ⚠️ Important: Point to entity, not service
  dto: {
    create: CreateExampleDto,
    update: UpdateExampleDto,
  },
  query: {
    limit: 20,
    maxLimit: 100,
    alwaysPaginate: true,
    join: {
      relatedEntity: { eager: true },
    },
  },
  routes: {
    only: ['getManyBase', 'getOneBase', 'createOneBase', 'updateOneBase', 'deleteOneBase'],
  },
})
@MethodPermissions({
  'GET': [ROLES.SYSTEM, ROLES.QRP, ROLES.IFDAUSER, ROLES.IFDAMANAGER, ROLES.COMPANYOTHER],
  'POST': [ROLES.SYSTEM, ROLES.IFDAMANAGER, ROLES.QRP],
  'PATCH': [ROLES.SYSTEM, ROLES.IFDAMANAGER, ROLES.QRP], // ⚠️ Use PATCH, not PUT
  'DELETE': [ROLES.SYSTEM, ROLES.IFDAMANAGER]
})
@Controller('example')
export class ExampleController implements CrudController<ExampleService> {
  constructor(public service: ExampleService) {}
}
```

### Example 3: Mixed Approach (Method Permissions + Individual Route Overrides)

```typescript
import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { MethodPermissions, Roles } from '../auth/roles.decorator';
import { ROLES } from '../common/interface';

@MethodPermissions({
  'GET': [ROLES.SYSTEM, ROLES.IFDAUSER, ROLES.IFDAMANAGER],
  'POST': [ROLES.SYSTEM, ROLES.IFDAMANAGER],
})
@Controller('example')
export class ExampleController {
  
  @Get()
  findAll() {
    // Uses MethodPermissions: SYSTEM, IFDAUSER, IFDAMANAGER
    return this.exampleService.findAll();
  }

  @Get('public-data')
  @Roles([]) // Override: No role required (public)
  getPublicData() {
    return this.exampleService.getPublicData();
  }

  @Post('admin-only')
  @Roles([ROLES.SYSTEM]) // Override: Only SYSTEM
  adminOperation(@Body() data: any) {
    return this.exampleService.adminOperation(data);
  }
}
```

### Example 4: Real-World Request126 Implementation

**File**: `src/request126/request126.controller.ts`

```typescript
import { Controller } from '@nestjs/common';
import { Crud, CrudController } from '@nestjsx/crud';
import { Request126Service } from './request126.service';
import { CreateRequest126Dto } from './dto/create-request126.dto';
import { UpdateRequest126Dto } from './dto/update-request126.dto';
import { Request126 } from './entities/request126.entity';
import { MethodPermissions } from '../auth/roles.decorator';
import { ROLES } from '../common/interface';

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
    filter: { closedAt: { $isNull: true } },
    join: {
      company: { eager: true },
      line: { eager: true },
      drug: { eager: true },
    },
    search: {
      $or: [{ type: { $cont: '$value' } }],
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
@Controller('request126')
export class Request126Controller implements CrudController<Request126Service> {
  constructor(public service: Request126Service) {}
}
```

## Best Practices

### 1. Permission Hierarchy

Design permissions from most restrictive to least restrictive:

```typescript
@MethodPermissions({
  'GET': [ROLES.SYSTEM, ROLES.QRP, ROLES.IFDAUSER, ROLES.IFDAMANAGER, ROLES.COMPANYOTHER], // Most permissive
  'POST': [ROLES.SYSTEM, ROLES.IFDAMANAGER, ROLES.QRP],                                    // Moderate
  'PATCH': [ROLES.SYSTEM, ROLES.IFDAMANAGER, ROLES.QRP],                                   // Moderate  
  'DELETE': [ROLES.SYSTEM, ROLES.IFDAMANAGER]                                              // Most restrictive
})
```

### 2. Consistent Role Usage

Establish consistent role patterns across controllers:

- **Read operations (GET)**: Include user-facing roles
- **Create/Update (POST/PATCH)**: Administrative roles only
- **Delete operations**: Highest privilege roles only

### 3. Entity Configuration for @nestjsx/crud

Ensure entities include relation properties for joins:

```typescript
export class ExampleEntity {
  id: number;
  name: string;
  companyId: number;
  
  // Relations (for @nestjsx/crud joins)
  company?: Company;
  relatedItems?: RelatedItem[];
}
```

### 4. HTTP Method Mapping

Always match your method permissions to actual generated routes:

- `@nestjsx/crud` uses **PATCH** for updates, not PUT
- Verify generated routes with `nest start --watch` and check logs

### 5. Fallback Strategy

The system gracefully falls back to `@Roles` decorator if no `@MethodPermissions` is defined:

```typescript
// This still works!
@Roles([ROLES.SYSTEM, ROLES.IFDAMANAGER])
@Controller('legacy')
export class LegacyController {
  // All methods require SYSTEM or IFDAMANAGER
}
```

## Migration Guide

### Step 1: Identify Controllers for Migration

Look for controllers that need different permissions per operation:

```bash
# Find controllers with multiple @Roles decorators
grep -r "@Roles" src/ --include="*.controller.ts"
```

### Step 2: Analyze Current Permissions

For each controller, document current permissions:

```typescript
// Before
class ExampleController {
  @Roles([ROLES.SYSTEM, ROLES.IFDAUSER])
  @Get()
  findAll() {}

  @Roles([ROLES.SYSTEM])
  @Post()
  create() {}

  @Roles([ROLES.SYSTEM])
  @Delete(':id')
  remove() {}
}
```

### Step 3: Convert to Method Permissions

```typescript
// After
@MethodPermissions({
  'GET': [ROLES.SYSTEM, ROLES.IFDAUSER],
  'POST': [ROLES.SYSTEM],
  'DELETE': [ROLES.SYSTEM]
})
class ExampleController {
  @Get()
  findAll() {} // No decorator needed

  @Post()
  create() {} // No decorator needed

  @Delete(':id')
  remove() {} // No decorator needed
}
```

### Step 4: Test Migration

1. **Unit Tests**: Verify guard behavior
2. **Integration Tests**: Test actual endpoints
3. **Manual Testing**: Use different user roles

## Troubleshooting

### Common Issues

#### 1. "Access Denied" for Valid Users

**Problem**: Method permissions don't match actual HTTP methods

**Solution**: Check generated routes vs configured permissions

```typescript
// ❌ Wrong: @nestjsx/crud uses PATCH, not PUT
@MethodPermissions({
  'PUT': [ROLES.SYSTEM]
})

// ✅ Correct
@MethodPermissions({
  'PATCH': [ROLES.SYSTEM]
})
```

#### 2. Joins Not Working with @nestjsx/crud

**Problem**: Entity missing relation properties

**Solution**: Add relation properties to entity

```typescript
// ❌ Wrong
export class Example {
  id: number;
  companyId: number;
}

// ✅ Correct  
export class Example {
  id: number;
  companyId: number;
  company?: Company; // Add relation property
}
```

#### 3. Method Permissions Not Applied

**Problem**: Controller uses individual `@Roles` decorators

**Solution**: `@Roles` on methods override `@MethodPermissions` on class

```typescript
@MethodPermissions({
  'GET': [ROLES.SYSTEM]
})
class ExampleController {
  @Get()
  @Roles([ROLES.COMPANYOTHER]) // This overrides MethodPermissions!
  findAll() {}
}
```

#### 4. TypeScript Errors

**Problem**: Missing imports or type definitions

**Solution**: Ensure proper imports

```typescript
import { MethodPermissions } from '../auth/roles.decorator';
import { ROLES } from '../common/interface';
```

### Debugging Guide

#### 1. Check Guard Execution

Add logging to `EnhancedRolesGuard`:

```typescript
canActivate(context: ExecutionContext): boolean {
  const methodPermissions = this.reflector.getAllAndOverride(MethodPermissions, [
    context.getHandler(),
    context.getClass(),
  ]);
  
  console.log('Method permissions:', methodPermissions);
  console.log('HTTP method:', context.switchToHttp().getRequest().method);
  console.log('User role:', context.switchToHttp().getRequest().user?.role);
  
  // ... rest of the method
}
```

#### 2. Verify Route Generation

Check what routes are actually generated:

```bash
# Start server and check logs
npm run start:dev

# Or use NestJS CLI
nest start --watch
```

#### 3. Test with curl

```bash
# Test GET endpoint
curl -H "Authorization: Bearer <token>" http://localhost:3000/request126

# Test POST endpoint
curl -X POST -H "Authorization: Bearer <token>" \
     -H "Content-Type: application/json" \
     -d '{"type":"test"}' \
     http://localhost:3000/request126
```

## Writing New Modules with Method-Based Permissions

### Module Creation Checklist

When creating a new module, follow this checklist:

#### 1. ✅ Define Entity with Relations

```typescript
// entities/example.entity.ts
export class Example {
  id: number;
  name: string;
  companyId: number;
  
  // Relations for joins
  company?: Company;
  createdBy?: Person;
}
```

#### 2. ✅ Create DTOs

```typescript
// dto/create-example.dto.ts
export class CreateExampleDto {
  @IsString()
  name: string;
  
  @IsInt()
  companyId: number;
}

// dto/update-example.dto.ts
export class UpdateExampleDto extends PartialType(CreateExampleDto) {}
```

#### 3. ✅ Implement Service

```typescript
// example.service.ts
@Injectable()
export class ExampleService {
  constructor(private prisma: DatabaseService) {}
  
  // Standard CRUD methods
  async findAll() { /* ... */ }
  async findOne(id: number) { /* ... */ }
  async create(data: CreateExampleDto) { /* ... */ }
  async update(id: number, data: UpdateExampleDto) { /* ... */ }
  async remove(id: number) { /* ... */ }
}
```

#### 4. ✅ Create Controller with Method Permissions

```typescript
// example.controller.ts
import { Controller } from '@nestjs/common';
import { Crud, CrudController } from '@nestjsx/crud';
import { MethodPermissions } from '../auth/roles.decorator';
import { ROLES } from '../common/interface';

@Crud({
  model: { type: Example },
  dto: {
    create: CreateExampleDto,
    update: UpdateExampleDto,
  },
  query: {
    limit: 20,
    maxLimit: 100,
    alwaysPaginate: true,
    join: {
      company: { eager: true },
    },
  },
})
@MethodPermissions({
  'GET': [ROLES.SYSTEM, ROLES.QRP, ROLES.IFDAUSER, ROLES.IFDAMANAGER, ROLES.COMPANYOTHER],
  'POST': [ROLES.SYSTEM, ROLES.IFDAMANAGER, ROLES.QRP],
  'PATCH': [ROLES.SYSTEM, ROLES.IFDAMANAGER, ROLES.QRP],
  'DELETE': [ROLES.SYSTEM, ROLES.IFDAMANAGER]
})
@Controller('example')
export class ExampleController implements CrudController<ExampleService> {
  constructor(public service: ExampleService) {}
}
```

#### 5. ✅ Configure Module

```typescript
// example.module.ts
@Module({
  imports: [DatabaseModule],
  controllers: [ExampleController],
  providers: [ExampleService],
  exports: [ExampleService],
})
export class ExampleModule {}
```

#### 6. ✅ Add to App Module

```typescript
// app.module.ts
@Module({
  imports: [
    // ... other modules
    ExampleModule,
  ],
  // ...
})
export class AppModule {}
```

### Permission Design Template

Use this template for designing permissions:

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

## Conclusion

The HTTP method permissions system provides fine-grained access control while maintaining NestJS best practices. It allows for:

- **Granular access control** per HTTP method
- **Backward compatibility** with existing `@Roles` decorators  
- **Type safety** and excellent IDE support
- **Maintainable permission logic** at the controller level

This approach scales well as your application grows and provides clear, auditable permission boundaries for different user operations.

For questions or improvements to this system, please refer to the implementation in `src/auth/` and the working example in `src/request126/`.