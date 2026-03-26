'use client';

import Link from 'next/link';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Check, ChevronRight, FileText, Pencil, Plus, Save, ShieldAlert, Trash2, Upload } from 'lucide-react';
import { Navbar } from '@/common/components/ui/Navbar';
import { Header } from '@/common/components/layout/Header';
import { SurfaceCard } from '@/common/components/ui/SurfaceCard';
import { CustomSelect } from '@/common/components/ui/CustomSelect';
import { useEnterprisePayments } from '../hooks/useEnterprisePayments';
import { PROCESSOR_OPTIONS } from '../lib/paymentsWorkspace';
import { usePaymentActor } from '../hooks/usePaymentActor';
import type { Beneficiary, PaymentAttachment, PaymentDraftInput } from '../types';
import { paymentDetailsHref } from '@/lib/detailRoutes';

const steps = [
  'Beneficiario',
  'Datos bancarios',
  'Detalles del pago',
  'Adjuntar documentos',
  'Revisión',
];

const money = (minor: number, currency: string) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(minor / 100);

const getAutomaticProcessor = (currency: PaymentDraftInput['currency'], amountMinor: number) => {
  if (currency === 'EUR') {
    return PROCESSOR_OPTIONS.find((item) => item.id === 'b89') ?? PROCESSOR_OPTIONS[0];
  }
  if (amountMinor > 0 && amountMinor <= 200000) {
    return PROCESSOR_OPTIONS.find((item) => item.id === 'ducapp') ?? PROCESSOR_OPTIONS[0];
  }
  return PROCESSOR_OPTIONS.find((item) => item.id === 'tropipay') ?? PROCESSOR_OPTIONS[0];
};

function PaymentCreateContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paymentId = searchParams.get('paymentId') ?? '';
  const isEditing = Boolean(paymentId);
  const { actor, hasPermission, hasAnyPermission } = usePaymentActor();
  const { beneficiaries, summary, addBeneficiary, editBeneficiary, removeBeneficiary, getPayment, saveDraft, submitForApproval } =
    useEnterprisePayments();
  const existingPayment = getPayment(paymentId);
  const canCreatePayment = hasPermission('create_third_party_payment');
  const canUpdatePayment = hasPermission('update_third_party_payment');
  const canSubmitPayment = hasPermission('submit_third_party_payment');
  const canCreateBeneficiary = hasAnyPermission(['create_beneficiary', 'manage_beneficiaries']);
  const canEditBeneficiary = hasAnyPermission(['update_beneficiary', 'manage_beneficiaries']);
  const canDeleteBeneficiary = hasAnyPermission(['delete_beneficiary', 'manage_beneficiaries']);
  const canAttachDocuments = hasPermission('attach_payment_documents');
  const canEdit =
    !existingPayment ||
    (canUpdatePayment &&
      actor.id === existingPayment.createdById &&
      (existingPayment.status === 'Draft' || existingPayment.status === 'Rejected'));
  const canAccessPage = isEditing ? canUpdatePayment : canCreatePayment;

  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [createNewBeneficiary, setCreateNewBeneficiary] = useState(false);
  const [successNotice, setSuccessNotice] = useState('');
  const [actionError, setActionError] = useState('');
  const [isPersisting, setIsPersisting] = useState(false);
  const [editingBeneficiaryId, setEditingBeneficiaryId] = useState('');

  const [beneficiaryForm, setBeneficiaryForm] = useState<Omit<Beneficiary, 'id'>>({
    name: '',
    email: '',
    country: 'Estados Unidos',
    bank: '',
    accountNumber: '',
    accountType: 'Checking',
    swiftIban: '',
  });

  const [draft, setDraft] = useState<PaymentDraftInput>({
    beneficiaryId: '',
    beneficiaryName: '',
    beneficiaryEmail: '',
    country: '',
    bank: '',
    accountNumber: '',
    accountType: 'Checking',
    swiftIban: '',
    amountMinor: 0,
    currency: 'USD',
    description: '',
    reference: '',
    invoiceNumber: '',
    executionDate: new Date().toISOString().split('T')[0],
    processor: 'tropipay',
    estimatedFeeMinor: PROCESSOR_OPTIONS[0].estimatedFeeMinor,
    estimatedDelivery: PROCESSOR_OPTIONS[0].estimatedDelivery,
    attachments: [],
  });

  useEffect(() => {
    if (!existingPayment) return;
    setDraft({
      beneficiaryId: existingPayment.beneficiaryId,
      beneficiaryName: existingPayment.beneficiaryName,
      beneficiaryEmail: existingPayment.beneficiaryEmail,
      country: existingPayment.country,
      bank: existingPayment.bank,
      accountNumber: existingPayment.accountNumber,
      accountType: existingPayment.accountType,
      swiftIban: existingPayment.swiftIban,
      amountMinor: existingPayment.amountMinor,
      currency: existingPayment.currency,
      description: existingPayment.description,
      reference: existingPayment.reference,
      invoiceNumber: existingPayment.invoiceNumber,
      executionDate: existingPayment.executionDate,
      processor: existingPayment.processor,
      estimatedFeeMinor: existingPayment.estimatedFeeMinor,
      estimatedDelivery: existingPayment.estimatedDelivery,
      attachments: existingPayment.attachments,
    });
  }, [existingPayment]);

  const processor = useMemo(
    () => getAutomaticProcessor(draft.currency, draft.amountMinor),
    [draft.currency, draft.amountMinor]
  );

  useEffect(() => {
    setDraft((prev) => {
      if (
        prev.processor === processor.id &&
        prev.estimatedFeeMinor === processor.estimatedFeeMinor &&
        prev.estimatedDelivery === processor.estimatedDelivery
      ) {
        return prev;
      }
      return {
        ...prev,
        processor: processor.id,
        estimatedFeeMinor: processor.estimatedFeeMinor,
        estimatedDelivery: processor.estimatedDelivery,
      };
    });
  }, [processor]);

  const insufficientBalance = draft.amountMinor > summary.walletAvailableMinor;

  const syncSelectedBeneficiary = (beneficiary: Beneficiary) => {
    setDraft((prev) => ({
      ...prev,
      beneficiaryId: beneficiary.id,
      beneficiaryName: beneficiary.name,
      beneficiaryEmail: beneficiary.email,
      country: beneficiary.country,
      bank: beneficiary.bank,
      accountNumber: beneficiary.accountNumber,
      accountType: beneficiary.accountType,
      swiftIban: beneficiary.swiftIban,
    }));
  };

  const validateCurrentStep = () => {
    const nextErrors: Record<string, string> = {};

    if (step === 0) {
      if (createNewBeneficiary) {
        if (!beneficiaryForm.name.trim()) nextErrors.beneficiaryName = 'Nombre del beneficiario es obligatorio.';
        if (!beneficiaryForm.email.trim().includes('@')) nextErrors.beneficiaryEmail = 'Email válido requerido.';
        if (!beneficiaryForm.bank.trim()) nextErrors.beneficiaryBank = 'Banco requerido.';
        if (!beneficiaryForm.accountNumber.trim()) nextErrors.beneficiaryAccount = 'Cuenta requerida.';
        if (!beneficiaryForm.swiftIban.trim()) nextErrors.beneficiarySwift = 'SWIFT / IBAN requerido.';
      } else if (!draft.beneficiaryId) {
        nextErrors.beneficiaryId = 'Selecciona un beneficiario o crea uno nuevo.';
      }
    }

    if (step === 1) {
      if (!draft.bank.trim()) nextErrors.bank = 'Banco requerido.';
      if (!draft.accountNumber.trim()) nextErrors.accountNumber = 'Número de cuenta requerido.';
      if (!draft.swiftIban.trim()) nextErrors.swiftIban = 'SWIFT / IBAN requerido.';
    }

    if (step === 2) {
      if (!draft.amountMinor || draft.amountMinor <= 0) nextErrors.amountMinor = 'Importe requerido.';
      if (!draft.reference.trim()) nextErrors.reference = 'Referencia requerida.';
      if (!draft.executionDate) nextErrors.executionDate = 'Fecha de ejecución requerida.';
      if (insufficientBalance) nextErrors.wallet = 'Saldo insuficiente para ejecutar este pago.';
    }

    if (step === 4) {
      if (!draft.beneficiaryName || !draft.amountMinor || !draft.reference) {
        nextErrors.review = 'Completa la información obligatoria antes de guardar.';
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const nextStep = () => {
    if (!validateCurrentStep()) return;
    setStep((prev) => Math.min(steps.length - 1, prev + 1));
  };

  const previousStep = () => setStep((prev) => Math.max(0, prev - 1));

  const createBeneficiaryAndContinue = () => {
    if (!validateCurrentStep()) return;
    if (!canCreateBeneficiary) {
      setActionError('Tu perfil no tiene permiso para crear beneficiarios.');
      return;
    }
    try {
      const created = addBeneficiary(beneficiaryForm, actor);
      syncSelectedBeneficiary(created);
      setCreateNewBeneficiary(false);
      setSuccessNotice('Beneficiario creado y seleccionado para este pago.');
      setActionError('');
      setErrors({});
      setStep(1);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'No pudimos crear el beneficiario.');
    }
  };

  const startBeneficiaryEdit = (beneficiary: Beneficiary) => {
    if (!canEditBeneficiary) return;
    setBeneficiaryForm({
      name: beneficiary.name,
      email: beneficiary.email,
      country: beneficiary.country,
      bank: beneficiary.bank,
      accountNumber: beneficiary.accountNumber,
      accountType: beneficiary.accountType,
      swiftIban: beneficiary.swiftIban,
    });
    setEditingBeneficiaryId(beneficiary.id);
    setCreateNewBeneficiary(true);
    setErrors({});
    setActionError('');
    setSuccessNotice('');
  };

  const resetBeneficiaryEditor = () => {
    setEditingBeneficiaryId('');
    setBeneficiaryForm({
      name: '',
      email: '',
      country: 'Estados Unidos',
      bank: '',
      accountNumber: '',
      accountType: 'Checking',
      swiftIban: '',
    });
  };

  const saveBeneficiaryChanges = () => {
    if (!validateCurrentStep()) return;
    if (!editingBeneficiaryId) {
      createBeneficiaryAndContinue();
      return;
    }
    if (!canEditBeneficiary) {
      setActionError('Tu perfil no tiene permiso para editar beneficiarios.');
      return;
    }
    try {
      const updated = editBeneficiary(editingBeneficiaryId, beneficiaryForm, actor);
      syncSelectedBeneficiary(updated);
      setCreateNewBeneficiary(false);
      resetBeneficiaryEditor();
      setSuccessNotice('Beneficiario actualizado correctamente.');
      setActionError('');
      setErrors({});
      setStep(1);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'No pudimos actualizar el beneficiario.');
    }
  };

  const removeExistingBeneficiary = (beneficiary: Beneficiary) => {
    if (!canDeleteBeneficiary) {
      setActionError('Tu perfil no tiene permiso para eliminar beneficiarios.');
      return;
    }
    try {
      removeBeneficiary(beneficiary.id, actor);
      if (draft.beneficiaryId === beneficiary.id) {
        setDraft((prev) => ({
          ...prev,
          beneficiaryId: '',
          beneficiaryName: '',
          beneficiaryEmail: '',
          country: '',
          bank: '',
          accountNumber: '',
          accountType: 'Checking',
          swiftIban: '',
        }));
      }
      if (editingBeneficiaryId === beneficiary.id) {
        resetBeneficiaryEditor();
        setCreateNewBeneficiary(false);
      }
      setSuccessNotice('Beneficiario eliminado correctamente.');
      setActionError('');
      setErrors({});
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'No pudimos eliminar el beneficiario.');
    }
  };

  const persistPayment = (mode: 'draft' | 'approval') => {
    if (isPersisting) return;
    if (!validateCurrentStep()) return;
    if (mode === 'draft' && !(isEditing ? canUpdatePayment : canCreatePayment)) {
      setActionError(
        isEditing
          ? 'Tu perfil no tiene permiso para editar este pago.'
          : 'Tu perfil no tiene permiso para crear pagos.'
      );
      return;
    }
    if (mode === 'approval' && !canSubmitPayment) {
      setActionError('Tu perfil no tiene permiso para enviar pagos a aprobación.');
      return;
    }
    try {
      setIsPersisting(true);
      const result =
        mode === 'draft'
          ? saveDraft(draft, actor, paymentId || undefined)
          : submitForApproval(draft, actor, paymentId || undefined);
      setActionError('');
      router.push(paymentDetailsHref(result.id));
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'No pudimos guardar este pago.');
    } finally {
      setIsPersisting(false);
    }
  };

  const uploadAttachments = (files: FileList | null) => {
    if (!files?.length) return;
    const nextAttachments: PaymentAttachment[] = Array.from(files).map((file) => ({
      id: `${file.name}-${Date.now()}`,
      name: file.name,
      mimeType: file.type,
      sizeLabel: `${Math.max(1, Math.round(file.size / 1024))} KB`,
      uploadedAt: new Date().toISOString(),
    }));
    setDraft((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...nextAttachments],
    }));
  };

  if (isEditing && !existingPayment) {
    return (
      <div className="lg:flex h-full min-h-0 overflow-hidden animate-enter-step">
        <Navbar />
        <div className="w-full min-w-0 min-h-0 flex flex-col">
          <Header />
          <div className="flex-1 min-h-0 overflow-y-auto bg-surface p-6">
            <SurfaceCard className="mx-auto max-w-3xl p-8 text-center">
              <h1 className="text-2xl font-bold text-foreground">Pago no encontrado</h1>
              <p className="mt-3 text-sm text-muted-foreground">
                El pago que intentas editar no existe en el workspace actual.
              </p>
              <Link
                href="/payments"
                className="mt-6 inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground"
              >
                <ArrowLeft size={16} />
                Volver a pagos
              </Link>
            </SurfaceCard>
          </div>
        </div>
      </div>
    );
  }

  if (!canAccessPage) {
    return (
      <div className="lg:flex h-full min-h-0 overflow-hidden animate-enter-step">
        <Navbar />
        <div className="w-full min-w-0 min-h-0 flex flex-col">
          <Header />
          <div className="flex-1 min-h-0 overflow-y-auto bg-surface p-6">
            <SurfaceCard className="mx-auto max-w-3xl p-8 text-center">
              <ShieldAlert className="mx-auto mb-4 text-amber-600" size={28} />
              <h1 className="text-2xl font-bold text-foreground">Acceso restringido para este perfil</h1>
              <p className="mt-3 text-sm text-muted-foreground">
                {isEditing
                  ? 'Tu perfil no tiene permiso para editar pagos a terceros en este flujo.'
                  : 'Tu perfil no tiene permiso para crear pagos a terceros en este flujo.'}
              </p>
              <Link
                href="/payments"
                className="mt-6 inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground"
              >
                <ArrowLeft size={16} />
                Volver a pagos
              </Link>
            </SurfaceCard>
          </div>
        </div>
      </div>
    );
  }

  if (isEditing && existingPayment && !canEdit) {
    return (
      <div className="lg:flex h-full min-h-0 overflow-hidden animate-enter-step">
        <Navbar />
        <div className="w-full min-w-0 min-h-0 flex flex-col">
          <Header />
          <div className="flex-1 min-h-0 overflow-y-auto bg-surface p-6">
            <SurfaceCard className="mx-auto max-w-3xl p-8">
              <h1 className="text-2xl font-bold text-foreground">Este pago no puede editarse</h1>
              <p className="mt-3 text-sm text-muted-foreground">
                Solo el creador con permiso de actualización puede editar pagos en borrador o rechazados.
              </p>
              <Link
                href={paymentDetailsHref(existingPayment.id)}
                className="mt-6 inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground"
              >
                <ArrowLeft size={16} />
                Ver detalle del pago
              </Link>
            </SurfaceCard>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:flex h-full min-h-0 overflow-hidden animate-enter-step">
      <Navbar />
      <div className="w-full min-w-0 min-h-0 flex flex-col">
        <Header />
        <div className="flex-1 min-h-0 overflow-y-auto bg-surface p-6">
          <div className="mx-auto flex max-w-7xl flex-col gap-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <Link
                  href={isEditing ? paymentDetailsHref(paymentId) : '/payments'}
                  className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft size={16} />
                  {isEditing ? 'Volver al detalle' : 'Volver a pagos'}
                </Link>
                <h1 className="text-2xl font-bold text-foreground">
                  {isEditing ? 'Editar pago' : 'Crear pago'}
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Flujo corporativo de pago a terceros con revisión de creador y revisor, y trazabilidad auditable.
                </p>
              </div>
              <div className="rounded-xl border border-border bg-white px-4 py-3 text-right">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Saldo disponible
                </p>
                <p className="mt-1 text-xl font-bold text-foreground">
                  {money(summary.walletAvailableMinor, 'USD')}
                </p>
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)_340px]">
              <SurfaceCard className="p-4">
                <div className="space-y-3">
                  {steps.map((label, index) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => setStep(index)}
                      className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
                        index === step
                          ? 'border-accent bg-accent/5 text-accent'
                          : index < step
                            ? 'border-border bg-surface-muted/40 text-foreground'
                            : 'border-border text-muted-foreground'
                      }`}
                    >
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                          index < step ? 'bg-green-100 text-green-700' : index === step ? 'bg-accent text-white' : 'bg-surface-muted'
                        }`}
                      >
                        {index < step ? <Check size={14} /> : index + 1}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{label}</p>
                        <p className="text-xs text-muted-foreground">
                          Paso {index + 1} de {steps.length}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </SurfaceCard>

              <SurfaceCard className="p-6">
                {actionError ? (
                  <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {actionError}
                  </div>
                ) : null}
                {successNotice ? (
                  <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                    {successNotice}
                  </div>
                ) : null}

                {step === 0 ? (
                  <div className="space-y-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <h2 className="text-lg font-semibold text-foreground">Paso 1. Beneficiario</h2>
                        <p className="text-sm text-muted-foreground">
                          Selecciona un beneficiario existente o crea uno nuevo.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setCreateNewBeneficiary((prev) => !prev);
                          if (createNewBeneficiary) {
                            resetBeneficiaryEditor();
                          }
                        }}
                        disabled={!canCreateBeneficiary && !canEditBeneficiary}
                        className="shrink-0 self-start rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {createNewBeneficiary ? 'Usar existente' : 'Crear beneficiario'}
                      </button>
                    </div>

                    {!beneficiaries.length && !createNewBeneficiary ? (
                      <SurfaceCard className="border-dashed p-6 text-center">
                        <p className="text-lg font-semibold text-foreground">No hay beneficiarios creados</p>
                        <p className="mt-2 text-sm text-muted-foreground">
                          Crea un beneficiario para continuar con el flujo.
                        </p>
                        <button
                          type="button"
                          onClick={() => setCreateNewBeneficiary(true)}
                          disabled={!canCreateBeneficiary && !canEditBeneficiary}
                          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <Plus size={16} />
                          Crear beneficiario
                        </button>
                      </SurfaceCard>
                    ) : null}

                    {createNewBeneficiary ? (
                      <div className="grid gap-4 md:grid-cols-2">
                        <Input label="Nombre del beneficiario" value={beneficiaryForm.name} onChange={(value) => setBeneficiaryForm((prev) => ({ ...prev, name: value }))} error={errors.beneficiaryName} />
                        <Input label="Correo del beneficiario" value={beneficiaryForm.email} onChange={(value) => setBeneficiaryForm((prev) => ({ ...prev, email: value }))} error={errors.beneficiaryEmail} />
                        <Input label="País" value={beneficiaryForm.country} onChange={(value) => setBeneficiaryForm((prev) => ({ ...prev, country: value }))} />
                        <Input label="Banco" value={beneficiaryForm.bank} onChange={(value) => setBeneficiaryForm((prev) => ({ ...prev, bank: value }))} error={errors.beneficiaryBank} />
                        <Input label="Número de cuenta" value={beneficiaryForm.accountNumber} onChange={(value) => setBeneficiaryForm((prev) => ({ ...prev, accountNumber: value }))} error={errors.beneficiaryAccount} />
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-foreground">Tipo de cuenta</label>
                          <CustomSelect
                            value={beneficiaryForm.accountType}
                            onChange={(value) => setBeneficiaryForm((prev) => ({ ...prev, accountType: value as Beneficiary['accountType'] }))}
                            options={[
                              { value: 'Checking', label: 'Corriente' },
                              { value: 'Savings', label: 'Ahorro' },
                            ]}
                            className="rounded-lg"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Input label="SWIFT / IBAN" value={beneficiaryForm.swiftIban} onChange={(value) => setBeneficiaryForm((prev) => ({ ...prev, swiftIban: value }))} error={errors.beneficiarySwift} />
                        </div>
                        <div className="md:col-span-2">
                          <button
                            type="button"
                            onClick={saveBeneficiaryChanges}
                            disabled={editingBeneficiaryId ? !canEditBeneficiary : !canCreateBeneficiary}
                            className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            <Plus size={16} />
                            {editingBeneficiaryId ? 'Guardar cambios y continuar' : 'Crear beneficiario y continuar'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid gap-4">
                        {beneficiaries.map((beneficiary) => (
                          <div
                            key={beneficiary.id}
                            className={`rounded-2xl border p-4 text-left transition-colors ${
                              draft.beneficiaryId === beneficiary.id
                                ? 'border-accent bg-accent/5'
                                : 'border-border hover:bg-surface-muted/30'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="min-w-0">
                                <p className="font-semibold text-foreground">{beneficiary.name}</p>
                                <p className="break-all text-sm text-muted-foreground">{beneficiary.email}</p>
                              </div>
                              {draft.beneficiaryId === beneficiary.id ? (
                                <span className="shrink-0 rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
                                  Seleccionado
                                </span>
                              ) : null}
                            </div>
                            <div className="mt-4 grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
                              <span>{beneficiary.bank}</span>
                              <span>{beneficiary.country}</span>
                              <span>****{beneficiary.accountNumber.slice(-4)}</span>
                              <span>{beneficiary.swiftIban}</span>
                            </div>
                            <div className="mt-4 flex flex-wrap gap-2">
                              <button
                                type="button"
                                onClick={() => syncSelectedBeneficiary(beneficiary)}
                                className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground"
                              >
                                Usar
                              </button>
                              {canEditBeneficiary ? (
                                <button
                                  type="button"
                                  onClick={() => startBeneficiaryEdit(beneficiary)}
                                  className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground"
                                >
                                  <Pencil size={12} />
                                  Editar
                                </button>
                              ) : null}
                              {canDeleteBeneficiary ? (
                                <button
                                  type="button"
                                  onClick={() => removeExistingBeneficiary(beneficiary)}
                                  className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-danger"
                                >
                                  <Trash2 size={12} />
                                  Eliminar
                                </button>
                              ) : null}
                            </div>
                          </div>
                        ))}
                        {errors.beneficiaryId ? (
                          <p className="text-sm text-danger">{errors.beneficiaryId}</p>
                        ) : null}
                      </div>
                    )}
                  </div>
                ) : null}

                {step === 1 ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    <HeaderBlock title="Paso 2. Datos bancarios" description="Confirma la cuenta destino y el identificador bancario." />
                    <Input label="Banco" value={draft.bank} onChange={(value) => setDraft((prev) => ({ ...prev, bank: value }))} error={errors.bank} />
                    <Input label="Número de cuenta" value={draft.accountNumber} onChange={(value) => setDraft((prev) => ({ ...prev, accountNumber: value }))} error={errors.accountNumber} />
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">Tipo de cuenta</label>
                      <CustomSelect
                        value={draft.accountType}
                        onChange={(value) => setDraft((prev) => ({ ...prev, accountType: value as PaymentDraftInput['accountType'] }))}
                        options={[
                          { value: 'Checking', label: 'Corriente' },
                          { value: 'Savings', label: 'Ahorro' },
                        ]}
                        className="rounded-lg"
                      />
                    </div>
                    <Input label="SWIFT / IBAN" value={draft.swiftIban} onChange={(value) => setDraft((prev) => ({ ...prev, swiftIban: value }))} error={errors.swiftIban} />
                  </div>
                ) : null}

                {step === 2 ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    <HeaderBlock title="Paso 3. Detalles del pago" description="Define importe, moneda, referencia y fecha de ejecución." />
                    <Input
                      label="Importe"
                      value={draft.amountMinor ? String(draft.amountMinor / 100) : ''}
                      onChange={(value) =>
                        setDraft((prev) => ({
                          ...prev,
                          amountMinor: Math.round(Number(value || 0) * 100),
                        }))
                      }
                      type="number"
                      error={errors.amountMinor}
                    />
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-foreground">Moneda</label>
                      <CustomSelect
                        value={draft.currency}
                        onChange={(value) => setDraft((prev) => ({ ...prev, currency: value as PaymentDraftInput['currency'] }))}
                        options={['USD', 'EUR']}
                        className="rounded-lg"
                      />
                    </div>
                    <Input label="Descripción" value={draft.description} onChange={(value) => setDraft((prev) => ({ ...prev, description: value }))} />
                    <Input label="Referencia" value={draft.reference} onChange={(value) => setDraft((prev) => ({ ...prev, reference: value }))} error={errors.reference} />
                    <Input label="Número de factura" value={draft.invoiceNumber} onChange={(value) => setDraft((prev) => ({ ...prev, invoiceNumber: value }))} />
                    <Input label="Fecha de ejecución" value={draft.executionDate} onChange={(value) => setDraft((prev) => ({ ...prev, executionDate: value }))} type="date" error={errors.executionDate} />
                    <div className="md:col-span-2 rounded-xl border border-border bg-surface-muted/40 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Saldo disponible</p>
                      <p className="mt-2 text-2xl font-bold text-foreground">{money(summary.walletAvailableMinor, 'USD')}</p>
                      <p className="mt-2 text-sm text-muted-foreground">
                        El pago siempre se ejecuta usando saldo disponible de Antilla.
                      </p>
                      {insufficientBalance || errors.wallet ? (
                        <p className="mt-3 text-sm font-medium text-danger">
                          {errors.wallet || 'Saldo insuficiente para este pago.'}
                        </p>
                      ) : null}
                    </div>
                  </div>
                ) : null}

                {step === 3 ? (
                  <div className="space-y-4">
                    <HeaderBlock
                      title="Paso 4. Adjuntar documentos"
                      description="Adjunta soporte de pago: PDF, PNG o JPG. AntillaPay selecciona internamente la mejor ruta de procesamiento."
                    />
                    <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface-muted/20 px-6 py-10 text-center">
                      <Upload size={24} className="mb-3 text-muted-foreground" />
                      <p className="font-medium text-foreground">Arrastra archivos o haz clic para cargar</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {canAttachDocuments ? 'Acepta PDF, PNG y JPG' : 'Tu rol no puede adjuntar documentos'}
                      </p>
                      <input
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg"
                        multiple
                        className="hidden"
                        disabled={!canAttachDocuments}
                        onChange={(event) => uploadAttachments(event.target.files)}
                      />
                    </label>

                    {draft.attachments.length ? (
                      <div className="space-y-3">
                        {draft.attachments.map((attachment) => (
                          <div
                            key={attachment.id}
                            className="flex items-center justify-between rounded-xl border border-border px-4 py-3"
                          >
                            <div className="flex items-center gap-3">
                              <div className="rounded-lg bg-surface-muted p-2 text-muted-foreground">
                                <FileText size={16} />
                              </div>
                              <div>
                                <p className="font-medium text-foreground">{attachment.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {attachment.mimeType} · {attachment.sizeLabel}
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                canAttachDocuments &&
                                setDraft((prev) => ({
                                  ...prev,
                                  attachments: prev.attachments.filter((item) => item.id !== attachment.id),
                                }))
                              }
                              disabled={!canAttachDocuments}
                              className="text-sm font-medium text-danger disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              Quitar
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <SurfaceCard className="border-dashed p-6 text-center">
                        <p className="font-semibold text-foreground">Aún no hay adjuntos</p>
                        <p className="mt-2 text-sm text-muted-foreground">
                          Puedes continuar sin adjuntos, pero el revisor verá este pago como de mayor riesgo.
                        </p>
                      </SurfaceCard>
                    )}
                  </div>
                ) : null}

                {step === 4 ? (
                  <div className="space-y-5">
                    <HeaderBlock title="Paso 5. Revisión" description="Revisa el resumen final antes de guardar o enviar a aprobación." />
                    <div className="space-y-4">
                      <SurfaceCard className="p-5">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Beneficiario</p>
                        <p className="mt-2 text-lg font-semibold text-foreground">{draft.beneficiaryName}</p>
                        <p className="break-all text-sm text-muted-foreground">{draft.beneficiaryEmail}</p>
                        <div className="mt-4 grid gap-2 text-sm text-muted-foreground">
                          <span>{draft.bank}</span>
                          <span>{draft.country}</span>
                          <span>{draft.swiftIban}</span>
                        </div>
                      </SurfaceCard>

                      <SurfaceCard className="p-5">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Resumen del pago</p>
                        <div className="mt-3 space-y-3 text-sm">
                          <SummaryRow label="Importe" value={money(draft.amountMinor, draft.currency)} highlight />
                          <SummaryRow label="Comisión estimada" value={money(draft.estimatedFeeMinor, draft.currency)} />
                          <SummaryRow label="Tiempo estimado" value={draft.estimatedDelivery} />
                          <SummaryRow label="Fecha de ejecución" value={draft.executionDate} />
                          <SummaryRow label="Referencia" value={draft.reference} />
                          <SummaryRow label="Número de factura" value={draft.invoiceNumber || '—'} />
                        </div>
                      </SurfaceCard>
                    </div>

                    {insufficientBalance ? (
                      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        Saldo insuficiente. Reduce el importe o espera nuevos fondos antes de enviar.
                      </div>
                    ) : null}

                    {errors.review ? <p className="text-sm text-danger">{errors.review}</p> : null}
                  </div>
                ) : null}

                <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
                  <button
                    type="button"
                    onClick={previousStep}
                    disabled={step === 0}
                    className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground disabled:opacity-50"
                  >
                    Atrás
                  </button>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => persistPayment('draft')}
                      disabled={isPersisting || (isEditing ? !canUpdatePayment : !canCreatePayment)}
                      className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Save size={16} />
                      Guardar borrador
                    </button>
                    {step < steps.length - 1 ? (
                      <button
                        type="button"
                        onClick={nextStep}
                        className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white"
                      >
                        Continuar
                        <ChevronRight size={16} />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => persistPayment('approval')}
                        disabled={isPersisting || !canSubmitPayment}
                        className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Enviar a aprobación
                        <ChevronRight size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </SurfaceCard>

              <div className="space-y-4">
                <SurfaceCard className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Resumen para aprobación
                  </p>
                  <div className="mt-4 space-y-3 text-sm">
                    <SummaryRow label="Beneficiario" value={draft.beneficiaryName || '—'} />
                    <SummaryRow label="Importe" value={draft.amountMinor ? money(draft.amountMinor, draft.currency) : '—'} />
                    <SummaryRow label="Comisiones" value={money(draft.estimatedFeeMinor, draft.currency)} />
                    <SummaryRow label="Tiempo estimado" value={draft.estimatedDelivery} />
                    <SummaryRow label="Fecha de ejecución" value={draft.executionDate || '—'} />
                    <SummaryRow label="Adjuntos" value={String(draft.attachments.length)} />
                  </div>
                </SurfaceCard>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentCreatePage() {
  return (
    <Suspense fallback={<div className="h-full min-h-0 bg-surface" />}>
      <PaymentCreateContent />
    </Suspense>
  );
}

const HeaderBlock = ({ title, description }: { title: string; description: string }) => (
  <div className="md:col-span-2">
    <h2 className="text-lg font-semibold text-foreground">{title}</h2>
    <p className="mt-1 text-sm text-muted-foreground">{description}</p>
  </div>
);

const Input = ({
  label,
  value,
  onChange,
  error,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: 'text' | 'email' | 'number' | 'date';
}) => (
  <div className="space-y-2">
    <label className="text-sm font-semibold text-foreground">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:ring-2 focus:ring-accent/20"
    />
    {error ? <p className="text-xs text-danger">{error}</p> : null}
  </div>
);

const SummaryRow = ({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) => (
  <div className="flex items-center justify-between gap-3">
    <span className="text-muted-foreground">{label}</span>
    <span className={highlight ? 'text-lg font-bold text-foreground' : 'font-medium text-foreground'}>
      {value}
    </span>
  </div>
);
