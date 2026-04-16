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
    
    // 1. Formateamos el historial para Gemini
    const formattedHistory = history.slice(-6).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: String(msg.text) }]
    }));

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash', // Modelo estable y rápido
      systemInstruction: "Eres Optimus Prime. Responde de forma heroica y sabia. ¡IMPORTANTE!: Tus respuestas deben ser muy breves, de máximo dos oraciones."
    });

    const chat = model.startChat({
      history: formattedHistory,
      generationConfig: {
        temperature: 0.6,
        maxOutputTokens: 500, // Evita que el mensaje se corte
      },
    });

    const result = await chat.sendMessage(String(message));
    const responseText = result.response.text().trim();
    
    // 2. Construimos el historial actualizado para devolver al frontend
    const newHistory = [
      ...history, 
      { role: 'user', text: String(message) }, 
      { role: 'model', text: responseText }
    ];

    return res.status(200).json({ 
      text: responseText,
      updatedHistory: newHistory
    });
    
  } catch (error) {
    console.error('Error con Gemini:', error);
    return res.status(500).json({ 
      error: 'Fallo en la comunicación con la Matrix',
      details: error.message 
    });
  }
}