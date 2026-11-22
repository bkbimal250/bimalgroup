import type { PartnerItem } from '@/src/types';

/**
 * Verified partner relationships.
 * To hide the Partners section completely until verified partnerships are ready,
 * set `partnersData = []` (components automatically omit the section when empty).
 */
export const partnersData: PartnerItem[] = [
  {
    id: 'partner-sample-cloud',
    companyName: 'Verified Technology Partner (Placeholder)',
    logoPath: '/images/partners/sample-partner-logo.svg',
    logoAlt: 'Placeholder logo mark for verified technology partner',
    website: 'https://bimalglobal.com',
    relationshipType: 'Infrastructure & Deployment Partner (Sample)',
    description:
      'Placeholder partner slot: Replace with a verified partner organization, approved logo, and accurate description of your collaboration—or empty this array to hide the Partners section.',
    isPlaceholder: true,
  },
  {
    id: 'partner-sample-design',
    companyName: 'Verified Delivery Partner (Placeholder)',
    logoPath: '/images/partners/sample-delivery-partner.svg',
    logoAlt: 'Placeholder logo mark for verified delivery partner',
    website: 'https://bimalglobal.com',
    relationshipType: 'Engineering & Product Collaboration (Sample)',
    description:
      'Placeholder partner slot: Only publish organizations with explicit logo and partnership approval.',
    isPlaceholder: true,
  },
];
