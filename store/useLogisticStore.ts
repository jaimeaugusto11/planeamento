import {create} from 'zustand'
import { MonthData, WeekData } from '../types'

interface LogisticState {
  months: MonthData[];
  updateWeek: (monthId: string, weekId: string, field: keyof WeekData, value: number) => void;
}

export const useLogisticStore = create<LogisticState>((set, get) => ({
  months: [
    {
      id: 'm1',
      monthLabel: 'jul-25',
      weeks: [
        { id: 'w1', weekLabel: 'SEM 27', forecastVendas: 5293, vendasReais: 9229, ativacoes: 4504, entradasStock: 16896 },
        { id: 'w2', weekLabel: 'SEM 28', forecastVendas: 34605, vendasReais: 0, ativacoes: 0, entradasStock: 50688 },
        { id: 'w3', weekLabel: 'SEM 29', forecastVendas: 29428, vendasReais: 0, ativacoes: 0, entradasStock: 33792 },
        { id: 'w4', weekLabel: 'SEM 30', forecastVendas: 24559, vendasReais: 0, ativacoes: 0, entradasStock: 16896 },
      ],
      get forecastVendasTotal() { return this.weeks.reduce((s,w)=>s + w.forecastVendas, 0) },
      get vendasReaisTotal()   { return this.weeks.reduce((s,w)=>s + w.vendasReais, 0) },
      get ativacoesTotal()     { return this.weeks.reduce((s,w)=>s + w.ativacoes, 0) },
      get entradasStockTotal() { return this.weeks.reduce((s,w)=>s + w.entradasStock, 0) },
      get stockCentrosLogisticos() { return 36288 /* ex: acumulado ou vinda do backend */ },
      get stockLojas()             { return 50531 /* idem */ },
      get stockGeral()             { return this.stockCentrosLogisticos + this.stockLojas },
      get coberturaMeses()         { 
        const fv = this.forecastVendasTotal;
        return fv > 0 ? this.stockGeral / fv : 0;
      },
    },
  ],
  updateWeek: (monthId, weekId, field, value) => {
    set(state => ({
      months: state.months.map(m =>
        m.id !== monthId
          ? m
          : {
              ...m,
              weeks: m.weeks.map(w =>
                w.id !== weekId
                  ? w
                  : { ...w, [field]: value }
              ),
            }
      ),
    }))
  }
}))
