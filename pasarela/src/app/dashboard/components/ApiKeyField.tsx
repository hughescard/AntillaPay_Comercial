'use client';

import { Copy } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

type ApiKeyFieldProps = {
  label: string;
  value: string;
  secret?: boolean; 
};

export const ApiKeyField = ({ label, value, secret = false }: ApiKeyFieldProps) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const [showSecret, setShowSecret] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value); 
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  const displayValue = secret && !showSecret ? "•".repeat(30) : value;

  return (
    <div className="space-y-2">
      <p className="text-xs text-[var(--muted-foreground)]">{label}</p>
      
      <div className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs text-[var(--foreground)]">
        <span className={`truncate ${secret && !showSecret ? "tracking-widest" : ""}`}>
          {displayValue}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="cursor-pointer flex-shrink-0 ml-2 rounded-md border border-[var(--border)] p-1 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          aria-label={t("dashboard.apiKeys.copyLabel")}
        >
          <Copy size={12} />
        </button>
      </div>

      <div className="flex items-center gap-3 min-h-[16px]">
        {secret && (
          <button
            type="button"
            onClick={() => setShowSecret((prev) => !prev)}
            className="text-[10px] font-medium text-[var(--accent)] hover:opacity-80 cursor-pointer"
          >
            {showSecret 
              ? t("dashboard.apiKeys.hide", "Ocultar") 
              : t("dashboard.apiKeys.show", "Mostrar")}
          </button>
        )}
        
        {copied && (
          <span className="text-[10px] text-[var(--accent)]">
            {t("dashboard.apiKeys.copied", "¡Copiado!")}
          </span>
        )}
      </div>
    </div>
  );
};