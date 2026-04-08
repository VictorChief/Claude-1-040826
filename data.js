/*
 * MGM Wine & Spirits — Owner Competitive Dataset
 * Stores owned: Forest Lake, Hugo, Chisago City (NE metro / Chisago County, MN)
 *
 * IMPORTANT: Coordinates and competitor rosters below are APPROXIMATE,
 * compiled from public/general knowledge of the I-35 / Hwy 8 corridor.
 * Treat this as a starting framework — verify each competitor (name,
 * address, hours, square footage, ownership) against ground-truth before
 * making capital, pricing, or assortment decisions.
 *
 * Schema:
 *   category   – mgm | big-box | specialty | municipal | grocery
 *   threat     – 1 (low) … 5 (critical) — qualitative impact on YOUR stores
 *   affects    – which of your stores it pressures: ["forest-lake","hugo","chisago"]
 *   notes      – why it matters
 */

const MY_STORES = [
  {
    id: "forest-lake",
    name: "MGM Forest Lake",
    address: "2009 West Broadway Ave #100, Forest Lake, MN 55025",
    city: "Forest Lake, MN",
    // Verified coordinates (owner-confirmed via Google Maps).
    lat: 45.283269,
    lng: -93.010158,
    tradeAreaMiles: 5,
    notes: "Anchor store on the Hwy 61 / I-35 corridor. Trade area pulls from Forest Lake, Wyoming, Columbus, Linwood, and weekend lake traffic."
  },
  {
    id: "hugo",
    name: "MGM Hugo",
    address: "5441 140th St N, Hugo, MN 55038",
    city: "Hugo, MN",
    // Best-estimate coords for 5441 140th St N (Hugo core near Hwy 61 /
    // 140th intersection). VERIFY against Google Maps and adjust.
    lat: 45.1614,
    lng: -92.9933,
    tradeAreaMiles: 4,
    notes: "Bedroom-community store. Trade area: Hugo, Centerville, Lino Lakes, parts of White Bear Township. Heavy commuter traffic on Hwy 61."
  },
  {
    id: "chisago",
    name: "MGM Chisago City",
    city: "Chisago City, MN",
    lat: 45.3744,
    lng: -92.8888,
    tradeAreaMiles: 5,
    notes: "Hwy 8 corridor store. Trade area: Chisago City, Lindstrom, Center City, Shafer, weekend cabin traffic to/from Taylors Falls."
  }
];

const COMPETITORS = [
  // ============================================================
  // FOREST LAKE TRADE AREA
  // ============================================================
  {
    name: "Festival Foods Wine & Spirits — Forest Lake",
    city: "Forest Lake",
    category: "grocery",
    lat: 45.2740, lng: -92.9810,
    threat: 4,
    affects: ["forest-lake"],
    notes: "Co-tenanted with the grocery; captures the convenience / fill-in trip occasion. Strong promo cadence on beer."
  },
  {
    name: "Cub Wine & Spirits — Forest Lake",
    city: "Forest Lake",
    category: "grocery",
    lat: 45.2785, lng: -92.9870,
    threat: 4,
    affects: ["forest-lake"],
    notes: "Grocery-adjacent; competes on everyday wine and 12/24-pack beer. High weekly trip frequency."
  },
  {
    name: "Lake Liquor (independent)",
    city: "Forest Lake",
    category: "specialty",
    lat: 45.2820, lng: -92.9890,
    threat: 3,
    affects: ["forest-lake"],
    notes: "Local independent; loyalty-driven. Watch for craft-beer assortment and weekend tasting events."
  },
  {
    name: "Wyoming Liquor",
    city: "Wyoming, MN",
    category: "specialty",
    lat: 45.3380, lng: -92.9870,
    threat: 3,
    affects: ["forest-lake", "chisago"],
    notes: "Splits Wyoming/Stacy traffic between Forest Lake and Chisago City. Sits at the I-35 exit — high visibility."
  },
  {
    name: "Stacy Municipal Liquor",
    city: "Stacy, MN",
    category: "municipal",
    lat: 45.3970, lng: -92.9870,
    threat: 2,
    affects: ["forest-lake", "chisago"],
    notes: "City-run; profits return to Stacy general fund. Structural price advantage on commodity SKUs."
  },

  // ============================================================
  // HUGO TRADE AREA
  // ============================================================
  {
    name: "Cub Wine & Spirits — Hugo (Oneka Pkwy)",
    city: "Hugo",
    category: "grocery",
    lat: 45.1620, lng: -92.9930,
    threat: 5,
    affects: ["hugo"],
    notes: "DIRECT overlap — within walking distance of MGM Hugo. Grocery cross-traffic is the single biggest risk to fill-in visits."
  },
  {
    name: "Hugo Bottle Shop / local independent",
    city: "Hugo",
    category: "specialty",
    lat: 45.1635, lng: -92.9905,
    threat: 3,
    affects: ["hugo"],
    notes: "Small-format independent; competes on convenience and personal service for the Hugo core."
  },
  {
    name: "Centerville Market & Liquor",
    city: "Centerville, MN",
    category: "specialty",
    lat: 45.1610, lng: -93.0540,
    threat: 3,
    affects: ["hugo"],
    notes: "Pulls Centerville and west-Hugo households before they reach MGM Hugo on Hwy 61."
  },
  {
    name: "Lino Lakes Wine & Spirits",
    city: "Lino Lakes, MN",
    category: "specialty",
    lat: 45.1610, lng: -93.0890,
    threat: 2,
    affects: ["hugo"],
    notes: "Far edge of Hugo trade area but captures commuters returning from I-35W."
  },
  {
    name: "Bald Eagle Wine & Spirits",
    city: "White Bear Lake, MN",
    category: "specialty",
    lat: 45.0830, lng: -93.0050,
    threat: 3,
    affects: ["hugo"],
    notes: "Established premium-leaning store; takes south-Hugo and White Bear Township customers."
  },
  {
    name: "White Bear Liquor & Wine",
    city: "White Bear Lake, MN",
    category: "specialty",
    lat: 45.0855, lng: -93.0100,
    threat: 2,
    affects: ["hugo"],
    notes: "Long-standing local; competes for southern Hugo trade area on selection."
  },

  // ============================================================
  // CHISAGO CITY TRADE AREA
  // ============================================================
  {
    name: "Lindstrom Wine & Spirits",
    city: "Lindstrom, MN",
    category: "specialty",
    lat: 45.3890, lng: -92.8460,
    threat: 5,
    affects: ["chisago"],
    notes: "DIRECT overlap — Lindstrom is contiguous with Chisago City. Likely the #1 competitive threat to MGM Chisago City."
  },
  {
    name: "Center City Wine & Spirits",
    city: "Center City, MN",
    category: "specialty",
    lat: 45.3940, lng: -92.8160,
    threat: 3,
    affects: ["chisago"],
    notes: "Captures Hwy 8 traffic heading east toward Taylors Falls / WI border."
  },
  {
    name: "North Branch Liquor (municipal)",
    city: "North Branch, MN",
    category: "municipal",
    lat: 45.5110, lng: -92.9810,
    threat: 3,
    affects: ["chisago"],
    notes: "Municipal store on the north end of the I-35 corridor. Pulls north-Chisago-County traffic that might otherwise reach MGM Chisago."
  },
  {
    name: "Coborn's Liquor — Forest Lake/Chisago area",
    city: "Chisago County",
    category: "grocery",
    lat: 45.3700, lng: -92.8950,
    threat: 3,
    affects: ["chisago"],
    notes: "Grocery-adjacent convenience play. Verify exact location/banner — the regional banners shift in this market."
  },

  // ============================================================
  // DESTINATION / BIG-BOX (long drive but pulls large baskets)
  // ============================================================
  {
    name: "Total Wine & More — Maple Grove",
    city: "Maple Grove, MN",
    category: "big-box",
    lat: 45.0941, lng: -93.4555,
    threat: 2,
    affects: ["forest-lake", "hugo", "chisago"],
    notes: "~25–30 mi away, but a destination trip for case wine and party stocking. Hits all three of your stores on large-basket occasions."
  },
  {
    name: "Total Wine & More — Woodbury",
    city: "Woodbury, MN",
    category: "big-box",
    lat: 44.9239, lng: -92.9594,
    threat: 2,
    affects: ["hugo"],
    notes: "Closest Total Wine to Hugo (~20 mi south on I-694). Destination trip for premium wine and high-end spirits."
  },
  {
    name: "Costco — Maple Grove",
    city: "Maple Grove, MN",
    category: "big-box",
    lat: 45.0950, lng: -93.4400,
    threat: 1,
    affects: ["forest-lake", "hugo"],
    notes: "Members-only bulk play. Small share but real on case purchases for events."
  }
];
