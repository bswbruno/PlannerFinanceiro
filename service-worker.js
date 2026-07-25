const CACHE_NAME = "planner-financeiro-v2";

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
  self.skipWaiting();
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

self.addEventListener("fetch", (event) => {
  // apenas GET pode ser cacheado com segurança
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((resposta) => {
      if (resposta) return resposta;

      return fetch(event.request)
        .then((respostaRede) => {
          // guarda uma cópia no cache para uso offline futuro (apenas arquivos do próprio site)
          if (
            respostaRede &&
            respostaRede.ok &&
            event.request.url.startsWith(self.location.origin)
          ) {
            const copia = respostaRede.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copia));
          }
          return respostaRede;
        })
        .catch(() => caches.match("index.html"));
    })
  );
});
