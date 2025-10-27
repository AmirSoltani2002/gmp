import { ROLES } from '../common/interface';

export interface AccessDocumentResult {
    canAccess: boolean;
    isRestricted: boolean;
    message?: string;
}

export class DocumentPermission {
    /**
     * Checks if user can access a document based on their role and company association
     */
    static async canAccessRestrictedEntity(
        user: any,
        documentCompanyId: number | null
    ): Promise<AccessDocumentResult> {
        const userCompanyId = user.companies?.[0]?.company?.id;
        const userRole = user.role as ROLES;

        if (userRole === ROLES.SYSTEM) {
            return { canAccess: true, isRestricted: false };
        }

        if (userRole === ROLES.QRP) {
            if (userCompanyId === documentCompanyId)
                return { canAccess: true, isRestricted: false };
            else
                return {
                    canAccess: true,
                    isRestricted: true,
                };
        }

        // CEO and COMPANYOTHER can only access documents from their own company
        if (userRole === ROLES.CEO || userRole === ROLES.COMPANYOTHER) {
            if (userCompanyId === documentCompanyId) {
                return { canAccess: true, isRestricted: false };
            }
        }

        return { canAccess: false, isRestricted: true, message: "Access denied. Insufficient permissions." };
    }
}