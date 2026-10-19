# Split Field-TM into a Svelte task planner and an HTMX manager site

Amends [0003 - LiteStar](./0003-litestar.md). Follows HOTOSM
[0015](https://docs.hotosm.org/decisions/0015-frontend-right-tool).

## Context and Problem Statement

We replaced the React and Svelte frontends with LiteStar + HTMX
([0003](./0003-litestar.md)) to simplify the stack. That worked well for forms
and lists. Field-TM's core, though, is interactive maps: drawing areas,
previewing and editing task splits, and assigning tasks. With HTMX this produced:

- About 2.5k lines of untyped JS, much of it inline in templates.
- Leaflet code generated inside Python f-strings.
- Task GeoJSON round-tripped through hidden inputs, plus full page reloads.
- A clunky user experience, which was the main barrier to adoption.

The planned standalone task planner must also run with no backend, which HTMX
cannot do.

## Considered Options

- Keep HTMX for everything
- Full SPA rewrite
- Svelte for map-heavy pages, HTMX for simple pages
- A Svelte planner for all map work plus an HTMX manager site, joined by a
  task plan file (chosen)

## Decision Outcome

Two apps, joined by one **task plan** GeoJSON file:

- **Planner** (Svelte 5, MapLibre, PGlite + PostGIS): area, splitting, editing
  and assignment, all in the browser. It reads and writes files when used
  standalone, and saves to Field-TM when served by it. Drafts stay local, with
  no server sync.
- **Manager** (LiteStar + HTMX + Postgres): stores projects and plans, and
  handles forms, basemaps, app setup, users and status. It does no map
  editing; it embeds the planner read-only to view tasks.

The splitting SQL is shared, so the server can still split for the simple flow
and for campaigns.

### Consequences

- ✅ Better UX where it matters most, with typed, testable map code.
- ✅ The task planner can ship standalone.
- ✅ No big-bang rewrite, and the backend stays as it is.
- ❌ Adds a frontend build step (Vite).
- ❌ Two apps in one repo, but with a clear boundary (the plan file).
