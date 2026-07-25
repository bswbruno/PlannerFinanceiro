const CACHE_NAME = "planner-financeiro-v4";

// Caminhos relativos à raiz do projeto (onde este arquivo vive)
const arquivos = [
  "index.html",
  "css/style.css",
  "css/styleMobile.css",
  "js/script.js",
  "manifest.json",
  "assets/icon-192.png",
  "assets/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // adiciona um por um: se um arquivo falhar, os demais continuam sendo cacheados
      return Promise.all(
        arquivos.map((arquivo) =>
          cache.add(arquivo).catch((erro) => {
            console.warn("Não foi possível cachear:", arquivo, erro);
          })
        )
      );
    })
  );
  // NÃO chama skipWaiting() aqui de propósito: assim, se já existir uma versão
  // ativa controlando a página, esta nova versão fica em "waiting" até a
  // pessoa clicar em "Atualizar agora" no banner (ver mensagem SKIP_WAITING
  // abaixo). Isso evita trocar o app debaixo do usuário sem avisar.
});

self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((chaves) =>
      Promise.all(
        chaves
          .filter((chave) => chave !== CACHE_NAME)
          .map((chave) => caches.delete(chave))
      )
    )
  );
  self.clients.claim();
});

// ESTRATÉGIA: network-first (tenta a rede primeiro, cache é só um plano B offline).
// Assim, toda vez que você atualiza o CSS/JS/HTML e publica, o app já mostra a
// versão nova na próxima abertura com internet — sem precisar limpar cache
// manualmente. Se estiver offline, cai para a última versão salva.
self.addEventListener("fetch", (event) => {
  // apenas GET pode ser cacheado com segurança
  if (event.request.method !== "GET") return;

  // recursos de fora do próprio site (ex: CDN do Chart.js, Google Fonts)
  // continuam podendo vir do cache normalmente, sem forçar rede
  const mesmaOrigem = event.request.url.startsWith(self.location.origin);

  if (!mesmaOrigem) {
    event.respondWith(
      caches.match(event.request).then((resposta) => resposta || fetch(event.request))
    );
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((respostaRede) => {
        if (respostaRede && respostaRede.ok) {
          const copia = respostaRede.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copia));
        }
        return respostaRede;
      })
      .catch(() =>
        caches.match(event.request).then((resposta) => resposta || caches.match("index.html"))
      )
  );
});
