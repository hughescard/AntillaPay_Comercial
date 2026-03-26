'use client';

import { useTranslation } from 'react-i18next';

interface ClientBasicInfoProps {
  name: string;
  email: string;
  createdAt: string;
  type: 'customer' | 'business';
}

export const ClientBasicInfo = ({ name, email, createdAt, type }: ClientBasicInfoProps) => {
  const { t } = useTranslation();

  return (
    <div className="bg-surface rounded-xl border border-border shadow-sm p-6 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h3 className="text-sm font-bold text-foreground mb-6">
        {t('clientDetails.basic_info.title')}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
        {/* Nombre */}
        <div>
          <span className="block text-[10px] font-bold text-muted-foreground uppercase mb-1 tracking-wider">
            {t('clientDetails.basic_info.name_label')}
          </span>
          <p className="text-sm font-medium text-foreground">{name}</p>
        </div>

        {/* Email */}
        <div>
          <span className="block text-[10px] font-bold text-muted-foreground uppercase mb-1 tracking-wider">
            {t('clientDetails.basic_info.email_label')}
          </span>
          <p className="text-sm font-medium text-foreground">{email}</p>
        </div>

        {/* Creado */}
        <div>
          <span className="block text-[10px] font-bold text-muted-foreground uppercase mb-1 tracking-wider">
            {t('clientDetails.basic_info.created_label')}
          </span>
          <p className="text-sm font-medium text-foreground">{createdAt.split('T')[0]}</p>
        </div>

        {/* Tipo */}
        <div>
          <span className="block text-[10px] font-bold text-muted-foreground uppercase mb-1 tracking-wider">
            {t('clientDetails.basic_info.type_label')}
          </span>
          <p className="text-sm font-medium text-foreground">
            {t(`clients.filters.type_${type}`)}
          </p>
        </div>
      </div>
    </div>
  );
};