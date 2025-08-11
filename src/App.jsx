import React, { useEffect, useMemo, useState } from "react";

// GBM Trainer — single-file React app (v1.3.1)
// Tailwind CSS is available by default in this environment.
// This app gamifies learning Goldman Sachs GBM products/services, clients, revenue mechanics,
// risks, and key regulations. Data is embedded below and progress persists to localStorage.

// -----------------------------
// Types
// -----------------------------
/** @typedef {import('react').ReactNode} ReactNode */

// -----------------------------
// Data: Levels, Topics, Quizzes
// -----------------------------
const DATA = {
  meta: {
    title: "GBM Trainer",
    subtitle: "Learn Goldman Sachs Global Banking & Markets — fast.",
    version: "1.3.1",
    lastUpdated: "2025-08-10",
  },
  // Note: Content is distilled from public Goldman Sachs disclosures and regulator sites.
  // This file purposely avoids inline citations; see the chat message for source links.
  levels: [
    {
      id: "level-1",
      title: "Level 1 — The Map",
      badge: "Navigator",
      estMins: 5,
      cards: [
        {
          id: "l1-overview",
          title: "What is GBM?",
          bullets: [
            "One of Goldman Sachs' three segments alongside Asset & Wealth Management (AWM) and Platform Solutions.",
            "Combines: Investment Banking (advisory & underwriting) + Markets & Financing (FICC & Equities).",
            "Core mission: intermediate risk and liquidity, originate/underwrite capital, provide financing and market access to institutional and corporate clients.",
          ],
        },
        {
          id: "l1-revenue-pillars",
          title: "Revenue Pillars",
          bullets: [
            "Advisory fees (M&A); Underwriting fees (ECM/DCM).",
            "Intermediation (market-making bid/ask, derivatives), electronic execution commissions, and clearing fees.",
            "Financing: prime brokerage, securities lending, margin & repo, portfolio swaps, structured lending.",
          ],
        },
        {
          id: "l1-client-base",
          title: "Client Base",
          bullets: [
            "Hedge funds, asset managers, pension funds, insurers, sovereigns/central banks, banks/brokers, corporates, RIAs.",
            "Most activities are institutional; retail is out of scope for GBM.",
          ],
        },
      ],
      quiz: [
        {
          q: "GBM combines which components?",
          choices: [
            "Retail banking + insurance",
            "Investment Banking + Markets & Financing",
            "Wealth management + consumer lending",
          ],
          answer: 1,
          explain: "GBM = Investment Banking (advisory & underwriting) plus Markets & Financing (FICC & Equities).",
        },
        {
          q: "Which is NOT a typical GBM client?",
          choices: ["Pension fund", "Hedge fund", "Mass-market retail depositor"],
          answer: 2,
          explain: "GBM is predominantly institutional; retail depositors are outside scope.",
        },
      ],
    },
    {
      id: "level-2",
      title: "Level 2 — Product Atlas (High Level)",
      badge: "Cartographer",
      estMins: 8,
      cards: [
        {
          id: "l2-equities",
          title: "Equities Complex (Cash, Derivatives, Financing)",
          bullets: [
            "Cash Equities: agency & principal market-making; program/portfolio trading.",
            "Equity Derivatives: listed options, OTC options, variance/vol, structured notes, delta-one (swaps, futures).",
            "Financing/Prime: prime brokerage, portfolio swaps (TRS), securities lending/borrowing, margin, custody, and clearing.",
          ],
        },
        {
          id: "l2-ficc",
          title: "FICC Complex (Rates, Credit, FX, Commodities, Securitized)",
          bullets: [
            "Rates: govies, interest rate swaps (IRS), futures, options; repo/secured funding.",
            "Credit: IG/HY bonds, CDS indices & single-name, credit options; bespoke structures.",
            "FX: spot, forwards, swaps, NDFs; electronic execution via APIs/algos.",
            "Commodities: energy, metals, ags; physical + financial; risk mgmt for corporates.",
            "Securitized/Mortgages: MBS/CMBS/ABS; financing & structured lending.",
          ],
        },
        {
          id: "l2-platforms",
          title: "Platforms & Market Access",
          bullets: [
            "GSET (Goldman Sachs Electronic Trading): algos, smart order routing, DMA/sponsored access, ATS/MTF connectivity.",
            "Marquee: cross-asset analytics, data & execution front-end with APIs; includes MarketView dashboards.",
            "Clearing: listed derivatives (FCM) + OTC clearing access (IRS/CDS) via CCPs.",
          ],
        },
      ],
      quiz: [
        {
          q: "Which belongs to FICC?",
          choices: ["Variance swaps on S&P 500", "Interest rate swaps (IRS)", "Employee mortgages"],
          answer: 1,
          explain: "Interest rate swaps are a core Rates product within FICC.",
        },
        {
          q: "GSET mainly provides…",
          choices: ["Retail brokerage for individuals", "Electronic execution, algos, DMA/ATS access", "Tax advisory"],
          answer: 1,
          explain: "GSET is Goldman’s institutional electronic trading stack for market access/execution.",
        },
      ],
    },
    {
      id: "level-3",
      title: "Level 3 — Clients & Revenue Mechanics",
      badge: "Rainmaker",
      estMins: 10,
      cards: [
        {
          id: "l3-revenue-equities",
          title: "Equities Revenue Levers",
          bullets: [
            "Intermediation: bid/ask spread capture; derivatives pricing edge; facilitation P&L.",
            "Execution: commissions, exchange rebates/fees net, internal crossing/ATS, routing.",
            "Financing: prime brokerage fees, stock loan fees/rebates, margin interest, portfolio swap spreads.",
          ],
        },
        {
          id: "l3-revenue-ficc",
          title: "FICC Revenue Levers",
          bullets: [
            "Rates/Credit: market-making spreads, carry/hedge P&L; structured solutions margins.",
            "FX/Commodities: spreads, swaps points, optionality premia, corporate risk mgmt mandates.",
            "Securitized/Financing: structured lending margins, repo spreads; clearing fees.",
          ],
        },
        {
          id: "l3-banking",
          title: "Banking (Advisory/Underwriting)",
          bullets: [
            "Advisory: success fees on completed M&A restructurings.",
            "Underwriting: fees for ECM (IPOs/secondaries/convertibles) & DCM (IG/HY/ABS), plus risk mgmt on syndication.",
          ],
        },
      ],
      quiz: [
        {
          q: "Prime brokerage typically earns the LEAST from which of these?",
          choices: ["Securities lending spreads", "DMA commissions", "Portfolio swap financing spread"],
          answer: 1,
          explain: "DMA commissions exist but financing & stock loan economics usually dominate PB revenue.",
        },
        {
          q: "Underwriting revenue is MOST directly tied to…",
          choices: ["Advisory completion fees", "Issuance fees on debt/equity offerings", "Repo haircuts"],
          answer: 1,
          explain: "Underwriting = fees tied to new issues (equity/debt).",
        },
      ],
    },
    {
      id: "level-4",
      title: "Level 4 — Risk Lenses (Firm, Client, Market)",
      badge: "Risk Architect",
      estMins: 12,
      cards: [
        {
          id: "l4-risk-spectrum",
          title: "Core Risk Types",
          bullets: [
            "Market risk (price/vol), liquidity (funding & market depth), counterparty credit risk (PFE/CSA), settlement risk.",
            "Operational/Technology (latency, algo errors, outages), model risk (pricing/hedging), legal/regulatory/conduct.",
            "Reputational & franchise risk; cross-border regulatory fragmentation (US/UK/EU/Asia).",
          ],
        },
        {
          id: "l4-product-hotspots",
          title: "Product Hotspots",
          bullets: [
            "Equity derivatives & structured notes: complexity, suitability for certain clients, hedging basis risk.",
            "Prime brokerage & financing: margin/collateral mgmt, wrong-way risk, rehypothecation controls.",
            "FICC (credit/commodities): gap risk, basis/liquidity in stress, physical settlement/logistics in commodities.",
            "Electronic trading: best ex, routing conflicts, ATS/venue disclosures, market access controls.",
          ],
        },
        {
          id: "l4-client-market",
          title: "Client & Market Risks",
          bullets: [
            "Client: leverage & liquidity management; transparency of fees & conflicts; suitability for complex structures (institutional standard).",
            "Market: fair/deceptive practices (manipulation/spoofing), short sale/locate compliance, orderly markets during stress.",
          ],
        },
      ],
      quiz: [
        {
          q: "Which control MOST directly mitigates market access risk?",
          choices: ["Call center QA reviews", "Exchange kill-switch / pre-trade risk checks", "Quarterly budget approvals"],
          answer: 1,
          explain: "Pre-trade risk checks and kill-switches are core 15c3-5 market access controls.",
        },
        {
          q: "A key wrong-way risk example in PB is…",
          choices: [
            "Client long equity, prime lends same equity",
            "Client short equity, collateral posted is highly correlated to short",
            "Client FX forward mismatched tenors",
          ],
          answer: 1,
          explain: "If collateral is highly correlated with client exposure, stress can impair collateral value at the same time exposure rises.",
        },
      ],
    },
    {
      id: "level-5",
      title: "Level 5 — Key Rules & Compliance Themes",
      badge: "Reg Whisperer",
      estMins: 14,
      cards: [
        {
          id: "l5-securities",
          title: "US Securities Market Rules (Equities) — Highlights",
          bullets: [
            "Reg NMS: order protection & market data framework; evolving tick sizes and access fees.",
            "Reg SHO: short sale locate/close-out; marking & price test circuit breaker.",
            "Reg ATS / ATS-N: transparency & disclosures for NMS stock ATSs (incl. dark pools).",
            "Rule 15c3-5: market access pre-trade risk controls, credit/thresholds, kill-switch.",
            "CAT (Rule 613): order/event reporting across venues; funding framework in flux.",
          ],
        },
        {
          id: "l5-derivatives",
          title: "Derivatives (CFTC/SEC) — Highlights",
          bullets: [
            "Dodd-Frank Title VII: swap vs security-based swap split (CFTC vs SEC).",
            "Swap Dealer/SBSD: business conduct, recordkeeping, chief compliance officer, capital & margin for uncleared swaps.",
            "Reporting: SDR/SBSR reporting & public dissemination; clearing mandates where applicable.",
          ],
        },
        {
          id: "l5-conduct",
          title: "Conduct & Conflicts",
          bullets: [
            "MNPI/insider trading, information barriers, research independence (incl. MiFID II unbundling in EU).",
            "Best execution (FINRA 5310), payment for order flow disclosures (where applicable), venue conflicts.",
            "Manipulative practices: spoofing/layering; surveillance & e-comms monitoring are table stakes.",
          ],
        },
        {
          id: "l5-volcker",
          title: "Volcker & Financing",
          bullets: [
            "Restrictions on proprietary trading & covered fund activities; customer facilitation and underwriting exemptions.",
            "Name-sharing, seeding & risk retention constraints; documentation/metrics to evidence permissible activity.",
          ],
        },
      ],
      quiz: [
        {
          q: "Which rule mandates pre-trade risk controls for sponsored market access?",
          choices: ["Reg NMS", "Rule 15c3-5", "Reg SHO"],
          answer: 1,
          explain: "SEC Rule 15c3-5 is the Market Access Rule.",
        },
        {
          q: "Under Title VII, security-based swaps fall primarily under…",
          choices: ["SEC jurisdiction", "CFTC jurisdiction", "FINRA jurisdiction"],
          answer: 0,
          explain: "Security-based swaps (e.g., single-name CDS, equity swaps) are under SEC; other swaps under CFTC.",
        },
      ],
    },
    {
      id: "level-6",
      title: "Level 6 — Product Deep Dives",
      badge: "Desk Pro",
      estMins: 20,
      cards: [
        {
          id: "l6-equity-derivs",
          title: "Equity Derivatives & Delta-One",
          bullets: [
            "Clients: hedge funds, asset managers, insurers, corporates (hedging).",
            "Uses: hedging (beta, vega), yield enhancement (covered calls), dispersion/volatility strategies, structured outcomes.",
            "Revenue: option premia margins, delta-one financing spreads, dividend/borrow economics.",
            "Risks: vega/gamma/borrow squeezes, jump risk, corporate actions, model risk.",
          ],
        },
        {
          id: "l6-rates-credit",
          title: "Rates & Credit (FICC)",
          bullets: [
            "Clients: asset managers, pensions, insurers, banks, sovereigns/central banks, corporates (treasury).",
            "Uses: duration mgmt, curve/rv trades, credit hedges, issuance hedging (DCM-linked).",
            "Revenue: spreads, basis/carry, structured margins; repo/secured financing.",
            "Risks: basis/liquidity in stress, CCP margin calls, wrong-way with collateral.",
          ],
        },
        {
          id: "l6-fx-commod",
          title: "FX & Commodities",
          bullets: [
            "FX: spot/forwards/swaps; corporates hedge exposures; funds trade macro/relative value.",
            "Commodities: physical + financial; structured supply hedges, inventory financing; logistics/ops interface.",
            "Risks: settlement (Herstatt), physical delivery, sanctions/export controls, benchmark integrity.",
          ],
        },
        {
          id: "l6-prime",
          title: "Prime Brokerage & Financing",
          bullets: [
            "Services: custody/clearing, margin lending, short locate/borrow, capital intro, risk & reporting, portfolio swaps.",
            "Revenue: financing & borrow spreads often dominate; plus fees/commissions/clearing.",
            "Risks: client concentration, leverage, collateral eligibility & rehypothecation, default/close-out playbooks.",
          ],
        },
        {
          id: "l6-clearing",
          title: "Clearing & Market Plumbing",
          bullets: [
            "FCM for listed derivatives; client clearing for OTC via CCPs (IRS/CDS).",
            "Revenue: clearing fees, interest on collateral (where applicable).",
            "Risks: default mgmt waterfall, porting risk, intraday margin/funding, cyber/ops resilience.",
          ],
        },
      ],
      quiz: [
        {
          q: "Which factor most drives PB revenue long-run?",
          choices: ["Algos used", "Financing/borrow spreads", "Number of prime brokerage logos"],
          answer: 1,
          explain: "Financing & stock loan economics are the engine of PB.",
        },
        {
          q: "Which is a classic settlement risk in FX?",
          choices: ["Herstatt risk", "Wash sale risk", "Tick-size risk"],
          answer: 0,
          explain: "Time-zone settlement mismatches create FX settlement (Herstatt) risk.",
        },
      ],
    },
    {
      id: "level-7",
      title: "Level 7 — Scenarios & Spot-the-Risk",
      badge: "Red Teamer",
      estMins: 18,
      cards: [
        {
          id: "l7-scenario-1",
          title: "Scenario: Equity Vol Spike",
          bullets: [
            "Client flow shifts to index puts; facilitation increases; borrow tightens in crowded shorts.",
            "Controls: stress greeks, borrow availability, locate controls, client concentration & margin add-ons.",
          ],
        },
        {
          id: "l7-scenario-2",
          title: "Scenario: Rates Gap + CCP Margin Calls",
          bullets: [
            "IRS basis widens; clients face intraday VM; funding desk triages liquidity across CCPs.",
            "Controls: intraday liquidity playbook, cross-CCP netting, eligible collateral lists, wrong-way monitoring.",
          ],
        },
        {
          id: "l7-scenario-3",
          title: "Scenario: Algo Outage / Venue Latency",
          bullets: [
            "Order rejections spike; routing loops; client slippage risk.",
            "Controls: kill-switches, circuit breakers, hot/warm failover, venue throttles, post-trade TCA review.",
          ],
        },
      ],
      quiz: [
        {
          q: "Venue/routing failures primarily engage which rule?",
          choices: ["Reg SHO", "Rule 15c3-5 Market Access", "Volcker Rule"],
          answer: 1,
          explain: "Market access controls must prevent erroneous or uncontrolled routing/execution.",
        },
        {
          q: "A CCP intraday margin surge is BEST mitigated by…",
          choices: ["More research reports", "Intraday liquidity buffers & eligible collateral", "Lower maker-taker fees"],
          answer: 1,
          explain: "Funding & collateral readiness are key for CCP calls.",
        },
      ],
    },
  ],
};

// Additional lookup tables: product examples with clients, uses, risks, regs
const PRODUCT_LIBRARY = [
  {
    product: "Cash Equities",
    clients: "HFs, AMs, pensions, insurers, sovereigns, corporates (treasury)",
    uses: "Liquidity, price discovery, tactical positioning, hedging with baskets",
    revenue: "Bid/ask capture, commissions, internal crossing/ATS",
    risks: "Best ex, routing conflicts, short sale compliance, settlement fails",
    regs: "Reg NMS, Reg SHO, Reg ATS, CAT (Rule 613), 15c3-5",
  },
  {
    product: "Listed Equity Options",
    clients: "HFs, AMs, vol funds, insurers",
    uses: "Hedging (vega/gamma), income, dispersion, convexity",
    revenue: "Option margins, vol surface edge, execution fees",
    risks: "Model/spec vol risk, liquidity gaps, concentration",
    regs: "Exchange rules, 15c3-5 market access, surveillance/abusive trading prohibitions",
  },
  {
    product: "Equity Swaps / TRS (Delta-One)",
    clients: "HFs, AMs, pensions",
    uses: "Synthetic exposure, balance-sheet efficiency, shorting via swaps",
    revenue: "Financing spread + fees, hedge effectiveness",
    risks: "Counterparty/CSA, basis to hedges, tax/regulatory, dividend events",
    regs: "SEC SBS regime for equity-based swaps; business conduct, reporting (SBSR)",
  },
  {
    product: "Prime Brokerage",
    clients: "HFs, multi-managers, UCITS/’40 Act leveraging",
    uses: "Custody/clearing, financing, short locate/borrow, capital intro",
    revenue: "Financing & borrow spreads, fees, commissions",
    risks: "Client default, concentration, rehypothecation, wrong-way",
    regs: "Broker-dealer/FCM rules, segregation, Reg SHO locate/close-out",
  },
  {
    product: "Repo / Secured Funding",
    clients: "Banks, dealers, AMs, pensions, sovereigns",
    uses: "Collateralized funding, short-cover, yield enhancement",
    revenue: "Repo spread, specials in hard-to-borrow collateral",
    risks: "Collateral quality/haircuts, term rollover, liquidity",
    regs: "Prudential capital/liquidity, tri-party/CCP rules",
  },
  {
    product: "Interest Rate Swaps (IRS)",
    clients: "Corporates, AMs, insurers, banks, sovereigns",
    uses: "Hedge duration, fix/float conversion, issuance hedging",
    revenue: "Swap spread and hedging P&L",
    risks: "Basis, CCP margin, counterparty credit",
    regs: "CFTC swap dealer, clearing/reporting, uncleared margin (where applicable)",
  },
  {
    product: "Credit (IG/HY) & CDS",
    clients: "AMs, insurers, HFs, banks",
    uses: "Yield, spread RV, default hedge, tranche exposure",
    revenue: "Bid/ask, carry, structured margins",
    risks: "Gap/liquidity, default clusters, wrong-way",
    regs: "SEC for security-based swaps (single-name/NA CDS), TRACE reporting",
  },
  {
    product: "FX (Spot/Forwards/Swaps/NDFs)",
    clients: "Corporates, macro funds, banks, sovereigns",
    uses: "Currency hedging, macro positioning, funding",
    revenue: "Spreads, swaps points, e-trading flow",
    risks: "Settlement (Herstatt), sanctions, EM liquidity",
    regs: "CFTC swap rules for certain FX swaps; OFAC/sanctions; prudential",
  },
  {
    product: "Commodities (Energy/Metals/Ags)",
    clients: "Producers, airlines, utilities, merchants, HFs",
    uses: "Hedge price risk, inventory finance, structured offtake",
    revenue: "Option premia, basis/carry, financing",
    risks: "Physical delivery & logistics, basis shocks, political risk",
    regs: "CFTC position limits, reporting; sanctions/export controls",
  },
  {
    product: "Clearing (Listed & OTC)",
    clients: "Institutional derivatives users",
    uses: "Access to CCPs, risk mutualization, margin netting",
    revenue: "Clearing fees, collateral interest (where applicable)",
    risks: "Default waterfall, porting, cyber/ops",
    regs: "CFTC FCM rules, EMIR in EU, CCP standards (PFMI)",
  },
  {
    product: "ECM/DCM Underwriting",
    clients: "Issuers: corporates, sponsors, governments",
    uses: "Raise equity/debt capital (IPOs/secondaries/IG/HY/ABS)",
    revenue: "Underwriting & syndication fees",
    risks: "Underwriting risk (bridge/IPO stabilization), disclosure liability",
    regs: "Securities Act/Exchange Act, FINRA capital markets rules",
  },
];

// --- Extra Levels injected for desk specificity and controls gamification ---
const EXTRA_LEVELS = [
  {
    id: "level-8-desks",
    title: "Level 8 — Big Desks, What They Do",
    badge: "Desk Insider",
    estMins: 20,
    cards: [
      {
        id: "d-cash-etf",
        title: "Cash Equities & ETF/Program Trading",
        bullets: [
          "What: Agency/principal execution, index/ETF baskets, portfolio trades.",
          "How GS uses it: Electronic scale via GSET; internal crossing; facilitation for clients.",
          "Revenue: Commissions, bid/ask, internalization.",
          "Risks & controls: Best ex/TCA, venue conflicts, short sale locates (Reg SHO), trade reporting & CAT.",
        ],
      },
      {
        id: "d-eqd",
        title: "Equity Derivatives (Single-Stock & Index)",
        bullets: [
          "What: Listed & OTC options, variance/vol products, structured notes.",
          "How GS uses it: Client facilitation + risk warehousing; structured solutions for institutions.",
          "Revenue: Option premia margins, hedging edge.",
          "Risks & controls: Model risk, stress greeks, suitability/complexity controls, barrier/event mgmt.",
        ],
      },
      {
        id: "d-delta-one",
        title: "Delta-One / Equity Swaps (TRS)",
        bullets: [
          "What: Synthetic long/short exposure via swaps; baskets/indices/single-names.",
          "How GS uses it: Balance-sheet efficient client exposure; PB adjacency.",
          "Revenue: Financing spread, borrow economics, fees.",
          "Risks & controls: CSA/margin, concentration, wrong-way risk add-ons, corporate action ops.",
        ],
      },
      {
        id: "d-converts",
        title: "Convertibles",
        bullets: [
          "What: Convertible bonds, related hedging across equity/credit/rates.",
          "Revenue: New issue/underwriting + RV trading.",
          "Risks & controls: Model/convert parity risk, locate availability, disclosure obligations.",
        ],
      },
      {
        id: "d-rates",
        title: "Rates (UST, IRS, Futures/Options)",
        bullets: [
          "What: Government bonds, swaps, futures/options; repo financing.",
          "Revenue: Market-making spreads, carry, structured margins.",
          "Risks & controls: CCP margin, intraday liquidity, curve/basis risk, trade reporting.",
        ],
      },
      {
        id: "d-credit",
        title: "Credit (IG/HY, CDS)",
        bullets: [
          "What: Cash bonds, indices, single-name CDS, options/tranches.",
          "Revenue: Spread/carry, structuring, facilitation.",
          "Risks & controls: Gap/liquidity, default clusters, TRACE/SBSR reporting, MNPI controls.",
        ],
      },
      {
        id: "d-securitized",
        title: "Securitized Products (MBS/CMBS/ABS)",
        bullets: [
          "What: Mortgage/consumer/collateral pools; whole loans to structured tranches.",
          "Revenue: Spread/structuring, financing.",
          "Risks & controls: Model/prepay risk, valuation controls, disclosure & suitability.",
        ],
      },
      {
        id: "d-fx",
        title: "FX (G10 & EM)",
        bullets: [
          "What: Spot/forwards/swaps/NDFs; corporate risk mgmt & macro flow.",
          "Revenue: Spreads, swap points; e-trading.",
          "Risks & controls: Settlement/Herstatt, sanctions screening, last-look governance, trade reporting.",
        ],
      },
      {
        id: "d-commod",
        title: "Commodities (Energy/Metals/Ags)",
        bullets: [
          "What: Physical + financial; hedging, inventory & offtake structures.",
          "Revenue: Option premia, basis/carry, financing spreads.",
          "Risks & controls: Delivery/logistics, position limits, sanctions/export, ETRM ops controls.",
        ],
      },
      {
        id: "d-repo",
        title: "Repo & Secured Funding",
        bullets: [
          "What: Collateralized funding, matched books, specials.",
          "Revenue: Repo spread; balance-sheet optimization.",
          "Risks & controls: Haircuts/eligibility, term rollover, concentration & WWR.",
        ],
      },
      {
        id: "d-pb",
        title: "Prime Brokerage",
        bullets: [
          "What: Financing, custody/clearing, shorting, capital intro, reporting.",
          "Revenue: Financing & borrow spreads dominate.",
          "Risks & controls: Client concentration, collateral, default mgmt playbooks, margin add-ons.",
        ],
      },
      {
        id: "d-gset",
        title: "Electronic Trading (GSET)",
        bullets: [
          "What: Algos, SOR, DMA/sponsored access; analytics via Marquee.",
          "Revenue: Flow/commissions; platform stickiness.",
          "Risks & controls: 15c3-5 pre-trade checks, kill-switches, venue due diligence, TCA.",
        ],
      },
      {
        id: "d-clearing",
        title: "Clearing (FCM & OTC Client Clearing)",
        bullets: [
          "What: Access to CCPs, margin netting, default management waterfall.",
          "Revenue: Clearing fees, collateral interest (where applicable).",
          "Risks & controls: Porting risk, intraday margin, cyber/ops resilience.",
        ],
      },
    ],
    quiz: [
      {
        q: "Which desk most directly manages specials and hard-to-borrow economics?",
        choices: ["Cash Equities", "Prime Brokerage", "Clearing"],
        answer: 1,
        explain: "Stock loan/borrow and financing spreads sit in PB though they interact with cash equities.",
      },
      {
        q: "Where do last-look and market access controls primarily live?",
        choices: ["GSET / e-trading", "Repo", "Clearing"],
        answer: 0,
        explain: "Electronic trading (GSET) implements pre-trade checks and last-look governance.",
      },
      {
        q: "Which desk is MOST exposed to delivery & logistics risk?",
        choices: ["Commodities", "Rates", "FX"],
        answer: 0,
        explain: "Physical commodities introduce operational delivery risks.",
      },
    ],
  },
  {
    id: "level-9-controls",
    title: "Level 9 — Controls Arcade",
    badge: "Control Freak",
    estMins: 16,
    cards: [
      { id: "c-15c35", title: "Market Access (Rule 15c3-5)", bullets: [
        "Pre-trade credit & fat-finger limits; price collars; kill-switch.",
        "Venue throttles, duplicate order protection; sponsored access oversight.",
      ]},
      { id: "c-bestex", title: "Best Execution & TCA", bullets: [
        "Policy, routing governance, periodic reviews, client disclosures.",
        "Venue analysis: fees, fill quality, conflicts; ATS/segmentation.",
      ]},
      { id: "c-algo", title: "Algo Governance", bullets: [
        "SDLC/change mgmt, model reviews, sandbox testing, release approvals.",
        "Real-time monitoring & rollback; parameter safeties.",
      ]},
      { id: "c-model", title: "Model Risk Mgmt", bullets: [
        "Valuation models (derivs/SPG), independent validation, PnL explain.",
        "Reserves, fair value hierarchy, backtesting & challenger models.",
      ]},
      { id: "c-margin", title: "Margin & Collateral", bullets: [
        "Eligibility schedules/haircuts, intraday calls, WWR add-ons.",
        "Dispute mgmt, collateral reuse controls, stress & liquidity buffers.",
      ]},
      { id: "c-npa", title: "New Product Approval (NPA)", bullets: [
        "Cross-functional review (risk, legal, tax, ops).",
        "Lifecycle risks, disclosures, tech readiness, wind-down plans.",
      ]},
      { id: "c-surv", title: "Surveillance (Trade & E-Comms)", bullets: [
        "Patterns: spoofing/layering, manipulation, wash trades; lexicon+ML for e-comms.",
        "Escalations & documentation; periodic tuning.",
      ]},
      { id: "c-report", title: "Trade Reporting", bullets: [
        "CAT/Blue Sheets (equities), SDR/SBSR (swaps), TRACE (credit), EMIR/MiFIR (EU).",
        "Clock sync, linkage, lifecycle events, governance over corrections.",
      ]},
      { id: "c-barriers", title: "Information Barriers & Conflicts", bullets: [
        "MNPI controls, wall crossings, research independence; conflicts logs.",
        "Cross-desk comms protocols; restricted lists.",
      ]},
      { id: "c-crossborder", title: "Cross-Border & Sanctions", bullets: [
        "Client/venue restrictions, OFAC/EU sanctions screening, export controls.",
        "Booking model governance, country risk approvals.",
      ]},
      { id: "c-books", title: "Books & Records / Time Sync", bullets: [
        "Immutable storage, retention, supervisory reviews.",
        "Clock sync (NTP/PTP), order/event sequencing.",
      ]},
    ],
    quiz: [
      {
        q: "A client’s DMA flow suddenly spikes with odd lots and rejects. FIRST control to check?",
        choices: ["Best ex policy wording", "15c3-5 pre-trade limits & kill-switch", "Trace reporting"],
        answer: 1,
        explain: "Pre-trade risk checks limit flow and can isolate runaway orders; kill-switch if needed.",
      },
      {
        q: "A valuation model drift triggers unexplained PnL. Which control?",
        choices: ["Surveillance lexicon", "Model validation & reserves", "ATS disclosures"],
        answer: 1,
        explain: "Independent validation and reserves address valuation uncertainty.",
      },
      {
        q: "Client disputing short-sale compliance — strongest evidence?",
        choices: ["General policy", "Locate log + borrow availability record", "Marketing deck"],
        answer: 1,
        explain: "Locate/borrow documentation is core to Reg SHO compliance.",
      },
    ],
  },
  {
    id: "level-10-regs",
    title: "Level 10 — Reg Roulette (US/EU)",
    badge: "Reg Ace",
    estMins: 18,
    cards: [
      { id: "r-nms", title: "SEC: Reg NMS", bullets: ["Order protection, access fees, market data.", "Impact on routing & fragmentation."]},
      { id: "r-sho", title: "SEC: Reg SHO", bullets: ["Locates/close-out, marking, price test.", "Threshold lists & fails."]},
      { id: "r-15c35", title: "SEC: 15c3-5", bullets: ["Market access controls for broker-dealers.", "Pre-trade credit, fat-finger, kill-switch."]},
      { id: "r-atsn", title: "SEC: Reg ATS / ATS-N", bullets: ["ATS disclosures, conflicts, segmentation.", "NMS stock ATS transparency."]},
      { id: "r-cat", title: "SEC: CAT", bullets: ["Order/event reporting across venues.", "Lifecycle & linkage."]},
      { id: "r-title7", title: "Dodd-Frank Title VII", bullets: ["CFTC swaps vs SEC SBS split.", "Dealer registration, margin, reporting/clearing."]},
      { id: "r-emi", title: "EU: EMIR", bullets: ["Clearing/margin/reporting for OTC.", "CCP risk frameworks."]},
      { id: "r-mifid", title: "EU: MiFID II/MiFIR", bullets: ["Best ex, transparency, algo controls.", "Research unbundling (EU)."]},
      { id: "r-mar", title: "EU: MAR", bullets: ["Insider dealing & market manipulation.", "Scope across instruments/venues."]},
      { id: "r-volcker", title: "US: Volcker Rule", bullets: ["Prop trading & covered funds limits.", "Underwriting/market-making exemptions."]},
      { id: "r-positions", title: "CFTC Position Limits", bullets: ["Commodity positions & hedging exemptions.", "Reporting & monitoring."]},
      { id: "r-priips", title: "EU: PRIIPs KIDs", bullets: ["Retail KIDs for packaged products.", "Not usually GBM, but relevant for distribution."]},
    ],
    quiz: [
      { q: "Security-based swaps fall under…", choices: ["SEC", "CFTC", "FINRA"], answer: 0, explain: "SEC regulates SBS like single-name CDS and equity swaps." },
      { q: "Which rule anchors broker-sponsored DMA controls?", choices: ["Reg SHO", "15c3-5", "Reg ATS"], answer: 1, explain: "15c3-5 is the Market Access Rule." },
      { q: "EU rule focused on market abuse?", choices: ["MiFID II", "MAR", "EMIR"], answer: 1, explain: "MAR governs insider dealing and manipulation." },
    ],
  },
  {
    id: "level-11-cases",
    title: "Level 11 — Case Files (Learn from Stress)",
    badge: "Case Closer",
    estMins: 15,
    cards: [
      { id: "cs-archegos", title: "Archegos & Equity Swaps", bullets: [
        "Theme: Concentration + TRS exposure via PB; rapid unwind risk.",
        "Controls: Client concentration & margin add-ons, CSA agility, WWR overlays, stress testing.",
        "Lesson: Transparent exposure aggregation across primes & products; early-warning triggers.",
      ]},
      { id: "cs-lme", title: "LME Nickel 2022", bullets: [
        "Theme: Extreme short squeeze & market halt; liquidity evaporates.",
        "Controls: Concentration & position limits, collateral eligibility & haircuts, scenario playbooks.",
        "Lesson: Venue dependency & governance; stress liquidity buffers.",
      ]},
      { id: "cs-ust2020", title: "UST March 2020", bullets: [
        "Theme: Treasury market dislocation; margin spikes; basis risk.",
        "Controls: Intraday funding playbooks, CCP coordination, eligible collateral expansion.",
        "Lesson: Cross-CCP liquidity mgmt is existential in stress.",
      ]},
      { id: "cs-meme2021", title: "Meme Equities 2021", bullets: [
        "Theme: Borrow tightness/recalls; volatility; retail dynamics impacting institutional flow.",
        "Controls: Locate enforcement, concentration add-ons, trading halts & risk limits.",
        "Lesson: Collateral and borrow constraints can dominate execution choices.",
      ]},
    ],
    quiz: [
      { q: "TRS exposure + concentrated long in single names — key overlay?", choices: ["Venue due diligence", "WWR add-on + tighter margin", "TCA sampling"], answer: 1, explain: "Add-ons and tighter thresholds mitigate correlated stress losses." },
      { q: "Dislocated basis + CCP calls — most immediate lever?", choices: ["Marketing", "Intraday liquidity & eligible collateral", "Rebrand the algo"], answer: 1, explain: "Liquidity buffers & collateral readiness address VM spikes." },
    ],
  },
];

// Merge extra levels into the curriculum
DATA.levels = [...DATA.levels, ...EXTRA_LEVELS];

// -----------------------------
// UI Helpers
// -----------------------------
const STORAGE_KEY = "gbm-trainer-progress-v131";

function usePersistentState(key, defaultValue) {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : defaultValue;
    } catch {
      return defaultValue;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {}
  }, [key, state]);
  return [state, setState];
}

function ProgressPill({ pct, label }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-40 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-gray-900" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-gray-700">{label}</span>
    </div>
  );
}

function Card({ title, children, right }) {
  return (
    <div className="rounded-2xl shadow-sm border border-gray-200 bg-white p-4 md:p-6 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-lg md:text-xl font-semibold text-gray-900">{title}</h3>
        {right}
      </div>
      <div className="prose prose-sm max-w-none text-gray-800">{children}</div>
    </div>
  );
}

function Pill({ children }) {
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-medium border border-gray-200">
      {children}
    </span>
  );
}

function Badge({ children }) {
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-gray-900 text-white text-xs font-medium">
      {children}
    </span>
  );
}

// -----------------------------
// Quiz Engine
// -----------------------------
function Quiz({ items, onComplete }) {
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [choice, setChoice] = useState(null);
  const [showExp, setShowExp] = useState(false);

  const item = items[i];

  function submit() {
    if (choice == null) return;
    const correct = choice === item.answer;
    setScore((s) => s + (correct ? 1 : 0));
    setShowExp(true);
  }
  function next() {
    setShowExp(false);
    setChoice(null);
    if (i + 1 < items.length) setI(i + 1);
    else onComplete(score);
  }

  return (
    <div className="rounded-2xl border border-gray-200 p-4 md:p-6 bg-gray-50">
      <div className="text-sm text-gray-600 mb-2">Question {i + 1} / {items.length}</div>
      <div className="text-base md:text-lg font-medium text-gray-900 mb-3">{item.q}</div>
      <div className="flex flex-col gap-2">
        {item.choices.map((c, idx) => (
          <label key={idx} className={`flex items-start gap-2 p-3 rounded-xl border ${choice===idx? 'border-gray-900 bg-white':'border-gray-200 bg-white hover:border-gray-300'}`}>
            <input type="radio" name="q" className="mt-1" checked={choice===idx} onChange={() => setChoice(idx)} />
            <span>{c}</span>
          </label>
        ))}
      </div>
      {!showExp ? (
        <div className="mt-4 flex gap-3">
          <button onClick={submit} className="px-4 py-2 rounded-xl bg-gray-900 text-white text-sm font-medium">Submit</button>
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          <div className="text-sm text-gray-800"><strong>{choice===item.answer? 'Correct!':'Not quite.'}</strong> {item.explain}</div>
          <button onClick={next} className="px-4 py-2 rounded-xl bg-gray-900 text-white text-sm font-medium">{i+1<items.length? 'Next':'Finish'}</button>
        </div>
      )}
    </div>
  );
}

// -----------------------------
// Main App
// -----------------------------
export default function App() {
  const [progress, setProgress] = usePersistentState(STORAGE_KEY, {
    unlocked: { 'level-1': true },
    scores: {},
    streak: 0,
  });
  const [mode, setMode] = useState("study"); // study | quiz | library
  const [activeLevel, setActiveLevel] = useState(DATA.levels[0].id);

  const currentLevel = useMemo(
    () => DATA.levels.find((l) => l.id === activeLevel) ?? DATA.levels[0],
    [activeLevel]
  );

  const completed = Object.keys(progress.scores).length;
  const pct = Math.round((completed / DATA.levels.length) * 100);

  function finishQuiz(score) {
    const total = currentLevel.quiz.length;
    const pass = score >= Math.max(1, Math.ceil(total * 0.7));
    setProgress((p) => {
      const next = { ...p };
      next.scores[currentLevel.id] = { score, total, passed: pass };
      // Unlock next level on pass
      const idx = DATA.levels.findIndex((l) => l.id === currentLevel.id);
      if (pass && idx >= 0 && idx < DATA.levels.length - 1) {
        const nxt = DATA.levels[idx + 1].id;
        next.unlocked[nxt] = true;
        next.streak = (p.streak || 0) + 1;
      } else {
        next.streak = 0;
      }
      return next;
    });
    setMode("study");
  }

  function resetProgress() {
    setProgress({ unlocked: { 'level-1': true }, scores: {}, streak: 0 });
    setActiveLevel(DATA.levels[0].id);
    setMode("study");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900">
      <header className="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-white/60 bg-white/90 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-gray-900 text-white grid place-items-center font-bold">GS</div>
            <div>
              <div className="text-sm uppercase tracking-wide text-gray-500">{DATA.meta.title}</div>
              <div className="font-semibold">{DATA.meta.subtitle}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-40 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gray-900" style={{ width: `${pct}%` }} />
              </div>
              <span className="text-xs text-gray-700">{`${completed}/${DATA.levels.length} levels`}</span>
            </div>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-medium border border-gray-200">Streak: {progress.streak}</span>
            <button onClick={() => setMode("study")} className={`px-3 py-1.5 rounded-lg text-sm font-medium ${mode==='study'?'bg-gray-900 text-white':'bg-gray-100 hover:bg-gray-200'}`}>Study</button>
            <button onClick={() => setMode("quiz")} className={`px-3 py-1.5 rounded-lg text-sm font-medium ${mode==='quiz'?'bg-gray-900 text-white':'bg-gray-100 hover:bg-gray-200'}`}>Quiz</button>
            <button onClick={() => setMode("library")} className={`px-3 py-1.5 rounded-lg text-sm font-medium ${mode==='library'?'bg-gray-900 text-white':'bg-gray-100 hover:bg-gray-200'}`}>Library</button>
            <button onClick={resetProgress} className="px-3 py-1.5 rounded-lg text-sm font-medium bg-white border border-gray-300 hover:bg-gray-50">Reset</button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 md:py-10 space-y-6">
        {/* Level Navigator */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {DATA.levels.map((lvl, i) => {
            const unlocked = !!progress.unlocked[lvl.id];
            const score = progress.scores[lvl.id];
            return (
              <div key={lvl.id} className={`p-4 rounded-2xl border ${unlocked? 'border-gray-200 bg-white':'border-dashed border-gray-300 bg-gray-50'} flex flex-col gap-2`}>
                <div className="flex items-center justify-between gap-3">
                  <div className="font-semibold">{lvl.title}</div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-gray-900 text-white text-xs font-medium">{lvl.badge}</span>
                </div>
                <div className="text-sm text-gray-600">~{lvl.estMins} min · {lvl.cards.length} study cards</div>
                <div className="flex items-center gap-2">
                  {score ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-medium border border-gray-200">Score: {score.score}/{score.total} {score.passed? '✓':''}</span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-medium border border-gray-200">Locked? {unlocked? 'No':'Yes'}</span>
                  )}
                </div>
                <div className="mt-2 flex gap-2">
                  <button disabled={!unlocked} onClick={() => { setActiveLevel(lvl.id); setMode('study'); }} className={`px-3 py-1.5 rounded-lg text-sm font-medium ${unlocked? 'bg-gray-900 text-white':'bg-gray-200 text-gray-500 cursor-not-allowed'}`}>Open</button>
                  <button disabled={!unlocked} onClick={() => { setActiveLevel(lvl.id); setMode('quiz'); }} className={`px-3 py-1.5 rounded-lg text-sm font-medium ${unlocked? 'bg-gray-100 hover:bg-gray-200':'bg-gray-200 text-gray-500 cursor-not-allowed'}`}>Quiz</button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Active Level */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl md:text-3xl font-bold">{currentLevel.title}</h2>
            <div className="text-sm text-gray-600">Complete the quiz ≥70% to unlock the next level.</div>
          </div>

          {mode === "study" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentLevel.cards.map((c) => (
                <div key={c.id} className="rounded-2xl shadow-sm border border-gray-200 bg-white p-4 md:p-6 flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-lg md:text-xl font-semibold text-gray-900">{c.title}</h3>
                  </div>
                  <div className="prose prose-sm max-w-none text-gray-800">
                    <ul className="list-disc pl-5">
                      {c.bullets.map((b, i) => (<li key={i}>{b}</li>))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}

          {mode === "quiz" && (
            <Quiz items={currentLevel.quiz} onComplete={finishQuiz} />
          )}

          {mode === "library" && (
            <div className="rounded-2xl shadow-sm border border-gray-200 bg-white p-4 md:p-6 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-lg md:text-xl font-semibold text-gray-900">Product Library</h3>
              </div>
              <div className="prose prose-sm max-w-none text-gray-800">
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="text-left border-b">
                        {"Product,Clients,Uses,Revenue,Risks,Key Regs".split(",").map((h) => (
                          <th key={h} className="py-2 pr-6 font-semibold">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {PRODUCT_LIBRARY.map((row, idx) => (
                        <tr key={idx} className="border-b last:border-0 align-top">
                          <td className="py-2 pr-6 font-medium">{row.product}</td>
                          <td className="py-2 pr-6">{row.clients}</td>
                          <td className="py-2 pr-6">{row.uses}</td>
                          <td className="py-2 pr-6">{row.revenue}</td>
                          <td className="py-2 pr-6">{row.risks}</td>
                          <td className="py-2 pr-6">{row.regs}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Footer / About */}
        <section>
          <div className="rounded-2xl shadow-sm border border-gray-200 bg-white p-4 md:p-6 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-lg md:text-xl font-semibold text-gray-900">About this app</h3>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-medium border border-gray-200">v{DATA.meta.version}</span>
            </div>
            <div className="prose prose-sm max-w-none text-gray-800">
              <p>
                Built for accelerated mastery of Goldman Sachs Global Banking & Markets topics. Study cards cover
                products, clients, revenue mechanics, risks and key regulations; quizzes unlock progressively harder
                levels. Your progress saves to your browser (local only).
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Content distilled from Goldman Sachs public disclosures (GBM, FICC/Equities, Prime Services, Marquee, clearing)
                and U.S./EU regulatory sources (SEC, CFTC, FINRA, ESMA). See the chat message for a curated source list.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
