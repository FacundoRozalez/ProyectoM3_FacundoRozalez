import { validateInput } from './utils.js';

// --- PUNTO 8: Historial persistente fuera de las funciones ---
let conversationHistory = []; 

export const renderHome = () => `
    <div class="view home-view">
        <div class="hero-container">
            <!-- Logo arriba y centrado -->
            <div class="autobot-logo-display"></div>
            
            <h1 class="glitch" data-text="FRECUENCIA AUTOBOT">FRECUENCIA AUTOBOT</h1>
            
            <p class="hero-text">
                "Este escudo es la promesa de proteger a los que no pueden defenderse por sí mismos."
            </p>
            
            <p class="hero-subtext">
                Bajo esta insignia, yo, <strong>Optimus Prime</strong>, te doy la bienvenida. Mi chispa detecta tu nobleza.
            </p>

            <button class="btn-main pulse" onclick="window.navigateTo('/chat')">
                ESTABLECER COMUNICACIÓN CON OPTIMUS PRIME
            </button>
        </div>
    </div>
`;

export const renderAbout = () => `
    <div class="view about-view">
        <div class="about-card">
            <h2 class="about-title">NÚCLEO DE DATOS CYBERTRONIANO: PRIME-001</h2>
            
            <section class="about-info">
                <p><strong>Designación:</strong> Optimus Prime (Orión Pax)</p>
                <p><strong>Rango:</strong> Comandante Supremo Autobot</p>
                <p><strong>Sede:</strong> Base Autobot, Planeta Tierra</p>
            </section>

            <hr class="about-divider">

            <div class="about-system">
                <h3 class="system-title">SISTEMA DE COMUNICACIÓN</h3>
                <p>Esta terminal utiliza un enlace encriptado con <strong>Google Gemini AI</strong> para simular el procesador táctico del líder Autobot.</p>
                <p class="system-quote"><em>"Hasta que todos seamos uno."</em></p>
            </div>

            <button class="btn-main btn-full" onclick="window.navigateTo('/chat')">
                REGRESAR AL CANAL DE TRANSMISIÓN
            </button>
        </div>
    </div>
`;

export const renderChat = () => `
    <div id="chat-wrapper">
        <div id="chat-screen"></div>
        <div class="input-area">
            <input type="text" id="user-msg" placeholder="Encriptando mensaje...">
            <button id="send-btn">ENVIAR</button>
        </div>
    </div>
`;

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