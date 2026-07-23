# Nicholas Dieter

Site estático para oficinas, laboratórios e campanhas de Nicholas Dieter.

## Estrutura

- `index.html`: página principal com lista de oficinas, registros, FAQ e sobre.
- `oficinas/subpersonalidades/index.html`: URL limpa da oficina Subpersonalidades.
- `oficina.html?slug=subpersonalidades`: rota dinâmica de fallback para oficinas.
- `admin.html`: cadastro local com login, oficinas, idiomas, turmas, investimento, programa e FAQ.
- `workshop-data.js`: dados editáveis, traduções em PT/ES/EN e configurações globais.
- `script.js`: renderização da home.
- `oficina.js`: renderização das páginas de oficina e inscrição via WhatsApp.
- `admin.js`: CRUD do painel, uploads e publicacao via API do Worker.
- `worker.js`: login do admin, sessao e publicacao server-side no GitHub.
- `wrangler.jsonc`: configuracao do Cloudflare Worker com assets estaticos.
- `styles.css`: identidade visual e responsividade.

## Admin e publicacao

O admin fica disponivel pelo front em `admin.html`, mas a sessao e a publicacao rodam pelo Cloudflare Worker:

- usuario padrao: `admin`
- senha padrao: `123`

Para publicar sem expor token no navegador, configure `GITHUB_TOKEN` como segredo do Worker no Cloudflare em Settings > Variables & Secrets. Nao use Build > Variables and secrets para esse token, porque variaveis de build nao ficam disponiveis em runtime. Opcionalmente configure `ADMIN_USER`, `ADMIN_PASSWORD`, `SESSION_SECRET`, `GITHUB_BRANCH` e `GITHUB_MIRROR_BRANCHES`. Por padrao, a publicacao commita em `main`, que tambem e a branch de producao no Cloudflare.

Depois do login, o cadastro salva no `localStorage` do navegador e o botao Salvar no servidor publica `published-data.js` e uploads de imagem pelo Worker. O admin tambem mantem exportacao manual como fallback.

Cada oficina precisa de:

- `slug`, título, selo, chamada e descrição curta.
- imagens de card/principal e galeria.
- idiomas da oficina em português, espanhol e inglês.
- próximas turmas, carga horária, local/formato e status.
- investimento e observações.
- coordenação.
- conteúdo programático por módulos e itens.
- FAQ por perguntas e respostas.

## Campanhas

A URL limpa atual é `oficinas/subpersonalidades/`. Oficinas sem pasta própria usam automaticamente a rota dinâmica `oficina.html?slug=nome-da-oficina`, para que novos cadastros não gerem links quebrados antes da criação de uma pasta limpa.
