export const renderHome = () => `
    <div class="view home-view">
        <div class="hero-container">
            <!-- Logo arriba y centrado -->
            <div class="autobot-logo-display"></div>
            
            <h1 class="glitch" data-text="FRECUENCIA AUTOBOT">FRECUENCIA AUTOBOT</h1>
            
            <p class="hero-text">
                "Soy Optimus Prime, y envío este mensaje a todos los Autobots supervivientes que se refugian entre las estrellas: estamos aquí, estamos esperando."
            </p>
            
            <p class="hero-subtext">
                "Este escudo es la promesa de proteger a los que no pueden defenderse por sí mismos."
            </p>

            <button class="btn-main pulse" onclick="window.navigateTo('/chat')">
                ESTABLECER COMUNICACIÓN CON OPTIMUS PRIME
            </button>
        </div>
    </div>
`;
