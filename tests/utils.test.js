import { describe, it, expect } from 'vitest';
import { validateInput, formatName, cleanMessage, getTimestamp } from '../src/utils.js';

describe('Pruebas de Utilidades Autobot', () => {
    
    it('validateInput debería retornar false si el texto está vacío', () => {
        expect(validateInput("   ")).toBe(false);
    });

    it('formatName debería poner el nombre en mayúsculas y entre corchetes', () => {
        expect(formatName("optimus")).toBe("[OPTIMUS]");
    });

    it('cleanMessage debería eliminar etiquetas HTML del input', () => {
        const sucio = "Hola <script>alert('hack')</script> Prime";
        expect(cleanMessage(sucio)).not.toContain("<script>");
    });

    it('getTimestamp debería retornar un formato de hora válido', () => {
        const time = getTimestamp();
        expect(time).toMatch(/^\d{1,2}:\d{1,2}$/);
    });
});