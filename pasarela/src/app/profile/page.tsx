'use client';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { ProfileSidebar } from './_components/ProfileSidebar';
import { ProfileHeader } from './_components/ProfileHeader';
import { ProfileFooter } from './_components/ProfileFooter';
import { ReviewSection, ReviewField } from './_components/ReviewSection';
import { PrincipalModal } from '@/common/components/ui/PrincipalModal';
import { ExitConfirmationContent } from './_components/ExitConfirmationContent';
import { VERIFICATION_STEPS, REVIEW_STEP, INITIAL_DATA, getCompletedSteps } from '@/lib/profileConstants';
import { validateStep } from '@/lib/profileValidations';
import { CategoryKeys, User } from '@/common/types/userTypes';
import { FiscalDataForm } from '@/app/profile/_components/formSteps/FiscalDataForm';
import { typeBusiness } from '@/common/types/stepsProfileTypes';
import { CompanyDataForm } from './_components/formSteps/CompanyDataForm';
import { RepresentativeDataForm } from './_components/formSteps/RepresentativeDataForm';
import { ProductsServicesForm } from './_components/formSteps/ProductsServicesForm';
import { PublicDataForm } from './_components/formSteps/PublicDataForm';
import { useUser } from './_hooks/useUser';
import { useAuth } from '@/common/context/authContext';
import { SubmissionSuccessContent } from './_components/SubmissionSuccessContent';
import { useRbacSimulation } from '@/common/context';


export default function ProfilePage() {
  const { t } = useTranslation();
  const {putUser,validateUser} = useUser();
  const {client} = useAuth();
  const { hasPermission } = useRbacSimulation();
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>(client ? getCompletedSteps(client) : []); 
  const [formData, setFormData] = useState<User>(client ? client : INITIAL_DATA);
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const [isSubmissionSuccessOpen, setIsSubmissionSuccessOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const canManageAccountConfiguration = hasPermission('manage_account_configuration');
  const canSubmitAccountVerification = hasPermission('submit_account_verification');
  const isReadOnlyProfile = !canManageAccountConfiguration;



  const updateFormData = (field: keyof User, value: string | boolean) => {
    if (isReadOnlyProfile) return;
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const markStepAsCompleted = useCallback((stepId: number) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps(prev => [...prev, stepId]);
    }
  },[completedSteps]);

  useEffect(() => {
    if(!client || !client.id){
        router.push('/signin');
        return;
    }
  }, [client, router]);

  

  const handleNext = useCallback(async () => {
    if (currentStep === REVIEW_STEP.id && !canSubmitAccountVerification) {
      setErrors({general: 'Tu perfil no tiene permiso para enviar esta configuración a validación.'});
      return;
    }

    if (currentStep !== REVIEW_STEP.id && !canManageAccountConfiguration) {
      setErrors({general: 'Tu perfil solo tiene acceso de lectura a esta configuración.'});
      return;
    }
    
    const handleResponse = (response: {success: boolean; error?: string}) => {
      if(response.success == false){
          setErrors({general: t('profile.saveError')});
          return;
      }
      if (currentStep === VERIFICATION_STEPS.length) {
          setCurrentStep(REVIEW_STEP.id);
      } else {
          setCurrentStep(prev => prev + 1);
      }
      markStepAsCompleted(currentStep);
      setErrors({});
    }

    if(currentStep === REVIEW_STEP.id){
        setLoading(true);
        const response = await validateUser();
        setLoading(false);
        console.log(response)
        handleResponse(response);
        if(response.success){
          setIsSubmissionSuccessOpen(true);
        }
        return;
    };

    const isValid = validateStep(currentStep, formData, t);
    
    if (!isValid.validation){
        setErrors(isValid.errors as Record<string, string>);
        return;
    }
    setErrors({});
    
    if(!client || !client.id){
        router.push('/signin');
        return;
    }

    switch(currentStep){
        case 1:{
          const stepData = {
            documentationId: formData.documentationId,
            name: formData.name,                   
            businessType: formData.businessType  
          };
          setLoading(true);
          const response = await putUser({data:stepData,step:currentStep});
          setLoading(false);
          handleResponse(response);
          break;
        }
        case 2:{
          const stepData = {
            commercialName: formData.commercialName,   
            country: formData.country,
            state: formData.state,           
            city: formData.city,           
            address: formData.address,
            postalCode: formData.postalCode,
            website: formData.website
          };
          setLoading(true);
          const response = await putUser({data:stepData, step:currentStep});
          setLoading(false);
          handleResponse(response);
          break;
        }
        case 3:{
          const stepData = {
            representativeName: formData.representativeName,
            representativeEmail: formData.representativeEmail,
            representativePhone: formData.representativePhone,
            representativeBirthDate: formData.representativeBirthDate,
            representativeCountry: formData.representativeCountry,
            representativeState: formData.representativeState,
            representativeCity: formData.representativeCity,
            representativeAddress: formData.representativeAddress,
            representativePostalCode: formData.representativePostalCode
          };
          setLoading(true);
          const response = await putUser({data:stepData,step:currentStep});
          setLoading(false);
          handleResponse(response);
          break;
        }
        case 4:{
          const stepData = {
            category: formData.category,
            description: formData.description 
          };
          setLoading(true);
          const response = await putUser({data:stepData,step:currentStep});
          setLoading(false);
          handleResponse(response);
          break;
        }
        case 5:{
          const stepData = {
            supportPhone: formData.supportPhone,
            supportEmail: formData.supportEmail,
            supportCountry: formData.supportCountry,
            supportState: formData.supportState,
            supportCity: formData.supportCity,
            supportAddress: formData.supportAddress,
            supportPostalCode: formData.supportPostalCode,
            showSupportPhone: formData.showSupportPhone ? formData.showSupportPhone : false
          };
          setLoading(true);
          const response = await putUser({data:stepData, step:currentStep});
          setLoading(false);
          handleResponse(response);
          break;
        }
    }
    
  }, [
    canManageAccountConfiguration,
    canSubmitAccountVerification,
    currentStep,
    formData,
    markStepAsCompleted,
    t,
    putUser,
    client,
    router,
    validateUser,
  ]);


  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        const target = event.target as HTMLElement;

        if (
            target.tagName === 'TEXTAREA' || 
            target.tagName === 'BUTTON' ||
            event.defaultPrevented
        ) {
          return;
        }

        event.preventDefault();
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleNext]);

  const handlePrev = () => {
    if (currentStep === REVIEW_STEP.id) {
        setCurrentStep(VERIFICATION_STEPS.length); 
    } else {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    }
  };

  const renderReviewStep = () => (
    <div className="p-6 md:p-12 max-w-4xl mx-auto space-y-6 animate-enter-step">
       <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground">{t('profile.reviewTitle', 'Revisar y enviar')}</h2>
          <p className="text-muted-foreground">{t('profile.reviewDesc', 'Dedica unos minutos a revisar tu información.')}</p>
          <p className="mt-1 text-sm text-danger" role="alert">
            {errors.general}
          </p>
       </div>

     
        
      

       {/* 1. Datos Fiscales */}
    <ReviewSection title="profile.sections.fiscal" onEdit={() => setCurrentStep(1)} editable={canManageAccountConfiguration}>
        <ReviewField 
            label={t('userInfo.fields.legalName')} 
            value={formData.name} 
        />
        
        <ReviewField 
            label={t('userInfo.fields.nit')} 
            value={formData.documentationId} 
        />
        <ReviewField 
            label={t('userInfo.fields.structure')} 
            value={formData.businessType ? t(`profile.structures.${formData.businessType as typeBusiness}`) : ''} 
        />
    </ReviewSection>

    {/* 2. Datos de la Empresa */}
    <ReviewSection title="profile.sections.company" onEdit={() => setCurrentStep(2)} editable={canManageAccountConfiguration}>
        <ReviewField 
            label={t('userInfo.fields.dba')} 
            value={formData.commercialName} 
        />
        <ReviewField 
            label={t('userInfo.fields.country')} 
            value={formData.country} 
        />
        <ReviewField 
            label={t('userInfo.fields.province')} 
            value={formData.state} 
        />
        <ReviewField 
            label={t('userInfo.fields.municipality')} 
            value={formData.city} 
        />
        <ReviewField 
            label={t('userInfo.fields.address')} 
            value={formData.address} 
        />
        <ReviewField 
            label={t('userInfo.fields.postalCode')} 
            value={formData.postalCode} 
        />
        <ReviewField 
            label={t('userInfo.fields.website')} 
            value={formData.website} 
        />
    </ReviewSection>

    {/* 3. Representante */}
    <ReviewSection title="profile.sections.representative" onEdit={() => setCurrentStep(3)} editable={canManageAccountConfiguration}>
        <ReviewField 
            label={t('userInfo.fields.legalName')} 
            value={formData.representativeName} 
        />
        <ReviewField 
            label={t('userInfo.fields.email')} 
            value={formData.representativeEmail} 
        />
        <ReviewField 
            label={t('userInfo.fields.phone')} 
            value={formData.representativePhone} 
        />
        <ReviewField 
            label={t('userInfo.fields.dob')} 
            value={formData.representativeBirthDate} 
        />
        <ReviewField 
            label={t('userInfo.fields.country')} 
            value={formData.representativeCountry} 
        />
        <ReviewField 
            label={t('userInfo.fields.province')} 
            value={formData.representativeState} 
        />
        <ReviewField 
            label={t('userInfo.fields.municipality')} 
            value={formData.representativeCity} 
        />
        <ReviewField 
            label={t('profile.personalAddress')} 
            value={`${formData.representativeAddress || ''} ${formData.representativeCity ? `, ${formData.representativeCity}` : ''}`} 
        />
        <ReviewField 
            label={t('userInfo.fields.postalCode')} 
            value={formData.postalCode} 
        />
    </ReviewSection>

    <ReviewSection title="profile.sections.products" onEdit={() => setCurrentStep(4)} editable={canManageAccountConfiguration}>
        <ReviewField 
            label={t('userInfo.fields.category')} 
            value={formData.category ? t(`categories.${formData.category}` as CategoryKeys) : ''} 
        />
        <ReviewField 
            label={t('userInfo.fields.description')} 
            value={formData.description} 
        />
    </ReviewSection>

    <ReviewSection title="profile.sections.public" onEdit={() => setCurrentStep(5)} editable={canManageAccountConfiguration}>
        <ReviewField 
            label={t('userInfo.fields.supportPhone')} 
            value={formData.supportPhone} 
        />
        <ReviewField 
            label={t('userInfo.fields.supportPhone')} 
            value={formData.supportPhone} 
        />
        <ReviewField 
            label={t('userInfo.fields.country')} 
            value={formData.supportCountry} 
        />
        <ReviewField 
            label={t('userInfo.fields.province')} 
            value={formData.supportState} 
        />
        <ReviewField 
            label={t('userInfo.fields.municipality')} 
            value={formData.supportCity} 
        />
        <ReviewField 
            label={t('userInfo.fields.supportAddressTitle')} 
            value={`${formData.supportAddress || ''}, ${formData.supportCity || ''}, ${formData.supportState || ''}`} 
        />
        <ReviewField 
            label={t('userInfo.fields.postalCode')} 
            value={formData.supportPostalCode} 
        />
        <ReviewField 
            label={t('profile.showPhoneLabel')} 
            value={formData.showPhone ? t('common.yes') : t('common.no')} 
        />
    </ReviewSection>

    </div>
  );

  const renderCurrentContent = () => {
    if (currentStep === REVIEW_STEP.id) return renderReviewStep();
    
    switch (currentStep) {
        case 1:
            return (
            <div 
              key={currentStep} 
              className="p-6 md:p-12 animate-enter-step" 
            >
              <div className="p-6 md:p-12 max-w-2xl mx-auto space-y-6">
                  <FiscalDataForm errors={errors} data={formData} onChange={updateFormData} />
                  {errors.general &&  
                  <p className="mt-1 text-sm text-danger" role="alert">
                    {errors.general}
                  </p>
                  }
              </div>
            </div>)
        case 2: 
          return(
          <div 
            key={currentStep} 
            className="p-6 md:p-12 animate-enter-step" 
          >
              <div className="p-6 md:p-12 max-w-2xl mx-auto space-y-6">
                <CompanyDataForm errors={errors} data={formData} onChange={updateFormData} />
                 {errors.general &&  
                  <p className="mt-1 text-sm text-danger" role="alert">
                    {errors.general}
                  </p>
                  }
              </div>
          </div>)
        case 3: 
          return(
          <div 
            key={currentStep} 
            className="p-6 md:p-12 animate-enter-step" 
          >
            <div className="p-6 md:p-12 max-w-2xl mx-auto space-y-6">
              <RepresentativeDataForm errors={errors} data={formData} onChange={updateFormData} />
               {errors.general &&  
                  <p className="mt-1 text-sm text-danger" role="alert">
                    {errors.general}
                  </p>
                  }
            </div>
          </div>
          )
        case 4: 
          return(
          <div 
            key={currentStep} 
            className="p-6 md:p-12 animate-enter-step" 
          >
            <div className="p-6 md:p-12 max-w-2xl mx-auto space-y-6">
              <ProductsServicesForm errors={errors} data={formData} onChange={updateFormData} />
               {errors.general &&  
                  <p className="mt-1 text-sm text-danger" role="alert">
                    {errors.general}
                  </p>
                  }
            </div>
          </div>)
        case 5: 
          return(
          <div 
            key={currentStep} 
            className="p-6 md:p-12 animate-enter-step" 
          >
            <div className="p-6 md:p-12 max-w-2xl mx-auto space-y-6">
              <PublicDataForm errors={errors} data={formData} onChange={updateFormData} />
               {errors.general &&  
                  <p className="mt-1 text-sm text-danger" role="alert">
                    {errors.general}
                  </p>
                  }
            </div>
          </div>
          )
      default: return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-background flex flex-col lg:flex-row animate-enter-step">
      <ProfileSidebar 
        currentStep={currentStep} 
        completedSteps={completedSteps}
        onStepClick={setCurrentStep} 
      />

      <div className="flex-1 flex flex-col h-full lg:ml-72 relative z-0">
        <ProfileHeader 
          currentStep={currentStep}
          onClose={() => setIsExitModalOpen(true)}
          onPrev={handlePrev}
          onNext={handleNext}
        />

        <main className="flex-1 overflow-y-auto bg-background relative w-full">
           <div className="min-h-full bg-surface">
              {isReadOnlyProfile ? (
                <div className="border-b border-border bg-amber-50 px-6 py-3 text-sm text-amber-800">
                  Esta sección está en modo solo lectura para el rol actual.
                </div>
              ) : null}
              {renderCurrentContent()}
           </div>
        </main>

        <ProfileFooter 
          currentStep={currentStep}
          isLastStep={currentStep === REVIEW_STEP.id}
          onNext={handleNext}
          loading={loading}
          disabled={currentStep === REVIEW_STEP.id ? !canSubmitAccountVerification : !canManageAccountConfiguration}
        />
      </div>

      <PrincipalModal isOpen={isSubmissionSuccessOpen} onClose={() => setIsSubmissionSuccessOpen(false)}>
        <SubmissionSuccessContent isOpen={isSubmissionSuccessOpen} onAccept={() => router.push('/')} />
      </PrincipalModal>
      
      <PrincipalModal isOpen={isExitModalOpen} onClose={() => setIsExitModalOpen(false)}>
        <ExitConfirmationContent isOpen={isExitModalOpen} onCancel={() => setIsExitModalOpen(false)} onConfirm={() => router.push('/')} />
      </PrincipalModal>
    </div>
  );
}
