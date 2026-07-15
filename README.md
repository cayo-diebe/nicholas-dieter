# Nicholas Dieter Landing Page

Landing page estática para Nicholas Dieter, com foco em laboratórios de teatro, cinema, pesquisa e formação artística.

## Como editar

- Troque o link de aulas em vídeo na constante `VIMEO_AULAS_URL`, em `script.js`.
- Ajuste a velocidade automática do carrossel em `CAROUSEL_AUTOPLAY_INTERVAL_MS`, em `script.js`.
- Troque telefone e mensagem do WhatsApp nas constantes `WHATSAPP_PHONE` e `workshops`, em `script.js`.
- Adicione novas oficinas no array `workshops`, em `script.js`.
- Atualize as imagens do carrossel no array `galleryImages`, em `script.js`, usando arquivos dentro de `assets/`.
- Use apenas registros de oficina em `galleryImages`; cartazes e imagens de marca ficam melhor no hero ou na seção de oficina.
- A tipografia usa Google Fonts (`Instrument Serif` e `Familjen Grotesk`) com fallbacks locais no CSS.

## Arquivos principais

- `index.html`: estrutura semântica da página.
- `styles.css`: identidade visual, responsividade e estados de interação.
- `script.js`: dados editáveis, WhatsApp e carrossel.
- `assets/`: imagens locais usadas no hero, oficina e marca.
