# MarketPulse AI

A responsive market intelligence dashboard for tracking products, brands, customer sentiment, and marketing signals across the tech industry.

## Run locally

```bash
npm install
npm run dev
```

Vite prints the local URL after the development server starts. Create a production build with `npm run build`, or preview that build with `npm run preview`.

## Mock data and FastAPI integration

All dashboard data is served by `src/services/api.js`. Its functions return realistic fixtures from `src/mocks/marketData.js` after a short simulated delay. To use the FastAPI service, set `VITE_API_URL` to its base URL (copy `.env.example` to `.env.local`) and update the endpoint paths and any request parameters in `src/services/api.js` to match the backend contract. The UI can continue using the same service functions.

## Routes

- `/` — Market Overview
- `/products` — Product Analysis and comparisons
- `/brands` — Brand Intelligence
- `/sentiment` — Sentiment Analysis
- `/consumers` — Consumer Insights
- `/marketing` — Marketing Analytics
- `/competitors` — Competitor Analysis
- `/recommendations` — AI Recommendations
