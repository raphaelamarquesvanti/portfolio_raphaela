/* Rapha Vanti · Portfólio — efeitos principais.
   Sem bibliotecas: tudo em JS puro para o site ficar leve.
   Quem pede menos movimento (sistema ou botão ◐) recebe a versão calma. */
(function () {
  "use strict";
  var raiz = document.documentElement;
  raiz.classList.add("js");

  var sistemaCalmo = matchMedia("(prefers-reduced-motion: reduce)");
  var temMouse = matchMedia("(hover: hover) and (pointer: fine)").matches;
  function calmo() { return sistemaCalmo.matches || raiz.classList.contains("calmo"); }

  /* ---------- preferência "Reduzir efeitos" (guardada só neste navegador) ---------- */
  var botaoCalmo = document.getElementById("reduzir");
  function lerPref() { try { return localStorage.getItem("rv-calmo") === "1"; } catch (e) { return false; } }
  function aplicarCalmo(on) {
    raiz.classList.toggle("calmo", on);
    if (botaoCalmo) botaoCalmo.setAttribute("aria-pressed", on ? "true" : "false");
    document.dispatchEvent(new CustomEvent("rv:calmo", { detail: on }));
  }
  aplicarCalmo(lerPref());
  if (botaoCalmo) botaoCalmo.addEventListener("click", function () {
    var on = !raiz.classList.contains("calmo");
    try { localStorage.setItem("rv-calmo", on ? "1" : "0"); } catch (e) {}
    aplicarCalmo(on);
  });

  /* ---------- abertura: terminal "compilando" o portfólio ---------- */
  var boot = document.getElementById("boot");
  var log = document.getElementById("boot-log");
  var linhasBoot = [
    ["$ ", "npm run build:portfolio", "t-info"],
    ["", "› carregando identidade visual ......... ok", "t-dim"],
    ["", "› conectando banco de projetos ......... ok", "t-dim"],
    ["", "✗ Error: bug encontrado em hero.tsx:42", "t-erro", "erro"],
    ["", "› aplicando correção ................... ok", "t-amar"],
    ["", "✓ 0 bugs · build concluído", "t-ok"],
    ["", "› bem-vinda(o). abrindo raphavanti ✦", "t-info"]
  ];
  function fecharBoot() {
    if (!raiz.classList.contains("com-boot")) return;
    try { sessionStorage.setItem("rv-boot", "1"); } catch (e) {}
    boot.classList.add("saindo");
    setTimeout(function () { raiz.classList.remove("com-boot"); }, 700);
  }
  if (raiz.classList.contains("com-boot") && boot && log) {
    document.getElementById("boot-pular").addEventListener("click", fecharBoot);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" || e.key === "Enter") fecharBoot(); }, { once: true });
    var li = 0;
    (function proxima() {
      if (li >= linhasBoot.length) { setTimeout(fecharBoot, 500); return; }
      var l = linhasBoot[li++];
      var span = document.createElement("span");
      span.className = l[2];
      span.textContent = l[0] + l[1] + "\n";
      log.appendChild(span);
      if (l[3] === "erro") { boot.classList.add("erro"); setTimeout(function () { boot.classList.remove("erro"); }, 700); }
      setTimeout(proxima, l[3] === "erro" ? 650 : 330);
    })();
  }

  /* ---------- aparecer na rolagem ---------- */
  var obs = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add("visivel"); obs.unobserve(en.target); }
    });
  }, { threshold: 0.18 });
  document.querySelectorAll(".revela").forEach(function (el) { obs.observe(el); });

  /* ---------- menu some ao descer, volta ao subir ---------- */
  var topo = document.getElementById("topo"), ultimoY = 0;
  addEventListener("scroll", function () {
    var y = scrollY;
    topo.classList.toggle("esconde", y > 300 && y > ultimoY);
    ultimoY = y;
  }, { passive: true });

  /* ---------- cursor próprio (só computador) ---------- */
  var cursor = document.querySelector(".cursor");
  var mx = innerWidth / 2, my = innerHeight / 2;
  if (temMouse && cursor) {
    var ponto = cursor.querySelector(".cursor__ponto"), anel = cursor.querySelector(".cursor__anel");
    var ax = mx, ay = my;
    raiz.classList.add("cursor-on");
    addEventListener("mousemove", function (e) { mx = e.clientX; my = e.clientY; ponto.style.transform = "translate(" + mx + "px," + my + "px) translate(-50%,-50%)"; }, { passive: true });
    (function seguir() {
      ax += (mx - ax) * 0.18; ay += (my - ay) * 0.18;
      anel.style.transform = "translate(" + ax + "px," + ay + "px) translate(-50%,-50%)";
      requestAnimationFrame(seguir);
    })();
    document.addEventListener("mouseover", function (e) {
      cursor.classList.toggle("ativo", !!e.target.closest("a, button, .fluxo__no, .caso"));
    });
  }

  /* ---------- botões magnéticos ---------- */
  if (temMouse) document.querySelectorAll(".magnetico").forEach(function (b) {
    b.addEventListener("mousemove", function (e) {
      if (calmo()) return;
      var r = b.getBoundingClientRect();
      b.style.setProperty("--bx", (e.clientX - r.left - r.width / 2) * 0.25 + "px");
      b.style.setProperty("--by", (e.clientY - r.top - r.height / 2) * 0.35 + "px");
    });
    b.addEventListener("mouseleave", function () { b.style.setProperty("--bx", "0px"); b.style.setProperty("--by", "0px"); });
  });

  /* ---------- hero: camadas em paralaxe com o mouse ---------- */
  var camadas = document.querySelectorAll(".hero__palco [data-prof]");
  if (temMouse) addEventListener("mousemove", function (e) {
    if (calmo() || scrollY > innerHeight) return;
    var dx = (e.clientX / innerWidth - 0.5) * 2, dy = (e.clientY / innerHeight - 0.5) * 2;
    camadas.forEach(function (c) {
      var p = parseFloat(c.dataset.prof) * 18;
      c.style.setProperty("--mx", (dx * p).toFixed(1) + "px");
      c.style.setProperty("--my", (dy * p).toFixed(1) + "px");
    });
  }, { passive: true });

  /* ---------- foto "bugando" de vez em quando ---------- */
  var foto = document.querySelector(".foto");
  function glitchFoto() {
    if (foto && !calmo() && !document.hidden) {
      foto.classList.add("glitchando");
      setTimeout(function () { foto.classList.remove("glitchando"); }, 500);
    }
    setTimeout(glitchFoto, 3500 + Math.random() * 4000);
  }
  setTimeout(glitchFoto, 2500);

  /* ---------- cards: luz que segue o mouse ---------- */
  document.querySelectorAll(".caso").forEach(function (c) {
    c.addEventListener("pointermove", function (e) {
      var r = c.getBoundingClientRect();
      c.style.setProperty("--lx", e.clientX - r.left + "px");
      c.style.setProperty("--ly", e.clientY - r.top + "px");
    });
  });

  /* ---------- setas desenhadas entre elementos reais ---------- */
  var NS = "http://www.w3.org/2000/svg";
  function centro(el, base) {
    var r = el.getBoundingClientRect();
    return { x: r.left - base.left + r.width / 2, y: r.top - base.top + r.height / 2, w: r.width / 2, h: r.height / 2 };
  }
  // ponto na borda do retângulo, na direção do outro centro
  function borda(c, alvo, folga) {
    var dx = alvo.x - c.x, dy = alvo.y - c.y;
    var s = Math.min(Math.abs(c.w / (dx || 1e-6)), Math.abs(c.h / (dy || 1e-6)));
    var len = Math.hypot(dx, dy) || 1;
    return { x: c.x + dx * s + (dx / len) * folga, y: c.y + dy * s + (dy / len) * folga };
  }
  function desenharSeta(svg, a, b, curva, atraso) {
    var p1 = borda(a, b, 8), p2 = borda(b, a, 10);
    var mxp = (p1.x + p2.x) / 2, myp = (p1.y + p2.y) / 2;
    var nx = -(p2.y - p1.y), ny = p2.x - p1.x, nl = Math.hypot(nx, ny) || 1;
    var cx = mxp + (nx / nl) * curva, cy = myp + (ny / nl) * curva;
    var path = document.createElementNS(NS, "path");
    path.setAttribute("d", "M" + p1.x + "," + p1.y + " Q" + cx + "," + cy + " " + p2.x + "," + p2.y);
    svg.appendChild(path);
    var len = path.getTotalLength();
    path.style.setProperty("--len", len);
    path.style.setProperty("--n", atraso);
    path.style.animationDelay = atraso * 0.3 + "s";
    // ponta da seta: triângulo na direção final da curva
    var ang = Math.atan2(p2.y - cy, p2.x - cx), t = 9;
    var ponta = document.createElementNS(NS, "path");
    ponta.setAttribute("class", "ponta");
    ponta.setAttribute("d", "M" + p2.x + "," + p2.y +
      " L" + (p2.x - t * Math.cos(ang - 0.45)) + "," + (p2.y - t * Math.sin(ang - 0.45)) +
      " L" + (p2.x - t * Math.cos(ang + 0.45)) + "," + (p2.y - t * Math.sin(ang + 0.45)) + "z");
    ponta.style.setProperty("--n", atraso);
    svg.appendChild(ponta);
    return path;
  }

  // diagramas dos projetos
  function montarFluxos() {
    document.querySelectorAll(".fluxo").forEach(function (f) {
      var velho = f.querySelector(".fluxo__setas"); if (velho) velho.remove();
      var base = f.getBoundingClientRect();
      var svg = document.createElementNS(NS, "svg");
      svg.setAttribute("class", "fluxo__setas");
      svg.setAttribute("aria-hidden", "true");
      svg.setAttribute("viewBox", "0 0 " + base.width + " " + base.height);
      f.appendChild(svg);
      var nos = f.querySelectorAll(".fluxo__no");
      var caminhos = [];
      (f.dataset.ligacoes || "").split(",").forEach(function (par, i) {
        var ab = par.split("-"), a = nos[+ab[0]], b = nos[+ab[1]];
        if (a && b) caminhos.push(desenharSeta(svg, centro(a, base), centro(b, base), i % 2 ? -22 : 22, i));
      });
      f._caminhos = caminhos;
    });
  }
  // pacote de dados que viaja pelas setas
  function animarPacotes(t) {
    if (!calmo()) document.querySelectorAll(".caso.visivel .fluxo").forEach(function (f) {
      var cs = f._caminhos, pac = f.querySelector(".fluxo__pacote");
      if (!cs || !cs.length || !pac) return;
      var ciclo = 1600, total = cs.length * ciclo;
      var k = (t % total) / ciclo, i = Math.floor(k), fr = k - i;
      var c = cs[i], pt = c.getPointAtLength(fr * c.getTotalLength());
      pac.style.transform = "translate(" + (pt.x - 5) + "px," + (pt.y - 5) + "px)";
    });
    requestAnimationFrame(animarPacotes);
  }

  // processo "Como eu construo": setas entre as etapas
  function montarObra() {
    var obra = document.getElementById("obra"); if (!obra) return;
    var svg = obra.querySelector(".obra__setas");
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    var base = obra.getBoundingClientRect();
    svg.setAttribute("viewBox", "0 0 " + base.width + " " + base.height);
    var etapas = obra.querySelectorAll(".obra__etapa");
    etapas.forEach(function (e, i) { e.style.setProperty("--n", i); });
    for (var i = 0; i < etapas.length - 1; i++) {
      var a = centro(etapas[i], base), b = centro(etapas[i + 1], base);
      if (Math.abs(a.y - b.y) < 20) desenharSeta(svg, a, b, -14, i + 1);
      else desenharCotovelo(svg, a, b, i + 1);   // troca de linha: desce, atravessa e desce
    }
  }
  // seta em "L" para passar pelo vão entre as linhas, sem cruzar os cards
  function desenharCotovelo(svg, a, b, atraso) {
    var x1 = a.x, y1 = a.y + a.h + 8, x2 = b.x, y2 = b.y - b.h - 12;
    var gy = y1 + (y2 - y1) * 0.28, r = 12, dir = x2 < x1 ? -1 : 1;
    if (Math.abs(x2 - x1) < 2 * r) { x2 = x1; }
    var d = x2 === x1 ? "M" + x1 + "," + y1 + " L" + x2 + "," + y2 :
      "M" + x1 + "," + y1 + " L" + x1 + "," + (gy - r) + " Q" + x1 + "," + gy + " " + (x1 + dir * r) + "," + gy +
      " L" + (x2 - dir * r) + "," + gy + " Q" + x2 + "," + gy + " " + x2 + "," + (gy + r) + " L" + x2 + "," + y2;
    var path = document.createElementNS(NS, "path");
    path.setAttribute("d", d); svg.appendChild(path);
    path.style.setProperty("--len", path.getTotalLength()); path.style.setProperty("--n", atraso);
    var ponta = document.createElementNS(NS, "path"), t = 9;
    ponta.setAttribute("class", "ponta");
    ponta.setAttribute("d", "M" + x2 + "," + (y2 + 2) + " L" + (x2 - t * 0.45) + "," + (y2 - t) + " L" + (x2 + t * 0.45) + "," + (y2 - t) + "z");
    ponta.style.setProperty("--n", atraso); svg.appendChild(ponta);
  }
  var obraEl = document.getElementById("obra");
  if (obraEl) new IntersectionObserver(function (en, o) {
    if (en[0].isIntersecting) { obraEl.classList.add("montada"); o.disconnect(); }
  }, { threshold: 0.25 }).observe(obraEl);

  function montarTudo() { montarFluxos(); montarObra(); }
  var espera;
  addEventListener("resize", function () { clearTimeout(espera); espera = setTimeout(montarTudo, 150); });
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(function () { montarTudo(); requestAnimationFrame(animarPacotes); });

  /* ---------- terminal da seção Bugs ---------- */
  var term = document.getElementById("terminal");
  var roteiro = [
    ["t-dim", "$ npm test"],
    ["", ""],
    ["t-info", " RUN  seguranca.test.ts"],
    ["t-erro", " ✗ consultor vê vagas de outro consultor"],
    ["t-erro", " ✗ campo sigiloso alterado sem aprovação"],
    ["t-amar", "   → corrigindo: política RLS por consultor"],
    ["t-amar", "   → corrigindo: aprovação do admin obrigatória"],
    ["", ""],
    ["t-dim", "$ npm test"],
    ["t-ok", " ✓ consultor vê só as próprias vagas"],
    ["t-ok", " ✓ campo sigiloso exige aprovação"],
    ["t-ok", " ✓ visitante não lê dados privados"],
    ["", ""],
    ["t-ok", " Tests: 3 passed · 0 bugs"]
  ];
  if (term) {
    var rodou = false;
    new IntersectionObserver(function (en, o) {
      if (!en[0].isIntersecting || rodou) return;
      rodou = true; o.disconnect();
      if (calmo()) {
        term.innerHTML = roteiro.map(function (r) { return '<span class="' + r[0] + '">' + r[1] + "</span>"; }).join("\n");
        return;
      }
      var i = 0, c = 0, atual = null;
      var cur = document.createElement("span"); cur.className = "cursor-t"; term.appendChild(cur);
      (function digita() {
        if (i >= roteiro.length) return;
        var r = roteiro[i];
        if (!atual) { atual = document.createElement("span"); atual.className = r[0]; term.insertBefore(atual, cur); }
        if (c < r[1].length) {
          atual.textContent += r[1].charAt(c++);
          setTimeout(digita, r[0] === "t-dim" ? 45 : 14);
        } else {
          term.insertBefore(document.createTextNode("\n"), cur);
          if (r[0] === "t-erro") { raiz.classList.add("tremendo"); setTimeout(function () { raiz.classList.remove("tremendo"); }, 320); }
          i++; c = 0; atual = null;
          setTimeout(digita, r[1] === "" ? 260 : 380);
        }
      })();
    }, { threshold: 0.4 }).observe(term);
  }

  /* ---------- links de contato ainda sem endereço ---------- */
  document.querySelectorAll("[data-preencher]").forEach(function (a) {
    a.title = a.dataset.preencher + ": endereço ainda não cadastrado";
    a.addEventListener("click", function (e) { e.preventDefault(); });
  });
  var ano = document.getElementById("ano"); if (ano) ano.textContent = "© " + new Date().getFullYear();
})();
