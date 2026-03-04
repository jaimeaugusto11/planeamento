"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import { Order } from "@/components/OrderTable";
import { useEffect } from "react";

const shipIcon = L.icon({
  iconUrl: "/ship.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

type Props = {
  orders: Order[];
  selectedId: string | null;
};

function MapMarkers({ orders, selectedId }: Props) {
  const map = useMap();

  useEffect(() => {
    if (selectedId === null) {
      const bounds = L.latLngBounds(orders.map((o) => o.coords));
      map.fitBounds(bounds, { padding: [60, 60] });
    } else {
      const sel = orders.find((o) => o.id === selectedId);
      if (sel) {
        map.flyTo(sel.coords, 6, { duration: 1.5 });
      }
    }
  }, [orders, selectedId, map]);

  return (
    <>
      {orders.map((o) => (
        <Marker key={o.id} position={o.coords} icon={shipIcon}>
          <Popup className="font-bold">{<div className="space-y-1 text-sm">
              <strong>{o.label}</strong>
              <div>Model: {o.model}</div>
              <div>PO#: {o.poNumber || '—'}</div>
              <div>Supplier: {o.supplier}</div>
              <div>Units: {o.units}</div>
              <div>Amount: € {o.amount.toLocaleString()}</div>
              <div>Ex Factory: {o.exFactory}</div>
              <div>ETA: {o.eta || '—'}</div>
            </div> }</Popup>
        </Marker>
      ))}
    </>
  );
}

export default function OrderMap({ orders, selectedId }: Props) {
  const center = selectedId
    ? orders.find((o) => o.id === selectedId)?.coords ?? orders[0].coords
    : orders[0].coords;

  return (
    <MapContainer
      center={center}
      zoom={selectedId ? 6 : 2}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapMarkers orders={orders} selectedId={selectedId} />
    </MapContainer>
  );
}
