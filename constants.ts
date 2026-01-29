
import { MonthlyTargets, Month, ClientProfile } from './types';

export const MONTHS: Month[] = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

export const QUARTERS = {
  Q1: ['Jan', 'Fev', 'Mar'],
  Q2: ['Abr', 'Mai', 'Jun'],
  Q3: ['Jul', 'Ago', 'Set'],
  Q4: ['Out', 'Nov', 'Dez'],
};

export const TARGETS: MonthlyTargets[] = [
  { month: 'Jan', syllas: 118500, vendedora1: 24000, vendedora2: 0, vendedora3: 0 },
  { month: 'Fev', syllas: 138000, vendedora1: 28000, vendedora2: 26000, vendedora3: 0 },
  { month: 'Mar', syllas: 100000, vendedora1: 42000, vendedora2: 26000, vendedora3: 0 },
  { month: 'Abr', syllas: 98000, vendedora1: 43000, vendedora2: 27000, vendedora3: 0 },
  { month: 'Mai', syllas: 94000, vendedora1: 44000, vendedora2: 27000, vendedora3: 0 },
  { month: 'Jun', syllas: 89000, vendedora1: 44000, vendedora2: 27000, vendedora3: 0 },
  { month: 'Jul', syllas: 103000, vendedora1: 42000, vendedora2: 42000, vendedora3: 0 },
  { month: 'Ago', syllas: 116000, vendedora1: 40000, vendedora2: 40000, vendedora3: 0 },
  { month: 'Set', syllas: 128000, vendedora1: 39000, vendedora2: 39000, vendedora3: 0 },
  { month: 'Out', syllas: 136000, vendedora1: 38000, vendedora2: 38000, vendedora3: 0 },
  { month: 'Nov', syllas: 144000, vendedora1: 37000, vendedora2: 37000, vendedora3: 0 },
  { month: 'Dez', syllas: 125000, vendedora1: 40000, vendedora2: 40000, vendedora3: 0 },
];

export const ANNUAL_TOTAL_GOAL = 2180000;

export const INITIAL_SALES: Record<Month, { syllas: number, vendedora1: number, vendedora2: number, vendedora3: number }> = {
  Jan: { syllas: 0, vendedora1: 0, vendedora2: 0, vendedora3: 0 },
  Fev: { syllas: 0, vendedora1: 0, vendedora2: 0, vendedora3: 0 },
  Mar: { syllas: 0, vendedora1: 0, vendedora2: 0, vendedora3: 0 },
  Abr: { syllas: 0, vendedora1: 0, vendedora2: 0, vendedora3: 0 },
  Mai: { syllas: 0, vendedora1: 0, vendedora2: 0, vendedora3: 0 },
  Jun: { syllas: 0, vendedora1: 0, vendedora2: 0, vendedora3: 0 },
  Jul: { syllas: 0, vendedora1: 0, vendedora2: 0, vendedora3: 0 },
  Ago: { syllas: 0, vendedora1: 0, vendedora2: 0, vendedora3: 0 },
  Set: { syllas: 0, vendedora1: 0, vendedora2: 0, vendedora3: 0 },
  Out: { syllas: 0, vendedora1: 0, vendedora2: 0, vendedora3: 0 },
  Nov: { syllas: 0, vendedora1: 0, vendedora2: 0, vendedora3: 0 },
  Dez: { syllas: 0, vendedora1: 0, vendedora2: 0, vendedora3: 0 },
};

export const TOP_CLIENTS_HISTORY: ClientProfile[] = [
  { id: '1', name: 'MACCAFERRI DO BRASIL LTDA', sector: 'Infraestrutura', history: { 2021: 284869.48, 2022: 50161.64, 2023: 104303.31, 2024: 135998.77, 2025: 57016.57 } },
  { id: '2', name: 'FERTIPAR BANDEIRANTES LTDA', sector: 'Agronegócio', history: { 2021: 62158.43, 2022: 99953.25, 2023: 529550.73, 2024: 669462.42, 2025: 825707.65 } },
  { id: '3', name: 'PLASTEK DO BRASIL IND E COM LTDA', sector: 'Indústria Plástica', history: { 2021: 143580.96, 2022: 126538.62, 2023: 52269.78, 2024: 16275.25, 2025: 18309.26 } },
  { id: '4', name: 'TEX EQUIPAMENTOS ELETRONICOS', sector: 'Eletrônicos', history: { 2021: 82418.85, 2022: 77266.88, 2023: 105537.46, 2024: 121464.41, 2025: 123748.48 } },
  { id: '5', name: 'CONFIBRA INDUSTRIA E COMERCIO', sector: 'Construção Civil', history: { 2021: 75438.37, 2022: 120144.89, 2023: 64626.48, 2024: 45824.28, 2025: 46212.30 } },
  { id: '6', name: 'AJINOMOTO DO BRASIL LTDA', sector: 'Alimentício', history: { 2021: 75186.64, 2022: 19467.50, 2023: 53603.91, 2024: 55354.56, 2025: 44257.40 } },
  { id: '7', name: 'AQUAGEL REFRIGERACAO LTDA', sector: 'Refrigeração', history: { 2021: 0, 2022: 68222.40, 2023: 108894.90, 2024: 83043.66, 2025: 74082.82 } },
  { id: '8', name: 'IGARATIBA IND E COM LTDA', sector: 'Indústria Geral', history: { 2021: 47469.35, 2022: 38007.22, 2023: 51410.31, 2024: 55703.10, 2025: 27566.24 } },
  { id: '9', name: 'CJ DO BRASIL LTDA', sector: 'Alimentício', history: { 2021: 64585.35, 2022: 98068.89, 2023: 0, 2024: 200000.00, 2025: 13353.50 } },
  { id: '10', name: 'CLARIOS ENERGY SOLUTIONS', sector: 'Energia', history: { 2021: 28570.46, 2022: 48064.32, 2023: 49474.53, 2024: 0, 2025: 13258.17 } },
  { id: '11', name: 'ELEKEIROZ S/A', sector: 'Químico', history: { 2021: 15957.88, 2022: 45817.58, 2023: 30596.01, 2024: 25631.10, 2025: 30809.09 } },
  { id: '12', name: 'GLOBAL FLEX INDUSTRIA LTDA', sector: 'Logística', history: { 2021: 0, 2022: 0, 2023: 0, 2024: 29022.50, 2025: 71597.55 } },
  { id: '13', name: 'USINA ACUCAREIRA ESTER SA', sector: 'Usinas/Açúcar', history: { 2021: 0, 2022: 0, 2023: 0, 2024: 36961.79, 2025: 43178.71 } },
  { id: '14', name: 'PAIS E FILHOS USINAGEM LTDA', sector: 'Metalurgia', history: { 2021: 0, 2022: 69586.26, 2023: 51720.59, 2024: 12736.42, 2025: 0 } },
  { id: '15', name: 'ITURRI COIMPAR INDUSTRIA', sector: 'EPIs/Segurança', history: { 2021: 22199.07, 2022: 71398.24, 2023: 76310.96, 2024: 0, 2025: 0 } },
  { id: '16', name: 'SIKA S.A.', sector: 'Construção Civil', history: { 2021: 0, 2022: 0, 2023: 0, 2024: 0, 2025: 44211.86 } },
  { id: '17', name: 'SANTHER FABRICA DE PAPEL', sector: 'Papel e Celulose', history: { 2021: 0, 2022: 19057.02, 2023: 0, 2024: 0, 2025: 18952.36 } },
  { id: '18', name: 'PLIMAX IND DE EMBALAGENS', sector: 'Indústria Plástica', history: { 2021: 17913.31, 2022: 19704.67, 2023: 0, 2024: 21743.81, 2025: 0 } },
  { id: '19', name: 'EMS S/A', sector: 'Farmacêutico', history: { 2021: 0, 2022: 0, 2023: 0, 2024: 0, 2025: 16600.00 } },
  { id: '20', name: 'SUDESTE AUTOMACAO EIRELI', sector: 'Automação', history: { 2021: 0, 2022: 0, 2023: 0, 2024: 0, 2025: 15682.18 } },
];
