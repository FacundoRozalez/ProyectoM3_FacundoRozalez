import { validateInput } from '../../utils/validators.js';

let conversationHistory = [];

export function setupChatLogic() {
    const btn = document.getElementById('send-btn');
    const input = document.getElementById('user-msg');
    const screen = document.getElementById('chat-screen');

    if (!btn) return;

    const renderHistory = () => {
        screen.innerHTML = conversationHistory.map(msg => `
            <div class="msg ${msg.role === 'user' ? 'user-msg' : 'prime-msg'}">
                <b>${msg.role === 'user' ? 'Tú' : 'Optimus'}:</b> ${msg.text}
            </div>
        `).join('');

        requestAnimationFrame(() => {
            screen.scrollTop = screen.scrollHeight;
        });
    };

    renderHistory();
 
    // PRUEBA CON RESPUESTAS ESTATICAS
    
    /* const optimusQuotes = [
        "La libertad es el derecho de todos los seres sintientes.",
        "Autobots, ¡transfórmense y avancen!",
        "No somos máquinas, somos más de lo que ves.",
        "El destino nos ha unido, joven aliado."
    ];

    const sendMessage = () => {
        const text = input.value;
        if (!validateInput(text)) return;

        conversationHistory.push({ role: 'user', text: text });
        renderHistory();
        
        setTimeout(() => {
            const reply = optimusQuotes[Math.floor(Math.random() * optimusQuotes.length)];
            conversationHistory.push({ role: 'model', text: reply });
            renderHistory();
        }, 600);

        input.value = '';
    }; */

    const sendMessage = async () => {
        const text = input.value;
        if (!validateInput(text)) return;

        // 1. Feedback inmediato: agregamos el mensaje del usuario
        conversationHistory.push({ role: 'user', text });
        renderHistory();
        input.value = '';

        // Bloqueamos el input mientras Optimus responde (buena práctica)
        input.disabled = true;

        try {
            const response = await fetch('/api/functions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: text,
                    history: conversationHistory.slice(0, -1) // Enviamos el historial acumulado
                })
            });

            if (!response.ok) throw new Error('Error en la comunicación con la Matrix');

            const data = await response.json();

            /**
             * 2. SINCRONIZACIÓN ROBUSTA:
             * Mapeamos el historial que devuelve el backend al formato plano
             * que usa tu función renderHistory.
             */
            conversationHistory = data.updatedHistory.map(msg => {
                // Buscamos el texto de forma segura en cualquier formato posible
                const content = msg.text || (msg.parts && msg.parts[0] && msg.parts[0].text) || "";
                return {
                    role: msg.role === 'user' ? 'user' : 'model',
                    text: content
                };
            });

            renderHistory();
        } catch (error) {
            console.error('Error:', error);
            conversationHistory.push({ role: 'model', text: 'La Matrix está desconectada. ¡Resistan!' });
            renderHistory();
        } finally {
            // Siempre desbloqueamos el input al terminar
            input.disabled = false;
            input.focus();
        }
    };

    btn.onclick = sendMessage;
    input.onkeydown = (e) => { if (e.key === 'Enter') sendMessage(); };
}