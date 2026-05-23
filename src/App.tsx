import {
  AlertTriangle,
  ArrowUpRight,
  BadgeCheck,
  Bell,
  CalendarDays,
  Check,
  ChevronRight,
  CircleGauge,
  Clock3,
  Database,
  Filter,
  GitBranch,
  Link2,
  MapPin,
  Plane,
  Radar,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Luggage,
  Sun,
  TrainFront,
  Utensils,
  Waves,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import './App.css'

type Board = 'All inclusive' | 'Full board' | 'Half board' | 'Breakfast' | 'Room only'
type TripType = 'Package' | 'DIY bundle'
type Vibe = 'Couples' | 'Quiet' | 'Party' | 'Families' | 'Beach' | 'Food' | 'Culture' | 'Luxury'
type SortMode = 'Best fit' | 'Lowest total' | 'Lowest per person' | 'Highest rating' | 'Shortest transfer'

type Offer = {
  id: string
  name: string
  destination: string
  country: string
  supplier: string
  tripType: TripType
  board: Board
  headlinePrice: number
  baggageCost: number
  baggageIncluded: boolean
  transferCost: number
  transferIncluded: boolean
  localFees: number
  mealBuffer: number
  departureAirport: string
  outbound: string
  returnFlight: string
  transferMinutes: number
  rating: number
  reviewCount: number
  reviewSignal: string
  freshness: string
  protection: string
  dealSignal: string
  vibes: Vibe[]
  cautions: string[]
  agentNotes: string[]
  sourceMode: string
  sourceStatus: 'Seeded' | 'Partner-ready' | 'Manual review'
  sourceRisks: string[]
  sourceConfidence: number
}

type ScoreParts = {
  budget: number
  vibe: number
  quality: number
  friction: number
  confidence: number
}

const offers: Offer[] = [
  {
    id: 'alcudia-blue',
    name: 'Alcudia Bay Club',
    destination: 'Mallorca',
    country: 'Spain',
    supplier: 'Jet2holidays style package',
    tripType: 'Package',
    board: 'All inclusive',
    headlinePrice: 1188,
    baggageCost: 0,
    baggageIncluded: true,
    transferCost: 0,
    transferIncluded: true,
    localFees: 18,
    mealBuffer: 0,
    departureAirport: 'Manchester',
    outbound: 'Fri 26 Jun, 08:20 - 12:00',
    returnFlight: 'Tue 30 Jun, 19:10 - 20:55',
    transferMinutes: 58,
    rating: 4.4,
    reviewCount: 1860,
    reviewSignal: 'Recent couples praise the beach access and easy evenings; families appear at peak times.',
    freshness: 'Seeded from May 2026 research pattern',
    protection: 'ATOL-style package',
    dealSignal: 'Good total value because bags and transfers are already in.',
    vibes: ['Couples', 'Beach', 'Families', 'Quiet'],
    cautions: ['Large resort feel', 'Transfer is close to one hour'],
    agentNotes: [
      'Best lazy couple option if you want fixed spend.',
      'Area is safe and low-friction, but not a nightlife-first choice.',
      'Worth comparing against Puerto Pollensa if you want quieter restaurants.',
    ],
    sourceMode: 'Package API or approved affiliate feed',
    sourceStatus: 'Partner-ready',
    sourceRisks: ['Room type must be reconciled at redirect', 'Package terms can vary by supplier'],
    sourceConfidence: 86,
  },
  {
    id: 'albufeira-diy',
    name: 'Old Town Guesthouse Pairing',
    destination: 'Albufeira',
    country: 'Portugal',
    supplier: 'Ryanair + Booking.com style DIY',
    tripType: 'DIY bundle',
    board: 'Breakfast',
    headlinePrice: 742,
    baggageCost: 172,
    baggageIncluded: false,
    transferCost: 74,
    transferIncluded: false,
    localFees: 12,
    mealBuffer: 210,
    departureAirport: 'London Stansted',
    outbound: 'Fri 26 Jun, 06:35 - 09:25',
    returnFlight: 'Tue 30 Jun, 21:50 - 00:35',
    transferMinutes: 42,
    rating: 4.1,
    reviewCount: 944,
    reviewSignal: 'Strong location feedback, mixed noise comments after midnight.',
    freshness: 'Seeded from May 2026 research pattern',
    protection: 'Separate bookings',
    dealSignal: 'Cheap headline, weaker after luggage, transfer, and food.',
    vibes: ['Party', 'Beach', 'Food'],
    cautions: ['Late return arrival', 'Noise risk', 'Separate booking support'],
    agentNotes: [
      'Headline price is the trap here: the real total moves quickly.',
      'Good if you want bars and flexible food, less good for a quiet couple trip.',
      'Ryanair routes should use approved OTA or direct redirect paths only.',
    ],
    sourceMode: 'Flight API plus hotel API normalised into one bundle',
    sourceStatus: 'Manual review',
    sourceRisks: ['Separate bookings mean weaker disruption support', 'Low-cost carrier extras change quickly'],
    sourceConfidence: 74,
  },
  {
    id: 'chania-harbour',
    name: 'Chania Harbour Adults Wing',
    destination: 'Crete',
    country: 'Greece',
    supplier: 'TUI style package',
    tripType: 'Package',
    board: 'Half board',
    headlinePrice: 1324,
    baggageCost: 0,
    baggageIncluded: true,
    transferCost: 46,
    transferIncluded: false,
    localFees: 24,
    mealBuffer: 120,
    departureAirport: 'Birmingham',
    outbound: 'Fri 26 Jun, 10:45 - 16:35',
    returnFlight: 'Tue 30 Jun, 17:20 - 19:30',
    transferMinutes: 28,
    rating: 4.6,
    reviewCount: 1288,
    reviewSignal: 'Couples mention walkable dinners, harbour atmosphere, and fewer children.',
    freshness: 'Seeded from May 2026 research pattern',
    protection: 'ATOL-style package',
    dealSignal: 'Not the cheapest, but strongest couple fit.',
    vibes: ['Couples', 'Food', 'Culture', 'Luxury'],
    cautions: ['Higher total', 'Half board still needs lunch and drinks'],
    agentNotes: [
      'Best quality fit for a girlfriend getaway if budget allows.',
      'Short transfer and walkable evenings reduce holiday admin.',
      'Check room type carefully because harbour hotels can vary a lot.',
    ],
    sourceMode: 'Package feed with transfer quote enrichment',
    sourceStatus: 'Partner-ready',
    sourceRisks: ['Transfer is estimated until provider confirms', 'Meal buffer depends on eating style'],
    sourceConfidence: 91,
  },
  {
    id: 'marmaris-budget',
    name: 'Marmaris Sunline Resort',
    destination: 'Dalaman Coast',
    country: 'Turkey',
    supplier: 'loveholidays style package',
    tripType: 'Package',
    board: 'All inclusive',
    headlinePrice: 884,
    baggageCost: 154,
    baggageIncluded: false,
    transferCost: 82,
    transferIncluded: false,
    localFees: 0,
    mealBuffer: 0,
    departureAirport: 'Manchester',
    outbound: 'Fri 26 Jun, 14:20 - 20:35',
    returnFlight: 'Tue 30 Jun, 22:35 - 01:05',
    transferMinutes: 94,
    rating: 3.9,
    reviewCount: 2314,
    reviewSignal: 'Value reviews are solid, but food repetition and long transfer appear often.',
    freshness: 'Seeded from May 2026 research pattern',
    protection: 'Package protection depends on final supplier',
    dealSignal: 'Spontaneous low price, but add-ons change the story.',
    vibes: ['Party', 'Beach', 'Families'],
    cautions: ['Long transfer', 'Bags not included', 'Late return', 'Review split'],
    agentNotes: [
      'Looks like a bargain until bags and transfer are added.',
      'Better for groups than a quiet couple holiday.',
      'Only recommend if budget ceiling is strict and nightlife is wanted.',
    ],
    sourceMode: 'Package deeplink plus add-on reconciliation',
    sourceStatus: 'Manual review',
    sourceRisks: ['Baggage and transfer commonly added late', 'Review split needs recent-review weighting'],
    sourceConfidence: 68,
  },
  {
    id: 'sliema-city',
    name: 'Sliema Waterfront Hotel',
    destination: 'Malta',
    country: 'Malta',
    supplier: 'easyJet holidays style package',
    tripType: 'Package',
    board: 'Breakfast',
    headlinePrice: 1018,
    baggageCost: 96,
    baggageIncluded: false,
    transferCost: 32,
    transferIncluded: false,
    localFees: 8,
    mealBuffer: 230,
    departureAirport: 'London Gatwick',
    outbound: 'Fri 26 Jun, 07:55 - 12:10',
    returnFlight: 'Tue 30 Jun, 18:25 - 20:55',
    transferMinutes: 22,
    rating: 4.2,
    reviewCount: 1711,
    reviewSignal: 'Couples like ferries, restaurants, and easy Valletta access; beaches are not the main event.',
    freshness: 'Seeded from May 2026 research pattern',
    protection: 'ATOL-style package',
    dealSignal: 'Strong city-break value if you will eat out.',
    vibes: ['Couples', 'Food', 'Culture'],
    cautions: ['Not a resort beach trip', 'Bags extra'],
    agentNotes: [
      'Best for a couple who want wandering, restaurants, and short transfers.',
      'Breakfast-only is fine here because the area rewards eating out.',
      'Do not pitch it as all-inclusive relaxation.',
    ],
    sourceMode: 'Package feed plus local-area enrichment',
    sourceStatus: 'Seeded',
    sourceRisks: ['Beach expectation mismatch', 'Restaurant spend needs user preference calibration'],
    sourceConfidence: 84,
  },
]

const airportOptions = ['Any UK', 'Manchester', 'London Stansted', 'Birmingham', 'London Gatwick']
const destinationOptions = ['Anywhere', ...Array.from(new Set(offers.map((offer) => offer.destination)))]
const boardOptions: Array<Board | 'Any board'> = ['Any board', 'All inclusive', 'Full board', 'Half board', 'Breakfast', 'Room only']
const tripTypeOptions: Array<TripType | 'Any type'> = ['Any type', 'Package', 'DIY bundle']
const sortOptions: SortMode[] = ['Best fit', 'Lowest total', 'Lowest per person', 'Highest rating', 'Shortest transfer']
const vibeOptions: Vibe[] = ['Couples', 'Quiet', 'Beach', 'Food', 'Culture', 'Party', 'Families', 'Luxury']

const repoLessons = [
  {
    repo: 'chaosisnotrandomitisrhythmic/flights-mcp',
    lesson: 'Keep provider calls as pure business logic behind thin tool wrappers.',
    applied: 'Future adapters will return normalised offers before the UI sees them.',
  },
  {
    repo: 'random-robbie/Flight-Search-MCP-Server',
    lesson: 'Expose server status, validation errors, and rate-limit/API failures clearly.',
    applied: 'The prototype now shows source status, confidence, and manual-review risks.',
  },
  {
    repo: 'jessalva7/flight-search-mcp-server',
    lesson: 'A single search tool is useful, but only solves one slice of the holiday decision.',
    applied: 'The ranking combines flights, stays, transfers, reviews, and trip vibe.',
  },
]

const sourceConnectors = [
  { name: 'Flights', target: 'Skyscanner or approved OTA', status: 'Partner route', risk: 'Avoid unofficial Google Flights dependency' },
  { name: 'Hotels', target: 'Booking.com Demand, Expedia Rapid, LiteAPI', status: 'API-first', risk: 'Normalise taxes and property fees' },
  { name: 'Transfers', target: 'Hotelbeds Transfers or distance estimate', status: 'Quote enrich', risk: 'Pickup rules differ by hotel' },
  { name: 'Reviews', target: 'Provider reviews plus Places metadata', status: 'Evidence layer', risk: 'Do not overclaim from limited samples' },
]

const competitorInsights = [
  {
    name: 'Skyscanner Packages',
    strength: 'Huge package search reach and trusted redirects',
    gap: 'Inclusions depend on provider, so transfer/food/bag truth is still left to the traveller',
    response: 'Show confirmed vs estimated extras before redirect',
  },
  {
    name: 'TravelSupermarket',
    strength: 'Familiar filters for board, price, brand, luggage, transfers and ATOL confidence',
    gap: 'Comparison still leans on headline deal rows rather than persona-specific suitability',
    response: 'Rank by couple/family/party fit and explain the trade-off',
  },
  {
    name: 'Expedia',
    strength: 'Bundle & Save, package customisation and one-account trip management',
    gap: 'Enterprise-grade bundling does not automatically explain whether DIY beats all-inclusive',
    response: 'Compare package vs DIY with per-person and total-trip economics',
  },
  {
    name: 'KAYAK',
    strength: 'Fast metasearch and broad filters across flights, hotels and cars',
    gap: 'Powerful search, but weaker holiday-context reasoning',
    response: 'Add area intelligence, review patterns and source confidence',
  },
]

function currency(value: number) {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 0,
  }).format(value)
}

function getTrueTotal(offer: Offer, bagsNeeded: boolean, transferNeeded: boolean) {
  return (
    offer.headlinePrice +
    (bagsNeeded && !offer.baggageIncluded ? offer.baggageCost : 0) +
    (transferNeeded && !offer.transferIncluded ? offer.transferCost : 0) +
    offer.localFees +
    offer.mealBuffer
  )
}

function getScoreParts(offer: Offer, selectedVibes: Vibe[], budget: number, trueTotal: number): ScoreParts {
  const vibeScore = selectedVibes.reduce((score, vibe) => score + (offer.vibes.includes(vibe) ? 9 : -3), 0)
  const priceScore = Math.max(-24, Math.min(24, (budget - trueTotal) / 18))
  const qualityScore = (offer.rating - 3.5) * 18 + offer.sourceConfidence / 6
  const frictionPenalty =
    (offer.transferMinutes > 75 ? 12 : 0) +
    (!offer.baggageIncluded ? 4 : 0) +
    (!offer.transferIncluded ? 4 : 0) +
    (offer.cautions.length > 2 ? 4 : 0)

  return {
    budget: Math.round(priceScore),
    vibe: vibeScore,
    quality: Math.round(qualityScore),
    friction: -frictionPenalty,
    confidence: Math.round(offer.sourceConfidence / 5),
  }
}

function getFitScore(parts: ScoreParts) {
  return Math.round(
    Math.max(0, Math.min(100, 44 + parts.budget + parts.vibe + parts.quality + parts.friction)),
  )
}

function getVerdict(score: number) {
  if (score >= 84) return 'Book-shortlist'
  if (score >= 72) return 'Strong maybe'
  if (score >= 58) return 'Compare carefully'
  return 'Probably skip'
}

function App() {
  const [budget, setBudget] = useState(1300)
  const [airport, setAirport] = useState('Any UK')
  const [destination, setDestination] = useState('Anywhere')
  const [board, setBoard] = useState<Board | 'Any board'>('Any board')
  const [tripType, setTripType] = useState<TripType | 'Any type'>('Any type')
  const [minRating, setMinRating] = useState(3.8)
  const [maxTransfer, setMaxTransfer] = useState(120)
  const [sortMode, setSortMode] = useState<SortMode>('Best fit')
  const [bagsNeeded, setBagsNeeded] = useState(true)
  const [transferNeeded, setTransferNeeded] = useState(true)
  const [selectedVibes, setSelectedVibes] = useState<Vibe[]>(['Couples', 'Beach', 'Food'])
  const [activeOfferId, setActiveOfferId] = useState(offers[0].id)
  const [pastedOfferUrl, setPastedOfferUrl] = useState('')

  const rankedOffers = useMemo(() => {
    return offers
      .filter((offer) => airport === 'Any UK' || offer.departureAirport === airport)
      .filter((offer) => destination === 'Anywhere' || offer.destination === destination)
      .filter((offer) => board === 'Any board' || offer.board === board)
      .filter((offer) => tripType === 'Any type' || offer.tripType === tripType)
      .filter((offer) => offer.rating >= minRating)
      .filter((offer) => offer.transferMinutes <= maxTransfer)
      .map((offer) => {
        const trueTotal = getTrueTotal(offer, bagsNeeded, transferNeeded)
        const scoreParts = getScoreParts(offer, selectedVibes, budget, trueTotal)
        const fitScore = getFitScore(scoreParts)
        const perPerson = Math.round(trueTotal / 2)
        return { ...offer, trueTotal, perPerson, scoreParts, fitScore, verdict: getVerdict(fitScore) }
      })
      .sort((a, b) => {
        if (sortMode === 'Lowest total') return a.trueTotal - b.trueTotal
        if (sortMode === 'Lowest per person') return a.perPerson - b.perPerson
        if (sortMode === 'Highest rating') return b.rating - a.rating
        if (sortMode === 'Shortest transfer') return a.transferMinutes - b.transferMinutes
        return b.fitScore - a.fitScore
      })
  }, [airport, bagsNeeded, board, budget, destination, maxTransfer, minRating, selectedVibes, sortMode, transferNeeded, tripType])

  const activeOffer = rankedOffers.find((offer) => offer.id === activeOfferId) ?? rankedOffers[0]
  const bestOffer = rankedOffers[0]
  const packageAverage =
    rankedOffers.filter((offer) => offer.tripType === 'Package').reduce((sum, offer) => sum + offer.trueTotal, 0) /
    Math.max(1, rankedOffers.filter((offer) => offer.tripType === 'Package').length)
  const diyAverage =
    rankedOffers.filter((offer) => offer.tripType === 'DIY bundle').reduce((sum, offer) => sum + offer.trueTotal, 0) /
    Math.max(1, rankedOffers.filter((offer) => offer.tripType === 'DIY bundle').length)
  const hiddenCostDelta = activeOffer ? activeOffer.trueTotal - activeOffer.headlinePrice : 0
  const pastedSource = pastedOfferUrl.includes('booking')
    ? 'Hotel source detected'
    : pastedOfferUrl.includes('ryanair')
      ? 'Flight source detected'
      : pastedOfferUrl.includes('loveholidays') || pastedOfferUrl.includes('onthebeach') || pastedOfferUrl.includes('tui')
        ? 'Package source detected'
        : pastedOfferUrl
          ? 'Ready for manual review'
          : 'Paste a deal URL to triage'

  function toggleVibe(vibe: Vibe) {
    setSelectedVibes((current) =>
      current.includes(vibe) ? current.filter((item) => item !== vibe) : [...current, vibe],
    )
  }

  if (!activeOffer) {
    return (
      <main className="app-shell empty-state">
        <h1>No holiday options match this brief yet</h1>
        <p>Widen the airport filter or add a pasted deal link so the assistant can triage it manually.</p>
      </main>
    )
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Holiday deal desk</p>
          <h1>26-30 June couple escape</h1>
        </div>
        <div className="topbar-actions">
          <button className="icon-button" aria-label="Search deals">
            <Search size={19} />
          </button>
          <button className="icon-button" aria-label="Watch spontaneous deals">
            <Bell size={19} />
          </button>
        </div>
      </header>

      <section className="brief-strip" aria-label="Trip summary">
        <div>
          <CalendarDays size={18} />
          <span>Fri 26 Jun - Tue 30 Jun 2026</span>
        </div>
        <div>
          <Plane size={18} />
          <span>2 adults from UK airports</span>
        </div>
        <div>
          <Sparkles size={18} />
          <span>Ranked by true cost and couple fit</span>
        </div>
      </section>

      <section className="source-health" aria-label="Source health and repo lessons">
        <div>
          <BadgeCheck size={18} />
          <span>Compliant first</span>
          <strong>Partner APIs, deeplinks, pasted links</strong>
        </div>
        <div>
          <GitBranch size={18} />
          <span>GitHub lesson</span>
          <strong>Adapters stay separate from scoring</strong>
        </div>
        <div>
          <Database size={18} />
          <span>Data model</span>
          <strong>Normalise everything into TripOffer</strong>
        </div>
        <div>
          <Radar size={18} />
          <span>Deal radar</span>
          <strong>Surface confidence, not fake certainty</strong>
        </div>
        <div>
          <CircleGauge size={18} />
          <span>Enterprise controls</span>
          <strong>Policy, audit trail, supplier SLAs</strong>
        </div>
      </section>

      <div className="workspace">
        <aside className="control-panel" aria-label="Trip controls">
          <div className="panel-heading">
            <Filter size={18} />
            <h2>Brief</h2>
          </div>

          <label className="field">
            <span>Budget ceiling</span>
            <strong>{currency(budget)}</strong>
            <input
              type="range"
              min="800"
              max="1800"
              step="25"
              value={budget}
              onChange={(event) => setBudget(Number(event.target.value))}
            />
          </label>

          <label className="field">
            <span>Departure airport</span>
            <select value={airport} onChange={(event) => setAirport(event.target.value)}>
              {airportOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </label>

          <div className="filter-grid">
            <label className="field compact">
              <span>Destination</span>
              <select value={destination} onChange={(event) => setDestination(event.target.value)}>
                {destinationOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>

            <label className="field compact">
              <span>Board basis</span>
              <select value={board} onChange={(event) => setBoard(event.target.value as Board | 'Any board')}>
                {boardOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>

            <label className="field compact">
              <span>Holiday type</span>
              <select value={tripType} onChange={(event) => setTripType(event.target.value as TripType | 'Any type')}>
                {tripTypeOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>

            <label className="field compact">
              <span>Sort by</span>
              <select value={sortMode} onChange={(event) => setSortMode(event.target.value as SortMode)}>
                {sortOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
          </div>

          <label className="field">
            <span>Minimum rating</span>
            <strong>{minRating.toFixed(1)}+</strong>
            <input
              type="range"
              min="3.5"
              max="4.8"
              step="0.1"
              value={minRating}
              onChange={(event) => setMinRating(Number(event.target.value))}
            />
          </label>

          <label className="field">
            <span>Max transfer time</span>
            <strong>{maxTransfer} min</strong>
            <input
              type="range"
              min="20"
              max="120"
              step="5"
              value={maxTransfer}
              onChange={(event) => setMaxTransfer(Number(event.target.value))}
            />
          </label>

          <div className="switch-row">
            <button className={bagsNeeded ? 'toggle active' : 'toggle'} type="button" onClick={() => setBagsNeeded(true)}>
              <Luggage size={17} />
              Hold bags
            </button>
            <button className={!bagsNeeded ? 'toggle active' : 'toggle'} type="button" onClick={() => setBagsNeeded(false)}>
              <Check size={17} />
              Cabin only
            </button>
          </div>

          <div className="switch-row">
            <button
              className={transferNeeded ? 'toggle active' : 'toggle'}
              type="button"
              onClick={() => setTransferNeeded(true)}
            >
              <TrainFront size={17} />
              Include transfer
            </button>
            <button
              className={!transferNeeded ? 'toggle active' : 'toggle'}
              type="button"
              onClick={() => setTransferNeeded(false)}
            >
              <MapPin size={17} />
              Self-sort
            </button>
          </div>

          <div className="vibe-picker">
            <span>Vibe fit</span>
            <div>
              {vibeOptions.map((vibe) => (
                <button
                  className={selectedVibes.includes(vibe) ? 'chip selected' : 'chip'}
                  key={vibe}
                  type="button"
                  onClick={() => toggleVibe(vibe)}
                >
                  {vibe}
                </button>
              ))}
            </div>
          </div>

          <label className="field offer-intake">
            <span>Pasted deal triage</span>
            <input
              type="url"
              placeholder="Paste Booking, TUI, Ryanair, loveholidays..."
              value={pastedOfferUrl}
              onChange={(event) => setPastedOfferUrl(event.target.value)}
            />
            <small>
              <Link2 size={14} />
              {pastedSource}
            </small>
          </label>

          <div className="source-stack">
            <p>Connector order</p>
            <ol>
              <li>Approved APIs and affiliates</li>
              <li>Package deeplinks</li>
              <li>Pasted offer review</li>
              <li>Manual browser checks</li>
            </ol>
          </div>
        </aside>

        <section className="results-column" aria-label="Ranked holiday options">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Live shortlist model</p>
              <h2>{rankedOffers.length} ranked options</h2>
            </div>
            <div className="summary-pill">
              <CircleGauge size={17} />
              Best fit {bestOffer?.fitScore ?? 0}
            </div>
          </div>

          <div className="metric-grid">
            <div>
              <span>Best true total</span>
              <strong>{bestOffer ? currency(bestOffer.trueTotal) : 'None'}</strong>
            </div>
            <div>
              <span>Best per person</span>
              <strong>{bestOffer ? currency(bestOffer.perPerson) : 'None'}</strong>
            </div>
            <div>
              <span>Package average</span>
              <strong>{currency(packageAverage || 0)}</strong>
            </div>
            <div>
              <span>DIY average</span>
              <strong>{currency(diyAverage || 0)}</strong>
            </div>
          </div>

          <div className="offer-list">
            {rankedOffers.map((offer) => (
              <button
                className={offer.id === activeOffer.id ? 'offer-card active' : 'offer-card'}
                key={offer.id}
                onClick={() => setActiveOfferId(offer.id)}
                type="button"
                aria-pressed={offer.id === activeOffer.id}
              >
                <div className="offer-rank">
                  <strong>{offer.fitScore}</strong>
                  <span>{offer.verdict}</span>
                </div>
                <div className="offer-main">
                  <div className="offer-title-row">
                    <div>
                      <h3>{offer.name}</h3>
                      <p>
                        {offer.destination}, {offer.country} via {offer.departureAirport}
                      </p>
                    </div>
                    <ChevronRight size={20} />
                  </div>
                  <div className="offer-tags">
                    <span>{offer.tripType}</span>
                    <span>{offer.board}</span>
                    <span>{offer.transferMinutes} min transfer</span>
                    <span>{offer.sourceStatus}</span>
                  </div>
                  <div className="price-row">
                    <div>
                      <span>Headline</span>
                      <strong>{currency(offer.headlinePrice)}</strong>
                    </div>
                    <div>
                      <span>True total</span>
                      <strong>{currency(offer.trueTotal)}</strong>
                    </div>
                    <div>
                      <span>Per person</span>
                      <strong>{currency(offer.perPerson)}</strong>
                    </div>
                    <div>
                      <span>Rating</span>
                      <strong>{offer.rating.toFixed(1)}</strong>
                    </div>
                  </div>
                  <div className="offer-proof">
                    <span>{offer.sourceMode}</span>
                    <strong>+{currency(offer.trueTotal - offer.headlinePrice)} after extras</strong>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        <aside className="analysis-panel" aria-label="Deal analysis">
          <div className="destination-band">
            <div>
              <p className="eyebrow">{activeOffer.supplier}</p>
              <h2>{activeOffer.destination}</h2>
            </div>
            <div className="score-orb">{activeOffer.fitScore}</div>
          </div>

          <div className="verdict-panel">
            <h3>{activeOffer.verdict}</h3>
            <p>{activeOffer.dealSignal}</p>
            <small>{hiddenCostDelta > 0 ? `${currency(hiddenCostDelta)} added after headline price` : 'No material add-on gap'}</small>
            <a href="https://www.google.com/travel/flights" target="_blank" rel="noreferrer">
              Check external price <ArrowUpRight size={16} />
            </a>
          </div>

          <div className="cost-stack">
            <h3>Cost truth</h3>
            <div>
              <span>Advertised</span>
              <strong>{currency(activeOffer.headlinePrice)}</strong>
            </div>
            <div>
              <span>Bags</span>
              <strong>{activeOffer.baggageIncluded || !bagsNeeded ? 'Included' : currency(activeOffer.baggageCost)}</strong>
            </div>
            <div>
              <span>Transfers</span>
              <strong>
                {activeOffer.transferIncluded || !transferNeeded ? 'Included' : currency(activeOffer.transferCost)}
              </strong>
            </div>
            <div>
              <span>Meals and local fees</span>
              <strong>{currency(activeOffer.mealBuffer + activeOffer.localFees)}</strong>
            </div>
            <div className="total-line">
              <span>Estimated total</span>
              <strong>{currency(activeOffer.trueTotal)}</strong>
            </div>
            <div className="per-person-line">
              <span>Per person</span>
              <strong>{currency(activeOffer.perPerson)}</strong>
            </div>
            <div>
              <span>Extras per person</span>
              <strong>{currency(Math.round(hiddenCostDelta / 2))}</strong>
            </div>
          </div>

          <div className="score-breakdown">
            <h3>Why it ranked here</h3>
            {(
              [
              ['Budget fit', activeOffer.scoreParts.budget],
              ['Vibe match', activeOffer.scoreParts.vibe],
              ['Quality signal', activeOffer.scoreParts.quality],
              ['Friction penalty', activeOffer.scoreParts.friction],
              ['Source confidence', activeOffer.scoreParts.confidence],
              ] as Array<[string, number]>
            ).map(([label, value]) => (
              <div className="score-line" key={label}>
                <span>{label}</span>
                <meter min={-24} max={32} low={-8} high={18} optimum={28} value={value} />
                <strong>{Number(value) > 0 ? `+${value}` : value}</strong>
              </div>
            ))}
          </div>

          <div className="source-audit">
            <h3>Source audit</h3>
            <div>
              <span>{activeOffer.sourceStatus}</span>
              <strong>{activeOffer.sourceConfidence}% confidence</strong>
            </div>
            <p>{activeOffer.sourceMode}</p>
            <ul>
              {activeOffer.sourceRisks.map((risk) => (
                <li key={risk}>{risk}</li>
              ))}
            </ul>
          </div>

          <div className="evidence-grid">
            <div>
              <Clock3 size={17} />
              <span>{activeOffer.outbound}</span>
            </div>
            <div>
              <Plane size={17} />
              <span>{activeOffer.returnFlight}</span>
            </div>
            <div>
              <ShieldCheck size={17} />
              <span>{activeOffer.protection}</span>
            </div>
            <div>
              <Star size={17} />
              <span>
                {activeOffer.rating} from {activeOffer.reviewCount.toLocaleString()} reviews
              </span>
            </div>
          </div>

          <div className="agent-section">
            <h3>Agent read</h3>
            {activeOffer.agentNotes.map((note) => (
              <p key={note}>{note}</p>
            ))}
          </div>

          <div className="signal-row" aria-label="Vibe signals">
            {activeOffer.vibes.map((vibe) => (
              <span key={vibe}>{vibe}</span>
            ))}
          </div>

          <div className="warning-box">
            <AlertTriangle size={18} />
            <div>
              <strong>Watch points</strong>
              <p>{activeOffer.cautions.join(', ')}</p>
            </div>
          </div>
        </aside>
      </div>

      <section className="research-rail" aria-label="Market research">
        <div>
          <Sun size={20} />
          <h2>Market pain</h2>
          <p>Headline prices hide the practical holiday cost: bags, transfers, meals, local fees, and support risk.</p>
        </div>
        <div>
          <Utensils size={20} />
          <h2>Package question</h2>
          <p>All-inclusive wins when it truly removes spend and admin; DIY wins when the area rewards eating out.</p>
        </div>
        <div>
          <Waves size={20} />
          <h2>Country rollout</h2>
          <p>Start UK short-haul, then add countries only after transfer and review signals are dependable.</p>
        </div>
      </section>

      <section className="robustness-board" aria-label="Robustness plan">
        <div className="board-column competitor-column">
          <p className="eyebrow">Market comparison</p>
          <h2>Enterprise wedge</h2>
          {competitorInsights.map((competitor) => (
            <article key={competitor.name}>
              <div>
                <strong>{competitor.name}</strong>
                <span>{competitor.strength}</span>
              </div>
              <em>Gap</em>
              <p>{competitor.gap}</p>
              <p>
                <strong>Our response:</strong> {competitor.response}
              </p>
            </article>
          ))}
        </div>
        <div className="board-column">
          <p className="eyebrow">Connector matrix</p>
          <h2>Source plan</h2>
          {sourceConnectors.map((source) => (
            <article key={source.name}>
              <div>
                <strong>{source.name}</strong>
                <span>{source.target}</span>
              </div>
              <em>{source.status}</em>
              <p>{source.risk}</p>
            </article>
          ))}
        </div>
        <div className="board-column">
          <p className="eyebrow">GitHub research applied</p>
          <h2>Repo lessons</h2>
          {repoLessons.map((lesson) => (
            <article key={lesson.repo}>
              <div>
                <strong>{lesson.repo}</strong>
                <span>{lesson.lesson}</span>
              </div>
              <em>Applied</em>
              <p>{lesson.applied}</p>
            </article>
          ))}
        </div>
        <div className="board-column">
          <p className="eyebrow">Competitor read</p>
          <h2>How this differs</h2>
          {competitorInsights.map((insight) => (
            <article key={insight.name}>
              <div>
                <strong>{insight.name}</strong>
                <span>{insight.strength}</span>
              </div>
              <em>Gap</em>
              <p>
                {insight.gap}. {insight.response}.
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

export default App
