import { SheetsProvider } from '@/src/context/SheetsContext';
import { EnquiriesPage } from '@/src/pages/EnquiriesPage';

export default function AdminEnquiriesRoute() {
  return (
    <SheetsProvider>
      <EnquiriesPage />
    </SheetsProvider>
  );
}
