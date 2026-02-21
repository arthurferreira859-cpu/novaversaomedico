
export interface TriageData {
  fullName: string;
  cpf: string;
  email: string;
  phone: string;
  cep?: string;
  city: string;
  state: string;
  symptoms: string;
  duration: string;
  painLevel: number;
  selectedProblem?: string;
  previousDiagnosis?: string;
  otherSymptoms?: string;
  symptomsStartDate?: string;
  certificateDays?: number;
  preferredHospital?: string;
  priceLabel?: string;
  selectedBumps?: string[];
}

export interface AiAnalysis {
  urgency: 'Baixa' | 'Média' | 'Alta';
  specialty: string;
  summary: string;
  recommendation: string;
}

export enum Step {
  PROBLEMA = 1,
  CONTATO = 2,
  DIAGNOSTICO = 3,
  SINTOMAS = 4,
  DETALHES = 5,
  DADOS = 6,
  FINALIZACAO = 7,
}
