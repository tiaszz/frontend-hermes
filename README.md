# Hermes — Frontend

Web interface for **Hermes**, a corporate communication platform for composing,
scheduling and tracking transactional emails built from reusable templates.

Built with **React 19** and **Vite**, it talks to the Hermes backend over a
JWT-secured REST API. The UI is in Brazilian Portuguese.

---

## Features

- **Painel** — dashboard with at-a-glance stats (sent today, scheduled, errors).
- **Nova comunicação** — compose and send a new email from a template version,
  filling in template variables, CC/BCC and an optional schedule date.
- **Histórico** — list of all sent/scheduled communications with their status.
- **Modelos** — browse and create email templates and their versions.
- **Configurações** — application settings and user management (*Usuários*).
- **Autenticação** — login via JWT, persisted in `localStorage`; expired/invalid
  sessions are cleared automatically and force a re-login.

## Tech stack

| Concern        | Choice                                  |
| -------------- | --------------------------------------- |
| UI library     | React 19                                |
| Build tool     | Vite 8                                  |
| HTTP           | Native `fetch` (no axios)               |
| State          | React Context (`AppContext`)            |
| Auth           | JWT bearer token in `localStorage`      |
| Linting        | ESLint 10 (flat config)                 |

There are no CSS frameworks or UI kits — styling is hand-written
(`style.css` / `App.css`) and icons are served from an inline SVG sprite.

## Getting started

### Prerequisites

- Node.js 18+ and npm
- A running instance of the Hermes backend on `http://localhost:8080`

### Install & run

```bash
npm install
npm run dev
```

The dev server starts on Vite's default port (`http://localhost:5173`).

### Available scripts

| Command           | Description                                  |
| ----------------- | -------------------------------------------- |
| `npm run dev`     | Start the Vite dev server with HMR           |
| `npm run build`   | Produce a production build in `dist/`        |
| `npm run preview` | Serve the production build locally           |
| `npm run lint`    | Run ESLint over the project                  |

## Backend connection

All requests are made to relative `/api/*` paths. In development, Vite proxies
them to the backend — see `vite.config.js`:

```js
server: {
  proxy: {
    '/api': { target: 'http://localhost:8080', changeOrigin: true },
  },
}
```

To point at a different backend, change the `target` above. For production, the
app expects `/api` to be served by (or proxied to) the backend.

### API surface

All endpoints live in [`src/api.js`](src/api.js), grouped by resource:

- `auth` — `login`, `logout`, `isAuthenticated`, `me`
- `templates` — list / get / create email templates
- `templateVersions` — list / get / create versions of a template
- `emailMessages` — list / get / create communications
- `users` — list / get / create users

The request helper attaches `Authorization: Bearer <token>` automatically and,
on a `401`, clears the stored token and reloads to force a re-login.

## Project structure

```
src/
├── api.js              # Central HTTP layer — all endpoint paths live here
├── roles.js            # Backend role → display label mapping
├── main.jsx            # React entry point
├── App.jsx             # App shell, sidebar, page routing
├── context/
│   └── AppContext.jsx  # Global state: communications, templates, stats, user
└── components/
    ├── Login.jsx
    ├── Painel.jsx          # Dashboard
    ├── Nova.jsx            # New communication
    ├── Historico.jsx       # History
    ├── Modelos.jsx         # Templates
    ├── Configuracoes.jsx   # Settings
    ├── Usuarios.jsx        # User management
    └── UI.jsx              # Shared UI primitives (Icon, etc.)
```

### State & data shape

`AppContext` is the single source of truth for the authenticated app. It
fetches templates, communications and the current user on mount, and normalises
backend values into the Portuguese frontend model — e.g. status codes
(`SENT → Enviado`, `SCHEDULED → Agendado`, `ERROR → Erro`, `DRAFT → Rascunho`)
and roles (`ROLE_ADMIN → Administrador`).

> **Note:** the backend currently exposes no `DELETE`/`PATCH` for communications,
> so removing or changing the status of a communication in the UI is a
> **local-only** operation and is not persisted.
