'use client';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { productStatus } from '@/common/types/filtersTypes';
import { Skeleton } from '@mui/material';
import { CatalogProduct } from '@/app/paymentLink/create/types';

interface SidebarProps {
  product?: CatalogProduct;
  loading?: boolean;
}

export const ProductInfoSidebar = ({ product, loading = false }: SidebarProps) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!product) return;
    navigator.clipboard.writeText(product.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Tarjeta de Detalles */}
      <div className="bg-surface rounded-xl border border-border p-6 shadow-sm">
        <h3 className="text-lg font-bold text-foreground mb-4">{t('productDetails.details_title')}</h3>
        
        <div className="space-y-4">
            <div>
                <p className="text-xs text-muted-foreground mb-1">{t('productDetails.created_at')}</p>
                {loading ? (
                    <Skeleton variant="text" width={100} height={20} />
                ) : (
                    <p className="text-sm font-medium text-foreground">
                        {product && new Date(product.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                    </p>
                )}
            </div>

            <div>
                <p className="text-xs text-muted-foreground mb-1">{t('products.filters.status')}</p>
                {loading ? (
                    <Skeleton variant="text" width={60} height={20} />
                ) : (
                    <p className="text-sm font-medium text-foreground">
                        {product && t(`products.status.${product.status as productStatus}`)}
                    </p>
                )}
            </div>

            <div>
                <p className="text-xs text-muted-foreground mb-1">{t('productDetails.description')}</p>
                {loading ? (
                    <div className="space-y-1">
                        <Skeleton variant="text" width="100%" height={20} />
                        <Skeleton variant="text" width="80%" height={20} />
                    </div>
                ) : (
                    <p className="text-sm font-medium text-accent hover:underline cursor-pointer">
                        {product?.description}
                    </p>
                )}
            </div>

        </div>
      </div>

      {/* Tarjeta Avanzado (ID) */}
      <div className="bg-surface rounded-xl border border-border p-6 shadow-sm">
        <h3 className="text-base font-bold text-foreground mb-3">{t('productDetails.advanced_title')}</h3>
        
        <p className="text-xs text-muted-foreground mb-2">{t('productDetails.id_label')}</p>
        <div className="flex items-center gap-2 bg-surface-muted/50 border border-border rounded-md px-3 py-2 h-[38px]">
            {loading ? (
                <Skeleton variant="text" width="100%" height={20} />
            ) : (
                <>
                    <p className="text-xs font-mono text-muted-foreground flex-1 truncate select-all">
                        {product?.id}
                    </p>
                    <button 
                        onClick={handleCopy} 
                        disabled={loading}
                        className="text-muted-foreground cursor-pointer hover:text-foreground transition-colors flex items-center gap-1.5 text-xs font-medium disabled:opacity-50"
                    >
                        {copied ? <Check size={14} className="text-green-500"/> : <Copy size={14} />}
                        {copied ? t('productDetails.actions.copied') : t('productDetails.actions.copy')}
                    </button>
                </>
            )}
        </div>
      </div>
    </div>
  );
};