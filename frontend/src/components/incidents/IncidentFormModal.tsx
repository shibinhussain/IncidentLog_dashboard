import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useCreateIncident, useUpdateIncident } from '../../hooks/useIncidents';
import type { Incident } from '../../types/incident';
import { datetimeLocalToIso, toDatetimeLocal } from '../../utils/format';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { Select } from '../ui/Select';
import { useToast } from '../ui/Toast';

const schema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  status: z.enum(['open', 'investigating', 'resolved']),
  date: z.string().refine((value) => !Number.isNaN(new Date(value).getTime()), {
    message: 'Enter a valid date and time',
  }),
});

type FormValues = z.infer<typeof schema>;

interface IncidentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  incident?: Incident;
}

const defaultValues: FormValues = {
  title: '',
  description: '',
  severity: 'medium',
  status: 'open',
  date: toDatetimeLocal(new Date().toISOString()),
};

export function IncidentFormModal({ isOpen, onClose, incident }: IncidentFormModalProps) {
  const createMutation = useCreateIncident();
  const updateMutation = useUpdateIncident();
  const { toast } = useToast();
  const isEdit = Boolean(incident);
  const mutation = isEdit ? updateMutation : createMutation;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  useEffect(() => {
    if (!isOpen) return;
    reset(
      incident
        ? {
            title: incident.title,
            description: incident.description,
            severity: incident.severity,
            status: incident.status,
            date: toDatetimeLocal(incident.date),
          }
        : defaultValues,
    );
  }, [incident, isOpen, reset]);

  const closeWithDirtyCheck = () => {
    if (isDirty && !window.confirm('Discard unsaved changes?')) return;
    onClose();
  };

  const onSubmit = handleSubmit(async (values) => {
    try {
      const payload = { ...values, date: datetimeLocalToIso(values.date) };
      if (incident) {
        await updateMutation.mutateAsync({ id: incident.id, data: payload });
        toast.success('Incident updated');
      } else {
        await createMutation.mutateAsync(payload);
        toast.success('Incident created');
      }
      onClose();
    } catch {
      toast.error('Failed to save incident');
    }
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeWithDirtyCheck}
      title={isEdit ? 'Edit Incident' : 'Create Incident'}
      size="md"
    >
      <form className="space-y-4" onSubmit={onSubmit}>
        <Input label="Title" error={errors.title?.message} {...register('title')} />
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
          <span className="mb-1.5 block">Description</span>
          <textarea
            className="min-h-28 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:ring-blue-900"
            {...register('description')}
          />
          {errors.description ? (
            <span className="mt-1 block text-xs text-red-600">
              {errors.description.message}
            </span>
          ) : null}
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            label="Severity"
            error={errors.severity?.message}
            options={[
              { value: 'low', label: 'Low' },
              { value: 'medium', label: 'Medium' },
              { value: 'high', label: 'High' },
              { value: 'critical', label: 'Critical' },
            ]}
            {...register('severity')}
          />
          <Select
            label="Status"
            error={errors.status?.message}
            options={[
              { value: 'open', label: 'Open' },
              { value: 'investigating', label: 'Investigating' },
              { value: 'resolved', label: 'Resolved' },
            ]}
            {...register('status')}
          />
        </div>

        <Input
          type="datetime-local"
          label="Date & Time"
          error={errors.date?.message}
          {...register('date')}
        />

        {mutation.isError ? (
          <div className="flex items-center gap-2 rounded-md border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700">
            <AlertCircle className="h-4 w-4" />
            Failed to save incident. Check the fields and try again.
          </div>
        ) : null}

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={closeWithDirtyCheck}>
            Cancel
          </Button>
          <Button type="submit" loading={mutation.isPending}>
            {isEdit ? 'Save Changes' : 'Create Incident'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
