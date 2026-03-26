'use client';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { ChevronRight, Box, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import { Modal } from '@/common/components/ui/Modal';
import { productStatus } from '@/common/types/filtersTypes';
import { Skeleton } from '@mui/material';
import { CatalogProduct } from '@/app/paymentLink/create/types';


interface ProductHeaderProps {
  product?: CatalogProduct;
  loading?: boolean;
  onEdit: (item:CatalogProduct) => void;
  onDelete: () => void;
  onDeactivate: () => void;
}

export const ProductHeader = ({ product, loading, onEdit,onDelete,onDeactivate }: ProductHeaderProps) => {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 relative">
      {/* Lado Izquierdo: Info Producto */}
      <div className="flex flex-col gap-2">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/products" className="hover:text-accent-hover text-accent transition-colors font-medium">
            {t('productDetails.back')}
          </Link>
          <ChevronRight size={14} />
        </div>

        <div className="flex items-center gap-4 mt-1">
          {/* Icono Producto */}
          {loading ? (
            <Skeleton variant="rounded" width={48} height={48} className="rounded-lg shrink-0" />
          ) : (
            <div className="w-12 h-12 bg-surface border border-border rounded-lg flex items-center justify-center text-muted-foreground shrink-0">
              <Box size={24} />
            </div>
          )}
          
          <div>
            <div className="flex items-center gap-3">
              {loading ? (
                <>
                  <Skeleton variant="text" width={180} height={40} />
                  <Skeleton variant="rounded" width={60} height={24} />
                </>
              ) : (
                <>
                  <h1 className="text-2xl font-bold text-foreground">{product?.name}</h1>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                    product?.status === 'active' 
                      ? 'bg-status-active/10 text-status-active border-status-active/20' 
                      : 'bg-muted-foreground/10 t ext-muted-foreground border-border'
                  }`}>
                    {t(`products.status.${product?.status as productStatus}`)}
                  </span>
                </>
              )}
            </div>
            
            <div className="text-sm text-muted-foreground">
              {loading ? (
                <Skeleton variant="text" width={100} height={20} />
              ) : (
                t('productDetails.prices_count', { count: product?.prices.length || 0 })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Lado Derecho: Acciones */}
      <div className="flex items-center gap-2 self-end md:self-auto">
        {loading ? (
          <>
            <Skeleton variant="rounded" width={100} height={36} />
            <Skeleton variant="rounded" width={36} height={36} />
          </>
        ) : (
          <>
            <button onClick={()=>product && onEdit(product)} className="flex items-center cursor-pointer gap-2 px-3 py-1.5 bg-surface border border-border rounded-md text-sm font-medium hover:bg-surface-muted transition-colors">
               {t('products.actions.edit')}
            </button>
            
            <div className="relative h-fit">
                <button 
                    onClick={() => setIsMenuOpen(true)}
                    className="p-1.5 cursor-pointer bg-surface border border-border rounded-md hover:bg-surface-muted transition-colors text-muted-foreground hover:text-foreground"
                >
                    <MoreHorizontal size={20} />
                </button>

                <Modal 
                    isOpen={isMenuOpen} 
                    onClose={() => setIsMenuOpen(false)}
                    className="absolute w-56 overflow-hidden origin-top-right z-50"
                    style={{ top: '2rem', right: '0.5rem', transform: 'translateY(10px)' }} 
                >
                    <div className="flex flex-col py-1">
                        
                        {product?.status === 'active' ? (
                            <button onClick={() =>{ setIsMenuOpen(false); onDeactivate()}} className="flex cursor-pointer items-center gap-3 px-4 py-2.5 text-sm font-medium text-foreground hover:bg-surface-muted transition-colors w-full text-left">
                                {t('products.actions.deactivate')}
                            </button>
                        ) : (
                            <button onClick={() =>{ setIsMenuOpen(false); onDeactivate()}} className="flex cursor-pointer items-center gap-3 px-4 py-2.5 text-sm font-medium text-foreground hover:bg-surface-muted transition-colors w-full text-left">
                                {t('products.actions.activate')}
                            </button>
                        )}

                        <div className="h-px bg-border mx-2 my-1 opacity-50" />

                        <button onClick={() =>{ setIsMenuOpen(false); onDelete()}} className="flex cursor-pointer items-center gap-3 px-4 py-2.5 text-sm font-medium text-danger hover:bg-danger-surface transition-colors w-full text-left">
                            {t('products.actions.delete')}
                        </button>
                    </div>
                </Modal>
            </div>
          </>
        )}
      </div>
    </div>
  );
};