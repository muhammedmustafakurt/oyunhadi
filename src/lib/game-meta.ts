import { GAMES } from './games';
import { SPINE } from './spines';

// Oyun kimliğinden ad ve renk (panel tabloları ve grafikler için).
export const gameName = (id: string | null) => (id ? GAMES.find((g) => g.id === id)?.name ?? id : '—');
export const gameColor = (id: string) => (SPINE as Record<string, [string, string]>)[id]?.[0] ?? '#888';
