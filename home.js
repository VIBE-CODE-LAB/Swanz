// Home page: best sellers, Instagram strip, hero banner rotation.
$("bestGrid").innerHTML = [1, 5, 8, 18].map(id => cardHTML(byId(id))).join("");

const picks = [[10, 1], [5, 0], [14, 1], [1, 1], [18, 1], [8, 1]]; // [product id, image index]
$("instaGrid").innerHTML = picks.map(([id, n]) => {
  const p = byId(id), imgs = p.variants[0].images;
  return `<a class="insta" href="https://www.instagram.com/" target="_blank" rel="noopener" aria-label="${p.name} on Instagram"><img src="${imgs[n] || imgs[0]}" alt="${p.name}" loading="lazy"></a>`;
}).join("");

// Hero rotation
const slides = [...document.querySelectorAll(".slide")];
const dots = [...document.querySelectorAll(".hero-dots button")];
const hero = document.querySelector(".hero");
let idx = 0, timer = null;
function go(i) {
  idx = (i + slides.length) % slides.length;
  slides.forEach((s, n) => {
    s.classList.toggle("is-active", n === idx);
    s.setAttribute("aria-hidden", n !== idx);
    s.querySelectorAll("a").forEach(a => a.tabIndex = n === idx ? 0 : -1);
  });
  dots.forEach((d, n) => d.classList.toggle("is-active", n === idx));
}
const play = () => { clearInterval(timer); if (!matchMedia("(prefers-reduced-motion: reduce)").matches) timer = setInterval(() => go(idx + 1), 6500); };
dots.forEach((d, n) => d.addEventListener("click", () => { go(n); play(); }));
hero.addEventListener("mouseenter", () => clearInterval(timer));
hero.addEventListener("mouseleave", play);
play();
