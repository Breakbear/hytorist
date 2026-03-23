﻿# Hytorist Website

Modernized company website for Beijing Hytorist Mechanical and Electric Tech Co., Ltd.

## Tech Stack

- Frontend: React 18, TypeScript, Vite, Tailwind CSS, React Router, Axios
- Backend: Node.js, Express, SQLite

## Project Structure

- `frontend/` React + Vite application
- `backend/` Express API and SQLite database
- `package.json` workspace-level helper scripts

## Install

```bash
npm run install:all
```

Or install each part manually:

```bash
npm install
cd frontend && npm install
cd ../backend && npm install
```

## Development

Start frontend and backend together:

```bash
npm run dev
```

Default ports:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`

## Build Frontend

```bash
npm run build
```

## Frontend Language Routes

- Chinese pages: `/zh`, `/zh/products`, `/zh/inquiry`, `/zh/about`, `/zh/contact`
- English pages: `/en`, `/en/products`, `/en/inquiry`, `/en/about`, `/en/contact`
- Admin page (single-language): `/admin`

Routing behavior:

- `/` auto-redirects by browser language (`zh*` -> `/zh`, otherwise `/en`)
- Stored language preference in browser `localStorage` takes priority over browser language
- Legacy paths (`/products`, `/inquiry`, `/about`, `/contact`, `/home`) redirect to localized routes
- Invalid locale prefixes (for example `/jp/about`) redirect to `/zh`

## Backend Environment Variables

- `PORT` (default: `5000`)
- `CORS_ORIGINS` (default: `http://localhost:3000`, comma-separated)
- `ADMIN_TOKEN` (required for admin APIs)

Example (PowerShell):

```powershell
$env:ADMIN_TOKEN = "replace-with-a-secure-token"
$env:CORS_ORIGINS = "http://localhost:3000"
cd backend
npm run dev
```

## API Endpoints

Public:

- `GET /api/health`
- `POST /api/inquiries`

Admin (requires `Authorization: Bearer <ADMIN_TOKEN>`):

- `GET /api/inquiries`
- `GET /api/inquiries/:id`
- `PUT /api/inquiries/:id/status`
- `PUT /api/cms/page/:locale/:sectionKey/:pageId`
- `DELETE /api/cms/page/:locale/:sectionKey/:pageId`

CMS content (public read):

- `GET /api/cms/pages/:locale`
- `GET /api/cms/page/:locale/:sectionKey/:pageId`

Allowed status values:

- `pending`
- `reviewed`
- `contacted`
- `completed`
- `rejected`

## Seed Sample Data

```bash
cd backend
npm run seed
```

This clears existing inquiry data and inserts 5 sample records.

## Notes

- The frontend admin page now asks for admin token and stores it in local storage (`admin_token`).
- If `ADMIN_TOKEN` is not set on backend, admin API routes return `503`.
- Admin page includes a CMS tab to edit section page content overrides for `zh`/`en` locales.
