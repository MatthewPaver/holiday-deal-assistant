# Holiday Deal Assistant

A working prototype for a UK short-haul holiday concierge. It compares package and DIY holiday ideas by the cost a traveller actually feels: headline price, luggage, transfers, meals, local fees, flight times, review signals, and destination vibe.

The first customer test case is:

- 2 adults
- Friday 26 June 2026 to Tuesday 30 June 2026
- UK departure airports
- Couple-focused spontaneous getaway

## What is built

- Ranked holiday shortlist with seeded package and DIY offers.
- True-total calculator for bags, transfers, meals, and local fees.
- Couple/vibe scoring for beach, food, culture, quiet, party, family, and luxury fit.
- Deal analysis panel with agent-style reasoning, cautions, protection notes, and source confidence.
- Controls for budget, airport, bags, transfers, and preferred vibe.

## Integration path

The UI is intentionally wired around a normalised `TripOffer` shape so real sources can replace seed data gradually.

Recommended order:

1. Approved APIs and affiliate feeds: Skyscanner, Booking.com Demand API, Expedia Rapid, Hotelbeds, LiteAPI.
2. Package provider deeplinks: Jet2holidays, TUI, easyJet holidays, loveholidays, On the Beach, lastminute.
3. Manual pasted-link analyser for offers that do not yet have an approved API route.
4. Browser-assisted checks only where terms permit.

Avoid building core data collection around unofficial scraping of Ryanair, Booking.com, Google Flights, or package holiday sites. Ryanair and Google Flights are especially important to handle through direct redirects, approved OTA paths, or manual user research flows.

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```
