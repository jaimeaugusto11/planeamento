/* eslint-disable @typescript-eslint/no-explicit-any */ // Desativa aviso do ESLint para tipos 'any'
"use client"; // Indica execução no lado do cliente

import React, { useMemo, useState } from "react"; // Importa React e hooks useMemo e useState
import { AgGridReact } from "ag-grid-react"; // Importa componente AG Grid para React
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community"; // Importa módulo comunitário e registrador de módulos do AG Grid
import { data as metricas, meses } from "./constants"; // Importa dados de métricas e definição de meses/semanas
import { themeQuartz, iconSetQuartzLight } from "ag-grid-community"; // Importa tema Quartz e ícones para o Grid
import { Button } from "../ui/button"; // Importa componente Button da biblioteca interna de UI
import { IconEdit, IconFileDescription } from "@tabler/icons-react"; // Importa ícones de edição e descrição

ModuleRegistry.registerModules([AllCommunityModule]); // Regista módulo comunitário para uso no AG Grid

export default function Index() { // Define o componente funcional principal
  const generateColumns = () => { // Função para gerar definições de colunas
    const indicadoresÚltimaSemana = [ // Lista de métricas que usam valor da última semana preenchida
      "Stock Centros Logísticos em SAP",
      "Por Recuperar",
      "Stock Recuperados",
      "Stock Lojas",
      "Stock Geral",
    ];

    return [ // Retorna array de definições de colunas
      { // Definição de grupo para coluna 'Métrica'
        marryChildren: true, // Agrupa filhos para colapso
        headerClass: "bg-white text-black", // Classe CSS do cabeçalho
        children: [ // Colunas filhas desse grupo
          {
            field: "name", // Nome do campo ligado aos dados
            headerName: "Métrica", // Texto do cabeçalho
            pinned: "left", // Fixa a coluna à esquerda
            width: 200, // Largura da coluna em pixels
            cellStyle: { fontWeight: "bold", textAlign: "left" }, // Estilo das células
            filter: "agTextColumnFilter", // Filtro de texto
            valueFormatter: (params: { value: any }) => params.value, // Formata valor exibido
          },
        ],
      },
      ...meses.map((mes) => { // Mapeia cada mês para criar grupos de colunas
        const realMetric = metricas.find((m) => m.name === "Vendas Reais")!; // Obtém métrica de vendas reais
        const totalReal = mes.semanas.reduce( // Soma valores reais por semana
          (sum, sem) => sum + (realMetric.valores[mes.nome]?.[sem] ?? 0),
          0
        );
        const fcMetric = metricas.find((m) => m.name === "Forecast Vendas")!; // Obtém métrica de forecast
        const forecast = (fcMetric.valores as Record<string, number>)[mes.nome] ?? 0; // Valor do forecast mensal
        const pct = forecast > 0 ? (totalReal / forecast - 1) * 100 : 0; // Calcula variação percentual
        const pctStr = `${Math.round(pct)}%`; // Formata percentual como string

        return { // Retorna objeto de definição do grupo de colunas
          marryChildren: true, // Agrupa filhos
          openByDefault: false, // Grupo fechado por omissão
          columnGroupId: mes.nome, // ID do grupo de colunas
          headerName: pctStr, // Exibe variação percentual no cabeçalho
          headerStyle: { fontWeight: "", textAlign: "left" }, // Estilo do cabeçalho
          headerClass: [ // Classes CSS condicionais para cor de texto
            "bg-white ",
            "text-xs",
            pct > 0
              ? "text-red-500"
              : pct < 0
              ? "text-green-500"
              : "text-black",
          ].join(" "),
          children: [ // Definição das colunas internas (total e semanas)
            {
              headerName: mes.nome, // Cabeçalho da coluna total do mês
              field: `${mes.nome}_total`, // Campo de dados para total do mês
              headerStyle: { color: "white", backgroundColor: "#8EA9DB" }, // Estilo do cabeçalho
              valueGetter: (params: any) => { // Função para obter valor da célula
                const met = params.data.name as string; // Nome da métrica atual
                if (met === "Cobertura em Meses") { // Se for cobertura
                  return params.data[`${mes.nome}_total`]; // Retorna valor pré-calculado
                }
                if (indicadoresÚltimaSemana.includes(met)) { // Se usa última semana
                  // Procura a última semana com valor preenchido (diferente de 0 ou vazio)
                  let lastVal = 0;
                  for (let i = mes.semanas.length - 1; i >= 0; i--) {
                    const v = params.data[`${mes.nome}_${mes.semanas[i]}`];
                    if (v !== undefined && v !== null && v !== 0 && v !== "") {
                      lastVal = Number(v);
                      break;
                    }
                  }
                  return lastVal;
                }
                // Para outras métricas, soma todas as semanas
                return mes.semanas.reduce((sum, sem) => {
                  const v = params.data[`${mes.nome}_${sem}`]; // Valor da semana
                  return sum + (typeof v === "number" ? v : 0); // Soma se for número
                }, 0);
              },
              cellStyle: (params: any) => { // Estilo condicional para células
                if (
                  params.data.name === "Entradas em Stock" && // Se métrica for Entradas em Stock
                  typeof params.value === "number" && // E valor for número
                  params.value > 0 // E for maior que zero
                ) {
                  return { backgroundColor: "#D9D9D9", fontWeight: "bold" }; // Destaca celulas
                }
                return { background: "", fontWeight: "bold" }; // Estilo padrão
              },
              width: 100, // Largura fixa
            },
            ...mes.semanas.map((sem) => ({ // Colunas das semanas
              headerName: sem, // Cabeçalho com o número da semana
              field: `${mes.nome}_${sem}`, // Campo de dados correspondente
              columnGroupShow: "open", // Exibe quando grupo aberto
              editable: true, // Permite edição
              width: 90, // Largura da coluna
              cellStyle: (params: any) => { // Estilo condicional para células semanais
                if (
                  params.data.name === "Entradas em Stock" && // Se métrica for Entradas em Stock
                  params.data[`${mes.nome}_${sem}`] > 0 // E valor maior que zero
                ) {
                  return { backgroundColor: "#D9D9D9", fontWeight: "bold" }; // Destaca células
                }
                return {}; // Sem estilo adicional
              },
            })),
          ],
        };
      }),
    ]; // Fecha return de generateColumns
  };

  const generateRowData = () => { // Função para gerar dados das linhas
    const rows = metricas.map((metrica) => { // Mapeia cada métrica
      const row: any = { name: metrica.name }; // Cria objeto linha com nome da métrica
      for (const mes of meses) { // Para cada mês
        const nSem = mes.semanas.length; // Número de semanas no mês
        for (const sem of mes.semanas) { // Para cada semana
          if (metrica.name === "Forecast Vendas") { // Se métrica for Forecast Vendas
            const mensal = (metrica.valores as Record<string, number>)[mes.nome] || 0; // Valor mensal total
            row[`${mes.nome}_${sem}`] = +(mensal / nSem).toFixed(2); // Divide igualmente entre semanas
          } else { // Para outras métricas
            row[`${mes.nome}_${sem}`] =
              (metrica.valores as Record<string, Record<string, number>>)[mes.nome]?.[sem] ?? 0; // Valor semanal direto
          }
        }
      }
      return row; // Retorna linha completa
    });

    const centros = rows.find((r) => r.name === "Stock Centros Logísticos em SAP")!; // Linha de stock centros
    const lojas = rows.find((r) => r.name === "Stock Lojas")!; // Linha de stock lojas
    const geral: any = { name: "Stock Geral" }; // Cria linha de stock geral
    for (const mes of meses) { // Para cada mês e semana
      for (const sem of mes.semanas) {
        geral[`${mes.nome}_${sem}`] = // Soma centros + lojas
          (centros[`${mes.nome}_${sem}`] || 0) +
          (lojas[`${mes.nome}_${sem}`] || 0);
      }
    }
    rows.push(geral); // Adiciona linha geral ao array

    const forecastMonthly = metricas.find((m) => m.name === "Forecast Vendas")!.valores as Record<string, number>; // Valores mensais de forecast
    const cobertura: any = { name: "Cobertura em Meses" }; // Cria linha cobertura
    meses.forEach((mes, idx) => { // Para cada mês
      let stockMes = 0; // Descobre o stock geral na última semana preenchida deste mês
      for (let i = mes.semanas.length - 1; i >= 0; i--) {
        const v = geral[`${mes.nome}_${mes.semanas[i]}`];
        if (v !== undefined && v !== null && v !== 0 && v !== "") {
          stockMes = Number(v);
          break;
        }
      }
      const prox3 = meses.slice(idx + 1, idx + 4); // Próximos três meses
      const somaF = prox3.reduce((s, m) => s + (forecastMonthly[m.nome] || 0), 0); // Soma forecast próximos 3
      const avgF = prox3.length ? somaF / prox3.length : 0; // Média forecast
      cobertura[`${mes.nome}_total`] = avgF > 0 ? +(stockMes / avgF).toFixed(2) : 0; // Calcula cobertura
      mes.semanas.forEach((s) => (cobertura[`<missing code>`] = 0)); // Preenche semanas com zero
    });
    rows.push(cobertura); // Adiciona cobertura ao array

    return rows; // Retorna todas as linhas
  };

  const [rowData, setRowData] = useState(generateRowData()); // Estado que armazena dados das linhas
  const colDefs = useMemo(() => generateColumns(), []); // Memoria definição de colunas

  const defaultColDef = useMemo(() => ({ // Definição padrão aplicada a todas as colunas
    resizable: true, // Permite redimensionar colunas
    sortable: true, // Permite ordenar colunas
    cellClass: "ag-right-aligned", // Alinha células à direita
    valueFormatter: (params: any) => { // Formata valores numéricos
      const v = params.value;
      return v == null || v === "" ? "" : Number(v).toLocaleString("pt-PT", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 1,
      });
    },
  }), []);

  const myTheme = themeQuartz.withPart(iconSetQuartzLight).withParams({ // Personaliza tema Quartz do AG Grid
    backgroundColor: "#ffffff",
    browserColorScheme: "light",
    cellHorizontalPaddingScale: 0.1,
    columnBorder: true,
    fontFamily: "Arial",
    fontSize: 12,
    foregroundColor: "rgb(46, 55, 66)",
    headerBackgroundColor: "#0070C0",
    headerFontSize: 14,
    headerFontWeight: 600,
    headerTextColor: "#FFFFFF",
    oddRowBackgroundColor: "#F9FAFB",
    rowVerticalPaddingScale: 4.0,
    spacing: 1,
    rowBorder: false,
    pinnedRowBorder: false,
    wrapperBorder: false,
  });

  const onCellValueChanged = (e: any) => { // Handler para alterações em células
    const col = e.colDef.field; // Identifica coluna alterada
    const row = e.data; // Dados da linha alterada
    const newData = [...rowData]; // Clona dados atuais
    const geral = newData.find((r) => r.name === "Stock Geral")!; // Encontra linha geral
    const centros = newData.find((r) => r.name === "Stock Centros Logísticos em SAP")!; // Encontra linha centros
    const lojas = newData.find((r) => r.name === "Stock Lojas")!; // Encontra linha lojas
    const cobertura = newData.find((r) => r.name === "Cobertura em Meses")!; // Encontra linha cobertura
    const forecastMonthly = metricas.find((m) => m.name === "Forecast Vendas")!.valores as Record<string, number>; // Valores forecast mensais
    const [mesNome, semana] = col?.split("_") ?? []; // Extrai mês e semana do nome da coluna
    const isUltimaSemana = meses.some(
      (mes) => mes.nome === mesNome && semana === mes.semanas[mes.semanas.length - 1]
    ); // Verifica se é a última semana

    if (row.name === "Stock Lojas" || row.name === "Stock Centros Logísticos em SAP") {
      geral[col] = (centros[col] || 0) + (lojas[col] || 0); // Atualiza valor geral se lojas ou centros alterados
    }

    if (row.name === "Stock Geral" || row.name === "Stock Lojas" || row.name === "Stock Centros Logísticos em SAP") {
      meses.forEach((mes, idx) => { // Recalcula cobertura para cada mês
        let stockMes = 0;
        for (let i = mes.semanas.length - 1; i >= 0; i--) {
          const v = geral[`${mes.nome}_${mes.semanas[i]}`];
          if (v !== undefined && v !== null && v !== 0 && v !== "") {
            stockMes = Number(v);
            break;
          }
        }
        const prox3 = meses.slice(idx + 1, idx + 4);
        const somaF = prox3.reduce((s, m) => s + (forecastMonthly[m.nome] || 0), 0);
        const avgF = prox3.length ? somaF / prox3.length : 0;
        cobertura[`${mes.nome}_total`] = avgF > 0 ? +(stockMes / avgF).toFixed(2) : 0;
      });
    }

    setRowData(newData); // Atualiza estado com novos dados
  };

  return ( // Renderização JSX do componente
    <div style={{ width: "100%", height: `calc(83vh - 60px)` }}> 
      <div className="flex justify-end gap-2 text-zinc-500"> 
        <Button variant="ghost" size="sm"> 
          <IconEdit className="text-zinc-500" /> Editar
        </Button>
        <Button variant="ghost" size="sm"> 
          <IconFileDescription className="text-zinc-500" /> Detalhes
        </Button>
      </div>
      <div className="ag-theme-alpine" style={{ height: "100%", width: "100%", border: "none" }}> // Contêiner AG Grid com tema
        <AgGridReact // Componente AG Grid
          columnDefs={colDefs} // Definições de colunas
          rowData={rowData} // Dados das linhas
          defaultColDef={defaultColDef} // Definição padrão de colunas
          suppressColumnVirtualisation={true} // Desabilita virtualização de colunas
          onCellValueChanged={onCellValueChanged} // Handler para alterações de célula
          theme={myTheme} // Aplicação do tema customizado
        />
      </div>
    </div>
  );
}
