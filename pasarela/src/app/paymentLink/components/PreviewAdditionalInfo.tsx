import { useTranslation } from "react-i18next";

type PreviewAdditionalInfoProps = {
  enabled: boolean;
  text: string;
};

export const PreviewAdditionalInfo = ({
  enabled,
  text,
}: PreviewAdditionalInfoProps) => {
  const { t } = useTranslation();

  if (!enabled) return null;

  return (
    <div className="mt-4 space-y-1 rounded-lg border border-border bg-surface-muted px-3 py-2">
      <div className="text-[10px] font-semibold text-muted-foreground">
        {t("paymentLinkCreate.preview.additionalInfoLabel")}
      </div>
      <div className="text-xs text-foreground">{text}</div>
    </div>
  );
};
