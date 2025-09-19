"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { InfoVeiculo } from "@/app/page";

type HistoricoContextType = {
  historico: InfoVeiculo[];
  adicionarHistorico: (novo: InfoVeiculo) => void;
  limparHistorico: () => void;
};

const HistoricoContext = createContext<HistoricoContextType | undefined>(undefined);

export function HistoricoProvider({ children }: { children: ReactNode }) {
  const [historico, setHistorico] = useState<InfoVeiculo[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("historicoFipe");
    if (saved) setHistorico(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (historico.length > 0) {
      localStorage.setItem("historicoFipe", JSON.stringify(historico));
    }
  }, [historico]);

  const adicionarHistorico = (novo: InfoVeiculo) => {
    setHistorico((prev) => {
      if (prev[0]?.CodigoFipe === novo.CodigoFipe) return prev;
      const atualizado = [novo, ...prev].slice(0, 10);
      localStorage.setItem("historicoFipe", JSON.stringify(atualizado));
      return atualizado;
    });
  };

  const limparHistorico = () => {
    localStorage.removeItem("historicoFipe");
    setHistorico([]);
  }

  return (
    <HistoricoContext.Provider
      value={{ historico, adicionarHistorico, limparHistorico }}
    >
      {children}
    </HistoricoContext.Provider>
  );
}

export function useHistorico() {
  const context = useContext(HistoricoContext);
  if (!context)
    throw new Error("useHistorico precisa estar dentro do HistoricoProvider");
  return context;
}


