import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import API from '@/lib/api';

export type WebhookMethod = 'POST' | 'GET' | 'PUT';

export type WebhookConfig = {
  id?: string
  endpoint: string;
  method: WebhookMethod;
  body: string;
};

export type WebhookEvent = {
  id: string; // event name
  eventId: string; // backend uuid
  enabled: boolean;
  config?: WebhookConfig;
};

type ApiEvent = {
  id: string;
  name: string;
};

type ApiWebhook = {
  id?: string
  endpoint?: string;
  method?: WebhookMethod;
  body?: unknown;
};

export const DEFAULT_WEBHOOK_CONFIG: WebhookConfig = {
  endpoint: '',
  method: 'POST',
  body: '{}',
};

export const useWebhooks = () => {
  const [events, setEvents] = useState<WebhookEvent[]>([]);
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const normalizeBody = (body: unknown) => {
    if (!body) return JSON.stringify({}, null, 2);
    if (typeof body === 'string') {
      try {
        const parsed = JSON.parse(body);
        return JSON.stringify(parsed ?? {}, null, 2);
      } catch {
        return JSON.stringify({}, null, 2);
      }
    }
    return JSON.stringify(body, null, 2);
  };

  const normalizeWebhookConfig = (payload: ApiWebhook | null): WebhookConfig => {
    if (!payload) return { ...DEFAULT_WEBHOOK_CONFIG };
    return {
      endpoint: payload.endpoint ?? '',
      method: payload.method ?? 'POST',
      body: normalizeBody(payload.body),
      id: payload.id ?? ""
    };
  };

  const fetchWebhookByEventId = useCallback(async (eventId: string) => {
    try {
      const response = await API.get<ApiWebhook>(`/events/${eventId}/webhooks`);
      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        return null;
      }
      throw err;
    }
  }, []);

  const fetchEvents = useCallback(async () => {
    setError(null);
    try {
      const response = await API.get<ApiEvent[] | { data: ApiEvent[] }>(
        '/events'
      );
      const payload = Array.isArray(response.data)
        ? response.data
        : response.data?.data ?? [];

      const mapped: WebhookEvent[] = payload.map((item) => ({
        id: item.name,
        eventId: item.id,
        enabled: false,
      }));
      setEvents(mapped);

      const resolved = await Promise.allSettled(
        mapped.map(async (event) => {
          const webhook = await fetchWebhookByEventId(event.eventId);
          if (!webhook) return event;
          return {
            ...event,
            enabled: true,
            config: normalizeWebhookConfig(webhook),
          };
        })
      );

      const enriched = resolved.map((result, index) => {
        if (result.status === 'fulfilled') return result.value;
        return mapped[index];
      });

      setEvents(enriched);
    } catch (err) {
      setError('Failed to load events.');
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const parseBody = (value: string) => {
    if (!value.trim()) return {};
    const parsed = JSON.parse(value);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      throw new SyntaxError('Body must be a JSON object.');
    }
    return parsed as Record<string, unknown>;
  };

  const saveWebhook = useCallback(
    async (event: WebhookEvent, config: WebhookConfig) => {
      setError(null);

      if (!config.endpoint.trim()) {
        setError('Endpoint is required.');
        return { success: false };
      }

      try {
        const bodyPayload = parseBody(config.body);
        const normalizedEndpoint = config.endpoint.trim();
        const payload = {
          endpoint: normalizedEndpoint,
          method: config.method,
          body: bodyPayload,
        };
        const isUpdate = Boolean(event.config);

        setSubmittingId(event.id);
        if (isUpdate) {
            await API.put(`/webhooks/${config.id}`, payload);
        } else {
          await API.post('/webhooks', {
            eventId: event.eventId,
            ...payload,
          });
        }

        setEvents((prev) =>
          prev.map((item) =>
            item.id === event.id
              ? {
                  ...item,
                  enabled: true,
                  config: { ...config, endpoint: normalizedEndpoint },
                }
              : item
          )
        );
        return { success: true };
      } catch (err) {
        if (err instanceof SyntaxError) {
          setError('Body must be valid JSON.');
        } else {
          setError('Failed to save webhook.');
        }
        return { success: false };
      } finally {
        setSubmittingId(null);
      }
    },
    []
  );

  return {
    events,
    error,
    submittingId,
    saveWebhook,
  };
};
