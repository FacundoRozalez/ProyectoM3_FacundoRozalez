import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { message, history = [] } = req.body;
    
    if (!message || message.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Debes proporcionar un mensaje' 
      });
    }
    
    // Inicializar Gemini con un modelo REAL
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash' // <--- ESTE es el modelo correcto y rápido
    });

    // Formatear el historial para que no rompa la Matrix
    const formattedHistory = history.slice(-4).map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: String(msg.text || "") }]
    }));
    
    // Instrucción de personalidad integrada en el inicio del chat
    const chat = model.startChat({
        history: formattedHistory,
        generationConfig: { maxOutputTokens: 100 }
    });

    // Prompt personalizado como Optimus
    const prompt = `Eres Optimus Prime. Responde de forma heroica y breve al siguiente mensaje: "${message}"`;
    
    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const responseText = response.text().trim();
    
    return res.status(200).json({ 
      text: responseText,
      updatedHistory: [
          ...formattedHistory,
          { role: "user", parts: [{ text: message }] },
          { role: "model", parts: [{ text: responseText }] }
      ]
    });
    
  } catch (error) {
    console.error('Error llamando a Gemini:', error);
    return res.status(500).json({ 
      error: 'Error al obtener respuesta de la Matrix',
      details: error.message 
    });
  }
}