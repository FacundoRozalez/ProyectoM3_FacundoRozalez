export default async function handler(req, res) {
  // Solo permitimos POST para que sea igual a la función real
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { message, history = [] } = req.body;

    // Lista de respuestas típicas de Optimus para el test
    const respuestasOptimus = [
      "La libertad es el derecho de todos los seres sentientes, aliado.",
      "Autobots, ¡transformense y avancen!",
      "Incluso en los momentos más oscuros, hay esperanza si luchamos juntos.",
      "He visto a la humanidad cometer errores, pero también he visto su bondad.",
      "Mantén la posición, guerrero. La Matrix nos guiará.",
      "Nuestra chispa brillará incluso cuando todo parezca perdido."
    ];

    // Elegimos una respuesta al azar de la lista
    const respuestaAleatoria = respuestasOptimus[Math.floor(Math.random() * respuestasOptimus.length)];

    // Simulamos un pequeño retraso de red (500ms) para que el frontend se sienta real
    await new Promise(resolve => setTimeout(resolve, 500));

    return res.status(200).json({ 
      text: `(MOCK) ${respuestaAleatoria}`,
      updatedHistory: [
        ...history,
        { role: 'user', text: String(message) },
        { role: 'model', text: respuestaAleatoria }
      ]
    });
    
  } catch (error) {
    return res.status(500).json({ error: 'Falla en el simulador de la Matrix' });
  }
}