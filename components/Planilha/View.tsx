"use client";
import { TabItem, Tabs } from "flowbite-react";
import {
  HiDesktopComputer,
  HiServer,
  HiCalculator,
  HiOutlineSwitchHorizontal,
  HiOutlineWifi,
  HiOutlineStatusOnline,
} from "react-icons/hi";
import KPI from "./KPI";
import Index from ".";
import StockGanttGrid from "./StockDTH_FTTH";
import { useViewport } from "@/hook/ViewPort";

export default function Component() {
  const { height, screenHeight, dpr } = useViewport();

  console.log(screenHeight);
  const ratio = screenHeight >= 905 && dpr <= 2 ? 0.55 : 0.4;
  
  const mapHeight = Math.floor(height * ratio);

  const tabDefinitions = [
    {
      value: "DTH",
      label: "DTH",
      content: (
        <>
          <KPI />
          <Index />
        </>
      ),
      icon: HiDesktopComputer,
    },
    {
      value: "IPTV",
      label: "IPTV",
      content: (
        <>
          <KPI />
          <Index />
        </>
      ),
      icon: HiServer,
    },
    {
      value: "HGW",
      label: "HGW",
      content: (
        <>
          <KPI />
          <StockGanttGrid />
        </>
      ),
      icon: HiServer,
    },
    {
      value: "ONT",
      label: "ONT",
      content: <div>Conteúdo ONT…</div>,
      icon: HiServer,
    },
    {
      value: "RouterMesh",
      label: "RouterMesh",
      content: <div>Conteúdo Mesh…</div>,
      icon: HiServer,
    },
    {
      value: "ComandoDTH",
      label: "Comando DTH",
      content: <div>…</div>,
      icon: HiCalculator,
    },
    {
      value: "ComandoFTTH",
      label: "Comando FTTH",
      content: <div>…</div>,
      icon: HiCalculator,
    },
    {
      value: "Transformadores",
      label: "Transformadores",
      content: <div>…</div>,
      icon: HiOutlineSwitchHorizontal,
    },
    {
      value: "StockDTH",
      label: "Stock DTH",
      content: <div>…</div>,
      icon: HiOutlineStatusOnline,
    },
    {
      value: "StockFTTH",
      label: "Stock FTTH",
      content: <div>…</div>,
      icon: HiOutlineWifi,
    },
  ];
  return (
    <div className=""  >
      <Tabs
        aria-label=""
        variant="underline"
        className="h-20 pb-0 text-[1px] p-0"
        style={{ fontSize: "12px" }}
      >
        {tabDefinitions.map(({ value, content, label, icon }) => (
          <TabItem
            style={{ height: mapHeight }}
            active
            title={label}
            icon={icon}
            key={value}
            className="h-20 pb-0 text-[1px]" // também pode usar text-xs aqui se quiser menor ainda
          >
            {content}
          </TabItem>
        ))}
      </Tabs>
    </div>
  );
}
