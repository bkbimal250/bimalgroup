import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, FileSpreadsheet, Loader2, Send } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Checkbox } from '@/src/components/ui/checkbox';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select';
import { Textarea } from '@/src/components/ui/textarea';
import { ErrorState } from '@/src/components/ErrorState';
import { useSheets } from '@/src/context/SheetsContext';
import { enquirySchema, type EnquirySchemaInput } from '@/src/lib/validation/enquiry';
import type { EnquiryApiResponse } from '@/src/types';

interface ContactFormProps {
  serviceOptions: string[];
  budgetOptions: string[];
  initialService?: string;
  consentLabel: string;
  retentionSummary: string;
  fallbackEmail: string;
  embedded?: boolean;
  idPrefix?: string;
  onSubmitted?: () => void;
}

export function ContactForm({
  serviceOptions,
  budgetOptions,
  initialService,
  consentLabel,
  retentionSummary,
  fallbackEmail,
  embedded = false,
  idPrefix = 'enquiry',
  onSubmitted,
}: ContactFormProps) {
  const {
    accessToken,
    connectedSheet,
    appsScriptConfigured,
    markTokenExpired,
  } = useSheets();

  const [submitResult, setSubmitResult] = useState<{
    status: 'idle' | 'submitting' | 'success' | 'error';
    message?: string;
    referenceId?: string;
    code?: string;
  }>({ status: 'idle' });

  const matchedInitialService =
    initialService && serviceOptions.includes(initialService)
      ? initialService
      : '';

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<EnquirySchemaInput>({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      service: matchedInitialService,
      budget: '',
      message: '',
      consent: false,
      website: '',
    },
  });

  useEffect(() => {
    if (matchedInitialService) {
      setValue('service', matchedInitialService);
    }
  }, [matchedInitialService, setValue]);

  const onSubmit = async (values: EnquirySchemaInput) => {
    setSubmitResult({ status: 'submitting' });

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (accessToken && connectedSheet) {
        headers.Authorization = `Bearer ${accessToken}`;
        headers['x-sheet-id'] = connectedSheet.spreadsheetId;
        headers['x-sheet-name'] = connectedSheet.sheetName;
      }

      const response = await fetch('/api/enquiry', {
        method: 'POST',
        headers,
        body: JSON.stringify(values),
      });

      const payload = (await response.json()) as EnquiryApiResponse;

      if (!response.ok || !payload.ok) {
        if (payload.code === 'AUTH_EXPIRED') {
          markTokenExpired();
        }
        setSubmitResult({
          status: 'error',
          code: payload.code,
          message:
            payload.error ||
            payload.message ||
            'Your enquiry could not be recorded at this time. Please retry or reach out directly via email.',
        });
        return;
      }

      setSubmitResult({
        status: 'success',
        message:
          payload.message ||
          'Thank you. Your project enquiry has been recorded and our team will respond shortly.',
        referenceId: payload.referenceId,
      });

      onSubmitted?.();

      reset({
        name: '',
        email: '',
        phone: '',
        service: '',
        budget: '',
        message: '',
        consent: false,
        website: '',
      });
    } catch {
      setSubmitResult({
        status: 'error',
        message:
          'Network error while submitting your enquiry. Please check your connection or email us directly.',
      });
    }
  };

  if (submitResult.status === 'success') {
    return (
      <div
        role="status"
        className={
          embedded
            ? 'space-y-4 pt-2'
            : 'rounded-2xl border border-[var(--accent)]/50 bg-[var(--surface)] p-6 sm:p-8 space-y-4'
        }
      >
        <div className="flex items-start gap-3">
          <CheckCircle2
            className="mt-0.5 h-6 w-6 shrink-0 text-[var(--accent)]"
            aria-hidden="true"
          />
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-[var(--text)]">
              Enquiry received
            </h2>
            <p className="text-sm leading-relaxed text-[var(--muted)]">
              {submitResult.message}
            </p>
            {submitResult.referenceId && (
              <p className="font-mono text-xs text-[var(--muted)]">
                Reference: {submitResult.referenceId}
              </p>
            )}
          </div>
        </div>

        <div className="pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setSubmitResult({ status: 'idle' })}
          >
            Submit another enquiry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className={
        embedded
          ? 'space-y-5'
          : 'rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 space-y-6'
      }
    >
      {/* Hidden honeypot input for automated bot detection */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor={`${idPrefix}-website`}>Company Website</label>
        <input
          id={`${idPrefix}-website`}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register('website')}
        />
      </div>

      {submitResult.status === 'error' && submitResult.message && (
        <ErrorState
          title="Unable to submit enquiry"
          description={submitResult.message}
          action={
            <div className="flex flex-wrap items-center gap-4">
              {(submitResult.code === 'SHEET_NOT_CONNECTED' ||
                submitResult.code === 'AUTH_EXPIRED') && (
                <Link
                  to="/enquiries"
                  className="inline-block text-xs font-medium text-[var(--accent)] underline underline-offset-4"
                >
                  {submitResult.code === 'AUTH_EXPIRED'
                    ? 'Reconnect Google Sheets'
                    : 'Connect Google Sheet'}
                </Link>
              )}
              <a
                href={`mailto:${fallbackEmail}`}
                className="inline-block text-xs font-medium text-[var(--accent)] underline underline-offset-4"
              >
                Email {fallbackEmail} directly
              </a>
            </div>
          }
        />
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}-name`}>
            Full Name <span className="text-[var(--accent)]">*</span>
          </Label>
          <Input
            id={`${idPrefix}-name`}
            placeholder="Your name"
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? `${idPrefix}-name-error` : undefined}
            {...register('name')}
          />
          {errors.name && (
            <p id={`${idPrefix}-name-error`} className="text-xs text-red-400">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}-email`}>
            Work Email <span className="text-[var(--accent)]">*</span>
          </Label>
          <Input
            id={`${idPrefix}-email`}
            type="email"
            placeholder="you@company.com"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? `${idPrefix}-email-error` : undefined}
            {...register('email')}
          />
          {errors.email && (
            <p id={`${idPrefix}-email-error`} className="text-xs text-red-400">
              {errors.email.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}-phone`}>Phone Number (Optional)</Label>
          <Input
            id={`${idPrefix}-phone`}
            type="tel"
            placeholder="+91 98765 43210"
            autoComplete="tel"
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? `${idPrefix}-phone-error` : undefined}
            {...register('phone')}
          />
          {errors.phone && (
            <p id={`${idPrefix}-phone-error`} className="text-xs text-red-400">
              {errors.phone.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}-budget`}>Estimated Budget (Optional)</Label>
          <Controller
            control={control}
            name="budget"
            render={({ field }) => (
              <Select
                value={field.value || undefined}
                onValueChange={field.onChange}
              >
                <SelectTrigger id={`${idPrefix}-budget`}>
                  <SelectValue placeholder="Select a budget range (₹ INR)" />
                </SelectTrigger>
                <SelectContent>
                  {budgetOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-service`}>
          Service Needed <span className="text-[var(--accent)]">*</span>
        </Label>
        <Controller
          control={control}
          name="service"
          render={({ field }) => (
            <Select
              value={field.value || undefined}
              onValueChange={field.onChange}
            >
              <SelectTrigger
                id={`${idPrefix}-service`}
                aria-invalid={Boolean(errors.service)}
                aria-describedby={
                  errors.service ? `${idPrefix}-service-error` : undefined
                }
              >
                <SelectValue placeholder="Select the primary service you need" />
              </SelectTrigger>
              <SelectContent>
                {serviceOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.service && (
          <p id={`${idPrefix}-service-error`} className="text-xs text-red-400">
            {errors.service.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-message`}>
          Project Overview <span className="text-[var(--accent)]">*</span>
        </Label>
        <Textarea
          id={`${idPrefix}-message`}
          placeholder="Describe your product goals, key features, timeline, and any existing platform links."
          aria-invalid={Boolean(errors.message)}
          aria-describedby={
            errors.message ? `${idPrefix}-message-error` : undefined
          }
          {...register('message')}
        />
        {errors.message && (
          <p id={`${idPrefix}-message-error`} className="text-xs text-red-400">
            {errors.message.message}
          </p>
        )}
      </div>

      <div className="space-y-3 border-t border-[var(--border)] pt-5">
        <div className="flex items-start gap-3">
          <Controller
            control={control}
            name="consent"
            render={({ field }) => (
              <Checkbox
                id={`${idPrefix}-consent`}
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(checked === true)}
                aria-invalid={Boolean(errors.consent)}
                aria-describedby={
                  errors.consent ? `${idPrefix}-consent-error` : undefined
                }
                className="mt-0.5"
              />
            )}
          />
          <Label
            htmlFor={`${idPrefix}-consent`}
            className="text-xs leading-relaxed font-normal text-[var(--muted)] cursor-pointer"
          >
            {consentLabel}{' '}
            <Link
              to="/privacy"
              className="font-medium text-[var(--text)] underline underline-offset-4 hover:text-[var(--accent)]"
            >
              Read Privacy Policy
            </Link>
            .
          </Label>
        </div>
        {errors.consent && (
          <p id={`${idPrefix}-consent-error`} className="text-xs text-red-400">
            {errors.consent.message}
          </p>
        )}
        <p className="text-xs leading-relaxed text-[var(--muted)]/85">
          {retentionSummary}
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
          <FileSpreadsheet className="h-3.5 w-3.5 shrink-0 text-[var(--accent)]" aria-hidden="true" />
          {accessToken && connectedSheet ? (
            <span>
              Saving to{' '}
              <Link
                to="/enquiries"
                className="font-medium text-[var(--text)] underline underline-offset-4 hover:text-[var(--accent)]"
              >
                {connectedSheet.spreadsheetTitle} ({connectedSheet.sheetName})
              </Link>
            </span>
          ) : appsScriptConfigured ? (
            <span>Enquiries sync to Bimal Global Google Sheets.</span>
          ) : (
            <span>
              <Link
                to="/enquiries"
                className="font-medium text-[var(--text)] underline underline-offset-4 hover:text-[var(--accent)]"
              >
                Connect Google Sheet
              </Link>{' '}
              to record enquiries directly.
            </span>
          )}
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={submitResult.status === 'submitting'}
          className="w-full sm:w-auto"
        >
          {submitResult.status === 'submitting' ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              <span>Submitting enquiry...</span>
            </>
          ) : (
            <>
              <span>Send Enquiry</span>
              <Send className="h-4 w-4" aria-hidden="true" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
