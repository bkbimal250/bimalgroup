import { z } from 'zod';

export const enquirySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Please enter your name (at least 2 characters).')
    .max(120, 'Name must be 120 characters or fewer.'),
  email: z
    .string()
    .trim()
    .email('Please enter a valid email address.')
    .max(180, 'Email must be 180 characters or fewer.'),
  phone: z
    .string()
    .trim()
    .max(40, 'Phone number must be 40 characters or fewer.')
    .refine(
      (val) => val === '' || /^[+\d\s().-]{7,40}$/.test(val),
      'Please enter a valid phone number or leave this field blank.',
    )
    .optional(),
  service: z
    .string()
    .trim()
    .min(2, 'Please select a service category.')
    .max(120, 'Service value is too long.'),
  budget: z
    .string()
    .trim()
    .max(80, 'Budget value is too long.')
    .optional(),
  message: z
    .string()
    .trim()
    .min(20, 'Please share a brief overview of your project (at least 20 characters).')
    .max(3000, 'Project message must be 3,000 characters or fewer.'),
  consent: z
    .boolean()
    .refine((val) => val === true, {
      message: 'Please confirm consent so we can process and respond to your enquiry.',
    }),
  companyFax: z.string().max(200).optional(),
  website: z.string().max(200).optional(),
});

export type EnquirySchemaInput = z.infer<typeof enquirySchema>;
