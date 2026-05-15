# Content Dashboard — Next.js

A Google Sheets-powered content analytics dashboard for tracking editors, writers, and clients.

## Features

- **Sheet URL Form** — Paste any public Google Sheet link
- **Live Filters** — Date range, Client, Editor, Writer, Status, Content Type
- **5 Tabs:**
  - **Overview** — KPI cards + 4 charts (clients, status pie, writer WC, content types)
  - **Client Wise** — Sortable table aggregated by client
  - **Editor Wise** — Sortable table aggregated by editor
  - **Writer Wise** — Sortable table aggregated by writer
  - **Raw Data** — Paginated full data table with row-level search
- **Refresh** button to pull latest sheet data without re-entering URL

## Sheet Setup

Your Google Sheet must have these exact column headers (row 1):

| Editor | Date | Client Code | Client Name | Emp ID | Writer Name | Content Type | Word Count | Approved WC | Revision WC | Status | Remarks |

The sheet must be publicly shared: **Share → Anyone with the link → Viewer**

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
app/
  page.jsx                  # Main page (form + dashboard orchestration)
  layout.jsx                # Root layout with fonts
  globals.css               # Theme variables & base styles
  api/fetch-sheet/route.js  # Server-side proxy for Google Sheets (avoids CORS)

components/
  SheetForm.jsx             # URL input form with setup guide
  DashboardNav.jsx          # Sticky header with refresh/reset
  FilterBar.jsx             # All filter controls
  SummaryCards.jsx          # KPI summary cards (7 metrics)
  AggregateTable.jsx        # Reusable sortable aggregate table
  RawDataTable.jsx          # Paginated raw data view
  Charts.jsx                # Recharts visualizations (4 charts)

lib/
  parseSheet.js             # CSV parsing, normalization, filtering, aggregation
```

## Stack

- **Next.js 14** (App Router)
- **Tailwind CSS** — custom dark theme
- **Recharts** — charts
- **Google Sheets CSV Export** — no API key needed (public sheets only)

## Environment

No `.env` needed. The API proxy route (`/api/fetch-sheet`) fetches the sheet server-side.

## Adding More Tabs

To add a new grouping (e.g., by Content Type):

1. In `app/page.jsx`, add a tab to `TABS` and call `aggregateBy(filtered, "contentType")`
2. Render `<AggregateTable>` for that tab with appropriate props
