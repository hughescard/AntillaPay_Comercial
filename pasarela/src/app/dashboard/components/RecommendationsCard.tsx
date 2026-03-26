import { X } from "lucide-react";
import { ApiKeyField } from "./ApiKeyField";
import { useState } from "react";
import { useRouter } from "next/navigation";

type RecommendationsCardProps = {
  title: string;
  items: Array<{ text?: string; linkLabel?: string; href?: string; suffix?: string }>;
  apiKeysTitle: string;
  docLinkLabel: string;
  docLinkHref?: string;
  publishableLabel: string;
  secretLabel: string;
  apiKeys: { publishable: string; secret: string };
};

export const RecommendationsCard = ({
  title,
  items,
  apiKeysTitle,
  docLinkLabel,
  docLinkHref,
  publishableLabel,
  secretLabel,
  apiKeys,
}: RecommendationsCardProps) => {
  const router = useRouter();
  const [isRecommendationsClosing, setIsRecommendationsClosing] = useState(false);
  const [isRecommendationsClosed, setIsRecommendationsClosed] = useState(false);

  const handleCloseRecommendations = () => {
    setIsRecommendationsClosing(true);
  };

  return (
    <div className="self-start rounded-2xl px-5 py-4 shadow-xs w-full">
      {!isRecommendationsClosed ? (
        <div
          className={`overflow-hidden transition-[max-height,margin,opacity] duration-500 ease-in-out ${
            isRecommendationsClosing ? "mb-0 max-h-0 opacity-0" : "mb-4 max-h-80 opacity-100"
          }`}
          onTransitionEnd={(event) => {
            if (isRecommendationsClosing && event.propertyName === "max-height") {
              setIsRecommendationsClosed(true);
              setIsRecommendationsClosing(false);
            }
          }}
        >
          <div
            className={isRecommendationsClosing ? "animate-exit-step border-b border-[var(--border)] pb-4" : " border-b border-[var(--border)] pb-4"}
          >
            <div className="flex items-start justify-between">
              <p className="text-sm font-semibold text-foreground">{title}</p>
              <button
                type="button"
                className="cursor-pointer rounded-md p-1 text-muted-foreground hover:text-[var(--foreground)]"
                aria-label="Dismiss"
                onClick={handleCloseRecommendations}
                disabled={isRecommendationsClosing}
              >
                <X size={14} />
              </button>
            </div>

            <div className="mt-3 space-y-3 text-xs text-[var(--muted-foreground)]">
              {items.map((item, index) => (
                <p key={`${item.text}-${index}`}>
                  {item.text}{" "}
                  {item.linkLabel ? (
                    <button
                      type="button"
                      className="font-semibold text-[var(--accent)] cursor-pointer"
                      onClick={() => {
                        if (item.href) router.push(item.href);
                      }}
                    >
                      {item.linkLabel}
                    </button>
                  ) : null}{" "}
                  {item.suffix ?? ""}
                </p>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      <div className="pt-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-[var(--foreground)]">{apiKeysTitle}</p>
          <button
            type="button"
            className="text-xs font-semibold text-[var(--accent)] cursor-pointer"
            onClick={() => {
              if (docLinkHref) router.push(docLinkHref);
            }}
          >
            {docLinkLabel}
          </button>
        </div>

        <div className="mt-3 space-y-3">
          <ApiKeyField label={publishableLabel} value={apiKeys.publishable} />
          <ApiKeyField label={secretLabel} value={apiKeys.secret} secret={true} />
        </div>
      </div>
    </div>
  );
};
