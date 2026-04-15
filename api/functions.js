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
    
    // Usamos 1.5-flash para tener más mensajes disponibles y estabilidad
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      systemInstruction: "Eres Optimus Prime, líder de los Autobots. Tu tono es heroico, solemne, sabio y protector. Hablas de libertad, honor y la protección de la Tierra. Responde de forma clara pero inspiradora."
    });

    // Formateamos el historial al estándar de Google
    const formattedHistory = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    // Iniciamos el chat nativo
    const chat = model.startChat({
      history: formattedHistory,
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 500, // Aumentado para que no se corte
      },
    });

    const result = await chat.sendMessage(String(message));
    const responseText = result.response.text().trim();
    
    return res.status(200).json({ 
      text: responseText,
      // Devolvemos el historial actualizado para que el frontend lo guarde
      updatedHistory: [
        ...history,
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