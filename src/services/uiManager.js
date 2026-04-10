export const UIManager = {
    renderView: (container, html) => {
        if (container) container.innerHTML = html;
    },

    updateNav: (activeId) => {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(btn => btn.classList.remove('active'));
        
        const activeBtn = document.getElementById(activeId);
        if (activeBtn) {
            activeBtn.classList.add('active');
            console.log("Botón activado:", activeId);
        }
    },

    handleLoader: (onComplete) => {
        window.addEventListener('load', () => {
            const loader = document.getElementById('loader');
            if (loader) {
                setTimeout(() => {
                    loader.classList.add('fade-out');
                    onComplete(); 
                }, 1500);
            }
        });
    }
};