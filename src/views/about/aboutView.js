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
