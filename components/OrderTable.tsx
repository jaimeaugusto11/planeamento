// components/OrderList.tsx
'use client';

import React, { useMemo, useState, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { themeQuartz, iconSetQuartzLight } from "ag-grid-community";

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import EditOrderModal from './EditOrderModal';

export interface Order {
  id: string;
  model: string;
  poNumber: string;
  supplier: string;
  piNumber: string;
  ivNumber: string;
  amount: number;
  attachmentUrl?: string;
  units: number;
  by: string;
  exFactory: string;
  etd: string;
  eta: string;
  etaRe: string;
  status: string;
  month: string;
  year: number;
  coords: [number, number];
  label: string;
}

type ListProps = {
  orders: Order[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onUpdate: (updated: Order) => void;
};

ModuleRegistry.registerModules([AllCommunityModule]);

export default function OrderList({
  orders,
  selectedId,
  onSelect,
  onUpdate,
}: ListProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  const statusVariant = useCallback((status: string) => {
    switch (status) {
      case 'Pending': return 'secondary';
      case 'In Transit': return 'blue';
      case 'Delivered': return 'success';
      case 'Cancelled': return 'destructive';
      default: return 'default';
    }
  }, []);

  const openModal = useCallback((order: Order) => {
    setCurrentOrder(order);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setCurrentOrder(null);
  }, []);

  // Definição das colunas
  const columnDefs = useMemo(() => [
    { field: 'model', headerName: 'Model', filter: 'agTextColumnFilter', sortable: true },
    { field: 'poNumber', headerName: 'PO#', filter: 'agTextColumnFilter', sortable: true },
    { field: 'supplier', headerName: 'Fornecedor', filter: 'agTextColumnFilter', sortable: true },
    {
      field: 'amount',
      headerName: 'Amount',
      filter: 'agNumberColumnFilter',
      sortable: true,
      cellRenderer: (params: { value: number | string }) => `€ ${Number(params.value).toLocaleString('pt-PT')}`,
      cellClass: 'ag-right-aligned',
    },
    {
      field: 'units',
      headerName: 'Units',
      filter: 'agNumberColumnFilter',
      sortable: true,
      cellClass: 'ag-right-aligned',
    },
    { field: 'exFactory', headerName: 'Ex Factory', filter: 'agTextColumnFilter', sortable: true },
    { field: 'etd', headerName: 'ETD', filter: 'agTextColumnFilter', sortable: true },
    { field: 'eta', headerName: 'ETA', filter: 'agTextColumnFilter', sortable: true },
    { field: 'etaRe', headerName: 'ETA_Re', filter: 'agTextColumnFilter', sortable: true },
    {
      field: 'status',
      headerName: 'Status',
      filter: 'agTextColumnFilter',
      sortable: true,
      cellRenderer: (params: { value: string }) => (
        <Badge variant={statusVariant(params.value) as any}>{params.value}</Badge>
      ),
    },
    {
      headerName: 'Actions',
      cellRenderer: (params: { data: Order }) => (
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            openModal(params.data);
          }}
        >
          Detalhes
        </Button>
      ),
    },
  ], [statusVariant, openModal]);

  const defaultColDef = useMemo(() => ({
    flex: 1,
    minWidth: 100,
    resizable: true,
    sortable: true,
    filter: true,
  }), []);

   const myTheme = themeQuartz.withPart(iconSetQuartzLight).withParams({
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
  
      rowVerticalPaddingScale: 4.7,
      spacing: 1.5,
  
      wrapperBorderRadius: 0,
    });

  return (
    <>
      <div className="ag-theme-alpine" style={{ height: 290, width: '100%' }}>
        <AgGridReact
          rowData={orders}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowSelection="single"
          onRowClicked={(e) => onSelect(e.data.id)}
          getRowClass={(params) =>
            params.data.id === selectedId ? 'bg-gray-100' : undefined
          }
          theme={myTheme}
        />
      </div>

      <EditOrderModal
        order={currentOrder}
        isOpen={modalOpen}
        onSave={(updated: Order) => {
          onUpdate(updated);
          closeModal();
        }}
        onClose={closeModal}
      />
    </>
  );
}
