import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import API from '@/lib/api';
import { useAuth } from '@/common/context/authContext';
import { AxiosError } from 'axios';

export type ApiKeyRecord = {
  id: string;
  nameKey: string;
  token: string;
  type: 'public' | 'secret';
  createdAt: string;
  lastUseAt: string;
};

type KeyPayload = {
  token: string;
  createdAt?: string | null;
  lastUseAt?: string | null;
};

const normalizeKeyValue = (value: unknown): KeyPayload | null => {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return null;
    if (trimmed.startsWith('{')) {
      try {
        const parsed = JSON.parse(trimmed);
        const nested = normalizeKeyValue(parsed);
        if (nested) return nested;
      } catch {
        return { token: trimmed };
      }
    }
    return { token: trimmed };
  }
  if (value && typeof value === 'object') {
    const key = (value as { key?: unknown }).key ?? (value as { token?: unknown }).token;
    const createdAt = (value as { createdAt?: unknown }).createdAt;
    if (typeof key === 'string' && key.trim()) {
      return {
        token: key,
        createdAt: typeof createdAt === 'string' ? createdAt : null,
      };
    }
  }
  return null;
};

const normalizeKeysResponse = (payload: unknown) => {
  if (!payload || typeof payload !== 'object') return null;
  const data = (payload as { data?: unknown }).data ?? payload;
  if (!data || typeof data !== 'object') return null;
  const maybeKeys = (data as { keys?: unknown }).keys ?? data;

  const publicValue =
    (maybeKeys as { publicKey?: unknown }).publicKey ??
    (maybeKeys as { public?: unknown }).public ??
    (data as { publicKey?: unknown }).publicKey ??
    (data as { public?: unknown }).public ??
    null;

  const privateValue =
    (maybeKeys as { privateKey?: unknown }).privateKey ??
    (maybeKeys as { secretKey?: unknown }).secretKey ??
    (maybeKeys as { secret?: unknown }).secret ??
    (data as { privateKey?: unknown }).privateKey ??
    (data as { secretKey?: unknown }).secretKey ??
    (data as { secret?: unknown }).secret ??
    null;

  const publicKey = normalizeKeyValue(publicValue);
  const privateKey = normalizeKeyValue(privateValue);

  if (!publicKey && !privateKey) return null;
  return { publicKey, privateKey };
};

const buildKeysFromTokens = (
  publicKey?: KeyPayload | null,
  privateKey?: KeyPayload | null
): ApiKeyRecord[] => {
  const items: ApiKeyRecord[] = [];
  if (publicKey?.token) {
    items.push({
      id: 'public-key',
      nameKey: 'developers.keys.public',
      token: publicKey.token,
      type: 'public',
      createdAt: publicKey.createdAt ?? '--',
      lastUseAt: publicKey.lastUseAt ?? '--',
    });
  }
  if (privateKey?.token) {
    items.push({
      id: 'secret-key',
      nameKey: 'developers.keys.secret',
      token: privateKey.token,
      type: 'secret',
      createdAt: privateKey.createdAt ?? '--',
      lastUseAt: privateKey.lastUseAt ?? '--',
    });
  }
  return items;
};

const applyTokensToKeys = (
  prev: ApiKeyRecord[],
  publicKey?: KeyPayload | null,
  privateKey?: KeyPayload | null
) => {
  if (!prev.length) {
    return buildKeysFromTokens(publicKey, privateKey);
  }
  return prev.map((key) => {
    if (key.type === 'public' && publicKey?.token) {
      return {
        ...key,
        token: publicKey.token,
        createdAt: publicKey.createdAt ?? key.createdAt,
      };
    }
    if (key.type === 'secret' && privateKey?.token) {
      return {
        ...key,
        token: privateKey.token,
        createdAt: privateKey.createdAt ?? key.createdAt,
      };
    }
    return key;
  });
};

export const useApiKeys = () => {
  const router = useRouter();
  const { client, loading: authLoading } = useAuth();
  const [keys, setKeys] = useState<ApiKeyRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) {
      setLoading(true);
      return;
    }
    setLoading(false);
  }, [authLoading, client]);

  const regenerateKeys = async () => {
    if (!client?.id) return;
    setLoading(true);
    try {
      const response = await API.post(
        `/businesses/regenerate-keys`,
        {},
        { headers: { 'Content-Type': 'application/json' } }
      );
      const normalized = normalizeKeysResponse(response.data);
      if (!normalized) return;

      setKeys((prev) =>
        applyTokensToKeys(prev, normalized.publicKey, normalized.privateKey)
      );
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 401) {
        router.push('/signin');
      }
    } finally {
      setLoading(false);
    }
  };

  const getKeys = async () => {
    setLoading(true);
    try {
      const response = await API.get(
        `/businesses/keys`,
      );
      const normalized = normalizeKeysResponse(response.data);
      if (!normalized) return;
      setKeys((prev) =>
        applyTokensToKeys(prev, normalized.publicKey, normalized.privateKey)
      );
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 401) {
        router.push('/signin');
      }
    } finally {
      setLoading(false);
    }
  };


  

  return { keys, loading, regenerateKeys, getKeys };
};
