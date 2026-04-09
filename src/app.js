import { renderHome, renderChat, renderAbout, setupChatLogic } from './chat.js';

const root = document.getElementById('root');

const routes = {
    '/': renderHome,
    '/chat': renderChat,
    '/about': renderAbout
};

export const navigateTo = (path) => {
    window.history.pushState({}, path, window.location.origin + path);
    handleRoute();
};

const handleRoute = () => {
    const path = window.location.pathname;
    const renderFn = routes[path] || renderHome;
    
    root.innerHTML = renderFn();

    if (path === '/chat') {
        setupChatLogic();
    }
};

// Eventos de botones
document.getElementById('nav-home').onclick = () => navigateTo('/');
document.getElementById('nav-chat').onclick = () => navigateTo('/chat');
document.getElementById('nav-about').onclick = () => navigateTo('/about');

// Manejo del botón atrás/adelante (Punto 3)
window.onpopstate = handleRoute;

// Carga inicial
handleRoute();