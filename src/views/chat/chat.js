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

    // OPTIMIZACIÓN: Esperamos al siguiente frame de renderizado
    requestAnimationFrame(() => {
        screen.scrollTop = screen.scrollHeight;
    });
    };

    renderHistory();

    const optimusQuotes = [
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
    };

    btn.onclick = sendMessage;
    input.onkeydown = (e) => { if(e.key === 'Enter') sendMessage(); };
}