import { renderHome, renderChat, renderAbout, setupChatLogic } from './chat.js';

const root = document.getElementById('root');

const routes = {
    '/': renderHome,
    '/index.html': renderHome, // Soporte para Live Server
    '/chat': renderChat,
    '/about': renderAbout
};

window.navigateTo = (path) => {
    window.history.pushState({}, path, window.location.origin + path);
    handleRoute();
};

const handleRoute = () => {
    // Usamos location.pathname y forzamos a que si está vacío o es index, sea '/'
    let path = window.location.pathname;
    if (path === '/index.html' || path === '') path = '/';
    
    const renderFn = routes[path] || renderHome;
    
    // 1. Renderizar
    root.innerHTML = renderFn();

    // 2. Limpiar todos y asignar el activo con un pequeño delay para Mobile
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(btn => btn.classList.remove('active'));

    // Buscamos el ID basado en la ruta de forma más segura
    let activeId = 'nav-home'; // Por defecto
    if (path.includes('chat')) activeId = 'nav-chat';
    if (path.includes('about')) activeId = 'nav-about';

    const activeBtn = document.getElementById(activeId);
    if (activeBtn) {
        activeBtn.classList.add('active');
        // LOG PARA DEBUGEAR EN EL CELU:
        console.log("Ruta detectada:", path, "Botón activado:", activeId);
    }

    if (path.includes('chat')) {
        setupChatLogic();
    }
};

// Eventos de clics en el Nav
document.getElementById('nav-home').onclick = () => window.navigateTo('/');
document.getElementById('nav-chat').onclick = () => window.navigateTo('/chat');
document.getElementById('nav-about').onclick = () => window.navigateTo('/about');

// Manejo del botón atrás/adelante del navegador
window.onpopstate = handleRoute;

// Ejecución inicial para definir la vista y el botón activo
handleRoute();

// Control del Loader heróico
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('fade-out');
            // Re-ejecutamos para asegurar que los estilos de la vista activa carguen bien
            handleRoute(); 
        }, 1500);
    }
});