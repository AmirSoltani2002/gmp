export interface DocumentAssociation {
  id: number;
  documentId: number;
  document?: any;
}

export interface SiteDocument extends DocumentAssociation {
  siteId: number;
  site?: any;
}

export interface LineDocument extends DocumentAssociation {
  lineId: number;
  line?: any;
}

export interface CompanyDocument extends DocumentAssociation {
  companyId: number;
  company?: any;
}

export interface Request126Document extends DocumentAssociation {
  requestId: number;
  request?: any;
}

export type AssociationType = 'site' | 'line' | 'company' | 'request126';