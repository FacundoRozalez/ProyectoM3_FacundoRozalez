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
