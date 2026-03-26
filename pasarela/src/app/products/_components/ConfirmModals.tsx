import { useUpdateProduct } from "@/app/paymentLink/create/hooks/useUpdateProduct";
import { CatalogProduct } from "@/app/paymentLink/create/types";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next"
import { useProducts } from "../_hooks/useProducts";
import { useState } from "react";
import { useModalShortcuts } from "@/common/hooks/useModalShortcuts";

interface Props{
    deleteProductModal:boolean;
    handleCloseModal:()=>void;
    product:CatalogProduct;
    onRefresh:()=>void;
    isOpen:boolean
}

export const ConfirmModals = ({deleteProductModal, handleCloseModal, product,onRefresh,isOpen}:Props)=>{
    const {t} = useTranslation();
    const [loading,setLoading] = useState(false);
    const {patchStatusProduct} = useUpdateProduct();
    const {deleteProduct} = useProducts()

    const changeStatus = async()=>{
        setLoading(true);
        const data = {
            status:product.status == 'active' ? 'inactive' : 'active',
        }
        await patchStatusProduct({id:product.id,data});
        setLoading(false);
        handleCloseModal();
        onRefresh();
    }

    const handleDelete = async()=>{
        setLoading(true);
        await deleteProduct(product.id);
        setLoading(false);
        handleCloseModal();
        onRefresh();
    }

    const handleEnter=()=>{
        if(deleteProductModal){
            handleDelete();
        }else{
            changeStatus();
        }
    }

    useModalShortcuts(
        isOpen,       
        handleCloseModal,  
        ()=>handleEnter()   
    );

    return(
        <div className="p-6">
            {/* Título */}
            <h3 className="text-xl font-bold text-foreground mb-2">
            {deleteProductModal 
                ? t('products.modals.delete_title') 
                : t('products.modals.change_status_title')
            }
            </h3>

            {/* Descripción / Pregunta */}
            <p className="text-muted-foreground mb-8">
            {deleteProductModal ? (
                t('products.modals.delete_question', { name: product?.name })
            ) : (
                t('products.modals.change_status_question', { 
                status: t(`products.status.${product?.status === 'active' ? 'inactive' : 'active'}`) 
                })
            )}
            </p>

            {/* Botones de Acción */}
            <div className="flex justify-end gap-3">
                <button 
                    onClick={() => handleCloseModal()}
                    className="px-4 py-2 bg-surface cursor-pointer hover:bg-surface-muted border border-border text-foreground rounded-lg text-sm font-medium transition-colors"
                >
                    {t('products.modals.cancel')}
                </button>
                
                <button 
                    onClick={() => {
                        if (deleteProductModal) {
                            handleDelete()
                        } else {
                            changeStatus()
                        }
                    }}
                    className={`px-4 py-2 text-white cursor-pointer rounded-lg text-sm font-medium shadow-sm transition-colors ${
                    deleteProductModal 
                        ? 'bg-danger hover:bg-danger/90' 
                        : 'bg-accent hover:bg-accent-hover' 
                    }`}
                >
                    {loading ?
                    <span className='flex gap-1 items-center'>
                        <Loader2 width={20} height={20} className='animate-spin'/> 
                        {t('common.loading')}
                    </span>
                    :
                    <>
                        {deleteProductModal 
                        ? t('products.modals.delete') 
                        : t('products.modals.confirm')
                        }
                    </>
                    }
                </button>
            </div>
        </div>
    )
}