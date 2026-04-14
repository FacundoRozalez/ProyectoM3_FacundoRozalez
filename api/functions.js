import { GoogleGenerativeAI } from '@google/generative-ai';

// Configuración de Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    systemInstruction: "Eres Optimus Prime. Sé heroico, sabio y breve. Máximo 2 oraciones."
});

// MANEJADOR SERVERLESS (Vercel)
export default async function handler(req, res) {
    // Solo permitimos peticiones POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    try {
        const { message, history = [] } = req.body;

        // 1. Formateamos el historial para Gemini
        const formattedHistory = history.slice(-4).map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }]
        }));

        // 2. Iniciamos chat y enviamos mensaje
        const chat = model.startChat({
            history: formattedHistory,
            generationConfig: { maxOutputTokens: 80, temperature: 0.7 }
        });

        const result = await chat.sendMessage(message);
        const responseText = result.response.text();

        // 3. Devolvemos la respuesta y el historial actualizado
        return res.status(200).json({
            text: responseText,
            updatedHistory: [
                ...formattedHistory,
                { role: "user", parts: [{ text: message }] },
                { role: "model", parts: [{ text: responseText }] }
            ]
        });

    } catch (error) {
        console.error('Error en Optimus Prime:', error);
        return res.status(500).json({
            text: "La Matrix de Liderazgo tiene una falla técnica.",
            error: error.message
        });
    }
}