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
                <b>${msg.role === 'user' ? 'ALIADO' : 'OPTIMUS'}:</b> ${msg.text}
            </div>
        `).join('');

        requestAnimationFrame(() => {
            screen.scrollTop = screen.scrollHeight;
        });
    };

    const sendMessage = async () => {
        const text = input.value.trim();
        
        if (!validateInput(text)) return;

        // 1. Añadimos el mensaje del usuario y bloqueamos la interfaz
        conversationHistory.push({ role: 'user', text });
        renderHistory();
        
        input.value = '';
        input.disabled = true;
        btn.disabled = true;

        // 2. Indicador visual "épico" de carga
        const loadingMsg = { role: 'model', text: 'Procesando coordenadas de la Matrix...' };
        conversationHistory.push(loadingMsg);
        renderHistory();

        try {
            const response = await fetch('/api/functions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: text,
                    // Enviamos el historial real (sin el mensaje de "Procesando...")
                    history: conversationHistory.slice(0, -2) 
                })
            });

            const data = await response.json();
            
            // Quitamos el mensaje de carga antes de actualizar
            conversationHistory.pop();

            if (!response.ok) {
                throw new Error(data.error || 'Falla de comunicación');
            }

            // 3. Sincronizamos con el historial que devuelve el backend
            conversationHistory = data.updatedHistory;
            renderHistory();

        } catch (error) {
            console.error('Error de enlace:', error);
            // Limpiamos el mensaje de carga si falló
            if (conversationHistory[conversationHistory.length - 1].text.includes('Procesando')) {
                conversationHistory.pop();
            }
            conversationHistory.push({ role: 'model', text: 'Señal interrumpida. ¡Autobots, mantengan la posición!' });
            renderHistory();
        } finally {
            // 4. Liberamos los controles
            input.disabled = false;
            btn.disabled = false;
            input.focus();
        }
    };

    btn.onclick = sendMessage;
    input.onkeydown = (e) => { if (e.key === 'Enter') sendMessage(); };
    
    renderHistory();
}