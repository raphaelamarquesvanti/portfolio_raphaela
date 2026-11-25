/* Apresentação: navegação por teclado, botões, pontos, roda do mouse e dedo (scroll-snap nativo). */
(function () {
  "use strict";
  document.documentElement.classList.add("js");
  var trilho = document.getElementById("slides");
  var slides = Array.prototype.slice.call(trilho.querySelectorAll(".slide"));
  var pontos = document.getElementById("pontos");
  var ant = document.getElementById("anterior"), prox = document.getElementById("proximo");
  var atualEl = document.getElementById("slide-atual"), totalEl = document.getElementById("slide-total");
  var barra = document.getElementById("progresso");
  var atual = 0;
  function dois(n) { return (n < 10 ? "0" : "") + n; }
  totalEl.textContent = dois(slides.length);

  slides.forEach(function (s, i) {
    var b = document.createElement("button");
    b.type = "button";
    b.setAttribute("aria-label", "Ir para o slide " + (i + 1) + ": " + s.getAttribute("aria-label"));
    b.addEventListener("click", function () { ir(i); });
    pontos.appendChild(b);
  });

  function ir(i) {
    i = Math.max(0, Math.min(slides.length - 1, i));
    trilho.scrollTo({ left: slides[i].offsetLeft, behavior: "smooth" });
  }
  function marcar(i) {
    atual = i;
    slides.forEach(function (s, k) { s.classList.toggle("ativo", k === i); });
    Array.prototype.forEach.call(pontos.children, function (b, k) { b.setAttribute("aria-current", k === i ? "true" : "false"); });
    atualEl.textContent = dois(i + 1);
    barra.style.width = ((i + 1) / slides.length * 100) + "%";
    ant.disabled = i === 0; prox.disabled = i === slides.length - 1;
  }

  // qual slide está na tela
  var obs = new IntersectionObserver(function (en) {
    en.forEach(function (e) { if (e.isIntersecting) marcar(slides.indexOf(e.target)); });
  }, { root: trilho, threshold: 0.6 });
  slides.forEach(function (s) { obs.observe(s); });
  marcar(0);

  ant.addEventListener("click", function () { ir(atual - 1); });
  prox.addEventListener("click", function () { ir(atual + 1); });
  document.querySelectorAll("[data-ir]").forEach(function (b) {
    b.addEventListener("click", function () { ir(+b.dataset.ir); });
  });
  document.addEventListener("keydown", function (e) {
    if (e.target.closest("input, textarea")) return;
    if (e.key === "ArrowRight" || e.key === "PageDown" || (e.key === " " && !e.shiftKey)) { e.preventDefault(); ir(atual + 1); }
    else if (e.key === "ArrowLeft" || e.key === "PageUp" || (e.key === " " && e.shiftKey)) { e.preventDefault(); ir(atual - 1); }
    else if (e.key === "Home") { e.preventDefault(); ir(0); }
    else if (e.key === "End") { e.preventDefault(); ir(slides.length - 1); }
  });

  // roda do mouse (vertical) troca de slide, a não ser que o slide tenha rolagem própria
  var travado = false;
  trilho.addEventListener("wheel", function (e) {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;          // trackpad lateral: deixa o navegador
    var s = slides[atual];
    var desce = e.deltaY > 0;
    var podeRolar = desce ? s.scrollTop + s.clientHeight < s.scrollHeight - 2 : s.scrollTop > 2;
    if (podeRolar) return;
    e.preventDefault();
    if (travado || Math.abs(e.deltaY) < 8) return;
    travado = true; setTimeout(function () { travado = false; }, 750);
    ir(atual + (desce ? 1 : -1));
  }, { passive: false });

  /* ---------- setas do diagrama de arquitetura ---------- */
  var NS = "http://www.w3.org/2000/svg";
  function centro(el, base) {
    var r = el.getBoundingClientRect();
    return { x: r.left - base.left + r.width / 2, y: r.top - base.top + r.height / 2, w: r.width / 2, h: r.height / 2 };
  }
  function borda(c, alvo, folga) {
    var dx = alvo.x - c.x, dy = alvo.y - c.y;
    var s = Math.min(Math.abs(c.w / (dx || 1e-6)), Math.abs(c.h / (dy || 1e-6)));
    var len = Math.hypot(dx, dy) || 1;
    return { x: c.x + dx * s + (dx / len) * folga, y: c.y + dy * s + (dy / len) * folga };
  }
  function seta(svg, a, b, curva, n) {
    var p1 = borda(a, b, 8), p2 = borda(b, a, 10);
    var mx = (p1.x + p2.x) / 2, my = (p1.y + p2.y) / 2;
    var nx = -(p2.y - p1.y), ny = p2.x - p1.x, nl = Math.hypot(nx, ny) || 1;
    var cx = mx + nx / nl * curva, cy = my + ny / nl * curva;
    var p = document.createElementNS(NS, "path");
    p.setAttribute("d", "M" + p1.x + "," + p1.y + " Q" + cx + "," + cy + " " + p2.x + "," + p2.y);
    svg.appendChild(p);
    p.style.setProperty("--len", p.getTotalLength()); p.style.setProperty("--n", n);
    var ang = Math.atan2(p2.y - cy, p2.x - cx), t = 10;
    var pt = document.createElementNS(NS, "path");
    pt.setAttribute("class", "ponta");
    pt.setAttribute("d", "M" + p2.x + "," + p2.y + " L" + (p2.x - t * Math.cos(ang - .45)) + "," + (p2.y - t * Math.sin(ang - .45)) +
      " L" + (p2.x - t * Math.cos(ang + .45)) + "," + (p2.y - t * Math.sin(ang + .45)) + "z");
    pt.style.setProperty("--n", n);
    svg.appendChild(pt);
  }
  function montar() {
    document.querySelectorAll(".arq").forEach(function (a) {
      var velho = a.querySelector(".arq__setas"); if (velho) velho.remove();
      var base = a.getBoundingClientRect();
      if (!base.width) return;
      var svg = document.createElementNS(NS, "svg");
      svg.setAttribute("class", "arq__setas"); svg.setAttribute("aria-hidden", "true");
      svg.setAttribute("viewBox", "0 0 " + base.width + " " + base.height);
      a.appendChild(svg);
      var nos = a.querySelectorAll(".arq__no");
      (a.dataset.ligacoes || "").split(",").forEach(function (par, i) {
        var ab = par.split("-");
        if (nos[+ab[0]] && nos[+ab[1]]) seta(svg, centro(nos[+ab[0]], base), centro(nos[+ab[1]], base), i % 2 ? -18 : 18, i);
      });
    });
  }
  var espera;
  addEventListener("resize", function () { clearTimeout(espera); espera = setTimeout(function () { montar(); ir(atual); }, 150); });
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(montar);
})();
