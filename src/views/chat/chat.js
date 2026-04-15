import { validateInput } from '../../utils/validators.js';

let conversationHistory = [];

export function setupChatLogic() {
    const btn = document.getElementById('send-btn');
    const input = document.getElementById('user-msg');
    const screen = document.getElementById('chat-screen');

    if (!btn || !input || !screen) return;

    const renderHistory = () => {
        screen.innerHTML = conversationHistory.map(msg => `
            <div class="msg ${msg.role === 'user' ? 'user-msg' : 'prime-msg'}">
                <b>${msg.role === 'user' ? 'ALIADO' : 'OPTIMUS'}:</b> ${msg.text}
            </div>
        `).join('');
        
        // Scroll suave al final
        screen.scrollTo({ top: screen.scrollHeight, behavior: 'smooth' });
    };

    const sendMessage = async () => {
        const text = input.value.trim();
        if (!validateInput(text)) return;

        // 1. Mostrar mensaje del usuario inmediatamente
        conversationHistory.push({ role: 'user', text });
        renderHistory();
        
        input.value = '';
        input.disabled = true;
        btn.disabled = true;

        // 2. Placeholder de "escribiendo"
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'msg prime-msg';
        loadingDiv.innerHTML = '<b>OPTIMUS:</b> <span class="typing">Analizando transmisión...</span>';
        screen.appendChild(loadingDiv);

        try {
            const response = await fetch('/api/functions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: text,
                    // Enviamos el historial previo (sin el mensaje actual que acabamos de pushear)
                    history: conversationHistory.slice(0, -1)
                })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error);

            // 3. Actualizamos el historial con la respuesta real
            conversationHistory = data.updatedHistory;
            renderHistory();

        } catch (error) {
            console.error('Error:', error);
            conversationHistory.push({ role: 'model', text: 'Interferencia en la Matrix. ¡Resistan!' });
            renderHistory();
        } finally {
            input.disabled = false;
            btn.disabled = false;
            input.focus();
        }
    };

    btn.onclick = sendMessage;
    input.onkeydown = (e) => { if (e.key === 'Enter') sendMessage(); };
}