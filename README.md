# AntillaPay Frontend

Frontend estático de AntillaPay con React + Vite. Incluye:

- Sitio público/marketing.

## Stack

- React 18
- Vite 4
- React Router
- Tailwind CSS
- Radix UI + shadcn/ui

## Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Login Externo

- El botón `Iniciar sesión` redirige al bundle exportado de `pasarela` en `/pasarela/signin`.
- En desarrollo local, `npm run dev` sigue usando el proxy hacia `pasarela` para simular el mismo flujo.
- El acceso a `Documentación` en el menú de Desarrolladores también se puede redirigir por entorno:

```bash
VITE_DOCS_URL=https://tu-documentacion-externa.com
VITE_TERMINAL_POS_URL=https://antillapos.vercel.app
VITE_COMPANY_URL=https://tu-pagina-comercial-antilla-capital.com
```

- Si no se define `VITE_DOCS_URL`, el fallback actual redirige a `/`.
- Si no se define `VITE_TERMINAL_POS_URL`, el fallback actual usa `https://antillapos.vercel.app`.
- Si no se define `VITE_COMPANY_URL`, el fallback actual redirige a `/`.

## Deploy

- `npm run build` genera el sitio comercial en `dist/` y exporta `pasarela` dentro de `dist/pasarela/`.
- Vercel debe servir `/pasarela/*` antes del fallback SPA del marketing.

## Estructura (refactor 2026)

```text
src/
├── app/                    # Capa de aplicación (entry, providers, router, layouts)
│   ├── App.jsx
│   ├── providers/
│   ├── router/
│   └── routes/
├── assets/                 # Imágenes y recursos estáticos
├── components/             # UI y bloques reutilizables
├── hooks/                  # Hooks compartidos
├── lib/                    # Utilidades de dominio
├── pages/                  # Pantallas públicas
├── shared/                 # Helpers transversales (routing, etc.)
└── utils/                  # Capa de compatibilidad para imports legacy
```

## Convenciones de rutas

- Se definieron rutas canónicas en `src/app/routes/publicPageConfig.js`.
- `createPageUrl` ahora usa ese registro central.
- Se mantienen redirects de rutas legacy (ej. `/PaymentLinks`, `/paymentlinks`) hacia rutas canónicas (ej. `/payment-links`).

## Notas de arquitectura

- `LanguageProvider` vive una sola vez en `AppProviders`.
- El router usa `React.lazy` + `Suspense` para code-splitting por ruta.
- El entrypoint usa `src/main.jsx` -> `src/app/App.jsx` como capa principal de aplicación.
