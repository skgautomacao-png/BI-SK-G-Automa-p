
export type Month = 'Jan' | 'Fev' | 'Mar' | 'Abr' | 'Mai' | 'Jun' | 'Jul' | 'Ago' | 'Set' | 'Out' | 'Nov' | 'Dez';

export interface SalesData {
  syllas: number;
  vendedora1: number;
  vendedora2: number;
  vendedora3: number;
}

export interface MonthlyTargets {
  month: Month;
  syllas: number;
  vendedora1: number;
  vendedora2: number;
  vendedora3: number;
}

export type SalesState = Record<Month, SalesData>;

// Novas interfaces para Performance de Clientes
export interface ClientYearData {
  year: number;
  revenue: number;
  isPrediction?: boolean;
}

export interface ClientProfile {
  id: string;
  name: string;
  sector: string;
  history: Record<number, number>; // Ano: Valor
  observations?: string;
}

export type HistoricalSalesState = Record<string, Record<number, number>>;
