import { GoogleGenerativeAI } from '@google/generative-ai';

// Inicializamos la chispa suprema
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    systemInstruction: "Eres Optimus Prime, líder de los Autobots. Responde con sabiduría, valor y brevedad. La libertad es tu prioridad. Máximo 2 oraciones."
});

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Solo comunicaciones de alto nivel (POST) permitidas.' });
    }

    try {
        const { message, history = [] } = req.body;

        // Limpiamos el historial para que Google no detecte errores de transmisión
        const formattedHistory = history.slice(-4).map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: String(msg.text || "") }]
        }));

        const chat = model.startChat({
            history: formattedHistory,
            generationConfig: { maxOutputTokens: 100, temperature: 0.7 }
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const responseText = response.text();

        return res.status(200).json({
            text: responseText,
            updatedHistory: [
                ...formattedHistory,
                { role: "user", parts: [{ text: message }] },
                { role: "model", parts: [{ text: responseText }] }
            ]
        });

    } catch (error) {
        console.error('Falla en la Matrix:', error.message);
        return res.status(500).json({
            text: "La Matrix de Liderazgo detecta una interferencia. ¡Autobots, resistan!",
            details: error.message 
        });
    }
}