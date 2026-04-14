import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { message, history = [] } = req.body;
    
    // Validamos que el mensaje sea texto real
    if (!message || String(message).trim().length === 0) {
      return res.status(400).json({ error: 'Debes proporcionar un mensaje' });
    }
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash' 
    });
    
    // 1. BLINDAJE DEL HISTORIAL: Forzamos String y filtramos nulos
    let promptContexto = "Eres Optimus Prime, líder de los Autobots. Responde de forma heroica, sabia y breve.\n";
    
    // Nos aseguramos de que history sea un array para evitar errores de .slice
    const cleanHistory = Array.isArray(history) ? history.slice(-4) : [];
    
    cleanHistory.forEach(msg => {
      const texto = String(msg.text || "");
      const rol = msg.role === 'user' ? 'Aliado' : 'Optimus';
      promptContexto += `${rol}: ${texto}\n`;
    });

    const promptFinal = `${promptContexto}Aliado: ${String(message)}\nOptimus:`;
    
    // 2. LLAMADA ROBUSTA: Enviamos el prompt estructurado
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: promptFinal }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 150,
      }
    });

    const response = await result.response;
    const responseText = response.text().trim();
    
    return res.status(200).json({ 
      text: responseText,
      updatedHistory: [
        ...cleanHistory,
        { role: 'user', text: String(message) },
        { role: 'model', text: responseText }
      ]
    });
    
  } catch (error) {
    console.error('Error llamando a Gemini:', error);
    // Devolvemos el error real para debuguear en la consola del navegador
    return res.status(500).json({ 
      error: 'Error al obtener respuesta de la Matrix',
      details: error.message 
    });
  }
}