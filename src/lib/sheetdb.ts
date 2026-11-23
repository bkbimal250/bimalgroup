import { enquirySchema, type EnquirySchemaInput } from './validation/enquiry';

// Public endpoint, not a credential. Configure create-only permissions in SheetDB.
export const SHEETDB_ENDPOINT = 'https://sheetdb.io/api/v1/azmq62vz2k6uf';

export async function submitSheetDbEnquiry(
  input: EnquirySchemaInput,
  fetcher: typeof fetch = fetch,
): Promise<string> {
  const values = enquirySchema.parse(input);
  if (values.companyFax || values.website) {
    throw new Error('Enquiry submission could not be processed. Please email us directly.');
  }
  const referenceId = crypto.randomUUID();
  // Exact headers verified with SheetDB /keys. This sheet uses Timestamp, not Date.
  const row = {
    Timestamp: new Date().toISOString(),
    Name: values.name,
    Email: values.email,
    Phone: values.phone || '',
    Service: values.service,
    Budget: values.budget || '',
    Message: values.message,
    Consent: values.consent ? 'Yes' : 'No',
    Source: 'Website',
    Status: 'New',
    'Reference ID': referenceId,
  };

  let response: Response;
  try {
    response = await fetcher(SHEETDB_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // RAW stores visitor text literally, including text starting with '='.
      body: JSON.stringify({ data: [row], mode: 'RAW' }),
      signal: AbortSignal.timeout(20000),
      credentials: 'omit',
    });
  } catch {
    // A lost response can follow a successful write. Never retry automatically.
    throw new Error('Unable to confirm your enquiry was saved. Please email us directly before retrying to avoid a duplicate.');
  }

  if (!response.ok) {
    throw new Error('Failed to submit enquiry. Please try again later or email us directly.');
  }
  const result: unknown = await response.json().catch(() => null);
  if (!result || typeof result !== 'object' || !('created' in result) || result.created !== 1) {
    throw new Error('Unable to confirm your enquiry was saved. Please email us directly before retrying to avoid a duplicate.');
  }
  return referenceId;
}
