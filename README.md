# Nicholas Dieter

Site estático para oficinas, laboratórios e campanhas de Nicholas Dieter.

## Estrutura

- `index.html`: página principal com lista de oficinas, registros, FAQ e sobre.
- `oficinas/subpersonalidades/index.html`: URL limpa da oficina Subpersonalidades.
- `oficina.html?slug=subpersonalidades`: rota dinâmica de fallback para oficinas.
- `admin.html`: pagina desativada para impedir edicao pelo front em producao.
- `workshop-data.js`: dados editáveis, traduções em PT/ES/EN e configurações globais.
- `script.js`: renderização da home.
- `oficina.js`: renderização das páginas de oficina e inscrição via WhatsApp.
- `admin.js`: trava qualquer painel antigo carregado em cache.
- `styles.css`: identidade visual e responsividade.

## Atualizacoes

O site nao deixa edicao ativa no front. Mudancas de conteudo devem ser feitas diretamente nos arquivos versionados, principalmente `workshop-data.js` e `published-data.js`, antes do deploy.

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
