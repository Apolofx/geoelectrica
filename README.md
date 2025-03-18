# Geoelectrica - Electrical Sounding Data Management System

A modern web application for managing and analyzing electrical sounding data for geophysical studies. Built with Preact, TypeScript, and Chart.js.

## Features

- Create and manage geoelectrical studies
- Add and track vertical electrical soundings (SEV)
- Record and analyze measurements
- Interactive data visualization with Chart.js
- Progressive Web App (PWA) support
- Responsive design

## Prerequisites

- Node.js (v18 or higher)
- Bun (v1.0 or higher)

## Installation

1. Clone the repository:
```bash
git clone [your-repository-url]
cd geoelectrica
```

2. Install dependencies:
```bash
bun install
```

3. Start the development server:
```bash
bun run dev
```

4. Build for production:
```bash
bun run build
```

## Project Structure

```
src/
├── app/           # Main application components
├── components/    # Reusable UI components
├── hooks/         # Custom React hooks
├── store/         # MobX state management
├── assets/        # Static assets
└── main.tsx       # Application entry point
```

## Development

The project uses:
- Preact for UI components
- TypeScript for type safety
- MobX for state management
- Chart.js for data visualization
- Vite for build tooling

## Deployment

The project is configured for deployment on Vercel. Simply push to your repository and Vercel will automatically deploy your changes.

## License

[Your chosen license]

# Descripcion del dominio

## Tenemos un historial de Estudios de geoeléctrica para el cual vamos a tener:

- El historial propiamente dicho (Lista de estudios)
- Cada estudio va a tener una lista de uno o mas sondeos electricos verticales (SEV)
- Cada SEV va a tener una o mas mediciones

## Interfaz del Historial de Estudios:

- Listar Estudios ✅
  Por cada estudio:
  - Borrar Estudio ✅
  - Ver estudio ✅
    - Listar sondeos ✅
      Por cada sondeo
      - Borrar Sondeo ✅
      - Ver sondeo ✅
        - Listar mediciones ✅
        - Borrar ultima medicion ✅
            Por cada medicion
            - Ver medicion
            - Editar parametros
        - Graficar curva
        - Borrar todas las mediciones de un sondeo (resetear sondeo)
        - Nueva medicion ✅
  - Nuevo Sondeo Electrico ✅
- Nuevo Estudio ✅


Como usuario debería poder crear un nuevo Estudio
    Una vez creado el nuevo estudio debería poder comenzar a agregarle mediciones inmediatamente
Como usuario debería poder editar los datos basicos de un estudio
Como usuario debería poder agregar un nuevo sondeo a un estudio ya creado
Como usuario debería poder visualizar todos los sondeos realizados nuevo Estudio
Como usuario debería poder editar un sondeo
Como usuario debería poder agregar nuevas mediciones a un sondeo
Como usuario debería poder borrar mediciones en un sondeo
Como usuario debería poder editar una medicion en un sondeo 