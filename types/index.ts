export interface WeekData {
  id: string;
  weekLabel: string; // e.g. "SEM 27"
  forecastVendas: number;
  vendasReais: number;
  ativacoes: number;
  entradasStock: number;
  // … outros campos editáveis
}

export interface MonthData {
  id: string;
  monthLabel: string; // e.g. "jul-25"
  weeks: WeekData[];
  // campos agregados (calculados):
  get forecastVendasTotal(): number;
  get vendasReaisTotal(): number;
  get ativacoesTotal(): number;
  get entradasStockTotal(): number;
  get stockCentrosLogisticos(): number;  // preenchido à parte ou calculado
  get stockLojas(): number;              // idem
  get stockGeral(): number;
  get coberturaMeses(): number;
}
