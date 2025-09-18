"use client";

import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import carrosMaisVendidos from "@/data/carrosMaisVendidos.json";
import { Skeleton } from "@/components/ui/skeleton";

export interface InfoVeiculo {
  TipoVeiculo: number;
  Valor: string;
  Marca: string;
  Modelo: string;
  AnoModelo: number;
  Combustivel: string;
  CodigoFipe: string;
  MesReferencia: string;
  SiglaCombustivel: string;
}

export interface VeiculosTabelados {
  tipo: string;
  marca: string;
  modelo: string;
  ano: string;
  nome: string;
  valorMedio: string;
}

export default function Home() {
  const [taxaJuro, setTaxaJuro] = useState(1);
  const [prazo, setPrazo] = useState(1);

  const [veiculos, setVeiculos] = useState<InfoVeiculo[]>([]);

  useEffect(() => {
    const fecthPrecos = async () => {
      try {
        const resultados = await Promise.all(
          carrosMaisVendidos.map(async (carro) => {
            const res = await fetch(
              `https://parallelum.com.br/fipe/api/v1/${carro.tipo}/marcas/${carro.marca}/modelos/${carro.modelo}/anos/${carro.ano}`
            );
            const data = await res.json();
            return data;
          })
        );
        console.log(resultados);
        setVeiculos(resultados);
      } catch (error) {
        console.error("Erro ao buscar preços", error);
      }
    };

    fecthPrecos();
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto mt-6 p-4 min-h-screen">
      {/* Texto inicial da aplicação */}
      <p className="mb-6 text-gray-700 text-center md:text-left">
        Bem-vindo à calculadora de financiamento! Aqui você pode selecionar
        carros para simular parcelas, juros e valor total de financiamento. Você
        pode usar os 10 carros mais vendidos ou os carros que você consultou
        anteriormente.
      </p>

      {/* Calculadora e carros mais usados */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 p-4 border rounded-lg shadow-sm bg-white">
          <h2 className="text-lg dont-smibold mb-4"> Simulação financeira</h2>
          <label className="block mb-2">
            Taxa de juros por mês(%)
            <Input
              type="number"
              value={taxaJuro}
              className="mt-1 p-2 w-full border rounded"
              onChange={(e) => setTaxaJuro(Number(e.target.value))}
            />
          </label>
          <label className="block mb-4">
            Prazo (meses)
            <Input
              type="number"
              value={prazo}
              onChange={(e) => setPrazo(Number(e.target.value))}
              className="m1-1 p-2 w-full border rounded"
            />
          </label>

          {/* Lógica de colocar os carros mais vendidos */}
          <div className="w-full md:w-1/2 p-4 border rounded-lg shadow-sm bg-white">
            <h2 className="flex text-lg font-semibold mb-4 justify-center">
              Carros mais Vendidos
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {veiculos.length === 0 ? (
                <div className="grid grid-cols-4 gap-4">
                  <Skeleton className="h-[125px] w-[250px] rounded-xl" />
                  <Skeleton className="h-[125px] w-[250px] rounded-xl" />
                  <Skeleton className="h-[125px] w-[250px] rounded-xl" />
                  <Skeleton className="h-[125px] w-[250px] rounded-xl" />
                </div>
              ) : (
                veiculos.map((carro, index) => (
                  <div
                    key={index}
                    className="flex flex-col justify-center p-4 border rounded-lg shadow-sm bg-white hover:shadow-md transition cursor-pointer items-center"
                  >
                    <h4 className="font-medium text-gray-800">
                      {carro.Modelo}
                    </h4>
                    <p className="text-sm text-gray-600">
                      Preço Médio: {carro.Valor}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
