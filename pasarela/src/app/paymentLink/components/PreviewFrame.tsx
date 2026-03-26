import { ReactNode } from "react";
import { SurfaceCard } from "@/common/components/ui/SurfaceCard";
import { useTranslation } from "react-i18next";

type PreviewFrameProps = {
  domain: string;
  children: ReactNode;
  variant?: "desktop" | "mobile";
};

export const PreviewFrame = ({
  domain,
  children,
  variant = "desktop",
}: PreviewFrameProps) => {
  const { t } = useTranslation();
  const bodyPadding =
    variant === "mobile" ? "px-4 py-6" : "px-6 py-8";

  return (
      <div className="overflow-hidden rounded-2xl bg-[var(--surface)] shadow-xl">
        <div className="flex items-center justify-between px-4 py-3 text-xs text-[var(--muted-foreground)]">
          <div className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-[#e5e7eb]" />
            <span className="h-2 w-2 rounded-full bg-[#e5e7eb]" />
            <span className="h-2 w-2 rounded-full bg-[#e5e7eb]" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-[var(--muted-foreground)]">
              {domain}
            </span>
            <span className="rounded-full bg-[var(--surface-muted)] px-3 py-1 text-[10px] font-medium text-[var(--muted-foreground)]">
              {t("paymentLinkCreate.preview.useDomain")}
            </span>
          </div>
          <span className="text-[10px] text-[var(--muted-foreground)]">
            &nbsp;
          </span>
        </div>
        <div className={bodyPadding}>{children}</div>
      </div>
  );
};
