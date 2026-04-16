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
        // CAMBIO AQUÍ: Recuperamos el historial del estado del navegador
        // y se lo pasamos a la función.
        const savedHistory = window.history.state?.history || [];
        setupChatLogic(savedHistory);
    }
};

window.navigateTo = (path) => {
    // Al navegar, creamos la nueva entrada con un estado inicial
    window.history.pushState({ history: window.history.state?.history || [] }, "", path);
    handleRoute();
};

// Eventos del Nav
document.getElementById('nav-home').onclick = () => window.navigateTo('/');
document.getElementById('nav-chat').onclick = () => window.navigateTo('/chat');
document.getElementById('nav-about').onclick = () => window.navigateTo('/about');

window.onpopstate = handleRoute;

// Inicialización
handleRoute();
UIManager.handleLoader(handleRoute);