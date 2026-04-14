import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { message, history = [] } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Mensaje vacío' });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Instrucción de personalidad
    let fullPrompt = "Eres Optimus Prime, líder de los Autobots. Responde de forma heroica, sabia y breve. Máximo 2 oraciones.\n";
    
    // Construcción del hilo de conversación (Memoria)
    history.slice(-4).forEach(msg => {
      fullPrompt += `${msg.role === 'user' ? 'Aliado' : 'Optimus'}: ${msg.text}\n`;
    });

    fullPrompt += `Aliado: ${message}\nOptimus:`;

    // Llamada con configuración de temperatura y límites
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
      generationConfig: {
        temperature: 0.7,      // Controla la creatividad (0.7 es ideal para Optimus)
        maxOutputTokens: 100,  // Ahorra tokens limitando la longitud de respuesta
        topP: 0.9,             // Mejora la selección de palabras
      },
    });

    const response = await result.response;
    const responseText = response.text().trim();

    return res.status(200).json({ 
      text: responseText,
      updatedHistory: [
        ...history.slice(-4),
        { role: 'user', text: message },
        { role: 'model', text: responseText }
      ]
    });

  } catch (error) {
    console.error('Error en la Matrix:', error);
    return res.status(500).json({ error: 'Error al obtener respuesta', details: error.message });
  }
}