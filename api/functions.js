import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { message, history = [] } = req.body;

    if (!message || String(message).trim().length === 0) {
      return res.status(400).json({ error: 'Debes proporcionar un mensaje' });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // 1. Limpiamos y limitamos el historial a los últimos 6 mensajes
    const limitedHistory = Array.isArray(history) ? history.slice(-6) : [];

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash', // Mantenemos tu versión 2.5
      systemInstruction: "Eres Optimus Prime. Responde de forma heroica y sabia. ¡IMPORTANTE!: Tus respuestas deben ser muy breves, de máximo dos oraciones."
    });

    // 2. CORRECCIÓN: Quitamos el error de dedo "limitedHistoryhistory"
    const formattedHistory = limitedHistory.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: String(msg.text) }]
    }));

    const chat = model.startChat({
      history: formattedHistory,
      generationConfig: {
        temperature: 0.6,
        maxOutputTokens: 300, // Optimizado para respuestas cortas
      },
    });

    const result = await chat.sendMessage(String(message));
    const responseText = result.response.text().trim();
    
    return res.status(200).json({ 
      text: responseText,
      updatedHistory: [
        ...history, // Mantenemos el historial completo para el frontend
        { role: 'user', text: String(message) },
        { role: 'model', text: responseText }
      ]
    });
    
  } catch (error) {
    console.error('Error con Gemini:', error);
    return res.status(500).json({ 
      error: 'Fallo en la comunicación con la Matrix',
      details: error.message 
    });
  }
}