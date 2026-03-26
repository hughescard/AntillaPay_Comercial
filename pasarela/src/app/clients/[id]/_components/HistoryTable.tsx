'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, ChevronLeft, ChevronRight } from 'lucide-react';
import { ExportHistoryModal } from './ExportHistoryModal';
import { Operation } from '@/common/types/operation';

interface HistoryTableProps {
  operations: Operation[];
  currentPage: number;
  setCurrentPage:(page:number)=>void;
  totalPages:number;
}

export const HistoryTable = ({ operations, currentPage, setCurrentPage,totalPages }: HistoryTableProps) => {
  const { t } = useTranslation();
  const [isExportOpen, setIsExportOpen] = useState(false);
  
  

  const getStatusBadge = (status: string) => {
    const styles = {
      completed: 'bg-green-100 text-green-700 border-green-200',
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      failed: 'bg-red-100 text-red-700 border-red-200',
    };
    const key = status as keyof typeof styles;
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${styles[key]}`}>
        {t(`clientDetails.history.status_${status as 'Completed' | 'Rejected' | 'Pending'}`)}
      </span>
    );
  };

  return (
    <>
      <div className="bg-surface rounded-xl border border-border shadow-sm p-6 animate-in fade-in slide-in-from-bottom-8 duration-500">
        
        {/* Header Tabla */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-base font-bold text-foreground">
            {t('clientDetails.history.title')}
          </h3>
          
          <button 
            onClick={() => setIsExportOpen(true)}
            className="flex cursor-pointer items-center gap-2 px-3 py-1.5 bg-surface border border-border rounded-md text-xs font-medium text-foreground hover:bg-surface-muted transition-colors"
          >
            <Upload size={14} />
            {t('clientDetails.history.export_button')}
          </button>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="text-muted-foreground border-b border-border">
              <tr>
                <th className="pb-3 font-semibold uppercase tracking-wider">{t('clientDetails.history.col_date')}</th>
                <th className="pb-3 font-semibold uppercase tracking-wider">{t('clientDetails.history.col_amount')}</th>
                <th className="pb-3 font-semibold uppercase tracking-wider">{t('clientDetails.history.col_currency')}</th>
                <th className="pb-3 font-semibold uppercase tracking-wider">{t('clientDetails.history.col_status')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {operations.map((tx) => (
                <tr key={tx.id} className="hover:bg-surface-muted/30 transition-colors">
                  <td className="py-4 text-foreground">{tx.createdAt.split('T')[0]}</td>
                  <td className="py-4 font-bold text-foreground">{(Number(tx.amount)/100).toFixed(2)} {tx.currency}</td>
                  <td className="py-4 text-muted-foreground">{tx.currency}</td>
                  <td className="py-4">{getStatusBadge(tx.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex justify-end items-center gap-4 mt-6 pt-4 border-t border-border">
            <span className="text-xs text-muted-foreground">
               {currentPage} / {totalPages}
            </span>
            <div className="flex gap-1">
              <button 
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-md border border-border bg-surface text-foreground hover:bg-surface-muted disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
              </button>
              <button 
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-md border border-border bg-surface text-foreground hover:bg-surface-muted disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      <ExportHistoryModal 
        isOpen={isExportOpen} 
        onClose={() => setIsExportOpen(false)} 
      />
    </>
  );
};