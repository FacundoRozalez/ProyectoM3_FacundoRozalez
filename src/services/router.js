import { renderHome } from '../views/home/homeView.js';
import { renderChat } from '../views/chat/chatView.js';
import { renderAbout } from '../views/about/aboutView.js';

const routes = {
    '/': renderHome,
    '/index.html': renderHome,
    '/chat': renderChat,
    '/about': renderAbout
};

export const getRouteData = (path) => {
    // Normalización de la ruta
    let currentPath = (path === '/index.html' || path === '') ? '/' : path;
    
    // Determinamos el ID del botón activo
    let activeId = 'nav-home';
    if (currentPath.includes('chat')) activeId = 'nav-chat';
    if (currentPath.includes('about')) activeId = 'nav-about';

    return {
        renderFn: routes[currentPath] || renderHome,
        activeId,
        path: currentPath
    };
};