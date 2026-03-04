// pages/index.tsx
"use client";

import { useState } from "react";
import OrderMap from "@/components/OrderMap";
import OrderList, { Order } from "@/components/OrderTable";
import { useViewport } from "@/hook/ViewPort";

// Dados das encomendas com localização e restantes campos
const ORDERS: Order[] = [
  {
    id: "IT-2303-L-11",
    model: "DTH",
    poNumber: "4500061445 (153.6K)",
    supplier: "INTEK",
    piNumber: "IT-2303-L-11",
    ivNumber: "230510-Z-02",
    amount: 337459.2,
    attachmentUrl: null,
    units: 15360,
    by: "SEA",
    exFactory: "2023-05-10",
    etd: null,
    eta: "2023-06-29",
    etaRe: null,
    status: null,
    month: null,
    year: null,
    coords: [34.0, -49.0], // Atlantic Ocean
    label: "IT-2303-L-11",
  },
  {
    id: "IT-2303-L-12",
    model: "DTH",
    poNumber: null,
    supplier: "INTEK",
    piNumber: "IT-2303-L-12",
    ivNumber: null,
    amount: 337459.2,
    attachmentUrl: null,
    units: 15360,
    by: "SEA",
    exFactory: "2023-05-10",
    etd: null,
    eta: "2023-06-29",
    etaRe: null,
    status: null,
    month: null,
    year: null,
    coords: [37.38843, 23.87123], // Pacific Ocean
    label: "IT-2303-L-12",
  },
  {
    id: "IT-2303-L-13",
    model: "DTH",
    poNumber: null,
    supplier: "INTEK",
    piNumber: "IT-2303-L-13",
    ivNumber: "230524-Z-03",
    amount: 337459.2,
    attachmentUrl: null,
    units: 15360,
    by: "SEA",
    exFactory: "2023-05-23",
    etd: null,
    eta: "2023-07-14",
    etaRe: null,
    status: null,
    month: null,
    year: null,
    coords: [60.0, -5.0], // North Atlantic
    label: "IT-2303-L-13",
  },
  {
    id: "IT-2305-L-14",
    model: "DTH",
    poNumber: null,
    supplier: "INTEK",
    piNumber: "IT-2305-L-14",
    ivNumber: "230607-Z-01",
    amount: 331776.0,
    attachmentUrl: null,
    units: 15360,
    by: "SEA",
    exFactory: "2023-06-07",
    etd: null,
    eta: "2023-07-29",
    etaRe: null,
    status: "Carga em armazém",
    month: null,
    year: null,
    coords: [0.0, -140.0], // Central Pacific
    label: "IT-2305-L-14",
  },
  {
    id: "IT-2305-L-15",
    model: "DTH",
    poNumber: null,
    supplier: "INTEK",
    piNumber: "IT-2305-L-15",
    ivNumber: "230620-Z-02",
    amount: 331776.0,
    attachmentUrl: null,
    units: 15360,
    by: "SEA",
    exFactory: "2023-06-20",
    etd: null,
    eta: "2023-08-13",
    etaRe: null,
    status: "Carga em armazém",
    month: null,
    year: null,
    coords: [-30.0, 50.0], // Indian Ocean
    label: "IT-2305-L-15",
  },
  {
    id: "IT-2305-L-16",
    model: "DTH",
    poNumber: null,
    supplier: "INTEK",
    piNumber: "IT-2305-L-16",
    ivNumber: null,
    amount: 331776.0,
    attachmentUrl: null,
    units: 15360,
    by: "SEA",
    exFactory: "2023-06-20",
    etd: null,
    eta: "2023-08-13",
    etaRe: null,
    status: "Carga em armazém",
    month: null,
    year: null,
    coords: [25.0, 90.0], // Bay of Bengal
    label: "IT-2305-L-16",
  },
];

export default function Page() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { height, screenHeight, dpr } = useViewport();

  // Ajusta a percentagem do mapa conforme resolução e DPR

  console.log(screenHeight);
  const ratio = screenHeight >= 905 && dpr <= 2 ? 0.55 : 0.4;
  const mapHeight = Math.floor(height * ratio);

  const handleSelect = (id: string) =>
    setSelectedId((prev) => (prev === id ? null : id));
  const handleDownload = (order: Order) =>
    order.attachmentUrl && window.open(order.attachmentUrl, "_blank");

  return (
    <div className="block p-4">
      {/* Mapa no topo com altura adaptável */}
      <div
        className="relative w-full overflow-hidden z-0"
        style={{ height: mapHeight }}
      >
        <OrderMap orders={ORDERS} selectedId={selectedId} />
      </div>

      {/* Tabela em baixo */}
      <div className="relative w-full z-10 mt-6">
        <OrderList
          orders={ORDERS}
          selectedId={selectedId}
          onSelect={handleSelect}
          onDownloadAttachment={handleDownload}
        />
      </div>
    </div>
  );
}
