"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";

export interface OpcaoFipe {
  nome: string;
  codigo: string;
}

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

export interface RespostaModeloFipe {
  modelos: OpcaoFipe[];
  anos: OpcaoFipe[];
}


export default function paginaConsulta() {
  const [tipo, setTipo] = useState<"carros" | "motos" | "caminhoes" | "">("");
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [ano, setAno] = useState("");

  // Arrays preenchidos com as respostas da API:
  const [marcas, setMarcas] = useState<OpcaoFipe[]>([]);
  const [modelos, setModelos] = useState<OpcaoFipe[]>([]);
  const [anos, setAnos] = useState<OpcaoFipe[]>([]);
  const [infoVeiculo, setInfoVeiculo] = useState<InfoVeiculo | null>(null);
  const [historico, setHistorico] = useState<InfoVeiculo[]>([]);


  useEffect(() => {
    if (infoVeiculo) {
      setHistorico((prev) => {
        const novo = [infoVeiculo, ...prev];

        // Limita a 10 itens
        return novo.slice(0, 10);
      });
    }
  }, [infoVeiculo]);

  // FUNÇÕES DE REQUISIÇÃO:
  // Definindo o tipo de veiculo:
  const handleTipoChange = async (value: string) => {
    setTipo(value);
    setMarca("");
    setModelo("");
    setAno("");
    setModelos([]);
    setAnos([]);
    setInfoVeiculo(null);

    const res = await fetch(
      `https://parallelum.com.br/fipe/api/v1/${value}/marcas`
    );
    const data = await res.json();
    setMarcas(data);
  };

  // Definindo a marca do veiculo escolhido:
  const handleMarcaChange = async (value: string) => {
    setMarca(value);
    setModelo("");
    setAno("");
    setAnos([]);
    setInfoVeiculo(null);

    const res = await fetch(
      `https://parallelum.com.br/fipe/api/v1/${tipo}/marcas/${value}/modelos`
    );
    const data = await res.json();
    setModelos(data.modelos);
  };

  // Definindo o modelo do veiculo escolhido:
  const handleModeloChange = async (value: string) => {
    setModelo(value);
    setAno("");
    setInfoVeiculo(null);
    const res = await fetch(
      `https://parallelum.com.br/fipe/api/v1/${tipo}/marcas/${marca}/modelos/${value}/anos`
    );
    const data = await res.json();
    setAnos(data);
  };

  const fetchInfoVeiculo = async (
    tipo: string,
    marca: string,
    modelo: string,
    ano: string
  ) => {
    try {
      const res = await fetch(
        `https://parallelum.com.br/fipe/api/v1/${tipo}/marcas/${marca}/modelos/${modelo}/anos/${ano}`
      );

      if (!res.ok) {
        throw new Error("Erro ao buscar dados da API FIPE");
      }

      const data: InfoVeiculo = await res.json();
      setInfoVeiculo(data);
    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  };

  // Definindo o veiculo em si, com as informações gerais dele:
  const handleVeiculoChange = (ano: string) => {
    setAno(ano);
    fetchInfoVeiculo(tipo, marca, modelo, ano);
  };


  return (
    <>
      <div className="w-full max-w-4xl mx-auto mt-6 p-6 rounded-2xl shadow-lg bg-white border border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h1>Consulte o veículo abaixo:</h1>
          {/*Tipo de Veiculo */}
          <Select onValueChange={handleTipoChange}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo de veículo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="carros">Carros</SelectItem>
              <SelectItem value="motos">Motos</SelectItem>
              <SelectItem value="caminhoes">Caminhôes</SelectItem>
            </SelectContent>
          </Select>

          {/*Marca do veiculo selecionada */}
          <Select onValueChange={handleMarcaChange} disabled={!tipo}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione a marca" />
            </SelectTrigger>
            <SelectContent>
              {marcas.map((m) => (
                <SelectItem key={m.codigo} value={m.codigo}>
                  {m.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/*Selecionar o modelo da marca selecionada*/}
          <Select onValueChange={handleModeloChange} disabled={!marca}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o modelo" />
            </SelectTrigger>
            <SelectContent>
              {modelos.map((m) => (
                <SelectItem key={m.codigo} value={m.codigo}>
                  {m.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/*Selecionar o Ano do modelo escolhido */}
          <Select onValueChange={handleVeiculoChange} disabled={!modelo}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o ano" />
            </SelectTrigger>
            <SelectContent>
              {anos.map((a) => (
                <SelectItem key={a.codigo} value={a.codigo}>
                  {a.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col justify-center">
          {/* Mostrar os Dados do veiculo */}
          {infoVeiculo ? (
            <div className="p-4 border rounded-lg shadow-sm bg-gray-50 space-y-2">
              <h3 className="text-lg font-semibold text-gray-800">
                {infoVeiculo.Marca} {infoVeiculo.Modelo}
              </h3>
              <p className="text-sm text-gray-600">
                Ano: {infoVeiculo.AnoModelo}
              </p>
              <p className="text-sm text-gray-600">
                Combustível: {infoVeiculo.Combustivel}
              </p>
              <p className="text-sm text-gray-600">
                Código FIPE: {infoVeiculo.CodigoFipe}
              </p>
              <p className="text-base font-bold text-green-600">
                Valor: {infoVeiculo.Valor}
              </p>
              <p className="text-xs text-gray-500">
                Referência: {infoVeiculo.MesReferencia}
              </p>
            </div>
          ) : (
            <p className="text-gray-400 italic text-center">
              Nenhum veículo selecionado ainda.
            </p>
          )}
        </div>
      </div>

      <div className="w-full max-w-4xl mx-auto mt-6">
        <h2 className="text-lg font-semibold mb-4 md:ml-4 text-center md:text-left">
          Histórico de Pesquisas
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {historico.map((item, index) => (
            <div
              key={index}
              className="p-4 border rounded-lg shadow-sm bg-white hover:shadow-md transition"
            >
              <h4 className="font-medium text-gray-800 truncate">
                {item.Marca} {item.Modelo}
              </h4>
              <p className="text-sm text-gray-600">Ano: {item.AnoModelo}</p>
              <p className="text-sm font-bold text-green-600">{item.Valor}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
