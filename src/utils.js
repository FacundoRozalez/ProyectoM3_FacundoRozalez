// 1. Validar que el mensaje no esté vacío
export const validateInput = (text) => {
    return typeof text === 'string' && text.trim().length > 0;
};

// 2. Formatear el nombre del personaje (estética Autobot)
export const formatName = (name) => {
    return name ? `[${name.toUpperCase()}]` : 'DESCONOCIDO';
};

// 3. Limpiar el historial (por si el usuario ingresa basura)
export const cleanMessage = (text) => {
    return text.replace(/<[^>]*>?/gm, '').trim();
};

// 4. Generar timestamp de la transmisión
export const getTimestamp = () => {
    const now = new Date();
    return `${now.getHours()}:${now.getMinutes()}`;
};