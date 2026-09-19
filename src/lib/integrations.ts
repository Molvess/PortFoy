import { Functions } from 'appwrite';
import client from './appwrite';
const functionId = import.meta.env.VITE_APPWRITE_INTEGRATIONS_FUNCTION_ID || '';
const functions = new Functions(client);
export type IntegrationAction = 'github-list' | 'github-sync' | 'youtube-resolve-channel' | 'youtube-list-videos';
export interface ImportedCandidate { sourceId: string; title: string; description?: string; sourceUrl?: string; embedUrl?: string; thumbnailUrl?: string; repositoryUrl?: string; liveDemoUrl?: string; technologies?: string[]; tags?: string[]; updatedAt?: string; }
export async function runIntegration<T>(action: IntegrationAction, payload: Record<string, unknown> = {}): Promise<T> { if (!functionId) throw new Error('Entegrasyon servisi henüz yapılandırılmadı. Function ID tanımlanmalı.'); const execution = await functions.createExecution({ functionId, body: JSON.stringify({ action, ...payload }), async: false }); let body: { error?: string; data?: T }; try { body = JSON.parse(execution.responseBody || '{}') as { error?: string; data?: T }; } catch { throw new Error('Entegrasyon servisi geçersiz bir yanıt döndürdü.'); } if (!execution.status || Number(execution.status) >= 400 || body.error) throw new Error(body.error || 'Entegrasyon isteği tamamlanamadı.'); return body.data as T; }
