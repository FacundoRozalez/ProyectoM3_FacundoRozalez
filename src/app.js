import { getRouteData } from './services/router.js';
import { UIManager } from './services/uiManager.js';
import { setupChatLogic } from './views/chat/chat.js';

const root = document.getElementById('root');

const handleRoute = () => {
    const { renderFn, activeId, path } = getRouteData(window.location.pathname);
    
    // Usamos el UI Manager para actualizar la pantalla
    UIManager.renderView(root, renderFn());
    UIManager.updateNav(activeId);

    // Lógica específica
    if (path.includes('chat')) {
        setupChatLogic();
    }
};

window.navigateTo = (path) => {
    window.history.pushState({}, path, window.location.origin + path);
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