# Rapha Vanti · Portfólio

Portfólio de **Raphaela Vanti**, desenvolvedora full stack e engenheira de dados.
Site estático (HTML, CSS e JavaScript puro, sem build): abre rápido e publica em qualquer hospedagem.

## Ver no computador (VS Code)

```powershell
cd C:\Users\raphs\Projetos\portfolio-rapha-vanti
npm run dev
```

Abre em http://localhost:3002. Ou instale a extensão **Live Server** no VS Code e clique em *Go Live*.

## Onde mudar

| O quê | Onde |
|---|---|
| Textos, projetos e contatos | `index.html` (procure por `[PREENCHER]`) |
| Cores, fontes e efeitos visuais | `css/estilos.css` (cores no topo, em `:root`) |
| Abertura, cursor, setas, terminal | `js/main.js` |
| Bugs que andam pela página | `js/bugs.js` |
| Logos e fotos | `assets/brand/` |

### Trocar ou adicionar fotos
Salve a foto em `assets/brand/` (de preferência `.webp` ou `.jpg`, até ~900 px de largura)
e troque o nome do arquivo no `index.html` (hero: `.foto`; Sobre: `.polaroid`).

### Diagramas de arquitetura (setas)
Cada projeto tem caixinhas `.fluxo__no` (posição em `--x` e `--y`) e o atributo
`data-ligacoes="0-1,1-2"` no `<figure class="fluxo">`, que diz quais caixas ligar com seta
(a contagem começa em 0). As setas são desenhadas sozinhas pelo `js/main.js`.

## Efeitos
- Abertura: terminal "compilando" o portfólio, com um bug que é corrigido (aparece uma vez por visita; botão **Pular**).
- Fundo em camadas: aurora, grade, retícula, ruído e linhas de varredura.
- Hero em camadas com paralaxe do mouse, foto que "buga", selo giratório, fitas e adesivos.
- Títulos com glitch (separação de cor) e texto vazado que preenche no hover.
- Diagramas de arquitetura com setas que se desenham e um "pacote de dados" percorrendo o caminho.
- "Como eu construo": etapas que se montam com setas.
- Bugs que andam pela tela: clique para esmagar; o contador fica no menu.
- **Acessibilidade:** quem ativa "reduzir movimento" no aparelho, ou o botão ◐ no menu, vê tudo sem animação. Sem JavaScript, todo o conteúdo aparece.
- **LGPD:** sem cookies, sem Google Fonts (fontes em `assets/fonts`, licenças OFL e Apache 2.0), sem rastreadores.

## Publicar
Qualquer hospedagem de site estático: Vercel, Netlify ou GitHub Pages
(no GitHub: *Settings → Pages → Deploy from branch → main / root*).

## Próximos passos
- [ ] Preencher e-mail, WhatsApp, LinkedIn e formação (`[PREENCHER]` no `index.html`).
- [ ] Mais 3 a 5 fotos (trabalho, tela com código, retrato) para o hero e as polaroids.
- [ ] Confirmar autorização para citar o projeto Reporte de Vagas (sistema de cliente).
- [ ] Fase seguinte do plano: migrar para Next.js + Supabase, com projetos lidos do banco.
