/* MGM Owner Competitive Intel — Leaflet app logic */

// ---------- Map setup ----------
const map = L.map("map", { zoomControl: true }).setView([45.25, -92.95], 11);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// ---------- Color palette ----------
const COLORS = {
  mgm: "#dc2626",
  "big-box": "#1d4ed8",
  specialty: "#15803d",
  municipal: "#7c3aed",
  grocery: "#ea580c"
};

// ---------- Haversine distance (miles) ----------
function milesBetween(a, b) {
  const R = 3958.8;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

// ---------- Build marker icons ----------
function circleIcon(color, size = 14, ring = false) {
  const border = ring ? "3px solid #fff" : "2px solid #fff";
  const shadow = ring ? "0 0 0 3px rgba(220,38,38,0.35)" : "0 0 0 1px rgba(0,0,0,0.35)";
  return L.divIcon({
    className: "custom-pin",
    html: `<span style="
      display:block;width:${size}px;height:${size}px;border-radius:50%;
      background:${color};border:${border};box-shadow:${shadow};"></span>`,
    iconSize: [size + 6, size + 6],
    iconAnchor: [(size + 6) / 2, (size + 6) / 2]
  });
}

// ---------- Annotate competitors with distance to each MGM ----------
COMPETITORS.forEach((c) => {
  c.distances = {};
  MY_STORES.forEach((s) => {
    c.distances[s.id] = milesBetween(c, s);
  });
  c.nearestStore = MY_STORES.reduce(
    (best, s) => (c.distances[s.id] < best.dist ? { id: s.id, name: s.name, dist: c.distances[s.id] } : best),
    { id: null, name: null, dist: Infinity }
  );
});

// ---------- Layers ----------
const mgmLayer = L.layerGroup().addTo(map);
const competitorLayer = L.layerGroup().addTo(map);
const ringLayer = L.layerGroup().addTo(map);

// ---------- Draw MGM stores + trade-area rings ----------
MY_STORES.forEach((s) => {
  const marker = L.marker([s.lat, s.lng], {
    icon: circleIcon(COLORS.mgm, 18, true),
    zIndexOffset: 1000
  });
  marker.bindPopup(
    `<div class="popup-title">${s.name}</div>
     <div class="popup-meta">${s.address || s.city}</div>
     <div class="popup-impact popup-mgm">
       Trade area: ~${s.tradeAreaMiles} mi<br>${s.notes}
     </div>`
  );
  marker.addTo(mgmLayer);

  const ring = L.circle([s.lat, s.lng], {
    radius: s.tradeAreaMiles * 1609.34,
    color: "#dc2626",
    weight: 1.5,
    fillColor: "#dc2626",
    fillOpacity: 0.06,
    dashArray: "4,4"
  });
  ring.addTo(ringLayer);
});

// ---------- Render competitors based on filters ----------
const competitorMarkers = new Map();

function threatBadge(level) {
  const labels = { 1: "Low", 2: "Minor", 3: "Notable", 4: "High", 5: "Critical" };
  const colors = { 1: "#9ca3af", 2: "#6b7280", 3: "#f59e0b", 4: "#ea580c", 5: "#b91c1c" };
  return `<span class="threat-badge" style="background:${colors[level]}">T${level} · ${labels[level]}</span>`;
}

function competitorPopup(c) {
  const distRows = MY_STORES.map((s) => {
    const d = c.distances[s.id];
    const strong = d <= s.tradeAreaMiles;
    return `<div class="dist-row ${strong ? "dist-hit" : ""}">
              ${s.name}: <strong>${d.toFixed(1)} mi</strong>
              ${strong ? " ⚠ inside trade area" : ""}
            </div>`;
  }).join("");

  return `
    <div class="popup-title">${c.name}</div>
    <div class="popup-meta">${c.city} · ${threatBadge(c.threat)}</div>
    <div class="popup-impact">${c.notes}</div>
    <div class="popup-distances">${distRows}</div>
  `;
}

function getActiveFilters() {
  const cats = Array.from(
    document.querySelectorAll('.filters input[type="checkbox"][data-filter]:checked')
  ).map((el) => el.dataset.filter);
  const minThreat = parseInt(document.getElementById("threat-min").value, 10);
  const storeScope = document.getElementById("store-filter").value;
  return { cats, minThreat, storeScope };
}

function passesFilters(c, f) {
  if (!f.cats.includes(c.category)) return false;
  if (c.threat < f.minThreat) return false;
  if (f.storeScope !== "all" && !c.affects.includes(f.storeScope)) return false;
  return true;
}

function renderCompetitors() {
  competitorLayer.clearLayers();
  competitorMarkers.clear();
  const listEl = document.getElementById("list");
  listEl.innerHTML = "";
  const filters = getActiveFilters();

  const visible = COMPETITORS.filter((c) => passesFilters(c, filters))
    .sort((a, b) => b.threat - a.threat || a.nearestStore.dist - b.nearestStore.dist);

  visible.forEach((c) => {
    const marker = L.marker([c.lat, c.lng], {
      icon: circleIcon(COLORS[c.category], 12 + c.threat)
    }).bindPopup(competitorPopup(c));
    marker.addTo(competitorLayer);
    competitorMarkers.set(c.name, marker);

    const li = document.createElement("li");
    li.innerHTML = `
      <span class="swatch" style="background:${COLORS[c.category]}"></span>
      <div>
        <div><strong>${c.name}</strong> ${threatBadge(c.threat)}</div>
        <div class="meta">${c.city} · nearest: ${c.nearestStore.name.replace("MGM ", "")}
          (${c.nearestStore.dist.toFixed(1)} mi)</div>
      </div>`;
    li.addEventListener("click", () => {
      map.setView([c.lat, c.lng], 13, { animate: true });
      marker.openPopup();
    });
    listEl.appendChild(li);
  });

  document.getElementById("count").textContent = `(${visible.length})`;
}

// ---------- Render "My Stores" summary panel ----------
function renderMyStores() {
  const host = document.getElementById("my-stores-list");
  host.innerHTML = "";
  MY_STORES.forEach((s) => {
    const inArea = COMPETITORS.filter(
      (c) => c.distances[s.id] <= s.tradeAreaMiles
    );
    const critical = inArea.filter((c) => c.threat >= 4).length;
    const card = document.createElement("div");
    card.className = "store-card";
    card.innerHTML = `
      <div class="store-card-head">
        <span class="dot mgm"></span>
        <strong>${s.name}</strong>
      </div>
      <div class="store-card-meta">${s.city} · ${s.tradeAreaMiles} mi trade area</div>
      <div class="store-card-stats">
        <span><strong>${inArea.length}</strong> competitors in area</span>
        <span class="${critical ? "crit" : ""}">
          <strong>${critical}</strong> high/critical
        </span>
      </div>
    `;
    card.addEventListener("click", () => {
      map.setView([s.lat, s.lng], 12, { animate: true });
    });
    host.appendChild(card);
  });
}

// ---------- Wire up controls ----------
document
  .querySelectorAll('.filters input[type="checkbox"][data-filter]')
  .forEach((el) => el.addEventListener("change", renderCompetitors));
document.getElementById("threat-min").addEventListener("change", renderCompetitors);
document.getElementById("store-filter").addEventListener("change", renderCompetitors);
document.getElementById("show-rings").addEventListener("change", (e) => {
  if (e.target.checked) ringLayer.addTo(map);
  else map.removeLayer(ringLayer);
});

// ---------- Initial render ----------
renderMyStores();
renderCompetitors();

// Fit bounds to all MGM stores + their trade areas
const bounds = L.latLngBounds(MY_STORES.map((s) => [s.lat, s.lng])).pad(0.5);
map.fitBounds(bounds);
