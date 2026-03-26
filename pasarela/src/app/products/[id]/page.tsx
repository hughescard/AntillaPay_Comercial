/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { Navbar } from '@/common/components/ui/Navbar';
import { Header } from '@/common/components/layout/Header';
import { ProductHeader } from './_components/ProductHeader'; 
import { PricesTable } from './_components/PricesTable'; 
import { ProductInfoSidebar } from './_components/ProductInfoSidebar'; 
import { useEffect, useState } from 'react';
import { useProducts } from '../_hooks/useProducts';
import { useParams } from 'next/navigation';
import { CatalogProduct, CatalogProductCreate, currency, Price } from '@/app/paymentLink/create/types';
import { ProductDrawer } from '@/app/paymentLink/create/components/product/ProductDrawer';
import { useCreateProduct } from '@/app/paymentLink/create/hooks/useCreateProduct';
import { useUpdateProduct } from '@/app/paymentLink/create/hooks/useUpdateProduct';
import { getPreviewTotals, majorUnitsToMinor, toMoneyInputValue } from '@/app/paymentLink/create/components/product/utils';
import { useTranslation } from 'react-i18next';
import { PrincipalModal } from '@/common/components/ui/PrincipalModal';
import { ConfirmModals } from '../_components/ConfirmModals';
import { useRouter } from 'next/navigation';


export default function ProductDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const {getProductById} = useProducts();
  const {t} = useTranslation();
  const router = useRouter();

  const [loading,setLoading] = useState(false);
  const [data,setData] = useState<CatalogProduct>();
  const [refresh, setRefresh] = useState(false);
  const [statusChangeModal,setStatusChangeModal] = useState(false);
  const [deleteProductModal,setDeleteProductModal] = useState(false);


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

  useEffect(()=>{
    const fetchProduct = async ()=>{
      setLoading(true);
      const response = await getProductById({id});
      if(response.success){
        setData(response.data);
      }else{
        router.push('/products');
      }
      setLoading(false);
    }
  
    fetchProduct();

  },[refresh])

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
      product.prices?.find((item) => item.currency === currentCurrency)
        ?.value || 0;
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

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    resetDraft();
  };
  
  const handleSubmitProduct = async () => {
    if (isSubmittingProduct) return;
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
        handleCloseDrawer();
        setRefresh(!refresh);
        return;
      }
      await createProduct(payload);
      handleCloseDrawer();
      setRefresh(!refresh);
    } catch {
      return;
    }
  };

  return (
    <div className='lg:flex h-full min-h-0 overflow-hidden animate-enter-step'>
        <Navbar/>
        <div className='w-full min-w-0 min-h-0 flex flex-col'>
            <Header/>
            <div className="flex-1 min-h-0 overflow-y-auto bg-surface p-6">
                <div className="mx-auto">
                    
                    {/* Componente Header */}
                    <ProductHeader onDeactivate={()=>setStatusChangeModal(true) } onDelete={()=>setDeleteProductModal(true)} onEdit={(item)=>handleEditSelectedProduct(item)} product={data as CatalogProduct} loading={loading}/>

                    {/* Layout Grid: Izquierda Tabla, Derecha Sidebar */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        
                        {/* Columna Izquierda (Tabla) - Ocupa 2/3 */}
                        <div className="lg:col-span-2 space-y-6">
                            <PricesTable prices={(data as CatalogProduct)?.prices as Price} loading={loading}/>
                        </div>

                        {/* Columna Derecha (Info) - Ocupa 1/3 */}
                        <div className="lg:col-span-1">
                            <ProductInfoSidebar product={data as CatalogProduct} loading={loading} />
                        </div>

                    </div>

                </div>
            </div>
        </div>
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
      <PrincipalModal
        isOpen={statusChangeModal || deleteProductModal}
        onClose={()=>handleCloseModal()}
      >
          <ConfirmModals
            onRefresh={()=>setRefresh(!refresh)}
            deleteProductModal={deleteProductModal}
            product={data as CatalogProduct}
            handleCloseModal={()=>handleCloseModal()}
            isOpen={statusChangeModal || deleteProductModal}
          />
      </PrincipalModal>
    </div>
  );
}
