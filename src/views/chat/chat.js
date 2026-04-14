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
        // Usamos tu validador importado
        if (!validateInput(text)) return;

        // 1. Agregamos el mensaje del usuario y bloqueamos la entrada
        conversationHistory.push({ role: 'user', text });
        renderHistory();
        
        input.value = '';
        input.disabled = true;
        btn.disabled = true;

        // 2. Indicador visual de carga
        const loadingMsg = { role: 'model', text: 'Analizando transmisiones...' };
        conversationHistory.push(loadingMsg);
        renderHistory();

        try {
            const response = await fetch('/api/functions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: text,
                    history: conversationHistory.slice(0, -2) // Quitamos el mensaje del usuario y el de "Analizando..."
                })
            });

            const data = await response.json();
            
            // Quitamos el mensaje de "Analizando..." para poner la respuesta real
            conversationHistory.pop();

            if (!response.ok) {
                throw new Error(data.details || 'Falla de comunicación');
            }

            // 3. Sincronizamos el historial con los datos limpios del servidor
            conversationHistory = data.updatedHistory;
            renderHistory();

        } catch (error) {
            console.error('Error en la Matrix:', error);
            // Si hubo error, quitamos el cargando y ponemos el aviso
            if (conversationHistory[conversationHistory.length - 1].text === 'Analizando transmisiones...') {
                conversationHistory.pop();
            }
            conversationHistory.push({ role: 'model', text: 'Enlace perdido. ¡Autobots, resistan!' });
            renderHistory();
        } finally {
            // 4. Reactivamos la interfaz
            input.disabled = false;
            btn.disabled = false;
            input.focus();
        }
    };

    // Eventos
    btn.onclick = sendMessage;
    input.onkeydown = (e) => { if (e.key === 'Enter') sendMessage(); };
    
    // Renderizado inicial (por si hay algo guardado)
    renderHistory();
}