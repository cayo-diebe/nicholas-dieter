(function () {
  document.body.dataset.page = "admin-disabled";

  const shells = document.querySelectorAll("#admin-login, #admin-app, .admin-mobile-gate");
  shells.forEach((element) => {
    element.hidden = true;
  });

  const fallback = document.createElement("main");
  fallback.className = "admin-disabled";
  fallback.innerHTML = `
    <p class="eyebrow">Admin</p>
    <h1>Edicao pelo front desativada</h1>
    <p>As atualizacoes do site agora sao feitas diretamente nos arquivos do projeto e entram no ar no proximo deploy.</p>
    <a class="button button--primary" href="index.html">Voltar ao site</a>
  `;

  document.body.appendChild(fallback);
})();
