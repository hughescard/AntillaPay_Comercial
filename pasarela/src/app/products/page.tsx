/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Navbar } from '@/common/components/ui/Navbar';
import { Header } from '@/common/components/layout/Header';
import { Skeleton } from '@mui/material';
import { GenericTable } from '@/common/components/ui/GenericTable';
import { Filters } from '@/common/components/ui/Filters';
import { pagination } from '@/common/types/pagination';
import { ProductFilters, productStatus, uiStateProduct } from '@/common/types/filtersTypes';
import { PropsExportProducts, useProducts } from './_hooks/useProducts';
import Link from 'next/link';
import { CatalogProduct, CatalogProductCreate, currency } from '../paymentLink/create/types';
import { getInitials, majorUnitsToMinor, minorUnitsToMajor, resolveProductImageUrl, toMoneyInputValue } from '../paymentLink/create/components/product/utils';
import { PrincipalModal } from '@/common/components/ui/PrincipalModal';
import { ConfirmModals } from './_components/ConfirmModals';
import { useCreateProduct } from '../paymentLink/create/hooks/useCreateProduct';
import { useUpdateProduct } from '../paymentLink/create/hooks/useUpdateProduct';
import { ProductDrawer } from '../paymentLink/create/components/product/ProductDrawer';
import { getPreviewTotals } from '../paymentLink/create/components/product/utils';
import { ExportModal } from '@/common/components/ui/ExportModal';
import Image from 'next/image';
import { useRbacSimulation } from '@/common/context';

const DEFAULT_COLUMNS = [
  { key: 'name', label: 'products.table.col_product', visible: true, order: 0 },
  { key: 'price', label: 'products.table.col_price', visible: true, order: 1 },
  { key: 'status', label: 'products.table.col_status', visible: true, order: 2 },
  { key: 'createdAt', label: 'products.table.col_created', visible: true, order: 3 },
];

const availableColumns = [
  { key: 'name', label: 'products.table.col_name' },
  {key: 'description', label: 'products.table.col_description' },
  { key: 'price', label: 'products.table.col_price' },
  { key: 'status', label: 'products.table.col_status' },
  { key: 'createdAt', label: 'products.table.col_created' },
];

export default function ProductsPage() {
  const { t } = useTranslation();
  const { hasPermission } = useRbacSimulation();
  const canCreateProduct = hasPermission('create_product');
  const canUpdateProduct = hasPermission('update_product');
  const canUpdateProductStatus = hasPermission('update_product_status');
  const canDeleteProduct = hasPermission('delete_product');
  const canExportProducts = hasPermission('export_products');
  const { getProducts,getProductsExport } = useProducts()

  const [data, setData] = useState<CatalogProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<pagination>();
  const [currentPage, setCurrentPage] = useState(1);
  const [columnConfig] = useState(DEFAULT_COLUMNS);
  const [statusChangeModal,setStatusChangeModal] = useState(false);
  const [deleteProductModal,setDeleteProductModal] = useState(false);
  const [selectedProduct,setSelectProduct] = useState<CatalogProduct>();
  const [refresh,setRefresh] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);



  const { createProduct, isLoading: isCreatingProduct } = useCreateProduct();
  const { updateProduct, isLoading: isUpdatingProduct } = useUpdateProduct();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState("");
  const [draftDescription, setDraftDescription] = useState("");
  const [draftImageFile, setDraftImageFile] = useState<File | null>(null);
  const [draftImageUrl, setDraftImageUrl] = useState<string | null>(null);
  const [amountValue, setDraftAmount] = useState("0");
  const [previewQuantity, setPreviewQuantity] = useState(1);
  const [currentCurrency, setCurrentCurrency] = useState<string>('USD');
  const currencyList = currency
  const isSubmittingProduct = isCreatingProduct || isUpdatingProduct;
  const { formattedAmount, formattedSubtotal } = getPreviewTotals(
      amountValue,
      previewQuantity
    );


  const [filters, setFilters] = useState<ProductFilters>({
    kind: 'productFilter',
    search: '',
    dateRange: 'month',
    dateSort: 'desc',
    status: 'active' 
  });

  const prevSearch = useRef(filters.search);


  const [uiState, setUiState] = useState<uiStateProduct>({
    kind: 'productUiState',
    showDate: false,
    showStatus: false, 
  });

  const filteredData = useMemo(() => {
    if (!data || data.length === 0) return [];
    const processed = [...data];
    if (uiState.showDate) {
      processed.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();

        return filters.dateSort === 'asc' ? dateA - dateB : dateB - dateA;
      });
    }
    return processed;
  }, [data, filters.dateSort, uiState.showDate]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      let months = null;
      if(uiState.showDate){
          switch(filters.dateRange){
              case 'month':
                  months = 1;
                  break;
              case 'quarter':
                  months = 3;
                  break;
              case 'semester':
                  months = 6;
                  break;
              case 'year':
                  months = 12;
                  break;
          }
      }
  
      const params = {
          query: filters.search,
          status: uiState.showStatus ? filters.status : null,
          months: months,
          page:currentPage
      }   
      const  response = await getProducts(params);
      if(response.success){
        setData(response.data);
        setPagination(response.pagination);
      }
      
      setLoading(false);
    };
    if(prevSearch.current !== filters.search){
      prevSearch.current = filters.search;
      const timeoutId = setTimeout(async () => fetchProducts(),1000);
      return () => {
        clearTimeout(timeoutId);
      };
    }else{
      fetchProducts();
    }
  }, [filters.dateRange, filters.search, filters.status, uiState, currentPage,refresh]);

  const handleCloseModal =()=>{
    if(statusChangeModal){
      setStatusChangeModal(false);
    }
    if(deleteProductModal){
      setDeleteProductModal(false);
    }
  }

  const handleEditSelectedProduct = (product: CatalogProduct) => {
    const amountValue =
      Number(product.prices?.find((item) => item.currency === currentCurrency)?.value) || 0;
    setEditingProductId(product.id);
    setDrawerOpen(true);
    setShowPreview(true);
    setDraftName(product.name);
    setDraftDescription(product.description ?? "");
    setDraftImageFile(null);
    setDraftImageUrl(product.image ?? null);
    setDraftAmount(toMoneyInputValue(amountValue));
  };

  const resetDraft = () => {
    setDraftName("");
    setDraftDescription("");
    setDraftImageFile(null);
    setDraftImageUrl(null);
    setDraftAmount("0");
    setPreviewQuantity(1);
    setShowPreview(true);
    setEditingProductId(null);
  };

  const handleOpenDrawer = () => {
    if (!canCreateProduct) return;
    setDrawerOpen(true);
    setShowPreview(true);
    setDraftImageFile(null);
    setDraftImageUrl(null);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    resetDraft();
  };
  
  const handleSubmitProduct = async () => {
    if (isSubmittingProduct) return;
    if ((editingProductId && !canUpdateProduct) || (!editingProductId && !canCreateProduct)) {
      return;
    }
    const trimmedName = draftName.trim();
    const name =
      trimmedName ||
      t("paymentLinkCreate.paymentSettings.newProductNameFallback");
    const priceLabel = majorUnitsToMinor(amountValue);
    const payload:CatalogProductCreate = {
      name,
      prices: [{
        value: priceLabel,
        currency: currentCurrency
      }],
      description: draftDescription.trim(),
      imageFile: draftImageFile ?? undefined,
      status:'active'
    };


    try {
      if (editingProductId) {
        await updateProduct(editingProductId, payload);
        setRefresh(!refresh);
        handleCloseDrawer();
        return;
      }
      await createProduct(payload);
      setRefresh(!refresh);
      handleCloseDrawer();
    } catch {
      return;
    }
  };


  const renderCell = (item: CatalogProduct, key: string) => {
    switch(key) {
      case 'name': 
        const imageUrl = resolveProductImageUrl(item.image);
        return (
          <div className="flex items-center gap-3">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={item.name}
                width={36}
                height={36}
                className="rounded-md border border-border object-cover"
                unoptimized
                sizes="36px"
              />

            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-surface-muted text-[10px] font-semibold text-muted-foreground">
                {getInitials(item.name)}
              </div>
            )}
            <span className="font-semibold text-foreground">{item.name}</span>
          </div>
        );
      case 'price':
        if (item.prices.length === 0) {
          return <span className="text-muted-foreground">--</span>;
        }
        if (item.prices.length === 1) {
          return (
            <span className="text-foreground">
              {item.prices[0].currency} {minorUnitsToMajor(item.prices[0].value).toFixed(2)}
            </span>
          );
        }
        return <span className="text-foreground">{item.prices.length} {t('products.prices')}</span>;
      case 'status':
        return (
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
            item.status === 'active' 
              ? 'bg-status-active/10 text-status-active border-status-active/20' 
              : 'bg-muted-foreground/10 text-muted-foreground border-border'
          }`}>
            {t(`products.status.${item.status as productStatus}`)}
          </span>
        );
      case 'createdAt':
        return <span className="text-sm text-foreground">
          {new Date(item.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
        </span>;
      default: return null;
    }
  };

  const renderMenuActions = (item: CatalogProduct, close: () => void) => (
    <>
      <Link href={`/products/${item.id}`} onClick={close} className="flex cursor-pointer items-center gap-3 px-4 py-3 text-sm font-medium text-foreground hover:bg-surface-muted transition-colors w-full text-left">
        {t('products.actions.view')}
      </Link>
      
      {canUpdateProduct ? (
        <button onClick={()=>{handleEditSelectedProduct(item); close();}} className="flex items-center cursor-pointer gap-3 px-4 py-3 text-sm font-medium text-foreground hover:bg-surface-muted transition-colors w-full text-left">
          {t('products.actions.edit')}
        </button>
      ) : null}

      {canUpdateProductStatus && item.status === 'active' ? (
        <button onClick={()=>{setStatusChangeModal(true) ;setSelectProduct(item); close()}} className="flex items-center cursor-pointer gap-3 px-4 py-3 text-sm font-medium text-foreground hover:bg-surface-muted transition-colors w-full text-left">
          {t('products.actions.deactivate')}
        </button>
      ) : canUpdateProductStatus ? (
        <button onClick={()=>{setStatusChangeModal(true) ;setSelectProduct(item); close()}} className="flex items-center cursor-pointer gap-3 px-4 py-3 text-sm font-medium text-foreground hover:bg-surface-muted transition-colors w-full text-left">
          {t('products.actions.activate')}
        </button>
      ) : null}

      {canDeleteProduct ? <div className="h-px bg-border mx-2 my-1 opacity-50" /> : null}

      {canDeleteProduct ? (
      <button onClick={()=>{setDeleteProductModal(true) ;setSelectProduct(item); close()}} 
      className="flex items-center cursor-pointer gap-3 px-4 py-3 text-sm font-medium text-danger hover:bg-danger-surface transition-colors w-full text-left">
        {t('products.actions.delete')}
      </button>
      ) : null}
    </>
  );

  return (
    <div className='lg:flex h-full min-h-0 overflow-hidden animate-enter-step'>
        <Navbar/>
        <div className='min-w-0 flex-1 min-h-0 flex flex-col'>
            <Header/>
            <div className="flex-1 min-h-0 overflow-y-auto bg-surface p-6">
            
                {/* Header: Título y Botón Crear */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <h1 className="text-2xl font-bold text-foreground">{t('products.title')}</h1>
                    <button onClick={()=>handleOpenDrawer()} disabled={!canCreateProduct} className="flex items-center gap-2 px-4 py-2 bg-accent cursor-pointer  hover:bg-accent-hover text-white rounded-lg font-medium shadow-sm transition-colors disabled:cursor-not-allowed disabled:opacity-60">
                        <Plus size={18} />
                        {t('products.create_button')}
                    </button>
                </div>

                {/* Filtros (Usando el componente genérico adaptado) */}
                <Filters
                    filters={filters} 
                    setFilters={(val) => setFilters(val as ProductFilters)} 
                    uiState={uiState} 
                    setUiState={(val) => setUiState(val as uiStateProduct)} 
                />

                {/* Info y Botón Exportar */}
                <div className="flex justify-between items-end mb-3 mt-4">
                    <span className="text-sm text-muted-foreground">
                        {t('products.table.total_showing', { count: filteredData.length })}
                    </span>
                    <div className="flex gap-2">
                        <button  onClick={()=>canExportProducts && setIsExportOpen(true)} disabled={!canExportProducts} className="flex items-center gap-2 px-3 py-1.5 bg-surface border border-border rounded-md text-sm font-medium text-foreground hover:bg-surface-muted cursor-pointer transition-colors disabled:cursor-not-allowed disabled:opacity-60">
                            <Download size={16} /> {t('products.export_button')}
                        </button>
                    </div>
                </div>

                {/* Tabla */}
                {loading ? 
                    <Skeleton animation='wave' width={"100%"} height={150}/>
                :
                (filteredData.length > 0 ?
                    <GenericTable<CatalogProduct>
                        data={filteredData}
                        columns={columnConfig}
                        renderCellContent={renderCell}
                        renderMenuActions={renderMenuActions}
                    />
                : 
                    <p className='w-full text-center py-12 text-muted-foreground bg-surface-muted/10 rounded-lg border border-dashed border-border'>
                        {t('common.resultsNotFound')}
                    </p>
                )
                }

                {/* Paginación */}
                <div className="flex justify-end items-center gap-4 mt-4">
                    <span className="text-sm text-muted-foreground">
                        {t('transactions.table.page_count', { current: currentPage, total: pagination?.pages || 1 })}
                    </span>
                    <div className="flex gap-1">
                        <button 
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} 
                            disabled={currentPage === 1} 
                            className="p-1.5 rounded-md border border-border bg-surface text-foreground hover:bg-surface-muted disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <button 
                            onClick={() => setCurrentPage(Math.min((pagination?.pages || 1), currentPage + 1))} 
                            disabled={currentPage === (pagination?.pages || 1)} 
                            className="p-1.5 rounded-md border border-border bg-surface text-foreground hover:bg-surface-muted disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>

            </div>
        </div>
        <PrincipalModal
          isOpen={statusChangeModal || deleteProductModal}
          onClose={()=>handleCloseModal()}
        >
            <ConfirmModals
              onRefresh={()=>setRefresh(!refresh)}
              deleteProductModal={deleteProductModal}
              product={selectedProduct as CatalogProduct}
              handleCloseModal={()=>handleCloseModal()}
              isOpen={statusChangeModal || deleteProductModal}
            />
        </PrincipalModal>
        <ProductDrawer
          open={drawerOpen}
          showPreview={showPreview}
          onTogglePreview={() => setShowPreview((prev) => !prev)}
          onClose={handleCloseDrawer}
          onCreate={handleSubmitProduct}
          primaryActionLabel={
            editingProductId
              ? t("paymentLinkCreate.paymentSettings.saveChangesButton")
              : t("paymentLinkCreate.paymentSettings.addProductButton")
          }
          isSubmitting={isSubmittingProduct}
          draftName={draftName}
          onDraftNameChange={setDraftName}
          draftDescription={draftDescription}
          onDraftDescriptionChange={setDraftDescription}
          draftImageFile={draftImageFile}
          draftImageUrl={draftImageUrl}
          onDraftImageChange={setDraftImageFile}
          draftAmount={amountValue}
          onDraftAmountChange={setDraftAmount}
          previewQuantity={previewQuantity}
          onPreviewQuantityChange={setPreviewQuantity}
          formattedAmount={formattedAmount}
          formattedSubtotal={formattedSubtotal}
          currencyList={currencyList}
          currentCurrency={currentCurrency}
          onCurrentCurrencyChange={(value) => setCurrentCurrency(value)}
        />
         <ExportModal
            isOpen={isExportOpen} 
            onClose={() => setIsExportOpen(false)} 
            currentColumnConfig={columnConfig}
            filters={filters}
            uiState={uiState as uiStateProduct}
            action={(params)=>getProductsExport(params as PropsExportProducts)}
            availableColumns={availableColumns}
          />
    </div>
  );
}
