import { validateInput } from './utils.js';

// --- PUNTO 8: Historial persistente fuera de las funciones ---
let conversationHistory = []; 

export const renderHome = () => `
    <div class="view">
        <h1>SISTEMA OPERATIVO AUTOBOT</h1>
        <p>Saludos, aliado. Soy Optimus Prime. La Tierra está bajo nuestra protección.</p>
        <button class="btn-main" id="btn-to-chat">ESTABLECER VÍNCULO</button>
    </div>
`;

export const renderAbout = () => `
    <div class="view about-view">
        <header class="about-header">
            <h2>ARCHIVO DE DATOS: PRIME-001</h2>
        </header>
        <section class="about-content">
            <div class="card">
                <h3>DESIGNACIÓN</h3>
                <p>Optimus Prime</p>
            </div>
            <div class="card">
                <h3>AFILIACIÓN</h3>
                <p>Resistencia Autobot</p>
            </div>
            <div class="card">
                <h3>PROTOCOLO</h3>
                <p>Esta terminal utiliza inteligencia artificial de última generación para establecer un puente de comunicación con Cybertron.</p>
            </div>
        </section>
        <footer class="about-footer">
            <p>"La libertad es el derecho de todos los seres sintientes."</p>
        </footer>
    </div>
`;

export const renderChat = () => `
    <div id="chat-wrapper">
        <div id="chat-screen"></div>
        <div class="input-area">
            <input type="text" id="user-msg" placeholder="Enviar transmisión...">
            <button id="send-btn">ENVIAR</button>
        </div>
    </div>
`;

export function setupChatLogic() {
    const btn = document.getElementById('send-btn');
    const input = document.getElementById('user-msg');
    const screen = document.getElementById('chat-screen');

    if (!btn) return;

    // Función para dibujar el historial guardado (Punto 8)
    const renderHistory = () => {
        screen.innerHTML = conversationHistory.map(msg => `
            <div class="msg ${msg.role === 'user' ? 'user-msg' : 'prime-msg'}">
                <b>${msg.role === 'user' ? 'Tú' : 'Optimus'}:</b> ${msg.text}
            </div>
        `).join('');
        screen.scrollTop = screen.scrollHeight;
    };

    // Al cargar la vista de chat, mostramos los mensajes que ya existían
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

        // 1. Guardamos mensaje del usuario en el historial
        conversationHistory.push({ role: 'user', text: text });
        renderHistory();
        
        // 2. Respuesta de Optimus (Simulada con el array - Punto 4)
        setTimeout(() => {
            const reply = optimusQuotes[Math.floor(Math.random() * optimusQuotes.length)];
            
            // 3. Guardamos respuesta de Optimus en el historial
            conversationHistory.push({ role: 'model', text: reply });
            renderHistory();
        }, 600);

        input.value = '';
    };

    btn.onclick = sendMessage;
    input.onkeypress = (e) => { if(e.key === 'Enter') sendMessage(); };
}