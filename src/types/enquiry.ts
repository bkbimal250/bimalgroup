export interface EnquiryFormValues {
  name: string;
  email: string;
  phone?: string;
  service: string;
  budget?: string;
  message: string;
  consent: boolean;
  website?: string; // Honeypot field
}

export interface EnquiryApiResponse {
  ok: boolean;
  message: string;
  referenceId?: string;
  error?: string;
  fieldErrors?: Record<string, string>;
}
