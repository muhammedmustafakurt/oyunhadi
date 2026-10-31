// src/lib/stats.js'ten gelen istatistik fonksiyonlarının tipleri (fonksiyonların kendisi JS).
export type DayStat = { ms: number; day: string; oyun: number; oyuncu: number };
export type HourStat = { saat: string; oyun: number };
export type GameStat = { game: string; oyun: number };
export type MonthStat = { y: number; m: number; ay: string; oyun: number };
export type TableStat = { no: number; label: string; status: 'oynaniyor' | 'bos'; game: string | null; players: number; today: number };

export declare function weekDocs(biz: number, days?: number): Promise<DayStat[]>;
export declare function hoursDocs(biz: number, days?: number): Promise<HourStat[]>;
export declare function gameDocs(biz: number, days?: number): Promise<GameStat[]>;
export declare function monthDocs(biz: number, months?: number): Promise<MonthStat[]>;
export declare function todayByTable(biz: number): Promise<Map<string, number>>;
export declare function tableRows(biz: number, tables: number): Promise<TableStat[]>;
