'use client';

import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ExternalLink, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Navbar } from '@/common/components/ui/Navbar';
import { Header } from '@/common/components/layout/Header';
import { SurfaceCard } from '@/common/components/ui/SurfaceCard';
import { CustomSelect } from '@/common/components/ui/CustomSelect';
import {
  DEFAULT_WEBHOOK_CONFIG,
  WebhookConfig,
  WebhookEvent,
  useWebhooks,
} from '../_hooks/useWebhooks';
import { useRbacSimulation } from '@/common/context';

export default function WebhooksPage() {
  const { t } = useTranslation();
  const { hasPermission } = useRbacSimulation();
  const canManageWebhooks = hasPermission('manage_webhooks');
  const { events, error, submittingId, saveWebhook } = useWebhooks();
  const [activeEventId, setActiveEventId] = useState<string | null>(null);
  const [draftConfigs, setDraftConfigs] = useState<Record<string, WebhookConfig>>({});

  const savedConfigs = useMemo(() => {
    const next: Record<string, WebhookConfig> = {};
    events.forEach((event) => {
      next[event.id] = event.config ?? DEFAULT_WEBHOOK_CONFIG;
    });
    return next;
  }, [events]);

  const handleSelectEvent = (event: WebhookEvent) => {
    setActiveEventId((prev) => (prev === event.id ? null : event.id));
  };

  const updateDraftConfig = (eventId: string, next: Partial<WebhookConfig>) => {
    setDraftConfigs((prev) => ({
      ...prev,
      [eventId]: {
        ...(prev[eventId] ?? savedConfigs[eventId] ?? DEFAULT_WEBHOOK_CONFIG),
        ...next,
      },
    }));
  };

  const isConfigEqual = (a: WebhookConfig, b: WebhookConfig) => {
    return (
      a.endpoint.trim() === b.endpoint.trim() &&
      a.method === b.method &&
      a.body.trim() === b.body.trim()
    );
  };

  const resolvedConfigs = useMemo(() => {
    const next: Record<string, WebhookConfig> = {};
    events.forEach((event) => {
      next[event.id] =
        draftConfigs[event.id] ??
        savedConfigs[event.id] ??
        DEFAULT_WEBHOOK_CONFIG;
    });
    return next;
  }, [events, draftConfigs, savedConfigs]);

  return (
    <div className="lg:flex h-full min-h-0 overflow-hidden animate-enter-step">
      <Navbar />
      <div className="min-w-0 flex-1 min-h-0 flex flex-col">
        <Header />
        <div className="flex-1 min-h-0 overflow-y-auto bg-surface p-6">
          <div className="mx-auto w-full max-w-5xl space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {t('developers.webhooks.title')}
              </h1>
              <p className="text-sm text-muted-foreground">
                {t('developers.webhooks.subtitle')}
              </p>
            </div>

            <SurfaceCard className="p-6 space-y-5">
              <div className="flex items-start gap-4">
                <div className="h-11 w-11 rounded-2xl bg-accent-soft text-accent flex items-center justify-center">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-foreground">
                    {t('developers.webhooks.heroTitle')}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {t('developers.webhooks.heroSubtitle')}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-border bg-background p-4 shadow-sm">
                  <h3 className="text-sm font-semibold text-foreground">
                    {t('developers.webhooks.quickstart.title')}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t('developers.webhooks.quickstart.description')}
                  </p>
                  <Link
                    href="#"
                    className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent-hover cursor-pointer"
                  >
                    {t('developers.webhooks.quickstart.link')}
                    <ExternalLink size={14} />
                  </Link>
                </div>

                <div className="rounded-xl border border-border bg-background p-4 shadow-sm">
                  <h3 className="text-sm font-semibold text-foreground">
                    {t('developers.webhooks.docs.title')}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t('developers.webhooks.docs.description')}
                  </p>
                  <a
                    href="#"
                    className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent-hover cursor-pointer"
                  >
                    {t('developers.webhooks.docs.link')}
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            </SurfaceCard>

            <SurfaceCard className="p-6 space-y-4">
              <div>
                <h2 className="text-base font-semibold text-foreground">
                  {t('developers.webhooks.eventsTitle')}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {t('developers.webhooks.eventsSubtitle')}
                </p>
              </div>

                <div className="space-y-3">
                  {events.map((event) => {
                    const savedConfig = savedConfigs[event.id] ?? DEFAULT_WEBHOOK_CONFIG;
                    const draftConfig = resolvedConfigs[event.id] ?? savedConfig;
                    const isDirty = !isConfigEqual(draftConfig, savedConfig);
                    const isActive = activeEventId === event.id;
                    const panelId = `webhook-config-${event.id}`;

                    return (
                      <div key={event.id} className="space-y-3">
                        <div className="flex items-start justify-between gap-4 rounded-xl border border-border bg-background p-4">
                          <div>
                            <p className="text-sm font-semibold text-foreground font-mono">
                              {event.id}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleSelectEvent(event)}
                            className={`h-6 w-6 rounded-md border border-border flex items-center justify-center text-foreground transition cursor-pointer ${
                              isActive ? 'bg-surface-muted' : 'bg-background'
                            }`}
                            aria-expanded={isActive}
                            aria-controls={panelId}
                          >
                            <div
                              className={`h-3 w-3 rounded-sm ${isActive ? 'bg-foreground' : 'bg-transparent'}`}
                            />
                          </button>
                        </div>

                        {isActive && (
                          <div
                            id={panelId}
                            className="rounded-xl border border-border bg-background p-5"
                          >
                            <h3 className="text-sm font-semibold text-foreground mb-4">
                              {t('developers.webhooks.config.title')}
                            </h3>

                            <div className="space-y-4">
                              <div>
                                <label className="text-xs font-medium text-muted-foreground">
                                  {t('developers.webhooks.config.endpoint')}
                                </label>
                                <input
                                  type="text"
                                  value={draftConfig.endpoint}
                                  onChange={(e) =>
                                    updateDraftConfig(event.id, {
                                      endpoint: e.target.value,
                                    })
                                  }
                                  placeholder={t('developers.webhooks.config.endpointPlaceholder')}
                                  className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-accent"
                                />
                              </div>

                              <div>
                                <label className="text-xs font-medium text-muted-foreground">
                                  {t('developers.webhooks.config.method')}
                                </label>
                                <div className="mt-2 w-full">
                                  <CustomSelect
                                    value={draftConfig.method}
                                    onChange={(value) =>
                                      updateDraftConfig(event.id, {
                                        method: value as WebhookConfig['method'],
                                      })
                                    }
                                    options={['POST', 'GET', 'PUT']}
                                    className="w-full rounded-md px-3 py-2 text-sm cursor-pointer"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="text-xs font-medium text-muted-foreground">
                                  {t('developers.webhooks.config.body')}
                                </label>
                                <textarea
                                  rows={4}
                                  value={draftConfig.body}
                                  onChange={(e) =>
                                    updateDraftConfig(event.id, { body: e.target.value })
                                  }
                                  className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-accent"
                                />
                              </div>

                              {isDirty && (
                                <div className="flex justify-end">
                                  <button
                                    type="button"
                                    onClick={() => saveWebhook(event, draftConfig)}
                                    disabled={!canManageWebhooks || submittingId === event.id}
                                    className="rounded-md cursor-pointer bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground disabled:cursor-not-allowed disabled:opacity-60"
                                  >
                                    {t('developers.webhooks.config.save')}
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
            </SurfaceCard>
          </div>
        </div>
      </div>
    </div>
  );
}
