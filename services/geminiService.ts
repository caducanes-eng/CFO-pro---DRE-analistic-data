// services/geminiService.ts

// Removed: import { GoogleGenAI } from "@google/genai";
// Removed: const API_KEY = process.env.API_KEY; // API Key is now managed by the calling component (App.tsx)

import { KPI } from '../types';
import { GoogleGenAI } from "@google/genai"; // Import locally for dynamic API key

export async function getAiAnalysis(kpis: KPI[]): Promise<string> {
  const API_KEY = process.env.API_KEY; // Access key just before use

  if (!API_KEY) {
    console.warn("Gemini API_KEY is not set. AI analysis will not be available.");
    return "API Key para Gemini não configurada. A análise de IA não está disponível.";
  }

  // Create a new GoogleGenAI instance right before making an API call
  // to ensure it always uses the most up-to-date API key from the dialog.
  const ai = new GoogleGenAI({ apiKey: API_KEY });

  const relevantKpis = kpis.filter(kpi => kpi.selected && kpi.value !== null && kpi.value !== undefined)
                           .map(kpi => `${kpi.name}: ${kpi.value?.toFixed(2)}${kpi.unit}`);

  if (relevantKpis.length === 0) {
    return "Não há KPIs selecionados ou dados suficientes para realizar uma análise de IA.";
  }

  const prompt = `
    Como um especialista em Business Intelligence, analise os seguintes KPIs de uma empresa lojista e forneça insights acionáveis e sugestões para melhoria.
    Considere os valores como sendo do mês ou período mais recente.
    ${relevantKpis.join('\n')}

    Foco em:
    - Identificar anomalias (valores muito altos ou baixos para o esperado em um varejo saudável).
    - Sugerir causas prováveis.
    - Oferecer ações corretivas ou estratégias.
    - Mantenha a resposta concisa, com no máximo 3-4 parágrafos.
    - Use uma linguagem motivacional e direta.
    - Use Português do Brasil.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview", // Using a general purpose model
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        temperature: 0.7,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 800, // Limit response length
      },
    });

    const aiText = response.text;
    if (aiText) {
      return aiText;
    } else {
      return "Análise de IA não retornou texto. Tente novamente mais tarde.";
    }
  } catch (error: unknown) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error && error.message.includes("Requested entity was not found.")) {
      // Race condition or invalid API key. Prompt user to re-select.
      // This part assumes window.aistudio is available in the environment.
      if (typeof window.aistudio !== 'undefined' && window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
        console.warn("API key might be invalid or expired. Prompting user to select new key.");
        window.aistudio.openSelectKey();
        return "Sua chave de API pode estar inválida. Por favor, selecione uma nova chave de API para ativar a análise de IA.";
      }
    }
    return `Erro ao gerar análise de IA: ${error instanceof Error ? error.message : String(error)}.`;
  }
}