import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import API from '@/lib/api';

export type WebhookLog = {
  id: string;
  event: string;
  eventName:string
  endpoint: string;
  statusCode: number;
  method: string;
  createdAt: string;
};

export type WebhookLogFilters = {
  status?: number;
  eventName?: string;
};

type EventRegister = {
  id?: string;
  webhookId?: string;
  requestBody?: {
    eventId?: string;
    webhookId?: string;
    method?: string;
  };
  responseStatus?: number;
  responseMessage?: string;
  requestedAt?: string;
  eventName:string;
  createdAt?: string;
};

const normalizeLogsPayload = (payload: unknown): EventRegister[] => {
  if (Array.isArray(payload)) return payload as EventRegister[];
  if (payload && typeof payload === 'object') {
    const data = (payload as { data?: unknown }).data;
    if (Array.isArray(data)) return data as EventRegister[];
  }
  return [];
};

export const useWebhookLogs = () => {
  const router = useRouter();

  const getLogs = useCallback(
    async (filters: WebhookLogFilters = {}) => {
      try {
        const response = await API.get('/events-registers', {
          params: {
            status: filters.status,
            eventName: filters.eventName,
          },
        });

        const payload = normalizeLogsPayload(response.data);
        const mapped: WebhookLog[] = payload.map((item) => ({
          id: item.id ?? `${item.webhookId ?? 'log'}-${item.createdAt ?? ''}`,
          event: item.requestBody?.eventId ?? '—',
          endpoint: item.requestBody?.webhookId ?? item.webhookId ?? '—',
          statusCode: Number(item.responseStatus ?? 0),
          method: item.requestBody?.method ?? 'POST',
          createdAt: item.requestedAt ?? item.createdAt ?? '—',
          eventName: item.eventName,
        }));

        return { success: true, data: mapped };
      } catch (error) {
        console.log(error);
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          router.push('/signin');
        }
        return { success: false, data: [] as WebhookLog[] };
      }
    },
    [router]
  );

  return { getLogs };
};
