'use client';
import { useTranslation } from 'react-i18next';
import { CheckCircle2 } from 'lucide-react';
import { useModalShortcuts } from '@/common/hooks/useModalShortcuts';

interface SubmissionSuccessContentProps {
  onAccept: () => void;
  isOpen: boolean
}

export const SubmissionSuccessContent = ({ onAccept,isOpen }: SubmissionSuccessContentProps) => {
  const { t } = useTranslation();
  useModalShortcuts(
      isOpen,       
      ()=>null,  
      onAccept 
    );
  return (
    <div className="flex flex-col items-center justify-center p-4 md:p-6 text-center animate-in fade-in zoom-in-95 duration-300">
      {/* Icono de Éxito animado */}
      <div className="mb-6 rounded-full bg-green-100 p-3 text-green-600 dark:bg-green-900/30 dark:text-green-500">
        <CheckCircle2 size={48} className="animate-in zoom-in spin-in-12 duration-500" />
      </div>

      {/* Título */}
      <h2 className="mb-2 text-xl font-bold text-foreground">
        {t('profile.submissionSuccessTitle')}
      </h2>

      {/* Descripción (Texto de la imagen) */}
      <p className="mb-8 text-sm text-muted-foreground max-w-xs leading-relaxed">
        {t('profile.submissionSuccessDesc')}
      </p>

      {/* Botón Aceptar */}
      <button
        onClick={onAccept}
        className="w-full bg-accent hover:bg-accent/90 text-white font-medium py-2.5 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-accent/20"
      >
        {t('profile.accept')}
      </button>
    </div>
  );
};