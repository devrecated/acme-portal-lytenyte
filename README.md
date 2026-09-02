# Acme Fleet Portal (LyteNyte)

**[Live demo →](https://acme-portal-lytenyte.vercel.app)**

Original app: [github.com/devrecated/acme-portal](https://github.com/devrecated/acme-portal) · [acme-portal-five.vercel.app](https://acme-portal-five.vercel.app)

This repository is a **demonstration of [Autodevelop](https://devrecated.github.io/autodevelop/)**, Devrecated’s Cursor plugin for GitHub Projects, tickets, and confirmed stakeholder mail. The grids here use [LyteNyte](https://www.1771technologies.com/). The product is an exotic sports car dealer portal: a working example of what Autodevelop can produce.

It is not a production dealership system. The data is mock and held in memory.

## Rewrite timing with Autodevelop

| What shipped | Agent | Senior engineer |
| --- | --- | --- |
| Create LyteNyte | **8 min** | **1–2 days** |
| Fix UI bugs | **4 min** | **1–2 hours** |
| Live on Vercel | **6 min** | **30–60 min** |

**Total: about 18 minutes** vs **1.5–2.5 days**.

Those 18 minutes include running the app and checking it. With Autodevelop, a developer could have spent that same window on other bugs or features.

The public handbook is at [devprecated.github.io/autodevelop](https://devprecated.github.io/autodevelop/). Start with the [Client guide](https://devprecated.github.io/autodevelop/guide.html).

## What this demo shows

Acme Fleet is a dealer portal for Lamborghini, Ferrari, Porsche, McLaren, and Bentley. Sales reps work leads and collectors, the showroom tracks inventory, and the finance desk moves credit applications from submitted to funded.

Open the [live demo](https://acme-portal-lytenyte.vercel.app), pick an identity on the sign-in screen (there is no password), and switch roles. The sidebar, cost columns, and edit controls change with the signed-in permission set.

| Role | Reach |
| --- | --- |
| Admin | Everything, including editing users |
| Sales manager | Every selling feature, plus cost, margin, and the user list |
| Sales rep | Inventory, leads, and CRM with edit rights — no cost, no margin |
| Finance | Applications and inventory only; no leads, no CRM |
| Viewer | Read-only across the dashboard, inventory, leads, and CRM |

**Dashboard** — units in stock, inventory value, open pipeline, applications awaiting credit, a twelve-month revenue chart, and next follow-ups.

**Inventory** — searchable, filterable, sortable vehicles. Add and edit through a validated form. Cost and margin stay hidden from roles without `inventory.viewCost`.

**Leads** — a kanban board. Drag a card to change stage; the change persists for the session.

**CRM** — contacts and companies, with a per-contact activity timeline.

**Financing** — credit applications with an estimated monthly payment and status controls for the finance desk.

**Users** — invite teammates, change roles, and deactivate accounts.

## Run the demo locally

```bash
pnpm install
pnpm dev
```

The app serves on the port Next.js picks (3000 unless it is taken).

| Script | What it does |
| --- | --- |
| `pnpm dev` | Next.js dev server |
| `pnpm build` | Production build |
| `pnpm start` | Serve the production build |
| `pnpm lint` | Oxlint |
| `pnpm run deploy` | Production deploy to Vercel |

## How the portal is put together

```
src/
  app/          Next.js App Router pages and layouts
  auth/         session context and permission guards
  components/
    common/     PageHeader, StatCard, DataTable, StatusBadge, EmptyState
    layout/     sidebar, topbar, and the shell that routes into them
    ui/         form and chrome primitives
  data/         repository interface, in-memory implementation, seed, query hooks
  lib/          currency, date, and payment formatting
  routes/       one directory or file per feature
  types/        domain models and their enums
```

Next.js App Router on React 19. Data grids are [LyteNyte Grid Core](https://www.1771technologies.com/). Styling is Tailwind CSS v4. Server state is TanStack Query; forms are React Hook Form with Zod schemas. Charts are Recharts, icons are Lucide.

`DataRepository` in `src/data/repository.ts` is the whole contract with the UI. The seed in `src/data/seed.ts` is deterministic, so screenshots and demos stay stable. Money is stored in whole dollars and formatted through `lib/format.ts`.

## Further reading

- Live app: [acme-portal-lytenyte.vercel.app](https://acme-portal-lytenyte.vercel.app)
- Original: [github.com/devprecated/acme-portal](https://github.com/devrecated/acme-portal)
- Autodevelop handbook: [devprecated.github.io/autodevelop](https://devprecated.github.io/autodevelop/)
- [What Autodevelop is](https://devprecated.github.io/autodevelop/overview.html)
- [Client guide](https://devprecated.github.io/autodevelop/guide.html)
