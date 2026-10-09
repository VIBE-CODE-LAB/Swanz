// Swanz showcase — renders products from assets/data.js (generated from the product photo folders).
const { products: ALL } = window.SWANZ;
// Front page shows 12 products (4 rows of 3 on desktop); the rest stay in assets/data.js.
const FEATURED = [1, 2, 3, 4, 5, 6, 7, 18, 8, 9, 11, 13];
const PRODUCTS = FEATURED.map(id => ALL.find(p => p.id === id));

// ---- Product grid ----
const grid = document.getElementById("productGrid");
function renderProducts(filter = "All") {
  const list = filter === "All" ? PRODUCTS : PRODUCTS.filter(p => p.cat === filter);
  grid.innerHTML = list.map(p => {
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
        <span class="card-cat">${p.cat === "Printed" ? "Printed collection" : p.cat}</span>
        <span class="card-name">${p.name}</span>
        <span class="dots">${p.variants.map(c => `<i class="dot" style="background:${c.hex}" title="${c.name}"></i>`).join("")}</span>
      </div>
    </button>`;
  }).join("");
}

function setFilter(f) {
  document.querySelectorAll(".chip").forEach(c => c.classList.toggle("is-active", c.dataset.filter === f));
  renderProducts(f);
}
document.querySelectorAll(".chip").forEach(c => c.addEventListener("click", () => setFilter(c.dataset.filter)));
document.querySelectorAll(".cat").forEach(c => c.addEventListener("click", () => setFilter(c.dataset.filter)));

// ---- Quick view modal ----
const $ = id => document.getElementById(id);
const modal = $("modal");
let lastFocus = null, current = null, vi = 0;

function showImage(src, name) {
  $("mImg").src = src;
  $("mImg").alt = name;
  $("mThumbs").querySelectorAll("button").forEach(b => b.classList.toggle("is-active", b.dataset.src === src));
}
function showVariant(i) {
  vi = i;
  const v = current.variants[i];
  $("mColor").textContent = v.name;
  $("mSwatches").querySelectorAll("button").forEach((b, n) => b.classList.toggle("is-active", n === i));
  $("mThumbs").innerHTML = v.images.map((s, n) =>
    `<button data-src="${s}" aria-label="Photo ${n + 1}"><img src="${s}" alt="" loading="lazy"></button>`).join("");
  showImage(v.images[0], `${current.name} in ${v.name}`);
}
function openModal(id) {
  current = PRODUCTS.find(x => x.id === +id);
  lastFocus = document.activeElement;
  $("mCat").textContent = current.cat === "Printed" ? "Printed collection" : current.cat;
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
  modal.hidden = true;
  document.body.style.overflow = "";
  if (lastFocus) lastFocus.focus();
}
grid.addEventListener("click", e => {
  const card = e.target.closest(".card");
  if (card) openModal(card.dataset.id);
});
$("mSwatches").addEventListener("click", e => {
  const b = e.target.closest(".swatch");
  if (b) showVariant(+b.dataset.i);
});
$("mThumbs").addEventListener("click", e => {
  const b = e.target.closest("button");
  if (b) showImage(b.dataset.src, current.name);
});
modal.addEventListener("click", e => { if (e.target.closest("[data-close]")) closeModal(); });
document.addEventListener("keydown", e => { if (e.key === "Escape" && !modal.hidden) closeModal(); });

// ---- Instagram strip: a mix of product photos ----
const picks = [[10, 1], [5, 1], [14, 1], [1, 1], [18, 1], [8, 1]]; // [product id, image index]
$("instaGrid").innerHTML = picks.map(([id, n]) => {
  const p = ALL.find(x => x.id === id);
  const imgs = p.variants[0].images;
  return `<a class="insta" href="https://www.instagram.com/" target="_blank" rel="noopener" aria-label="${p.name} on Instagram"><img src="${imgs[n] || imgs[0]}" alt="${p.name}" loading="lazy"></a>`;
}).join("");

// ---- Mobile nav ----
const toggle = document.querySelector(".menu-toggle");
const nav = $("nav");
toggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  toggle.setAttribute("aria-expanded", open);
  toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
});
nav.addEventListener("click", e => {
  if (e.target.tagName === "A") { nav.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); }
});

$("yr").textContent = new Date().getFullYear();
renderProducts();
