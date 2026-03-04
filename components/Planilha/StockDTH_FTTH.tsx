"use client";
import React, { useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import { themeQuartz } from "ag-grid-community";

ModuleRegistry.registerModules([AllCommunityModule]);

const forecastWeeks = Array.from({ length: 52 }, (_, i) => {
  const wk = (i + 1).toString().padStart(2, "0");
  return { field: `WK${wk}`, headerName: `WK${wk}` };
});

function calcularForecast(data) {
  return data.map((row) => {
    const exist =
      (row.stockLog || 0) +
      (row.consignados || 0) +
      (row.retornoCentros || 0) +
      (row.stockLocal || 0) +
      (row.stockAereo || 0) +
      (row.stockMaritimo || 0);

    const media =
      [1, 2, 3, 4, 5]
        .map((i) => row[`consSem${i}`] || 0)
        .reduce((a, b) => a + b, 0) / 5;

    let prev = exist;
    const forecast = {};
    forecastWeeks.forEach((week) => {
      const value = prev - media;
      forecast[week.field] = value;
      prev = value;
    });

    return { ...row, ...forecast };
  });
}

export default function StockGanttGrid() {
  const columnDefs = useMemo(
    () => [
      {
        headerName: "",
        children: [
          {
            field: "codigo",
            headerName: "Código Material",
            pinned: "left",
            width: 120,
          },
          {
            field: "descricao",
            headerName: "Descrição Material",
            pinned: "left",
            width: 240,
            filter: true,
          },
        ],
      },
      {
        children: [
          {
            field: "mediaPorIntervencoes",
            headerName: "Média por intervenções",
            width: 160,
            valueGetter: (params) => {
              const interv = params.data.intervencoes || 1;
              return params.data.instPrev / interv;
            },
            valueFormatter: (params) =>
              Number(params.value).toLocaleString("pt-PT", {
                maximumFractionDigits: 2,
              }),
          },
          {
            field: "stockLog",
            headerName: "Stock Centros Logísticos",
            width: 180,
            valueFormatter: (params) => params.value?.toLocaleString("pt-PT"),
          },
          {
            field: "consignados",
            headerName: "Consignados Carrinhas",
            width: 180,
            valueFormatter: (params) => params.value?.toLocaleString("pt-PT"),
          },
          {
            field: "retornoCentros",
            headerName: "Retorno aos Centros",
            width: 160,
          },
          {
            field: "stockLocal",
            headerName: "Stock em Trânsito (Compra Local)",
            width: 220,
          },
          { field: "etaLocal", headerName: "ETA", width: 100 },
          {
            field: "stockAereo",
            headerName: "Stock em Trânsito (Aéreo)",
            width: 200,
          },
          { field: "etaAereo", headerName: "ETA", width: 100 },
          {
            field: "stockMaritimo",
            headerName: "Stock em Trânsito (Marítimo)",
            width: 200,
          },
          { field: "etaMaritimo", headerName: "ETA", width: 100 },
          {
            field: "existenciasConsideravel",
            headerName: "Existências Considerável",
            width: 200,
            valueGetter: (params) => {
              const d = params.data;
              return (
                (d.stockLog || 0) +
                (d.consignados || 0) +
                (d.retornoCentros || 0) +
                (d.stockLocal || 0) +
                (d.stockAereo || 0) +
                (d.stockMaritimo || 0)
              );
            },
            valueFormatter: (params) => params.value?.toLocaleString("pt-PT"),
          },
          {
            field: "instPrev",
            headerName: "Instalações previstas com existências",
            width: 200,
            valueFormatter: (params) => params.value?.toLocaleString("pt-PT"),
          },
        ],
      },
      {
       
            marryChildren: true,
            openByDefault: false,
        children: [
          {
            field: "mediaConsSem",
            headerName: "Média de Consumo Semanal",
            width: 180,
            valueGetter: (params) => {
              const c = params.data;
              const sum = [1, 2, 3, 4, 5]
                .map((i) => c[`consSem${i}`] || 0)
                .reduce((a, b) => a + b, 0);
              return sum / 5;
            },
            valueFormatter: (params) =>
              Number(params.value).toLocaleString("pt-PT", {
                maximumFractionDigits: 1,
              }),
          },
          {
           

           
             columnGroupShow: "open",
            children: [
              {
                field: "consSem1",
                headerName: "Semana 1",
                width: 120,
                columnGroupShow: "open",
              },
              {
                field: "consSem2",
                headerName: "Semana 2",
                width: 120,
                columnGroupShow: "open",
              },
              {
                field: "consSem3",
                headerName: "Semana 3",
                width: 120,
                columnGroupShow: "open",
              },
              {
                field: "consSem4",
                headerName: "Semana 4",
                width: 120,
                columnGroupShow: "open",
              },
              {
                field: "consSem5",
                headerName: "Semana 5",
                width: 120,
                columnGroupShow: "open",
              },
            ],
          },
          {
            field: "mediaConsOper",
            headerName: "Média de Consumo Semanal Operações",
            width: 220,
            valueFormatter: (params) => params.value?.toLocaleString("pt-PT"),
          },
          {
            field: "mediaSaidaAnterior",
            headerName: "Média de Saída Anterior",
            width: 180,
            valueFormatter: (params) => params.value?.toLocaleString("pt-PT"),
          },
          {
            field: "varPerc",
            headerName: "Var (%)",
            width: 120,
            valueGetter: (params) => {
              const a = params.data.mediaConsOper || 0;
              const b = params.data.mediaSaidaAnterior || 1;
              return ((a - b) / b) * 100;
            },
            valueFormatter: (params) => `${params.value.toFixed(2)}%`,
          },
          {
            field: "rotWeeks",
            headerName: "Número de sem. face ao Stock",
            width: 180,
          },
          {
            field: "dataExpRutura",
            headerName: "Data Expectável de Rotura de Stock",
            width: 200,
            valueFormatter: (params) =>
              params.value
                ? new Date(params.value).toLocaleDateString("pt-PT")
                : "",
          },
          {
            field: "dataExpEncomenda",
            headerName: "Data Expectável para encomenda",
            width: 200,
            valueFormatter: (params) =>
              params.value
                ? new Date(params.value).toLocaleDateString("pt-PT")
                : "",
          },
          {
            field: "diasExpEncomenda",
            headerName: "Dias expectável para encomenda",
            width: 200,
            valueGetter: (params) => {
              if (!params.data.dataExpEncomenda) return null;
              const diffMs =
                new Date(params.data.dataExpEncomenda).getTime() -
                new Date().getTime();
              return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
            },
          },
        ],
      },
      {
       
        children: forecastWeeks.map((col) => ({
          ...col,
          width: 60,
          cellStyle: (params) =>
            params.value < 16
              ? { backgroundColor: "#a00", color: "#a00" }
              : { color: "white" },
          valueFormatter: (params) => Number(params.value).toFixed(0),
        })),
      },
    ],
    []
  );

  const rowData = useMemo(() => {
    const raw = [
      {
        codigo: "200 181",
        descricao: "Conector RJ45",
        intervencoes: 2,
        stockLog: 44,
        consignados: 0,
        retornoCentros: 5,
        stockLocal: 10,
        etaLocal: "2025-07-20",
        stockAereo: 0,
        etaAereo: "",
        stockMaritimo: 5000,
        etaMaritimo: "2025-07-25",
        instPrev: 60,
        consSem1: 467,
        consSem2: 523,
        consSem3: 964,
        consSem4: 276,
        consSem5: 505,
        mediaConsOper: 485,
        mediaSaidaAnterior: 520,
        rotWeeks: 0,
        dataExpRutura: "2025-07-15",
        dataExpEncomenda: "2025-07-18",
      },
      {
        codigo: "200 221",
        descricao: "Cabo drop Interior Branco",
        intervencoes: 4,
        stockLog: 80,
        consignados: 12,
        retornoCentros: 3,
        stockLocal: 20,
        etaLocal: "2025-07-22",
        stockAereo: 5,
        etaAereo: "2025-07-28",
        stockMaritimo: 4000,
        etaMaritimo: "2025-08-01",
        instPrev: 70,
        consSem1: 350,
        consSem2: 300,
        consSem3: 400,
        consSem4: 420,
        consSem5: 390,
        mediaConsOper: 372,
        mediaSaidaAnterior: 360,
        rotWeeks: 1,
        dataExpRutura: "2025-07-25",
        dataExpEncomenda: "2025-07-20",
      },
      {
        codigo: "200 222",
        descricao: "Cabo drop Exterior preto",
        intervencoes: 5,
        stockLog: 60,
        consignados: 15,
        retornoCentros: 5,
        stockLocal: 12,
        etaLocal: "2025-07-21",
        stockAereo: 8,
        etaAereo: "2025-07-30",
        stockMaritimo: 3000,
        etaMaritimo: "2025-08-03",
        instPrev: 90,
        consSem1: 400,
        consSem2: 410,
        consSem3: 390,
        consSem4: 420,
        consSem5: 405,
        mediaConsOper: 405,
        mediaSaidaAnterior: 390,
        rotWeeks: 2,
        dataExpRutura: "2025-07-27",
        dataExpEncomenda: "2025-07-22",
      },
      {
        codigo: "200 248",
        descricao: "Pigtail",
        intervencoes: 3,
        stockLog: 25,
        consignados: 10,
        retornoCentros: 2,
        stockLocal: 5,
        etaLocal: "2025-07-18",
        stockAereo: 0,
        etaAereo: "",
        stockMaritimo: 1000,
        etaMaritimo: "2025-07-29",
        instPrev: 50,
        consSem1: 200,
        consSem2: 180,
        consSem3: 220,
        consSem4: 210,
        consSem5: 190,
        mediaConsOper: 200,
        mediaSaidaAnterior: 210,
        rotWeeks: 1,
        dataExpRutura: "2025-07-22",
        dataExpEncomenda: "2025-07-19",
      },
      {
        codigo: "200 254",
        descricao: "Adaptador SC/APC com Orelha",
        intervencoes: 2,
        stockLog: 40,
        consignados: 5,
        retornoCentros: 4,
        stockLocal: 6,
        etaLocal: "2025-07-24",
        stockAereo: 200,
        etaAereo: "",
        stockMaritimo: 10,
        etaMaritimo: "2025-07-31",
        instPrev: 55,
        consSem1: 250,
        consSem2: 245,
        consSem3: 260,
        consSem4: 255,
        consSem5: 248,
        mediaConsOper: 50,
        mediaSaidaAnterior: 250,
        rotWeeks: 1,
        dataExpRutura: "2025-07-28",
        dataExpEncomenda: "2025-07-21",
      },
      {
        codigo: "200 262",
        descricao: "Cabo UTP Cat-6",
        intervencoes: 1,
        stockLog: 70,
        consignados: 5,
        retornoCentros: 6,
        stockLocal: 8,
        etaLocal: "2025-07-20",
        stockAereo: 0,
        etaAereo: "",
        stockMaritimo: 0,
        etaMaritimo: "",
        instPrev: 30,
        consSem1: 100,
        consSem2: 120,
        consSem3: 110,
        consSem4: 115,
        consSem5: 105,
        mediaConsOper: 50,
        mediaSaidaAnterior: 100,
        rotWeeks: 2,
        dataExpRutura: "2025-07-29",
        dataExpEncomenda: "2025-07-23",
      },
      // Adicione mais linhas se quiser
    ];

    return calcularForecast(raw);
  }, []);

  const myTheme = themeQuartz.withParams({
    backgroundColor: "#ffffff",
    browserColorScheme: "light",
    cellHorizontalPaddingScale: 0.1,
    columnBorder: true,
    fontFamily: "Arial",
    fontSize: 12,
    foregroundColor: "rgb(46, 55, 66)",
    headerBackgroundColor: "#0070C0",
    headerFontSize: 14,
    headerColumnResizeHandleWidth: 40,
    headerFontWeight: 400,
    headerTextColor: "#FFFFFF",
    oddRowBackgroundColor: "#F9FAFB",
    rowVerticalPaddingScale: 1.2,
    spacing: 1,
    wrapperBorder: true,
    rowBorder: true,
  });

  return (
    <div
      className="ag-theme-alpine"
      style={{ width: "100%", height: `calc(80vh - 60px)` }}
    >
      <AgGridReact
        columnDefs={columnDefs}
        rowData={rowData}
        defaultColDef={{
          resizable: true,
          sortable: true,
          wrapHeaderText: true,
          autoHeaderHeight: true,
          cellStyle: { whiteSpace: "normal" },
        }}
        theme={myTheme}
      />
    </div>
  );
}
