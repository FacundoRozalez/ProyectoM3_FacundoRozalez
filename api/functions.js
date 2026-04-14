import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    systemInstruction: "Eres Optimus Prime. Sé heroico, sabio y breve. Máximo 2 oraciones."
});

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    try {
        const { message, history = [] } = req.body;

        // ARREGLO 1: Mapeo robusto. Soporta si el historial viene con .text o .parts
        const formattedHistory = history.slice(-4).map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text || (msg.parts && msg.parts[0].text) || "" }]
        }));

        const chat = model.startChat({
            history: formattedHistory,
            generationConfig: { maxOutputTokens: 80, temperature: 0.7 }
        });

        // ARREGLO 2: Manejo de respuesta asíncrona correcto
        const result = await chat.sendMessage(message);
        const response = await result.response; // Esperamos la respuesta completa
        const responseText = response.text();   // Extraemos el texto

        // ARREGLO 3: Devolver el historial en el formato que espera tu frontend (plano)
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
            text: "La Matrix tiene una falla técnica.",
            error: error.message // Esto te ayudará a ver el error real en la respuesta de red
        });
    }
}