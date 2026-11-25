/* Bugs que andam pela página. Clique para esmagar.
   Desligados quando o visitante pede menos movimento. */
(function () {
  "use strict";
  var raiz = document.documentElement;
  var contador = document.getElementById("contador-bugs");
  var sistemaCalmo = matchMedia("(prefers-reduced-motion: reduce)");
  function calmo() { return sistemaCalmo.matches || raiz.classList.contains("calmo"); }

  var SVG_BUG = '<svg viewBox="0 0 24 24" aria-hidden="true"><use href="#ic-bug"/></svg>';
  var MAX = 8, vivos = [], total = 0, rodando = false;

  function criar(x, y) {
    if (calmo() || vivos.length >= MAX) return;
    var el = document.createElement("button");
    el.type = "button";
    el.className = "bicho";
    el.setAttribute("aria-label", "Esmagar bug");
    el.innerHTML = SVG_BUG;
    document.body.appendChild(el);
    var b = {
      el: el,
      x: x != null ? x : (Math.random() < 0.5 ? -30 : innerWidth + 30),
      y: y != null ? y : 120 + Math.random() * (innerHeight - 240),
      ang: Math.random() * Math.PI * 2,
      vel: 1.1 + Math.random() * 1.2,
      pausa: 0
    };
    if (x == null) b.ang = b.x < 0 ? (Math.random() - 0.5) : Math.PI + (Math.random() - 0.5);
    el.addEventListener("click", function (e) { e.stopPropagation(); esmagar(b); });
    vivos.push(b);
    if (!rodando) { rodando = true; requestAnimationFrame(passo); }
  }

  function esmagar(b) {
    var i = vivos.indexOf(b); if (i < 0) return;
    vivos.splice(i, 1);
    b.el.classList.add("morto");
    b.el.style.transition = "transform .25s, opacity .4s";
    b.el.style.transform = "translate(" + b.x + "px," + b.y + "px) scale(1.6,.3)";
    b.el.style.opacity = "0";
    setTimeout(function () { b.el.remove(); }, 450);
    // fragmentos
    for (var k = 0; k < 8; k++) {
      var s = document.createElement("i");
      s.className = "estilhaco";
      s.style.left = b.x + 15 + "px"; s.style.top = b.y + 15 + "px";
      document.body.appendChild(s);
      var a = (k / 8) * Math.PI * 2, d = 24 + Math.random() * 20;
      s.animate([{ transform: "translate(0,0)", opacity: 1 }, { transform: "translate(" + Math.cos(a) * d + "px," + Math.sin(a) * d + "px)", opacity: 0 }], { duration: 500, easing: "ease-out" });
      setTimeout(s.remove.bind(s), 520);
    }
    var tag = document.createElement("span");
    tag.className = "esmagado";
    tag.textContent = "✓ bug corrigido";
    tag.style.left = b.x - 20 + "px"; tag.style.top = b.y - 8 + "px";
    document.body.appendChild(tag);
    setTimeout(function () { tag.remove(); }, 1000);
    total++;
    if (contador) {
      contador.textContent = total;
      var caixa = contador.parentNode;
      caixa.classList.remove("pulo"); void caixa.offsetWidth; caixa.classList.add("pulo");
    }
  }

  function passo() {
    if (calmo()) {
      vivos.forEach(function (b) { b.el.remove(); }); vivos = [];
    }
    if (!vivos.length) { rodando = false; return; }
    vivos.forEach(function (b) {
      if (b.pausa > 0) { b.pausa--; return; }
      if (Math.random() < 0.006) b.pausa = 30 + Math.random() * 60;        // para e "pensa"
      b.ang += (Math.random() - 0.5) * 0.25;                                // anda meio torto
      // fica dentro da tela
      if (b.x < 10) b.ang = 0 + (Math.random() - 0.5);
      if (b.x > innerWidth - 44) b.ang = Math.PI + (Math.random() - 0.5);
      if (b.y < 90) b.ang = Math.PI / 2 + (Math.random() - 0.5);
      if (b.y > innerHeight - 44) b.ang = -Math.PI / 2 + (Math.random() - 0.5);
      // foge um pouco do cursor
      var cx = window.__rvMouseX, cy = window.__rvMouseY;
      if (cx != null) {
        var dx = b.x + 17 - cx, dy = b.y + 17 - cy, d = Math.hypot(dx, dy);
        if (d < 90) { b.ang = Math.atan2(dy, dx); b.x += dx / d * 2.2; b.y += dy / d * 2.2; }
      }
      b.x += Math.cos(b.ang) * b.vel;
      b.y += Math.sin(b.ang) * b.vel;
      b.el.style.transform = "translate3d(" + b.x + "px," + b.y + "px,0) rotate(" + (b.ang + Math.PI / 2) + "rad)";
    });
    requestAnimationFrame(passo);
  }

  addEventListener("mousemove", function (e) { window.__rvMouseX = e.clientX; window.__rvMouseY = e.clientY; }, { passive: true });

  var soltar = document.getElementById("soltar-bugs");
  if (soltar) soltar.addEventListener("click", function () {
    if (calmo()) { soltar.textContent = "Efeitos reduzidos ligados"; return; }
    var r = soltar.getBoundingClientRect();
    for (var i = 0; i < 5; i++) criar(r.left + r.width / 2 - 17, r.top - 10);
    vivos.slice(-5).forEach(function (b, i) { b.ang = -Math.PI / 2 + (i - 2) * 0.5; b.vel = 2.2; });
  });

  // um bug aparece sozinho de vez em quando
  function aparecer() {
    if (!document.hidden && vivos.length < 2 && !raiz.classList.contains("com-boot")) criar();
    setTimeout(aparecer, 14000 + Math.random() * 12000);
  }
  setTimeout(aparecer, 7000);
})();
