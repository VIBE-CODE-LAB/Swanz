// Shop page: filter chips + live search over every product.
const grid = $("productGrid");
const params = new URLSearchParams(location.search);
let cat = params.get("cat") || "All";
let query = (params.get("q") || "").toLowerCase();
if (!["All", "Bras", "Bralettes", "Printed", "Panties"].includes(cat)) cat = "All";

function render() {
  const list = ALL.filter(p =>
    (cat === "All" || p.cat === cat) &&
    (!query || (p.name + " " + p.cat + " " + p.code + " " + p.variants.map(v => v.name).join(" ")).toLowerCase().includes(query)));
  grid.innerHTML = list.length ? list.map(cardHTML).join("") : `<p class="empty">No products match “${query}”. Try “bra”, “navy” or “panty”.</p>`;
  $("count").textContent = `${list.length} ${list.length === 1 ? "style" : "styles"}`;
  $("shopTitle").textContent = cat === "All" ? "Shop all" : catLabel(cat);
  document.querySelectorAll(".chip").forEach(c => c.classList.toggle("is-active", c.dataset.filter === cat));
}
document.querySelectorAll(".chip").forEach(c => c.addEventListener("click", () => {
  cat = c.dataset.filter;
  history.replaceState(null, "", cat === "All" ? "shop.html" : "shop.html?cat=" + cat);
  render();
}));
window.onSearch = q => { query = q.toLowerCase(); render(); };
document.querySelectorAll("[data-search] input").forEach(i => i.value = params.get("q") || "");
render();
