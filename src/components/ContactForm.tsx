import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, Loader2, Send } from 'lucide-react';
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
import { enquirySchema, type EnquirySchemaInput } from '@/src/lib/validation/enquiry';
import type { EnquiryApiResponse } from '@/src/types';

interface ContactFormProps {
  serviceOptions: string[];
  budgetOptions: string[];
  initialService?: string;
  consentLabel: string;
  retentionSummary: string;
  fallbackEmail: string;
}

export function ContactForm({
  serviceOptions,
  budgetOptions,
  initialService,
  consentLabel,
  retentionSummary,
  fallbackEmail,
}: ContactFormProps) {
  const [submitResult, setSubmitResult] = useState<{
    status: 'idle' | 'submitting' | 'success' | 'error';
    message?: string;
    referenceId?: string;
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
      const response = await fetch('/api/enquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const payload = (await response.json()) as EnquiryApiResponse;

      if (!response.ok || !payload.ok) {
        setSubmitResult({
          status: 'error',
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
        className="rounded-2xl border border-[var(--accent)]/50 bg-[var(--surface)] p-6 sm:p-8 space-y-4"
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
      className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 space-y-6"
    >
      {/* Hidden honeypot input for automated bot detection */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="website">Company Website</label>
        <input
          id="website"
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
            <a
              href={`mailto:${fallbackEmail}`}
              className="inline-block text-xs font-medium text-[var(--accent)] underline underline-offset-4"
            >
              Email {fallbackEmail} directly
            </a>
          }
        />
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="enquiry-name">
            Full Name <span className="text-[var(--accent)]">*</span>
          </Label>
          <Input
            id="enquiry-name"
            placeholder="Your name"
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'enquiry-name-error' : undefined}
            {...register('name')}
          />
          {errors.name && (
            <p id="enquiry-name-error" className="text-xs text-red-400">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="enquiry-email">
            Work Email <span className="text-[var(--accent)]">*</span>
          </Label>
          <Input
            id="enquiry-email"
            type="email"
            placeholder="you@company.com"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'enquiry-email-error' : undefined}
            {...register('email')}
          />
          {errors.email && (
            <p id="enquiry-email-error" className="text-xs text-red-400">
              {errors.email.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="enquiry-phone">Phone Number (Optional)</Label>
          <Input
            id="enquiry-phone"
            type="tel"
            placeholder="+1 (555) 000-0000"
            autoComplete="tel"
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? 'enquiry-phone-error' : undefined}
            {...register('phone')}
          />
          {errors.phone && (
            <p id="enquiry-phone-error" className="text-xs text-red-400">
              {errors.phone.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="enquiry-budget">Estimated Budget (Optional)</Label>
          <Controller
            control={control}
            name="budget"
            render={({ field }) => (
              <Select
                value={field.value || undefined}
                onValueChange={field.onChange}
              >
                <SelectTrigger id="enquiry-budget">
                  <SelectValue placeholder="Select a budget range" />
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
        <Label htmlFor="enquiry-service">
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
                id="enquiry-service"
                aria-invalid={Boolean(errors.service)}
                aria-describedby={
                  errors.service ? 'enquiry-service-error' : undefined
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
          <p id="enquiry-service-error" className="text-xs text-red-400">
            {errors.service.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="enquiry-message">
          Project Overview <span className="text-[var(--accent)]">*</span>
        </Label>
        <Textarea
          id="enquiry-message"
          placeholder="Describe your product goals, key features, timeline, and any existing platform links."
          aria-invalid={Boolean(errors.message)}
          aria-describedby={
            errors.message ? 'enquiry-message-error' : undefined
          }
          {...register('message')}
        />
        {errors.message && (
          <p id="enquiry-message-error" className="text-xs text-red-400">
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
                id="enquiry-consent"
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(checked === true)}
                aria-invalid={Boolean(errors.consent)}
                aria-describedby={
                  errors.consent ? 'enquiry-consent-error' : undefined
                }
                className="mt-0.5"
              />
            )}
          />
          <Label
            htmlFor="enquiry-consent"
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
          <p id="enquiry-consent-error" className="text-xs text-red-400">
            {errors.consent.message}
          </p>
        )}
        <p className="text-xs leading-relaxed text-[var(--muted)]/85">
          {retentionSummary}
        </p>
      </div>

      <div className="flex items-center justify-end">
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
