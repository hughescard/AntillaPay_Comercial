'use client';
import { useTranslation } from 'react-i18next';
import { InputCustom } from '@/common/components/ui/InputCustom'; 
import { GroupedOption, User } from '@/common/types/userTypes';
import { sanitizeTextInput } from '@/lib/profileValidations';
import { CATEGORY_GROUPS } from '@/lib/businessCategories';

interface ProductsServicesFormProps {
  data: User;
  onChange: (field: keyof User, value: string) => void;
  errors?: Record<string, string>;
}

export const ProductsServicesForm = ({ data, onChange, errors = {} }: ProductsServicesFormProps) => {
  const { t } = useTranslation();

  

  const handleDescriptionChange = (value: string) => {
    const cleanValue = sanitizeTextInput(value); 
    onChange('description', cleanValue);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Encabezado */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-3">
          {t('profile.productsServicesTitle')}
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {t('profile.productsServicesDesc')}
        </p>
      </div>

      <div className="space-y-6">
        
        {/* Categoría - Select */}
        <div className="space-y-1">
            <InputCustom
                id="category-select"
                type="selectCategory"
                label={`${t('userInfo.fields.category')} *`}
                placeholder={t('userInfo.fields.selectCategory')}
                value={data.category || ''}
                action={(val) => onChange('category', val as string)}
                groupedOptions={CATEGORY_GROUPS as unknown as GroupedOption[]}
                error={errors.category}
                tabIndex={1}
            />
            <p className="text-xs text-muted-foreground mt-1.5 ml-1">
                {t('profile.categoryHelp')}
            </p>
        </div>

        {/* Descripción - Input */}
        <div className="space-y-1">
            <InputCustom
                id="description-input"
                type="textarea"
                label={`${t('userInfo.fields.description')} *`}
                placeholder=""
                value={data.description || ''}
                action={(val) => handleDescriptionChange(val as string)}
                error={errors.description}
                tabIndex={2}
                rows={4}
            />
            <p className="text-xs text-muted-foreground mt-1.5 ml-1">
                {t('profile.descriptionHelp')}
            </p>
        </div>

      </div>
    </div>
  );
};