import { validateInput } from '../../utils/validators.js';

let conversationHistory = [];

export function setupChatLogic(savedHistory = []) {
    const btn = document.getElementById('send-btn');
    const input = document.getElementById('user-msg');
    const screen = document.getElementById('chat-screen');

    if (!btn || !input || !screen) return;

    // Cargamos el historial recuperado por el router
    conversationHistory = savedHistory;

    const renderHistory = () => {
        screen.innerHTML = conversationHistory.map(msg => `
            <div class="msg ${msg.role === 'user' ? 'user-msg' : 'prime-msg'}">
                <b>${msg.role === 'user' ? 'ALIADO' : 'OPTIMUS'}:</b> ${msg.text}
            </div>
        `).join('');
        
        screen.scrollTo({ top: screen.scrollHeight, behavior: 'smooth' });

        // Guardamos en la API de History cada vez que el chat cambia
        window.history.replaceState({ history: conversationHistory }, "");
    };

    // Renderizado inicial si hay historial previo
    if (conversationHistory.length > 0) renderHistory();

    const sendMessage = async () => {
        const text = input.value.trim();
        if (!validateInput(text)) return;

        // 1. Agregar mensaje del usuario localmente
        conversationHistory.push({ role: 'user', text });
        renderHistory();
        
        input.value = '';
        input.disabled = true;
        btn.disabled = true;

        // 2. Feedback visual de carga
        const loadingDiv = document.createElement('div');
        loadingDiv.id = 'temp-loading';
        loadingDiv.className = 'msg prime-msg';
        loadingDiv.innerHTML = '<b>OPTIMUS:</b> <span class="typing">Analizando transmisión...</span>';
        screen.appendChild(loadingDiv);
        screen.scrollTo({ top: screen.scrollHeight, behavior: 'smooth' });

        try {
            const response = await fetch('/api/functions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: text,
                    // Enviamos el historial excluyendo el mensaje que acabamos de pushear
                    history: conversationHistory.slice(0, -1)
                })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error);

            // 3. Limpiar el loading y actualizar historial con la respuesta del backend
            const tempLoading = document.getElementById('temp-loading');
            if (tempLoading) tempLoading.remove();

            conversationHistory = data.updatedHistory;
            renderHistory();

        } catch (error) {
            console.error('Error:', error);
            const tempLoading = document.getElementById('temp-loading');
            if (tempLoading) tempLoading.remove();
            
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