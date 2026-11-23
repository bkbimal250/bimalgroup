export interface EnquiryFormValues {
  name: string;
  email: string;
  phone?: string;
  service: string;
  budget?: string;
  message: string;
  consent: boolean;
  companyFax?: string;
  website?: string; // Honeypot field
}

export interface EnquiryApiResponse {
  ok: boolean;
  message: string;
  referenceId?: string;
  error?: string;
  code?: string;
  fieldErrors?: Record<string, string>;
}

export interface SheetTabInfo {
  sheetId: number;
  title: string;
}

export interface ConnectedSheetConfig {
  spreadsheetId: string;
  spreadsheetTitle: string;
  spreadsheetUrl: string;
  sheetName: string;
  sheets: SheetTabInfo[];
}

export type EnquiryStatusOption = 'New' | 'In Review' | 'Replied' | 'Archived';

export interface SheetEnquiryRow {
  rowNumber: number;
  timestamp: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  budget: string;
  message: string;
  consent: string;
  source: string;
  status: string;
  referenceId: string;
}

