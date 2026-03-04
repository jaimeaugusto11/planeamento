import React from "react";

export default function KPI() {
  const indicadores = [
    { label: "% Média YTD Real vs Forecast", valor: "7%" },
   // { label: "% Current △ Real vs Forecast", valor: "7%" },
    
  ];

  return (
    <div className="h-6">
      <div className="bg-[#0070C0]">
        <h2 className="text-white font-bold text-lg">
          KIT ZAP BOX HD + CARDLESS
        </h2>
      </div>
      <div className="pace-y-1">
        {indicadores.map((item, index) => (
          <div key={index} className="flex flex-row items-center text-[10px]  ">
            <span className="font-semibold">{item.label}:</span>
            <span className="bg-[#FFC000] text-black px-2 py-0.5 rounded font-medium">
              {item.valor}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
