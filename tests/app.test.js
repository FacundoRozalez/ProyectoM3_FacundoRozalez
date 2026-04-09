import { describe, it, expect } from 'vitest';

// Simulamos la función que gestiona el historial (Lógica de Integración)
const addMessageToHistory = (history, role, text) => {
    return [...history, { role, parts: [{ text }] }];
};

describe('Integración de Historial de Chat', () => {

    it('Debería integrar un mensaje del usuario al historial vacío', () => {
        const history = [];
        const newHistory = addMessageToHistory(history, 'user', 'Hola Optimus');
        
        expect(newHistory).toHaveLength(1);
        expect(newHistory[0].role).toBe('user');
    });

    it('Debería mantener el orden de integración (User -> Model)', () => {
        let history = [];
        history = addMessageToHistory(history, 'user', '¿Quién eres?');
        history = addMessageToHistory(history, 'model', 'Soy Optimus Prime');

        expect(history[0].role).toBe('user');
        expect(history[1].role).toBe('model');
    });
});