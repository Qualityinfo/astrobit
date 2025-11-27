import { MissionData } from "../types";

const MISSION_TEMPLATES: MissionData[] = [
  {
    title: "OPERAÇÃO: VÁCUO SILENCIOSO",
    description: "Sensores detectaram uma frota não autorizada entrando no Setor 7. A inteligência sugere que são a Vanguarda de Xylarth. Intercepte e destrua.",
    target: "Sobreviva o maior tempo possível."
  },
  {
    title: "PROTOCOLO: ESCUDO DE FERRO",
    description: "Uma armada pirata está tentando saquear as rotas comerciais de Orion. O comando central ordenou defesa imediata do perímetro.",
    target: "Elimine todas as ameaças hostis."
  },
  {
    title: "MISSÃO: TEMPESTADE NEGRA",
    description: "Sinais de socorro foram recebidos da estação de mineração Alpha. Inimigos desconhecidos estão convergindo para a localização.",
    target: "Proteja o setor a qualquer custo."
  },
  {
    title: "CÓDIGO: ESTRELA CAÍDA",
    description: "Restos de uma civilização antiga ativaram defesas automáticas agressivas. Sua nave é a única na área capaz de conter o avanço.",
    target: "Destrua as máquinas autônomas."
  },
  {
    title: "OPERAÇÃO: LÂMINA DE FOGO",
    description: "A elite imperial Zorgon rompeu o tratado de paz. Eles enviaram batedores e tanques pesados para testar nossas defesas.",
    target: "Mantenha a linha de frente."
  }
];

export const generateMissionBriefing = async (): Promise<MissionData> => {
  // Simula um pequeno atraso para manter o efeito de "decodificação" na UI
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const randomIndex = Math.floor(Math.random() * MISSION_TEMPLATES.length);
  return MISSION_TEMPLATES[randomIndex];
};