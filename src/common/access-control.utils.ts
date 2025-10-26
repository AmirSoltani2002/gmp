import { BadRequestException } from '@nestjs/common';
import { ROLES } from './interface';

export interface AccessControlResult {
  canAccess: boolean;
  message?: string;
}

export class AccessControlUtils {
  /**
   * Validates user ID from request
   */
  static validateUserId(req: any): number {
    const userId = req['user']?.id;
    if (!userId) {
      throw new BadRequestException('User ID not found in request');
    }
    
    const userIdNumber = parseInt(userId, 10);
    if (isNaN(userIdNumber)) {
      throw new BadRequestException('Invalid user ID format');
    }
    
    return userIdNumber;
  }

  /**
   * Checks if user can access a company based on their role and company association
   */
  static async canAccessCompany(
    user: any, 
    companyId: number | string
  ): Promise<AccessControlResult> {
    const userCompanyId = user.companies?.[0]?.company?.id;
    const userRole = user.role as ROLES;

    // SYSTEM and QRP can access any company
    if (userRole === ROLES.SYSTEM || userRole === ROLES.QRP) {
      return { canAccess: true };
    }

    // CEO and COMPANYOTHER can only access their own company
    if (userRole === ROLES.CEO || userRole === ROLES.COMPANYOTHER) {
      if (userCompanyId.toString() === companyId.toString()) {
        return { canAccess: true };
      } else {
        return { 
          canAccess: false, 
          message: `Access denied. ${userRole === ROLES.CEO ? 'CEO' : 'Company Other'} users can only view their own company information.` 
        };
      }
    }

    return { canAccess: false, message: "Access denied. Insufficient permissions." };
  }

  /**
   * Checks if user can access a site based on their role and company association
   */
  static async canAccessSite(
    user: any, 
    siteCompanyId: number | string
  ): Promise<AccessControlResult> {
    const userCompanyId = user.companies?.[0]?.company?.id;
    const userRole = user.role as ROLES;

    // SYSTEM and QRP can access any site
    if (userRole === ROLES.SYSTEM || userRole === ROLES.QRP) {
      return { canAccess: true };
    }

    // CEO and COMPANYOTHER can only access sites from their own company
    if (userRole === ROLES.CEO || userRole === ROLES.COMPANYOTHER) {
      if (userCompanyId.toString() === siteCompanyId.toString()) {
        return { canAccess: true };
      } else {
        return { 
          canAccess: false, 
          message: `Access denied. ${userRole === ROLES.CEO ? 'CEO' : 'Company Other'} users can only view sites from their own company.` 
        };
      }
    }

    return { canAccess: false, message: "Access denied. Insufficient permissions." };
  }

  /**
   * Checks if user can access a line based on their role and company association
   */
  static async canAccessLine(
    user: any, 
    lineCompanyId: number | string
  ): Promise<AccessControlResult> {
    const userCompanyId = user.companies?.[0]?.company?.id;
    const userRole = user.role as ROLES;

    // SYSTEM and QRP can access any line
    if (userRole === ROLES.SYSTEM || userRole === ROLES.QRP) {
      return { canAccess: true };
    }

    // CEO and COMPANYOTHER can only access lines from their own company
    if (userRole === ROLES.CEO || userRole === ROLES.COMPANYOTHER) {
      if (userCompanyId.toString() === lineCompanyId.toString()) {
        return { canAccess: true };
      } else {
        return { 
          canAccess: false, 
          message: `Access denied. ${userRole === ROLES.CEO ? 'CEO' : 'Company Other'} users can only view lines from their own company.` 
        };
      }
    }

    return { canAccess: false, message: "Access denied. Insufficient permissions." };
  }

  /**
   * Generic access control function that can be used for any entity with company association
   */
  static async canAccessEntity(
    user: any, 
    entityCompanyId: number | string,
    entityType: string = 'entity'
  ): Promise<AccessControlResult> {
    const userCompanyId = user.companies?.[0]?.company?.id;
    const userRole = user.role as ROLES;

    // SYSTEM and QRP can access any entity
    if (userRole === ROLES.SYSTEM || userRole === ROLES.QRP) {
      return { canAccess: true };
    }

    // CEO and COMPANYOTHER can only access entities from their own company
    if (userRole === ROLES.CEO || userRole === ROLES.COMPANYOTHER) {
      if (userCompanyId.toString() === entityCompanyId.toString()) {
        return { canAccess: true };
      } else {
        return { 
          canAccess: false, 
          message: `Access denied. ${userRole === ROLES.CEO ? 'CEO' : 'Company Other'} users can only view ${entityType}s from their own company.` 
        };
      }
    }

    return { canAccess: false, message: "Access denied. Insufficient permissions." };
  }

  /**
   * Restricted access control function - QRP can only access their own company's data
   * Used for persons, machines, and company drugs
   */
  static async canAccessRestrictedEntity(
    user: any, 
    entityCompanyId: number | string,
    entityType: string = 'entity'
  ): Promise<AccessControlResult> {
    const userCompanyId = user.companies?.[0]?.company?.id;
    const userRole = user.role as ROLES;

    // SYSTEM can access any entity
    if (userRole === ROLES.SYSTEM) {
      return { canAccess: true };
    }

    // QRP, CEO, and COMPANYOTHER can only access entities from their own company
    if (userRole === ROLES.QRP || userRole === ROLES.CEO || userRole === ROLES.COMPANYOTHER) {
      if (userCompanyId.toString() === entityCompanyId.toString()) {
        return { canAccess: true };
      } else {
        return { 
          canAccess: false, 
          message: `Access denied. ${userRole === ROLES.QRP ? 'QRP' : userRole === ROLES.CEO ? 'CEO' : 'Company Other'} users can only view ${entityType}s from their own company.` 
        };
      }
    }

    return { canAccess: false, message: "Access denied. Insufficient permissions." };
  }
}
