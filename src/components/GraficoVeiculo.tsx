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
  valor: string;
};

export interface GraficoVeiculoProps {
  tipo: 'valor total' | 'juros', 
  veiculos: Veiculo[],
  style?: React.CSSProperties
}

interface VeiculoConfig {
  chave: string;
  legenda: string;
  valor: string;
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

  console.log(veiculosConfig,chartConfig, chartData)
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
            />
          }/>
          <CartesianGrid vertical={false} />
          {veiculosConfig.map(config => <Bar dataKey={config.chave} fill={`var(--color-${config.chave})`} radius={4} />)}
        </BarChart>
      </ChartContainer>
    </div>
  )
}

