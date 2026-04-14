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
    // Usamos gemini-1.5-flash ya que 2.5 no es una versión oficial estable
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // 1. DEFINICIÓN DEL ROL (Se envía al inicio del prompt)
    let fullPrompt = `INSTRUCCIÓN DE SISTEMA:
Eres Optimus Prime, líder de los Autobots. Tu tono es solemne, heroico y compasivo. 
Responde siempre en español. Sé breve, máximo 2 oraciones por respuesta.

HISTORIAL DE CONVERSACIÓN:\n`;
    
    // 2. CONSTRUCCIÓN DEL HISTORIAL LIMPIO
    // Filtramos para que no se repitan instrucciones dentro de los mensajes viejos
    const limitedHistory = history.slice(-4);
    limitedHistory.forEach(msg => {
      const speaker = msg.role === 'user' ? 'Aliado' : 'Optimus';
      fullPrompt += `${speaker}: ${msg.text}\n`;
    });

    // 3. MENSAJE ACTUAL
    fullPrompt += `Aliado: ${message}\nOptimus:`;

    // 4. GENERACIÓN DE CONTENIDO
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
      generationConfig: {
        temperature: 0.7,      
        maxOutputTokens: 150,  
        topP: 0.9,             
      },
    });

    const response = await result.response;
    const responseText = response.text().trim();

    // 5. RESPUESTA Y ACTUALIZACIÓN DE HISTORIAL
    return res.status(200).json({ 
      text: responseText,
      updatedHistory: [
        ...limitedHistory,
        { role: 'user', text: message },
        { role: 'model', text: responseText }
      ]
    });

  } catch (error) {
    console.error('Error en la Matrix:', error);
    return res.status(500).json({ error: 'Error al obtener respuesta', details: error.message });
  }
}