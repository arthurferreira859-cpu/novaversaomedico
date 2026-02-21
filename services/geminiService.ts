
import { GoogleGenAI, Type } from "@google/genai";
import { TriageData, AiAnalysis } from "../types.ts";

export const analyzeSymptoms = async (data: TriageData): Promise<AiAnalysis> => {
  try {
    // Verificação defensiva: Obtém a chave do ambiente
    const apiKey = process.env.API_KEY;
    
    if (!apiKey) {
      console.warn("API_KEY não detectada no ambiente. Usando modo de simulação.");
      throw new Error("Missing API Key");
    }

    // Inicialização estritamente dentro da função chamada pelo clique do usuário
    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `
      Atue como um sistema de triagem médica. 
      Paciente: ${data.fullName}
      Sintomas: ${data.symptoms}
      Duração: ${data.duration}
      Dor: ${data.painLevel}/10
      
      Forneça: Urgência (Baixa/Média/Alta), Especialidade, Resumo e Recomendação.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            urgency: { type: Type.STRING, enum: ["Baixa", "Média", "Alta"] },
            specialty: { type: Type.STRING },
            summary: { type: Type.STRING },
            recommendation: { type: Type.STRING },
          },
          required: ["urgency", "specialty", "summary", "recommendation"],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("Empty AI response");
    
    return JSON.parse(text) as AiAnalysis;
  } catch (error) {
    console.error("Erro na triagem inteligente:", error);
    // Retorno de segurança para o usuário não ficar travado
    return {
      urgency: 'Média',
      specialty: 'Clínica Geral',
      summary: 'Análise automática indisponível. Recomendamos prosseguir para avaliação com médico humano.',
      recommendation: 'Inicie sua teleconsulta agora para uma avaliação profissional completa.'
    };
  }
};
