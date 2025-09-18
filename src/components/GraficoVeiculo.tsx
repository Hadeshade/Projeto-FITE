'use client'
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import React, { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

const colors = [
  "#4285F4",
  "#DB4437",
  "#0F9D58",
  "#F4B400",
  "#AB47BC",
  "#00BCD4",
  "#E91E63",
  "#FFEB3B",
  "#795548",
  "#9E9E9E"
];

export interface Veiculo {
  nome: string;
  valor: number;
};

export interface GraficoVeiculoProps {
  tipo: 'Valor Total' | 'Parcela', 
  veiculos: Veiculo[],
  style?: React.CSSProperties
}

interface VeiculoConfig {
  chave: string;
  legenda: string;
  valor: number;
}

export default function GraficoVeiculo({ veiculos, style, tipo }: GraficoVeiculoProps) {
  const veiculosConfig = useMemo<VeiculoConfig[]>(
    () => veiculos.map((veiculo, i) => ({
      chave: `veiculo-${i}`,
      legenda: veiculo.nome,
      valor: veiculo.valor
    })
  ), [veiculos]);

  const chartConfig = useMemo<ChartConfig>(() => {
    const config: ChartConfig = {
      
    };
    veiculosConfig.forEach((veiculo, i) => {
      config[veiculo.chave] = {
        label: veiculo.legenda,
        color: colors[i]
      }
    });

    return config;
  }, [veiculosConfig]);

  const chartData = useMemo(() => {
    const data: Record<string, number | string> = {
      tipo
    }
    veiculosConfig.forEach(veiculo => {
      data[veiculo.chave] = veiculo.valor
    })

    return [data];
  }, [veiculosConfig]);

  return (
    <div style={style}>
      <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
        <BarChart accessibilityLayer data={chartData}>
          <XAxis
            dataKey="tipo"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <ChartTooltip content={
            <ChartTooltipContent
              formatter={(value, name, item) => <Indicator label={chartConfig[name].label as string} value={value as number} color={item.color as string} />}
            />
          }/>
          <CartesianGrid vertical={false} />
          {veiculosConfig.map(config => <Bar dataKey={config.chave} fill={`var(--color-${config.chave})`} radius={4} />)}
        </BarChart>
      </ChartContainer>
    </div>
  )
}

function Indicator({ label, value, color }: { label: string, value: number; color: string }) {
  return (
    <>
      <div
        className="shrink-0 rounded-[2px] border-(--color-border) bg-(--color-bg) h-2.5 w-2.5"
        style={
          {
            "--color-bg": color,
            "--color-border": color,
          } as React.CSSProperties
        }
      />
      <div
        className="flex flex-1 justify-between leading-none items-center"
      >
        <div className="grid gap-1.5">
          <span className="text-muted-foreground">
            {label}
          </span>
        </div>
        <span className="text-foreground font-mono font-medium tabular-nums">
          {value.toLocaleString("pt-BR", {currency: "BRL", style: "currency"})}
        </span>
      </div>
    </>
  )
}