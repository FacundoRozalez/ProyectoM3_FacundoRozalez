# Optimus Prime Chat - SPA con Gemini AI

Este proyecto es una Single Page Application (SPA) que permite interactuar con Optimus Prime, líder de los Autobots. Utiliza la API de Google Gemini para generar respuestas heroicas y sabias, manteniendo el contexto de la conversación en tiempo real.

Link al Proyecto desplegado: https://proyecto-m3-facundo-rozalez.vercel.app/

## Características

- Navegación SPA: Implementación de routing mediante la History API (pushState y popstate).
- Arquitectura Segura: Uso de Vercel Serverless Functions para proteger la API Key en el backend.
- Diseño Mobile-First: Interfaz responsive adaptada a móviles, tablets y desktops.
- Personalidad Definida: System Prompt optimizado para respuestas heroicas y breves (máximo 2 oraciones).
- Gestión de Contexto: Envío del historial de mensajes para una conversación coherente.

## Estructura del Proyecto

- api/functions.js     : Serverless Function (Proxy Gemini)
- api/mookchat.js      : Mock para pruebas sin consumo de tokens
- src/components/      : Vistas de la SPA (Home, Chat, About)
- src/utils/           : Validadores y formateadores de datos
- src/app.js           : Punto de entrada y lógica de Router
- src/styles.css       : Estilos con enfoque Mobile-First
- tests/               : Pruebas unitarias con Vitest

## Instalación y Configuración

1. Clonar el repositorio:
   git clone https://github.com

2. Instalar dependencias:
   npm install

3. Configurar variables de entorno:
   Crea un archivo .env en la raíz del proyecto y agrega tu clave de API:
   GEMINI_API_KEY=tu_clave_de_google_ai_studio

4. Ejecutar en entorno local:
   npm run dev

## Testing

Para ejecutar las pruebas unitarias con Vitest:
npm run test

*Los tests cubren: validación de mensajes, formateo de historial para la API y selección de prompts.*

## Uso de Inteligencia Artificial

Durante el desarrollo se utilizó asistencia de IA para:
- Refactorización: Implementación del método nativo startChat para gestión de memoria.
- Prompt Engineering: Ajuste del System Instruction para lograr el tono del personaje y brevedad.
- Estrategia de Cuotas: Creación de un sistema de Mocking para desarrollo local sin agotar la API.
