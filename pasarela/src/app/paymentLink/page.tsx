'use client'
import { useEffect, useMemo, useRef, useState } from "react";
import { Header } from "@/common/components/layout/Header";
import { Navbar } from "@/common/components/ui/Navbar";
import {  Download,Plus, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Filters } from "@/common/components/ui/Filters";
import { GenericTable } from "@/common/components/ui/GenericTable";
import { pagination } from "@/common/types/pagination";
import {
  PaymentLinkFilters,
  uiStatePaymentLink,
} from "@/common/types/filtersTypes";
import { currency } from "./create/types";
import { PaymentLinksExport, usePaymentLinks, type PaymentLinkListItem } from "./hooks/usePaymentLinks";
import { handleCopyLink } from "@/lib/copyLink";
import { ExportModal } from '@/common/components/ui/ExportModal';
import { PrincipalModal } from "@/common/components/ui/PrincipalModal";
import { useRbacSimulation } from "@/common/context";

export default function Home() {
  const { t } = useTranslation()
  const { hasPermission } = useRbacSimulation();
  const canCreatePaymentLink = hasPermission('create_payment_link');
  const canUpdatePaymentLink = hasPermission('update_payment_link');
  const canExportPaymentLinks = hasPermission('export_payment_links');
  const { getPaymentLinks, getPaymentLinksExport, editTitle } = usePaymentLinks();
  const [data, setData] = useState<PaymentLinkListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<pagination>();
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);
  const copiedTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevSearch = useRef("");
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isChangeTitleOpen, setIsChangeTitleOpen] = useState(false);
  const [takenId, setTakenId] = useState<string>('');
  const [editableTitle, setEditableTitle] = useState<string>('');


  const [filters, setFilters] = useState<PaymentLinkFilters>({
    kind: "paymentLinkFilters",
    search: "",
    dateRange: "month",
    dateSort: "desc",
  });

  const [uiState, setUiState] = useState<uiStatePaymentLink>({
    kind: "paymentLinkUiState",
    showDate: false,
    
  });

  const filteredData = useMemo(() => {
    if (!data || data.length === 0) return [];
    const processed = [...data];
    if (uiState.showDate) {
      processed.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return filters.dateSort === "asc" ? dateA - dateB : dateB - dateA;
      });
    }
    return processed;
  }, [data, filters.dateSort, uiState.showDate]);

  const fetchPaymentLinks = async () => {
    setLoading(true);
    let months: number | null = null;
    if (uiState.showDate) {
      switch (filters.dateRange) {
        case "month":
          months = 1;
          break;
        case "quarter":
          months = 3;
          break;
        case "semester":
          months = 6;
          break;
        case "year":
          months = 12;
          break;
      }
    }

    const response = await getPaymentLinks({
      query: filters.search,
      status: null,
      months,
      page: currentPage,
    });

    if (response.success) {
      setData(response.data ?? []);
      setPagination(response.pagination);
      if (response.pagination?.page) {
        setCurrentPage(response.pagination.page);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    if (prevSearch.current !== filters.search) {
      prevSearch.current = filters.search;
      const timeoutId = setTimeout(async () => fetchPaymentLinks(), 1000);
      return () => clearTimeout(timeoutId);
    }

    fetchPaymentLinks();
  }, [filters.dateRange, filters.search, uiState, currentPage]);

  useEffect(() => {
    return () => {
      if (copiedTimeoutRef.current) {
        clearTimeout(copiedTimeoutRef.current);
      }
    };
  }, []);

  const getCurrencySymbol = (value?: string | null) =>
    currency.find((option) => option.value === value)?.sym ?? "";

  const formatAmount = (amount?: number | null, currencyValue?: string | null) => {
    const normalized = Number(amount);
    if (!Number.isFinite(normalized)) return "--";
    return `${getCurrencySymbol(currencyValue)}${(normalized / 100).toFixed(2)}`;
  };

  const formatStatus = (status?: string | null) => {
    if (!status) return t("paymentLinks.status.inactive");
    const normalized = status.toLowerCase();
    const statusKeyMap: Record<string, string> = {
      active: "active",
      inactive: "inactive",
      paid: "paid",
      expired: "expired",
      draft: "draft",
    };
    const key = statusKeyMap[normalized] ?? "inactive";
    return t(`paymentLinks.status.${key as 'active' | 'inactive' | 'draft' | 'expired' | 'paid'}`);
  };

  const statusStyle = (status?: string | null) => {
    if (!status) return "bg-muted-foreground/10 text-muted-foreground border-border";
    const normalized = status.toLowerCase();
    if (normalized === "active" || normalized === "paid") {
      return "bg-status-active/10 text-status-active border-status-active/20";
    }
    if (normalized === "expired") {
      return "bg-status-review/10 text-status-review border-status-review/20";
    }
    return "bg-muted-foreground/10 text-muted-foreground border-border";
  };

  const handleCopyForItem = async (item: PaymentLinkListItem) => {
    await handleCopyLink({ link: item.link });
    setCopiedLinkId(item.id);
    if (copiedTimeoutRef.current) {
      clearTimeout(copiedTimeoutRef.current);
    }
    copiedTimeoutRef.current = setTimeout(() => {
      setCopiedLinkId(null);
    }, 1800);
  };

  const renderCell = (item: PaymentLinkListItem, key: string) => {
    switch (key) {
      case "title":
        return (
          <span className="font-semibold text-foreground">
            {item.title?.trim() || t("paymentLinks.table.untitled")}
          </span>
        );
      case "amount":
        return (
          <span className="text-foreground">
            {formatAmount(item.totalAmount, item.currency)}
          </span>
        );
      case "status":
        return (
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusStyle(
              item.status
            )}`}
          >
            {formatStatus(item.status)}
          </span>
        );
      case "createdAt":
        return (
          <span className="text-sm text-foreground">
            {item.createdAt
              ? new Date(item.createdAt).toLocaleDateString("es-ES", {
                  day: "2-digit",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "--"}
          </span>
        );
      default:
        return null;
    }
  };

  const renderMenuActions = (item: PaymentLinkListItem, close: () => void) => (
    <div>
      <Link
      href={`/paymentLink/${item.id}`}
      onClick={close}
      className="flex cursor-pointer items-center gap-3 px-4 py-3 text-sm font-medium text-foreground hover:bg-surface-muted transition-colors w-full text-left"
        >
        {t("paymentLinks.actions.view")}
      </Link>
      <button className="flex cursor-pointer items-center gap-3 px-4 py-3 text-sm font-medium text-foreground hover:bg-surface-muted transition-colors w-full text-left"
      onClick={() => handleCopyForItem(item)}
        >
        {copiedLinkId === item.id ? t("paymentLinks.actions.copied") : t("paymentLinks.actions.copy")}
      </button>
      {canUpdatePaymentLink ? (
        <button className="flex cursor-pointer items-center gap-3 px-4 py-3 text-sm font-medium text-foreground hover:bg-surface-muted transition-colors w-full text-left"
        onClick={() => {
          setIsChangeTitleOpen(true);
          setTakenId(item.id);
          setEditableTitle(item.title ?? '');
        }}
          >
          {t("paymentLinks.actions.changeTitle")}
        </button>
      ) : null}
    </div>
  );

  const handleSaveTitle = async () => {
    const response = await editTitle({ id: takenId, title: editableTitle });
    if (!response.success) return;
    setIsChangeTitleOpen(false);
    await fetchPaymentLinks();
  };

  const DEFAULT_COLUMNS = [
    { key: "title", label: "paymentLinks.table.col_title", visible: true, order: 0 },
    { key: "amount", label: "paymentLinks.table.col_amount", visible: true, order: 1 },
    { key: "createdAt", label: "paymentLinks.table.col_created", visible: true, order: 2 },
  ];

  const totalCount = pagination?.total ?? data.length;
  const isDefaultFilters =
    !filters.search && !uiState.showDate;
  const showEmptyState = !loading && totalCount === 0 && isDefaultFilters;
  const [columnConfig] = useState(DEFAULT_COLUMNS);
  
  return (
    <div className="h-full min-h-0 overflow-hidden bg-surface text-foreground animate-enter-step">
      <div className="flex h-full min-h-0 overflow-hidden flex-col lg:flex-row">
        <Navbar />
        <div className='min-w-0 flex-1 min-h-0 flex flex-col'>
          <Header/>
          <main className="flex-1 min-h-0 overflow-y-auto p-6">
            <div className="flex flex-col gap-4 pb-6 sm:flex-row sm:items-center sm:justify-between">
              <h1 className="text-2xl font-semibold">
                {t("paymentLinks.title")}
              </h1>
               <Link
                href={'/paymentLink/create'}
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium shadow-sm transition ${
                  canCreatePaymentLink
                    ? 'cursor-pointer bg-accent text-accent-foreground hover:opacity-90'
                    : 'pointer-events-none cursor-not-allowed border border-border bg-surface-muted text-muted-foreground'
                }`}
              >
                <Plus width={15} height={15} />
                {t("paymentLinks.createButton")}
              </Link> 
            </div>
            {showEmptyState ? (
              <section className="rounded-2xl bg-surface p-6 shadow-sm sm:p-8 lg:p-10">
                <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_400px]">
                  <div className="space-y-4">
                    <h3 className="text-2xl xl:text-[36px] font-semibold">
                      {t("paymentLinks.emptyTitle")}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {t("paymentLinks.emptyBody")}
                    </p>
                    <Link
                      href={'/paymentLink/create'}
                      className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium shadow-sm transition ${
                        canCreatePaymentLink
                          ? 'cursor-pointer bg-accent text-accent-foreground hover:opacity-90'
                          : 'pointer-events-none cursor-not-allowed border border-border bg-surface-muted text-muted-foreground'
                      }`}
                    >
                      {t("paymentLinks.createTestLink")}
                    </Link>
                  </div>
                  <div className="relative min-h-80 w-full max-w-125">
                    <Image
                      src="/pasarela/PayImage.png"
                      alt="Payment link empty state"
                      className="rounded-xl border border-border bg-surface-muted object-contain! p-4"
                      fill
                    />
                  </div>
                </div>
              </section>
            ) : (
              <div className="space-y-6">
                <Filters
                  filters={filters}
                  setFilters={(val) => setFilters(val as PaymentLinkFilters)}
                  uiState={uiState}
                  setUiState={(val) => setUiState(val as uiStatePaymentLink)}
                />

                <div className="flex justify-between items-end">
                  <span className="text-sm text-muted-foreground">
                    {t("transactions.table.total_showing", {
                      count: totalCount,
                    })}
                  </span>
                   <div className="flex gap-2">
                        <button  onClick={()=>canExportPaymentLinks && setIsExportOpen(true)} disabled={!canExportPaymentLinks} className="flex items-center gap-2 px-3 py-1.5 bg-surface border border-border rounded-md text-sm font-medium text-foreground hover:bg-surface-muted cursor-pointer transition-colors disabled:cursor-not-allowed disabled:opacity-60">
                            <Download size={16} /> {t('products.export_button')}
                        </button>
                    </div>
                </div>

                {loading ? (
                  <div className="rounded-lg border border-border bg-surface p-6 text-sm text-muted-foreground">
                    {t("common.loading")}
                  </div>
                ) : filteredData.length > 0 ? (
                  <GenericTable<PaymentLinkListItem>
                    data={filteredData}
                    columns={DEFAULT_COLUMNS}
                    renderCellContent={renderCell}
                    renderMenuActions={renderMenuActions}
                  />
                ) : (
                  <p className="w-full text-center py-12 text-muted-foreground bg-surface-muted/10 rounded-lg border border-dashed border-border">
                    {t("common.resultsNotFound")}
                  </p>
                )}

                <div className="flex justify-end items-center gap-4">
                  <span className="text-sm text-muted-foreground">
                    {t("transactions.table.page_count", {
                      current: currentPage,
                      total: pagination?.pages || 1,
                    })}
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="p-1.5 rounded-md border cursor-pointer border-border bg-surface text-foreground hover:bg-surface-muted disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      onClick={() =>
                        setCurrentPage(
                          Math.min(pagination?.pages || 1, currentPage + 1)
                        )
                      }
                      disabled={currentPage === pagination?.pages}
                      className="p-1.5 rounded-md border cursor-pointer border-border bg-surface text-foreground hover:bg-surface-muted disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>


      <ExportModal
          isOpen={isExportOpen} 
          onClose={() => setIsExportOpen(false)} 
          currentColumnConfig={[...DEFAULT_COLUMNS, { key: "link", label: "paymentLinks.table.col_link", visible: true, order: 3 }]}
          filters={filters}
          uiState={uiState}
          action={(params) => getPaymentLinksExport(params as PaymentLinksExport)}
          availableColumns={[...DEFAULT_COLUMNS, { key: "link", label: "paymentLinks.table.col_link", visible: true, order: 3 }]}
         />

      <PrincipalModal
        isOpen={isChangeTitleOpen}
        onClose={() => setIsChangeTitleOpen(false)}
        className="w-full max-w-md p-6"
      >
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold text-foreground">
            {t("paymentLinks.actions.changeTitle")}
          </h3>
          <input
            type="text"
            value={editableTitle}
            onChange={(event) => setEditableTitle(event.target.value)}
            placeholder={t("paymentLinks.table.untitled")}
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
          />

          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsChangeTitleOpen(false)}
              className="rounded-md border border-border px-4 py-2 text-sm text-foreground hover:bg-surface-muted"
            >
              {t("nav.cancel")}
            </button>
            <button
              onClick={handleSaveTitle}
              disabled={!canUpdatePaymentLink}
              className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90"
            >
              {t("nav.save")}
            </button>
          </div>
        </div>
      </PrincipalModal>
    </div>
  );
}
