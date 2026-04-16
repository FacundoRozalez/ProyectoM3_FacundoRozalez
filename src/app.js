import { getRouteData } from './services/router.js';
import { UIManager } from './services/uiManager.js';
import { setupChatLogic } from './views/chat/chat.js';

const root = document.getElementById('root');

const handleRoute = () => {
    const { renderFn, activeId, path } = getRouteData(window.location.pathname);
    
    UIManager.renderView(root, renderFn());
    UIManager.updateNav(activeId);

    // Lógica específica
    if (path.includes('chat')) {
        // Recuperamos el historial del estado del navegador
        const savedHistory = window.history.state?.history || [];
        setupChatLogic(savedHistory);
    }
};

window.navigateTo = (path) => {
    // IMPORTANTE: Antes de navegar, verificamos si ya existe historial en el estado actual
    // para no perder los mensajes al movernos entre "Home", "About" y "Chat".
    const currentHistory = window.history.state?.history || [];
    
    window.history.pushState({ history: currentHistory }, "", path);
    handleRoute();
};

// Eventos del Nav
document.getElementById('nav-home').onclick = () => window.navigateTo('/');
document.getElementById('nav-chat').onclick = () => window.navigateTo('/chat');
document.getElementById('nav-about').onclick = () => window.navigateTo('/about');

// Esto permite que el historial se recupere al usar las flechas del navegador (atrás/adelante)
window.onpopstate = (event) => {
    handleRoute();
};

// Inicialización
handleRoute();
UIManager.handleLoader(handleRoute);