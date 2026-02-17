
import { GoogleGenAI } from "@google/genai";
import { WorkLog, Staff } from "../types";

export const analyzeAttendance = async (logs: WorkLog[], staff: Staff[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const recentLogs = logs.slice(-50).map(l => ({
    name: l.staffName,
    type: l.type,
    time: new Date(l.timestamp).toLocaleString('es-ES')
  }));

  const prompt = `
    Como asistente de recursos humanos, analiza los siguientes registros de asistencia de los empleados:
    
    ${JSON.stringify(recentLogs)}
    
    Responde en español de forma profesional y concisa. 
    1. Identifica si hay alguien que olvidó marcar salida (registros IN sin un OUT posterior).
    2. Menciona quiénes han sido los más activos recientemente.
    3. Indica si hay patrones inusuales o anomalías en los horarios.
    4. Da un consejo breve para mejorar la puntualidad o gestión del tiempo.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "No se pudo realizar el análisis de IA en este momento.";
  }
};
