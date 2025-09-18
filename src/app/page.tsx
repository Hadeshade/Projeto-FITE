"use client";

import { Input } from "@/components/ui/input";
import { useContext, useEffect, useState } from "react";
import carrosMaisVendidos from "@/data/carrosMaisVendidos.json";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import GraficoVeiculo from "@/components/GraficoVeiculo";

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

export interface ResultadoSimulacao {
  carro: string;
  parcela: number;
  totalPago: number;
  totalJuros: number;
}

export default function Home() {
  const [erroApi, setErroApi] = useState<string | null>(null);
  // Para a logica dos Veiculos:
  const [veiculos, setVeiculos] = useState<InfoVeiculo[]>([]);
  const [histVeiculos, setHistVeiculos] = useState<InfoVeiculo[]>([]);
  const [semHist, setSemHist] = useState(false);

  // Para a calculadora Financeira:
  const [taxaJuro, setTaxaJuro] = useState(1.49);
  const [prazo, setPrazo] = useState(12);
  const [selecionados, setSelecionados] = useState<InfoVeiculo[]>([]);
  const [resultados, setResultados] = useState<ResultadoSimulacao[]>([]);

  // Logica de aparecer carros mais vendidos
  // com tratamento de erro de requisicao de API
  let conteudo;
  if (veiculos.length === 0) {
    if (erroApi) {
      conteudo = <div> {erroApi}</div>;
    } else {
      conteudo = (
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-[125px] w-[250px] rounded-xl" />
          <Skeleton className="h-[125px] w-[250px] rounded-xl" />
          <Skeleton className="h-[125px] w-[250px] rounded-xl" />
          <Skeleton className="h-[125px] w-[250px] rounded-xl" />
        </div>
      );
    }
  } else {
    conteudo = veiculos.map((carro, index) => (
      <div
        key={index}
        onClick={() =>
          setSelecionados((prev) =>
            prev.includes(carro)
              ? prev.filter((c) => c !== carro)
              : [...prev, carro].slice(0, 10)
          )
        }
        className={`flex flex-col justify-center p-4 border rounded-lg shadow-sm bg-white hover:shadow-md transition cursor-pointer items-center ${
          selecionados.includes(carro) ? "ring-2 ring-blue-500" : ""
        }`}
      >
        <h4 className="font-medium text-gray-800">
          {carro.Marca} {carro.Modelo}
        </h4>
        <p className="text-sm text-gray-600">Preço Médio: {carro.Valor}</p>
      </div>
    ));
  }

  // Lógica de pegar os dados no LocalStorage
  useEffect(() => {
    const fetchHistorico = async () => {
      try {
        const armazenado = localStorage.getItem("historicoFipe");
        if (armazenado) {
          setHistVeiculos(JSON.parse(armazenado));
          return;
        }
      } catch (error) {
        setSemHist(true);
      }
    };

    fetchHistorico();
  }, []);

  // Logica para pegar o JSON dos carros mais vendidos
  // e usar a API para printar os dados na tela
  useEffect(() => {
    const fecthPrecos = async () => {
      try {
        const resultados = await Promise.all(
          carrosMaisVendidos.map(async (carro) => {
            const res = await fetch(
              `https://parallelum.com.br/fipe/api/v1/${carro.tipo}/marcas/${carro.marca}/modelos/${carro.modelo}/anos/${carro.ano}`
            );

            if (!res.ok) {
              const errorData = await res.json();
              throw new Error(errorData.error || "Erro na API FIPE");
            }

            const data = await res.json();
            return data;
          })
        );
        setVeiculos(resultados);
      } catch (error: any) {
        console.error("Erro ao buscar preços", error.message);
        setErroApi(
          "Limite de consultas diária foi atingido, tente novamente outro dia."
        );
      }
    };

    fecthPrecos();
  }, []);

  // Logica da calculadora:
  const calcularFinanciamento = () => {
    if (selecionados.length === 0) {
      toast("Selecione algum carro/veiculo", {
        description:
          "Escolha algum do histórico abaixo ou da lista de mais vendidos",
        action: {
          label: "OK",
          onClick: () => console.log("OK"),
        },
      });
      return;
    }
    const taxa = taxaJuro / 100;
    const meses = prazo;

    const novosResultados = selecionados.map((carro) => {
      const valor = Number(
        carro.Valor.replace("R$ ", "").replace(".", "").replace(",", ".")
      );

      const parcela = (valor * taxa) / (1 - Math.pow(1 + taxa, -meses));
      const totalPago = parcela * meses;
      const totalJuros = totalPago - valor;

      return {
        carro: `${carro.Marca} ${carro.Modelo} - ${carro.AnoModelo}`,
        parcela,
        totalPago,
        totalJuros,
      };
    });
    setResultados(novosResultados);
    // setSelecionados([]);
  };

  return (
    <div className="w-full max-w-6xl mx-auto mt-6 p-4 min-h-screen">
      {/* Texto inicial da aplicação */}
      <p className="mb-6 text-gray-700 text-center md:text-left">
        Bem-vindo à calculadora de financiamento! Aqui você pode selecionar
        carros para simular parcelas, juros e valor total de financiamento. Você
        pode selecionar um ou todos dos 10 carros mais vendidos ou os veúculos
        que você consultou na página de Consulta.
      </p>

      {/* Calculadora e resultados*/}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/*Primeiro: Calculadora */}
        <div className="p-4 border rounded-lg shadow-sm bg-white">
          <h2 className="text-lg font-semibold mb-4"> Simulação financeira</h2>
          <label className="block mb-2">
            Taxa de juros por mês(%)
            <Input
              type="number"
              value={taxaJuro}
              className="mt-1 p-2 w-full border rounded text-right"
              onChange={(e) => setTaxaJuro(Number(e.target.value))}
            />
          </label>
          <label className="block mb-4">
            Prazo (meses)
            <Input
              type="number"
              value={prazo}
              onChange={(e) => setPrazo(Number(e.target.value))}
              className="m1-1 p-2 w-full border rounded text-right"
            />
          </label>
          <Button
            className="w-full bg-blue-600 text-white hover:bg-blue-800"
            onClick={calcularFinanciamento}
          >
            {" "}
            Calcular
          </Button>
        </div>

        {/*Resultados printados simples: */}
        <div className="p-4 border rounded-lg shadow-sm bg-white">
          <h2 className="text-lg font-semibold mb-4">Resultado:</h2>
          {resultados.length > 0 && (
            <div
              className={`grid gap-4 max-h-55 overflow-y-auto pr-2 ${
                resultados.length === 1
                  ? "grid-cols-1"
                  : "grid-cols-1 md:grid-cols-2"
              }`}
            >
              {resultados.map((res, i) => (
                <div
                  key={i}
                  className="text-center p-4 border rounded-lg shadow bg-gray-100 w-full max-w-xs"
                >
                  <h4 className="font-medium">{res.carro}</h4>
                  <p>
                    Parcela{" "}
                    {res.parcela.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </p>
                  <p>
                    Total Pago:{" "}
                    {res.totalPago.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </p>
                  <p className="text-red-500">
                    Juros Totais:{" "}
                    {res.totalJuros.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lógica de colocar os carros mais vendidos e o Historico de Veiculos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/*Historico de Carros */}
        <div className="p-4 border rounded-lg shadow-sm bg-white">
          <h2 className="text-lg font-semibold mb-4">
            {" "}
            Histórico de consultas de veículos:
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {histVeiculos.length === 0 ? (
              <p className="text-gray-500">Nenhum histórico encontrado.</p>
            ) : (
              histVeiculos.map((carro, index) => (
                <div
                  key={index}
                  onClick={() =>
                    setSelecionados((prev) =>
                      prev.includes(carro)
                        ? prev.filter((c) => c !== carro)
                        : [...prev, carro].slice(0, 10)
                    )
                  }
                  className={`flex flex-col justify-center p-4 border rounded-lg shadow-sm bg-white hover:shadow-md transition cursor-pointer items-center ${
                    selecionados.includes(carro) ? "ring-2 ring-green-500" : ""
                  }`}
                >
                  <h4 className="font-medium text-gray-800">
                    {carro.Marca} {carro.Modelo}
                  </h4>
                  <p className="text-sm text-gray-600">
                    Preço Médio: {carro.Valor}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/*Carros mais vendidos */}
        <div className="p-4 border rounded-lg shadow-sm bg-white">
          <h2 className="text-lg font-semibold mb-4">Carros mais Vendidos</h2>
          <div
            className={` gap-4 ${
              erroApi
                ? "grid-cols-1 text-center items-center"
                : "grid grid-cols-2"
            }`}
          >
            {/* Carros mais vendidos */}
            {conteudo}
          </div>
        </div>
      </div>

      {/* Onde estão os gráficos */}
      {resultados.length >= 2 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <GraficoVeiculo
            tipo="Valor Total"
            veiculos={resultados.map((s) => ({
              nome: s.carro,
              valor: s.totalPago,
            }))}
          />
          <GraficoVeiculo
            tipo="Parcela"
            veiculos={resultados.map((s) => ({
              nome: s.carro,
              valor: s.parcela,
            }))}
          />
        </div>
      )}
    </div>
  );
}
