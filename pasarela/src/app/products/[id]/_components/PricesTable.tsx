'use client';
import { GenericTable } from '@/common/components/ui/GenericTable';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { Skeleton } from '@mui/material';
import { Price } from '@/app/paymentLink/create/types';
import { useMemo } from 'react';

interface ProductPrice {value:number,currency:string}
interface ProductPriceWithId {id:string, value:number,currency:string}


interface PricesTableProps {
  prices?: Price;
  loading:boolean;
}

const PRICE_COLUMNS = [
  { key: 'price', label: 'productDetails.table.col_price', visible: true, order: 0 },
];

export const PricesTable = ({ prices, loading }: PricesTableProps) => {
  const { t } = useTranslation();
  const pricesWithId = useMemo(() => {
    if (!prices) return [];
    
    return prices.map((price, index) => ({
      ...price,
      id: index.toString() 
    }));
  }, [prices]);
 

  const renderCell = (item: ProductPrice, key: string) => {
    switch (key) {
      case 'price':
        return (
          <div className="flex flex-col items-start gap-1">
            <span className="font-bold text-foreground text-base">
              {item.currency} {(item.value/100).toFixed(2)}
            </span>
          </div>
        );
      default: return null;
    }
  };

  const renderActions = (item: ProductPrice, close: () => void) => (
    <>
      <button onClick={close} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-foreground hover:bg-surface-muted transition-colors w-full text-left">
        {t('productDetails.actions.edit_price')}
      </button>
      
      <button onClick={close} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-danger hover:bg-danger-surface transition-colors w-full text-left">
        {t('productDetails.actions.delete_price')}
      </button>
    </>
  );

  return (
    <div className="bg-surface rounded-xl overflow-hidden h-full">
        <div className="flex justify-between items-center p-6">
            {loading ? 
            <>
            <Skeleton animation='wave' height={25} width={70}/>
            <Skeleton hidden animation='wave' height={70} width={45}/>
            </>
            :
            <>
              <h3 className="text-lg font-bold text-foreground">{t('productDetails.prices_title')}</h3>
              <button className="p-2 hidden hover:bg-surface-muted border border-border rounded-md text-muted-foreground cursor-pointer transition-colors">
                <Plus size={20} />
              </button>
            </>
            }
        </div>
        
        { !loading ?
        <div className="p-0 border-none">
            <GenericTable<ProductPriceWithId>
                data={pricesWithId}
                columns={PRICE_COLUMNS}
                renderCellContent={renderCell}
                renderMenuActions={renderActions}
                hideMenu={true}
            />
        </div>
        :
        <Skeleton animation='wave' height={100}/>
        }
    </div>
  );
};