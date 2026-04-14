import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { message, history = [] } = req.body;
    
    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: 'Debes proporcionar un mensaje' });
    }
    
    // Inicializar Gemini (Tal cual tu ejemplo)
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash' 
    });
    
    // Construimos el prompt pegando el historial (Memoria)
    let promptContexto = "Eres Optimus Prime, líder de los Autobots. Responde de forma heroica, sabia y breve.\n";
    
    history.slice(-4).forEach(msg => {
      promptContexto += `${msg.role === 'user' ? 'Aliado' : 'Optimus'}: ${msg.text}\n`;
    });

    // Agregamos la pregunta actual
    const promptFinal = `${promptContexto}Aliado: ${message}\nOptimus:`;
    
    // Ejecución directa (Igual que en tu código de definiciones)
    const result = await model.generateContent(promptFinal);
    const response = await result.response;
    const responseText = response.text().trim();
    
    // Devolvemos la respuesta y el historial actualizado
    return res.status(200).json({ 
      text: responseText,
      updatedHistory: [
        ...history.slice(-4),
        { role: 'user', text: message },
        { role: 'model', text: responseText }
      ]
    });
    
  } catch (error) {
    console.error('Error llamando a Gemini:', error);
    return res.status(500).json({ 
      error: 'Error al obtener respuesta de la Matrix' 
    });
  }
}