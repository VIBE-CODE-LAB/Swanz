// Swanz — shared chrome (header, footer), product data helpers, cards and quick-view modal.
const ALL = window.SWANZ.products;
const byId = id => ALL.find(p => p.id === id);
const $ = id => document.getElementById(id);
const catLabel = c => (c === "Printed" ? "Printed collection" : c);

// ---- Header + footer ----
const NAV = [
  ["Bras", "shop.html?cat=Bras"],
  ["Bralettes", "shop.html?cat=Bralettes"],
  ["Printed Collection", "shop.html?cat=Printed"],
  ["Panties", "shop.html?cat=Panties"],
  ["Shop All", "shop.html"],
  ["Our Story", "index.html#story"],
];
const searchForm = id => `
  <form class="search" role="search" data-search>
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
    <input id="${id}" type="search" name="q" placeholder="Search" aria-label="Search products" autocomplete="off">
  </form>`;

document.body.insertAdjacentHTML("afterbegin", `
  <p class="announce">New: the Printed Collection &nbsp;·&nbsp; Follow us on Instagram @swanz</p>
  <header class="site-header">
    <button class="menu-toggle" aria-label="Open menu" aria-expanded="false" aria-controls="nav"><span></span><span></span></button>
    <div class="head-search">${searchForm("q1")}</div>
    <a href="index.html" class="logo" aria-label="Swanz home">Swanz</a>
    <a class="header-cta" href="https://www.instagram.com/" target="_blank" rel="noopener">Instagram</a>
    <nav id="nav" class="nav" aria-label="Primary">
      <div class="nav-search">${searchForm("q2")}</div>
      ${NAV.map(([t, h]) => `<a href="${h}">${t}</a>`).join("")}
    </nav>
  </header>`);

document.body.insertAdjacentHTML("beforeend", `
  <footer class="footer" id="contact">
    <div class="footer-brand">
      <a href="index.html" class="logo">Swanz</a>
      <p>Classic premium grace.</p>
    </div>
    <div><h3>Shop</h3>
      <a href="shop.html?cat=Bras">Bras</a><a href="shop.html?cat=Bralettes">Bralettes</a>
      <a href="shop.html?cat=Printed">Printed Collection</a><a href="shop.html?cat=Panties">Panties</a></div>
    <div><h3>Connect</h3>
      <a href="index.html#story">Our Story</a>
      <a href="https://www.instagram.com/" target="_blank" rel="noopener">Instagram</a>
      <a href="mailto:hello@swanz.example">hello@swanz.example</a></div>
    <p class="legal">© ${new Date().getFullYear()} Swanz. Showcase site — products are shown for viewing only.</p>
  </footer>
  <div class="modal" id="modal" hidden>
    <div class="modal-backdrop" data-close></div>
    <article class="modal-card" role="dialog" aria-modal="true" aria-labelledby="mTitle">
      <button class="modal-close" data-close aria-label="Close">&times;</button>
      <div class="modal-media"><img id="mImg" alt=""><div class="thumbs" id="mThumbs"></div></div>
      <div class="modal-body">
        <p class="eyebrow" id="mCat"></p>
        <h3 id="mTitle"></h3>
        <p class="code" id="mCode"></p>
        <p id="mDesc"></p>
        <h4>Colour · <span id="mColor"></span></h4>
        <div class="swatches" id="mSwatches"></div>
        <ul class="details" id="mDetails"></ul>
        <a class="btn" href="https://www.instagram.com/" target="_blank" rel="noopener">Enquire on Instagram</a>
      </div>
    </article>
  </div>`);

// Mobile menu
const toggle = document.querySelector(".menu-toggle");
const nav = $("nav");
toggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  toggle.setAttribute("aria-expanded", open);
  toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
});
nav.addEventListener("click", e => {
  if (e.target.closest("a")) { nav.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); }
});

// Search: on the shop page it filters live (shop.js sets window.onSearch); elsewhere it jumps to the shop page.
document.querySelectorAll("[data-search]").forEach(f => {
  const input = f.querySelector("input");
  f.addEventListener("submit", e => {
    e.preventDefault();
    const q = input.value.trim();
    if (window.onSearch) window.onSearch(q);
    else location.href = "shop.html" + (q ? "?q=" + encodeURIComponent(q) : "");
    nav.classList.remove("open");
  });
  input.addEventListener("input", () => {
    document.querySelectorAll("[data-search] input").forEach(i => { if (i !== input) i.value = input.value; });
    if (window.onSearch) window.onSearch(input.value.trim());
  });
});

// ---- Product card ----
function cardHTML(p) {
  const v = p.variants[0];
  const alt = v.images[1] || v.images[0];
  return `
  <button class="card" data-id="${p.id}" aria-label="View ${p.name}">
    <div class="card-media">
      <img class="img-a" src="${v.images[0]}" alt="${p.name}" loading="lazy">
      <img class="img-b" src="${alt}" alt="" loading="lazy">
      <span class="view">Quick view</span>
    </div>
    <div class="card-info">
      <span class="card-cat">${catLabel(p.cat)}</span>
      <span class="card-name">${p.name}</span>
      <span class="dots">${p.variants.map(c => `<i class="dot" style="background:${c.hex}" title="${c.name}"></i>`).join("")}</span>
    </div>
  </button>`;
}

// ---- Quick view ----
const modal = $("modal");
let lastFocus = null, current = null;
function showImage(src, name) {
  $("mImg").src = src; $("mImg").alt = name;
  $("mThumbs").querySelectorAll("button").forEach(b => b.classList.toggle("is-active", b.dataset.src === src));
}
function showVariant(i) {
  const v = current.variants[i];
  $("mColor").textContent = v.name;
  $("mSwatches").querySelectorAll("button").forEach((b, n) => b.classList.toggle("is-active", n === i));
  $("mThumbs").innerHTML = v.images.map((s, n) =>
    `<button data-src="${s}" aria-label="Photo ${n + 1}"><img src="${s}" alt="" loading="lazy"></button>`).join("");
  showImage(v.images[0], `${current.name} in ${v.name}`);
}
function openModal(id) {
  current = byId(+id);
  lastFocus = document.activeElement;
  $("mCat").textContent = catLabel(current.cat);
  $("mTitle").textContent = current.name;
  $("mCode").textContent = "Style " + current.code;
  $("mDesc").textContent = current.desc;
  $("mDetails").innerHTML = current.details.map(d => `<li>${d}</li>`).join("");
  $("mSwatches").innerHTML = current.variants.map((v, n) =>
    `<button class="swatch" data-i="${n}"><i style="background:${v.hex}"></i>${v.name}</button>`).join("");
  showVariant(0);
  modal.hidden = false;
  document.body.style.overflow = "hidden";
  modal.querySelector(".modal-card").scrollTop = 0;
  modal.querySelector(".modal-close").focus();
}
function closeModal() {
  modal.hidden = true; document.body.style.overflow = "";
  if (lastFocus) lastFocus.focus();
}
document.addEventListener("click", e => {
  const card = e.target.closest(".card");
  if (card) openModal(card.dataset.id);
});
$("mSwatches").addEventListener("click", e => { const b = e.target.closest(".swatch"); if (b) showVariant(+b.dataset.i); });
$("mThumbs").addEventListener("click", e => { const b = e.target.closest("button"); if (b) showImage(b.dataset.src, current.name); });
modal.addEventListener("click", e => { if (e.target.closest("[data-close]")) closeModal(); });
document.addEventListener("keydown", e => { if (e.key === "Escape" && !modal.hidden) closeModal(); });
