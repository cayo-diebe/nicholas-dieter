# Nicholas Dieter

Site estático para oficinas, laboratórios e campanhas de Nicholas Dieter.

## Estrutura

- `index.html`: página principal com lista de oficinas, registros, FAQ e sobre.
- `oficinas/subpersonalidades/index.html`: URL limpa da oficina Subpersonalidades.
- `oficina.html?slug=subpersonalidades`: rota dinâmica de fallback para oficinas.
- `admin.html`: cadastro local de oficinas, turmas, investimento, programa e FAQ.
- `workshop-data.js`: dados editáveis, traduções em PT/ES/EN e configurações globais.
- `script.js`: renderização da home.
- `oficina.js`: renderização das páginas de oficina e inscrição via WhatsApp.
- `admin.js`: CRUD local e exportação de JSON.
- `styles.css`: identidade visual e responsividade.

## Admin

O admin salva no `localStorage` do navegador e exporta o JSON final. Como o projeto é estático, novos cadastros só entram em produção quando o JSON exportado for levado para `workshop-data.js` e publicado no GitHub.

Cada oficina precisa de:

- `slug`, título, selo, chamada e descrição curta.
- imagens de card/principal e galeria.
- próximas turmas, carga horária, local/formato e status.
- investimento e observações.
- coordenação.
- conteúdo programático em JSON.
- FAQ em JSON.

## Campanhas

A URL limpa atual é `oficinas/subpersonalidades/`. A rota dinâmica `oficina.html?slug=subpersonalidades` continua disponível para testes e novos cadastros antes da criação de uma pasta limpa.
